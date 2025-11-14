# DOCUMENTACIÓN DEL PROYECTO NOVALERN LMS
## Sistema de Gestión de Aprendizaje

---

## A. DESCRIPCIÓN Y OBJETIVOS DEL PROYECTO DE SOFTWARE

### Descripción General

**NovaLearn LMS** (Learning Management System) es un sistema integral de gestión de aprendizaje desarrollado como proyecto de pasantía universitaria, diseñado para democratizar el acceso a la educación mediante tecnología moderna y accesible. El sistema proporciona una plataforma completa para la creación, gestión e impartición de cursos en línea, orientada principalmente a instituciones educativas y empresas en la República Dominicana.

La plataforma soporta dos tipos de usuarios principales:
- **Instructores**: Crean y gestionan cursos, módulos, lecciones, evaluaciones y contenido multimedia
- **Estudiantes**: Navegan catálogos de cursos, se inscriben, acceden a contenido de video, completan evaluaciones y monitorean su progreso

### Objetivos del Proyecto

#### Objetivos Generales

1. **Crear una plataforma de aprendizaje digital accesible** que permita a instructores y estudiantes interactuar de manera eficiente en un entorno virtual de enseñanza.

2. **Facilitar la gestión integral de cursos** mediante herramientas intuitivas que cubran todo el ciclo de vida del contenido educativo: creación, publicación, inscripción, consumo y evaluación.

3. **Proporcionar seguimiento automatizado del progreso estudiantil** con métricas y analíticas que permitan tanto a estudiantes como instructores monitorear el avance en tiempo real.

#### Objetivos Específicos

1. **Sistema de Autenticación y Autorización**
   - Implementar autenticación segura mediante OpenID Connect (Replit Auth)
   - Gestionar roles diferenciados (estudiante/instructor) con permisos específicos
   - Mantener sesiones persistentes y seguras

2. **Gestión de Contenido Educativo**
   - Permitir a instructores crear cursos con estructura jerárquica (curso → módulo → lección)
   - Soportar contenido multimedia, especialmente videos pregrabados
   - Implementar sistema de publicación/borrador para control de visibilidad
   - Categorizar cursos por nivel (principiante, intermedio, avanzado)

3. **Sistema de Evaluaciones**
   - Implementar quizzes con calificación automática (opción múltiple, verdadero/falso)
   - Soportar asignaciones con envío de archivos y calificación manual
   - Establecer porcentajes de aprobación configurables

4. **Seguimiento de Progreso**
   - Rastrear completitud de lecciones a nivel individual
   - Calcular porcentajes de avance por curso
   - Registrar intentos de evaluaciones con resultados históricos

5. **Almacenamiento de Archivos**
   - Integrar Object Storage (Google Cloud Storage) para videos y documentos
   - Implementar URLs presignadas para carga segura
   - Gestionar control de acceso a archivos (ACL)

6. **Interfaz de Usuario Intuitiva**
   - Diseñar dashboards diferenciados para estudiantes e instructores
   - Proporcionar navegación clara mediante sidebar colapsable
   - Implementar reproductor de video HTML5 integrado
   - Crear formularios validados para creación de contenido

7. **Analíticas y Reportes**
   - Proveer estadísticas para estudiantes (cursos inscritos, progreso, lecciones completadas)
   - Ofrecer métricas para instructores (inscripciones, engagement, rendimiento)

### Alcance del Proyecto

**Incluye:**
- Plataforma web completa (frontend + backend)
- Base de datos relacional PostgreSQL
- Integración con almacenamiento en la nube
- Sistema de autenticación OAuth 2.0
- Gestión completa de cursos y contenido
- Sistema de evaluaciones básico
- Seguimiento de progreso estudiantil

**No Incluye (Fases Futuras):**
- Aplicaciones móviles nativas
- Videoconferencias en vivo
- Foros de discusión
- Certificados automáticos
- Integración con sistemas de pago

---

## B. DESCRIPCIÓN DE LA PROBLEMÁTICA O SITUACIÓN A SER ABORDADA

### Contexto y Problemática

En la era digital actual, la educación en línea se ha convertido en una necesidad fundamental, especialmente en países en desarrollo como la República Dominicana. Sin embargo, varias problemáticas limitan el acceso y la calidad de la educación virtual:

#### 1. **Limitado Acceso a Plataformas Educativas de Calidad**

**Problema:** 
Las plataformas LMS comerciales existentes (Moodle, Canvas, Blackboard) son:
- Costosas para instituciones educativas pequeñas y medianas
- Complejas de configurar y mantener
- Requieren infraestructura especializada
- Tienen interfaces poco intuitivas para usuarios no técnicos

**Impacto:**
- Instituciones educativas pequeñas no pueden costear soluciones empresariales
- Instructores independientes carecen de plataformas accesibles para compartir conocimiento
- Estudiantes enfrentan barreras de entrada por interfaces complicadas

#### 2. **Desconexión entre Creación y Consumo de Contenido**

**Problema:**
Los sistemas existentes separan artificialmente las herramientas de creación de contenido de las de consumo:
- Instructores deben usar múltiples plataformas (YouTube para videos, Google Drive para archivos, Zoom para clases)
- Estudiantes pierden contexto al saltar entre aplicaciones
- Dificulta el seguimiento centralizado del progreso

**Impacto:**
- Experiencia fragmentada para usuarios
- Dificultad para mantener consistencia en el aprendizaje
- Pérdida de datos de progreso entre plataformas

#### 3. **Falta de Seguimiento Automatizado del Progreso**

**Problema:**
Muchas soluciones caseras o gratuitas no ofrecen:
- Tracking automático de lecciones completadas
- Cálculo de porcentajes de avance
- Historial de intentos de evaluaciones
- Analíticas para instructores

