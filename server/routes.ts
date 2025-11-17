import type { Express } from "express";
import { createServer, type Server } from "http";
import { storage } from "./storage";
import { keycloak, isAuthenticated, isInstructor, getCurrentUser } from "./keycloakAuth";
import { insertCourseSchema, insertModuleSchema, insertLessonSchema, insertEnrollmentSchema, insertLessonProgressSchema, insertQuizSchema, insertQuizQuestionSchema, insertQuizAttemptSchema, insertAssignmentSchema, insertAssignmentSubmissionSchema } from "@shared/schema";
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

  // Login route - initiate Keycloak authentication
  app.get('/api/auth/login', (req, res, next) => {
    // Si el usuario ya está autenticado, redirigir al home
    if ((req as any).kauth?.grant) {
      return res.redirect('/');
    }
    
    // Construir URL de autenticación de Keycloak
    const keycloakLoginUrl = `https://keycloak.vimcashcorp.com/realms/nova-learn/protocol/openid-connect/auth?client_id=nova-backend&redirect_uri=${encodeURIComponent(req.protocol + '://' + req.get('host') + '/api/auth/callback')}&response_type=code&scope=openid`;
    
    res.redirect(keycloakLoginUrl);
  });

  // Callback route after Keycloak authentication
  app.get('/api/auth/callback', keycloak.protect(), (req, res) => {
    // Usuario autenticado exitosamente, redirigir al home
    res.redirect('/');
  });

  // Logout route
  app.get('/api/auth/logout', (req, res) => {
    req.session?.destroy((err) => {
      if (err) {
        console.error('Session destruction error:', err);
      }
    });
    const logoutUrl = `https://keycloak.vimcashcorp.com/realms/nova-learn/protocol/openid-connect/logout`;
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
      const userId = getCurrentUser(req)?.id;
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
      const userId = getCurrentUser(req)?.id;
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
      const userId = getCurrentUser(req)?.id;
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

  // Get instructor's courses
  app.get("/api/instructor/courses", isAuthenticated, isInstructor, async (req: any, res) => {
    try {
      const userId = getCurrentUser(req)?.id;
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
      const userId = getCurrentUser(req)?.id;
      const instructorCourses = await storage.getCoursesByInstructor(userId);
      
      const totalStudents = new Set();
      for (const course of instructorCourses) {
        const enrolls = await storage.getEnrollmentsByCourse(course.id);
        enrolls.forEach(e => totalStudents.add(e.userId));
      }

      const completedEnrollments = [];
      for (const course of instructorCourses) {
        const enrolls = await storage.getEnrollmentsByCourse(course.id);
        completedEnrollments.push(...enrolls.filter(e => e.completedAt));
      }

      const totalEnrollments = await Promise.all(
        instructorCourses.map(c => storage.getEnrollmentsByCourse(c.id))
      );
      const totalCount = totalEnrollments.flat().length;

      res.json({
        totalStudents: totalStudents.size,
        averageRating: null,
        totalReviews: 0,
        completionRate: totalCount > 0 ? Math.round((completedEnrollments.length / totalCount) * 100) : 0,
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
      const userId = getCurrentUser(req)?.id;
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
      const userId = getCurrentUser(req)?.id;
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
      const userId = getCurrentUser(req)?.id;
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
      const userId = getCurrentUser(req)?.id;
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
      const userId = getCurrentUser(req)?.id;
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
      const userId = getCurrentUser(req)?.id;
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
      const userId = getCurrentUser(req)?.id;
      const userEnrollments = await storage.getEnrollmentsByUser(userId);
      
      const totalProgress = userEnrollments.reduce((sum, e) => sum + e.progressPercentage, 0);
      const averageProgress = userEnrollments.length > 0 ? Math.round(totalProgress / userEnrollments.length) : 0;

      res.json({
        totalHours: 0,
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
      const userId = getCurrentUser(req)?.id;
      const courseModules = await storage.getModulesByCourse(req.params.courseId);
      
      const allLessons = [];
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
      const userId = getCurrentUser(req)?.id;
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
            let totalLessons = 0;
            for (const mod of courseModules) {
              const modLessons = await storage.getLessonsByModule(mod.id);
              totalLessons += modLessons.length;
            }

            const userProgress = await storage.getLessonProgressByUser(userId);
            const completedInCourse = userProgress.filter(p => {
              const lessonIds = [];
              for (const mod of courseModules) {
                storage.getLessonsByModule(mod.id).then(lessons => lessonIds.push(...lessons.map(l => l.id)));
              }
              return p.completed && lessonIds.includes(p.lessonId);
            });

            const progressPercentage = totalLessons > 0 ? Math.round((completedInCourse.length / totalLessons) * 100) : 0;
            await storage.updateEnrollment(enrollment.id, { progressPercentage });
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
      const userId = getCurrentUser(req)?.id;
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
      const userId = getCurrentUser(req)?.id;
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

  app.get("/api/quizzes/:id/questions", isAuthenticated, async (req, res) => {
    try {
      const questions = await storage.getQuizQuestions(req.params.id);
      res.json(questions);
    } catch (error) {
      console.error("Error fetching quiz questions:", error);
      res.status(500).json({ message: "Failed to fetch quiz questions" });
    }
  });

  app.post("/api/quiz-attempts", isAuthenticated, async (req: any, res) => {
    try {
      const userId = getCurrentUser(req)?.id;
      const attemptData = insertQuizAttemptSchema.parse({ ...req.body, userId });
      
      const attempt = await storage.createQuizAttempt(attemptData);
      res.status(201).json(attempt);
    } catch (error: any) {
      console.error("Error creating quiz attempt:", error);
      res.status(400).json({ message: error.message || "Failed to create quiz attempt" });
    }
  });

  // ============================================
  // ASSIGNMENT ROUTES
  // ============================================

  app.post("/api/assignments", isAuthenticated, isInstructor, async (req: any, res) => {
    try {
      const userId = getCurrentUser(req)?.id;
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

  app.post("/api/assignment-submissions", isAuthenticated, async (req: any, res) => {
    try {
      const userId = getCurrentUser(req)?.id;
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
      const userId = getCurrentUser(req)?.id;
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

  const httpServer = createServer(app);
  return httpServer;
}
