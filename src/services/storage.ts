import {
  UserProfile,
  Product,
  Sale,
  SaleItem,
  SyncOperation,
  SyncEntityType,
  UserLessonProgress,
  UserLearningState,
  ModuleQuizResult,
  UserCertificate,
  PaymentBreakdown,
  DeliveryType
} from '../types';
import { DEMO_PROFILES, INITIAL_DEMO_PRODUCTS, INITIAL_DEMO_SALES } from '../data/mockProfiles';
import { ACADEMY_MODULES } from '../data/academyModulesData';
import { idbService, AuthCredentialRecord } from './indexedDB';
import { db, auth, handleFirestoreError, OperationType } from './firebase';
import {
  doc,
  setDoc,
  getDoc,
  getDocs,
  collection,
  query,
  where,
  deleteDoc
} from 'firebase/firestore';
import {
  createUserWithEmailAndPassword,
  signInWithEmailAndPassword,
  signOut as firebaseSignOut
} from 'firebase/auth';
import {
  deriveFirebaseAuthPassword,
  hashPin,
  generateSalt
} from '../utils/crypto';

// Polyfill localStorage if running in headless node/test environment
if (typeof globalThis.localStorage === 'undefined') {
  const memoryStore = new Map<string, string>();
  globalThis.localStorage = {
    getItem: (key: string) => memoryStore.get(key) || null,
    setItem: (key: string, value: string) => { memoryStore.set(key, String(value)); },
    removeItem: (key: string) => { memoryStore.delete(key); },
    clear: () => { memoryStore.clear(); },
    key: (i: number) => Array.from(memoryStore.keys())[i] || null,
    length: 0
  } as Storage;
}

const STORAGE_KEYS = {
  USERS: 'mujer_emprendedora_users',
  CURRENT_USER_ID: 'mujer_emprendedora_current_user_id',
  PRODUCTS: 'mujer_emprendedora_products',
  SALES: 'mujer_emprendedora_sales',
  SYNC_QUEUE: 'mujer_emprendedora_sync_queue',
  LESSON_PROGRESS: 'mujer_emprendedora_lessons',
  LEARNING_STATES: 'mujer_emprendedora_learning_states_v2',
  IS_ONLINE: 'mujer_emprendedora_is_online',
  MANUAL_OFFLINE_OVERRIDE: 'mujer_emprendedora_manual_offline',
  LAST_SYNC_TIMESTAMP: 'mujer_emprendedora_last_sync_timestamp',
  LAST_SYNC_ERROR: 'mujer_emprendedora_last_sync_error',
  INITIALIZED: 'mujer_emprendedora_initialized_v3'
};

// Generate UUID v4
export function generateUUID(): string {
  if (typeof crypto !== 'undefined' && crypto.randomUUID) {
    return crypto.randomUUID();
  }
  return 'xxxxxxxx-xxxx-4xxx-yxxx-xxxxxxxxxxxx'.replace(/[xy]/g, function (c) {
    const r = (Math.random() * 16) | 0;
    const v = c === 'x' ? r : (r & 0x3) | 0x8;
    return v.toString(16);
  });
}

// Format COP currency
export function formatCOP(amount: number): string {
  return new Intl.NumberFormat('es-CO', {
    style: 'currency',
    currency: 'COP',
    maximumFractionDigits: 0
  }).format(amount);
}

// Sanitize objects for Firestore to avoid "Unsupported field value: undefined" errors
export function sanitizeForFirestore<T extends Record<string, any>>(data: T): Record<string, any> {
  const result: Record<string, any> = {};
  for (const [key, value] of Object.entries(data)) {
    if (value !== undefined) {
      if (value !== null && typeof value === 'object' && !Array.isArray(value) && !(value instanceof Date)) {
        result[key] = sanitizeForFirestore(value);
      } else {
        result[key] = value;
      }
    }
  }
  return result;
}

export type GlobalConnectionState = 'ONLINE' | 'OFFLINE_AIRPLANE' | 'SYNCING' | 'SYNCED' | 'ERROR';

class AppStorageService {
  private listeners: Set<() => void> = new Set();
  private syncInProgress = false;
  private isInitialized = false;

  constructor() {
    this.initDatabase();
    this.setupNetworkListeners();
  }

  public subscribe(listener: () => void) {
    this.listeners.add(listener);
    return () => {
      this.listeners.delete(listener);
    };
  }

  public notify() {
    this.listeners.forEach((fn) => fn());
  }

  private setupNetworkListeners() {
    if (typeof window !== 'undefined') {
      window.addEventListener('online', () => {
        const manualOffline = localStorage.getItem(STORAGE_KEYS.MANUAL_OFFLINE_OVERRIDE) === 'true';
        if (!manualOffline) {
          localStorage.setItem(STORAGE_KEYS.IS_ONLINE, 'true');
          this.notify();
          this.processSyncQueue();
        }
      });

      window.addEventListener('offline', () => {
        localStorage.setItem(STORAGE_KEYS.IS_ONLINE, 'false');
        this.notify();
      });
    }
  }

  private async initDatabase() {
    const initialized = localStorage.getItem(STORAGE_KEYS.INITIALIZED);
    if (!initialized) {
      await this.resetToDefaults();
    } else {
      // Warm up IndexedDB cache from local storage if available
      try {
        const users = this.getAllUsers();
        await idbService.putBatch('users', users);
      } catch (err) {
        console.warn('IDB cache warmup warning:', err);
      }
    }
    this.isInitialized = true;
    this.notify();
  }

