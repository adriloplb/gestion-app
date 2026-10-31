# Manual de Usuario - Sistema de Gestión de Hardware
**Autor:** Adrián López Delgado  
**Curso:** 2º DAM (Desarrollo de Aplicaciones Multiplataforma)  
**Centro:** FP Nebrija Madrid  
**Módulo:** Desarrollo de Interfaces  
**Versión de la aplicación:** 1.0.0  

---

## 1. Introducción y Bienvenida

Hola. En este manual quiero explicarte de manera clara y directa cómo funciona la aplicación web de gestión que he desarrollado, para qué sirve cada pantalla y cómo puedes sacarle el máximo partido en el día a día.

He diseñado esta herramienta pensando en una empresa que necesita tener bajo control todo su parque de equipos informáticos y hardware (servidores, conmutadores de red, sistemas de alimentación ininterrumpida SAI, cortafuegos y cabinas de almacenamiento). La aplicación no solo te permite registrar y consultar equipos con su precio y unidades disponibles, sino que además calcula métricas financieras automáticamente, te avisa cuando el stock baja de los niveles seguros y guarda una bitácora en tiempo real de todo lo que ocurre en el sistema.

La aplicación está construida como una aplicación web progresiva e híbrida (PWA), lo que significa que puedes utilizarla cómodamente tanto desde el navegador de tu ordenador como desde la pantalla de un teléfono móvil o una tableta, adaptándose su diseño a cada dispositivo.

---

## 2. Acceso al Sistema y Roles de Usuario

Para empezar a utilizar el sistema, abre la aplicación en tu navegador web. La primera pantalla que te encontrarás es el **Portal de Acceso (Login)**.

### 2.1. Tipos de usuario en el sistema
He configurado dos perfiles de usuario distintos según las responsabilidades dentro de la empresa:

1. **Administrador (Acceso Total):**
   * Correo: `admin@empresa.com`
   * Contraseña: `Admin123!`
   * Este perfil está pensado para los responsables del departamento de TI o dirección. Tienes acceso completo al Cuadro de Mando Ejecutivo (Dashboard), a las gráficas estadísticas interactivas, a la bitácora de auditoría en vivo, a los botones de exportación oficial (PDF y CSV) y al inventario de hardware.

2. **Operador Estándar:**
   * Correo: `user@empresa.com`
   * Contraseña: `User123!`
   * Este perfil está pensado para los técnicos de almacén y soporte. Te permite dar de alta nuevos equipos de hardware con validaciones en tiempo real y consultar o buscar en el catálogo completo de inventario. Si intentas entrar a las pantallas exclusivas de dirección, el sistema te avisará de que no dispones de permisos suficientes.

### 2.2. Botones de acceso rápido para pruebas
Para que no tengas que escribir el correo y la contraseña cada vez que quieras probar la aplicación, he incluido en la parte superior del formulario de login dos botones de un solo clic:
* **Admin (Acceso Total):** Rellena automáticamente los campos del administrador e inicia sesión con todos los privilegios.
* **Estándar (Operador):** Rellena los datos del usuario técnico para probar el modo con permisos restringidos.

Si introduces manualmente una contraseña incorrecta o un correo que no existe, la aplicación te mostrará un mensaje de advertencia claro sin perder los datos que ya habías escrito.

---

## 3. Navegación General y Menú de la Aplicación

Una vez dentro, verás la estructura principal de la interfaz:

* **Menú Lateral (Side Menu):**
  * Si estás en un ordenador, el menú permanece fijo en el lateral izquierdo para que puedas moverte rápidamente entre secciones.
  * Si estás utilizando un móvil, el menú se oculta automáticamente para dejar espacio a la pantalla. Para abrirlo, basta con pulsar el botón con tres rayas horizontales (menú hamburguesa) situado en la esquina superior izquierda.
* **Tarjeta de Usuario Activo:**
  * En la parte superior del menú siempre verás tu nombre, tu correo electrónico y una etiqueta que indica si estás conectado como "ADMIN" o como "ESTÁNDAR".
* **Enlaces de Navegación:**
  * **Cuadro de Mando (Admin):** Solo visible y accesible si eres Administrador.
  * **Inventario & Altas:** Accesible para cualquier usuario autenticado.
  * **Manual y Ayuda:** Acceso directo a la guía integrada dentro de la propia aplicación.
  * **Cerrar Sesión:** Cierra tu sesión de forma limpia y segura, borrando los datos temporales del navegador y redirigiéndote al portal de entrada.

