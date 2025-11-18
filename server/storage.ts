import {
  users,
  courses,
  modules,
  lessons,
  enrollments,
  lessonProgress,
  quizzes,
  quizQuestions,
  quizAttempts,
  assignments,
  assignmentSubmissions,
  reviews,
  type User,
  type UpsertUser,
  type Course,
  type InsertCourse,
  type Module,
  type InsertModule,
  type Lesson,
  type InsertLesson,
  type Enrollment,
  type InsertEnrollment,
  type LessonProgress,
  type InsertLessonProgress,
  type Quiz,
  type InsertQuiz,
  type QuizQuestion,
  type InsertQuizQuestion,
  type QuizAttempt,
  type InsertQuizAttempt,
  type Assignment,
  type InsertAssignment,
  type AssignmentSubmission,
  type InsertAssignmentSubmission,
  type Review,
  type InsertReview,
} from "@shared/schema";
import { db } from "./db";
import { eq, and, desc, sql, inArray } from "drizzle-orm";

export interface IStorage {
  // User operations (required for Replit Auth)
  getUser(id: string): Promise<User | undefined>;
  upsertUser(user: UpsertUser): Promise<User>;

  // Course operations
  getCourse(id: string): Promise<Course | undefined>;
  getCourses(): Promise<Course[]>;
  getCoursesByInstructor(instructorId: string): Promise<Course[]>;
  createCourse(course: InsertCourse): Promise<Course>;
  updateCourse(id: string, course: Partial<InsertCourse>): Promise<Course | undefined>;
  deleteCourse(id: string): Promise<void>;

  // Module operations
  getModule(id: string): Promise<Module | undefined>;
  getModulesByCourse(courseId: string): Promise<Module[]>;
  createModule(module: InsertModule): Promise<Module>;
  updateModule(id: string, module: Partial<InsertModule>): Promise<Module | undefined>;
  deleteModule(id: string): Promise<void>;

  // Lesson operations
  getLesson(id: string): Promise<Lesson | undefined>;
  getLessonsByIds(ids: string[]): Promise<Lesson[]>;
  getLessonsByModule(moduleId: string): Promise<Lesson[]>;
  createLesson(lesson: InsertLesson): Promise<Lesson>;
  updateLesson(id: string, lesson: Partial<InsertLesson>): Promise<Lesson | undefined>;
  deleteLesson(id: string): Promise<void>;

  // Enrollment operations
  getEnrollment(id: string): Promise<Enrollment | undefined>;
  getEnrollmentByUserAndCourse(userId: string, courseId: string): Promise<Enrollment | undefined>;
  getEnrollmentsByUser(userId: string): Promise<Enrollment[]>;
  getEnrollmentsByCourse(courseId: string): Promise<Enrollment[]>;
  createEnrollment(enrollment: InsertEnrollment): Promise<Enrollment>;
  updateEnrollment(id: string, enrollment: Partial<InsertEnrollment>): Promise<Enrollment | undefined>;
  recalculateEnrollmentProgress(courseId: string): Promise<void>;

  // Lesson Progress operations
  getLessonProgress(userId: string, lessonId: string): Promise<LessonProgress | undefined>;
  getLessonProgressByUser(userId: string): Promise<LessonProgress[]>;
  getCompletedLessonsByCourses(userId: string, courseIds: string[]): Promise<Lesson[]>;
  upsertLessonProgress(progress: InsertLessonProgress): Promise<LessonProgress>;

  // Quiz operations
  getQuiz(id: string): Promise<Quiz | undefined>;
  getQuizzesByLesson(lessonId: string): Promise<Quiz[]>;
  createQuiz(quiz: InsertQuiz): Promise<Quiz>;
  
  // Quiz Question operations
  getQuizQuestions(quizId: string): Promise<QuizQuestion[]>;
  createQuizQuestion(question: InsertQuizQuestion): Promise<QuizQuestion>;

  // Quiz Attempt operations
  getQuizAttempt(id: string): Promise<QuizAttempt | undefined>;
  getQuizAttemptsByUser(userId: string, quizId: string): Promise<QuizAttempt[]>;
  createQuizAttempt(attempt: InsertQuizAttempt): Promise<QuizAttempt>;