  public async resetToDefaults() {
    localStorage.setItem(STORAGE_KEYS.USERS, JSON.stringify(DEMO_PROFILES));
    localStorage.setItem(STORAGE_KEYS.CURRENT_USER_ID, DEMO_PROFILES[0].id);
    localStorage.setItem(STORAGE_KEYS.PRODUCTS, JSON.stringify(INITIAL_DEMO_PRODUCTS));
    localStorage.setItem(STORAGE_KEYS.SALES, JSON.stringify(INITIAL_DEMO_SALES));
    localStorage.setItem(STORAGE_KEYS.SYNC_QUEUE, JSON.stringify([]));

    // Seed default credentials for demo profiles (Default PIN: 1234)
    for (const demo of DEMO_PROFILES) {
      const salt = generateSalt();
      const pHash = await hashPin('1234', salt);
      const cleanPhone = demo.phone.replace(/\D/g, '');
      const credRecord: AuthCredentialRecord = {
        identifier: cleanPhone || demo.id,
        phone: demo.phone,
        userId: demo.id,
        pinSalt: salt,
        pinHash: pHash,
        failedAttempts: 0,
        lockoutUntil: 0
      };
      await idbService.put('auth_credentials', credRecord);
    }

    // Seed learning state for Doña Rosalba
    const rosalbaState: UserLearningState = {
      userId: DEMO_PROFILES[0].id,
      completedLessonIds: ['les-1-1', 'les-1-2', 'les-2-1', 'les-3-1'],
      lastVisitedModuleId: 'mod-1-admin',
      lastVisitedLessonId: 'les-1-2',
      quizResults: {
        'mod-1-admin': {
          moduleId: 'mod-1-admin',
          scorePercent: 100,
          passed: true,
          completedAt: Date.now() - 86400000 * 2,
          answers: { 'q1-1': 1, 'q1-2': 1 }
        }
      },
      certificates: [
        {
          id: 'cert-rosalba-mod1',
          userId: DEMO_PROFILES[0].id,
          userName: DEMO_PROFILES[0].name,
          businessName: DEMO_PROFILES[0].businessName,
          location: DEMO_PROFILES[0].location,
          moduleId: 'mod-1-admin',
          moduleTitle: 'Administración y Organización del Emprendimiento',
          issuedDate: Date.now() - 86400000 * 2,
          scorePercent: 100,
          verificationCode: 'ME-PALMIRA-2024-ROSA-01'
        }
      ],
      downloadedModuleIds: ['mod-1-admin', 'mod-2-inventarios', 'mod-3-costos'],
      lastUpdated: Date.now()
    };

    const initialLearningStates: Record<string, UserLearningState> = {
      [DEMO_PROFILES[0].id]: rosalbaState
    };

    localStorage.setItem(STORAGE_KEYS.LEARNING_STATES, JSON.stringify(initialLearningStates));
    localStorage.setItem(STORAGE_KEYS.IS_ONLINE, 'true');
    localStorage.setItem(STORAGE_KEYS.MANUAL_OFFLINE_OVERRIDE, 'false');
    localStorage.setItem(STORAGE_KEYS.LAST_SYNC_TIMESTAMP, String(Date.now() - 1000 * 60 * 15));
    localStorage.removeItem(STORAGE_KEYS.LAST_SYNC_ERROR);
    localStorage.setItem(STORAGE_KEYS.INITIALIZED, 'true');

    // Also populate IndexedDB
    await idbService.putBatch('users', DEMO_PROFILES);
    await idbService.putBatch('products', INITIAL_DEMO_PRODUCTS);
    await idbService.putBatch('sales', INITIAL_DEMO_SALES);
    await idbService.put('learning_states', rosalbaState);

    this.notify();
  }

  // --- Network Connection State & WorkManager Triggers ---
  public isOnline(): boolean {
    const manualOffline = localStorage.getItem(STORAGE_KEYS.MANUAL_OFFLINE_OVERRIDE) === 'true';
    if (manualOffline) return false;
    const isOnlineVal = localStorage.getItem(STORAGE_KEYS.IS_ONLINE);
    return isOnlineVal !== 'false';
  }

  public setOnlineStatus(online: boolean) {
    if (!online) {
      localStorage.setItem(STORAGE_KEYS.MANUAL_OFFLINE_OVERRIDE, 'true');
      localStorage.setItem(STORAGE_KEYS.IS_ONLINE, 'false');
    } else {
      localStorage.setItem(STORAGE_KEYS.MANUAL_OFFLINE_OVERRIDE, 'false');
      localStorage.setItem(STORAGE_KEYS.IS_ONLINE, 'true');
    }
    this.notify();
    if (online) {
      this.processSyncQueue();
    }
  }

  public getLastSyncTimestamp(): number | null {
    const ts = localStorage.getItem(STORAGE_KEYS.LAST_SYNC_TIMESTAMP);
    return ts ? Number(ts) : null;
  }

  public getLastSyncError(): string | null {
    return localStorage.getItem(STORAGE_KEYS.LAST_SYNC_ERROR);
  }

  public getGlobalConnectionStatus(): GlobalConnectionState {
    if (this.syncInProgress) return 'SYNCING';
    if (!this.isOnline()) return 'OFFLINE_AIRPLANE';
    if (this.getLastSyncError()) return 'ERROR';
    if (this.getPendingSyncCount() === 0) return 'SYNCED';
    return 'ONLINE';
  }

  // --- Multi-User Authentication & PIN Security ---

  public isAuthenticated(): boolean {
    const currentId = localStorage.getItem(STORAGE_KEYS.CURRENT_USER_ID);
    return !!currentId;
  }

  public async getLockoutStatus(identifier: string): Promise<{ isLocked: boolean; remainingSeconds: number }> {
    const cleanId = identifier.replace(/\D/g, '') || identifier.toLowerCase().trim();
    const cred = await idbService.get<AuthCredentialRecord>('auth_credentials', cleanId);
    if (!cred || !cred.lockoutUntil) return { isLocked: false, remainingSeconds: 0 };

    const now = Date.now();
    if (now < cred.lockoutUntil) {
      const remaining = Math.ceil((cred.lockoutUntil - now) / 1000);
      return { isLocked: true, remainingSeconds: remaining };
    }
    return { isLocked: false, remainingSeconds: 0 };
  }

