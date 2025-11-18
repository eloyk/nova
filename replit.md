# NovaLearn LMS

## Overview

NovaLearn is a modern Learning Management System (LMS) designed to democratize learning through technology. Built for educational institutions and companies in the Dominican Republic, it provides a comprehensive platform for course management, student progress tracking, and interactive learning experiences. The system supports both students and instructors with distinct interfaces and capabilities, featuring course modules, lessons, quizzes, assignments, and detailed analytics.

## User Preferences

Preferred communication style: Simple, everyday language.

## System Architecture

### Frontend Architecture

**Framework & Tooling**
- **React with TypeScript** - Component-based UI using functional components and hooks
- **Vite** - Modern build tool for fast development and optimized production builds
- **Wouter** - Lightweight client-side routing
- **TanStack Query (React Query)** - Server state management with caching and automatic refetching

**UI Component System**
- **shadcn/ui** - Radix UI primitives with Tailwind CSS styling (New York style preset)
- **Tailwind CSS** - Utility-first CSS framework with custom design tokens
- **Design Language** - Material Design-inspired educational platform (Inter font family)
- **Responsive Grid System** - 12-column layout for dashboards, adaptive course card grids

**State Management Pattern**
- Server state managed via React Query with query key-based invalidation
- Local UI state using React hooks (useState, useEffect)
- Authentication state centralized through `useAuth` custom hook
- Form state managed by React Hook Form with Zod schema validation

**Key UI Features**
- Role-based routing (student vs instructor dashboards)
- Collapsible sidebar navigation with mobile sheet drawer
- Protected routes with automatic redirect to Keycloak authentication
- Toast notifications for user feedback
- Progress tracking UI with visual indicators

### Backend Architecture

**Runtime & Framework**
- **Node.js with TypeScript** - ES modules configuration
- **Express.js** - RESTful API server with middleware pipeline
- **Session Management** - PostgreSQL-backed sessions via connect-pg-simple

**Authentication Strategy**
- **Keycloak (OpenID Connect)** - OAuth 2.0 flow with keycloak-connect adapter
- **Server**: https://keycloak.vimcashcorp.com
- **Realm**: nova-learn
- **Client**: nova-backend (confidential)
- **Session-based Authentication** - HTTP-only secure cookies with PostgreSQL session store
- **Role-based Authorization** - Middleware guards for student/instructor routes (`isAuthenticated`, `isInstructor`)
- **User Provisioning** - Automatic user creation/update on first login via `upsertUser`
- **Role Mapping** - Keycloak realm roles (instructor, admin, student) mapped to application roles

**API Design Pattern**
- RESTful endpoints organized by resource (`/api/courses`, `/api/enrollments`, etc.)
- Consistent error handling with HTTP status codes
- Request/response logging middleware for debugging
- Input validation using Zod schemas from shared types

**Storage Layer Architecture**
- **Repository Pattern** - `storage.ts` abstracts all database operations
- **Drizzle ORM** - Type-safe SQL query builder with schema inference
- **Schema-First Design** - Shared TypeScript types between client and server
- **Relational Data Model** - Normalized tables with foreign key relationships

### Database Design

**PostgreSQL Schema**
- **users** - Authentication and profile data (id, email, firstName, lastName, role)
- **courses** - Course metadata (title, description, category, level, status, instructorId)
- **modules** - Course sections (courseId, title, description, order)
- **lessons** - Lesson content (moduleId, title, content, videoUrl, order, type)
- **enrollments** - Student-course relationships (userId, courseId, enrolledAt, progress)
- **lessonProgress** - Completion tracking (userId, lessonId, completed)
- **quizzes** - Assessment definitions (lessonId, title, passingScore)
- **quizQuestions** - Quiz content (quizId, question, options, correctAnswer)
- **quizAttempts** - Student quiz submissions (userId, quizId, answers, score)
- **assignments** - Assignment definitions (lessonId, title, description, dueDate)
- **assignmentSubmissions** - Student work (userId, assignmentId, content, fileUrl, grade)
- **sessions** - Server-side session storage (sid, sess, expire)

