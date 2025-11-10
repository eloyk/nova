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
- Protected routes with automatic redirect to Replit Auth
- Toast notifications for user feedback
- Progress tracking UI with visual indicators

### Backend Architecture

**Runtime & Framework**
- **Node.js with TypeScript** - ES modules configuration
- **Express.js** - RESTful API server with middleware pipeline
- **Session Management** - PostgreSQL-backed sessions via connect-pg-simple

**Authentication Strategy**
- **Replit Auth (OpenID Connect)** - OAuth 2.0 flow with Passport.js strategy
- **Session-based Authentication** - HTTP-only secure cookies
- **Role-based Authorization** - Middleware guards for student/instructor routes (`isAuthenticated`, `isInstructor`)
- **User Provisioning** - Automatic user creation/update on first login via `upsertUser`

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

**Object Storage Strategy**
- **Google Cloud Storage** - Primary storage for course media and uploads
- **Replit Sidecar Integration** - External account authentication via local endpoint
- **Custom ACL System** - Object-level permissions with metadata-based policies
- **Access Control** - Owner-based permissions with public/private visibility flags
- **Upload Flow** - Client-side file selection → Server API → GCS with metadata

**Supported File Types**
- Video content for lessons (MP4, WebM)
- Assignment submissions (documents, images)
- Course thumbnails and media assets
- Maximum file size: 500MB default (configurable)

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

**Assessment APIs**
- `POST /api/quizzes` - Create quiz (instructor)
- `POST /api/quiz-attempts` - Submit quiz answers
- `POST /api/assignments` - Create assignment (instructor)
- `POST /api/assignment-submissions` - Submit assignment

**Analytics**
- `GET /api/students/stats` - Student dashboard statistics
- `GET /api/instructor/stats` - Instructor analytics
- `GET /api/instructor/courses` - Instructor's courses with enrollment data

## External Dependencies

### Third-Party Services

**Authentication**
- **Replit Auth** - OAuth 2.0 OpenID Connect provider (issuer: replit.com/oidc)
- **Passport.js** - Authentication middleware with openid-client strategy

**Database**
- **Neon Database** - Serverless PostgreSQL (connection via DATABASE_URL env var)
- **Drizzle ORM** - Type-safe database toolkit with PostgreSQL dialect

**Object Storage**
- **Google Cloud Storage** - Media file storage with GCS client SDK
- **Replit Sidecar** - Local authentication proxy (http://127.0.0.1:1106)

### Key NPM Packages

**Backend Core**
- `express` - Web framework
- `@neondatabase/serverless` - PostgreSQL client
- `drizzle-orm` - ORM and query builder
- `passport`, `openid-client` - Authentication
- `express-session`, `connect-pg-simple` - Session management
- `@google-cloud/storage` - GCS SDK

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
- `ISSUER_URL` - Replit Auth issuer (default: https://replit.com/oidc)
- `REPL_ID` - Replit environment identifier
- `PUBLIC_OBJECT_SEARCH_PATHS` - Optional GCS public object paths