  /**
   * Logs in an entrepreneur using phone number/identifier + 4-digit PIN.
   * Direct Cloud Firestore lookup enables recovery from any browser or incognito window.
   * Includes rate limiting (max 5 failed attempts -> 30s lockout) and offline caching.
   */
  public async loginWithPin(
    identifier: string,
    pin: string
  ): Promise<{ success: boolean; error?: string; lockoutSeconds?: number; user?: UserProfile }> {
    const cleanPhone = identifier.replace(/\D/g, '');
    const cleanId = cleanPhone || identifier.toLowerCase().trim();

    if (!cleanId) {
      return { success: false, error: 'Por favor ingresa tu número de celular o usuario.' };
    }
    if (!pin || pin.length !== 4) {
      return { success: false, error: 'El PIN personal debe tener exactamente 4 dígitos.' };
    }

    let matchingUser: UserProfile | undefined = undefined;

    // 1. ONLINE CLOUD LOOKUP: Query Cloud Firestore directly!
    if (this.isOnline()) {
      try {
        const targetDocId = cleanPhone ? `emp_${cleanPhone}` : cleanId;
        const userDocRef = doc(db, 'users', targetDocId);
        const userSnap = await getDoc(userDocRef);

        if (userSnap.exists()) {
          matchingUser = userSnap.data() as UserProfile;
        } else if (cleanPhone) {
          // Fallback query if created with raw phone
          const phoneQuery = query(collection(db, 'users'), where('cleanPhone', '==', cleanPhone));
          const phoneSnaps = await getDocs(phoneQuery);
          if (!phoneSnaps.empty) {
            matchingUser = phoneSnaps.docs[0].data() as UserProfile;
          } else {
            const rawPhoneQuery = query(collection(db, 'users'), where('phone', '==', identifier.trim()));
            const rawSnaps = await getDocs(rawPhoneQuery);
            if (!rawSnaps.empty) {
              matchingUser = rawSnaps.docs[0].data() as UserProfile;
            }
          }
        }
      } catch (cloudErr) {
        console.warn('Notice querying Cloud Firestore during login:', cloudErr);
      }
    }

    // 2. OFFLINE / LOCAL FALLBACK: Check IndexedDB and local storage
    if (!matchingUser) {
      const users = this.getAllUsers();
      matchingUser = users.find(
        (u) =>
          (u.cleanPhone && u.cleanPhone === cleanPhone) ||
          (u.phone && u.phone.replace(/\D/g, '') === cleanPhone) ||
          u.id === cleanId ||
          u.id === `emp_${cleanPhone}` ||
          u.email.toLowerCase() === identifier.toLowerCase().trim()
      );
    }

    if (!matchingUser) {
      if (this.isOnline()) {
        return {
          success: false,
          error: 'No se encontró una cuenta con este número de celular en la nube. Por favor regístrate primero.'
        };
      } else {
        return {
          success: false,
          error: 'Esta cuenta no está registrada en este dispositivo. Conéctate a internet para iniciar sesión por primera vez desde este teléfono.'
        };
      }
    }

    // 3. Rate limiting and lockout protection
    const now = Date.now();
    if (matchingUser.lockoutUntil && now < matchingUser.lockoutUntil) {
      const remainingSeconds = Math.ceil((matchingUser.lockoutUntil - now) / 1000);
      return {
        success: false,
        error: `Acceso temporalmente bloqueado por intentos fallidos. Espera ${remainingSeconds} segundos.`,
        lockoutSeconds: remainingSeconds
      };
    }

    // 4. Verify PIN Hash
    const effectiveSalt = matchingUser.pinSalt;
    const effectiveHash = matchingUser.pinHash;

    if (effectiveSalt && effectiveHash) {
      const inputHash = await hashPin(pin, effectiveSalt);
      if (inputHash !== effectiveHash) {
        const failedCount = (matchingUser.failedLoginAttempts || 0) + 1;
        const updates: Partial<UserProfile> = { failedLoginAttempts: failedCount };

        if (failedCount >= 5) {
          const lockoutUntil = now + 30000;
          updates.lockoutUntil = lockoutUntil;
          matchingUser.failedLoginAttempts = failedCount;
          matchingUser.lockoutUntil = lockoutUntil;

          if (this.isOnline() && matchingUser.id) {
            setDoc(doc(db, 'users', matchingUser.id), updates, { merge: true }).catch(() => {});
          }
          await idbService.put('users', matchingUser);

          return {
            success: false,
            error: 'Has superado 5 intentos fallidos. Por seguridad, el acceso está bloqueado por 30 segundos.',
            lockoutSeconds: 30
          };
        }

        matchingUser.failedLoginAttempts = failedCount;
        if (this.isOnline() && matchingUser.id) {
          setDoc(doc(db, 'users', matchingUser.id), updates, { merge: true }).catch(() => {});
        }
        await idbService.put('users', matchingUser);

        return {
          success: false,
          error: `PIN incorrecto. Te quedan ${5 - failedCount} intento(s) antes del bloqueo temporal.`
        };
      }

      // PIN is correct! Reset lockout counters
      matchingUser.failedLoginAttempts = 0;
      matchingUser.lockoutUntil = 0;
      if (this.isOnline() && matchingUser.id) {
        setDoc(doc(db, 'users', matchingUser.id), { failedLoginAttempts: 0, lockoutUntil: 0 }, { merge: true }).catch(() => {});
      }
    } else if (matchingUser.isDemoProfile) {
      // Demo accounts check (default demo PIN: 1234)
      if (pin !== '1234') {
        return {
          success: false,
          error: 'El PIN de los perfiles de demostración es 1234.'
        };
      }
    } else {
      return {
        success: false,
        error: 'PIN no configurado para esta cuenta. Por favor contacta al administrador.'
      };
    }

    // 5. CACHE LOCALLY ON THIS DEVICE: Ensure user is saved locally in IndexedDB & localStorage
    const localUsers = this.getAllUsers();
    const existingIdx = localUsers.findIndex((u) => u.id === matchingUser!.id);
    if (existingIdx >= 0) {
      localUsers[existingIdx] = matchingUser;
    } else {
      localUsers.push(matchingUser);
    }
    localStorage.setItem(STORAGE_KEYS.USERS, JSON.stringify(localUsers));
    await idbService.put('users', matchingUser);

    // Save auth credentials in IndexedDB for offline use on this device
    const credRecord: AuthCredentialRecord = {
      identifier: cleanId,
      phone: matchingUser.phone,
      userId: matchingUser.id,
      pinSalt: matchingUser.pinSalt || '',
      pinHash: matchingUser.pinHash || '',
      failedAttempts: 0,
      lockoutUntil: 0
    };
    await idbService.put('auth_credentials', credRecord);

    // 6. SYNC FROM CLOUD: Pull all products, sales, and learning state from Cloud Firestore
    if (this.isOnline()) {
      await this.pullUserDataFromCloud(matchingUser.id);
    }

    // 7. ACTIVATE SESSION
    localStorage.setItem(STORAGE_KEYS.CURRENT_USER_ID, matchingUser.id);
    this.notify();
    return { success: true, user: matchingUser };
  }

