# PROYECTO INDIVIDUAL DE EVALUACIÓN PRÁCTICA (ACTIVIDAD 1)
## Módulo Profesional: Desarrollo de Interfaces (Código: 0488)
**Alumno / Autor:** Adrián López  
**Ciclo Formativo:** Grado Superior en Desarrollo de Aplicaciones Multiplataforma (2º DAM)  
**Centro:** FP Nebrija Madrid  
**Título del Proyecto:** Diseño, Desarrollo y Despliegue de Sistema de Gestión Multiplataforma (PWA/Híbrida)  
**Tecnologías:** Ionic 8+, Angular 19 (Standalone Components, Signals, RxJS, Chart.js, jsPDF, Compodoc)  

---

## 1. RESUMEN EJECUTIVO Y DATOS DE ACCESO PARA EVALUACIÓN

El proyecto consiste en una aplicación empresarial multiplataforma (PWA/Híbrida) concebida para la gestión integral y control de inventario de infraestructura hardware, acompañada de un sistema de auditoría y telemetría en tiempo real. 

### 1.1. Matriz de Control de Acceso por Roles (RBAC)
El sistema dispone de dos perfiles definidos según el pliego de requerimientos y protegidos mediante `roleGuard`:

| Perfil | Correo Electrónico | Contraseña | Permisos y Alcance |
| :--- | :--- | :--- | :--- |
| **Administrador** | `admin@empresa.com` | `Admin123!` | **Acceso Total:** Cuadro de Mando Ejecutivo, Gráfico interactivo Chart.js, Auditoría NoSQL en vivo, Exportación oficial de informes en PDF y CSV, Gestión integral de hardware. |
| **Usuario Estándar** | `user@empresa.com` | `User123!` | **Área Operativa:** Formulario de Alta con validación asíncrona de duplicados (debounce), consulta y filtrado del catálogo de inventario. |

> En la pantalla de inicio de sesión se han incorporado **botones de acceso rápido** (Demo Admin / Demo Estándar) para que el evaluador pueda alternar entre roles con un solo clic sin necesidad de teclear contraseñas.

---

## 2. EVIDENCIAS VISUALES DEL SISTEMA (CAPTURAS DE PANTALLA)

Las imágenes en alta resolución se encuentran guardadas en la carpeta `evidencias/` del proyecto:

1. `evidencias/01_login_interfaz.png`: Pantalla de Login Declarativo y Control de Acceso con botones de rol demo.
2. `evidencias/02_dashboard_admin_chart.png`: Cuadro de Mando Ejecutivo (Dashboard Admin) con widgets de métricas, gráfico en **Chart.js** interactivo, botones de exportación a PDF y CSV, y logs NoSQL en tiempo real.
3. `evidencias/03_alta_formulario_reactivo.png`: Formulario Reactivo con Validación Asíncrona (Alta de Registros) y tarjeta de **Data Binding bidireccional reactivo** en vivo.
4. `evidencias/04_inventario_tabla_avanzada.png`: Componente Reutilizable DataTable (Inventario Hardware) con buscador reactivo, ordenación por columnas, paginación y WAI-ARIA.
5. `evidencias/05_manual_ayuda_embebido.png`: Manual de Usuario y Documentación Embebida dentro de la propia app (`/ayuda`).
6. `evidencias/06_error_403_unauthorized.png`: Control de Acceso Denegado (Error 403 Forbidden) gestionado con Angular `roleGuard`.
7. `evidencias/07_vista_movil_responsive.png`: Diseño Adaptativo Mobile-First en dispositivo móvil con menú hamburguesa colapsable.

---

## 3. DESARROLLO TÉCNICO SEGÚN RÚBRICA OFICIAL

