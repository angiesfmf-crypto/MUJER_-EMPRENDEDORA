export type RuralCorregimiento =
  | 'Vereda La Quisquina'
  | 'Corregimiento Rozo'
  | 'Corregimiento El Bolo'
  | 'Vereda Tienda Nueva'
  | 'Vereda Potrerillo'
  | 'Corregimiento Combia'
  | 'Vereda La Buitrera (Palmira)'
  | 'Corregimiento La Torre'
  | 'Corregimiento Guanabanal'
  | 'Zona Rural Palmira Centro';

export type ProductCategory =
  | 'Alimentos y Conservas'
  | 'Artesanías y Textiles'
  | 'Plantas y Vivero'
  | 'Lácteos y Derivados'
  | 'Café y Panela'
  | 'Otros Emprendimientos';

export interface UserProfile {
  id: string;
  name: string;
  documentId: string;
  phone: string;
  email: string;
  businessName: string;
  businessCategory: ProductCategory;
  location: RuralCorregimiento;
  description: string;
  avatarUrl?: string;
  isDemoProfile?: boolean;
  userId?: string;
  cleanPhone?: string;
  isPendingCloudSync?: boolean;
  firebaseUid?: string;
  authIdentifier?: string;
  pinSalt?: string;
  pinHash?: string;
  failedLoginAttempts?: number;
  lockoutUntil?: number;
}

export interface Product {
  id: string;
  userId: string;
  name: string;
  description: string;
  price: number; // in Colombian Pesos COP
  stock: number;
  unit: 'unidad' | 'frasco' | 'paquete' | 'kg' | 'libra' | 'manojo' | 'litro';
  category: ProductCategory;
  minStockAlert: number;
  imageUrl?: string;
  createdAt: number;
  updatedAt: number;
}

export interface SaleItem {
  productId: string;
  productName: string;
  unitPrice: number;
  quantity: number;
  subtotal: number;
}

export type DeliveryType = 'recogida' | 'domicilio';

export type PaymentMethod =
  | 'Efectivo'
  | 'Nequi'
  | 'Transferencia Bancaria'
  | 'Crédito Local'
  | 'Pago Combinado'
  | string;

export interface PaymentBreakdown {
  cashReceived?: number;    // Dinero entregado en efectivo
  cashChange?: number;      // Cambio a devolver
  cashAmount?: number;      // Porción pagada en efectivo
  nequiAmount?: number;     // Porción pagada por Nequi
  transferAmount?: number;  // Porción pagada por Transferencia
  creditAmount?: number;    // Saldo que queda pendiente / fiado
}

export interface Sale {
  id: string;
  userId: string;
  date: number;
  items: SaleItem[];
  subtotalAmount?: number;
  deliveryCost?: number;
  totalAmount: number;
  paymentMethod: PaymentMethod;
  paymentBreakdown?: PaymentBreakdown;
  amountPaid?: number;         // Dinero efectivamente recibido
  pendingBalance?: number;     // Cuentas pendientes de cobro
  deliveryType?: DeliveryType;
  deliveryLocation?: string;   // Vereda o dirección de entrega
  customerName?: string;
  customerPhone?: string;
  customerNotes?: string;
  synced: boolean;
}

export type SyncAction = 'CREATE' | 'UPDATE' | 'DELETE';
export type SyncEntityType =
  | 'PRODUCT'
  | 'SALE'
  | 'USER_PROFILE'
  | 'LESSON_PROGRESS'
  | 'QUIZ_RESULT'
  | 'CERTIFICATE';
export type SyncStatus = 'PENDING' | 'SYNCING' | 'SYNCED' | 'FAILED';

export type GlobalConnectionState =
  | 'ONLINE'
  | 'OFFLINE_AIRPLANE'
  | 'SYNCING'
  | 'SYNCED'
  | 'ERROR';