**Impacto:**
- Instructores deben rastrear manualmente el progreso de estudiantes
- Estudiantes no pueden visualizar su avance claramente
- Dificulta identificar estudiantes en riesgo de abandono

#### 4. **Gestión Ineficiente de Contenido Multimedia**

**Problema:**
El contenido de video representa desafíos técnicos:
- Requiere almacenamiento robusto y escalable
- Necesita streaming eficiente
- Debe protegerse contra acceso no autorizado
- Implica costos significativos de almacenamiento y ancho de banda

**Impacto:**
- Instructores limitan el uso de video por complejidad técnica
- Baja calidad de reproducción afecta la experiencia de aprendizaje
- Riesgo de piratería de contenido educativo

#### 5. **Ausencia de Evaluaciones Inteligentes**

**Problema:**
Las evaluaciones en plataformas básicas son:
- Manuales y consumen tiempo del instructor
- No ofrecen retroalimentación inmediata al estudiante
- Carecen de bancos de preguntas reutilizables
- No permiten múltiples intentos o aprendizaje adaptativo

**Impacto:**
- Sobrecarga de trabajo para instructores
- Retraso en retroalimentación afecta el aprendizaje
- Dificulta escalar cursos con muchos estudiantes

### Justificación de la Solución

NovaLearn LMS aborda estas problemáticas mediante:

1. **Solución Integral y Gratuita**
   - Plataforma unificada sin costos de licencia
   - Infraestructura en la nube sin requerir servidores propios
   - Interfaz moderna e intuitiva siguiendo principios de Material Design

2. **Experiencia Unificada**
   - Todo el ciclo de aprendizaje en una sola plataforma
   - Almacenamiento centralizado de contenido multimedia
   - Navegación coherente entre creación y consumo

3. **Automatización del Seguimiento**
   - Cálculo automático de progreso por lección y curso
   - Dashboards con métricas en tiempo real
   - Historial completo de actividad estudiantil

4. **Gestión Profesional de Multimedia**
   - Integración con Google Cloud Storage para escalabilidad
   - URLs presignadas para seguridad
   - Control de acceso granular (ACL)

5. **Evaluaciones Inteligentes**
   - Calificación automática para quizzes de opción múltiple
   - Retroalimentación inmediata al estudiante
   - Historial de intentos para análisis de aprendizaje

### Beneficiarios del Sistema

**Instituciones Educativas:**
- Universidades y colegios con programas en línea
- Centros de formación técnica
- Academias especializadas

**Instructores Independientes:**
- Profesionales que ofrecen cursos especializados
- Tutores que complementan enseñanza presencial
- Expertos que monetizan conocimiento

**Estudiantes:**
- Estudiantes universitarios en modalidad virtual
- Profesionales que buscan capacitación continua
- Autodidactas que complementan su formación

**Empresas:**
- Departamentos de capacitación interna
- Programas de onboarding para nuevos empleados
- Desarrollo profesional continuo

---

## C. ELEMENTOS Y COMPONENTES PRINCIPALES DEL SISTEMA

### Arquitectura del Sistema

NovaLearn LMS sigue una arquitectura de tres capas (frontend, backend, base de datos) con integración de servicios externos para almacenamiento y autenticación.

```
┌─────────────────────────────────────────────────────────────────┐
│                         CAPA DE PRESENTACIÓN                     │
│                        (React + TypeScript)                      │
├─────────────────────────────────────────────────────────────────┤
│  • Landing Page          • Dashboards (Estudiante/Instructor)   │
│  • Catálogo de Cursos    • Reproductor de Video                 │
│  • Editor de Curso       • Formularios de Evaluación            │
│  • Componentes UI        • Gestión de Progreso                  │
└─────────────────────────────────────────────────────────────────┘
                                  ↕ REST API (JSON)
┌─────────────────────────────────────────────────────────────────┐
│                      CAPA DE APLICACIÓN                          │
│                     (Node.js + Express.js)                       │
├─────────────────────────────────────────────────────────────────┤
│  • Autenticación OAuth    • APIs RESTful                        │
│  • Middleware de Seguridad• Validación de Datos                 │
│  • Gestión de Sesiones    • Lógica de Negocio                   │
│  • Control de Acceso      • Procesamiento de Evaluaciones       │
└─────────────────────────────────────────────────────────────────┘
                                  ↕ Drizzle ORM
┌─────────────────────────────────────────────────────────────────┐
│                       CAPA DE DATOS                              │
│                   (PostgreSQL - Neon Database)                   │
├─────────────────────────────────────────────────────────────────┤
│  • Usuarios y Perfiles    • Cursos y Módulos                    │
│  • Lecciones              • Inscripciones                       │
│  • Evaluaciones           • Progreso                            │
│  • Sesiones               • Submissions                         │
└─────────────────────────────────────────────────────────────────┘

┌─────────────────────────────────────────────────────────────────┐
│                      SERVICIOS EXTERNOS                          │
├─────────────────────────────────────────────────────────────────┤
│  • Replit Auth (OpenID)   • Google Cloud Storage                │
│  • Neon Database (PG)     • Replit Sidecar (GCS Auth)           │
└─────────────────────────────────────────────────────────────────┘
```

### Componentes Principales

#### 1. **MÓDULO DE AUTENTICACIÓN Y AUTORIZACIÓN**

**Propósito:** Gestionar identidades de usuario, sesiones y permisos de acceso.

**Subcomponentes:**
- **Sistema de Autenticación (Replit Auth)**
  - Implementación: OpenID Connect (OAuth 2.0)
  - Flujo: Redirect → Autorización → Token Exchange → Sesión
  - Tecnología: Passport.js + openid-client
  