  // Assignment operations
  getAssignment(id: string): Promise<Assignment | undefined>;
  getAssignmentsByLesson(lessonId: string): Promise<Assignment[]>;
  createAssignment(assignment: InsertAssignment): Promise<Assignment>;

  // Assignment Submission operations
  getAssignmentSubmission(id: string): Promise<AssignmentSubmission | undefined>;
  getSubmissionByUserAndAssignment(userId: string, assignmentId: string): Promise<AssignmentSubmission | undefined>;
  getSubmissionsByAssignment(assignmentId: string): Promise<AssignmentSubmission[]>;
  createAssignmentSubmission(submission: InsertAssignmentSubmission): Promise<AssignmentSubmission>;
  updateAssignmentSubmission(id: string, submission: Partial<InsertAssignmentSubmission>): Promise<AssignmentSubmission | undefined>;

  // Review operations
  createReview(review: InsertReview): Promise<Review>;
  getReviewsByCourse(courseId: string): Promise<Review[]>;
  getReviewByUserAndCourse(userId: string, courseId: string): Promise<Review | undefined>;
  getInstructorReviewStats(instructorId: string): Promise<{ averageRating: number | null; totalReviews: number }>;
}

export class DatabaseStorage implements IStorage {
  // ============================================
  // USER OPERATIONS (Required for Replit Auth)
  // ============================================

  async getUser(id: string): Promise<User | undefined> {
    const [user] = await db.select().from(users).where(eq(users.id, id));
    return user || undefined;
  }

  async upsertUser(userData: UpsertUser): Promise<User> {
    // Primero buscar si existe un usuario con este email
    const [existingUser] = await db
      .select()
      .from(users)
      .where(eq(users.email, userData.email as string));

    if (existingUser) {
      // Si existe, actualizar sus datos (excepto el ID)
      const [updatedUser] = await db
        .update(users)
        .set({
          firstName: userData.firstName,
          lastName: userData.lastName,
          role: userData.role,
          updatedAt: new Date(),
        })
        .where(eq(users.id, existingUser.id))
        .returning();
      return updatedUser;
    }

    // Si no existe, crear uno nuevo con el ID de Keycloak
    const [newUser] = await db
      .insert(users)
      .values(userData)
      .returning();
    return newUser;
  }

  // ============================================
  // COURSE OPERATIONS
  // ============================================

  async getCourse(id: string): Promise<Course | undefined> {
    const [course] = await db.select().from(courses).where(eq(courses.id, id));
    return course || undefined;
  }

  async getCourses(): Promise<Course[]> {
    return await db.select().from(courses).orderBy(desc(courses.createdAt));
  }

  async getCoursesByInstructor(instructorId: string): Promise<Course[]> {
    return await db.select().from(courses).where(eq(courses.instructorId, instructorId)).orderBy(desc(courses.createdAt));
  }

  async createCourse(courseData: InsertCourse): Promise<Course> {
    const [course] = await db.insert(courses).values(courseData).returning();
    return course;
  }

  async updateCourse(id: string, courseData: Partial<InsertCourse>): Promise<Course | undefined> {
    const [course] = await db
      .update(courses)
      .set({ ...courseData, updatedAt: new Date() })
      .where(eq(courses.id, id))
      .returning();
    return course || undefined;
  }

  async deleteCourse(id: string): Promise<void> {
    await db.delete(courses).where(eq(courses.id, id));
  }

  // ============================================
  // MODULE OPERATIONS
  // ============================================

  async getModule(id: string): Promise<Module | undefined> {
    const [module] = await db.select().from(modules).where(eq(modules.id, id));
    return module || undefined;
  }

  async getModulesByCourse(courseId: string): Promise<Module[]> {
    return await db.select().from(modules).where(eq(modules.courseId, courseId)).orderBy(modules.order);
  }

  async createModule(moduleData: InsertModule): Promise<Module> {
    const [module] = await db.insert(modules).values(moduleData).returning();
    return module;
  }