  /**
   * Registers a new entrepreneur with phone + 4-digit PIN.
   * Direct Cloud Firestore creation with server confirmation.
   * Saves to IndexedDB and localStorage for offline-first access.
   */
  public async registerWithPin(
    profileData: Omit<UserProfile, 'id'>,
    pin: string
  ): Promise<{ success: boolean; user?: UserProfile; error?: string }> {
    if (!pin || pin.length !== 4) {
      return { success: false, error: 'El PIN personal debe tener exactamente 4 dígitos numéricos.' };
    }

    const cleanPhone = profileData.phone.replace(/\D/g, '');
    const cleanId = cleanPhone || profileData.name.toLowerCase().replace(/\s+/g, '');
    const newUserId = `emp_${cleanPhone}`;

    // 1. Check if phone is already registered in Cloud Firestore (if online)
    if (this.isOnline()) {
      try {
        const existingDoc = await getDoc(doc(db, 'users', newUserId));
        if (existingDoc.exists()) {
          return {
            success: false,
            error: 'Ya existe una cuenta con este número de celular en la nube. Por favor ingresa desde Inicio de Sesión.'
          };
        }
      } catch (checkErr) {
        console.warn('Check cloud user notice:', checkErr);
      }
    }

    // Check if phone already registered locally
    const existingUsers = this.getAllUsers();
    const phoneExists = existingUsers.some(
      (u) => (u.cleanPhone === cleanPhone || (u.phone && u.phone.replace(/\D/g, '') === cleanPhone)) && !u.isDemoProfile
    );
    if (phoneExists) {
      return {
        success: false,
        error: 'Ya existe una cuenta con este número de celular en este dispositivo. Ingresa mediante Inicio de Sesión.'
      };
    }

    // 2. Cryptographic Salt & PIN Hash (PBKDF2/SHA-256)
    const salt = generateSalt();
    const pHash = await hashPin(pin, salt);

    const newUser: UserProfile = {
      ...profileData,
      id: newUserId,
      userId: newUserId,
      cleanPhone,
      authIdentifier: cleanId,
      pinSalt: salt,
      pinHash: pHash,
      failedLoginAttempts: 0,
      lockoutUntil: 0,
      isDemoProfile: false,
      isPendingCloudSync: !this.isOnline()
    };

    // 3. Cloud Firestore Direct Write with Server Confirmation
    if (this.isOnline()) {
      try {
        await setDoc(doc(db, 'users', newUserId), sanitizeForFirestore(newUser));
        console.log('Account confirmed in Cloud Firestore:', newUserId);
      } catch (cloudErr: any) {
        console.error('Error writing user to Cloud Firestore:', cloudErr);
        newUser.isPendingCloudSync = true;
        this.enqueueSyncOperation({
          id: generateUUID(),
          userId: newUser.id,
          entityType: 'USER_PROFILE',
          action: 'CREATE',
          payload: newUser,
          timestamp: Date.now(),
          status: 'PENDING',
          retryCount: 0
        });
      }
    } else {
      newUser.isPendingCloudSync = true;
      this.enqueueSyncOperation({
        id: generateUUID(),
        userId: newUser.id,
        entityType: 'USER_PROFILE',
        action: 'CREATE',
        payload: newUser,
        timestamp: Date.now(),
        status: 'PENDING',
        retryCount: 0
      });
    }

    // 4. Save credentials and profile in IndexedDB & localStorage for offline access
    const credRecord: AuthCredentialRecord = {
      identifier: cleanId,
      phone: profileData.phone,
      userId: newUser.id,
      pinSalt: salt,
      pinHash: pHash,
      failedAttempts: 0,
      lockoutUntil: 0
    };
    await idbService.put('auth_credentials', credRecord);

    existingUsers.push(newUser);
    localStorage.setItem(STORAGE_KEYS.USERS, JSON.stringify(existingUsers));
    localStorage.setItem(STORAGE_KEYS.CURRENT_USER_ID, newUser.id);
    await idbService.put('users', newUser);

    // Initial empty learning state
    const initialLearningState: UserLearningState = {
      userId: newUser.id,
      completedLessonIds: [],
      quizResults: {},
      certificates: [],
      downloadedModuleIds: [],
      lastUpdated: Date.now()
    };
    const states = this.getAllLearningStates();
    states[newUser.id] = initialLearningState;
    localStorage.setItem(STORAGE_KEYS.LEARNING_STATES, JSON.stringify(states));
    await idbService.put('learning_states', initialLearningState);

    if (this.isOnline()) {
      setDoc(doc(db, 'learning_states', newUser.id), initialLearningState, { merge: true }).catch(() => {});
    }

    this.notify();
    return { success: true, user: newUser };
  }

  /**
   * Logs out the current entrepreneur.
   * Meets requirement 5:
   * "Limpiar el estado de la interfaz.
   *  Desvincular los datos visibles de su sesión.
   *  Impedir que otra emprendedora vea su historial.
   *  Mantener los registros locales separados por UID."
   */
  public async logout(): Promise<void> {
    try {
      await firebaseSignOut(auth);
    } catch (e) {
      console.warn('Firebase signout note:', e);
    }

    // Clear active session pointer
    localStorage.removeItem(STORAGE_KEYS.CURRENT_USER_ID);

    // Clear any temporary UI error
    localStorage.removeItem(STORAGE_KEYS.LAST_SYNC_ERROR);

    this.notify();
  }

