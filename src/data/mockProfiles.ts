import { UserProfile, Product, Sale } from '../types';

export const DEMO_PROFILES: UserProfile[] = [
  {
    id: 'user-rosalba-001',
    name: 'María Rosalba Gómez',
    documentId: '31.482.901',
    phone: '318 421 9054',
    email: 'rosalba.dulces@ruralpalmira.co',
    businessName: 'Dulces y Conservas El Paraíso',
    businessCategory: 'Alimentos y Conservas',
    location: 'Vereda La Quisquina',
    description: 'Elaboración de arequipe tradicional en paila de cobre, conservas de brevas en almíbar de panela y mermelada artesanal de guayaba agria cultivada en nuestra finca campesina.',
    isDemoProfile: true
  },
  {
    id: 'user-gladys-002',
    name: 'Gladys Helena Caicedo',
    documentId: '66.890.312',
    phone: '315 762 1198',
    email: 'gladys.bordados@ruralpalmira.co',
    businessName: 'Artesanías y Bordados Roceños',
    businessCategory: 'Artesanías y Textiles',
    location: 'Corregimiento Rozo',
    description: 'Tejidos a mano en croché, manteles calados y accesorios ecológicos en fique y algodón teñidos con tinturas vegetales de la región del Valle del Cauca.',
    isDemoProfile: true
  },
  {
    id: 'user-carmen-003',
    name: 'Carmen Tulia Morales',
    documentId: '29.541.208',
    phone: '312 903 4410',
    email: 'carmen.aromaticas@ruralpalmira.co',
    businessName: 'Vivero y Plantas Aromáticas La Esperanza',
    businessCategory: 'Plantas y Vivero',
    location: 'Corregimiento El Bolo',
    description: 'Producción limpia y agroecológica de plántulas aromáticas, plantas medicinales vivas y condimentos deshidratados al sol para cocina tradicional campesina.',
    isDemoProfile: true
  }
];