- **Gestión de Sesiones**
  - Almacenamiento: PostgreSQL (tabla `sessions`)
  - Duración: 7 días con renovación automática
  - Seguridad: Cookies HTTP-only, secure, SameSite
  
- **Control de Roles**
  - Roles soportados: `student`, `instructor`
  - Middleware: `isAuthenticated`, `isInstructor`
  - Asignación: Automática en primer login (default: student)

**Procesos Básicos:**
1. Usuario inicia sesión → Redirección a Replit Auth
2. Replit Auth valida credenciales → Emite token ID
3. Backend valida token → Crea/actualiza usuario en DB
4. Se establece sesión → Cookie segura enviada al cliente
5. Requests subsiguientes incluyen cookie → Middleware valida sesión

#### 2. **MÓDULO DE GESTIÓN DE CURSOS**

**Propósito:** Permitir creación, edición, publicación y organización de cursos.

**Subcomponentes:**
- **CRUD de Cursos**
  - Creación de cursos con metadata (título, descripción, categoría, nivel)
  - Gestión de estados (draft, published, archived)
  - Asignación automática de instructor propietario
  - Carga de thumbnails (imágenes de portada)

- **Estructura Jerárquica**
  ```
  Curso
  ├── Módulo 1
  │   ├── Lección 1.1
  │   ├── Lección 1.2
  │   └── Lección 1.3
  ├── Módulo 2
  │   ├── Lección 2.1
  │   └── Lección 2.2
  ```
  - Módulos: Agrupaciones lógicas de lecciones con orden secuencial
  - Lecciones: Unidades mínimas de contenido con videos y descripciones
  - Ordenamiento: Campo `order` para secuencia personalizable

- **Editor de Curso (Instructor)**
  - Interfaz por pestañas: Resumen, Contenido, Quizzes, Tareas
  - Arrastrar y soltar para reordenar (futuro)
  - Vista previa antes de publicar
  - Publicación con un clic

**Procesos Básicos:**
1. Instructor crea curso → Estado inicial: `draft`
2. Agrega módulos con títulos y descripciones
3. Dentro de cada módulo, crea lecciones
4. Sube videos para cada lección (Object Storage)
5. Configura quizzes y asignaciones (opcional)
6. Publica curso → Estado cambia a `published`
7. Estudiantes pueden ver e inscribirse en cursos publicados

#### 3. **MÓDULO DE CONTENIDO MULTIMEDIA**

**Propósito:** Gestionar almacenamiento, carga y reproducción de videos y archivos.

**Subcomponentes:**
- **Integración con Google Cloud Storage**
  - Bucket: Configurado mediante Replit Object Storage
  - Directorios: `/public` (acceso público), `/.private` (acceso restringido)
  - Autenticación: Replit Sidecar (proxy local) para credenciales GCS

- **Sistema de Carga de Archivos**
  - Componente: `ObjectUploader.tsx`
  - Flujo de carga:
    1. Cliente solicita URL presignada al backend
    2. Backend genera presigned URL (GCS)
    3. Cliente carga archivo directamente a GCS usando presigned URL
    4. Progreso monitoreado con XHR events
    5. URL final almacenada en DB (campo `videoUrl`)
  
- **Control de Acceso (ACL)**
  - Metadata en GCS: `owner`, `visibility` (public/private)
  - Validación: Middleware verifica permisos antes de generar URLs
  - Seguridad: URLs presignadas con expiración temporal

- **Reproductor de Video**
  - Tecnología: HTML5 `<video>` nativo
  - Controles: Play/pause, volumen, pantalla completa
  - Formatos soportados: MP4, WebM, OGG

**Procesos Básicos:**
1. Instructor selecciona archivo de video
2. Frontend llama `/api/objects/upload` → Obtiene presigned URL
3. Navegador carga archivo directamente a GCS con barra de progreso
4. GCS retorna URL permanente del objeto
5. URL se almacena en campo `videoUrl` de la lección
6. Estudiante accede a lección → Backend verifica inscripción
7. Si autorizado, genera presigned URL de descarga temporal
8. Cliente reproduce video desde URL presignada

#### 4. **MÓDULO DE INSCRIPCIONES Y PROGRESO**

**Propósito:** Gestionar inscripciones de estudiantes y rastrear avance en cursos.

**Subcomponentes:**
- **Sistema de Inscripción**
  - Inscripción con un clic desde catálogo de cursos
  - Verificación de duplicados
  - Registro de fecha de inscripción (`enrolledAt`)
  - Inicialización de progreso en 0%

- **Tracking de Progreso**
  - Nivel de lección: Tabla `lesson_progress` (completed: boolean)
  - Nivel de curso: Campo `progressPercentage` en `enrollments`
  - Cálculo: (lecciones completadas / total lecciones) × 100
  - Actualización: Automática al marcar lección como completada

- **Dashboard de Estudiante**
  - Vista de cursos inscritos con porcentaje de avance
  - Estadísticas: Total cursos, progreso promedio, lecciones completadas
  - Acceso rápido a continuar donde se quedó

**Procesos Básicos:**
1. Estudiante navega catálogo → Selecciona curso
2. Clic en "Inscribirse" → POST `/api/enrollments`
3. Backend crea registro en tabla `enrollments`
4. Estudiante accede a curso inscrito → Ve módulos y lecciones
5. Completa lección → Clic en "Marcar como completada"
6. Backend crea/actualiza `lesson_progress`
7. Recalcula `progressPercentage` del curso
8. Frontend actualiza UI con nuevo progreso

#### 5. **MÓDULO DE EVALUACIONES**

**Propósito:** Implementar quizzes y asignaciones para evaluar aprendizaje.