**Database Connection**
- **Neon Serverless PostgreSQL** - WebSocket-based connection pooling
- **Connection Pool** - Managed via `@neondatabase/serverless` with ws transport
- **Migration Strategy** - Drizzle Kit for schema migrations to `./migrations` directory

### File Storage Architecture

**File Storage Strategy**
- **Local Filesystem** - Videos stored in `/videos` directory on server
- **Multer Middleware** - Handles multipart/form-data file uploads
- **Authenticated Access** - Videos served via Express static middleware with authentication
- **Upload Endpoint** - POST /api/upload/video accepts video files
- **File Naming** - Unique filenames using timestamp + original filename

**Supported File Types**
- Video content for lessons (MP4, WebM, AVI, MOV)
- Maximum file size: 500MB (configurable via multer limits)

### API Structure

**Course Management**
- `GET /api/courses` - List published courses
- `GET /api/courses/:id` - Course details with modules/lessons
- `POST /api/courses` - Create course (instructor only)
- `PUT /api/courses/:id` - Update course (instructor only)
- `DELETE /api/courses/:id` - Delete course (instructor only)

**Enrollment & Progress**
- `POST /api/enrollments` - Enroll in course
- `GET /api/enrollments/my-courses` - Student's enrolled courses
- `GET /api/enrollments/course/:id` - Enrollment status
- `POST /api/lesson-progress` - Mark lesson complete
- `GET /api/lesson-progress/course/:id` - Course progress

**Assessment APIs - Quizzes**
- `POST /api/quizzes` - Create quiz (instructor)
- `GET /api/quizzes/:id` - Get quiz metadata by ID
- `GET /api/quizzes/:id/questions` - Get all questions for a quiz
- `GET /api/quizzes/lesson/:lessonId` - Get all quizzes for a lesson
- `GET /api/courses/:courseId/quizzes` - Get all quizzes for a course
- `POST /api/quiz-questions` - Create quiz question (instructor)
- `POST /api/quiz-attempts` - Submit quiz answers (student)

**Assessment APIs - Assignments**
- `POST /api/assignments` - Create assignment (instructor)
- `POST /api/assignment-submissions` - Submit assignment

**Analytics**
- `GET /api/students/stats` - Student dashboard statistics
- `GET /api/instructor/stats` - Instructor analytics
- `GET /api/instructor/courses` - Instructor's courses with enrollment data

## External Dependencies

### Third-Party Services

**Authentication**
- **Keycloak** - Enterprise-grade OpenID Connect provider
  - Server: https://keycloak.vimcashcorp.com
  - Realm: nova-learn
  - Client: nova-backend (confidential)
- **keycloak-connect** - Official Node.js adapter for Keycloak integration

**Database**
- **Neon Database** - Serverless PostgreSQL (connection via DATABASE_URL env var)
- **Drizzle ORM** - Type-safe database toolkit with PostgreSQL dialect

**File Storage**
- **Local Filesystem** - Video storage in `/videos` directory
- **Multer** - Multipart/form-data file upload handling
- **File Serving** - Authenticated video access via Express static middleware

### Key NPM Packages

**Backend Core**
- `express` - Web framework
- `@neondatabase/serverless` - PostgreSQL client
- `drizzle-orm` - ORM and query builder
- `keycloak-connect` - Keycloak authentication adapter
- `express-session`, `connect-pg-simple` - Session management
- `multer` - File upload middleware

**Frontend Core**
- `react`, `react-dom` - UI library
- `wouter` - Routing
- `@tanstack/react-query` - Data fetching
- `react-hook-form`, `@hookform/resolvers` - Form handling
- `zod` - Schema validation

**UI Components**
- `@radix-ui/*` - Headless UI primitives (30+ components)
- `tailwindcss` - Styling framework
- `class-variance-authority`, `clsx`, `tailwind-merge` - Utility functions
- `lucide-react` - Icon library

**Development Tools**
- `typescript` - Type system
- `vite` - Build tool
- `tsx` - TypeScript execution
- `esbuild` - Production bundling
- `drizzle-kit` - Database migrations

### Environment Variables Required

- `DATABASE_URL` - PostgreSQL connection string (Neon)
- `SESSION_SECRET` - Express session encryption key
- `KEYCLOAK_CLIENT_SECRET` - Keycloak client secret for nova-backend client