export interface SyncOperation {
  id: string; // UUID v4 idempotency key
  userId: string;
  entityType: SyncEntityType;
  action: SyncAction;
  payload: any;
  timestamp: number;
  status: SyncStatus;
  retryCount: number;
  errorMessage?: string;
}

// ==================== MÓDULO 1: HERRAMIENTAS DIGITALES ====================

export type ToolCategory =
  | 'Diseño y Publicidad'
  | 'Comunicación y Clientes'
  | 'Organización y Archivos'
  | 'Hojas de Cálculo y Administración'
  | 'Formularios y Encuestas'
  | 'Redes Sociales y Marketing'
  | 'Pagos y Finanzas Rurales'
  | 'Video y Contenido Móvil';

export interface DigitalTool {
  id: string;
  name: string;
  category: ToolCategory;
  description: string;
  ruralUtility: string;
  practicalExample: string;
  officialUrl: string;
  iconType: string;
  requiresRegistration: boolean;
  requiresInternet: boolean;
  pricingModel: 'Gratis con opciones Pro' | '100% Gratuito' | 'Plan Gratuito Permanente' | 'Billetera Móvil Sin Cobro';
  popularTag?: string;
  tips: string[];
}

// ==================== MÓDULO 2 & 3: ESCUELA DE APRENDIZAJE & SEGUIMIENTO ====================

export interface PracticalCase {
  title: string;
  entrepreneurName: string;
  location: string;
  story: string;
  solution: string;
  keyTakeaway: string;
}

export interface InteractiveActivity {
  id: string;
  title: string;
  instruction: string;
  exerciseType: 'checklist' | 'calculator' | 'reflection' | 'fill_blanks';
  steps: string[];
  hint: string;
}

export interface QuizQuestion {
  id: string;
  question: string;
  options: string[];
  correctIndex: number;
  explanation: string;
}

export interface ContentSection {
  subtitle: string;
  body: string[];
  highlightBox?: string;
  tableData?: {
    headers: string[];
    rows: string[][];
  };
}

export interface AcademyLesson {
  id: string;
  moduleId: string;
  order: number;
  title: string;
  durationMinutes: number;
  summary: string;
  introduction: string;
  contentSections: ContentSection[];
  practicalCase?: PracticalCase;
  activity?: InteractiveActivity;
  practicalTip: string;
  keyTakeaways: string[];
}

export interface ModuleQuiz {
  id: string;
  title: string;
  passingScorePercent: number;
  questions: QuizQuestion[];
}

export interface AcademyModule {
  id: string;
  order: number;
  title: string;
  shortTitle: string;
  description: string;
  objectives: string[];
  estimatedHours: number;
  iconName: string;
  category: 'Gestión' | 'Finanzas' | 'Comercialización' | 'Tecnología';
  lessons: AcademyLesson[];
  quiz: ModuleQuiz;
  certificateTitle: string;
}

export interface ModuleQuizResult {
  moduleId: string;
  scorePercent: number;
  passed: boolean;
  completedAt: number;
  answers: Record<string, number>;
}

export interface UserCertificate {
  id: string;
  userId: string;
  userName: string;
  businessName: string;
  location: string;
  moduleId: string;
  moduleTitle: string;
  issuedDate: number;
  scorePercent: number;
  verificationCode: string;
}

export interface UserLearningState {
  userId: string;
  completedLessonIds: string[];
  lastVisitedLessonId?: string;
  lastVisitedModuleId?: string;
  quizResults: Record<string, ModuleQuizResult>;
  certificates: UserCertificate[];
  downloadedModuleIds: string[]; // for offline study
  lastUpdated: number;
}

// Backward-compatibility wrappers
export interface Lesson {
  id: string;
  topicId: string;
  title: string;
  durationMinutes: number;
  summary: string;
  content: string[];
  practicalTip: string;
  iconName: string;
}

export interface Topic {
  id: string;
  title: string;
  description: string;
  icon: string;
  lessons: Lesson[];
}

export interface UserLessonProgress {
  userId: string;
  completedLessonIds: string[];
  lastUpdated: number;
}