**Subcomponentes:**
- **Quizzes (Evaluaciones Automáticas)**
  - Tipos de preguntas: Opción múltiple, Verdadero/Falso
  - Banco de preguntas: Tabla `quiz_questions`
  - Configuración: Porcentaje mínimo de aprobación
  - Intentos: Historial completo en `quiz_attempts`
  - Calificación: Automática comparando respuestas con `correctAnswer`

- **Asignaciones (Evaluaciones Manuales)**
  - Descripción y fecha de entrega
  - Envío de archivos mediante Object Storage
  - Calificación manual por instructor (0-100)
  - Retroalimentación textual (`feedback`)
  - Estados: Pendiente, Enviada, Calificada

- **Sistema de Calificación**
  - Quizzes: Cálculo automático de score
  - Asignaciones: Campo `grade` (nullable hasta calificación)
  - Aprobado/Reprobado: Campo `passed` en `quiz_attempts`

**Procesos Básicos (Quiz):**
1. Instructor crea quiz asociado a lección
2. Agrega preguntas con opciones y respuesta correcta
3. Establece porcentaje de aprobación (ej: 70%)
4. Estudiante accede a lección con quiz
5. Responde todas las preguntas → Submit
6. Backend compara respuestas con `correctAnswer`
7. Calcula score y determina si pasó
8. Almacena en `quiz_attempts`
9. Muestra resultado inmediato al estudiante

**Procesos Básicos (Asignación):**
1. Instructor crea asignación con descripción y fecha límite
2. Estudiante descarga descripción
3. Completa asignación offline
4. Sube archivo mediante `ObjectUploader`
5. Envía submission → Almacena en `assignment_submissions`
6. Instructor ve submissions pendientes
7. Descarga archivo, revisa y califica
8. Ingresa score (0-100) y feedback
9. Estudiante recibe notificación de calificación (futuro)

#### 6. **MÓDULO DE INTERFAZ DE USUARIO**

**Propósito:** Proporcionar interfaces intuitivas y responsivas para todos los usuarios.

**Subcomponentes:**
- **Landing Page**
  - Hero section con call-to-action
  - Características principales del sistema
  - Llamado a registro/login
  
- **Sistema de Navegación**
  - Sidebar colapsable con menú contextual
  - Rutas protegidas por autenticación
  - Navegación diferenciada por rol:
    - Estudiante: Mis Cursos, Explorar, Dashboard
    - Instructor: Mis Cursos, Crear Curso, Analíticas

- **Dashboards**
  - Estudiante: Cursos inscritos, progreso, estadísticas
  - Instructor: Cursos creados, inscripciones, engagement

- **Catálogo de Cursos**
  - Grid de tarjetas con información de curso
  - Filtros: Categoría, nivel, instructor
  - Búsqueda por título/descripción
  - Vista detallada de curso

- **Reproductor/Visualizador de Curso**
  - Sidebar con módulos y lecciones
  - Área principal con reproductor de video
  - Controles: Marcar como completada, navegación prev/next
  - Indicadores de progreso visual

- **Editor de Curso (Instructor)**
  - Formulario multi-paso
  - Pestañas: Información, Contenido, Evaluaciones
  - Componentes reutilizables (ObjectUploader)
  - Validación en tiempo real

**Tecnologías UI:**
- React + TypeScript (componentes funcionales)
- Tailwind CSS (estilos utility-first)
- shadcn/ui (componentes accesibles)
- Lucide React (iconografía)
- React Hook Form (formularios validados)

#### 7. **MÓDULO DE ANALÍTICAS Y REPORTES**

**Propósito:** Proporcionar insights sobre uso y rendimiento del sistema.

**Subcomponentes:**
- **Estadísticas de Estudiante**
  - Cursos inscritos (total)
  - Progreso promedio
  - Lecciones completadas
  - Evaluaciones aprobadas/reprobadas

- **Estadísticas de Instructor**
  - Total de cursos creados
  - Inscripciones por curso
  - Tasa de completitud promedio
  - Engagement de estudiantes

- **Métricas del Sistema** (futuro)
  - Usuarios activos diarios/mensuales
  - Cursos más populares
  - Retención de estudiantes
  - Tiempo promedio de completitud

**Procesos Básicos:**
1. Usuario accede a dashboard
2. Backend consulta tablas relevantes
3. Agrega datos (enrollments, lesson_progress, quiz_attempts)
4. Calcula métricas
5. Retorna JSON con estadísticas
6. Frontend renderiza gráficos y tarjetas de métricas

### Flujos de Proceso Principales

#### Flujo 1: Creación y Publicación de Curso

```
[Instructor] → Login → Dashboard Instructor
     ↓
Clic "Crear Curso" → Formulario de Curso
     ↓
Ingresa: Título, Descripción, Categoría, Nivel → Guardar (Estado: draft)
     ↓
Editar Curso → Pestaña "Contenido"
     ↓
Crear Módulo 1 → Ingresar título/descripción → Guardar
     ↓
Crear Lección 1.1 → Título, descripción, seleccionar video
     ↓
ObjectUploader → Seleccionar archivo → Progreso de carga → URL guardada
     ↓
Repetir para más lecciones/módulos
     ↓
Pestaña "Quizzes" → Crear Quiz → Agregar preguntas → Guardar
     ↓
Pestaña "Resumen" → Revisar información → Clic "Publicar"
     ↓
Estado cambia a "published" → Visible en catálogo
```

#### Flujo 2: Inscripción y Consumo de Curso