  async updateModule(id: string, moduleData: Partial<InsertModule>): Promise<Module | undefined> {
    const [module] = await db
      .update(modules)
      .set(moduleData)
      .where(eq(modules.id, id))
      .returning();
    return module || undefined;
  }

  async deleteModule(id: string): Promise<void> {
    await db.delete(modules).where(eq(modules.id, id));
  }

  // ============================================
  // LESSON OPERATIONS
  // ============================================

  async getLesson(id: string): Promise<Lesson | undefined> {
    const [lesson] = await db.select().from(lessons).where(eq(lessons.id, id));
    return lesson || undefined;
  }

  async getLessonsByIds(ids: string[]): Promise<Lesson[]> {
    if (ids.length === 0) return [];
    return await db.select().from(lessons).where(inArray(lessons.id, ids));
  }

  async getLessonsByModule(moduleId: string): Promise<Lesson[]> {
    return await db.select().from(lessons).where(eq(lessons.moduleId, moduleId)).orderBy(lessons.order);
  }

  async createLesson(lessonData: InsertLesson): Promise<Lesson> {
    const [lesson] = await db.insert(lessons).values(lessonData).returning();
    return lesson;
  }

  async updateLesson(id: string, lessonData: Partial<InsertLesson>): Promise<Lesson | undefined> {
    const [lesson] = await db
      .update(lessons)
      .set(lessonData)
      .where(eq(lessons.id, id))
      .returning();
    return lesson || undefined;
  }

  async deleteLesson(id: string): Promise<void> {
    await db.delete(lessons).where(eq(lessons.id, id));
  }

  // ============================================
  // ENROLLMENT OPERATIONS
  // ============================================

  async getEnrollment(id: string): Promise<Enrollment | undefined> {
    const [enrollment] = await db.select().from(enrollments).where(eq(enrollments.id, id));
    return enrollment || undefined;
  }

  async getEnrollmentByUserAndCourse(userId: string, courseId: string): Promise<Enrollment | undefined> {
    const [enrollment] = await db.select().from(enrollments).where(
      and(eq(enrollments.userId, userId), eq(enrollments.courseId, courseId))
    );
    return enrollment || undefined;
  }

  async getEnrollmentsByUser(userId: string): Promise<Enrollment[]> {
    return await db.select().from(enrollments).where(eq(enrollments.userId, userId)).orderBy(desc(enrollments.enrolledAt));
  }

  async getEnrollmentsByCourse(courseId: string): Promise<Enrollment[]> {
    return await db.select().from(enrollments).where(eq(enrollments.courseId, courseId)).orderBy(desc(enrollments.enrolledAt));
  }

  async createEnrollment(enrollmentData: InsertEnrollment): Promise<Enrollment> {
    const [enrollment] = await db.insert(enrollments).values(enrollmentData).returning();
    return enrollment;
  }

  async updateEnrollment(id: string, enrollmentData: Partial<InsertEnrollment>): Promise<Enrollment | undefined> {
    const [enrollment] = await db
      .update(enrollments)
      .set(enrollmentData)
      .where(eq(enrollments.id, id))
      .returning();
    return enrollment || undefined;
  }

  async recalculateEnrollmentProgress(courseId: string): Promise<void> {
    // Get all enrollments for this course
    const courseEnrollments = await this.getEnrollmentsByCourse(courseId);
    
    // Get all lessons for this course
    const courseModules = await this.getModulesByCourse(courseId);
    const allCourseLessons: Lesson[] = [];
    for (const module of courseModules) {
      const moduleLessons = await this.getLessonsByModule(module.id);
      allCourseLessons.push(...moduleLessons);
    }
    
    const totalLessons = allCourseLessons.length;
    
    // For each enrollment, recalculate progress
    for (const enrollment of courseEnrollments) {
      const userProgress = await this.getLessonProgressByUser(enrollment.userId);
      const completedInCourse = userProgress.filter(p => 
        p.completed && allCourseLessons.some(l => l.id === p.lessonId)
      );
      
      const progressPercentage = totalLessons > 0 
        ? Math.round((completedInCourse.length / totalLessons) * 100) 
        : 0;
      
      await this.updateEnrollment(enrollment.id, { progressPercentage });
    }
  }