  /**
   * Pulls all user data from Cloud Firestore when logging in from another device.
   */
  public async pullUserDataFromCloud(userId: string): Promise<boolean> {
    if (!this.isOnline()) return false;

    try {
      // 1. Fetch User Profile
      try {
        const userDocRef = doc(db, 'users', userId);
        const userSnap = await getDoc(userDocRef);
        if (userSnap.exists()) {
          const cloudProfile = userSnap.data() as UserProfile;
          const allUsers = this.getAllUsers();
          const existingIdx = allUsers.findIndex((u) => u.id === userId);
          if (existingIdx >= 0) {
            allUsers[existingIdx] = cloudProfile;
          } else {
            allUsers.push(cloudProfile);
          }
          localStorage.setItem(STORAGE_KEYS.USERS, JSON.stringify(allUsers));
          await idbService.put('users', cloudProfile);
        }
      } catch (e) {
        console.warn('Notice fetching user profile from cloud:', e);
      }

      // 2. Fetch User Products
      try {
        const prodQuery = query(collection(db, 'products'), where('userId', '==', userId));
        const prodSnap = await getDocs(prodQuery);
        const cloudProducts: Product[] = [];
        prodSnap.forEach((docSnap) => {
          cloudProducts.push(docSnap.data() as Product);
        });

        if (cloudProducts.length > 0) {
          const currentAllProducts = this.getAllProductsRaw().filter((p) => p.userId !== userId);
          const merged = [...currentAllProducts, ...cloudProducts];
          localStorage.setItem(STORAGE_KEYS.PRODUCTS, JSON.stringify(merged));
          await idbService.putBatch('products', cloudProducts);
        }
      } catch (e) {
        console.warn('Notice fetching products from cloud:', e);
      }

      // 3. Fetch User Sales
      try {
        const salesQuery = query(collection(db, 'sales'), where('userId', '==', userId));
        const salesSnap = await getDocs(salesQuery);
        const cloudSales: Sale[] = [];
        salesSnap.forEach((docSnap) => {
          cloudSales.push(docSnap.data() as Sale);
        });

        if (cloudSales.length > 0) {
          const currentAllSales = this.getAllSalesRaw().filter((s) => s.userId !== userId);
          const mergedSales = [...currentAllSales, ...cloudSales];
          localStorage.setItem(STORAGE_KEYS.SALES, JSON.stringify(mergedSales));
          await idbService.putBatch('sales', cloudSales);
        }
      } catch (e) {
        console.warn('Notice fetching sales from cloud:', e);
      }

      // 4. Fetch Learning State
      try {
        const learnDocRef = doc(db, 'learning_states', userId);
        const learnSnap = await getDoc(learnDocRef);
        if (learnSnap.exists()) {
          const cloudLearn = learnSnap.data() as UserLearningState;
          const allStates = this.getAllLearningStates();
          allStates[userId] = cloudLearn;
          localStorage.setItem(STORAGE_KEYS.LEARNING_STATES, JSON.stringify(allStates));
          await idbService.put('learning_states', cloudLearn);
        }
      } catch (e) {
        console.warn('Notice fetching learning state from cloud:', e);
      }

      this.notify();
      return true;
    } catch (err) {
      console.error('Error pulling cloud data:', err);
      return false;
    }
  }

  // --- Users & Profiles ---
  public getAllUsers(): UserProfile[] {
    const data = localStorage.getItem(STORAGE_KEYS.USERS);
    return data ? JSON.parse(data) : DEMO_PROFILES;
  }

  public getCurrentUser(): UserProfile {
    const users = this.getAllUsers();
    const currentId = localStorage.getItem(STORAGE_KEYS.CURRENT_USER_ID);
    const found = users.find((u) => u.id === currentId);
    return found || users[0] || DEMO_PROFILES[0];
  }

  public switchUser(userId: string) {
    localStorage.setItem(STORAGE_KEYS.CURRENT_USER_ID, userId);
    this.notify();
  }

  public registerUser(profileData: Omit<UserProfile, 'id'>): UserProfile {
    const users = this.getAllUsers();
    const newUser: UserProfile = {
      ...profileData,
      id: `user-${Date.now()}-${Math.floor(Math.random() * 1000)}`
    };
    users.push(newUser);
    localStorage.setItem(STORAGE_KEYS.USERS, JSON.stringify(users));
    localStorage.setItem(STORAGE_KEYS.CURRENT_USER_ID, newUser.id);

    // Save in IndexedDB
    idbService.put('users', newUser);

    this.enqueueSyncOperation({
      id: generateUUID(),
      userId: newUser.id,
      entityType: 'USER_PROFILE',
      action: 'CREATE',
      payload: newUser,
      timestamp: Date.now(),
      status: 'PENDING',
      retryCount: 0
    });

    this.notify();
    return newUser;
  }

  public updateUserProfile(updated: UserProfile) {
    const users = this.getAllUsers();
    const index = users.findIndex((u) => u.id === updated.id);
    if (index >= 0) {
      users[index] = updated;
      localStorage.setItem(STORAGE_KEYS.USERS, JSON.stringify(users));
      idbService.put('users', updated);

      this.enqueueSyncOperation({
        id: generateUUID(),
        userId: updated.id,
        entityType: 'USER_PROFILE',
        action: 'UPDATE',
        payload: updated,
        timestamp: Date.now(),
        status: 'PENDING',
        retryCount: 0
      });

      this.notify();
    }
  }

  // --- Products (Inventario) ---
  public getProducts(userId?: string): Product[] {
    const targetUserId = userId || this.getCurrentUser().id;
    const data = localStorage.getItem(STORAGE_KEYS.PRODUCTS);
    const allProducts: Product[] = data ? JSON.parse(data) : [];
    return allProducts.filter((p) => p.userId === targetUserId);
  }

  public getAllProductsRaw(): Product[] {
    const data = localStorage.getItem(STORAGE_KEYS.PRODUCTS);
    return data ? JSON.parse(data) : [];
  }

  public getProductById(productId: string): Product | undefined {
    const products = this.getAllProductsRaw();
    return products.find((p) => p.id === productId);
  }