```
[Estudiante] → Login → Explorar Cursos
     ↓
Navegar catálogo → Clic en curso de interés
     ↓
Ver detalles (descripción, módulos, instructor) → Clic "Inscribirse"
     ↓
POST /api/enrollments → Registro creado → Confirmación
     ↓
Acceder a "Mis Cursos" → Seleccionar curso inscrito
     ↓
Ver estructura (Módulos → Lecciones) → Clic en Lección 1.1
     ↓
Reproductor de video carga → Estudiante ve contenido
     ↓
Al terminar → Clic "Marcar como completada"
     ↓
POST /api/lesson-progress → Actualiza DB → Recalcula progreso
     ↓
UI actualiza porcentaje → Navega a siguiente lección
     ↓
Completar quiz → Responder preguntas → Submit
     ↓
Calificación automática → Ver resultado → Continuar curso
     ↓
Repetir hasta completar 100% del curso
```

#### Flujo 3: Evaluación y Retroalimentación

```
[Instructor] Crea Asignación → Título, Descripción, Fecha límite
     ↓
[Estudiante] Ve asignación → Trabaja offline → Completa tarea
     ↓
Sube archivo → ObjectUploader → URL guardada en submission
     ↓
POST /api/assignment-submissions → Registro creado (grade: null)
     ↓
[Instructor] Dashboard → "Submissions Pendientes"
     ↓
Descarga archivo → Revisa trabajo → Decide calificación
     ↓
Ingresa score (ej: 85) y feedback → PUT /api/assignment-submissions/:id
     ↓
[Estudiante] Ve notificación (futuro) → Accede a submission
     ↓
Ve calificación y retroalimentación → Aprende de errores
```

---

## D. ESTRUCTURA DE DATOS PARA LA BASE DE DATOS

### Información General de la Base de Datos

- **Nombre de la Base de Datos:** `novalern_lms`
- **Motor de Base de Datos:** PostgreSQL 15+ (Neon Serverless)
- **Conexión:** WebSocket-based connection pooling
- **ORM:** Drizzle ORM (type-safe)
- **Migraciones:** Drizzle Kit (schema migrations)
- **Codificación:** UTF-8
- **Timezone:** UTC
- **Total de Tablas:** 12

### Diagrama Entidad-Relación (ERD)

```
┌─────────────────┐
│     USERS       │
│─────────────────│
│ PK id           │
│    email (UQ)   │
│    firstName    │
│    lastName     │
│    role         │
│    ...          │
└────────┬────────┘
         │
         │ 1:N
         ├────────────────────────────┐
         │                            │
         ▼                            ▼
┌─────────────────┐          ┌──────────────────┐
│    COURSES      │          │   ENROLLMENTS    │
│─────────────────│          │──────────────────│
│ PK id           │ 1:N      │ PK id            │
│ FK instructorId │◄─────────│ FK userId        │
│    title        │          │ FK courseId      │
│    description  │          │    enrolledAt    │
│    status       │          │    progress%     │
│    ...          │          └──────────────────┘
└────────┬────────┘
         │
         │ 1:N
         ▼
┌─────────────────┐
│    MODULES      │
│─────────────────│
│ PK id           │
│ FK courseId     │
│    title        │
│    order        │
│    ...          │
└────────┬────────┘
         │
         │ 1:N
         ▼
┌─────────────────┐
│    LESSONS      │
│─────────────────│
│ PK id           │
│ FK moduleId     │
│    title        │
│    videoUrl     │
│    order        │
│    ...          │
└────────┬────────┘
         │
         ├──────────────┬──────────────┬──────────────┐
         │ 1:N          │ 1:N          │ 1:N          │
         ▼              ▼              ▼              ▼
┌────────────────┐ ┌──────────┐ ┌─────────────┐ ┌──────────────────┐
│ LESSON_PROGRESS│ │ QUIZZES  │ │ ASSIGNMENTS │ │                  │
│────────────────│ │──────────│ │─────────────│ │                  │
│ PK id          │ │ PK id    │ │ PK id       │ │                  │
│ FK userId      │ │ FK lessonId│ FK lessonId │ │                  │
│ FK lessonId    │ │    title │ │    title    │ │                  │
│    completed   │ │ passPerc.│ │    dueDate  │ │                  │
└────────────────┘ └─────┬────┘ └──────┬──────┘ │                  │
                         │             │        │                  │
                         │ 1:N         │ 1:N    │                  │
                         ▼             ▼        │                  │
              ┌─────────────────┐ ┌───────────────────────┐       │
              │ QUIZ_QUESTIONS  │ │ ASSIGNMENT_SUBMISSIONS│       │
              │─────────────────│ │───────────────────────│       │
              │ PK id           │ │ PK id                 │       │
              │ FK quizId       │ │ FK userId             │       │
              │    question     │ │ FK assignmentId       │       │
              │    correctAns   │ │    fileUrl            │       │
              │    options      │ │    grade              │       │
              └─────────────────┘ └───────────────────────┘       │
                         │                                         │
                         │ 1:N                                     │
                         ▼                                         │
              ┌─────────────────┐                                 │
              │  QUIZ_ATTEMPTS  │                                 │
              │─────────────────│                                 │
              │ PK id           │                                 │
              │ FK userId       │                                 │
              │ FK quizId       │                                 │
              │    answers      │                                 │
              │    score        │                                 │
              │    passed       │                                 │
              └─────────────────┘                                 │
                                                                   │
┌─────────────────┐                                               │
│    SESSIONS     │                                               │
│─────────────────│ (Autenticación)                               │
│ PK sid          │                                               │
│    sess (jsonb) │                                               │
│    expire       │                                               │
└─────────────────┘                                               │
```

### Diccionario de Datos Completo

---

#### TABLA 1: `users`
**Descripción:** Almacena información de usuarios del sistema (estudiantes e instructores)

