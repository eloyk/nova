# DOCUMENTACIÓN DEL PROYECTO NOVALEARN LMS

---

## 1. PORTADA Y PRESENTACIÓN

**Nombre de la Institución:** Universidad Nacional de Tecnología

**Asignatura:** Desarrollo de Software II

**Título del Proyecto:** NovaLearn LMS - Sistema de Gestión de Aprendizaje

**Integrantes:**
- [Nombre del Estudiante 1]
- [Nombre del Estudiante 2]
- [Nombre del Estudiante 3]

**Profesor(a):** [Nombre del Profesor]

**Fecha de Presentación:** Noviembre 2025

---

## 2. ÍNDICE GENERAL

1. [Portada y Presentación](#1-portada-y-presentación)
2. [Índice General](#2-índice-general)
3. [Introducción](#3-introducción)
4. [Justificación](#4-justificación)
5. [Descripción y Objetivos del Proyecto](#5-descripción-y-objetivos-del-proyecto)
6. [Problemática o Situación a Abordar](#6-problemática-o-situación-a-abordar)
7. [Elementos Principales del Sistema](#7-elementos-principales-del-sistema)
8. [Diseño de la Interfaz Gráfica](#8-diseño-de-la-interfaz-gráfica)
9. [Diseño y Estructura de la Base de Datos](#9-diseño-y-estructura-de-la-base-de-datos)
10. [Creación y Descripción de la Base de Datos](#10-creación-y-descripción-de-la-base-de-datos)
11. [Mecanismos de Almacenamiento y Recuperación de Datos](#11-mecanismos-de-almacenamiento-y-recuperación-de-datos)
12. [Conexión entre Interfaz Gráfica y Base de Datos](#12-conexión-entre-interfaz-gráfica-y-base-de-datos)
13. [Evaluación de la Aplicación](#13-evaluación-de-la-aplicación)
14. [Manual de Usuario](#14-manual-de-usuario)
15. [Documentación Técnica](#15-documentación-técnica)
16. [Conclusiones](#16-conclusiones)
17. [Bibliografía](#17-bibliografía)
18. [Anexos](#18-anexos)

---

## 3. INTRODUCCIÓN

### 3.1 Contexto General del Proyecto

NovaLearn LMS es un Sistema de Gestión de Aprendizaje (Learning Management System) desarrollado como proyecto de internado universitario. La plataforma está diseñada para democratizar la educación a través de la tecnología, proporcionando una solución integral para instituciones educativas que buscan digitalizar sus procesos de enseñanza-aprendizaje.

El sistema permite a los instructores crear y gestionar cursos con contenido multimedia, evaluaciones automáticas y seguimiento detallado del progreso de los estudiantes. Por otro lado, los estudiantes pueden inscribirse en cursos, consumir contenido educativo, realizar evaluaciones y monitorear su avance.

### 3.2 Descripción de la Empresa/Institución

NovaLearn Labs es una iniciativa educativa enfocada en el desarrollo de soluciones tecnológicas para el sector educativo. Su misión es hacer accesible la educación de calidad mediante plataformas digitales innovadoras.

### 3.3 Alcance del Proyecto

El proyecto abarca:
- Gestión completa de usuarios (estudiantes e instructores)
- Creación y administración de cursos con módulos y lecciones
- Sistema de evaluación con quizzes automáticos
- Gestión de tareas con entregas y calificaciones
- Seguimiento de progreso de estudiantes
- Sistema de reseñas y calificaciones de cursos
- Autenticación segura mediante Keycloak

### 3.4 Tecnologías Utilizadas

| Componente | Tecnología |
|------------|------------|
| **Frontend** | React 18, TypeScript, Vite, Tailwind CSS |
| **Backend** | Node.js, Express.js, TypeScript |
| **Base de Datos** | PostgreSQL (Neon Database) |
| **ORM** | Drizzle ORM |
| **Autenticación** | Keycloak (OpenID Connect) |
| **UI Components** | shadcn/ui, Radix UI |
| **State Management** | TanStack Query (React Query) |
| **Routing** | Wouter |
| **Validación** | Zod |

---

## 4. JUSTIFICACIÓN

### 4.1 Motivo Principal del Desarrollo

La educación tradicional enfrenta desafíos significativos en términos de accesibilidad, escalabilidad y personalización. La pandemia global aceleró la necesidad de contar con plataformas de aprendizaje en línea robustas y efectivas. NovaLearn LMS surge como respuesta a esta necesidad, proporcionando:

1. **Accesibilidad**: Permite el aprendizaje desde cualquier lugar con conexión a internet
2. **Escalabilidad**: Soporta múltiples cursos y usuarios simultáneamente
3. **Automatización**: Reduce la carga administrativa de los instructores
4. **Seguimiento**: Proporciona métricas detalladas del progreso estudiantil

### 4.2 Beneficios Esperados

**Para Instituciones Educativas:**
- Reducción de costos operativos
- Mayor alcance geográfico
- Métricas de rendimiento en tiempo real
- Estandarización del contenido educativo

**Para Instructores:**
- Herramientas intuitivas de creación de contenido
- Evaluación automática de quizzes
- Panel de control con estadísticas
- Gestión eficiente de tareas y calificaciones

**Para Estudiantes:**
- Acceso 24/7 al contenido educativo
- Retroalimentación inmediata en evaluaciones
- Seguimiento visual del progreso
- Experiencia de aprendizaje personalizada

### 4.3 Valor Agregado

- **Autenticación empresarial**: Integración con Keycloak para autenticación SSO
- **Arquitectura moderna**: Stack tecnológico actual y mantenible
- **Diseño responsive**: Accesible desde cualquier dispositivo
- **Evaluaciones inteligentes**: Sistema de quizzes con calificación automática

---

## 5. DESCRIPCIÓN Y OBJETIVOS DEL PROYECTO

### 5.1 Descripción General del Sistema

NovaLearn LMS es una plataforma web full-stack que facilita la gestión del aprendizaje en línea. El sistema se compone de dos interfaces principales:

**Interfaz de Instructor:**
- Creación y edición de cursos
- Gestión de módulos y lecciones
- Creación de quizzes y tareas
- Visualización de estadísticas
- Calificación de entregas

**Interfaz de Estudiante:**
- Exploración del catálogo de cursos
- Inscripción en cursos
- Visualización de contenido (videos, documentos)
- Realización de quizzes
- Envío de tareas
- Seguimiento de progreso
- Reseñas y calificaciones

### 5.2 Objetivos

#### Objetivo General
Desarrollar una plataforma de gestión de aprendizaje completa y funcional que permita a instituciones educativas digitalizar sus procesos de enseñanza, proporcionando herramientas intuitivas tanto para instructores como para estudiantes.

#### Objetivos Específicos

1. **Implementar un sistema de autenticación seguro** utilizando Keycloak con OpenID Connect para garantizar la protección de datos de usuarios.

2. **Desarrollar un módulo de gestión de cursos** que permita a los instructores crear, editar y publicar cursos con estructura modular.

3. **Crear un sistema de evaluación automática** mediante quizzes con diferentes tipos de preguntas y calificación instantánea.

4. **Implementar un sistema de tareas** que permita a estudiantes enviar trabajos y a instructores evaluarlos con retroalimentación.

5. **Desarrollar un sistema de seguimiento de progreso** que muestre a estudiantes su avance y a instructores métricas de sus cursos.

6. **Implementar un sistema de reseñas** que permita a estudiantes calificar y comentar sobre los cursos completados.

7. **Garantizar la escalabilidad** mediante una arquitectura que soporte múltiples usuarios concurrentes.

---

## 6. PROBLEMÁTICA O SITUACIÓN A ABORDAR

### 6.1 Explicación de la Necesidad

Las instituciones educativas enfrentan múltiples desafíos en la era digital:

**Problemas Identificados:**

1. **Fragmentación de herramientas**: Uso de múltiples plataformas desconectadas para diferentes funciones educativas.

2. **Falta de seguimiento**: Dificultad para monitorear el progreso individual de estudiantes.

3. **Evaluación manual**: Proceso tedioso y propenso a errores de calificación de exámenes.

4. **Accesibilidad limitada**: Material educativo disponible solo en formato presencial o físico.

5. **Comunicación ineficiente**: Dificultad para proporcionar retroalimentación oportuna.

### 6.2 Impacto del Problema

| Área Afectada | Impacto |
|---------------|---------|
| **Estudiantes** | Desmotivación por falta de retroalimentación, dificultad para acceder al material |
| **Instructores** | Sobrecarga administrativa, tiempo excesivo en calificaciones manuales |
| **Institución** | Costos elevados, baja eficiencia operativa, dificultad para escalar |

### 6.3 Relevancia de la Solución

NovaLearn LMS aborda directamente estos problemas mediante:

- **Plataforma unificada**: Todas las funciones educativas en un solo lugar
- **Automatización**: Calificación automática de quizzes
- **Métricas en tiempo real**: Dashboard con estadísticas actualizadas
- **Acceso universal**: Disponible 24/7 desde cualquier dispositivo
- **Retroalimentación inmediata**: Resultados instantáneos en evaluaciones

---

## 7. ELEMENTOS PRINCIPALES DEL SISTEMA

### 7.1 Módulos Funcionales

```
┌─────────────────────────────────────────────────────────────┐
│                    NOVALEARN LMS                            │
├─────────────────────────────────────────────────────────────┤
│                                                             │
│  ┌─────────────┐  ┌─────────────┐  ┌─────────────────────┐  │
│  │   MÓDULO    │  │   MÓDULO    │  │      MÓDULO         │  │
│  │   USUARIOS  │  │   CURSOS    │  │   EVALUACIONES      │  │
│  │             │  │             │  │                     │  │
│  │ • Auth      │  │ • Cursos    │  │ • Quizzes           │  │
│  │ • Roles     │  │ • Módulos   │  │ • Preguntas         │  │
│  │ • Perfiles  │  │ • Lecciones │  │ • Intentos          │  │
│  └─────────────┘  └─────────────┘  └─────────────────────┘  │
│                                                             │
│  ┌─────────────┐  ┌─────────────┐  ┌─────────────────────┐  │
│  │   MÓDULO    │  │   MÓDULO    │  │      MÓDULO         │  │
│  │   TAREAS    │  │  PROGRESO   │  │     RESEÑAS         │  │
│  │             │  │             │  │                     │  │
│  │ • Asignar   │  │ • Lecciones │  │ • Calificación      │  │
│  │ • Entregas  │  │ • Cursos    │  │ • Comentarios       │  │
│  │ • Califcar  │  │ • Dashboard │  │ • Estadísticas      │  │
│  └─────────────┘  └─────────────┘  └─────────────────────┘  │
│                                                             │
└─────────────────────────────────────────────────────────────┘
```

### 7.2 Descripción de Módulos

#### Módulo de Usuarios
- **Autenticación**: Login/logout mediante Keycloak
- **Roles**: Diferenciación entre estudiantes e instructores
- **Perfiles**: Gestión de información personal

#### Módulo de Cursos
- **Cursos**: Creación, edición, publicación
- **Módulos**: Organización jerárquica del contenido
- **Lecciones**: Contenido individual con videos

#### Módulo de Evaluaciones
- **Quizzes**: Evaluaciones con tiempo límite
- **Preguntas**: Múltiple opción y verdadero/falso
- **Intentos**: Registro de respuestas y calificaciones

#### Módulo de Tareas
- **Asignaciones**: Creación de tareas con fecha límite
- **Entregas**: Envío de texto y archivos
- **Calificación**: Notas y retroalimentación

#### Módulo de Progreso
- **Tracking**: Seguimiento de lecciones completadas
- **Estadísticas**: Porcentaje de avance
- **Dashboard**: Visualización de métricas

#### Módulo de Reseñas
- **Ratings**: Calificación de 1-5 estrellas
- **Comentarios**: Feedback textual
- **Promedios**: Cálculo de rating promedio

### 7.3 Procesos Básicos (CRUD)

| Entidad | Crear | Leer | Actualizar | Eliminar |
|---------|-------|------|------------|----------|
| Usuarios | ✓ | ✓ | ✓ | - |
| Cursos | ✓ | ✓ | ✓ | ✓ |
| Módulos | ✓ | ✓ | ✓ | ✓ |
| Lecciones | ✓ | ✓ | ✓ | ✓ |
| Quizzes | ✓ | ✓ | - | - |
| Preguntas | ✓ | ✓ | - | - |
| Tareas | ✓ | ✓ | - | - |
| Entregas | ✓ | ✓ | ✓ | - |
| Reseñas | ✓ | ✓ | - | - |
| Inscripciones | ✓ | ✓ | ✓ | - |

### 7.4 Diagrama de Flujo de Datos

```
                    ┌─────────────────┐
                    │    USUARIO      │
                    └────────┬────────┘
                             │
              ┌──────────────┼──────────────┐
              ▼              ▼              ▼
        ┌──────────┐   ┌──────────┐   ┌──────────┐
        │ KEYCLOAK │   │ FRONTEND │   │   API    │
        │   AUTH   │   │  REACT   │   │ EXPRESS  │
        └────┬─────┘   └────┬─────┘   └────┬─────┘
             │              │              │
             │              │              │
             ▼              ▼              ▼
        ┌─────────────────────────────────────────┐
        │              BASE DE DATOS              │
        │             (PostgreSQL)                │
        │                                         │
        │  ┌─────┐ ┌───────┐ ┌────────┐ ┌──────┐ │
        │  │Users│ │Courses│ │Lessons │ │Quizes│ │
        │  └─────┘ └───────┘ └────────┘ └──────┘ │
        │  ┌───────┐ ┌──────────┐ ┌───────────┐  │
        │  │Modules│ │Enrollmts │ │Assignments│  │
        │  └───────┘ └──────────┘ └───────────┘  │
        └─────────────────────────────────────────┘
```

---

## 8. DISEÑO DE LA INTERFAZ GRÁFICA

### 8.1 Descripción de Formularios/Pantallas

#### 8.1.1 Página de Inicio (Landing Page)

**Propósito**: Primera impresión del sistema, captura de usuarios

**Secciones**:
- Header con logo y botón de login
- Hero section con mensaje principal
- Estadísticas (500+ cursos, 10K+ estudiantes, 95% satisfacción)
- Features (características principales)
- Call-to-action para registro
- Footer con información de contacto

**Controles**:
- `Button` - Iniciar Sesión
- `Button` - Comenzar Ahora
- `Button` - Explorar Cursos
- `Card` - Tarjetas de características

#### 8.1.2 Dashboard del Estudiante

**Propósito**: Vista principal del estudiante con resumen de actividad

**Secciones**:
- Saludo personalizado
- Tarjetas de estadísticas (cursos activos, completados, horas, progreso)
- Cursos en progreso con barra de avance
- Cursos no iniciados
- Estado vacío si no hay inscripciones

**Controles**:
- `Card` - Estadísticas
- `Progress` - Barra de progreso
- `Button` - Continuar/Comenzar curso
- `Sidebar` - Navegación lateral

#### 8.1.3 Dashboard del Instructor

**Propósito**: Panel de control para gestión de cursos

**Secciones**:
- Estadísticas globales (estudiantes, rating, reseñas)
- Lista de cursos del instructor
- Acciones rápidas (crear curso, ver entregas)

**Controles**:
- `Card` - Estadísticas
- `Button` - Crear nuevo curso
- `Table` - Lista de cursos
- `Badge` - Estado del curso

#### 8.1.4 Catálogo de Cursos

**Propósito**: Exploración de cursos disponibles

**Secciones**:
- Filtros por categoría y nivel
- Grid de cursos con información básica
- Indicador de inscripción

**Controles**:
- `Select` - Filtro de categoría
- `Select` - Filtro de nivel
- `Card` - Tarjeta de curso
- `Button` - Inscribirse
- `Badge` - Nivel del curso

#### 8.1.5 Vista de Curso

**Propósito**: Acceso al contenido del curso

**Secciones**:
- Información del curso (título, descripción, instructor)
- Lista de módulos colapsables
- Lista de lecciones por módulo
- Indicadores de progreso
- Sección de reseñas

**Controles**:
- `Accordion` - Módulos colapsables
- `Checkbox` - Marcar lección completada
- `Button` - Ver lección
- `Progress` - Progreso del módulo
- `Textarea` - Escribir reseña
- `Rating` - Calificación con estrellas

#### 8.1.6 Vista de Lección

**Propósito**: Consumo de contenido educativo

**Secciones**:
- Reproductor de video
- Descripción de la lección
- Quizzes disponibles
- Tareas asignadas

**Controles**:
- `Video` - Reproductor HTML5
- `Button` - Marcar como completada
- `Accordion` - Quiz
- `Form` - Entrega de tarea

#### 8.1.7 Formulario de Quiz

**Propósito**: Evaluación del aprendizaje

**Secciones**:
- Pregunta actual
- Opciones de respuesta
- Navegación entre preguntas
- Resultado final

**Controles**:
- `RadioGroup` - Opciones de respuesta
- `Button` - Siguiente/Anterior
- `Button` - Enviar respuestas
- `Progress` - Progreso del quiz
- `Alert` - Resultado (aprobado/reprobado)

#### 8.1.8 Formulario de Creación de Curso

**Propósito**: Creación de nuevo curso por instructor

**Campos**:
- Título (requerido)
- Descripción
- Categoría (select)
- Nivel (select)
- Imagen de portada (file upload)

**Controles**:
- `Input` - Título
- `Textarea` - Descripción
- `Select` - Categoría
- `Select` - Nivel
- `FileUpload` - Imagen
- `Button` - Crear curso

### 8.2 Lista de Controles Utilizados

| Componente | Descripción | Uso Principal |
|------------|-------------|---------------|
| `Button` | Botón interactivo | Acciones, navegación |
| `Input` | Campo de texto | Formularios |
| `Textarea` | Campo de texto multilínea | Descripciones |
| `Select` | Lista desplegable | Selección de opciones |
| `Checkbox` | Casilla de verificación | Marcar completado |
| `RadioGroup` | Grupo de opciones | Respuestas de quiz |
| `Card` | Contenedor elevado | Información agrupada |
| `Progress` | Barra de progreso | Avance visual |
| `Accordion` | Contenido colapsable | Módulos/lecciones |
| `Dialog` | Modal | Confirmaciones |
| `Toast` | Notificación | Mensajes al usuario |
| `Avatar` | Imagen de perfil | Usuarios |
| `Badge` | Etiqueta | Estados, niveles |
| `Sidebar` | Navegación lateral | Menú principal |
| `Table` | Tabla de datos | Listados |
| `Form` | Formulario | Entrada de datos |
| `Tabs` | Pestañas | Organización |
| `Tooltip` | Información hover | Ayuda contextual |

### 8.3 Estructura de Navegación

```
┌────────────────────────────────────────────────────────────────┐
│                         NOVALEARN LMS                          │
├────────────┬───────────────────────────────────────────────────┤
│            │                                                   │
│  SIDEBAR   │              CONTENIDO PRINCIPAL                  │
│            │                                                   │
│  • Home    │   ┌─────────────────────────────────────────────┐ │
│  • Cursos  │   │                                             │ │
│  • Mis     │   │     Dashboard / Catálogo / Curso            │ │
│    Cursos  │   │                                             │ │
│  • Perfil  │   │                                             │ │
│  • Config  │   │                                             │ │
│            │   │                                             │ │
│  ────────  │   │                                             │ │
│  • Logout  │   │                                             │ │
│            │   └─────────────────────────────────────────────┘ │
└────────────┴───────────────────────────────────────────────────┘
```

---

## 9. DISEÑO Y ESTRUCTURA DE LA BASE DE DATOS

### 9.1 Nombre de la Base de Datos

**Nombre:** `novalearn`
**Gestor:** PostgreSQL 15 (Neon Database en producción)

### 9.2 Tablas Principales

#### 9.2.1 Tabla: `users`

| Campo | Tipo | Restricciones | Descripción |
|-------|------|---------------|-------------|
| id | VARCHAR | PK, DEFAULT UUID | Identificador único |
| email | VARCHAR | UNIQUE | Correo electrónico |
| first_name | VARCHAR | - | Nombre |
| last_name | VARCHAR | - | Apellido |
| profile_image_url | VARCHAR | - | URL de imagen |
| role | VARCHAR | DEFAULT 'student' | Rol (student/instructor) |
| created_at | TIMESTAMP | DEFAULT NOW() | Fecha de creación |
| updated_at | TIMESTAMP | DEFAULT NOW() | Fecha de actualización |

#### 9.2.2 Tabla: `courses`

| Campo | Tipo | Restricciones | Descripción |
|-------|------|---------------|-------------|
| id | VARCHAR | PK, DEFAULT UUID | Identificador único |
| title | VARCHAR(255) | NOT NULL | Título del curso |
| description | TEXT | - | Descripción |
| instructor_id | VARCHAR | FK → users.id | ID del instructor |
| thumbnail_url | VARCHAR | - | URL de miniatura |
| status | VARCHAR | DEFAULT 'draft' | Estado (draft/published/archived) |
| category | VARCHAR | - | Categoría |
| level | VARCHAR | - | Nivel (beginner/intermediate/advanced) |
| created_at | TIMESTAMP | DEFAULT NOW() | Fecha de creación |
| updated_at | TIMESTAMP | DEFAULT NOW() | Fecha de actualización |

#### 9.2.3 Tabla: `modules`

| Campo | Tipo | Restricciones | Descripción |
|-------|------|---------------|-------------|
| id | VARCHAR | PK, DEFAULT UUID | Identificador único |
| course_id | VARCHAR | FK → courses.id | ID del curso |
| title | VARCHAR(255) | NOT NULL | Título del módulo |
| description | TEXT | - | Descripción |
| order | INTEGER | DEFAULT 0 | Orden de aparición |
| created_at | TIMESTAMP | DEFAULT NOW() | Fecha de creación |

#### 9.2.4 Tabla: `lessons`

| Campo | Tipo | Restricciones | Descripción |
|-------|------|---------------|-------------|
| id | VARCHAR | PK, DEFAULT UUID | Identificador único |
| module_id | VARCHAR | FK → modules.id | ID del módulo |
| title | VARCHAR(255) | NOT NULL | Título de la lección |
| description | TEXT | - | Descripción |
| video_url | VARCHAR | - | URL del video |
| duration | INTEGER | - | Duración en segundos |
| order | INTEGER | DEFAULT 0 | Orden de aparición |
| created_at | TIMESTAMP | DEFAULT NOW() | Fecha de creación |

#### 9.2.5 Tabla: `enrollments`

| Campo | Tipo | Restricciones | Descripción |
|-------|------|---------------|-------------|
| id | VARCHAR | PK, DEFAULT UUID | Identificador único |
| user_id | VARCHAR | FK → users.id | ID del estudiante |
| course_id | VARCHAR | FK → courses.id | ID del curso |
| enrolled_at | TIMESTAMP | DEFAULT NOW() | Fecha de inscripción |
| completed_at | TIMESTAMP | - | Fecha de completado |
| progress_percentage | INTEGER | DEFAULT 0 | Porcentaje de progreso |

#### 9.2.6 Tabla: `lesson_progress`

| Campo | Tipo | Restricciones | Descripción |
|-------|------|---------------|-------------|
| id | VARCHAR | PK, DEFAULT UUID | Identificador único |
| user_id | VARCHAR | FK → users.id | ID del usuario |
| lesson_id | VARCHAR | FK → lessons.id | ID de la lección |
| completed | BOOLEAN | DEFAULT FALSE | Estado de completado |
| completed_at | TIMESTAMP | - | Fecha de completado |

#### 9.2.7 Tabla: `quizzes`

| Campo | Tipo | Restricciones | Descripción |
|-------|------|---------------|-------------|
| id | VARCHAR | PK, DEFAULT UUID | Identificador único |
| lesson_id | VARCHAR | FK → lessons.id | ID de la lección |
| title | VARCHAR(255) | NOT NULL | Título del quiz |
| pass_percentage | INTEGER | DEFAULT 70 | Porcentaje para aprobar |
| created_at | TIMESTAMP | DEFAULT NOW() | Fecha de creación |

#### 9.2.8 Tabla: `quiz_questions`

| Campo | Tipo | Restricciones | Descripción |
|-------|------|---------------|-------------|
| id | VARCHAR | PK, DEFAULT UUID | Identificador único |
| quiz_id | VARCHAR | FK → quizzes.id | ID del quiz |
| question | TEXT | NOT NULL | Texto de la pregunta |
| type | VARCHAR | NOT NULL | Tipo (multiple_choice/true_false) |
| correct_answer | VARCHAR | NOT NULL | Respuesta correcta |
| options | JSONB | - | Opciones de respuesta |
| order | INTEGER | DEFAULT 0 | Orden de aparición |

#### 9.2.9 Tabla: `quiz_attempts`

| Campo | Tipo | Restricciones | Descripción |
|-------|------|---------------|-------------|
| id | VARCHAR | PK, DEFAULT UUID | Identificador único |
| user_id | VARCHAR | FK → users.id | ID del usuario |
| quiz_id | VARCHAR | FK → quizzes.id | ID del quiz |
| answers | JSONB | NOT NULL | Respuestas dadas |
| score | INTEGER | NOT NULL | Puntuación obtenida |
| passed | BOOLEAN | NOT NULL | Si aprobó o no |
| completed_at | TIMESTAMP | DEFAULT NOW() | Fecha de completado |

#### 9.2.10 Tabla: `assignments`

| Campo | Tipo | Restricciones | Descripción |
|-------|------|---------------|-------------|
| id | VARCHAR | PK, DEFAULT UUID | Identificador único |
| lesson_id | VARCHAR | FK → lessons.id | ID de la lección |
| title | VARCHAR(255) | NOT NULL | Título de la tarea |
| description | TEXT | NOT NULL | Descripción/instrucciones |
| due_date | TIMESTAMP | - | Fecha límite |
| created_at | TIMESTAMP | DEFAULT NOW() | Fecha de creación |

#### 9.2.11 Tabla: `assignment_submissions`

| Campo | Tipo | Restricciones | Descripción |
|-------|------|---------------|-------------|
| id | VARCHAR | PK, DEFAULT UUID | Identificador único |
| user_id | VARCHAR | FK → users.id | ID del estudiante |
| assignment_id | VARCHAR | FK → assignments.id | ID de la tarea |
| content | TEXT | - | Contenido de texto |
| file_url | VARCHAR | - | URL del archivo |
| submitted_at | TIMESTAMP | DEFAULT NOW() | Fecha de envío |
| grade | INTEGER | - | Calificación (0-100) |
| feedback | TEXT | - | Retroalimentación |
| graded_at | TIMESTAMP | - | Fecha de calificación |

#### 9.2.12 Tabla: `reviews`

| Campo | Tipo | Restricciones | Descripción |
|-------|------|---------------|-------------|
| id | VARCHAR | PK, DEFAULT UUID | Identificador único |
| user_id | VARCHAR | FK → users.id | ID del usuario |
| course_id | VARCHAR | FK → courses.id | ID del curso |
| rating | INTEGER | NOT NULL | Calificación (1-5) |
| comment | TEXT | - | Comentario |
| created_at | TIMESTAMP | DEFAULT NOW() | Fecha de creación |

#### 9.2.13 Tabla: `sessions`

| Campo | Tipo | Restricciones | Descripción |
|-------|------|---------------|-------------|
| sid | VARCHAR | PK | ID de sesión |
| sess | JSONB | NOT NULL | Datos de sesión |
| expire | TIMESTAMP | NOT NULL | Fecha de expiración |

### 9.3 Diccionario de Datos

Ver sección 9.2 para el diccionario completo de cada tabla.

### 9.4 Diagrama Entidad-Relación (DER)

```
┌──────────────┐      ┌──────────────┐      ┌──────────────┐
│    USERS     │      │   COURSES    │      │   MODULES    │
├──────────────┤      ├──────────────┤      ├──────────────┤
│ id (PK)      │──┐   │ id (PK)      │──┐   │ id (PK)      │
│ email        │  │   │ title        │  │   │ course_id(FK)│──┐
│ first_name   │  │   │ description  │  │   │ title        │  │
│ last_name    │  ├──▶│ instructor_id│  │   │ order        │  │
│ role         │  │   │ status       │  │   └──────────────┘  │
└──────────────┘  │   │ category     │  │          ▲          │
       │          │   │ level        │  │          │          │
       │          │   └──────────────┘  │          │          │
       │          │          │          │          │          │
       ▼          │          ▼          │          ▼          │
┌──────────────┐  │   ┌──────────────┐  │   ┌──────────────┐  │
│ ENROLLMENTS  │  │   │   REVIEWS    │  │   │   LESSONS    │  │
├──────────────┤  │   ├──────────────┤  │   ├──────────────┤  │
│ id (PK)      │  │   │ id (PK)      │  │   │ id (PK)      │  │
│ user_id (FK) │◀─┘   │ user_id (FK) │  │   │ module_id(FK)│◀─┘
│ course_id(FK)│◀─────│ course_id(FK)│◀─┘   │ title        │
│ progress_%   │      │ rating       │      │ video_url    │
└──────────────┘      │ comment      │      │ duration     │
                      └──────────────┘      └──────────────┘
                                                   │
                    ┌──────────────────────────────┼──────────────┐
                    │                              │              │
                    ▼                              ▼              ▼
┌──────────────────────┐        ┌──────────────┐        ┌──────────────┐
│   LESSON_PROGRESS    │        │   QUIZZES    │        │ ASSIGNMENTS  │
├──────────────────────┤        ├──────────────┤        ├──────────────┤
│ id (PK)              │        │ id (PK)      │        │ id (PK)      │
│ user_id (FK)         │        │ lesson_id(FK)│        │ lesson_id(FK)│
│ lesson_id (FK)       │        │ title        │        │ title        │
│ completed            │        │ pass_%       │        │ due_date     │
└──────────────────────┘        └──────────────┘        └──────────────┘
                                       │                       │
                                       ▼                       ▼
                          ┌──────────────────┐    ┌─────────────────────┐
                          │ QUIZ_QUESTIONS   │    │ ASSIGNMENT_SUBMISSIONS│
                          ├──────────────────┤    ├─────────────────────┤
                          │ id (PK)          │    │ id (PK)             │
                          │ quiz_id (FK)     │    │ user_id (FK)        │
                          │ question         │    │ assignment_id (FK)  │
                          │ type             │    │ content             │
                          │ correct_answer   │    │ file_url            │
                          │ options          │    │ grade               │
                          └──────────────────┘    │ feedback            │
                                   │              └─────────────────────┘
                                   ▼
                          ┌──────────────────┐
                          │  QUIZ_ATTEMPTS   │
                          ├──────────────────┤
                          │ id (PK)          │
                          │ user_id (FK)     │
                          │ quiz_id (FK)     │
                          │ answers          │
                          │ score            │
                          │ passed           │
                          └──────────────────┘
```

---

## 10. CREACIÓN Y DESCRIPCIÓN DE LA BASE DE DATOS

### 10.1 Gestor Utilizado

**Sistema Gestor:** PostgreSQL 15
**Proveedor Cloud:** Neon Database (Serverless)
**ORM:** Drizzle ORM

### 10.2 Procedimiento de Creación

La base de datos se gestiona mediante Drizzle ORM, que proporciona migraciones automáticas basadas en el schema TypeScript.

#### Archivo de Schema (shared/schema.ts)

```typescript
import { sql } from 'drizzle-orm';
import { relations } from 'drizzle-orm';
import {
  index,
  integer,
  jsonb,
  pgTable,
  text,
  timestamp,
  varchar,
  boolean,
  decimal,
} from "drizzle-orm/pg-core";
import { createInsertSchema } from "drizzle-zod";
import { z } from "zod";

// Tabla de usuarios
export const users = pgTable("users", {
  id: varchar("id").primaryKey().default(sql`gen_random_uuid()`),
  email: varchar("email").unique(),
  firstName: varchar("first_name"),
  lastName: varchar("last_name"),
  profileImageUrl: varchar("profile_image_url"),
  role: varchar("role").notNull().default("student"),
  createdAt: timestamp("created_at").defaultNow(),
  updatedAt: timestamp("updated_at").defaultNow(),
});

// Tabla de cursos
export const courses = pgTable("courses", {
  id: varchar("id").primaryKey().default(sql`gen_random_uuid()`),
  title: varchar("title", { length: 255 }).notNull(),
  description: text("description"),
  instructorId: varchar("instructor_id").notNull()
    .references(() => users.id, { onDelete: "cascade" }),
  thumbnailUrl: varchar("thumbnail_url"),
  status: varchar("status").notNull().default("draft"),
  category: varchar("category"),
  level: varchar("level"),
  createdAt: timestamp("created_at").defaultNow(),
  updatedAt: timestamp("updated_at").defaultNow(),
});

// Tabla de módulos
export const modules = pgTable("modules", {
  id: varchar("id").primaryKey().default(sql`gen_random_uuid()`),
  courseId: varchar("course_id").notNull()
    .references(() => courses.id, { onDelete: "cascade" }),
  title: varchar("title", { length: 255 }).notNull(),
  description: text("description"),
  order: integer("order").notNull().default(0),
  createdAt: timestamp("created_at").defaultNow(),
});

// [Continúa con las demás tablas...]
```

### 10.3 Comandos de Migración

```bash
# Generar migraciones
npm run db:generate

# Aplicar migraciones a la base de datos
npm run db:push

# Forzar sincronización (solo desarrollo)
npm run db:push --force
```

### 10.4 Configuración de Conexión

```typescript
// server/db.ts
import { Pool as PgPool } from 'pg';
import { Pool as NeonPool, neonConfig } from '@neondatabase/serverless';
import { drizzle as drizzleNeon } from 'drizzle-orm/neon-serverless';
import { drizzle as drizzlePg } from 'drizzle-orm/node-postgres';
import ws from 'ws';
import * as schema from "@shared/schema";

// Detección de entorno
const isReplit = !!process.env.REPL_ID;

let pool: any;
let db: any;

if (isReplit) {
  // Replit: Neon con WebSocket
  neonConfig.webSocketConstructor = ws;
  pool = new NeonPool({ connectionString: process.env.DATABASE_URL });
  db = drizzleNeon({ client: pool, schema });
} else {
  // Docker: PostgreSQL estándar
  pool = new PgPool({ connectionString: process.env.DATABASE_URL });
  db = drizzlePg({ client: pool, schema });
}

export { pool, db };
```

---

## 11. MECANISMOS DE ALMACENAMIENTO Y RECUPERACIÓN DE DATOS

### 11.1 Descripción del Funcionamiento CRUD

El sistema utiliza el patrón Repository/Storage para abstraer las operaciones de base de datos. La clase `DatabaseStorage` implementa la interfaz `IStorage` con todos los métodos CRUD.

### 11.2 Ejemplos Prácticos

#### Ejemplo 1: Crear un Curso (CREATE)

```typescript
// storage.ts - Método de creación
async createCourse(courseData: InsertCourse): Promise<Course> {
  const [course] = await db.insert(courses).values(courseData).returning();
  return course;
}

// routes.ts - Endpoint
app.post("/api/courses", isAuthenticated, isInstructor, async (req, res) => {
  const userId = await getDatabaseUserId(req);
  const courseData = insertCourseSchema.parse({ 
    ...req.body, 
    instructorId: userId 
  });
  const course = await storage.createCourse(courseData);
  res.status(201).json(course);
});
```

#### Ejemplo 2: Obtener Cursos (READ)

```typescript
// storage.ts - Método de lectura
async getCourses(): Promise<Course[]> {
  return await db.select()
    .from(courses)
    .orderBy(desc(courses.createdAt));
}

async getCoursesByInstructor(instructorId: string): Promise<Course[]> {
  return await db.select()
    .from(courses)
    .where(eq(courses.instructorId, instructorId))
    .orderBy(desc(courses.createdAt));
}

// routes.ts - Endpoint
app.get("/api/courses", async (req, res) => {
  const allCourses = await storage.getCourses();
  const publishedCourses = allCourses.filter(c => c.status === "published");
  res.json(publishedCourses);
});
```

#### Ejemplo 3: Actualizar Curso (UPDATE)

```typescript
// storage.ts - Método de actualización
async updateCourse(id: string, courseData: Partial<InsertCourse>): Promise<Course | undefined> {
  const [course] = await db
    .update(courses)
    .set({ ...courseData, updatedAt: new Date() })
    .where(eq(courses.id, id))
    .returning();
  return course || undefined;
}

// routes.ts - Endpoint
app.put("/api/courses/:id", isAuthenticated, isInstructor, async (req, res) => {
  const userId = await getDatabaseUserId(req);
  const course = await storage.getCourse(req.params.id);
  
  if (course.instructorId !== userId) {
    return res.status(403).json({ message: "Forbidden" });
  }

  const updated = await storage.updateCourse(req.params.id, req.body);
  res.json(updated);
});
```

#### Ejemplo 4: Eliminar Curso (DELETE)

```typescript
// storage.ts - Método de eliminación
async deleteCourse(id: string): Promise<void> {
  await db.delete(courses).where(eq(courses.id, id));
}
```

### 11.3 Operaciones Complejas

#### Inscripción con Cálculo de Progreso

```typescript
async upsertLessonProgress(progressData: InsertLessonProgress): Promise<LessonProgress> {
  const existing = await this.getLessonProgress(
    progressData.userId, 
    progressData.lessonId
  );
  
  if (existing) {
    const [updated] = await db
      .update(lessonProgress)
      .set({ 
        ...progressData, 
        completedAt: progressData.completed ? new Date() : null 
      })
      .where(eq(lessonProgress.id, existing.id))
      .returning();
    return updated;
  } else {
    const [created] = await db
      .insert(lessonProgress)
      .values({ 
        ...progressData, 
        completedAt: progressData.completed ? new Date() : null 
      })
      .returning();
    return created;
  }
}
```

---

## 12. CONEXIÓN ENTRE INTERFAZ GRÁFICA Y BASE DE DATOS

### 12.1 Descripción del Proceso de Conexión

La arquitectura sigue un patrón cliente-servidor con comunicación vía API REST:

```
┌─────────────┐    HTTP/JSON    ┌─────────────┐    SQL    ┌─────────────┐
│   REACT     │ ◀──────────────▶│   EXPRESS   │ ◀───────▶ │  POSTGRES   │
│  Frontend   │    TanStack     │   Backend   │  Drizzle  │   Database  │
│             │    Query        │             │    ORM    │             │
└─────────────┘                 └─────────────┘           └─────────────┘
```

### 12.2 Código de Conexión

#### Cliente (Frontend)

```typescript
// lib/queryClient.ts
import { QueryClient, QueryFunction } from "@tanstack/react-query";

async function throwIfResNotOk(res: Response) {
  if (!res.ok) {
    const text = (await res.text()) || res.statusText;
    throw new Error(`${res.status}: ${text}`);
  }
}

export async function apiRequest(
  method: string,
  url: string,
  data?: unknown | undefined,
): Promise<Response> {
  const res = await fetch(url, {
    method,
    headers: data ? { "Content-Type": "application/json" } : {},
    body: data ? JSON.stringify(data) : undefined,
    credentials: "include",
  });

  await throwIfResNotOk(res);
  return res;
}

const defaultQueryFn: QueryFunction = async ({ queryKey }) => {
  const res = await fetch(queryKey[0] as string, {
    credentials: "include",
  });

  await throwIfResNotOk(res);
  return await res.json();
};

export const queryClient = new QueryClient({
  defaultOptions: {
    queries: {
      queryFn: defaultQueryFn,
      refetchInterval: false,
      refetchOnWindowFocus: false,
      staleTime: Infinity,
      retry: false,
    },
    mutations: {
      retry: false,
    },
  },
});
```

#### Servidor (Backend)

```typescript
// server/db.ts
import { Pool as NeonPool, neonConfig } from '@neondatabase/serverless';
import { drizzle as drizzleNeon } from 'drizzle-orm/neon-serverless';
import ws from 'ws';
import * as schema from "@shared/schema";

// Configuración WebSocket para Neon
neonConfig.webSocketConstructor = ws;

// Pool de conexiones
const pool = new NeonPool({ 
  connectionString: process.env.DATABASE_URL 
});

// Cliente Drizzle ORM
const db = drizzleNeon({ client: pool, schema });

export { pool, db };
```

### 12.3 Ejemplo Completo de Operación CRUD

#### Frontend: Crear Curso

```tsx
// pages/create-course.tsx
import { useMutation } from "@tanstack/react-query";
import { apiRequest, queryClient } from "@/lib/queryClient";
import { useToast } from "@/hooks/use-toast";

function CreateCourse() {
  const { toast } = useToast();
  
  const createCourseMutation = useMutation({
    mutationFn: async (data: InsertCourse) => {
      const res = await apiRequest("POST", "/api/courses", data);
      return res.json();
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["/api/instructor/courses"] });
      toast({ title: "Curso creado exitosamente" });
    },
    onError: (error) => {
      toast({ 
        title: "Error al crear curso", 
        description: error.message,
        variant: "destructive" 
      });
    },
  });

  const onSubmit = (data: FormData) => {
    createCourseMutation.mutate({
      title: data.title,
      description: data.description,
      category: data.category,
      level: data.level,
    });
  };

  return (
    <Form onSubmit={onSubmit}>
      {/* Campos del formulario */}
    </Form>
  );
}
```

#### Backend: Procesar Solicitud

```typescript
// server/routes.ts
app.post("/api/courses", isAuthenticated, isInstructor, async (req, res) => {
  try {
    // 1. Obtener usuario autenticado
    const userId = await getDatabaseUserId(req);
    if (!userId) {
      return res.status(401).json({ message: "Usuario no encontrado" });
    }

    // 2. Validar datos con Zod
    const courseData = insertCourseSchema.parse({ 
      ...req.body, 
      instructorId: userId 
    });

    // 3. Crear en base de datos
    const course = await storage.createCourse(courseData);

    // 4. Responder al cliente
    res.status(201).json(course);
  } catch (error) {
    console.error("Error creating course:", error);
    res.status(400).json({ message: error.message });
  }
});
```

---

## 13. EVALUACIÓN DE LA APLICACIÓN

### 13.1 Usabilidad

| Criterio | Evaluación | Descripción |
|----------|------------|-------------|
| **Navegación** | Excelente | Menú lateral intuitivo con iconos claros |
| **Formularios** | Excelente | Validación en tiempo real con mensajes claros |
| **Feedback** | Excelente | Toasts informativos para todas las acciones |
| **Responsive** | Muy Bueno | Adaptable a diferentes tamaños de pantalla |
| **Accesibilidad** | Muy Bueno | Componentes con ARIA labels |
| **Carga** | Excelente | Estados de loading y skeleton bien implementados |

### 13.2 Soportabilidad

| Aspecto | Implementación |
|---------|----------------|
| **Modularidad** | Código organizado en módulos reutilizables |
| **Tipado** | TypeScript end-to-end para detección temprana de errores |
| **Documentación** | Código comentado y README actualizado |
| **Pruebas** | Estructura preparada para testing |
| **Versionamiento** | Control de versiones con Git |
| **Dependencias** | Package.json con versiones fijas |

### 13.3 Funcionalidad

| Requerimiento | Estado | Notas |
|---------------|--------|-------|
| Autenticación SSO | Completo | Keycloak OpenID Connect |
| Gestión de cursos | Completo | CRUD completo |
| Gestión de módulos | Completo | Ordenamiento incluido |
| Gestión de lecciones | Completo | Soporte de video |
| Inscripciones | Completo | Con tracking de progreso |
| Quizzes automáticos | Completo | Calificación instantánea |
| Tareas con archivos | Completo | Upload y calificación |
| Reseñas | Completo | Rating 1-5 con comentarios |
| Dashboard estudiante | Completo | Estadísticas completas |
| Dashboard instructor | Completo | Métricas de cursos |

---

## 14. MANUAL DE USUARIO

### 14.1 Requerimientos del Sistema

**Hardware Mínimo:**
- Procesador: 1 GHz o superior
- RAM: 2 GB mínimo
- Almacenamiento: 100 MB para navegador

**Software:**
- Navegador web moderno (Chrome 90+, Firefox 88+, Safari 14+, Edge 90+)
- Conexión a internet estable

### 14.2 Acceso al Sistema

1. Abrir el navegador web
2. Navegar a la URL del sistema: `https://novalearn.replit.app`
3. Hacer clic en "Iniciar Sesión"
4. Ingresar credenciales de Keycloak

### 14.3 Guía para Estudiantes

#### 14.3.1 Dashboard Principal

Al iniciar sesión, verás tu dashboard con:
- **Estadísticas**: Cursos activos, completados, horas y progreso
- **Cursos en progreso**: Continúa donde lo dejaste
- **Cursos por comenzar**: Nuevos cursos inscritos

#### 14.3.2 Explorar Cursos

1. En el menú lateral, selecciona "Cursos"
2. Navega por el catálogo
3. Filtra por categoría o nivel
4. Haz clic en "Inscribirse" para unirte a un curso

#### 14.3.3 Tomar un Curso

1. Selecciona el curso de tu dashboard
2. Navega por los módulos en el acordeón
3. Haz clic en una lección para ver el contenido
4. Mira el video y marca como completada
5. Completa quizzes para evaluar tu aprendizaje

#### 14.3.4 Realizar un Quiz

1. Navega a la lección con el quiz
2. Haz clic en "Comenzar Quiz"
3. Responde cada pregunta
4. Haz clic en "Enviar"
5. Ve tu resultado inmediatamente

#### 14.3.5 Entregar Tareas

1. Navega a la lección con la tarea
2. Lee las instrucciones
3. Escribe tu respuesta o adjunta un archivo
4. Haz clic en "Enviar"
5. Espera la calificación del instructor

### 14.4 Guía para Instructores

#### 14.4.1 Crear un Curso

1. En el menú lateral, selecciona "Crear Curso"
2. Completa el formulario:
   - Título del curso
   - Descripción
   - Categoría
   - Nivel
3. Haz clic en "Crear Curso"

#### 14.4.2 Agregar Módulos

1. Accede al curso recién creado
2. Haz clic en "Agregar Módulo"
3. Ingresa título y descripción
4. Guarda los cambios

#### 14.4.3 Agregar Lecciones

1. Dentro de un módulo, haz clic en "Agregar Lección"
2. Completa:
   - Título
   - Descripción
   - URL del video
   - Duración
3. Guarda la lección

#### 14.4.4 Crear Quizzes

1. En una lección, selecciona "Crear Quiz"
2. Ingresa título y porcentaje para aprobar
3. Agrega preguntas:
   - Selecciona tipo (múltiple opción o V/F)
   - Escribe la pregunta
   - Define opciones y respuesta correcta
4. Guarda el quiz

#### 14.4.5 Calificar Tareas

1. En el menú, selecciona "Entregas"
2. Selecciona la tarea a calificar
3. Revisa la entrega del estudiante
4. Asigna una calificación (0-100)
5. Escribe retroalimentación
6. Haz clic en "Guardar"

#### 14.4.6 Publicar Curso

1. Accede al curso en modo edición
2. Verifica que todo el contenido esté completo
3. Cambia el estado a "Publicado"
4. El curso aparecerá en el catálogo

---

## 15. DOCUMENTACIÓN TÉCNICA

### 15.1 Estructura del Proyecto

```
novalearn-lms/
├── client/                 # Frontend React
│   └── src/
│       ├── components/     # Componentes reutilizables
│       │   ├── ui/         # shadcn/ui components
│       │   ├── app-sidebar.tsx
│       │   ├── quiz-creator-dialog.tsx
│       │   ├── quiz-taker.tsx
│       │   └── review-section.tsx
│       ├── hooks/          # Custom hooks
│       │   ├── useAuth.ts
│       │   └── use-toast.ts
│       ├── lib/            # Utilidades
│       │   ├── queryClient.ts
│       │   └── utils.ts
│       ├── pages/          # Páginas/Vistas
│       │   ├── landing.tsx
│       │   ├── student-dashboard.tsx
│       │   ├── instructor-dashboard.tsx
│       │   ├── courses.tsx
│       │   ├── course-view.tsx
│       │   ├── create-course.tsx
│       │   └── ...
│       ├── App.tsx         # Componente raíz
│       └── main.tsx        # Entry point
├── server/                 # Backend Express
│   ├── db.ts               # Conexión a base de datos
│   ├── index.ts            # Entry point del servidor
│   ├── keycloakAuth.ts     # Autenticación Keycloak
│   ├── routes.ts           # Rutas API
│   ├── storage.ts          # Capa de acceso a datos
│   └── vite.ts             # Configuración Vite
├── shared/                 # Código compartido
│   └── schema.ts           # Schema de base de datos
├── docker-compose.yml      # Configuración Docker
├── Dockerfile              # Imagen Docker
├── package.json            # Dependencias
└── vite.config.ts          # Configuración Vite
```

### 15.2 Códigos Principales

#### Autenticación Keycloak

```typescript
// server/keycloakAuth.ts
import Keycloak from 'keycloak-connect';
import { Request, Response, NextFunction } from 'express';

// Validación de variables de entorno
if (!process.env.KEYCLOAK_URL) {
  throw new Error('KEYCLOAK_URL environment variable is required');
}
if (!process.env.KEYCLOAK_REALM) {
  throw new Error('KEYCLOAK_REALM environment variable is required');
}
if (!process.env.KEYCLOAK_CLIENT_ID) {
  throw new Error('KEYCLOAK_CLIENT_ID environment variable is required');
}
if (!process.env.KEYCLOAK_CLIENT_SECRET) {
  throw new Error('KEYCLOAK_CLIENT_SECRET environment variable is required');
}

// Configuración desde variables de entorno
const keycloakConfig = {
  realm: process.env.KEYCLOAK_REALM,
  'auth-server-url': process.env.KEYCLOAK_URL,
  'ssl-required': 'external',
  resource: process.env.KEYCLOAK_CLIENT_ID,
  'confidential-port': 0,
  credentials: {
    secret: process.env.KEYCLOAK_CLIENT_SECRET,
  },
  'bearer-only': false,
};

export let keycloak: Keycloak.Keycloak;

export function initKeycloak(sessionStore: any) {
  keycloak = new Keycloak({ store: sessionStore }, keycloakConfig as any);
  return keycloak;
}

// Middleware para extraer usuario
export async function extractUserFromKeycloak(
  req: Request, 
  res: Response, 
  next: NextFunction
) {
  if (req.kauth?.grant?.access_token?.content) {
    const token = req.kauth.grant.access_token.content;
    
    (req as any).user = {
      keycloakId: token.sub || '',
      id: token.sub || '',
      email: token.email || '',
      firstName: token.given_name || '',
      lastName: token.family_name || '',
      username: token.preferred_username || '',
      roles: token.realm_access?.roles || [],
    };
  }
  next();
}

// Middleware de autenticación
export function isAuthenticated(req: Request, res: Response, next: NextFunction) {
  const user = (req as any).user;
  
  if (!user || !user.id) {
    return res.status(401).json({ message: 'No autenticado' });
  }
  
  next();
}

// Middleware de instructor
export function isInstructor(req: Request, res: Response, next: NextFunction) {
  const user = (req as any).user;
  
  if (!user || !user.roles) {
    return res.status(401).json({ message: 'No autenticado' });
  }
  
  const hasInstructorRole = user.roles.includes('instructor') || 
                            user.roles.includes('admin');
  
  if (!hasInstructorRole) {
    return res.status(403).json({ 
      message: 'Acceso denegado: Se requiere rol de instructor' 
    });
  }
  
  next();
}
```

#### Hook de Autenticación (Frontend)

```typescript
// hooks/useAuth.ts
import { useQuery } from "@tanstack/react-query";
import type { User } from "@shared/schema";

export function useAuth() {
  const { data: user, isLoading, error } = useQuery<User>({
    queryKey: ["/api/auth/user"],
    retry: false,
    staleTime: Infinity,
  });

  return {
    user,
    isLoading,
    isAuthenticated: !!user && !error,
    isInstructor: user?.role === "instructor",
    isStudent: user?.role === "student",
  };
}
```

### 15.3 API Endpoints

| Método | Endpoint | Descripción | Autenticación |
|--------|----------|-------------|---------------|
| GET | /api/auth/login | Iniciar sesión | No |
| GET | /api/auth/logout | Cerrar sesión | Sí |
| GET | /api/auth/user | Obtener usuario actual | Sí |
| GET | /api/courses | Listar cursos publicados | No |
| GET | /api/courses/:id | Obtener curso | Sí |
| POST | /api/courses | Crear curso | Instructor |
| PUT | /api/courses/:id | Actualizar curso | Instructor |
| POST | /api/modules | Crear módulo | Instructor |
| POST | /api/lessons | Crear lección | Instructor |
| GET | /api/enrollments/my-courses | Mis inscripciones | Sí |
| POST | /api/enrollments | Inscribirse | Sí |
| POST | /api/lesson-progress | Actualizar progreso | Sí |
| GET | /api/quizzes/:id | Obtener quiz | Sí |
| POST | /api/quiz-attempts | Enviar quiz | Sí |
| POST | /api/assignments | Crear tarea | Instructor |
| POST | /api/assignment-submissions | Enviar tarea | Sí |
| POST | /api/reviews | Crear reseña | Sí |

---

## 16. CONCLUSIONES

### 16.1 Resultados Alcanzados

1. **Sistema funcional completo**: Se desarrolló exitosamente una plataforma LMS con todas las funcionalidades requeridas.

2. **Arquitectura escalable**: La arquitectura basada en microservicios permite escalar horizontal y verticalmente.

3. **Autenticación empresarial**: Integración exitosa con Keycloak para SSO corporativo.

4. **Experiencia de usuario**: Interfaz intuitiva y responsive con feedback inmediato.

5. **Evaluación automatizada**: Sistema de quizzes con calificación instantánea funcionando correctamente.

### 16.2 Lecciones Aprendidas

1. **TypeScript end-to-end**: El tipado fuerte reduce errores en tiempo de ejecución.

2. **ORM moderno**: Drizzle ORM simplifica significativamente las operaciones de base de datos.

3. **Componentización**: shadcn/ui acelera el desarrollo manteniendo consistencia visual.

4. **Variables de entorno**: La configuración externa es esencial para seguridad y portabilidad.

5. **Docker**: La containerización facilita el deployment en diferentes entornos.

### 16.3 Posibles Mejoras Futuras

1. **Gamificación**: Agregar insignias, puntos y rankings.

2. **Chat en vivo**: Comunicación en tiempo real entre estudiantes e instructores.

3. **Certificados**: Generación automática de certificados al completar cursos.

4. **Mobile App**: Desarrollo de aplicaciones nativas iOS/Android.

5. **Analytics avanzados**: Dashboard con métricas más detalladas.

6. **Integración LTI**: Compatibilidad con otros LMS.

7. **AI/ML**: Recomendaciones personalizadas de cursos.

---

## 17. BIBLIOGRAFÍA

### Documentación Oficial

1. React Documentation. (2024). https://react.dev/
2. TypeScript Documentation. (2024). https://www.typescriptlang.org/docs/
3. Express.js Documentation. (2024). https://expressjs.com/
4. Drizzle ORM Documentation. (2024). https://orm.drizzle.team/
5. PostgreSQL Documentation. (2024). https://www.postgresql.org/docs/
6. Keycloak Documentation. (2024). https://www.keycloak.org/documentation
7. TanStack Query Documentation. (2024). https://tanstack.com/query/latest
8. shadcn/ui Documentation. (2024). https://ui.shadcn.com/
9. Tailwind CSS Documentation. (2024). https://tailwindcss.com/docs
10. Vite Documentation. (2024). https://vitejs.dev/

### Recursos Adicionales

11. Neon Database Documentation. (2024). https://neon.tech/docs
12. Radix UI Documentation. (2024). https://www.radix-ui.com/
13. Zod Documentation. (2024). https://zod.dev/
14. Wouter Documentation. (2024). https://github.com/molefrog/wouter

---

## 18. ANEXOS

### 18.1 Variables de Entorno Requeridas

```env
# Base de Datos (REQUERIDO)
DATABASE_URL=postgresql://user:password@host:5432/database

# Sesión (REQUERIDO)
SESSION_SECRET=your-secret-key

# Keycloak (REQUERIDAS)
KEYCLOAK_URL=https://keycloak.example.com
KEYCLOAK_REALM=your-realm
KEYCLOAK_CLIENT_ID=your-client
KEYCLOAK_CLIENT_SECRET=your-secret

# Opcionales
NODE_ENV=development
PORT=5000
```

### 18.2 Comandos de Desarrollo

```bash
# Instalar dependencias
npm install

# Iniciar en desarrollo
npm run dev

# Generar migraciones
npm run db:generate

# Aplicar migraciones
npm run db:push

# Build de producción
npm run build

# Iniciar en producción
npm start
```

### 18.3 Docker Deployment

```bash
# Construir imagen
docker-compose build

# Iniciar servicios
docker-compose up -d

# Ver logs
docker-compose logs -f

# Detener servicios
docker-compose down
```

### 18.4 Credenciales de Prueba

**Estudiante:**
- Email: test-student@gmail.com
- Password: 123456

**Instructor:**
- Email: eloyjuancastillo@gmail.com
- Password: 123456

---

## PARTE II: DEMOSTRACIÓN DE LA APLICACIÓN

### 1. Presentación General

**Nombre del Sistema:** NovaLearn LMS  
**Versión:** 1.0.0  
**Propósito:** Sistema de Gestión de Aprendizaje para democratizar la educación  
**Alcance:** Gestión de cursos, evaluaciones, tareas y progreso estudiantil

### 2. Interfaz Gráfica

*[Ver Sección 8 para descripción detallada]*

### 3. Base de Datos

- **Gestor:** PostgreSQL 15
- **Proveedor:** Neon Database
- **Tablas:** 13 tablas principales
- **ORM:** Drizzle

*[Ver Sección 9 para diagrama ER y estructura]*

### 4. Implementación CRUD

*[Ver Sección 11 para código comentado]*

### 5. Conexión con Base de Datos

*[Ver Sección 12 para código de conexión]*

### 6. Pruebas y Ejecución

**Flujo de Prueba: Inscripción y Completado de Curso**

1. Login como estudiante
2. Navegar al catálogo
3. Inscribirse en un curso
4. Ver lección y marcar completada
5. Realizar quiz
6. Verificar progreso actualizado

### 7. Evaluación de la Aplicación

*[Ver Sección 13 para evaluación completa]*

### 8. Conclusión de la Demostración

NovaLearn LMS cumple con todos los objetivos planteados:
- Autenticación segura con Keycloak
- Gestión completa de cursos
- Sistema de evaluaciones automáticas
- Seguimiento de progreso en tiempo real
- Interfaz intuitiva y responsive
- Arquitectura escalable y mantenible

---

**Documento generado:** Noviembre 2025  
**NovaLearn Labs - Democratizando el aprendizaje**