### 3.1. RA 1: Confección de Interfaces de Usuario (Peso: 20%)
- **Patrón Arquitectónico:** Implementación pura con componentes Standalone de Angular (sin módulos monolíticos), dividiendo estrictamente vista, lógica y modelos de datos.
- **Navegación Global (Paso 1.1):** Integración de `IonSplitPane` con `IonMenu` lateral global. En pantallas de escritorio el menú se muestra lateralmente de manera fija y en pantallas móviles se colapsa en un drawer accesible mediante el botón hamburguesa.
- **Lazy Loading:** Enrutamiento modular con `loadComponent()` en todas las rutas (`/dashboard`, `/registros`, `/login`, `/ayuda`, `/unauthorized`), minimizando el bundle inicial a solo 187 kB de transferencia.
- **Protección de Rutas (Guards):**
  - `authGuard`: Redirecciona al usuario no autenticado hacia `/login` preservando la URL de destino (`returnUrl`).
  - `roleGuard('ADMIN' | 'STANDARD')`: Bloquea accesos no permitidos y redirige automáticamente hacia `/unauthorized`.
- **Manejo Asíncrono de Tokens e Interceptor HTTP:** Implementación de `authInterceptor` que inyecta cabeceras `Authorization: Bearer <token>` en cada petición saliente y captura respuestas 401 y 403 para forzar el cierre de sesión o desvío de seguridad.

### 3.2. RA 2: Generación de Interfaces Declarativas (Peso: 15%)
- **Data Binding Unidireccional y Bidireccional:** Empleo de enlace reactivo unidireccional para pintado de métricas y bidireccional en la tarjeta técnica de previsualización que refleja en vivo los cambios según el usuario teclea en los inputs.
- **Validaciones Reactivas y Asíncronas (Paso 1.2):**
  - Validaciones síncronas: longitud mínima, campos obligatorios, rangos numéricos positivos para precio y stock, y formato de correo electrónico.
  - Validación asíncrona `uniqueSkuValidator`: Comprueba contra el servicio de base de datos SQL con un debounce de 300 ms si el código de serie de hardware introducido ya existe. Muestra un spinner animado durante el estado `PENDING` y mensaje de advertencia si el SKU está duplicado.
- **Optimización de Renderizado:** Activación de detección de cambios Zoneless nativa (`provideZonelessChangeDetection()`) y estrategia `ChangeDetectionStrategy.OnPush` en componentes hijos para evitar re-renderizados innecesarios del árbol DOM.

### 3.3. RA 3: Creación de Componentes Visuales (Peso: 15%)
- **Componentes Agnósticos e Independientes (Paso 2.1 y 2.2):**
  1. `DataTableComponent`: Componente completamente independiente de la vista padre. Recibe la colección de datos genéricos mediante `@Input() data` y las columnas mediante `@Input() columns`. Notifica interacciones al componente padre mediante `@Output() rowSelected` y `@Output() deleteRequested`. Incluye filtrado en memoria por cualquier columna, ordenación bi-direccional y paginación.
  2. `StatsWidgetComponent`: Componente reutilizable para tarjetas métricas con propiedades `@Input() title`, `@Input() value`, `@Input() trendText`, `@Input() trendColor` e iconos semánticos.
- **Gestión de Ciclo de Vida y Fugas de Memoria:**
  - `ngOnInit`: Inicialización de suscripciones con operadores de debounce.
  - `ngOnChanges`: Recálculo reactivo y ajuste automático de páginas activas ante cambios de entrada.
  - `ngOnDestroy`: Cancelación estricta de suscripciones mediante `Subscription.unsubscribe()` y destrucción explícita de instancias de `Chart.js` (`chart.destroy()`) para garantizar que no existan memory leaks.