---

## 4. Módulo 1: Cuadro de Mando Ejecutivo (Dashboard)

*Solo disponible para usuarios con rol de Administrador.*

Este módulo lo he desarrollado para ofrecer una visión global del estado de la infraestructura informática de la empresa en un único vistazo.

### 4.1. Tarjetas de Indicadores Clave (KPIs)
En la parte superior encontrarás cuatro tarjetas métricas:
1. **Total Unidades Stock:** Suma física de todos los equipos disponibles actualmente en los almacenes de la empresa.
2. **Valor del Inventario:** Cálculo económico automático que multiplica el precio unitario de cada producto por sus unidades existentes y suma el total acumulado en euros.
3. **Alertas Bajo Stock:** Te indica de inmediato cuántos productos tienen menos de 5 unidades. Si hay equipos en esta situación, la tarjeta muestra una etiqueta de estado "Crítico" en rojo para recordarte que es necesario tramitar pedidos de reposición.
4. **Logs en Tiempo Real:** Contador de eventos registrados en la bitácora activa del sistema.

### 4.2. Gráfico Interactivo de Distribución de Stock
Debajo de las tarjetas métricas he integrado un gráfico de barras interactivo:
* **Categorías técnicas:** Muestra en el eje horizontal las categorías de hardware: Servidores, Redes, Seguridad y Almacenamiento.
* **Alternar vista de métricas:** En la esquina superior derecha del gráfico he colocado dos botones para que puedas elegir qué dato quieres analizar:
  * **Unidades en Stock:** Muestra la cantidad física de aparatos por cada categoría.
  * **Valor Monetario (€):** Cambia el gráfico en el acto para mostrar cuánto dinero representan los equipos de esa categoría en el patrimonio de la empresa.
* Si pasas el ratón por encima de cualquier barra (o tocas con el dedo en el móvil), aparecerá un recuadro informativo con la cifra exacta.

### 4.3. Exportación de Informes Oficiales
A la derecha del título del panel dispones de tres botones de acción:
* **Exportar Informe PDF:** Genera y descarga al instante un documento PDF en formato apaisado (A4 landscape) con diseño corporativo, membrete oficial, fecha y hora de emisión, tabla estructurada de todo el hardware y número de página. Es ideal para imprimir o enviar por correo a dirección.
* **Exportar Datos CSV:** Descarga un fichero compatible con Microsoft Excel y hojas de cálculo. He incorporado la codificación UTF-8 con marca de orden de bytes (BOM) para garantizar que los nombres con tildes, las eñes y el símbolo del euro (€) se abran perfectamente sin caracteres extraños.
* **Refrescar:** Vuelve a sincronizar todos los datos de forma inmediata simulando una recarga en caliente.

### 4.4. Bitácora de Auditoría en Tiempo Real
En la columna derecha del cuadro de mando se encuentra la sección de auditoría. Cada vez que inicias sesión, creas un registro nuevo, modificas un dato o descargas un informe, el sistema emite automáticamente un nuevo evento indicando qué acción se ha producido, qué usuario la ha llevado a cabo y la hora exacta del suceso.

---

## 5. Módulo 2: Inventario y Alta de Registros

Este módulo es el corazón operativo del sistema y está disponible tanto para administradores como para operadores estándar. Se divide en dos pestañas que puedes alternar en la barra superior:

### 5.1. Pestaña 1: Alta de Hardware
En esta pantalla puedes dar de alta nuevos equipos en la base de datos de la empresa:

1. **Campos del Formulario:**
   * **Nombre del Equipo / Dispositivo:** Debe tener al menos 3 caracteres (por ejemplo: *Servidor Dell PowerEdge R650xs*).
   * **Código de Serie / SKU:** Identificador único de inventario (por ejemplo: *SRV-2024-099*). He implementado una comprobación inteligente: mientras escribes, el sistema espera unos instantes y consulta en segundo plano si ese código ya está registrado. Si ya existe, te avisará con un mensaje en rojo para evitar equipos duplicados.
   * **Categoría Técnica:** Desplegable para seleccionar el tipo de máquina (*Servidores, Redes, Seguridad, Almacenamiento*).
   * **Unidades de Stock:** Cantidad física que entra al almacén (no admite números negativos).
   * **Precio Unitario (€):** Coste por unidad en euros (debe ser mayor que cero).
   * **Correo del Técnico Responsable:** Dirección de correo de la persona a cargo del equipo (por ejemplo: *soporte@empresa.com*). El sistema valida que el formato de correo sea correcto y también comprueba en tiempo real si el técnico está dado de alta.
   * **Estado Operativo:** Permite indicar si el equipo está *Disponible*, en *Bajo Stock* o *Agotado*.

