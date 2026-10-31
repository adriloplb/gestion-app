# Sistema de Gestión Multiplataforma (PWA/Híbrida)

**Módulo Profesional:** Desarrollo de Interfaces (Código: 0488)  
**Ciclo Formativo:** Grado Superior en Desarrollo de Aplicaciones Multiplataforma (DAM)  
**Centro Docente:** FP Universidad Nebrija Madrid  
**Actividad:** Actividad Individual 1 - Proyecto de Evaluación Práctica  

---

## 📋 Resumen del Proyecto

Aplicación de gestión empresarial multiplataforma orientada al control de inventario de hardware y auditoría de eventos en tiempo real. Desarrollada con el framework **Ionic 8+** sobre **Angular 19** empleando una arquitectura moderna basada al 100% en **Standalone Components**, programación reactiva con **RxJS** y **Angular Signals**, validaciones asíncronas en formularios declarativos, consumo dual de datos (SQL y NoSQL), control de acceso basado en roles (RBAC) y cumplimiento riguroso de normativas de accesibilidad **WCAG 2.1 (Nivel AA/AAA)**.

---

## 🔑 Credenciales de Acceso para Evaluación (RBAC)

El sistema implementa protección de rutas mediante `roleGuard` e interceptores HTTP:

| Rol | Correo Electrónico | Contraseña | Permisos y Alcance |
| :--- | :--- | :--- | :--- |
| **Administrador** | `admin@empresa.com` | `Admin123!` | Acceso total: Cuadro de Mando con Chart.js, auditoría NoSQL en vivo, exportación de informes PDF y CSV, gestión de inventario SQL. |
| **Usuario Estándar** | `user@empresa.com` | `User123!` | Acceso a gestión de registros: Formulario de Alta con validación asíncrona (debounce), catálogo con búsqueda y ordenación. |

> **Nota:** La pantalla de Login dispone de botones de *Acceso Rápido* para que el evaluador pueda alternar entre credenciales con un solo clic.

---

## 🏛️ Arquitectura del Sistema (MVC / MVVM)

El proyecto sigue una estricta separación de responsabilidades:
- **Capa de Presentación:** Componentes visuales desacoplados y agnósticos (`DataTableComponent`, `StatsWidgetComponent`), utilizando `ChangeDetectionStrategy.OnPush` para evitar re-renderizados innecesarios.
- **Capa de Lógica y Estado:** Servicios `AuthService` y `DataService` con estado inmutable gestionado mediante `BehaviorSubject` y `Signals` reactivas (`signal`, `computed`).
- **Capa de Red e Interceptores:** `authInterceptor` funcional que inyecta automáticamente tokens Bearer JWT y gestiona códigos de error HTTP 401 y 403.
- **Navegación:** `IonSplitPane` con `IonMenu` lateral global responsive y carga diferida (`Lazy Loading`) en todas las rutas.

```
src/app/
├── components/          # Componentes visuales reutilizables e instanciables (RA 3)
│   ├── data-table/      # Tabla accesible con búsqueda, ordenación, paginación y WAI-ARIA
│   └── stats-widget/    # Widgets numéricos con cálculo de métricas y tendencias
├── guards/              # Guards de autenticación y autorización por roles (RA 1)
│   └── role.guard.ts    # roleGuard y authGuard funcionales
├── interceptors/        # Interceptores HTTP (RA 1)
│   └── auth.interceptor.ts # Interceptor Bearer JWT y control de errores 401/403
├── models/              # Interfaces tipadas (HardwareItem, AuditLog, User, etc.)
│   └── user.model.ts
├── pages/               # Vistas principales cargadas mediante Lazy Loading (RA 1)
│   ├── ayuda/           # Manual de usuario embebido y documentación contextual (RA 6)
│   ├── dashboard/       # Cuadro de mando Admin con Chart.js y exportaciones PDF/CSV (RA 5)
│   ├── login/           # Formulario reactivo de autenticación con botones demo
│   ├── registros/       # Alta declarativa con validaciones asíncronas y catálogo (RA 2)
│   └── unauthorized/    # Vista 403 amigable para accesos no autorizados
├── services/            # Servicios de persistencia, orquestación y exportación (RA 5)
│   ├── auth.service.ts  # Autenticación, JWT simulado, signals y validación asíncrona
│   ├── data.service.ts  # Consumo dual SQL + NoSQL en tiempo real (forkJoin)
│   └── export.service.ts# Exportación estructurada a PDF (jsPDF-autotable) y CSV UTF-8
└── validators/          # Validadores reactivos asíncronos (RA 2)
    └── email-async.validator.ts # Comprobación asíncrona de email y SKU duplicados
```

---

## 🚀 Fases del Proyecto Implementadas