  public saveProduct(productInput: Omit<Product, 'id' | 'createdAt' | 'updatedAt' | 'userId'> & { id?: string }): Product {
    const currentUserId = this.getCurrentUser().id;
    const allProducts = this.getAllProductsRaw();

    let savedProduct: Product;
    let action: 'CREATE' | 'UPDATE' = 'CREATE';

    if (productInput.id) {
      const index = allProducts.findIndex((p) => p.id === productInput.id && p.userId === currentUserId);
      if (index === -1) {
        throw new Error('Producto no encontrado o no pertenece a la usuaria actual.');
      }
      action = 'UPDATE';
      savedProduct = {
        ...allProducts[index],
        name: productInput.name,
        description: productInput.description,
        price: Number(productInput.price),
        stock: Number(productInput.stock),
        unit: productInput.unit,
        category: productInput.category,
        minStockAlert: Number(productInput.minStockAlert) || 3,
        updatedAt: Date.now()
      };
      allProducts[index] = savedProduct;
    } else {
      action = 'CREATE';
      savedProduct = {
        id: `prod-${generateUUID().substring(0, 8)}`,
        userId: currentUserId,
        name: productInput.name,
        description: productInput.description,
        price: Number(productInput.price),
        stock: Number(productInput.stock),
        unit: productInput.unit,
        category: productInput.category,
        minStockAlert: Number(productInput.minStockAlert) || 3,
        createdAt: Date.now(),
        updatedAt: Date.now()
      };
      allProducts.push(savedProduct);
    }

    localStorage.setItem(STORAGE_KEYS.PRODUCTS, JSON.stringify(allProducts));
    idbService.put('products', savedProduct);

    if (this.isOnline()) {
      setDoc(doc(db, 'products', savedProduct.id), sanitizeForFirestore(savedProduct), { merge: true }).catch((err) => {
        console.warn('Direct product save notice:', err);
      });
    }

    this.enqueueSyncOperation({
      id: generateUUID(),
      userId: currentUserId,
      entityType: 'PRODUCT',
      action,
      payload: savedProduct,
      timestamp: Date.now(),
      status: 'PENDING',
      retryCount: 0
    });

    this.notify();
    return savedProduct;
  }

  public deleteProduct(productId: string): boolean {
    const currentUserId = this.getCurrentUser().id;
    const allProducts = this.getAllProductsRaw();
    const target = allProducts.find((p) => p.id === productId && p.userId === currentUserId);
    if (!target) return false;

    const filtered = allProducts.filter((p) => p.id !== productId);
    localStorage.setItem(STORAGE_KEYS.PRODUCTS, JSON.stringify(filtered));
    idbService.delete('products', productId);

    if (this.isOnline()) {
      deleteDoc(doc(db, 'products', productId)).catch((err) => {
        console.warn('Direct product delete notice:', err);
      });
    }

    this.enqueueSyncOperation({
      id: generateUUID(),
      userId: currentUserId,
      entityType: 'PRODUCT',
      action: 'DELETE',
      payload: { id: productId, userId: currentUserId },
      timestamp: Date.now(),
      status: 'PENDING',
      retryCount: 0
    });

    this.notify();
    return true;
  }

  // --- Sales (Ventas con validación estricta y descuento atómico) ---
  public getAllSalesRaw(): Sale[] {
    const data = localStorage.getItem(STORAGE_KEYS.SALES);
    return data ? JSON.parse(data) : [];
  }

  public getSales(userId?: string): Sale[] {
    const targetUserId = userId || this.getCurrentUser().id;
    const allSales = this.getAllSalesRaw();
    return allSales
      .filter((s) => s.userId === targetUserId)
      .map((s) => {
        const isCredit =
          typeof s.paymentMethod === 'string' &&
          (s.paymentMethod.toLowerCase().includes('crédito') || s.paymentMethod.toLowerCase().includes('fiado'));
        return {
          ...s,
          subtotalAmount: s.subtotalAmount ?? s.totalAmount,
          deliveryCost: s.deliveryCost ?? 0,
          amountPaid: s.amountPaid !== undefined ? s.amountPaid : isCredit ? 0 : s.totalAmount,
          pendingBalance: s.pendingBalance !== undefined ? s.pendingBalance : isCredit ? s.totalAmount : 0
        };
      })
      .sort((a, b) => b.date - a.date);
  }

  public registerSale(params: {
    items: { productId: string; quantity: number }[];
    paymentMethod: Sale['paymentMethod'];
    subtotalAmount?: number;
    deliveryCost?: number;
    totalAmount?: number;
    paymentBreakdown?: PaymentBreakdown;
    amountPaid?: number;
    pendingBalance?: number;
    deliveryType?: DeliveryType;
    deliveryLocation?: string;
    customerName?: string;
    customerPhone?: string;
    customerNotes?: string;
  }): Sale {
    const currentUserId = this.getCurrentUser().id;
    const allProducts = this.getAllProductsRaw();

    if (!params.items || params.items.length === 0) {
      throw new Error('Debe agregar al menos un producto a la venta.');
    }

    // 1. Rigorous Stock Validation
    const saleItems: SaleItem[] = [];
    let calculatedSubtotal = 0;

    for (const item of params.items) {
      if (item.quantity <= 0) {
        throw new Error('La cantidad de cada producto debe ser mayor a 0.');
      }
      const prod = allProducts.find((p) => p.id === item.productId && p.userId === currentUserId);
      if (!prod) {
        throw new Error(`El producto seleccionado no existe o no pertenece a tu emprendimiento.`);
      }

      if (item.quantity > prod.stock) {
        throw new Error(
          `Existencias insuficientes para "${prod.name}". Intentas vender ${item.quantity} ${prod.unit}(s), pero solo quedan ${prod.stock} disponibles en tu inventario.`
        );
      }

      const subtotal = prod.price * item.quantity;
      calculatedSubtotal += subtotal;

      saleItems.push({
        productId: prod.id,
        productName: prod.name,
        unitPrice: prod.price,
        quantity: item.quantity,
        subtotal
      });
    }

    const deliveryCost = params.deliveryCost || 0;
    const finalTotal = params.totalAmount !== undefined ? params.totalAmount : calculatedSubtotal + deliveryCost;

    let amountPaid = params.amountPaid;
    let pendingBalance = params.pendingBalance;

    if (amountPaid === undefined || pendingBalance === undefined) {
      const isCredit =
        typeof params.paymentMethod === 'string' &&
        (params.paymentMethod.toLowerCase().includes('crédito') || params.paymentMethod.toLowerCase().includes('fiado'));
      if (isCredit) {
        amountPaid = params.paymentBreakdown?.cashReceived || 0;
        pendingBalance = Math.max(0, finalTotal - amountPaid);
      } else {
        amountPaid = finalTotal;
        pendingBalance = 0;
      }
    }

    // 2. Atomic Stock Reduction
    for (const item of params.items) {
      const pIndex = allProducts.findIndex((p) => p.id === item.productId);
      if (pIndex !== -1) {
        allProducts[pIndex].stock -= item.quantity;
        allProducts[pIndex].updatedAt = Date.now();
        idbService.put('products', allProducts[pIndex]);
        if (this.isOnline()) {
          setDoc(doc(db, 'products', allProducts[pIndex].id), sanitizeForFirestore(allProducts[pIndex]), { merge: true }).catch(() => {});
        }
      }
    }
    localStorage.setItem(STORAGE_KEYS.PRODUCTS, JSON.stringify(allProducts));

    // 3. Create Sale Record
    const newSale: Sale = {
      id: `sale-${generateUUID().substring(0, 8)}`,
      userId: currentUserId,
      date: Date.now(),
      items: saleItems,
      subtotalAmount: calculatedSubtotal,
      deliveryCost,
      totalAmount: finalTotal,
      paymentMethod: params.paymentMethod,
      paymentBreakdown: params.paymentBreakdown,
      amountPaid,
      pendingBalance,
      deliveryType: params.deliveryType || 'recogida',
      deliveryLocation: params.deliveryLocation?.trim() || undefined,
      customerName: params.customerName?.trim() || undefined,
      customerPhone: params.customerPhone?.trim() || undefined,
      customerNotes: params.customerNotes?.trim() || undefined,
      synced: false
    };

    const allSales = this.getAllSalesRaw();
    allSales.unshift(newSale);
    localStorage.setItem(STORAGE_KEYS.SALES, JSON.stringify(allSales));
    idbService.put('sales', newSale);

    if (this.isOnline()) {
      setDoc(doc(db, 'sales', newSale.id), sanitizeForFirestore({ ...newSale, synced: true }), { merge: true }).catch((err) => {
        console.warn('Direct sale save notice:', err);
      });
    }

    // 4. Enqueue Sync Operation
    this.enqueueSyncOperation({
      id: generateUUID(),
      userId: currentUserId,
      entityType: 'SALE',
      action: 'CREATE',
      payload: newSale,
      timestamp: Date.now(),
      status: 'PENDING',
      retryCount: 0
    });

    this.notify();
    return newSale;
  }