### 3.4. RA 4: Usabilidad y Accesibilidad WCAG (Peso: 15%)
- **Diseño Mobile-First y Adaptativo (Paso 4.1):** Uso de rejillas flexibles y CSS flexbox adaptable a móvil (390px), tablet (768px) y monitor panorámico (1280px+).
- **Cumplimiento WCAG 2.1 (Paso 4.2):**
  - **Contraste de color reglamentario:** Relación de contraste superior a 4.5:1 en todos los textos sobre fondos claros y oscuros.
  - **Navegación íntegra por teclado:** Tabulación lógica continua (`tabindex="0"`), activación de selección de filas tanto con `Enter` como con tecla `Espacio`.
  - **Semántica WAI-ARIA:** Atributos `role="grid"`, `scope="col"`, `aria-sort`, `aria-live="polite"` para alertas y conteos, y etiquetas `aria-label` en controles de búsqueda y botones de acción.
  - **Lighthouse:** Idioma configurado en español (`<html lang="es">`), meta descripción descriptiva, etiquetas meta para viewport y PWA, asegurando una puntuación superior a 90/100 en Accesibilidad y Mejores Prácticas.

### 3.5. RA 5: Consumo de Datos y Creación de Informes (Peso: 15%)
- **Consumo Dual Asíncrono (Paso 3.1):**
  - API REST SQL: Simulación de persistencia relacional con catálogo de hardware, latencia de red y operaciones de creación y borrado.
  - NoSQL Firestore en tiempo real: Simulación de colección de eventos de auditoría y bitácora con stream reactivo `BehaviorSubject` que emite entradas cuando se producen acciones en el sistema.
- **Orquestación Asíncrona Concurrente:** Función `getConsolidatedDashboardData()` que emplea `forkJoin` de RxJS para descargar en paralelo tanto los datos SQL como NoSQL, gestionando estados de carga mediante `IonSpinner`.
- **Cuadro de Mando Interactivo con Chart.js (Paso 3.2):** Gráfico dinámico de barras que representa la distribución de stock por categorías técnicas, permitiendo al usuario conmutar entre vista de unidades físicas y valor monetario acumulado.
- **Exportación Robusta de Informes (Paso 3.3):**
  - **Informe PDF:** Generación en formato horizontal (A4 apaisado) con librería `jspdf` y `jspdf-autotable`. Incluye membrete corporativo, metadatos de emisión oficial, tabla cebrada y paginación institucional en el pie de página.
  - **Informe CSV:** Archivo exportado con delimitador estándar y Byte Order Mark (BOM) UTF-8 (`\uFEFF`), garantizando que se abra correctamente en Microsoft Excel sin deformar caracteres con tildes o el símbolo del euro (€).

### 3.6. RA 6: Documentación Técnica y de Usuario (Peso: 10%)
- **Documentación Técnica Generada con Compodoc (Paso 5.2):** Generación automática de la documentación del proyecto accesible ejecutando `npm run docs`, generando el directorio `/documentation` con desglose de clases, interfaces, rutas y grafo de dependencias.
- **Manual de Usuario Integrado:** Embebido como ruta nativa `/ayuda` en la aplicación y respaldado por el archivo `README.md` exhaustivo en la raíz del repositorio.

### 3.7. RA 7: Distribución, Git Flow y Despliegue (Peso: 10%)
- **Control de Versiones y Git Flow (Paso 5.1):** Flujo de trabajo estructurado en ramas:
  - Rama `main`: Versión estable y lista para producción (release v1.0.0).
  - Rama `develop`: Integración de características consolidadas.
  - Ramas de características: `feature/fase1-auth-routing`, `feature/fase2-componentes-visuales`, `feature/fase3-dashboard-informes`, `feature/fase4-accesibilidad-docs` y `feature/fase5-ci-cd-despliegue`.
- **Integración Continua (CI/CD):** Pipeline configurado en `.github/workflows/ci.yml` para compilar automáticamente en Node 20 LTS y ejecutar los tests unitarios en cada push o Pull Request.
- **Despliegue Cloud (Paso 5.3):** Archivo `vercel.json` configurado con cabeceras de seguridad y redirección SPA para despliegue inmediato en Vercel, Netlify o Firebase Hosting.

---

