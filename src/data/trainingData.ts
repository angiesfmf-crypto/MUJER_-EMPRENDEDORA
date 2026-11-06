import { Topic } from '../types';

export const TRAINING_TOPICS: Topic[] = [
  {
    id: 'topic-1',
    title: 'Finanzas Digitales y Billeteras Móviles',
    description: 'Aprende a recibir pagos por Nequi y Daviplata sin intermediarios ni cobros sorpresa en el campo.',
    icon: 'Smartphone',
    lessons: [
      {
        id: 'lesson-1-1',
        topicId: 'topic-1',
        title: 'Cómo cobrar con código QR en ferias y en tu vereda',
        durationMinutes: 6,
        summary: 'Imprime o muestra tu código QR para que los clientes te paguen sin necesidad de tener efectivo o cambio.',
        content: [
          'El código QR de Nequi o Daviplata permite que cualquier persona con un celular escanee tu número y te transfiera al instante sin pagar comisiones.',
          'Puedes pedirle a un familiar o en el telecentro de Palmira que te imprima tu código en una hoja y plastificarlo para tenerlo en tu puesto o en la puerta de tu casa.',
          'Siempre verifica en tu aplicación el mensaje de texto de confirmación antes de entregar el producto. Nunca confíes solo en la captura de pantalla que te muestra el comprador.'
        ],
        practicalTip: 'Consejo rural: Pega tu código QR sobre una tablita de madera o cartulina reciclada. Así no se dobla con el viento en las ferias campesinas.',
        iconName: 'QrCode'
      },
      {
        id: 'lesson-1-2',
        topicId: 'topic-1',
        title: 'Separar el dinero del negocio del dinero de la casa',
        durationMinutes: 8,
        summary: 'La regla de oro para no descapitalizarse: crear un "Bolsillo" o cuenta separada para el emprendimiento.',
        content: [
          'Uno de los errores más comunes es mezclar la plata de las ventas con los gastos diarios de la comida o del hogar.',
          'Crea un "Bolsillo" digital en tu billetera móvil llamado "Mercancía y Ahorro Negocio".',
          'Cada vez que hagas una venta, aparta el costo de reposición y solo considera como tu salario una parte fija acordada al final de la semana o mes.'
        ],
        practicalTip: 'Consejo rural: Si vendes $50.000 de conservas y el costo fue $28.000, pasa inmediatamente los $28.000 al bolsillo digital para comprar nuevos frascos y fruta.',
        iconName: 'PiggyBank'
      }
    ]
  },
  {
    id: 'topic-2',
    title: 'WhatsApp Business para Emprendedoras',
    description: 'Transforma tu WhatsApp personal en una tienda digital con catálogo organizado para clientes de Palmira y Cali.',
    icon: 'MessageSquare',
    lessons: [
      {
        id: 'lesson-2-1',
        topicId: 'topic-2',
        title: 'Creando tu Catálogo Digital de Productos',
        durationMinutes: 7,
        summary: 'Sube tus fotos, precios y descripciones para que tus clientes vean todo sin preguntarte uno por uno.',
        content: [
          'WhatsApp Business te permite crear una vitrina virtual gratuita sin pagar página web.',
          'En Ajustes > Herramientas de la empresa > Catálogo, añade cada producto con su nombre claro, precio en pesos colombianos y fotos nítidas.',
          'Puedes compartir el enlace de tu catálogo completo en grupos de vecinos, juntas de acción comunal o con clientes que te visitaron en la feria.'
        ],
        practicalTip: 'Consejo rural: Actualiza el catálogo cuando se te acabe la fruta de temporada o los frascos para no crear falsas expectativas en los compradores.',
        iconName: 'ShoppingBag'
      },
      {
        id: 'lesson-2-2',
        topicId: 'topic-2',
        title: 'Mensajes de bienvenida y respuestas rápidas',
        durationMinutes: 5,
        summary: 'Ahorra tiempo respondiendo dudas frecuentes con un solo toque en tu teclado.',
        content: [
          'Configura un saludo amable con tu nombre, el nombre de tu emprendimiento y la vereda de Palmira donde produces.',
          'Usa las "Respuestas Rápidas" con el comando "/" para guardar tu dirección de entregas, horarios de despacho a Palmira centro y tus datos de Nequi.',
          'Esto te permite contestar a tus clientes en segundos incluso mientras estás cocinando o cuidando la huerta.'
        ],
        practicalTip: 'Ejemplo de respuesta rápida: "¡Hola vecino! Despachamos todos los viernes a Palmira urbana. Tu pedido llega fresquito de la vereda La Quisquina."',
        iconName: 'Send'
      }
    ]
  },
  {
    id: 'topic-3',
    title: 'Fotografía de Productos con tu Celular',
    description: 'Aprende a tomar fotos luminosas y profesionales aprovechando la luz natural del campo vallecaucano.',
    icon: 'Camera',
    lessons: [
      {
        id: 'lesson-3-1',
        topicId: 'topic-3',
        title: 'La magia de la luz de la mañana en la vereda',
        durationMinutes: 6,
        summary: 'No necesitas focos caros; la luz de 7:00 a.m. a 9:30 a.m. hace resaltar los colores de tus productos.',
        content: [
          'Limpia el lente de la cámara de tu celular con una tela suave o tu delantal antes de disparar. El sudor o la grasa empañan las fotos sin que te des cuenta.',
          'Coloca tus productos cerca de una ventana o en el corredor de la finca donde haya sombra con mucha claridad, nunca bajo el sol directo del mediodía porque quema los colores.',
          'Utiliza fondos que transmitan el origen campesino: una tabla de madera limpia, una hoja de plátano fresca o un mantel blanco sencillo.'
        ],
        practicalTip: 'Consejo rural: Coloca una hoja blanca de papel bond al lado opuesto de la ventana para que actúe como reflector y aclare las sombras oscuras.',
        iconName: 'Sun'
      }
    ]
  },
  {
    id: 'topic-4',
    title: 'Costos Reales y Precios Justos',
    description: 'Valora tu tiempo, mano de obra y gastos de transporte desde la zona rural hasta los puntos de venta.',
    icon: 'TrendingUp',
    lessons: [
      {
        id: 'lesson-4-1',
        topicId: 'topic-4',
        title: 'Incluir tu propio sueldo campesino en el costo',
        durationMinutes: 9,
        summary: 'Tu tiempo y conocimiento tienen valor; no vendas tus productos como si tu trabajo fuera gratis.',
        content: [
          'Muchas mujeres rurales calculan el precio sumando solo la azúcar, los envases y la fruta, pero olvidan sumar las 4 horas que pasaron frente al fogón revolviendo la paila.',
          'Mide cuántas horas te toma elaborar cada lote de productos y asígnate un valor por hora digno.',
          'Suma también los gastos invisibles: el gas o la leña, las etiquetas, y el pasaje en chiva o mototaxi hasta la galería central o parque de Palmira.'
        ],
        practicalTip: 'Fórmula básica: Costos de materiales + Tu mano de obra + Transporte + 25% de ganancia para reinversión = Precio de Venta Justo.',
        iconName: 'Calculator'
      }
    ]
  },
  {
    id: 'topic-5',
    title: 'Ferias Campesinas y Emprendimiento Asociativo',
    description: 'Estrategias para destacar en el Parque Bolívar de Palmira y crear alianzas con otras productoras rurales.',
    icon: 'Users',
    lessons: [
      {
        id: 'lesson-5-1',
        topicId: 'topic-5',
        title: 'La fuerza de unirse entre vecinas de la vereda',
        durationMinutes: 7,
        summary: 'Compartir fletes y apoyarse en turnos de venta multiplica tus ganancias y reduce el cansancio.',
        content: [
          'Si vas a bajar a la feria campesina de Palmira, ponte de acuerdo con otras dos productoras de tu vereda para compartir el transporte de la mercancía.',
          'Mientras una atiende el puesto por la mañana, la otra puede coordinar las entregas a domicilio o descansar.',
          'Crear una canasta combinada (por ejemplo: mermelada de La Quisquina + pan artesanal de Rozo) resulta muy atractiva para los compradores de la ciudad.'
        ],
        practicalTip: 'Consejo rural: En tu puesto pon siempre un cartelito que diga de qué vereda eres: "Cultivado con amor en Rozo, Palmira". A la gente le encanta saber el origen.',
        iconName: 'Award'
      }
    ]
  }
];
