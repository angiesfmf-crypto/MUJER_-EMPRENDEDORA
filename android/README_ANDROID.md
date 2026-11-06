# MUJER EMPRENDEDORA - PALMIRA, VALLE DEL CAUCA
## Aplicación Android Nativa con Kotlin, Jetpack Compose, Room y WorkManager

Proyecto de desarrollo tecnológico y social orientado al empoderamiento y formalización de microemprendimientos rurales liderados por mujeres campesinas en el municipio de **Palmira, Valle del Cauca, Colombia** (Veredas: La Quisquina, Rozo, El Bolo, Tienda Nueva, Potrerillo, Combia y La Torre).

### Arquitectura Técnica
1. **Lenguaje y UI**: Kotlin 2.0+ con Jetpack Compose y Material Design 3.
2. **Offline-First**:
   - **Capa Local**: Room SQLite Database como única fuente de verdad (Single Source of Truth).
   - **Capa de Sincronización**: Android WorkManager con cola de tareas idempotentes (UUID v4) y políticas de reintento exponencial.
   - **Capa Remota**: Firebase Authentication y Cloud Firestore.
3. **Módulos Funcionales**:
   - Identidad y Perfil rural de emprendedora.
   - Gestión de Inventario con alerta de stock crítico.
   - Terminal de Ventas táctil con descuento atómico y validación estricta de existencias.
   - Reportes gráficos y resúmenes financieros.
   - Módulo de Capacitación en competencias TIC rurales.