### Fase 1: Estructuración y Renderizado Declarativo (RA 1 y RA 2)
- **Side Menu Global y Lazy Loading:** Menú lateral accesible con `ion-split-pane`, navegación condicional según sesión y badge de rol activo.
- **Formularios Reactivos y Validaciones Asíncronas:** Formulario de Alta con enlace bidireccional en tarjeta de vista previa en tiempo real. Validación asíncrona con debounce que verifica contra el servicio si el código SKU ya existe en la base de datos SQL.
- **Data Binding:** Unidireccional y bidireccional reactivo con visualización inmediata de métricas totales.

### Fase 2: Componentización Visual y Lógica de Negocio (RA 3)
- **`DataTableComponent`:** Componente agnóstico independiente, con `@Input()` de datos y columnas, y `@Output()` de selección de fila y eliminación. Incorpora filtrado en vivo por texto, ordenación por columnas, paginación accesible y gestión de ciclo de vida (`OnChanges`, `OnDestroy`) libre de fugas de memoria.
- **`StatsWidgetComponent`:** Widget reutilizable para métricas clave, compatible con acciones de clic, soporte de accesibilidad y `ChangeDetectionStrategy.OnPush`.

### Fase 3: Consumo de Datos y Generación de Informes (RA 5)
- **Consumo Dual Concurrente:** Simulación de API REST SQL (inventario de hardware) y base documental NoSQL en tiempo real (auditoría de eventos). Orquestación asíncrona mediante `forkJoin` de RxJS con spinner visual de carga.
- **Cuadro de Mando con Chart.js:** Gráfico interactivo de barras que representa el volumen de stock o valor económico por categoría con filtrado reactivo instantáneo.
- **Exportación de Informes:** 
  - **PDF Oficial:** Documento apaisado de alta calidad maquetado con cabecera corporativa de Nebrija, fecha, tabla tabulada zebra y paginación.
  - **CSV Compatible:** Archivo codificado en UTF-8 con Byte Order Mark (BOM) y separadores estándar para compatibilidad directa con Microsoft Excel.

### Fase 4: Usabilidad, Accesibilidad y Control de Calidad (RA 4)
- **Diseño Mobile-First:** Rejilla fluida y flexbox que se adapta sin distorsión a móviles, tablets y ordenadores de sobremesa.
- **Cumplimiento WCAG y WAI-ARIA:** Atributos semánticos `role="grid"`, `aria-sort`, `aria-live`, etiquetas asociadas a cada control de formulario y navegación completa mediante tabulación de teclado (`tabindex` lógico).
- **Lighthouse:** Optimizado para alcanzar puntuaciones superiores a 90/100 en Accesibilidad y Mejores Prácticas.

### Fase 5: Documentación, Control de Versiones y Despliegue (RA 6 y RA 7)
- **Compodoc:** Documentación técnica generada automáticamente accesible mediante `npm run docs`.
- **Manual de Usuario:** Embebido en la propia aplicación en la ruta `/ayuda`.
- **CI/CD:** Pipeline de GitHub Actions configurado en `.github/workflows/ci.yml`.
- **Despliegue Cloud:** Archivo de configuración `vercel.json` preparado para despliegue en Vercel.

---

## 🛠️ Instalación y Puesta en Marcha Local

### Prerrequisitos
- Node.js (versión 20 LTS o superior)
- npm (versión 10 o superior)

### Pasos de Ejecución
1. Clonar el repositorio:
   ```bash
   git clone <URL_DEL_REPOSITORIO>
   cd gestion-app
   ```
2. Instalar dependencias:
   ```bash
   npm install
   ```
3. Iniciar el servidor de desarrollo local:
   ```bash
   npm start
   ```
   La aplicación se abrirá en `http://localhost:4200/`.

4. Compilar para producción (PWA optimizada en carpeta `/www`):
   ```bash
   npm run build
   ```

5. Ejecutar la suite de tests unitarios:
   ```bash
   npm run test:unit
   ```

6. Generar la documentación técnica con Compodoc:
   ```bash
   npm run docs
   ```
   Para servir la documentación en local:
   ```bash
   npm run docs:serve
   ```

---

## 📊 Evidencias de Entrega
Las capturas de pantalla de cada una de las pantallas en funcionamiento y la auditoría de accesibilidad se encuentran disponibles en la carpeta `/evidencias`:
- `01_login_interfaz.png`: Pantalla de inicio de sesión con selector de cuentas demo.
- `02_dashboard_admin_chart.png`: Cuadro de mando con widgets estadísticos y gráfico interactivo Chart.js.
- `03_alta_formulario_reactivo.png`: Formulario declarativo de alta con validación asíncrona y ficha en vivo.
- `04_inventario_tabla_avanzada.png`: Tabla accesible de componentes con ordenación y búsqueda.
- `05_manual_ayuda_embebido.png`: Módulo de ayuda contextual y guía de usuario.
- `06_error_403_unauthorized.png`: Control de acceso y redirección RBAC.
- `07_informe_pdf_generado.png`: Muestra del informe ejecutivo descargado en formato PDF.

---
*Desarrollado para la evaluación del módulo de Desarrollo de Interfaces - Grado Superior DAM Nebrija Madrid.*
