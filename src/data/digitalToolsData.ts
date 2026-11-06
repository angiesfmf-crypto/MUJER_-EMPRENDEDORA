import { DigitalTool } from '../types';

export const DIGITAL_TOOLS: DigitalTool[] = [
  // 1. Diseño y Publicidad
  {
    id: 'tool-canva',
    name: 'Canva',
    category: 'Diseño y Publicidad',
    description: 'Plataforma intuitiva de diseño gráfico con plantillas prediseñadas para celulares y computadores.',
    ruralUtility: 'Permite diseñar etiquetas adhesivas para frascos de conservas, empaques de tejidos, tarjetas de presentación campesinas y volantes para ferias sin saber diseño profesional.',
    practicalExample: 'Doña Rosalba (La Quisquina) diseñó las etiquetas de sus mermeladas de guayaba agria en Canva usando su celular: puso el nombre, ingredientes, teléfono y fecha de vencimiento con letras claras y bordes florales.',
    officialUrl: 'https://www.canva.com/es_co/',
    iconType: 'Palette',
    requiresRegistration: true,
    requiresInternet: true,
    pricingModel: 'Gratis con opciones Pro',
    popularTag: 'Más Utilizada en el Campo',
    tips: [
      'Descarga tus diseños en formato "PDF para imprimir" cuando vayas a la papelería de Palmira para que las etiquetas salgan nítidas.',
      'Aprovecha las plantillas gratuitas con la palabra clave "Artesanal" o "Productos Orgánicos".'
    ]
  },
  {
    id: 'tool-adobe-express',
    name: 'Adobe Express',
    category: 'Diseño y Publicidad',
    description: 'Herramienta ágil para crear carteles, logotipos sencillos y editar imágenes desde el teléfono.',
    ruralUtility: 'Excelente para quitar el fondo de la foto de una mermelada o un bolso de fique con un solo toque y ponerlo sobre un fondo limpio.',
    practicalExample: 'Permite recortar la foto de una planta aromática recién cosechada y agregarle el precio en pesos colombianos para compartirla en estados de WhatsApp.',
    officialUrl: 'https://www.adobe.com/co/express/',
    iconType: 'Sparkles',
    requiresRegistration: true,
    requiresInternet: true,
    pricingModel: 'Gratis con opciones Pro',
    tips: [
      'La función de "Borrar fondo" es gratuita y ayuda a que los productos se vean profesionales como de catálogo.'
    ]
  },

  // 2. Comunicación y Clientes
  {
    id: 'tool-whatsapp-business',
    name: 'WhatsApp Business',
    category: 'Comunicación y Clientes',
    description: 'Versión empresarial gratuita de WhatsApp diseñada específicamente para pequeños negocios y comerciantes.',
    ruralUtility: 'Permite crear un catálogo con fotos, precios y descripciones de tus productos, configurar mensajes de bienvenida automáticos y organizar los pedidos con etiquetas de colores (Ej: "Por entregar", "Pagado", "Fiado").',
    practicalExample: 'Doña Gladys (Rozo) guarda las fotos de sus individuales de croché en su catálogo. Cuando una clienta de Cali le escribe pidiendo precios, le envía el catálogo en un segundo sin tener que buscar foto por foto en su galería.',
    officialUrl: 'https://business.whatsapp.com/products/business-app?lang=es_LA',
    iconType: 'MessageSquare',
    requiresRegistration: true,
    requiresInternet: true,
    pricingModel: '100% Gratuito',
    popularTag: 'Indispensable',
    tips: [
      'Configura un mensaje de ausencia amable: "¡Hola! Estoy en mi huerta o en el fogón, en cuanto me desocupe con gusto te atiendo".',
      'Usa las etiquetas para no confundir los pedidos que bajan a la galería de Palmira los viernes.'
    ]
  },

  // 3. Organización y Archivos
  {
    id: 'tool-google-drive',
    name: 'Google Drive',
    category: 'Organización y Archivos',
    description: 'Servicio de almacenamiento seguro en la nube de Google con 15 GB gratuitos por cada cuenta de Gmail.',
    ruralUtility: 'Guarda copias de respaldo de tus fotos de productos en alta calidad, recibos de compra de insumos, listas de precios pasadas y documentos del negocio para que no se pierdan si se te daña o moja el celular en la finca.',
    practicalExample: 'Carmen Tulia (El Bolo) guarda carpetas organizadas por año con fotos de su vivero: "Plantas 2024", "Facturas de Abono" y "Certificados de Cursos".',
    officialUrl: 'https://drive.google.com/',
    iconType: 'FolderGit2',
    requiresRegistration: true,
    requiresInternet: true,
    pricingModel: 'Plan Gratuito Permanente',
    tips: [
      'Puedes activar la opción "Disponible sin conexión" en las fotos o listas que vayas a necesitar cuando viajes a una vereda sin señal.'
    ]
  },

  // 4. Hojas de Cálculo y Administración
  {
    id: 'tool-google-sheets',
    name: 'Hojas de Cálculo de Google (Sheets)',
    category: 'Hojas de Cálculo y Administración',
    description: 'Planilla de cálculo digital en línea que suma, resta y calcula totales automáticamente desde el celular.',
    ruralUtility: 'Lleva el control de costos de producción: suma el azúcar, frascos, leña, pasajes y calcula cuánto ganas en cada lote sin necesidad de hacer cuentas en papelitos sueltos que se traspapelan.',
    practicalExample: 'Crear una plantilla simple con columnas: Fecha, Fruta comprada ($), Azúcar ($), Frascos ($), Total Invertido ($) y Total Vendido ($).',
    officialUrl: 'https://docs.google.com/spreadsheets/',
    iconType: 'Table',
    requiresRegistration: true,
    requiresInternet: false, // works offline on mobile
    pricingModel: '100% Gratuito',
    tips: [
      'Instala la aplicación en tu celular y activa el acceso sin conexión para revisar tus costos mientras estás en la feria.'
    ]
  },

  // 5. Formularios y Encuestas
  {
    id: 'tool-google-forms',
    name: 'Google Forms (Formularios)',
    category: 'Formularios y Encuestas',
    description: 'Herramienta para crear encuestas y cuestionarios que los clientes pueden responder desde cualquier celular.',
    ruralUtility: 'Ideal para recibir pedidos anticipados antes de bajar a la feria del Parque Bolívar o al mercado campesino de Palmira. Así sabes exactamente cuántos frascos o paquetes empacar.',
    practicalExample: 'Doña Rosalba envía un enlace por los grupos de WhatsApp los miércoles: "Haz tu pedido de arequipe y conservas para entregártelo este sábado en el parque". Los clientes eligen productos y ponen su dirección.',
    officialUrl: 'https://docs.google.com/forms/',
    iconType: 'ClipboardList',
    requiresRegistration: true,
    requiresInternet: true,
    pricingModel: '100% Gratuito',
    tips: [
      'Pide pocos datos: Nombre, Teléfono, Qué productos desea y Lugar de entrega en Palmira.'
    ]
  },

  // 6. Redes Sociales y Marketing
  {
    id: 'tool-meta-business',
    name: 'Meta Business Suite',
    category: 'Redes Sociales y Marketing',
    description: 'Aplicación oficial para gestionar tu página de Facebook y tu cuenta de Instagram de tu negocio desde un solo lugar.',
    ruralUtility: 'Permite publicar la misma foto de tus productos en Facebook e Instagram al mismo tiempo, programar publicaciones para toda la semana y responder los mensajes de clientas sin tener que abrir dos aplicaciones diferentes.',
    practicalExample: 'Los domingos por la tarde, Doña Gladys programa las fotos de sus mochilas tejidas para que salgan automáticamente los martes y jueves a las 6:00 p.m., cuando las personas de la ciudad descansan y miran el celular.',
    officialUrl: 'https://business.facebook.com/',
    iconType: 'Share2',
    requiresRegistration: true,
    requiresInternet: true,
    pricingModel: '100% Gratuito',
    tips: [
      'Vincular tu página de Facebook con tu Instagram te ahorra la mitad del tiempo de promoción en redes.'
    ]
  },

  // 7. Pagos y Finanzas Rurales
  {
    id: 'tool-nequi',
    name: 'Nequi Colombia',
    category: 'Pagos y Finanzas Rurales',
    description: 'Billetera digital del Grupo Bancolombia que permite enviar y recibir dinero desde el celular sin cuota de manejo.',
    ruralUtility: 'Permite cobrar a cualquier persona en la feria campesina mostrándole tu código QR impreso, sin necesidad de dar cambio en monedas ni arriesgarte con billetes falsos.',
    practicalExample: 'Colocar tu código QR plastificado en tu puesto del mercado: las clientas lo escanean, te pagan al instante y el dinero queda guardado en tu cuenta.',
    officialUrl: 'https://www.nequi.com.co/',
    iconType: 'Smartphone',
    requiresRegistration: true,
    requiresInternet: true,
    pricingModel: 'Billetera Móvil Sin Cobro',
    popularTag: 'El Más Usado para Cobrar',
    tips: [
      'Crea un "Bolsillo" llamado "Plata del Negocio" para no gastarte las ganancias en el mercado diario de la casa.',
      'Siempre verifica el mensaje de texto de confirmación antes de entregar tu producto.'
    ]
  },
  {
    id: 'tool-daviplata',
    name: 'Daviplata',
    category: 'Pagos y Finanzas Rurales',
    description: 'Depósito de dinero electrónico de Davivienda para transferir y recibir pagos sin costos de mantenimiento.',
    ruralUtility: 'Excelente alternativa a Nequi muy común entre funcionarios, docentes y compradores de Palmira y el Valle del Cauca.',
    practicalExample: 'Tener ambos códigos (Nequi y Daviplata) pegados en una tablita de madera garantiza que nunca pierdas una venta por falta de método de pago.',
    officialUrl: 'https://www.daviplata.com/',
    iconType: 'CreditCard',
    requiresRegistration: true,
    requiresInternet: true,
    pricingModel: 'Billetera Móvil Sin Cobro',
    tips: [
      'Puedes retirar en cualquier cajero Davivienda de Palmira sin pagar comisión con un código temporal.'
    ]
  },

  // 8. Video y Contenido Móvil
  {
    id: 'tool-capcut',
    name: 'CapCut',
    category: 'Video y Contenido Móvil',
    description: 'Editor de video gratuito para celular muy fácil de utilizar con música campesina, textos y efectos.',
    ruralUtility: 'Permite grabar videos cortos de cómo revuelves el arequipe en la paila de cobre, cómo riegas las plantas aromáticas en la mañana o cómo tejes en telar, agregando música y títulos claros.',
    practicalExample: 'Un video de 15 segundos mostrando el vapor saliendo del dulce de brevas genera muchas ganas de comprar en personas que viven en Palmira o Cali y extrañan el campo.',
    officialUrl: 'https://www.capcut.com/es-es/',
    iconType: 'Video',
    requiresRegistration: false,
    requiresInternet: false, // editing works offline
    pricingModel: 'Gratis con opciones Pro',
    tips: [
      'Graba siempre con el celular en vertical y con luz natural de la mañana en el corredor de tu casa.'
    ]
  },

  // 9. Presencia Local y Mapas
  {
    id: 'tool-google-maps-business',
    name: 'Perfil de Empresa en Google (Google Maps)',
    category: 'Redes Sociales y Marketing',
    description: 'Servicio gratuito de Google para que tu negocio o taller rural aparezca en Google Maps y en el buscador.',
    ruralUtility: 'Cuando turistas o familias de Palmira y Cali buscan "Vivero en Rozo" o "Dulces típicos en La Quisquina", tu negocio aparecerá con tu foto, teléfono, horario y ubicación exacta.',
    practicalExample: 'Carmen Tulia registró su vivero en Google Maps: ahora los turistas que visitan Rozo los fines de semana llegan directo usando el GPS de su carro.',
    officialUrl: 'https://www.google.com/intl/es-419_co/business/',
    iconType: 'MapPin',
    requiresRegistration: true,
    requiresInternet: true,
    pricingModel: '100% Gratuito',
    popularTag: 'Atrae Turistas al Campo',
    tips: [
      'Pide a tus clientas satisfechas que te dejen una reseña de 5 estrellas comentando lo rico de tus productos.'
    ]
  }
];