  // ============================================
  // LESSON PROGRESS OPERATIONS
  // ============================================

  async getLessonProgress(userId: string, lessonId: string): Promise<LessonProgress | undefined> {
    const [progress] = await db.select().from(lessonProgress).where(
      and(eq(lessonProgress.userId, userId), eq(lessonProgress.lessonId, lessonId))
    );
    return progress || undefined;
  }

  async getLessonProgressByUser(userId: string): Promise<LessonProgress[]> {
    return await db.select().from(lessonProgress).where(eq(lessonProgress.userId, userId));
  }

  async getCompletedLessonsByCourses(userId: string, courseIds: string[]): Promise<Lesson[]> {
    if (courseIds.length === 0) return [];
    
    const completedLessons = await db
      .select({
        id: lessons.id,
        moduleId: lessons.moduleId,
        title: lessons.title,
        description: lessons.description,
        videoUrl: lessons.videoUrl,
        duration: lessons.duration,
        order: lessons.order,
        createdAt: lessons.createdAt,
      })
      .from(lessonProgress)
      .innerJoin(lessons, eq(lessonProgress.lessonId, lessons.id))
      .innerJoin(modules, eq(lessons.moduleId, modules.id))
      .innerJoin(courses, eq(modules.courseId, courses.id))
      .where(
        and(
          eq(lessonProgress.userId, userId),
          eq(lessonProgress.completed, true),
          inArray(courses.id, courseIds)
        )
      );
    
    return completedLessons;
  }

  async upsertLessonProgress(progressData: InsertLessonProgress): Promise<LessonProgress> {
    const existing = await this.getLessonProgress(progressData.userId, progressData.lessonId);
    
    if (existing) {
      const [updated] = await db
        .update(lessonProgress)
        .set({ ...progressData, completedAt: progressData.completed ? new Date() : null })
        .where(eq(lessonProgress.id, existing.id))
        .returning();
      return updated;
    } else {
      const [created] = await db
        .insert(lessonProgress)
        .values({ ...progressData, completedAt: progressData.completed ? new Date() : null })
        .returning();
      return created;
    }
  }

  // ============================================
  // QUIZ OPERATIONS
  // ============================================

  async getQuiz(id: string): Promise<Quiz | undefined> {
    const [quiz] = await db.select().from(quizzes).where(eq(quizzes.id, id));
    return quiz || undefined;
  }

  async getQuizzesByLesson(lessonId: string): Promise<Quiz[]> {
    return await db.select().from(quizzes).where(eq(quizzes.lessonId, lessonId));
  }

  async createQuiz(quizData: InsertQuiz): Promise<Quiz> {
    const [quiz] = await db.insert(quizzes).values(quizData).returning();
    return quiz;
  }

  // ============================================
  // QUIZ QUESTION OPERATIONS
  // ============================================

  async getQuizQuestions(quizId: string): Promise<QuizQuestion[]> {
    return await db.select().from(quizQuestions).where(eq(quizQuestions.quizId, quizId)).orderBy(quizQuestions.order);
  }

  async createQuizQuestion(questionData: InsertQuizQuestion): Promise<QuizQuestion> {
    const [question] = await db.insert(quizQuestions).values(questionData).returning();
    return question;
  }

  // ============================================
  // QUIZ ATTEMPT OPERATIONS
  // ============================================

  async getQuizAttempt(id: string): Promise<QuizAttempt | undefined> {
    const [attempt] = await db.select().from(quizAttempts).where(eq(quizAttempts.id, id));
    return attempt || undefined;
  }

  async getQuizAttemptsByUser(userId: string, quizId: string): Promise<QuizAttempt[]> {
    return await db.select().from(quizAttempts).where(
      and(eq(quizAttempts.userId, userId), eq(quizAttempts.quizId, quizId))
    ).orderBy(desc(quizAttempts.completedAt));
  }