| Campo | Tipo de Dato | Restricciones | Descripción |
|-------|--------------|---------------|-------------|
| `id` | VARCHAR | PRIMARY KEY, DEFAULT uuid | Identificador único del usuario |
| `email` | VARCHAR | UNIQUE, NULLABLE | Correo electrónico del usuario |
| `first_name` | VARCHAR | NULLABLE | Nombre del usuario |
| `last_name` | VARCHAR | NULLABLE | Apellido del usuario |
| `profile_image_url` | VARCHAR | NULLABLE | URL de la imagen de perfil |
| `role` | VARCHAR | NOT NULL, DEFAULT 'student' | Rol del usuario ('student' o 'instructor') |
| `created_at` | TIMESTAMP | DEFAULT NOW() | Fecha de creación del registro |
| `updated_at` | TIMESTAMP | DEFAULT NOW() | Fecha de última actualización |

**Índices:**
- PRIMARY KEY en `id`
- UNIQUE en `email`

**Relaciones:**
- 1:N con `courses` (como instructor)
- 1:N con `enrollments`
- 1:N con `lesson_progress`
- 1:N con `quiz_attempts`
- 1:N con `assignment_submissions`

---

#### TABLA 2: `sessions`
**Descripción:** Almacena sesiones de usuario para autenticación persistente

| Campo | Tipo de Dato | Restricciones | Descripción |
|-------|--------------|---------------|-------------|
| `sid` | VARCHAR | PRIMARY KEY | Identificador de sesión |
| `sess` | JSONB | NOT NULL | Datos de la sesión en formato JSON |
| `expire` | TIMESTAMP | NOT NULL | Fecha de expiración de la sesión |

**Índices:**
- PRIMARY KEY en `sid`
- INDEX en `expire` (para limpieza de sesiones expiradas)

---

#### TABLA 3: `courses`
**Descripción:** Almacena información de cursos creados por instructores

| Campo | Tipo de Dato | Restricciones | Descripción |
|-------|--------------|---------------|-------------|
| `id` | VARCHAR | PRIMARY KEY, DEFAULT uuid | Identificador único del curso |
| `title` | VARCHAR(255) | NOT NULL | Título del curso |
| `description` | TEXT | NULLABLE | Descripción detallada del curso |
| `instructor_id` | VARCHAR | NOT NULL, FK → users(id) ON DELETE CASCADE | ID del instructor propietario |
| `thumbnail_url` | VARCHAR | NULLABLE | URL de la imagen de portada |
| `status` | VARCHAR | NOT NULL, DEFAULT 'draft' | Estado del curso ('draft', 'published', 'archived') |
| `category` | VARCHAR | NULLABLE | Categoría del curso (ej: 'programming', 'design') |
| `level` | VARCHAR | NULLABLE | Nivel de dificultad ('beginner', 'intermediate', 'advanced') |
| `created_at` | TIMESTAMP | DEFAULT NOW() | Fecha de creación |
| `updated_at` | TIMESTAMP | DEFAULT NOW() | Fecha de última actualización |

**Índices:**
- PRIMARY KEY en `id`
- FOREIGN KEY en `instructor_id` → `users(id)`
- INDEX en `status` (para consultas de cursos publicados)
- INDEX en `category` (para filtrado)

**Relaciones:**
- N:1 con `users` (instructor)
- 1:N con `modules`
- 1:N con `enrollments`

---

#### TABLA 4: `modules`
**Descripción:** Agrupa lecciones dentro de un curso

| Campo | Tipo de Dato | Restricciones | Descripción |
|-------|--------------|---------------|-------------|
| `id` | VARCHAR | PRIMARY KEY, DEFAULT uuid | Identificador único del módulo |
| `course_id` | VARCHAR | NOT NULL, FK → courses(id) ON DELETE CASCADE | ID del curso padre |
| `title` | VARCHAR(255) | NOT NULL | Título del módulo |
| `description` | TEXT | NULLABLE | Descripción del módulo |
| `order` | INTEGER | NOT NULL, DEFAULT 0 | Orden de presentación (secuencial) |
| `created_at` | TIMESTAMP | DEFAULT NOW() | Fecha de creación |

**Índices:**
- PRIMARY KEY en `id`
- FOREIGN KEY en `course_id` → `courses(id)`
- INDEX en `(course_id, order)` (para ordenamiento)

**Relaciones:**
- N:1 con `courses`
- 1:N con `lessons`

---

#### TABLA 5: `lessons`
**Descripción:** Unidad mínima de contenido educativo con video

| Campo | Tipo de Dato | Restricciones | Descripción |
|-------|--------------|---------------|-------------|
| `id` | VARCHAR | PRIMARY KEY, DEFAULT uuid | Identificador único de la lección |
| `module_id` | VARCHAR | NOT NULL, FK → modules(id) ON DELETE CASCADE | ID del módulo padre |
| `title` | VARCHAR(255) | NOT NULL | Título de la lección |
| `description` | TEXT | NULLABLE | Descripción del contenido |
| `video_url` | VARCHAR | NULLABLE | URL del video en Object Storage |
| `duration` | INTEGER | NULLABLE | Duración del video en segundos |
| `order` | INTEGER | NOT NULL, DEFAULT 0 | Orden dentro del módulo |
| `created_at` | TIMESTAMP | DEFAULT NOW() | Fecha de creación |

**Índices:**
- PRIMARY KEY en `id`
- FOREIGN KEY en `module_id` → `modules(id)`
- INDEX en `(module_id, order)`

**Relaciones:**
- N:1 con `modules`
- 1:N con `lesson_progress`
- 1:N con `quizzes`
- 1:N con `assignments`

---

#### TABLA 6: `enrollments`
**Descripción:** Registra inscripciones de estudiantes en cursos

