# ESCUELA SUPERIOR POLITÉCNICA DE CHIMBORAZO

FACULTAD: INFORMÁTICA Y ELECTRÓNICA

**ESCUELA DE INGENIERÍA EN SISTEMAS**

**CARRERA: SOFTWARE**

# GUÍA DE LABORATORIO DE APLICACIONES INFORMÁTICAS II

## PRÁCTICA No. 2

1.  **DATOS GENERALES:**

**NOMBRE DEL ESTUDIANTE CODIGO DEL ESTUDIANTE**

Johann Caizaguano 7159

**FECHA DE REALIZACIÓN: FECHA DE ENTREGA:**

2026/01/29 2026/01/30

1.  **OBJETIVO(S):**

**2.1. GENERAL**

Ejecutar un plan de mantenimiento integral sobre el sistema de gestión de inventarios para garantizar la continuidad operativa, la integridad de las transacciones y la adaptabilidad de la arquitectura ante nuevos requisitos tecnológicos.

**2.2. ESPECÍFÍCOS**

- Subsanar anomalías críticas en la lógica de transacciones y el middleware de autenticación para asegurar la consistencia de los datos y la seguridad del acceso.
- Adaptar la infraestructura de persistencia y los protocolos de seguridad del frontend para permitir el despliegue del sistema en entornos de nube y producción.
- Optimizar el rendimiento del sistema mediante la refactorización de modelos y controladores, incrementando la cohesión funcional y reduciendo el acoplamiento estructural.
- Actualizar el corpus documental técnico, alineando los diagramas de arquitectura y especificaciones de procesos con el estado actual de la implementación.

1.  **METODOLOGÍA**

SCRUM

1.  **EQUIPOS Y MATERIALES:**

- Computador
- Entorno integrado de desarrollo (IDE)
- Aula virtual
- Acceso a internet
- Bibliografía

1.  **MARCO TEORICO:**

**Tipología del Mantenimiento de Software**

La ejecución de este proyecto se fundamenta en la clasificación estándar del mantenimiento de sistemas computacionales. El mantenimiento correctivo constituye la primera fase, centrada exclusivamente en la identificación y resolución de defectos lógicos que impiden el comportamiento esperado del sistema, como las inconsistencias en el flujo de datos transaccionales. Complementariamente, el mantenimiento adaptativo aborda la evolución del entorno operativo, permitiendo que la aplicación se integre con nuevas infraestructuras de nube y cumpla con protocolos de seguridad actualizados.

Finalmente, las acciones de mantenimiento perfectivo y preventivo se enfocan en la mejora de atributos no funcionales, tales como el rendimiento de las consultas a la base de datos y la legibilidad del código fuente para mitigar la deuda técnica.

**Calidad de Diseño Arquitectónico**

El análisis técnico se rige por los principios de diseño modular esenciales en el desarrollo de software moderno. La cohesión funcional representa el grado de responsabilidad única dentro de los controladores del backend, donde se busca que cada componente gestione una sola entidad de negocio para facilitar su testeo y mantenimiento.

Paralelamente, el desacoplamiento estructural es el objetivo primordial al intervenir los middlewares y configuraciones de servicios; mediante la implementación de capas de abstracción, se asegura que los cambios en la infraestructura técnica no generen impactos negativos en la lógica de negocio central. Este enfoque garantiza una arquitectura resiliente y preparada para el escalamiento vertical y horizontal.

**Persistencia y Optimización de Datos**

El soporte teórico para la gestión de datos se basa en el modelado eficiente mediante el uso de esquemas de Mongoose en un entorno NoSQL.

La optimización no solo implica la correcta estructuración de los documentos, sino también la implementación estratégica de índices que reduzcan la latitud en operaciones de búsqueda masiva. La integridad referencial y la consistencia de las transacciones son pilares fundamentales dentro de este marco, asegurando que cada movimiento de inventario se refleje de manera atómica y fidedigna en la base de datos, eliminando la posibilidad de estados inconsistentes en el sistema de gestión.

1.  **PROCEDIMIENTO:**

**1\. Introducción**

**1.1 Propósito del documento**

El objetivo primordial de este documento es formalizar el registro de las actividades de mantenimiento correctivo, adaptativo y perfectivo ejecutadas sobre los módulos centrales del sistema. Sirve como un instrumento de transferencia de conocimiento técnico dirigido al equipo de ingeniería de software, facilitando la comprensión de las modificaciones realizadas en la lógica de controladores, middlewares y modelos de datos.

**1.2 Alcance del mantenimiento**

El alcance del presente mantenimiento se limita estrictamente a los componentes técnicos residentes en el repositorio del proyecto, cubriendo las siguientes áreas:

- **Lógica de Persistencia Transaccional:** Intervención integral del controlador TransactionController.js para asegurar la integridad de las operaciones de inventario.
- **Seguridad y Autenticación:** Optimización del middleware auth.js para la validación de identidad mediante tokens JWT y gestión de roles de usuario.
- **Modelado de Datos:** Refactorización de esquemas en ProductModel.js orientada a la implementación de índices y mejora del rendimiento en consultas NoSQL.
- **Documentacion:** A falta de documentación adecuada, salvo el readme.md se propone la creación de diagramas de arquitectura y los modelos de datos basados en los esquemas de Mongoose, asegurando coherencia con la implementación actual.
- **Exclusiones:** Quedan fuera del alcance la administración de servicios externos de terceros, la configuración de hardware de red y el soporte a dependencias no integradas directamente en el código fuente.

**1.3 Definiciones, acrónimos y abreviaturas**

- **JWT (JSON Web Token)**: Estándar de autenticación mediante tokens para el acceso seguro a rutas protegidas.
- **Mongoose**: Biblioteca ODM empleada para el modelado y gestión de esquemas en la base de datos NoSQL.

**1.4 Referencias**

Se integran las guías de modelado de Mongoose para la gestión de persistencia en la base de datos NoSQL y los estándares de React para el desarrollo de la interfaz y consumo de servicios.

En materia de seguridad, el proceso de autenticación se rige por el estándar RFC 7519 correspondiente a los JSON Web Tokens (JWT). Asimismo, la reestructuración de controladores y modelos se fundamenta en los principios de arquitectura modular, priorizando la cohesión funcional y el desacoplamiento para garantizar la escalabilidad del sistema

**2\. Descripción General del Sistema**

**2.1 Resumen del sistema**

La plataforma constituye una solución integral para la gestión de inventarios y el seguimiento sistemático de transacciones comerciales, desarrollada bajo un enfoque de aplicaciones web de alto rendimiento. Su funcionalidad primordial es la administración atómica de existencias y el registro detallado de movimientos de productos, con el objetivo de garantizar la consistencia de la información y proveer analíticas operativas precisas para la toma de decisiones.

**2.2 Arquitectura del sistema**

- Diagrama de arquitectura
- Componentes principales
- Dependencias internas y externas

**2.3 Entornos**

**Desarrollo**

- **Operatividad**: Ejecución en Node.js con soporte de nodemon para depuración en tiempo real.
- **Persistencia**: Uso de bases de datos locales configuradas mediante variables de entorno dinámicas.

**Pruebas**

- **Marco de Trabajo**: Empleo del framework **Jest** para validaciones unitarias y de integración.
- **Alcance**: Verificación controlada de la lógica de autenticación y flujos transaccionales de la API.

**3\. Tipos de Mantenimiento**

**3.1 Mantenimiento correctivo**

- Intervención en la función createTransaction dentro de TransactionController.js para asegurar que la entrada y salida de productos se valide atómicamente antes de su persistencia.
- Refuerzo del middleware auth.js para gestionar correctamente los encabezados "Bearer" y diferenciar errores de tokens expirados de accesos denegados por inexistencia del usuario.
- Ajuste del componente Dashboard.js para manejar estados de carga y errores asíncronos en las llamadas paralelas de Promise.all, evitando que la interfaz colapse ante respuestas vacías de la API.

**3.2 Mantenimiento adaptativo**

- Modificación de dbConnection.js para transicionar de una cadena de conexión estática a una configuración basada en variables de entorno dinámicas, facilitando el despliegue en MongoDB Atlas.
- Actualización de los servicios en frontend/src/services/api.js para adaptarse a políticas estrictas de CORS y protocolos SSL/TLS en servidores de producción como Nginx.

**3.3 Mantenimiento perfectivo**

- Implementación de índices secundarios en ProductModel.js (ej. en los campos category y price) para reducir la latencia en búsquedas dentro de catálogos extensos.
- Refactorización de CategoriesPage.js para incluir búsqueda en tiempo real y filtrado dinámico, incrementando la escalabilidad visual de la aplicación.
- Optimización de las funciones de agregación en los controladores de backend para reducir el consumo de recursos de CPU durante la generación de métricas del Dashboard.

**3.4 Mantenimiento preventivo**

- Reestructuración de controladores como TransactionController.js para separar las responsabilidades de validación de la lógica de persistencia, cumpliendo con principios de diseño sólido.
- Fortalecimiento de las capas de middleware y servicios para que la lógica de negocio sea independiente de la implementación técnica de la API, previniendo errores en cascada ante cambios futuros.

**4\. Proceso de Mantenimiento**

**4.1 Registro de módulos / áreas a intervenir**

Se han identificado y seleccionado los siguientes componentes críticos para la ejecución del plan de mantenimiento:

1.  **Lógica de Negocio y Control**: backend/controllers/TransactionController.js y OrderController.js.
2.  **Seguridad y Control de Acceso**: Middleware de autenticación y autorización en backend/middleware/auth.js.
3.  **Capa de Persistencia**: Esquemas de datos en backend/models/ProductModel.js y configuración de enlace en backend/config/dbConnection.js.
4.  **Interfaz y Visualización**: Tablero de control principal en frontend/src/pages/Dashboard.js y servicios de API en frontend/src/services/api.js.
5.  **Infraestructura de Despliegue**: Archivos de orquestación docker-compose.yml y configuración de servidor frontend/nginx.conf.

**4.2 Análisis y priorización**

Criterios de severidad, impacto y urgencia.

|     |     |     |     |     |
| --- | --- | --- | --- | --- |
| **Área de Intervención** | **Severidad** | **Impacto** |     | **Urgencia** | **Justificación Técnica** |
| **Autenticación (auth.js)** | Crítica |     | Global | Alta | Garantiza la integridad del acceso y protección de rutas. |
| **Transacciones (TransactionController.js)** | Alta |     | Operativo | Alta | Asegura la consistencia de los datos de inventario y flujo de caja. |
| **Conectividad (dbConnection.js)** | Media |     | Infraestructura | Media | Necesaria para la transición a entornos de nube (MongoDB Atlas). |
| **Optimización (ProductModel.js)** | Baja |     | Rendimiento | Baja | Mejora latencias en consultas masivas mediante indexación. |

**4.3 Implementación de cambios**

La ejecución de las modificaciones se rige por estándares de calidad de software y las siguientes buenas prácticas:

- **Modularidad y Cohesión**: Se aplica el principio de responsabilidad única en los controladores para evitar el deterioro del código.
- **Gestión de Variables de Entorno**: Implementación de configuraciones dinámicas para secretos de JWT y URIs de base de datos, evitando el _hardcoding_ de credenciales.
- **Estándares de Codificación**: Uso de **ESLint** para mantener la consistencia sintáctica y semántica en todo el ecosistema de JavaScript.
- **Seguridad JWT**: Validación estricta del esquema _Bearer_ y manejo de excepciones diferenciadas para tokens expirados o inválidos en la capa de middleware.

**4.4 Pruebas**

Se establece un ciclo de validación técnica compuesto por los siguientes niveles:

- **Pruebas Unitarias e Integración**: Ejecutadas mediante el framework **Jest**, cubriendo la validación de controladores y flujos de autenticación.
- **Criterios de Aceptación**:
    1.  Toda petición a rutas protegidas sin un token válido debe retornar un código de estado 401 o 403.
    2.  Las operaciones de creación de transacciones deben persistir los datos de forma atómica o fallar sin dejar estados inconsistentes.
    3.  El Dashboard debe renderizar estados de carga y fallbacks visuales ante respuestas vacías de la API sin generar errores de consola.

**4.5 Despliegue**

El procedimiento de puesta en producción tras el mantenimiento sigue un flujo de contenerización estandarizado:

1.  **Construcción de Imágenes**: Generación de imágenes Docker independientes para el backend (Node.js) y el frontend (Nginx).
2.  **Orquestación**: Uso de docker-compose.yml para levantar los servicios de aplicación, base de datos y proxies de red de manera coordinada.
3.  **Configuración de Proxy Inverso**: Empleo de **Nginx** para la entrega eficiente de archivos estáticos del frontend y la redirección de tráfico hacia la API del backend.
4.  **Verificación Post-Despliegue**: Ejecución de _health checks_ sobre los contenedores activos para confirmar la conectividad con la base de datos y la disponibilidad de los endpoints.

**5\. Cierre y documentación**

Dada la carencia previa de registros formales sobre la estructura del software, la fase de cierre se centró en la creación de un corpus documental técnico que garantiza la mantenibilidad futura. Estas actividades se desglosan en los siguientes entregables:

- Se diseñaron y crearon diagramas de arquitectura y modelos de datos basados rigurosamente en los esquemas de Mongoose implementados. Esta acción asegura la coherencia entre la base de datos NoSQL y la lógica de negocio actual.
- Se construyó la documentación funcional orientada al usuario final, detallando los flujos de operación validados, tales como el registro de inventarios y la gestión de pedidos.
- Se establecieron los diagramas de componentes y de despliegue que describen la interacción entre el frontend en React y los microservicios del backend, proporcionando por primera vez una visión holística de la infraestructura.

**6\. Herramientas de mantenimiento**

**Entorno de Ejecución y Gestión de Desarrollo**

El empleo de estas herramientas permite la orquestación eficiente de la lógica de negocio y la construcción de una interfaz modular, garantizando un entorno de desarrollo escalable y de alto rendimiento.

- Node.js
- Express
- React
- Tailwind CSS
- NPM

**Persistencia y Gestión de Datos**

