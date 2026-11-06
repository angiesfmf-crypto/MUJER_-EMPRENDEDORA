/**
 * IndexedDB storage engine for Mujer Emprendedora Palmira
 * Provides full offline-first persistence separated strictly by User ID.
 * Includes in-memory fallback for environments where indexedDB is not available.
 */

const DB_NAME = 'MujerEmprendedora_OfflineDB';
const DB_VERSION = 1;

export interface AuthCredentialRecord {
  identifier: string; // phone or username
  phone: string;
  userId: string;
  pinSalt: string;
  pinHash: string;
  failedAttempts: number;
  lockoutUntil: number; // timestamp
}

class IndexedDBService {
  private dbPromise: Promise<IDBDatabase> | null = null;
  private memoryFallback: Map<string, Map<string, any>> = new Map();

  private getFallbackStore(storeName: string): Map<string, any> {
    if (!this.memoryFallback.has(storeName)) {
      this.memoryFallback.set(storeName, new Map());
    }
    return this.memoryFallback.get(storeName)!;
  }

  private hasIndexedDB(): boolean {
    return typeof window !== 'undefined' && typeof window.indexedDB !== 'undefined';
  }

  private getDB(): Promise<IDBDatabase> {
    if (this.dbPromise) return this.dbPromise;

    this.dbPromise = new Promise((resolve, reject) => {
      if (!this.hasIndexedDB()) {
        reject(new Error('IndexedDB not supported in this environment'));
        return;
      }

      const request = window.indexedDB.open(DB_NAME, DB_VERSION);

      request.onupgradeneeded = (event: IDBVersionChangeEvent) => {
        const db = (event.target as IDBOpenDBRequest).result;

        // 1. Users Store
        if (!db.objectStoreNames.contains('users')) {
          const userStore = db.createObjectStore('users', { keyPath: 'id' });
          userStore.createIndex('phone', 'phone', { unique: false });
          userStore.createIndex('userId', 'userId', { unique: false });
        }

        // 2. Products Store
        if (!db.objectStoreNames.contains('products')) {
          const prodStore = db.createObjectStore('products', { keyPath: 'id' });
          prodStore.createIndex('userId', 'userId', { unique: false });
        }

        // 3. Sales Store
        if (!db.objectStoreNames.contains('sales')) {
          const saleStore = db.createObjectStore('sales', { keyPath: 'id' });
          saleStore.createIndex('userId', 'userId', { unique: false });
        }

        // 4. Learning States Store
        if (!db.objectStoreNames.contains('learning_states')) {
          db.createObjectStore('learning_states', { keyPath: 'userId' });
        }

        // 5. Sync Queue Store
        if (!db.objectStoreNames.contains('sync_queue')) {
          const syncStore = db.createObjectStore('sync_queue', { keyPath: 'id' });
          syncStore.createIndex('userId', 'userId', { unique: false });
          syncStore.createIndex('status', 'status', { unique: false });
        }

        // 6. Auth Credentials & Lockout defense Store
        if (!db.objectStoreNames.contains('auth_credentials')) {
          db.createObjectStore('auth_credentials', { keyPath: 'identifier' });
        }
      };

      request.onsuccess = () => {
        resolve(request.result);
      };

      request.onerror = () => {
        console.warn('IndexedDB open notice, using memory fallback:', request.error);
        reject(request.error);
      };
    });

    return this.dbPromise;
  }

  // Generic Put
  public async put<T extends { id?: string; identifier?: string; userId?: string }>(
    storeName: string,
    item: T
  ): Promise<void> {
    const key = item.id || item.identifier || item.userId || String(Math.random());
    this.getFallbackStore(storeName).set(key, item);

    if (!this.hasIndexedDB()) return;

    try {
      const db = await this.getDB();
      return new Promise((resolve, reject) => {
        const tx = db.transaction(storeName, 'readwrite');
        const store = tx.objectStore(storeName);
        const req = store.put(item);
        req.onsuccess = () => resolve();
        req.onerror = () => reject(req.error);
      });
    } catch (e) {
      // Memory fallback has already been updated
    }
  }