| Campo | Tipo de Dato | Restricciones | Descripción |
|-------|--------------|---------------|-------------|
| `id` | VARCHAR | PRIMARY KEY, DEFAULT uuid | Identificador único de la inscripción |
| `user_id` | VARCHAR | NOT NULL, FK → users(id) ON DELETE CASCADE | ID del estudiante |
| `course_id` | VARCHAR | NOT NULL, FK → courses(id) ON DELETE CASCADE | ID del curso |
| `enrolled_at` | TIMESTAMP | DEFAULT NOW() | Fecha de inscripción |
| `completed_at` | TIMESTAMP | NULLABLE | Fecha de completitud del curso (si aplica) |
| `progress_percentage` | INTEGER | NOT NULL, DEFAULT 0 | Porcentaje de avance (0-100) |

**Índices:**
- PRIMARY KEY en `id`
- FOREIGN KEY en `user_id` → `users(id)`
- FOREIGN KEY en `course_id` → `courses(id)`
- UNIQUE en `(user_id, course_id)` (un estudiante solo puede inscribirse una vez)
- INDEX en `user_id` (para consultas de cursos del estudiante)

**Relaciones:**
- N:1 con `users`
- N:1 con `courses`

---

#### TABLA 7: `lesson_progress`
**Descripción:** Rastrea el progreso de cada estudiante por lección

| Campo | Tipo de Dato | Restricciones | Descripción |
|-------|--------------|---------------|-------------|
| `id` | VARCHAR | PRIMARY KEY, DEFAULT uuid | Identificador único del registro |
| `user_id` | VARCHAR | NOT NULL, FK → users(id) ON DELETE CASCADE | ID del estudiante |
| `lesson_id` | VARCHAR | NOT NULL, FK → lessons(id) ON DELETE CASCADE | ID de la lección |
| `completed` | BOOLEAN | NOT NULL, DEFAULT FALSE | Si la lección fue completada |
| `completed_at` | TIMESTAMP | NULLABLE | Fecha de completitud |

**Índices:**
- PRIMARY KEY en `id`
- FOREIGN KEY en `user_id` → `users(id)`
- FOREIGN KEY en `lesson_id` → `lessons(id)`
- UNIQUE en `(user_id, lesson_id)`
- INDEX en `user_id`

**Relaciones:**
- N:1 con `users`
- N:1 con `lessons`

---

#### TABLA 8: `quizzes`
**Descripción:** Define evaluaciones de tipo quiz

| Campo | Tipo de Dato | Restricciones | Descripción |
|-------|--------------|---------------|-------------|
| `id` | VARCHAR | PRIMARY KEY, DEFAULT uuid | Identificador único del quiz |
| `lesson_id` | VARCHAR | NOT NULL, FK → lessons(id) ON DELETE CASCADE | Lección asociada al quiz |
| `title` | VARCHAR(255) | NOT NULL | Título del quiz |
| `pass_percentage` | INTEGER | NOT NULL, DEFAULT 70 | Porcentaje mínimo para aprobar (0-100) |
| `created_at` | TIMESTAMP | DEFAULT NOW() | Fecha de creación |

**Índices:**
- PRIMARY KEY en `id`
- FOREIGN KEY en `lesson_id` → `lessons(id)`
- INDEX en `lesson_id`

**Relaciones:**
- N:1 con `lessons`
- 1:N con `quiz_questions`
- 1:N con `quiz_attempts`

---

#### TABLA 9: `quiz_questions`
**Descripción:** Preguntas individuales de un quiz

| Campo | Tipo de Dato | Restricciones | Descripción |
|-------|--------------|---------------|-------------|
| `id` | VARCHAR | PRIMARY KEY, DEFAULT uuid | Identificador único de la pregunta |
| `quiz_id` | VARCHAR | NOT NULL, FK → quizzes(id) ON DELETE CASCADE | Quiz al que pertenece |
| `question` | TEXT | NOT NULL | Texto de la pregunta |
| `type` | VARCHAR | NOT NULL | Tipo ('multiple_choice', 'true_false') |
| `correct_answer` | VARCHAR | NOT NULL | Respuesta correcta |
| `options` | JSONB | NULLABLE | Array de opciones (para opción múltiple) |
| `order` | INTEGER | NOT NULL, DEFAULT 0 | Orden de presentación |

**Índices:**
- PRIMARY KEY en `id`
- FOREIGN KEY en `quiz_id` → `quizzes(id)`
- INDEX en `(quiz_id, order)`

**Relaciones:**
- N:1 con `quizzes`

**Ejemplo de `options` (JSONB):**
```json
["Opción A", "Opción B", "Opción C", "Opción D"]
```

---

#### TABLA 10: `quiz_attempts`
**Descripción:** Registra intentos de estudiantes en quizzes

| Campo | Tipo de Dato | Restricciones | Descripción |
|-------|--------------|---------------|-------------|
| `id` | VARCHAR | PRIMARY KEY, DEFAULT uuid | Identificador único del intento |
| `user_id` | VARCHAR | NOT NULL, FK → users(id) ON DELETE CASCADE | Estudiante que realizó el intento |
| `quiz_id` | VARCHAR | NOT NULL, FK → quizzes(id) ON DELETE CASCADE | Quiz realizado |
| `answers` | JSONB | NOT NULL | Mapa de respuestas: {questionId: answer} |
| `score` | INTEGER | NOT NULL | Puntaje obtenido (0-100) |
| `passed` | BOOLEAN | NOT NULL | Si aprobó según `pass_percentage` |
| `completed_at` | TIMESTAMP | DEFAULT NOW() | Fecha del intento |

**Índices:**
- PRIMARY KEY en `id`
- FOREIGN KEY en `user_id` → `users(id)`
- FOREIGN KEY en `quiz_id` → `quizzes(id)`
- INDEX en `(user_id, quiz_id)` (para historial de intentos)

**Relaciones:**
- N:1 con `users`
- N:1 con `quizzes`

**Ejemplo de `answers` (JSONB):**
```json
{
  "question-uuid-1": "Opción B",
  "question-uuid-2": "Verdadero",
  "question-uuid-3": "Opción A"
}
```