  public recordPaymentOnSale(saleId: string, amountToPay: number): Sale | null {
    const allSales = this.getAllSalesRaw();
    const index = allSales.findIndex((s) => s.id === saleId);
    if (index === -1) return null;

    const sale = allSales[index];
    const currentPaid = sale.amountPaid !== undefined ? sale.amountPaid : 0;
    const currentPending =
      sale.pendingBalance !== undefined ? sale.pendingBalance : Math.max(0, sale.totalAmount - currentPaid);

    const payment = Math.min(Math.max(0, amountToPay), currentPending);
    if (payment <= 0) return sale;

    sale.amountPaid = currentPaid + payment;
    sale.pendingBalance = Math.max(0, currentPending - payment);
    sale.synced = false;

    allSales[index] = sale;
    localStorage.setItem(STORAGE_KEYS.SALES, JSON.stringify(allSales));
    idbService.put('sales', sale);

    this.enqueueSyncOperation({
      id: generateUUID(),
      userId: sale.userId,
      entityType: 'SALE',
      action: 'UPDATE',
      payload: sale,
      timestamp: Date.now(),
      status: 'PENDING',
      retryCount: 0
    });

    this.notify();
    return sale;
  }

  // ==================== MÓDULO 2 & 3: ESCUELA DE APRENDIZAJE ====================

  public getAllLearningStates(): Record<string, UserLearningState> {
    const raw = localStorage.getItem(STORAGE_KEYS.LEARNING_STATES);
    return raw ? JSON.parse(raw) : {};
  }

  public getLearningState(userId?: string): UserLearningState {
    const targetUserId = userId || this.getCurrentUser().id;
    const allStates = this.getAllLearningStates();

    if (!allStates[targetUserId]) {
      const emptyState: UserLearningState = {
        userId: targetUserId,
        completedLessonIds: [],
        quizResults: {},
        certificates: [],
        downloadedModuleIds: [],
        lastUpdated: Date.now()
      };
      allStates[targetUserId] = emptyState;
      localStorage.setItem(STORAGE_KEYS.LEARNING_STATES, JSON.stringify(allStates));
      idbService.put('learning_states', emptyState);
      return emptyState;
    }

    return allStates[targetUserId];
  }

  private saveLearningState(state: UserLearningState) {
    const allStates = this.getAllLearningStates();
    allStates[state.userId] = {
      ...state,
      lastUpdated: Date.now()
    };
    localStorage.setItem(STORAGE_KEYS.LEARNING_STATES, JSON.stringify(allStates));
    idbService.put('learning_states', allStates[state.userId]);
    this.notify();
  }

  public getLessonProgress(userId?: string): string[] {
    return this.getLearningState(userId).completedLessonIds;
  }

  public toggleLessonCompleted(lessonId: string, moduleId?: string): boolean {
    const currentUserId = this.getCurrentUser().id;
    const state = this.getLearningState(currentUserId);

    let isCompleted = false;
    if (state.completedLessonIds.includes(lessonId)) {
      state.completedLessonIds = state.completedLessonIds.filter((id) => id !== lessonId);
      isCompleted = false;
    } else {
      state.completedLessonIds.push(lessonId);
      isCompleted = true;
    }

    state.lastVisitedLessonId = lessonId;
    if (moduleId) {
      state.lastVisitedModuleId = moduleId;
    }

    this.saveLearningState(state);

    this.enqueueSyncOperation({
      id: generateUUID(),
      userId: currentUserId,
      entityType: 'LESSON_PROGRESS',
      action: 'UPDATE',
      payload: state,
      timestamp: Date.now(),
      status: 'PENDING',
      retryCount: 0
    });

    return isCompleted;
  }

  public setLastVisited(moduleId: string, lessonId: string) {
    const currentUserId = this.getCurrentUser().id;
    const state = this.getLearningState(currentUserId);
    state.lastVisitedModuleId = moduleId;
    state.lastVisitedLessonId = lessonId;
    this.saveLearningState(state);
  }