  async createQuizAttempt(attemptData: InsertQuizAttempt): Promise<QuizAttempt> {
    const [attempt] = await db.insert(quizAttempts).values(attemptData).returning();
    return attempt;
  }

  // ============================================
  // ASSIGNMENT OPERATIONS
  // ============================================

  async getAssignment(id: string): Promise<Assignment | undefined> {
    const [assignment] = await db.select().from(assignments).where(eq(assignments.id, id));
    return assignment || undefined;
  }

  async getAssignmentsByLesson(lessonId: string): Promise<Assignment[]> {
    return await db.select().from(assignments).where(eq(assignments.lessonId, lessonId));
  }

  async createAssignment(assignmentData: InsertAssignment): Promise<Assignment> {
    const [assignment] = await db.insert(assignments).values(assignmentData).returning();
    return assignment;
  }

  // ============================================
  // ASSIGNMENT SUBMISSION OPERATIONS
  // ============================================

  async getAssignmentSubmission(id: string): Promise<AssignmentSubmission | undefined> {
    const [submission] = await db.select().from(assignmentSubmissions).where(eq(assignmentSubmissions.id, id));
    return submission || undefined;
  }

  async getSubmissionByUserAndAssignment(userId: string, assignmentId: string): Promise<AssignmentSubmission | undefined> {
    const [submission] = await db.select().from(assignmentSubmissions).where(
      and(eq(assignmentSubmissions.userId, userId), eq(assignmentSubmissions.assignmentId, assignmentId))
    );
    return submission || undefined;
  }

  async getSubmissionsByAssignment(assignmentId: string): Promise<AssignmentSubmission[]> {
    return await db.select().from(assignmentSubmissions).where(eq(assignmentSubmissions.assignmentId, assignmentId)).orderBy(desc(assignmentSubmissions.submittedAt));
  }

  async createAssignmentSubmission(submissionData: InsertAssignmentSubmission): Promise<AssignmentSubmission> {
    const [submission] = await db.insert(assignmentSubmissions).values(submissionData).returning();
    return submission;
  }

  async updateAssignmentSubmission(id: string, submissionData: Partial<InsertAssignmentSubmission>): Promise<AssignmentSubmission | undefined> {
    const [submission] = await db
      .update(assignmentSubmissions)
      .set({ ...submissionData, gradedAt: submissionData.grade !== undefined ? new Date() : undefined })
      .where(eq(assignmentSubmissions.id, id))
      .returning();
    return submission || undefined;
  }

  // ============================================
  // REVIEW OPERATIONS
  // ============================================

  async createReview(reviewData: InsertReview): Promise<Review> {
    const [review] = await db.insert(reviews).values(reviewData).returning();
    return review;
  }

  async getReviewsByCourse(courseId: string): Promise<Review[]> {
    return await db.select().from(reviews).where(eq(reviews.courseId, courseId)).orderBy(desc(reviews.createdAt));
  }

  async getReviewByUserAndCourse(userId: string, courseId: string): Promise<Review | undefined> {
    const [review] = await db.select().from(reviews).where(
      and(eq(reviews.userId, userId), eq(reviews.courseId, courseId))
    );
    return review || undefined;
  }

  async getInstructorReviewStats(instructorId: string): Promise<{ averageRating: number | null; totalReviews: number }> {
    const result = await db
      .select({
        averageRating: sql<number>`AVG(${reviews.rating})::float`,
        totalReviews: sql<number>`COUNT(${reviews.id})::int`,
      })
      .from(reviews)
      .innerJoin(courses, eq(reviews.courseId, courses.id))
      .where(eq(courses.instructorId, instructorId));
    
    const stats = result[0];
    
    // Guard against undefined stats or null averageRating
    if (!stats || stats.averageRating === null) {
      return {
        averageRating: null,
        totalReviews: 0,
      };
    }
    
    return {
      averageRating: parseFloat(stats.averageRating.toFixed(1)),
      totalReviews: stats.totalReviews || 0,
    };
  }
}

export const storage = new DatabaseStorage();
