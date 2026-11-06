import { AcademyModule } from '../types';

export const ACADEMY_MODULES: AcademyModule[] = [
  // ==================== MÓDULO 1 ====================
  {
    id: 'mod-1-admin',
    order: 1,
    title: 'Administración y Organización del Emprendimiento',
    shortTitle: 'Organización del Negocio',
    category: 'Gestión',
    estimatedHours: 2,
    iconName: 'Building2',
    certificateTitle: 'Liderazgo y Gestión del Emprendimiento Rural',
    description: 'Aprende a estructurar tu negocio campesino, organizar tus tiempos entre las labores del hogar y la producción, y definir metas claras de crecimiento.',
    objectives: [
      'Diferenciar entre las finanzas del hogar y el patrimonio del negocio.',
      'Organizar los tiempos diarios de producción para no sobrecargarse.',
      'Establecer metas semanales y mensuales de producción y ventas.'
    ],
    lessons: [
      {
        id: 'les-1-1',
        moduleId: 'mod-1-admin',
        order: 1,
        title: 'El Emprendimiento como Proyecto de Vida Rural',
        durationMinutes: 8,
        summary: 'Reconocer el valor de tu conocimiento ancestral y transformarlo en un negocio formal organizado.',
        introduction: 'Ser mujer rural y emprendedora en Palmira significa transformar los saberes de la tierra —la dulcería, el bordado, las plantas medicinales— en autonomía económica.',
        contentSections: [
          {
            subtitle: '1. ¿Qué significa formalizar mi emprendimiento rural?',
            body: [
              'Formalizar no significa necesariamente pagar impuestos complejos de inmediato; significa tener claridad en tus procesos, saber qué produces, cuánto te cuesta y quién te compra.',
              'Muchas mujeres en las veredas trabajan incansablemente pero no ven el fruto porque regalan su tiempo o no llevan un registro de sus capacidades productivas.'
            ],
            highlightBox: 'Regla de Oro: Todo lo que produce tu finca o tus manos tiene un valor económico real. Tu trabajo campesino no es gratis.'
          },
          {
            subtitle: '2. Separación de roles: La casa y el taller',
            body: [
              'Uno de los mayores desafíos para las emprendedoras del campo es que el taller de confección o la cocina de conservas está dentro del mismo hogar.',
              'Es vital fijar horarios de producción: por ejemplo, de 8:00 a.m. a 12:00 m. se dedica exclusivamente a elaborar productos, sin interrupciones de oficio doméstico.'
            ],
            tableData: {
              headers: ['Actividad', 'Horario Aconsejado', 'Beneficio'],
              rows: [
                ['Elaboración / Cosecha', '7:00 a.m. - 11:30 a.m.', 'Aprovechar la frescura del día'],
                ['Empaque y Etiquetado', '2:00 p.m. - 4:00 p.m.', 'Espacio limpio sin calor del fogón'],
                ['Atención a Clientes en WhatsApp', '4:30 p.m. - 6:30 p.m.', 'Momento de descanso de clientas']
              ]
            }
          }
        ],
        practicalCase: {
          title: 'El caso de Doña Rosalba en La Quisquina',
          entrepreneurName: 'María Rosalba Gómez',
          location: 'Vereda La Quisquina - Palmira',
          story: 'Doña Rosalba cocinaba arequipe mientras lavaba ropa y atendía a sus nietos. A menudo el dulce se le ahumaba o se le olvidaba cuántos frascos había llenado.',
          solution: 'Estableció los martes y jueves como sus "Días de Paila": esos días su familia se encarga del almuerzo y ella produce 25 frascos continuos sin interrupciones.',
          keyTakeaway: 'Organizar tus días de producción aumenta el rendimiento y evita mermas o accidentes con el fogón.'
        },
        activity: {
          id: 'act-1-1',
          title: 'Horario Productivo Semanal',
          instruction: 'Define los dos días principales en los que vas a producir tu producto estrella.',
          exerciseType: 'checklist',
          steps: [
            'Selecciona 2 mañanas a la semana dedicadas solo a producir.',
            'Informa a tu familia para que respeten tu espacio de trabajo.',
            'Prepara todos los insumos y frascos el día anterior.'
          ],
          hint: 'Producir por lotes grandes dos días es mucho más económico que encender la leña o el gas todos los días para dos o tres frascos.'
        },
        practicalTip: 'Coloca un cartel en la puerta de tu cocina o taller que diga: "Horario de Producción - Por favor volver a las 12:00 m.".',
        keyTakeaways: [
          'Tu tiempo de elaboración debe respetarse como un empleo formal.',
          'Producir en días fijos ahorra combustible e ingredientes.',
          'La familia debe ser tu principal aliada, no una carga adicional.'
        ]
      },
      {
        id: 'les-1-2',
        moduleId: 'mod-1-admin',
        order: 2,
        title: 'Fijación de Metas y Propósito del Negocio',
        durationMinutes: 7,
        summary: 'Cómo pasar del "vendo lo que salga" a planear cuántas ventas necesitas al mes.',
        introduction: 'Tener una meta clara te permite saber si estás avanzando o si estás estancada. Las metas deben ser realistas y medibles en frascos, tejidos o pesos.',
        contentSections: [
          {
            subtitle: '1. La regla de la Meta Semanal',
            body: [
              'En lugar de pensar en el año entero, divide tu meta por semanas de mercado. Si tu objetivo es ganarte $600.000 limpios al mes, necesitas generar $150.000 semanales.',
              'Calcula cuántos productos equivalen a esa cifra: por ejemplo, vender 15 frascos de conserva o 4 juegos de individuales tejidos.'
            ]
          }
        ],
        practicalTip: 'Anota tu meta semanal en una cartulina pegada junto a tu cama o en el refrigerador.',
        keyTakeaways: [
          'Una meta pequeña semanal es fácil de cumplir.',
          'Revisa cada domingo si alcanzaste tu objetivo de ventas.'
        ]
      }
    ],
    quiz: {
      id: 'quiz-mod-1',
      title: 'Evaluación: Organización del Emprendimiento',
      passingScorePercent: 75,
      questions: [
        {
          id: 'q1-1',
          question: '¿Cuál es la forma más eficiente de organizar la elaboración de tus productos en el campo?',
          options: [
            'Cocinar o tejer un poquito todos los días a cualquier hora.',
            'Definir días y horarios fijos dedicados exclusivamente a la producción por lotes.',
            'Esperar a que una clienta llegue a la casa para empezar a producir.',
            'Trabajar únicamente de noche después de hacer todo el aseo de la casa.'
          ],
          correctIndex: 1,
          explanation: 'Producir por lotes en días fijos ahorra combustible, evita interrupciones y garantiza una calidad uniforme.'
        },
        {
          id: 'q1-2',
          question: '¿Por qué es fundamental fijar una meta semanal de ventas?',
          options: [
            'Para endeudarse con el banco rápidamente.',
            'Para saber exactamente cuántos productos debes elaborar y saber si tu negocio está progresando.',
            'Para obligar a los vecinos a comprarte aunque no lo necesiten.',
            'Para cobrar más caro a las personas de la ciudad.'
          ],
          correctIndex: 1,
          explanation: 'La meta semanal te permite planear tus compras de materia prima y saber si tus ganancias cubren tus necesidades.'
        }
      ]
    }
  },

  // ==================== MÓDULO 2 ====================
  {
    id: 'mod-2-inventarios',
    order: 2,
    title: 'Gestión y Control de Inventarios',
    shortTitle: 'Control de Inventarios',
    category: 'Gestión',
    estimatedHours: 2,
    iconName: 'Boxes',
    certificateTitle: 'Especialista en Control de Inventarios y Existencias',
    description: 'Evita perder dinero por fruta dañada, frascos rotos o quedarte sin mercancía en plena feria campesina.',
    objectives: [
      'Registrar entradas y salidas de productos sin equivocarse.',
      'Calcular el stock mínimo de seguridad para ferias.',
      'Prevenir mermas y pérdidas de materias primas perecederas.'
    ],
    lessons: [
      {
        id: 'les-2-1',
        moduleId: 'mod-2-inventarios',
        order: 1,
        title: 'El Inventario: El Dinero que Tienes en los Estantes',
        durationMinutes: 9,
        summary: 'Comprender que cada producto terminado en tu estante es dinero en efectivo esperando a ser vendido.',
        introduction: 'El inventario no son solo frascos o plantas; es dinero en efectivo que invertiste y que no puedes gastar hasta que se venda.',
        contentSections: [
          {
            subtitle: '1. Los tres tipos de inventario en el campo',
            body: [
              'a) Materias Primas: La fruta cosechada, panela, hilos de fique, semillas, abono y frascos vacíos.',
              'b) Productos en Proceso: Frutas desamargándose, brevas calándose o tejidos a medio terminar.',
              'c) Productos Terminados: Frascos sellados y etiquetados listos para entregar a la clienta.'
            ]
          },
          {
            subtitle: '2. El método "Lo Primero que Entra, Primero que Sale" (PEPS)',
            body: [
              'Siempre coloca los frascos o productos del lote más antiguo adelante, y los recién elaborados atrás.',
              'Esto evita que un frasco se quede seis meses en el rincón y pierda su sabor o frescura.'
            ],
            highlightBox: 'Consejo Campesino: Marca con un marcador permanente el mes y año de elaboración en la tapa de cada frasco (Ej: 11/24).'
          }
        ],
        practicalCase: {
          title: 'El error de la fruta en el Corregimiento El Bolo',
          entrepreneurName: 'Carmen Tulia Morales',
          location: 'Corregimiento El Bolo - Palmira',
          story: 'Carmen cosechaba albahaca y orégano pero no anotaba cuántas bolsitas tenía empacadas. En una feria le pidieron 20 frascos de orégano y solo tenía 6 listos, perdiendo una venta de $150.000.',
          solution: 'Empezó a usar la alerta de inventario de Mujer Emprendedora: cuando le quedan menos de 5 frascos, la app se lo avisa en color ámbar y ella deshidrata un nuevo lote.',
          keyTakeaway: 'Tener una alerta de stock mínimo asegura que nunca pierdas una venta por falta de producto.'
        },
        activity: {
          id: 'act-2-1',
          title: 'Conteo Físico de Existencias',
          instruction: 'Haz un conteo real de todo lo que tienes terminado en tu casa hoy.',
          exerciseType: 'checklist',
          steps: [
            'Cuenta cuántos productos tienes listos para vender.',
            'Separa los que tengan fecha más antigua para llevarlos a la próxima feria.',
            'Verifica que el número coincida exactamente con lo que tienes anotado en la app.'
          ],
          hint: 'Hacer este conteo los lunes por la mañana te toma solo 10 minutos y te da tranquilidad para toda la semana.'
        },
        practicalTip: 'Guarda tus productos terminados en un lugar seco, fresco y lejos de la luz solar directa para preservar sus colores naturales.',
        keyTakeaways: [
          'Cada producto guardado es dinero invertido.',
          'Aplica siempre rotación: lo más viejo sale primero.',
          'Define una cantidad mínima para que la app te avise antes de que se agote.'
        ]
      }
    ],
    quiz: {
      id: 'quiz-mod-2',
      title: 'Evaluación: Control de Inventarios',
      passingScorePercent: 75,
      questions: [
        {
          id: 'q2-1',
          question: '¿Qué significa la regla PEPS (Primero en entrar, primero en salir)?',
          options: [
            'Vender primero los productos recién hechos porque huelen más rico.',
            'Poner adelante y vender primero los productos elaborados con mayor antigüedad para evitar que se venzan.',
            'Regalar los productos viejos a los vecinos.',
            'No vender nada hasta que no se llene toda la cocina.'
          ],
          correctIndex: 1,
          explanation: 'La rotación de inventarios evita que productos perecederos pierdan frescura o se dañen en los estantes.'
        }
      ]
    }
  },

  // ==================== MÓDULO 3 ====================
  {
    id: 'mod-3-costos',
    order: 3,
    title: 'Costos, Gastos y Fijación de Precios',
    shortTitle: 'Costos y Precios Justos',
    category: 'Finanzas',
    estimatedHours: 3,
    iconName: 'Calculator',
    certificateTitle: 'Costos Justos y Valoración del Trabajo Rural',
    description: 'Aprende a calcular el costo real de tus productos incluyendo tu propia mano de obra y los gastos invisibles de la vereda.',
    objectives: [
      'Diferenciar entre costos directos y gastos indirectos.',
      'Calcular tu propio salario campesino por hora de trabajo.',
      'Fijar precios justos que dejen ganancia real y no pérdidas camufladas.'
    ],
    lessons: [
      {
        id: 'les-3-1',
        moduleId: 'mod-3-costos',
        order: 1,
        title: 'El Error de no Cobrar tu Propio Sueldo',
        durationMinutes: 10,
        summary: 'Por qué muchas mujeres rurales sienten que trabajan mucho pero no ven plata.',
        introduction: 'Si vendes una conserva sumando solo la fruta y el azúcar, estás regalando tu tiempo, tus manos y tu espalda. Aprende a cobrar tu labor dignamente.',
        contentSections: [
          {
            subtitle: '1. La fórmula completa del costo rural',
            body: [
              'Costo Total = Materias Primas + Empaque + Mano de Obra Propia + Gastos Invisibles (gas/leña/transporte) + Margen de Ganancia (25% a 35%).',
              'Si elaborar un lote de 10 mermeladas te toma 4 horas, esas 4 horas deben pagarse como un salario justo por hora.'
            ],
            tableData: {
              headers: ['Concepto para 10 Frascos', 'Valor en Pesos', 'Explicación'],
              rows: [
                ['Guayaba agria (4 kg)', '$12.000 COP', 'Cosechada o comprada'],
                ['Azúcar y panela orgánica', '$8.000 COP', 'Insumos dulces'],
                ['10 Frascos con tapa twist-off', '$18.000 COP', 'Empaque higiénico'],
                ['Gas o leña utilizada', '$6.000 COP', 'Gasto invisible'],
                ['Tu mano de obra (4 horas @ $7.000)', '$28.000 COP', '¡Tu salario digno!'],
                ['Transporte a Palmira', '$8.000 COP', 'Pasaje en motocarro/chiva'],
                ['Total Costo de Producción (10 uds)', '$80.000 COP', 'Costo Unitario: $8.000 COP'],
                ['+ 30% Ganancia para reinversión', '+$2.400 COP', 'Fondo de ahorro'],
                ['Precio de Venta Justo al Público', '$10.500 - $12.000 COP', 'Precio sostenible']
              ]
            }
          }
        ],
        practicalCase: {
          title: 'El mantel bordado de Doña Gladys en Rozo',
          entrepreneurName: 'Gladys Helena Caicedo',
          location: 'Corregimiento Rozo - Palmira',
          story: 'Doña Gladys vendía un camino de mesa bordado a mano en $30.000 COP porque el lino le costaba $18.000. Le quedaban $12.000, pero tardaba dos semanas bordando en sus ratos libres.',
          solution: 'Calculó que dedicaba 18 horas de bordado minucioso. Rediseñó su precio a $55.000 COP explicando a los clientes que es una pieza única artesanal. Los clientes lo pagaron con gusto y ahora valora su arte.',
          keyTakeaway: 'El cliente valora lo que tú valoras. Si cobras muy barato, la gente piensa que es de mala calidad.'
        },
        practicalTip: 'Nunca pidas perdón por tu precio. Explica con orgullo: "Es fruta limpia de mi huerta y me toma 4 horas revolver la paila a mano".',
        keyTakeaways: [
          'Tu tiempo de trabajo es un costo sagrado.',
          'Suma los gastos invisibles: pasajes, gas y etiquetas.',
          'La ganancia es para hacer crecer el negocio, tu sueldo es para tu sustento.'
        ]
      }
    ],
    quiz: {
      id: 'quiz-mod-3',
      title: 'Evaluación: Costos y Precios Justos',
      passingScorePercent: 75,
      questions: [
        {
          id: 'q3-1',
          question: '¿Qué elemento olvidan con mayor frecuencia las emprendedoras rurales al calcular el precio?',
          options: [
            'El costo de los frascos de vidrio.',
            'Su propio tiempo y salario por las horas que dedicaron a elaborar el producto.',
            'El azúcar o la sal.',
            'La etiqueta de papel.'
          ],
          correctIndex: 1,
          explanation: 'Incluir la mano de obra propia es la única manera de que el negocio sea sostenible y no una carga no remunerada.'
        }
      ]
    }
  },

  // ==================== MÓDULO 4 ====================
  {
    id: 'mod-4-ventas',
    order: 4,
    title: 'Registro y Administración de Ventas',
    shortTitle: 'Registro de Ventas',
    category: 'Comercialización',
    estimatedHours: 2,
    iconName: 'ShoppingBag',
    certificateTitle: 'Gestión Comercial y Control de Ventas Rurales',
    description: 'Lleva las cuentas claras de tus ventas diarias, pedidos por encargo y ventas a crédito ("fiado") sin equivocarte.',
    objectives: [
      'Registrar cada venta en el momento exacto en que ocurre.',
      'Manejar las ventas a crédito ("fiado") con fechas límite claras.',
      'Emitir comprobantes sencillos para generar confianza en la clienta.'
    ],
    lessons: [
      {
        id: 'les-4-1',
        moduleId: 'mod-4-ventas',
        order: 1,
        title: 'La Venta no Termina hasta que el Dinero Está en la Mano',
        durationMinutes: 8,
        summary: 'Cómo llevar el control de tus ventas en ferias y cómo manejar el crédito local sin arruinarte.',
        introduction: 'En el campo es común que los vecinos pidan "fiado". Si no llevas un registro estricto, esa plata se pierde con el tiempo.',
        contentSections: [
          {
            subtitle: '1. Registrar de inmediato en la aplicación',
            body: [
              'No esperes a la noche para registrar las ventas: anota cada venta en la aplicación Mujer Emprendedora en el instante en que recibes el pago.',
              'La aplicación calcula el cambio exacto y descuenta del inventario inmediatamente, incluso si no tienes señal celular en la feria.'
            ]
          },
          {
            subtitle: '2. Reglas claras para el crédito local ("Fiado")',
            body: [
              'a) Fija un límite máximo: por ejemplo, nunca fiar más de $30.000 COP por persona.',
              'b) Pon fecha exacta: "Doña Marina, con mucho gusto le fío el dulce para el viernes que bajan la quincena".',
              'c) Regístralo en la app con el método "Crédito Local (Fiado)" para que la deuda quede anotada con nombre y fecha.'
            ]
          }
        ],
        practicalTip: 'Al final de la feria campesina, abre la pantalla de Reportes en Mujer Emprendedora y compara el total vendido con el dinero físico que tienes en tu monedero.',
        keyTakeaways: [
          'Venta no anotada es dinero que se extravía.',
          'El crédito campesino debe tener nombre, fecha y monto límite.'
        ]
      }
    ],
    quiz: {
      id: 'quiz-mod-4',
      title: 'Evaluación: Registro de Ventas',
      passingScorePercent: 75,
      questions: [
        {
          id: 'q4-1',
          question: '¿Por qué es indispensable registrar la venta de inmediato y no al final del día?',
          options: [
            'Porque el teléfono se bloquea si no lo tocas.',
            'Porque en el ajetreo de la feria se olvidan las cantidades y los productos descontados del inventario.',
            'Para que la clienta no pueda devolver el producto.',
            'No es necesario, es mejor hacerlo todo de memoria.'
          ],
          correctIndex: 1,
          explanation: 'Registrar la venta en el acto asegura que el inventario se descuente correctamente y que el dinero coincida al final de la jornada.'
        }
      ]
    }
  },

  // ==================== MÓDULO 5 ====================
  {
    id: 'mod-5-servicio',
    order: 5,
    title: 'Atención al Cliente con Calidez Humana',
    shortTitle: 'Atención al Cliente',
    category: 'Comercialización',
    estimatedHours: 2,
    iconName: 'HeartHandshake',
    certificateTitle: 'Excelencia en Servicio y Relaciones con la Clientela',
    description: 'Transforma a personas que te compran una sola vez en clientas leales que recomiendan tus productos de boca en boca.',
    objectives: [
      'Comunicar el valor campesino y la historia de tus productos con amabilidad.',
      'Resolver quejas o dudas con tranquilidad y soluciones justas.',
      'Fidelizar clientas para que hagan pedidos recurrentes desde la ciudad.'
    ],
    lessons: [
      {
        id: 'les-5-1',
        moduleId: 'mod-5-servicio',
        order: 1,
        title: 'La Historia que hay Detrás de tu Producto',
        durationMinutes: 7,
        summary: 'A la gente de la ciudad no le vendes solo una mermelada o una planta; le vendes el cariño y la tranquilidad del campo.',
        introduction: 'Los compradores de Palmira y Cali aprecian la autenticidad campesina. Tu mejor herramienta de venta es contar tu historia con orgullo.',
        contentSections: [
          {
            subtitle: '1. La prueba de sabor y la sonrisa cálida',
            body: [
              'En las ferias, ofrece siempre una cucharadita de degustación en una galletita o permite oler la planta medicinal.',
              'Dile a la clienta: "Pruébela Doña, es de guayaba agria de mi finca en La Quisquina, cocinada en paila de cobre sin químicos".'
            ]
          }
        ],
        practicalTip: 'Lleva siempre una libreta o pide el WhatsApp de quien te compre para avisarle cuando tengas cosecha fresca.',
        keyTakeaways: [
          'La degustación cierra más ventas que cualquier discurso.',
          'Una clienta satisfecha en Palmira te traerá tres clientas más.'
        ]
      }
    ],
    quiz: {
      id: 'quiz-mod-5',
      title: 'Evaluación: Atención al Cliente',
      passingScorePercent: 75,
      questions: [
        {
          id: 'q5-1',
          question: '¿Qué hace que un cliente de la ciudad prefiera comprarle a una mujer rural antes que en un supermercado grande?',
          options: [
            'Que es mucho más barato que en el supermercado.',
            'La frescura del producto, la elaboración artesanal y el trato cálido y humano de la productora.',
            'Que el producto viene en plástico desechable.',
            'Que la productora no le cobra el transporte.'
          ],
          correctIndex: 1,
          explanation: 'El valor de los productos rurales reside en su origen natural, la receta tradicional y la relación directa con quien lo cultiva.'
        }
      ]
    }
  },

  // ==================== MÓDULO 6 ====================
  {
    id: 'mod-6-marketing',
    order: 6,
    title: 'Marketing y Publicidad Digital',
    shortTitle: 'Marketing Digital',
    category: 'Comercialización',
    estimatedHours: 3,
    iconName: 'Megaphone',
    certificateTitle: 'Estrategias de Promoción y Difusión Digital Rural',
    description: 'Aprende a tomar fotos bonitas con tu celular, diseñar afiches en Canva y redactar mensajes que despierten ganas de comprar.',
    objectives: [
      'Aprovechar la luz natural del campo para tomar fotos profesionales de productos.',
      'Diseñar piezas gráficas sencillas para ferias y estados de WhatsApp.',
      'Crear promociones por temporadas (Navidad, Día de la Madre, Semana Santa).'
    ],
    lessons: [
      {
        id: 'les-6-1',
        moduleId: 'mod-6-marketing',
        order: 1,
        title: 'Fotografía Casera de Alto Impacto con tu Celular',
        durationMinutes: 9,
        summary: 'No necesitas cámaras costosas: la luz de la mañana en la vereda hace maravillas.',
        introduction: 'Una buena foto vende más que cien palabras. Aprende a sacarle provecho a la cámara de tu celular con objetos que ya tienes en tu finca.',
        contentSections: [
          {
            subtitle: '1. Los cuatro mandamientos de la foto rural',
            body: [
              '1. Limpia el lente de la cámara con tu delantal o una tela de algodón suave.',
              '2. Toma la foto de 7:30 a.m. a 9:30 a.m. en el corredor de la finca, donde haya mucha claridad pero sin sol directo que queme la imagen.',
              '3. Usa fondos naturales: una tabla de picar limpia, una hoja de plátano fresca, un mantel de cuadros o un lienzo blanco.',
              '4. Pon al lado del producto los ingredientes reales: dos guayabas frescas junto al frasco de mermelada o unas ramas de menta verde junto al ungüento.'
            ]
          }
        ],
        practicalTip: 'Coloca una hoja blanca de papel bond al lado opuesto de la ventana para reflejar la luz y quitar las sombras oscuras.',
        keyTakeaways: [
          'La luz natural de la mañana es tu mejor aliada.',
          'Los ingredientes naturales al lado del frasco transmiten confianza.',
          'Limpia siempre el lente antes de disparar.'
        ]
      }
    ],
    quiz: {
      id: 'quiz-mod-6',
      title: 'Evaluación: Marketing y Fotografía Digital',
      passingScorePercent: 75,
      questions: [
        {
          id: 'q6-1',
          question: '¿Cuál es el mejor momento y lugar para fotografiar tus productos en la finca?',
          options: [
            'Al mediodía bajo el sol ardiente en el patio.',
            'Por la noche con la luz del bombillo amarillo de la cocina.',
            'En la mañana de 7:30 a 9:30 a.m. en la sombra luminosa del corredor con luz natural indirecta.',
            'En un cuarto oscuro usando el flash del celular.'
          ],
          correctIndex: 2,
          explanation: 'La luz matutina indirecta resalta los colores naturales de los productos sin generar sombras duras ni reflejos molestos en los frascos.'
        }
      ]
    }
  },

  // ==================== MÓDULO 7 ====================
  {
    id: 'mod-7-redes',
    order: 7,
    title: 'Uso de Redes Sociales para Vender',
    shortTitle: 'Ventas en Redes Sociales',
    category: 'Tecnología',
    estimatedHours: 2,
    iconName: 'Share2',
    certificateTitle: 'Comercialización en Canales Digitales y Redes Sociales',
    description: 'Transforma Facebook, Instagram y los grupos de WhatsApp en vitrinas virtuales para vender en Palmira y Cali.',
    objectives: [
      'Crear una página de Facebook para tu negocio rural.',
      'Publicar historias atractivas que muestren el proceso de producción.',
      'Responder con rapidez y cortesía para no perder ventas digitales.'
    ],
    lessons: [
      {
        id: 'les-7-1',
        moduleId: 'mod-7-redes',
        order: 1,
        title: 'El Poder de los Estados de WhatsApp',
        durationMinutes: 8,
        summary: 'Tu lista de contactos es tu primer mercado. Aprende a usar los estados sin cansar a tus amigos.',
        introduction: 'Los estados de WhatsApp son vistos a diario por cientos de personas conocidas en Palmira. Es la vitrina gratuita más efectiva para las mujeres del campo.',
        contentSections: [
          {
            subtitle: '1. La regla de los 3 estados diarios',
            body: [
              'Estado 1 (Mañana): Muestra el proceso ("Cosechando las brevas frescas en la vereda").',
              'Estado 2 (Tarde): Muestra el producto terminado con precio claro ("Mermelada lista en frasco de 300g a $10.500 COP").',
              'Estado 3 (Noche): Llamado a la acción ("Despachamos pedidos a Palmira este viernes. Escríbeme y aparta el tuyo").'
            ]
          }
        ],
        practicalTip: 'Nunca publiques 20 fotos seguidas en los estados; 3 o 4 fotos bien escogidas tienen mucho más impacto.',
        keyTakeaways: [
          'Muestra el origen de la fruta o el tejido; a la gente le fascina el campo.',
          'Pon siempre el precio visible para que no tengan que preguntar por interno.'
        ]
      }
    ],
    quiz: {
      id: 'quiz-mod-7',
      title: 'Evaluación: Redes Sociales para Emprendedoras',
      passingScorePercent: 75,
      questions: [
        {
          id: 'q7-1',
          question: '¿Por qué es aconsejable mostrar el proceso de elaboración en los estados de WhatsApp?',
          options: [
            'Para que la gente aprenda a copiar tu receta.',
            'Porque genera cercanía, demuestra que es artesanal y justifica el valor del producto campesino.',
            'Para que vean que trabajas muchas horas.',
            'No se debe mostrar nada hasta que el producto esté empacado.'
          ],
          correctIndex: 1,
          explanation: 'Ver la paila humeante o las manos tejiendo demuestra que es un producto genuino y no algo industrial.'
        }
      ]
    }
  },

  // ==================== MÓDULO 8 ====================
  {
    id: 'mod-8-herramientas',
    order: 8,
    title: 'Herramientas Digitales para Emprendedoras',
    shortTitle: 'Herramientas Digitales',
    category: 'Tecnología',
    estimatedHours: 2,
    iconName: 'Wrench',
    certificateTitle: 'Competencias Digitales Aplicadas al Negocio Rural',
    description: 'Domina WhatsApp Business, Google Drive, Canva y cobros digitales con código QR para simplificar tu trabajo diario.',
    objectives: [
      'Configurar el catálogo de productos en WhatsApp Business.',
      'Generar y exhibir códigos QR de Nequi y Daviplata en ferias.',
      'Aprovechar aplicaciones móviles para llevar el negocio desde cualquier vereda.'
    ],
    lessons: [
      {
        id: 'les-8-1',
        moduleId: 'mod-8-herramientas',
        order: 1,
        title: 'Tu Teléfono como Oficina Campesina',
        durationMinutes: 8,
        summary: 'Cómo conectar todas las herramientas gratuitas para trabajar menos y vender más.',
        introduction: 'No necesitas una computadora cara en la vereda. Con tu teléfono inteligente puedes atender clientas, diseñar etiquetas y cobrar por transferencia.',
        contentSections: [
          {
            subtitle: '1. La caja de herramientas esencial',
            body: [
              'En la sección "Herramientas Digitales" de esta aplicación encontrarás enlaces directos y guías para descargar Canva, WhatsApp Business, Google Drive y Nequi.',
              'Combínalas: Diseña en Canva, sube tu foto a WhatsApp Business y cobra por código QR Nequi.'
            ]
          }
        ],
        practicalTip: 'Visita el módulo de Herramientas Digitales en el menú inferior para probar los enlaces directos recomendados.',
        keyTakeaways: [
          'Las herramientas digitales son gratuitas y están al alcance de tu mano.',
          'Un negocio digital rural vende incluso mientras estás descansando.'
        ]
      }
    ],
    quiz: {
      id: 'quiz-mod-8',
      title: 'Evaluación: Herramientas Digitales',
      passingScorePercent: 75,
      questions: [
        {
          id: 'q8-1',
          question: '¿Qué ventaja principal tiene el catálogo de WhatsApp Business para una productora campesina?',
          options: [
            'Que cobra una suscripción mensual en dólares.',
            'Que permite a las clientas ver fotos, precios y descripciones en un solo enlace sin tener que enviar fotos una por una.',
            'Que reemplaza la necesidad de hacer dulces o tejer.',
            'Que solo funciona en computadores grandes.'
          ],
          correctIndex: 1,
          explanation: 'El catálogo de WhatsApp Business ahorra tiempo valioso y da una imagen profesional y organizada al negocio.'
        }
      ]
    }
  },

  // ==================== MÓDULO 9 ====================
  {
    id: 'mod-9-finanzas',
    order: 9,
    title: 'Finanzas Básicas y Planificación',
    shortTitle: 'Finanzas y Ahorro',
    category: 'Finanzas',
    estimatedHours: 3,
    iconName: 'PiggyBank',
    certificateTitle: 'Educación Financiera y Sostenibilidad Económica Rural',
    description: 'Aprende a crear un fondo de ahorro para imprevistos, reinvertir en mejores herramientas y planear el futuro de tu familia.',
    objectives: [
      'Separar las ganancias personales del capital de trabajo del negocio.',
      'Crear un fondo de reserva para temporadas de lluvia o sequía.',
      'Planificar la compra de maquinaria o insumos por mayor para ahorrar costos.'
    ],
    lessons: [
      {
        id: 'les-9-1',
        moduleId: 'mod-9-finanzas',
        order: 1,
        title: 'Los Tres Bolsillos del Emprendimiento Campesino',
        durationMinutes: 9,
        summary: 'La técnica infalible para no descapitalizarse y ver crecer el dinero con los meses.',
        introduction: 'El error fatal en el campo es meter la mano al dinero de las ventas para comprar el almuerzo diario. Descubre la técnica de los tres bolsillos.',
        contentSections: [
          {
            subtitle: '1. Los Tres Bolsillos Sagrados',
            body: [
              'Bolsillo 1 (Reposición de Insumos - 60%): Este dinero NO se toca. Es para comprar nueva fruta, azúcar, frascos, etiquetas y gas.',
              'Bolsillo 2 (Tu Sueldo - 25%): Es tu salario digno como trabajadora. Este dinero sí lo puedes gastar en la comida de tu casa, ropa o educación de tus hijos.',
              'Bolsillo 3 (Ahorro y Maquinaria - 15%): Es el fondo para comprar una despulpadora eléctrica, un telar más grande o afrontar una semana de lluvia sin ferias.'
            ],
            highlightBox: 'Regla de Oro: Si tocas el Bolsillo 1 para gastos del hogar, te estás comiendo tu propia semilla campesina.'
          }
        ],
        practicalCase: {
          title: 'La paila de acero inoxidable de Doña Rosalba',
          entrepreneurName: 'María Rosalba Gómez',
          location: 'Vereda La Quisquina - Palmira',
          story: 'Doña Rosalba ahorró durante 5 meses el 15% de cada venta en su "Bolsillo de Maquinaria" de Nequi.',
          solution: 'Logró comprar una paila de acero con fondo grueso de $320.000 COP sin pedir prestado a usureros ni gota a gota. Ahora produce el doble de arequipe en la mitad de tiempo.',
          keyTakeaway: 'El ahorro programado te libera de los préstamos costosos y hace crecer tu capacidad productiva.'
        },
        practicalTip: 'Abre un "Bolsillo" en tu Nequi o Daviplata llamado "Ahorro Maquinaria" y transfiere allí el 15% cada vez que cierres una feria.',
        keyTakeaways: [
          'Nunca te comas la semilla: el capital de trabajo se respeta.',
          'Págate un sueldo fijo y no tomes plata suelta de la caja.',
          'El fondo de ahorro te protege de los préstamos gota a gota.'
        ]
      }
    ],
    quiz: {
      id: 'quiz-mod-9',
      title: 'Evaluación: Finanzas y Planificación',
      passingScorePercent: 75,
      questions: [
        {
          id: 'q9-1',
          question: '¿Qué sucede si utilizas el dinero de la reposición de insumos (Bolsillo 1) para pagar gastos diarios de la casa?',
          options: [
            'El negocio se vuelve más rentable.',
            'Te descapitalizas y luego no tendrás con qué comprar nuevos frascos, azúcar o fruta para seguir produciendo.',
            'El banco te da un premio por buen manejo.',
            'No pasa nada, el dinero es el mismo.'
          ],
          correctIndex: 1,
          explanation: 'Gastar el capital de reposición te deja sin insumos para la siguiente semana, obligándote a parar la producción o endeudarte.'
        }
      ]
    }
  }
];