  public submitQuizResult(
    moduleId: string,
    answers: Record<string, number>,
    scorePercent: number,
    passed: boolean
  ): { passed: boolean; certificate?: UserCertificate } {
    const currentUser = this.getCurrentUser();
    const state = this.getLearningState(currentUser.id);

    const quizResult: ModuleQuizResult = {
      moduleId,
      scorePercent,
      passed,
      completedAt: Date.now(),
      answers
    };
    state.quizResults[moduleId] = quizResult;

    let newCertificate: UserCertificate | undefined = undefined;

    if (passed) {
      const existingCert = state.certificates.find((c) => c.moduleId === moduleId);
      const mod = ACADEMY_MODULES.find((m) => m.id === moduleId);

      if (!existingCert && mod) {
        newCertificate = {
          id: `cert-${generateUUID().substring(0, 8)}`,
          userId: currentUser.id,
          userName: currentUser.name,
          businessName: currentUser.businessName,
          location: currentUser.location,
          moduleId: mod.id,
          moduleTitle: mod.title,
          issuedDate: Date.now(),
          scorePercent,
          verificationCode: `ME-PALMIRA-${new Date().getFullYear()}-${Math.floor(1000 + Math.random() * 9000)}`
        };
        state.certificates.push(newCertificate);
      }
    }

    this.saveLearningState(state);

    this.enqueueSyncOperation({
      id: generateUUID(),
      userId: currentUser.id,
      entityType: 'QUIZ_RESULT',
      action: 'CREATE',
      payload: state,
      timestamp: Date.now(),
      status: 'PENDING',
      retryCount: 0
    });

    return { passed, certificate: newCertificate };
  }

  public toggleDownloadModule(moduleId: string): boolean {
    const currentUserId = this.getCurrentUser().id;
    const state = this.getLearningState(currentUserId);

    let isDownloaded = false;
    if (state.downloadedModuleIds.includes(moduleId)) {
      state.downloadedModuleIds = state.downloadedModuleIds.filter((id) => id !== moduleId);
      isDownloaded = false;
    } else {
      state.downloadedModuleIds.push(moduleId);
      isDownloaded = true;
    }

    this.saveLearningState(state);
    return isDownloaded;
  }

  public getCertificates(userId?: string): UserCertificate[] {
    return this.getLearningState(userId).certificates;
  }

  // ==================== MÓDULO 4: OFFLINE-FIRST SYNC ENGINE ====================

  public getSyncQueue(): SyncOperation[] {
    const data = localStorage.getItem(STORAGE_KEYS.SYNC_QUEUE);
    return data ? JSON.parse(data) : [];
  }

  public getPendingSyncCount(): number {
    const queue = this.getSyncQueue();
    return queue.filter((item) => item.status === 'PENDING').length;
  }

  private enqueueSyncOperation(op: SyncOperation) {
    const queue = this.getSyncQueue();
    op.status = 'PENDING';
    queue.unshift(op);
    localStorage.setItem(STORAGE_KEYS.SYNC_QUEUE, JSON.stringify(queue.slice(0, 150)));
    idbService.put('sync_queue', op);

    if (this.isOnline()) {
      setTimeout(() => this.processSyncQueue(), 250);
    }
  }

  /**
   * Sincroniza las operaciones pendientes en IndexedDB con Cloud Firestore.
   * Utiliza UUIDs para evitar duplicados en operaciones repetidas.
   */
  public async processSyncQueue(): Promise<{ synced: number; failed: number }> {
    if (!this.isOnline() || this.syncInProgress) {
      return { synced: 0, failed: 0 };
    }

    const queue = this.getSyncQueue();
    const pendingItems = queue.filter((item) => item.status === 'PENDING');
    if (pendingItems.length === 0) {
      return { synced: 0, failed: 0 };
    }

    this.syncInProgress = true;
    queue.forEach((op) => {
      if (op.status === 'PENDING') {
        op.status = 'SYNCING';
      }
    });
    localStorage.setItem(STORAGE_KEYS.SYNC_QUEUE, JSON.stringify(queue));
    this.notify();

    let syncedCount = 0;
    let failedCount = 0;

    for (const op of pendingItems) {
      try {
        if (op.entityType === 'PRODUCT') {
          if (op.action === 'DELETE') {
            await deleteDoc(doc(db, 'products', op.payload.id));
          } else {
            await setDoc(doc(db, 'products', op.payload.id), sanitizeForFirestore(op.payload), { merge: true });
          }
        } else if (op.entityType === 'SALE') {
          await setDoc(doc(db, 'sales', op.payload.id), sanitizeForFirestore(op.payload), { merge: true });
        } else if (op.entityType === 'USER_PROFILE') {
          await setDoc(doc(db, 'users', op.payload.id), sanitizeForFirestore(op.payload), { merge: true });
        } else if (
          op.entityType === 'LESSON_PROGRESS' ||
          op.entityType === 'QUIZ_RESULT' ||
          op.entityType === 'CERTIFICATE'
        ) {
          await setDoc(doc(db, 'learning_states', op.userId), sanitizeForFirestore(op.payload), { merge: true });
        }

        op.status = 'SYNCED';
        op.retryCount = 0;
        syncedCount++;
        await idbService.put('sync_queue', op);
      } catch (err: any) {
        console.warn(`Sync failed for operation ${op.id}:`, err);
        op.status = 'FAILED';
        op.retryCount += 1;
        op.errorMessage = err.message || 'Error al conectar con Firestore';
        failedCount++;
        await idbService.put('sync_queue', op);
      }
    }

    localStorage.setItem(STORAGE_KEYS.SYNC_QUEUE, JSON.stringify(queue));
    localStorage.setItem(STORAGE_KEYS.LAST_SYNC_TIMESTAMP, String(Date.now()));

    if (failedCount === 0) {
      localStorage.removeItem(STORAGE_KEYS.LAST_SYNC_ERROR);
    } else {
      localStorage.setItem(
        STORAGE_KEYS.LAST_SYNC_ERROR,
        `${failedCount} operación(es) pendientes por resolver con Cloud Firestore`
      );
    }

    this.syncInProgress = false;
    this.notify();
    return { synced: syncedCount, failed: failedCount };
  }
}

export const storage = new AppStorageService();