---

#### TABLA 11: `assignments`
**Descripción:** Define asignaciones/tareas con calificación manual

| Campo | Tipo de Dato | Restricciones | Descripción |
|-------|--------------|---------------|-------------|
| `id` | VARCHAR | PRIMARY KEY, DEFAULT uuid | Identificador único de la asignación |
| `lesson_id` | VARCHAR | NOT NULL, FK → lessons(id) ON DELETE CASCADE | Lección asociada |
| `title` | VARCHAR(255) | NOT NULL | Título de la asignación |
| `description` | TEXT | NOT NULL | Instrucciones detalladas |
| `due_date` | TIMESTAMP | NULLABLE | Fecha límite de entrega |
| `created_at` | TIMESTAMP | DEFAULT NOW() | Fecha de creación |

**Índices:**
- PRIMARY KEY en `id`
- FOREIGN KEY en `lesson_id` → `lessons(id)`
- INDEX en `lesson_id`

**Relaciones:**
- N:1 con `lessons`
- 1:N con `assignment_submissions`

---

#### TABLA 12: `assignment_submissions`
**Descripción:** Registra envíos de estudiantes para asignaciones

| Campo | Tipo de Dato | Restricciones | Descripción |
|-------|--------------|---------------|-------------|
| `id` | VARCHAR | PRIMARY KEY, DEFAULT uuid | Identificador único del envío |
| `user_id` | VARCHAR | NOT NULL, FK → users(id) ON DELETE CASCADE | Estudiante que envió |
| `assignment_id` | VARCHAR | NOT NULL, FK → assignments(id) ON DELETE CASCADE | Asignación correspondiente |
| `content` | TEXT | NULLABLE | Contenido textual (opcional) |
| `file_url` | VARCHAR | NULLABLE | URL del archivo enviado (Object Storage) |
| `submitted_at` | TIMESTAMP | DEFAULT NOW() | Fecha de envío |
| `grade` | INTEGER | NULLABLE | Calificación (0-100, null si no calificado) |
| `feedback` | TEXT | NULLABLE | Retroalimentación del instructor |
| `graded_at` | TIMESTAMP | NULLABLE | Fecha de calificación |

**Índices:**
- PRIMARY KEY en `id`
- FOREIGN KEY en `user_id` → `users(id)`
- FOREIGN KEY en `assignment_id` → `assignments(id)`
- INDEX en `(assignment_id, submitted_at)` (para ordenar por fecha)
- INDEX en `user_id`

**Relaciones:**
- N:1 con `users`
- N:1 con `assignments`

---

### Diagrama de Relaciones (Cardinalidad)

```
USERS (1) ──────────── (N) COURSES
  │                          │
  │                          │
  │ (1)                (1)   │
  │                          │
  ├──────── (N) ENROLLMENTS (N) ──┘
  │
  │ (1)
  │
  ├──────── (N) LESSON_PROGRESS
  │                   │
  │                   │ (N)
  │                   │
  │              (1) LESSONS
  │                   │
  │                   ├──── (N) QUIZZES
  │                   │         │
  │                   │         ├─── (N) QUIZ_QUESTIONS
  │                   │         │
  │ (1)               │         │ (N)
  │                   │         │
  ├──────── (N) QUIZ_ATTEMPTS ──┘
  │
  │ (1)
  │
  ├──────── (N) ASSIGNMENT_SUBMISSIONS
                      │
                      │ (N)
                      │
                 (1) ASSIGNMENTS
                      │
                      │ (N)
                      │
                 (1) LESSONS ──── (N) MODULES
                                        │
                                        │ (N)
                                        │
                                   (1) COURSES
```

### Notas Técnicas

1. **UUIDs:** Todos los IDs utilizan `gen_random_uuid()` de PostgreSQL para identificadores únicos globales

2. **Timestamps:** Todas las fechas usan `TIMESTAMP` con timezone UTC

3. **Cascadas:** La mayoría de relaciones usan `ON DELETE CASCADE` para mantener integridad referencial

4. **JSONB:** Se usa para estructuras complejas (respuestas de quiz, opciones de preguntas, datos de sesión)

5. **Índices:** Se crean índices en:
   - Foreign keys para optimizar JOINs
   - Campos de búsqueda frecuente (status, category)
   - Campos de ordenamiento (order, created_at)

6. **Validaciones:**
   - Roles: Validados en aplicación ('student' | 'instructor')
   - Status: Validados en aplicación ('draft' | 'published' | 'archived')
   - Tipos de pregunta: Validados en aplicación ('multiple_choice' | 'true_false')
   - Porcentajes: Validados como INTEGER 0-100

7. **Seguridad:**
   - Passwords NO almacenados (delegado a Replit Auth)
   - Sesiones en DB con expiración automática
   - URLs presignadas para acceso temporal a archivos

---

## Anexos

### A. Convenciones de Nomenclatura

- **Tablas:** snake_case, plural (ej: `quiz_questions`)
- **Columnas:** snake_case (ej: `created_at`)
- **Foreign Keys:** `<tabla>_id` (ej: `user_id`)
- **Índices:** `idx_<tabla>_<campo>` (ej: `idx_courses_status`)

### B. Scripts de Migración

Las migraciones se gestionan mediante Drizzle Kit:

```bash
# Generar migración
npm run db:generate

# Aplicar migraciones
npm run db:push
```

### C. Backup y Recuperación

- **Backups automáticos:** Neon Database realiza snapshots diarios
- **Retención:** 7 días en plan gratuito
- **Recuperación:** Disponible desde dashboard de Neon

---

**Fecha de Última Actualización:** Noviembre 2025  
**Versión del Documento:** 1.0  
**Autor:** Equipo NovaLearn LMS