export const INITIAL_DEMO_PRODUCTS: Product[] = [
  // Productos de María Rosalba Gómez (user-rosalba-001)
  {
    id: 'prod-ros-1',
    userId: 'user-rosalba-001',
    name: 'Arequipe Tradicional en Paila',
    description: 'Arequipe cremoso con leche recién ordeñada en la vereda y panela orgánica, batido a mano en paila de cobre.',
    price: 12000,
    stock: 18,
    unit: 'frasco',
    category: 'Alimentos y Conservas',
    minStockAlert: 5,
    createdAt: Date.now() - 86400000 * 5,
    updatedAt: Date.now() - 86400000 * 1
  },
  {
    id: 'prod-ros-2',
    userId: 'user-rosalba-001',
    name: 'Mermelada de Guayaba Agria Casera',
    description: 'Receta de la abuela con guayabas del solar, sin conservantes químicos ni colorantes artificiales.',
    price: 10500,
    stock: 14,
    unit: 'frasco',
    category: 'Alimentos y Conservas',
    minStockAlert: 5,
    createdAt: Date.now() - 86400000 * 4,
    updatedAt: Date.now() - 86400000 * 2
  },
  {
    id: 'prod-ros-3',
    userId: 'user-rosalba-001',
    name: 'Conserva de Brevas en Almíbar de Panela',
    description: 'Brevas caladas lentamente con canela y clavo de olor. Ideales para acompañar con queso campesino.',
    price: 15000,
    stock: 9,
    unit: 'frasco',
    category: 'Alimentos y Conservas',
    minStockAlert: 4,
    createdAt: Date.now() - 86400000 * 3,
    updatedAt: Date.now() - 86400000 * 1
  },
  {
    id: 'prod-ros-4',
    userId: 'user-rosalba-001',
    name: 'Desamargado Tradicional Vallecaucano',
    description: 'Dulce típico con cáscara de naranja agria, limón y breva. Especial para ferias y pedidos por encargo.',
    price: 18000,
    stock: 3, // Alerta de stock bajo
    unit: 'frasco',
    category: 'Alimentos y Conservas',
    minStockAlert: 5,
    createdAt: Date.now() - 86400000 * 2,
    updatedAt: Date.now() - 86400000 * 1
  },

  // Productos de Gladys Helena Caicedo (user-gladys-002)
  {
    id: 'prod-gla-1',
    userId: 'user-gladys-002',
    name: 'Juego de 4 Individuales Calados en Algodón',
    description: 'Individuales tejidos a mano con puntada típica vallecaucana, resistentes al lavado y muy elegantes.',
    price: 45000,
    stock: 6,
    unit: 'paquete',
    category: 'Artesanías y Textiles',
    minStockAlert: 3,
    createdAt: Date.now() - 86400000 * 6,
    updatedAt: Date.now() - 86400000 * 2
  },
  {
    id: 'prod-gla-2',
    userId: 'user-gladys-002',
    name: 'Camino de Mesa Bordado Rozo',
    description: 'Pieza de 1.40m en lino rústico con bordado en punto de cruz con motivos florales de nuestra flora local.',
    price: 55000,
    stock: 4,
    unit: 'unidad',
    category: 'Artesanías y Textiles',
    minStockAlert: 2,
    createdAt: Date.now() - 86400000 * 5,
    updatedAt: Date.now() - 86400000 * 1
  },
  {
    id: 'prod-gla-3',
    userId: 'user-gladys-002',
    name: 'Mochila de Fique y Trapillo Artesanal',
    description: 'Bolso amplio y resistente elaborado con fibras naturales para compras o paseos.',
    price: 38000,
    stock: 8,
    unit: 'unidad',
    category: 'Artesanías y Textiles',
    minStockAlert: 3,
    createdAt: Date.now() - 86400000 * 4,
    updatedAt: Date.now() - 86400000 * 3
  },
  {
    id: 'prod-gla-4',
    userId: 'user-gladys-002',
    name: 'Agarraderas de Cocina en Croché (Par)',
    description: 'Doble tejido grueso para no quemarse al bajar la paila o el caldero del fogón.',
    price: 14000,
    stock: 12,
    unit: 'paquete',
    category: 'Artesanías y Textiles',
    minStockAlert: 4,
    createdAt: Date.now() - 86400000 * 3,
    updatedAt: Date.now() - 86400000 * 1
  },

  // Productos de Carmen Tulia Morales (user-carmen-003)
  {
    id: 'prod-car-1',
    userId: 'user-carmen-003',
    name: 'Maceta de Menta y Hierbabuena Agroecológica',
    description: 'Planta enraizada en tierra abonada con compost de la finca, lista para cosechar en la cocina.',
    price: 8000,
    stock: 25,
    unit: 'unidad',
    category: 'Plantas y Vivero',
    minStockAlert: 5,
    createdAt: Date.now() - 86400000 * 7,
    updatedAt: Date.now() - 86400000 * 2
  },
  {
    id: 'prod-car-2',
    userId: 'user-carmen-003',
    name: 'Orégano y Tomillo Deshidratado al Sol',
    description: 'Cosechado en luna menguante y secado en bastidor solar para concentrar todo su aroma.',
    price: 7500,
    stock: 16,
    unit: 'frasco',
    category: 'Plantas y Vivero',
    minStockAlert: 5,
    createdAt: Date.now() - 86400000 * 6,
    updatedAt: Date.now() - 86400000 * 1
  },
  {
    id: 'prod-car-3',
    userId: 'user-carmen-003',
    name: 'Plántula de Albahaca Morada y Verde',
    description: 'Variedad aromática ideal para ahuyentar plagas en huertas caseras y sazonar salsas.',
    price: 6500,
    stock: 20,
    unit: 'unidad',
    category: 'Plantas y Vivero',
    minStockAlert: 6,
    createdAt: Date.now() - 86400000 * 4,
    updatedAt: Date.now() - 86400000 * 2
  },
  {
    id: 'prod-car-4',
    userId: 'user-carmen-003',
    name: 'Infusión de Toronjil, Cidrón y Manzanilla',
    description: 'Mezcla relajante tradicional de hojas secas enteras para dormir bien.',
    price: 9000,
    stock: 3, // Alerta stock bajo
    unit: 'paquete',
    category: 'Plantas y Vivero',
    minStockAlert: 5,
    createdAt: Date.now() - 86400000 * 3,
    updatedAt: Date.now() - 86400000 * 1
  }
];

export const INITIAL_DEMO_SALES: Sale[] = [
  // Ventas de María Rosalba
  {
    id: 'sale-ros-1',
    userId: 'user-rosalba-001',
    date: Date.now() - 86400000 * 2,
    items: [
      {
        productId: 'prod-ros-1',
        productName: 'Arequipe Tradicional en Paila',
        unitPrice: 12000,
        quantity: 2,
        subtotal: 24000
      },
      {
        productId: 'prod-ros-2',
        productName: 'Mermelada de Guayaba Agria Casera',
        unitPrice: 10500,
        quantity: 1,
        subtotal: 10500
      }
    ],
    totalAmount: 34500,
    paymentMethod: 'Nequi / Daviplata',
    customerName: 'Doña Amparo (Parque Bolívar)',
    customerNotes: 'Entrega en la feria campesina de Palmira',
    synced: true
  },
  {
    id: 'sale-ros-2',
    userId: 'user-rosalba-001',
    date: Date.now() - 86400000 * 1,
    items: [
      {
        productId: 'prod-ros-3',
        productName: 'Conserva de Brevas en Almíbar de Panela',
        unitPrice: 15000,
        quantity: 2,
        subtotal: 30000
      }
    ],
    totalAmount: 30000,
    paymentMethod: 'Efectivo',
    customerName: 'Don Jaime Vereda',
    customerNotes: 'Pago al contado en la puerta de la finca',
    synced: true
  }
];