  // Put multiple items
  public async putBatch<T extends { id?: string; identifier?: string; userId?: string }>(
    storeName: string,
    items: T[]
  ): Promise<void> {
    if (!items || items.length === 0) return;
    const storeMap = this.getFallbackStore(storeName);
    for (const item of items) {
      const key = item.id || item.identifier || item.userId || String(Math.random());
      storeMap.set(key, item);
    }

    if (!this.hasIndexedDB()) return;

    try {
      const db = await this.getDB();
      return new Promise((resolve, reject) => {
        const tx = db.transaction(storeName, 'readwrite');
        const store = tx.objectStore(storeName);
        for (const item of items) {
          store.put(item);
        }
        tx.oncomplete = () => resolve();
        tx.onerror = () => reject(tx.error);
      });
    } catch (e) {
      // Memory fallback has already been updated
    }
  }

  // Generic Get
  public async get<T>(storeName: string, key: string): Promise<T | null> {
    const fallbackItem = this.getFallbackStore(storeName).get(key);
    if (!this.hasIndexedDB()) {
      return (fallbackItem as T) || null;
    }

    try {
      const db = await this.getDB();
      return new Promise((resolve, reject) => {
        const tx = db.transaction(storeName, 'readonly');
        const store = tx.objectStore(storeName);
        const req = store.get(key);
        req.onsuccess = () => resolve(req.result || fallbackItem || null);
        req.onerror = () => resolve((fallbackItem as T) || null);
      });
    } catch (e) {
      return (fallbackItem as T) || null;
    }
  }

  // Get all items in a store
  public async getAll<T>(storeName: string): Promise<T[]> {
    const fallbackItems = Array.from(this.getFallbackStore(storeName).values()) as T[];
    if (!this.hasIndexedDB()) {
      return fallbackItems;
    }

    try {
      const db = await this.getDB();
      return new Promise((resolve, reject) => {
        const tx = db.transaction(storeName, 'readonly');
        const store = tx.objectStore(storeName);
        const req = store.getAll();
        req.onsuccess = () => {
          const res = req.result || [];
          resolve(res.length > 0 ? res : fallbackItems);
        };
        req.onerror = () => resolve(fallbackItems);
      });
    } catch (e) {
      return fallbackItems;
    }
  }

  // Get all items matching an index (e.g., userId)
  public async getAllByIndex<T extends { userId?: string }>(
    storeName: string,
    indexName: string,
    value: string
  ): Promise<T[]> {
    const fallbackItems = Array.from(this.getFallbackStore(storeName).values()).filter(
      (item: any) => item[indexName] === value
    ) as T[];

    if (!this.hasIndexedDB()) {
      return fallbackItems;
    }

    try {
      const db = await this.getDB();
      return new Promise((resolve, reject) => {
        const tx = db.transaction(storeName, 'readonly');
        const store = tx.objectStore(storeName);
        const index = store.index(indexName);
        const req = index.getAll(value);
        req.onsuccess = () => {
          const res = req.result || [];
          resolve(res.length > 0 ? res : fallbackItems);
        };
        req.onerror = () => resolve(fallbackItems);
      });
    } catch (e) {
      return fallbackItems;
    }
  }

  // Delete item
  public async delete(storeName: string, key: string): Promise<void> {
    this.getFallbackStore(storeName).delete(key);
    if (!this.hasIndexedDB()) return;

    try {
      const db = await this.getDB();
      return new Promise((resolve, reject) => {
        const tx = db.transaction(storeName, 'readwrite');
        const store = tx.objectStore(storeName);
        const req = store.delete(key);
        req.onsuccess = () => resolve();
        req.onerror = () => reject(req.error);
      });
    } catch (e) {
      // Memory fallback has deleted
    }
  }

  // Clear specific store or clean up data
  public async clearStore(storeName: string): Promise<void> {
    this.getFallbackStore(storeName).clear();
    if (!this.hasIndexedDB()) return;

    try {
      const db = await this.getDB();
      return new Promise((resolve, reject) => {
        const tx = db.transaction(storeName, 'readwrite');
        const store = tx.objectStore(storeName);
        const req = store.clear();
        req.onsuccess = () => resolve();
        req.onerror = () => reject(req.error);
      });
    } catch (e) {
      // Memory fallback cleared
    }
  }
}

export const idbService = new IndexedDBService();