Esta categoría es fundamental para asegurar la integridad de las transacciones y permitir que el esquema de datos evolucione de manera flexible ante nuevos requerimientos funcionales.

- MongoDB
- Mongoose

**Contenerización e Infraestructura**

El uso de estas tecnologías garantiza la paridad de entornos y la portabilidad del sistema, facilitando el despliegue seguro en infraestructuras de nube mediante microservicios independientes.

- Docker
- Docker Compose
- Nginx

**Calidad de Código y Pruebas**

La implementación de estas herramientas es vital para mitigar la deuda técnica, prevenir regresiones durante el mantenimiento y asegurar el cumplimiento de estándares de seguridad y codificación.

- Jest
- ESLint
- Variables de Entorno (.env)

**7\. Riesgos y Planes de Contingencia**

**7.1 Identificación de riesgos**

La ejecución del mantenimiento y la operación continua del sistema están sujetas a diversos factores que pueden comprometer su estabilidad. Se categorizan los riesgos detectados de la siguiente manera:

- **Riesgos Técnicos**:
    - **Inconsistencia de Datos**: Fallos en la atomicidad de las funciones de TransactionController.js que podrían generar registros huérfanos o duplicados en el inventario.
    - **Vulnerabilidades de Seguridad**: Compromiso de la clave secreta de JWT o gestión inadecuada de la expiración de tokens en auth.js, permitiendo accesos no autorizados.
    - **Pérdida de Conectividad**: Fallos en el enlace con clústeres externos de MongoDB (ej. MongoDB Atlas) configurados en dbConnection.js.
    - **Degradación del Rendimiento**: Latencias críticas en consultas de productos debido a la falta de índices optimizados en el esquema de Mongoose.
- **Riesgos Operativos**:
    - **Fallo de Orquestación**: Errores en la configuración de docker-compose.yml que impidan el levantamiento simultáneo del backend y el frontend.
    - **Obsolescencia de Software**: Incompatibilidad surgida por la actualización de dependencias críticas en package.json sin validación previa en el entorno de pruebas.
- **Riesgos Humanos**:
    - **Exposición de Credenciales**: Filtración accidental de variables de entorno sensibles (secrets, URIs) por una gestión inadecuada de los archivos .env.
    - **Manipulación Errónea**: Ejecución incorrecta de scripts de siembra de datos (seed.js) que sobrescriban información real en producción.

**7.2 Planes de mitigación**

- Programación de _cron jobs_ para respaldos diarios con mongodump y empleo de volúmenes persistentes en Docker para asegurar la persistencia ante reinicios.
- Rotación periódica de jwtSecret, implementación de certificados SSL/TLS en Nginx y validación estricta de esquemas en la capa de middleware.
- Integración de sistemas de _logging_ para detección de errores en tiempo real y ejecución de suites de pruebas automatizadas con Jest.

**8\. ANEXOS**

**REPOSITORIO:** https://github.com/JohannCaizaguano/Recuperacion

**9\. CONCLUSIONES Y RECOMENDACIONES:**

**Conclusiones**

- La ejecución del mantenimiento correctivo en los controladores de transacciones y pedidos permitió subsanar fallas de lógica que comprometían la integridad del inventario, asegurando una sincronización atómica entre las operaciones del cliente y la persistencia en la base de datos NoSQL.
- La reestructuración del middleware de autenticación y la implementación de validaciones estrictas para los JSON Web Tokens (JWT) mitigaron riesgos críticos de acceso no autorizado, garantizando que el flujo de información sensible se mantenga protegido bajo estándares industriales (RFC 7519).
- La aplicación de técnicas de refactorización y la integración de herramientas de análisis estático (ESLint) y pruebas automatizadas (Jest) elevaron la cohesión de los módulos principales, reduciendo el acoplamiento y facilitando la escalabilidad futura del software.

**Recomendaciones**

- Se sugiere automatizar el ciclo de integración y despliegue continuo para garantizar que toda modificación en el repositorio sea sometida a pruebas de regresión y análisis de vulnerabilidades de forma automática antes de su puesta en producción.
- Es fundamental incrementar el porcentaje de cobertura en las pruebas unitarias y de integración, especialmente en los flujos críticos de gestión de stock y reportes financieros, para detectar colisiones lógicas en etapas tempranas del ciclo de vida.
- Se recomienda integrar soluciones de monitoreo en tiempo real para supervisar el rendimiento de los endpoints y el estado de la base de datos, permitiendo una respuesta proactiva ante posibles degradaciones de servicio o picos anómalos de tráfico.
- Dada la estructura actual basada en contenedores, se plantea evaluar la segmentación de la lógica de negocio en servicios independientes para optimizar el escalamiento horizontal y mejorar la tolerancia a fallos en módulos aislados del sistema.

1.  **BIBLIOGRAFÍA:**