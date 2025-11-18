import type { Express } from "express";
import { createServer, type Server } from "http";
import { storage } from "./storage";
import { keycloak, isAuthenticated, isInstructor, getCurrentUser, getDatabaseUserId } from "./keycloakAuth";
import { insertCourseSchema, insertModuleSchema, insertLessonSchema, insertEnrollmentSchema, insertLessonProgressSchema, insertQuizSchema, insertQuizQuestionSchema, insertQuizAttemptSchema, insertAssignmentSchema, insertAssignmentSubmissionSchema, insertReviewSchema } from "@shared/schema";
import { db } from "./db";
import { courses, modules, lessons, enrollments, lessonProgress as lessonProgressTable, quizzes, quizQuestions } from "@shared/schema";
import { eq, and, sql } from "drizzle-orm";
import multer from "multer";
import path from "path";
import fs from "fs";

export async function registerRoutes(app: Express): Promise<Server> {

  // ============================================
  // AUTH ROUTES
  // ============================================

  // Login route - redirects to Keycloak login page  
  app.get('/api/auth/login', keycloak.protect(), (req, res) => {
    // Si llegamos aquí, el usuario ya está autenticado
    res.redirect('/');
  });

  // Logout route
  app.get('/api/auth/logout', (req, res) => {
    // Construir la URL de redirect después del logout
    const protocol = req.protocol;
    const host = req.get('host');
    const redirectUri = `${protocol}://${host}/`;
    
    // Destruir la sesión local
    req.session?.destroy((err) => {
      if (err) {
        console.error('Session destruction error:', err);
      }
    });
    
    // Redirigir a Keycloak logout con redirect de vuelta a la app
    const logoutUrl = `https://keycloak.vimcashcorp.com/realms/nova-learn/protocol/openid-connect/logout?post_logout_redirect_uri=${encodeURIComponent(redirectUri)}&client_id=nova-backend`;
    res.redirect(logoutUrl);
  });

  // Get current user
  app.get('/api/auth/user', isAuthenticated, async (req, res) => {
    try {
      const user = getCurrentUser(req);
      if (!user || !user.id) {
        return res.status(401).json({ message: "No autenticado" });
      }

      // Sincronizar o crear usuario en la base de datos
      const dbUser = await storage.upsertUser({
        id: user.id,
        email: user.email || '',
        firstName: user.firstName || '',
        lastName: user.lastName || '',
        role: user.roles.includes('instructor') || user.roles.includes('admin') ? 'instructor' : 'student',
      });

      // Actualizar el objeto de usuario en el request con el ID de la base de datos
      (req as any).user = {
        ...user,
        id: dbUser.id, // Usar el ID de la base de datos
        role: dbUser.role,
      };

      res.json(dbUser);
    } catch (error) {
      console.error("Error fetching user:", error);
      res.status(500).json({ message: "Failed to fetch user" });
    }
  });

  // ============================================
  // COURSE ROUTES
  // ============================================

  // Get all published courses
  app.get("/api/courses", async (req, res) => {
    try {
      const allCourses = await storage.getCourses();
      const publishedCourses = allCourses.filter(c => c.status === "published");
      res.json(publishedCourses);
    } catch (error) {
      console.error("Error fetching courses:", error);
      res.status(500).json({ message: "Failed to fetch courses" });
    }
  });

  // Get course by ID with modules and lessons
  app.get("/api/courses/:id", isAuthenticated, async (req: any, res) => {
    try {
      const userId = await getDatabaseUserId(req);
      if (!userId) {
        return res.status(401).json({ message: "Usuario no encontrado en la base de datos" });
      }
      const course = await storage.getCourse(req.params.id);
      
      if (!course) {
        return res.status(404).json({ message: "Course not found" });
      }

      // Authorization: Only course instructor or enrolled students can access full content
      // Draft courses can only be viewed by the instructor
      const isOwner = course.instructorId === userId;
      const enrollment = await storage.getEnrollmentByUserAndCourse(userId, course.id);
      const isEnrolled = !!enrollment;

      if (course.status === "draft" && !isOwner) {
        return res.status(403).json({ message: "This course is not published yet" });
      }

      if (course.status !== "published" && !isOwner && !isEnrolled) {
        return res.status(403).json({ message: "Access denied" });
      }

      if (!isOwner && !isEnrolled && course.status !== "published") {
        return res.status(403).json({ message: "You must be enrolled to access this course" });
      }

      const courseModules = await storage.getModulesByCourse(course.id);
      const modulesWithLessons = await Promise.all(
        courseModules.map(async (module) => ({
          ...module,
          lessons: await storage.getLessonsByModule(module.id),
        }))
      );

      res.json({ ...course, modules: modulesWithLessons });
    } catch (error) {
      console.error("Error fetching course:", error);
      res.status(500).json({ message: "Failed to fetch course" });
    }
  });

  // Create course (instructor only)
  app.post("/api/courses", isAuthenticated, isInstructor, async (req: any, res) => {
    try {
      const userId = await getDatabaseUserId(req);
      if (!userId) {
        return res.status(401).json({ message: "Usuario no encontrado en la base de datos" });
      }
      const courseData = insertCourseSchema.parse({ ...req.body, instructorId: userId });
      const course = await storage.createCourse(courseData);
      res.status(201).json(course);
    } catch (error: any) {
      console.error("Error creating course:", error);
      res.status(400).json({ message: error.message || "Failed to create course" });
    }
  });

  // Update course (instructor only)
  app.put("/api/courses/:id", isAuthenticated, isInstructor, async (req: any, res) => {
    try {
      const userId = await getDatabaseUserId(req);
      if (!userId) {
        return res.status(401).json({ message: "Usuario no encontrado en la base de datos" });
      }
      const course = await storage.getCourse(req.params.id);
      
      if (!course) {
        return res.status(404).json({ message: "Course not found" });
      }

      if (course.instructorId !== userId) {
        return res.status(403).json({ message: "Forbidden" });
      }

      const updated = await storage.updateCourse(req.params.id, req.body);
      res.json(updated);
    } catch (error) {
      console.error("Error updating course:", error);
      res.status(500).json({ message: "Failed to update course" });
    }
  });

  // Recalculate enrollment progress for a course (instructor only)
  app.post("/api/courses/:id/recalculate-progress", isAuthenticated, isInstructor, async (req: any, res) => {
    try {
      const userId = await getDatabaseUserId(req);
      if (!userId) {
        return res.status(401).json({ message: "Usuario no encontrado en la base de datos" });
      }
      const course = await storage.getCourse(req.params.id);
      
      if (!course) {
        return res.status(404).json({ message: "Course not found" });
      }

      if (course.instructorId !== userId) {
        return res.status(403).json({ message: "Forbidden" });
      }

      await storage.recalculateEnrollmentProgress(req.params.id);
      res.json({ message: "Progress recalculated successfully" });
    } catch (error) {
      console.error("Error recalculating progress:", error);
      res.status(500).json({ message: "Failed to recalculate progress" });
    }
  });

  // Get instructor's courses
  app.get("/api/instructor/courses", isAuthenticated, isInstructor, async (req: any, res) => {
    try {
      const userId = await getDatabaseUserId(req);
      if (!userId) {
        return res.status(401).json({ message: "Usuario no encontrado en la base de datos" });
      }
      const courses = await storage.getCoursesByInstructor(userId);
      res.json(courses);
    } catch (error) {
      console.error("Error fetching instructor courses:", error);
      res.status(500).json({ message: "Failed to fetch courses" });
    }
  });

  // Get instructor stats
  app.get("/api/instructor/stats", isAuthenticated, isInstructor, async (req: any, res) => {
    try {
      const userId = await getDatabaseUserId(req);
      if (!userId) {
        return res.status(401).json({ message: "Usuario no encontrado en la base de datos" });
      }
      const instructorCourses = await storage.getCoursesByInstructor(userId);
      
      const totalStudents = new Set<string>();
      const allEnrollments: any[] = [];
      
      for (const course of instructorCourses) {
        const enrolls = await storage.getEnrollmentsByCourse(course.id);
        enrolls.forEach(e => {
          totalStudents.add(e.userId);
          allEnrollments.push(e);
        });
      }

      // Calculate completion rate based on progress_percentage >= 100
      const completedEnrollments = allEnrollments.filter(e => e.progressPercentage >= 100);
      const completionRate = allEnrollments.length > 0 
        ? Math.round((completedEnrollments.length / allEnrollments.length) * 100) 
        : 0;

      // Get review statistics efficiently with a single aggregated query
      const reviewStats = await storage.getInstructorReviewStats(userId);

      res.json({
        totalStudents: totalStudents.size,
        averageRating: reviewStats.averageRating,
        totalReviews: reviewStats.totalReviews,
        completionRate,
      });
    } catch (error) {
      console.error("Error fetching instructor stats:", error);
      res.status(500).json({ message: "Failed to fetch stats" });
    }
  });

  // ============================================
  // MODULE ROUTES
  // ============================================

  app.post("/api/modules", isAuthenticated, isInstructor, async (req: any, res) => {
    try {
      const userId = await getDatabaseUserId(req);
      if (!userId) {
        return res.status(401).json({ message: "Usuario no encontrado en la base de datos" });
      }
      const moduleData = insertModuleSchema.parse(req.body);
      
      const course = await storage.getCourse(moduleData.courseId);
      if (!course || course.instructorId !== userId) {
        return res.status(403).json({ message: "Forbidden" });
      }

      const module = await storage.createModule(moduleData);
      res.status(201).json(module);
    } catch (error: any) {
      console.error("Error creating module:", error);
      res.status(400).json({ message: error.message || "Failed to create module" });
    }
  });

  // ============================================
  // LESSON ROUTES
  // ============================================

  app.post("/api/lessons", isAuthenticated, isInstructor, async (req: any, res) => {
    try {
      const userId = await getDatabaseUserId(req);
      if (!userId) {
        return res.status(401).json({ message: "Usuario no encontrado en la base de datos" });
      }
      const lessonData = insertLessonSchema.parse(req.body);
      
      const module = await storage.getModule(lessonData.moduleId);
      if (!module) {
        return res.status(404).json({ message: "Module not found" });
      }

      const course = await storage.getCourse(module.courseId);
      if (!course || course.instructorId !== userId) {
        return res.status(403).json({ message: "Forbidden" });
      }

      const lesson = await storage.createLesson(lessonData);
      res.status(201).json(lesson);
    } catch (error: any) {
      console.error("Error creating lesson:", error);
      res.status(400).json({ message: error.message || "Failed to create lesson" });
    }
  });

  // ============================================
  // ENROLLMENT ROUTES
  // ============================================

  // Get user's enrollments with course data
  app.get("/api/enrollments/my-courses", isAuthenticated, async (req: any, res) => {
    try {
      const userId = await getDatabaseUserId(req);
      if (!userId) {
        return res.status(401).json({ message: "Usuario no encontrado en la base de datos" });
      }
      const userEnrollments = await storage.getEnrollmentsByUser(userId);
      
      const enrollmentsWithCourses = await Promise.all(
        userEnrollments.map(async (enrollment) => {
          const course = await storage.getCourse(enrollment.courseId);
          return { ...enrollment, course };
        })
      );

      res.json(enrollmentsWithCourses);
    } catch (error) {
      console.error("Error fetching enrollments:", error);
      res.status(500).json({ message: "Failed to fetch enrollments" });
    }
  });

  // Get user's enrolled course IDs
  app.get("/api/enrollments/course-ids", isAuthenticated, async (req: any, res) => {
    try {
      const userId = await getDatabaseUserId(req);
      if (!userId) {
        return res.status(401).json({ message: "Usuario no encontrado en la base de datos" });
      }
      const userEnrollments = await storage.getEnrollmentsByUser(userId);
      const courseIds = userEnrollments.map(e => e.courseId);
      res.json(courseIds);
    } catch (error) {
      console.error("Error fetching enrolled course IDs:", error);
      res.status(500).json({ message: "Failed to fetch course IDs" });
    }
  });

  // Get enrollment for a specific course
  app.get("/api/enrollments/course/:courseId", isAuthenticated, async (req: any, res) => {
    try {
      const userId = await getDatabaseUserId(req);
      if (!userId) {
        return res.status(401).json({ message: "Usuario no encontrado en la base de datos" });
      }
      const enrollment = await storage.getEnrollmentByUserAndCourse(userId, req.params.courseId);
      res.json(enrollment || null);
    } catch (error) {
      console.error("Error fetching enrollment:", error);
      res.status(500).json({ message: "Failed to fetch enrollment" });
    }
  });

  // Create enrollment
  app.post("/api/enrollments", isAuthenticated, async (req: any, res) => {
    try {
      const userId = await getDatabaseUserId(req);
      if (!userId) {
        return res.status(401).json({ message: "Usuario no encontrado en la base de datos" });
      }
      const enrollmentData = insertEnrollmentSchema.parse({ ...req.body, userId });

      // Check if already enrolled
      const existing = await storage.getEnrollmentByUserAndCourse(userId, enrollmentData.courseId);
      if (existing) {
        return res.status(400).json({ message: "Already enrolled in this course" });
      }

      const enrollment = await storage.createEnrollment(enrollmentData);
      res.status(201).json(enrollment);
    } catch (error: any) {
      console.error("Error creating enrollment:", error);
      res.status(400).json({ message: error.message || "Failed to create enrollment" });
    }
  });

  // Get student stats
  app.get("/api/students/stats", isAuthenticated, async (req: any, res) => {
    try {
      const userId = await getDatabaseUserId(req);
      if (!userId) {
        return res.status(401).json({ message: "Usuario no encontrado en la base de datos" });
      }
      const userEnrollments = await storage.getEnrollmentsByUser(userId);
      
      const totalProgress = userEnrollments.reduce((sum, e) => sum + e.progressPercentage, 0);
      const averageProgress = userEnrollments.length > 0 ? Math.round(totalProgress / userEnrollments.length) : 0;

      // Calculate total hours from completed lessons in enrolled courses only
      // Use a single JOIN query to get completed lessons filtered by enrolled course IDs
      const enrolledCourseIds = userEnrollments.map(e => e.courseId);
      const completedLessons = await storage.getCompletedLessonsByCourses(userId, enrolledCourseIds);
      
      // Sum up the duration of all completed lessons
      const totalSeconds = completedLessons.reduce((sum, lesson) => {
        return sum + (lesson.duration || 0);
      }, 0);
      
      // Convert seconds to hours (don't round to preserve precision for small values)
      const totalHours = totalSeconds / 3600;

      // Count completed courses (progress = 100%)
      const completedCourses = userEnrollments.filter(e => e.progressPercentage >= 100).length;

      res.json({
        totalCourses: userEnrollments.length,
        completedCourses,
        totalHours,
        averageProgress,
      });
    } catch (error) {
      console.error("Error fetching student stats:", error);
      res.status(500).json({ message: "Failed to fetch stats" });
    }
  });

  // ============================================
  // LESSON PROGRESS ROUTES
  // ============================================

  // Get lesson progress for a course
  app.get("/api/lesson-progress/course/:courseId", isAuthenticated, async (req: any, res) => {
    try {
      const userId = await getDatabaseUserId(req);
      if (!userId) {
        return res.status(401).json({ message: "Usuario no encontrado en la base de datos" });
      }
      const courseModules = await storage.getModulesByCourse(req.params.courseId);
      
      const allLessons: any[] = [];
      for (const module of courseModules) {
        const moduleLessons = await storage.getLessonsByModule(module.id);
        allLessons.push(...moduleLessons);
      }

      const progress = await storage.getLessonProgressByUser(userId);
      const completedLessonIds = progress
        .filter(p => p.completed && allLessons.some(l => l.id === p.lessonId))
        .map(p => p.lessonId);

      res.json(completedLessonIds);
    } catch (error) {
      console.error("Error fetching lesson progress:", error);
      res.status(500).json({ message: "Failed to fetch lesson progress" });
    }
  });

  // Create or update lesson progress
  app.post("/api/lesson-progress", isAuthenticated, async (req: any, res) => {
    try {
      const userId = await getDatabaseUserId(req);
      if (!userId) {
        return res.status(401).json({ message: "Usuario no encontrado en la base de datos" });
      }
      const progressData = insertLessonProgressSchema.parse({ ...req.body, userId });
      
      const lessonProg = await storage.upsertLessonProgress(progressData);

      // Update enrollment progress
      const lesson = await storage.getLesson(progressData.lessonId);
      if (lesson) {
        const module = await storage.getModule(lesson.moduleId);
        if (module) {
          const enrollment = await storage.getEnrollmentByUserAndCourse(userId, module.courseId);
          if (enrollment) {
            const courseModules = await storage.getModulesByCourse(module.courseId);
            
            // Get all lessons in the course
            const allCourseLessons: any[] = [];
            for (const mod of courseModules) {
              const modLessons = await storage.getLessonsByModule(mod.id);
              allCourseLessons.push(...modLessons);
            }
            
            const totalLessons = allCourseLessons.length;
            
            // Get user progress and filter for completed lessons in this course
            const userProgress = await storage.getLessonProgressByUser(userId);
            const completedInCourse = userProgress.filter(p => 
              p.completed && allCourseLessons.some(l => l.id === p.lessonId)
            );

            const progressPercentage = totalLessons > 0 ? Math.round((completedInCourse.length / totalLessons) * 100) : 0;
            await storage.updateEnrollment(enrollment.id, { progressPercentage });
            
            console.log(`Updated enrollment progress: ${completedInCourse.length}/${totalLessons} lessons completed (${progressPercentage}%)`);
          }
        }
      }

      res.json(lessonProg);
    } catch (error: any) {
      console.error("Error updating lesson progress:", error);
      res.status(400).json({ message: error.message || "Failed to update lesson progress" });
    }
  });

  // ============================================
  // QUIZ ROUTES
  // ============================================

  app.post("/api/quizzes", isAuthenticated, isInstructor, async (req: any, res) => {
    try {
      const userId = await getDatabaseUserId(req);
      if (!userId) {
        return res.status(401).json({ message: "Usuario no encontrado en la base de datos" });
      }
      const quizData = insertQuizSchema.parse(req.body);
      
      const lesson = await storage.getLesson(quizData.lessonId);
      if (!lesson) {
        return res.status(404).json({ message: "Lesson not found" });
      }

      const module = await storage.getModule(lesson.moduleId);
      if (!module) {
        return res.status(404).json({ message: "Module not found" });
      }

      const course = await storage.getCourse(module.courseId);
      if (!course || course.instructorId !== userId) {
        return res.status(403).json({ message: "Forbidden" });
      }

      const quiz = await storage.createQuiz(quizData);
      res.status(201).json(quiz);
    } catch (error: any) {
      console.error("Error creating quiz:", error);
      res.status(400).json({ message: error.message || "Failed to create quiz" });
    }
  });

  app.post("/api/quiz-questions", isAuthenticated, isInstructor, async (req: any, res) => {
    try {
      const userId = await getDatabaseUserId(req);
      if (!userId) {
        return res.status(401).json({ message: "Usuario no encontrado en la base de datos" });
      }
      const questionData = insertQuizQuestionSchema.parse(req.body);
      
      const quiz = await storage.getQuiz(questionData.quizId);
      if (!quiz) {
        return res.status(404).json({ message: "Quiz not found" });
      }

      const question = await storage.createQuizQuestion(questionData);
      res.status(201).json(question);
    } catch (error: any) {
      console.error("Error creating quiz question:", error);
      res.status(400).json({ message: error.message || "Failed to create quiz question" });
    }
  });

  // Get a single quiz by ID
  app.get("/api/quizzes/:id", isAuthenticated, async (req, res) => {
    try {
      const quiz = await storage.getQuiz(req.params.id);
      if (!quiz) {
        return res.status(404).json({ message: "Quiz not found" });
      }
      res.json(quiz);
    } catch (error) {
      console.error("Error fetching quiz:", error);
      res.status(500).json({ message: "Failed to fetch quiz" });
    }
  });

  app.get("/api/quizzes/:id/questions", isAuthenticated, async (req, res) => {
    try {
      const questions = await storage.getQuizQuestions(req.params.id);
      res.json(questions);
    } catch (error) {
      console.error("Error fetching quiz questions:", error);
      res.status(500).json({ message: "Failed to fetch quiz questions" });
    }
  });

  // Get quizzes for a lesson
  app.get("/api/quizzes/lesson/:lessonId", isAuthenticated, async (req, res) => {
    try {
      const quizzes = await storage.getQuizzesByLesson(req.params.lessonId);
      
      // Load questions for each quiz
      const quizzesWithQuestions = await Promise.all(
        quizzes.map(async (quiz) => {
          const questions = await storage.getQuizQuestions(quiz.id);
          // Sort questions by order
          const sortedQuestions = questions.sort((a, b) => a.order - b.order);
          return {
            ...quiz,
            questions: sortedQuestions,
          };
        })
      );
      
      res.json(quizzesWithQuestions);
    } catch (error) {
      console.error("Error fetching lesson quizzes:", error);
      res.status(500).json({ message: "Failed to fetch quizzes" });
    }
  });

  // Get quizzes for a course
  app.get("/api/courses/:courseId/quizzes", isAuthenticated, async (req, res) => {
    try {
      const course = await storage.getCourse(req.params.courseId);
      if (!course) {
        return res.status(404).json({ message: "Course not found" });
      }

      const quizzesData: any[] = [];
      
      // Load modules for this course
      const courseModules = await storage.getModulesByCourse(course.id);
      
      // Load lessons for each module and get their quizzes
      for (const module of courseModules) {
        const lessons = await storage.getLessonsByModule(module.id);
        for (const lesson of lessons) {
          const quizzes = await storage.getQuizzesByLesson(lesson.id);
          for (const quiz of quizzes) {
            quizzesData.push({
              ...quiz,
              lessonId: lesson.id,
              lessonTitle: lesson.title,
              moduleTitle: module.title,
            });
          }
        }
      }

      res.json(quizzesData);
    } catch (error) {
      console.error("Error fetching course quizzes:", error);
      res.status(500).json({ message: "Failed to fetch quizzes" });
    }
  });

  app.post("/api/quiz-attempts", isAuthenticated, async (req: any, res) => {
    try {
      const userId = await getDatabaseUserId(req);
      if (!userId) {
        return res.status(401).json({ message: "Usuario no encontrado en la base de datos" });
      }
      const attemptData = insertQuizAttemptSchema.parse({ ...req.body, userId });
      
      const attempt = await storage.createQuizAttempt(attemptData);
      res.status(201).json(attempt);
    } catch (error: any) {
      console.error("Error creating quiz attempt:", error);
      res.status(400).json({ message: error.message || "Failed to create quiz attempt" });
    }
  });

  // Get quiz attempts for a specific quiz (student's previous attempts)
  app.get("/api/quiz-attempts/quiz/:quizId", isAuthenticated, async (req: any, res) => {
    try {
      const userId = await getDatabaseUserId(req);
      if (!userId) {
        return res.status(401).json({ message: "Usuario no encontrado en la base de datos" });
      }
      const attempts = await storage.getQuizAttemptsByUser(userId, req.params.quizId);
      res.json(attempts);
    } catch (error) {
      console.error("Error fetching quiz attempts:", error);
      res.status(500).json({ message: "Failed to fetch quiz attempts" });
    }
  });

  // ============================================
  // ASSIGNMENT ROUTES
  // ============================================

  // Get course assignments
  app.get("/api/courses/:courseId/assignments", isAuthenticated, async (req, res) => {
    try {
      const assignments = await storage.getAssignmentsByCourse(req.params.courseId);
      res.json(assignments);
    } catch (error) {
      console.error("Error fetching course assignments:", error);
      res.status(500).json({ message: "Failed to fetch assignments" });
    }
  });

  // Get assignment by ID
  app.get("/api/assignments/:id", isAuthenticated, async (req, res) => {
    try {
      const assignment = await storage.getAssignment(req.params.id);
      if (!assignment) {
        return res.status(404).json({ message: "Assignment not found" });
      }
      res.json(assignment);
    } catch (error) {
      console.error("Error fetching assignment:", error);
      res.status(500).json({ message: "Failed to fetch assignment" });
    }
  });

  // Create assignment (instructor only)
  app.post("/api/assignments", isAuthenticated, isInstructor, async (req: any, res) => {
    try {
      const userId = await getDatabaseUserId(req);
      if (!userId) {
        return res.status(401).json({ message: "Usuario no encontrado en la base de datos" });
      }
      const assignmentData = insertAssignmentSchema.parse(req.body);
      
      const lesson = await storage.getLesson(assignmentData.lessonId);
      if (!lesson) {
        return res.status(404).json({ message: "Lesson not found" });
      }

      const module = await storage.getModule(lesson.moduleId);
      if (!module) {
        return res.status(404).json({ message: "Module not found" });
      }

      const course = await storage.getCourse(module.courseId);
      if (!course || course.instructorId !== userId) {
        return res.status(403).json({ message: "Forbidden" });
      }

      const assignment = await storage.createAssignment(assignmentData);
      res.status(201).json(assignment);
    } catch (error: any) {
      console.error("Error creating assignment:", error);
      res.status(400).json({ message: error.message || "Failed to create assignment" });
    }
  });

  // Get all submissions for an assignment (instructor only)
  app.get("/api/assignment-submissions/assignment/:assignmentId", isAuthenticated, isInstructor, async (req, res) => {
    try {
      const submissions = await storage.getSubmissionsByAssignment(req.params.assignmentId);
      res.json(submissions);
    } catch (error) {
      console.error("Error fetching assignment submissions:", error);
      res.status(500).json({ message: "Failed to fetch submissions" });
    }
  });

  // Get current user's submission for an assignment
  app.get("/api/assignment-submissions/me/:assignmentId", isAuthenticated, async (req: any, res) => {
    try {
      const userId = await getDatabaseUserId(req);
      if (!userId) {
        return res.status(401).json({ message: "Usuario no encontrado en la base de datos" });
      }
      
      const submission = await storage.getSubmissionByUserAndAssignment(userId, req.params.assignmentId);
      res.json(submission || null);
    } catch (error) {
      console.error("Error fetching user submission:", error);
      res.status(500).json({ message: "Failed to fetch submission" });
    }
  });

  // Submit assignment
  app.post("/api/assignment-submissions", isAuthenticated, async (req: any, res) => {
    try {
      const userId = await getDatabaseUserId(req);
      if (!userId) {
        return res.status(401).json({ message: "Usuario no encontrado en la base de datos" });
      }
      const submissionData = insertAssignmentSubmissionSchema.parse({ ...req.body, userId });
      
      const submission = await storage.createAssignmentSubmission(submissionData);
      res.status(201).json(submission);
    } catch (error: any) {
      console.error("Error creating assignment submission:", error);
      res.status(400).json({ message: error.message || "Failed to create assignment submission" });
    }
  });

  app.put("/api/assignment-submissions/:id", isAuthenticated, isInstructor, async (req: any, res) => {
    try {
      const submission = await storage.getAssignmentSubmission(req.params.id);
      if (!submission) {
        return res.status(404).json({ message: "Submission not found" });
      }

      const updated = await storage.updateAssignmentSubmission(req.params.id, req.body);
      res.json(updated);
    } catch (error) {
      console.error("Error updating assignment submission:", error);
      res.status(500).json({ message: "Failed to update assignment submission" });
    }
  });

  // ============================================
  // FILE UPLOAD ROUTES (Local Filesystem)
  // ============================================

  // Configure multer for file uploads
  const videosDir = path.join(process.cwd(), "videos");
  
  // Ensure videos directory exists
  if (!fs.existsSync(videosDir)) {
    fs.mkdirSync(videosDir, { recursive: true });
  }

  const multerStorage = multer.diskStorage({
    destination: (req, file, cb) => {
      cb(null, videosDir);
    },
    filename: (req, file, cb) => {
      const uniqueSuffix = Date.now() + '-' + Math.round(Math.random() * 1E9);
      const ext = path.extname(file.originalname);
      cb(null, file.fieldname + '-' + uniqueSuffix + ext);
    }
  });

  const upload = multer({ 
    storage: multerStorage,
    limits: { fileSize: 500 * 1024 * 1024 } // 500MB max
  });

  // Upload file endpoint
  app.post("/api/upload/video", isAuthenticated, isInstructor, upload.single('video'), async (req: any, res) => {
    try {
      if (!req.file) {
        return res.status(400).json({ message: "No file uploaded" });
      }
      
      // Return the URL path to access the video
      const videoUrl = `/videos/${req.file.filename}`;
      res.json({ videoUrl });
    } catch (error) {
      console.error("Error uploading video:", error);
      res.status(500).json({ message: "Failed to upload video" });
    }
  });

  // Serve video files (with authentication)
  app.use('/videos', isAuthenticated, (req, res, next) => {
    const videoPath = path.join(videosDir, path.basename(req.path));
    
    if (!fs.existsSync(videoPath)) {
      return res.status(404).json({ message: "Video not found" });
    }
    
    res.sendFile(videoPath);
  });

  // Update lesson video URL after upload
  app.put("/api/lessons/:id/video", isAuthenticated, isInstructor, async (req: any, res) => {
    try {
      const userId = await getDatabaseUserId(req);
      if (!userId) {
        return res.status(401).json({ message: "Usuario no encontrado en la base de datos" });
      }
      const lesson = await storage.getLesson(req.params.id);
      
      if (!lesson) {
        return res.status(404).json({ message: "Lesson not found" });
      }

      const module = await storage.getModule(lesson.moduleId);
      if (!module) {
        return res.status(404).json({ message: "Module not found" });
      }

      const course = await storage.getCourse(module.courseId);
      if (!course || course.instructorId !== userId) {
        return res.status(403).json({ message: "Forbidden" });
      }

      const updated = await storage.updateLesson(req.params.id, { videoUrl: req.body.videoUrl });
      res.json(updated);
    } catch (error) {
      console.error("Error updating lesson video:", error);
      res.status(500).json({ message: "Failed to update lesson video" });
    }
  });

  // ============================================
  // REVIEW ROUTES
  // ============================================

  // Create a review (students only)
  app.post("/api/reviews", isAuthenticated, async (req: any, res) => {
    try {
      const userId = await getDatabaseUserId(req);
      if (!userId) {
        return res.status(401).json({ message: "Usuario no encontrado en la base de datos" });
      }

      const reviewData = insertReviewSchema.parse({ ...req.body, userId });
      
      // Check if user is enrolled in the course
      const enrollment = await storage.getEnrollmentByUserAndCourse(userId, reviewData.courseId);
      if (!enrollment) {
        return res.status(403).json({ message: "Debes estar inscrito en el curso para dejar una reseña" });
      }

      // Check if user already reviewed this course
      const existingReview = await storage.getReviewByUserAndCourse(userId, reviewData.courseId);
      if (existingReview) {
        return res.status(400).json({ message: "Ya has dejado una reseña para este curso" });
      }

      const review = await storage.createReview(reviewData);
      res.status(201).json(review);
    } catch (error: any) {
      console.error("Error creating review:", error);
      res.status(400).json({ message: error.message || "Failed to create review" });
    }
  });

  // Get reviews for a course
  app.get("/api/reviews/course/:id", async (req, res) => {
    try {
      const reviews = await storage.getReviewsByCourse(req.params.id);
      res.json(reviews);
    } catch (error) {
      console.error("Error fetching reviews:", error);
      res.status(500).json({ message: "Failed to fetch reviews" });
    }
  });

  // Get current user's review for a course
  app.get("/api/reviews/course/:id/me", isAuthenticated, async (req: any, res) => {
    try {
      const userId = await getDatabaseUserId(req);
      if (!userId) {
        return res.status(401).json({ message: "Usuario no encontrado en la base de datos" });
      }
      
      const review = await storage.getReviewByUserAndCourse(userId, req.params.id);
      // Return null if no review exists (not a 404 error)
      res.json(review || null);
    } catch (error) {
      console.error("Error fetching user review:", error);
      res.status(500).json({ message: "Failed to fetch review" });
    }
  });

  const httpServer = createServer(app);
  return httpServer;
}