2. **Ficha Técnica en Tiempo Real (Data Binding Reactivo):**
   * En la columna derecha verás una tarjeta que simula una pantalla de dispositivo. Conforme vas escribiendo en los campos del formulario, la tarjeta se actualiza automáticamente al segundo: ves cómo cambia el título, el código SKU y el cálculo del valor total (precio multiplicado por stock).
   * Si las unidades son menores a 5, la tarjeta te muestra un aviso visual para advertirte de la escasez.

3. **Guardar el Registro:**
   * El botón "Guardar Registro" permanece desactivado hasta que todos los campos requeridos estén correctamente rellenados y las comprobaciones en segundo plano hayan confirmado que no hay duplicados.
   * Al pulsar el botón, el sistema guarda el equipo, muestra una notificación verde de confirmación y emite un evento en la bitácora de auditoría.
   * Si quieres limpiar el formulario para empezar de nuevo, puedes pulsar el botón "Restablecer Campos".

### 5.2. Pestaña 2: Inventario Registrado
Al pulsar sobre esta pestaña se muestra la tabla interactiva con todos los equipos que forman parte del catálogo actual:

* **Barra de Búsqueda Rápida:**
  * En la parte superior derecha de la tabla dispones de un buscador reactivo. Basta con que empieces a escribir cualquier palabra (el nombre del equipo, parte del SKU o la categoría) y la tabla filtrará los resultados al instante sin necesidad de recargar la página. Si quieres volver a ver todo, pulsa el botón con una cruz (✕) para vaciar el buscador.
* **Ordenación por Columnas:**
  * Puedes hacer clic sobre el encabezado de casi cualquier columna (*Código SKU, Equipo / Producto, Categoría, Stock, Precio, Estado*) para ordenar la tabla de menor a mayor o de mayor a menor. Una flecha te indicará el sentido de la ordenación activa.
* **Navegación por Páginas:**
  * Para que la tabla sea cómoda de leer, divide los registros en páginas de 6 elementos. En el pie de la tabla puedes usar los botones "Anterior" y "Siguiente" para moverte entre páginas.
* **Botones de Acción por Fila:**
  * **Botón [Ver]:** Te permite seleccionar la fila y consultar los detalles completos del equipo.
  * **Botón [Eliminar]:** Permite dar de baja un equipo del inventario. El sistema retira el elemento de la lista y registra la eliminación en la bitácora.

---

## 6. Módulo 3: Manual de Usuario y Ayuda Integrada

Si en algún momento mientras estás usando la aplicación te surge una duda sobre las contraseñas de prueba o las funciones de cada rol, puedes entrar directamente en la opción **Manual y Ayuda** del menú lateral (`/ayuda`).

Allí he dejado reflejada una ficha resumen con las credenciales de evaluación, la explicación de las tecnologías utilizadas y un resumen del funcionamiento de cada módulo, para que siempre esté disponible sin tener que consultar documentos externos.

---

## 7. Consejos de Uso y Accesibilidad

Para que la aplicación sea cómoda para todo el mundo, he cuidado especialmente los siguientes detalles:

* **Navegación completa por teclado:** Si prefieres no usar el ratón, puedes moverte por toda la interfaz pulsando la tecla `Tabulador`. Puedes abrir menús, seleccionar filas de la tabla pulsando `Enter` o la `Barra Espaciadora`, y activar cualquier botón.
* **Uso en teléfonos móviles:** Todo el diseño se recoloca automáticamente en vertical en pantallas pequeñas. Las tablas permiten deslizamiento horizontal suave si no caben enteras, y los botones son lo bastante amplios para tocarlos cómodamente con el dedo.
* **Seguridad al terminar:** Recuerda siempre pulsar en **Cerrar Sesión** en el menú lateral cuando vayas a dejar de usar la aplicación en un equipo compartido. De este modo te aseguras de que nadie pueda realizar cambios en el inventario con tu cuenta.

