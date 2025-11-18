import { useParams } from "wouter";
import { useQuery, useMutation } from "@tanstack/react-query";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Progress } from "@/components/ui/progress";
import { Separator } from "@/components/ui/separator";
import { ScrollArea } from "@/components/ui/scroll-area";
import { Accordion, AccordionContent, AccordionItem, AccordionTrigger } from "@/components/ui/accordion";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { CheckCircle2, Circle, PlayCircle, FileText, ClipboardCheck, Clock, ArrowLeft } from "lucide-react";
import { useAuth } from "@/hooks/useAuth";
import { useEffect, useState } from "react";
import { useToast } from "@/hooks/use-toast";
import { apiRequest, queryClient } from "@/lib/queryClient";
import { isUnauthorizedError } from "@/lib/authUtils";
import { QuizTaker } from "@/components/quiz-taker";
import type { Course, Module, Lesson, Enrollment } from "@shared/schema";

interface ModuleWithLessons extends Module {
  lessons: Lesson[];
}

interface CourseWithModules extends Course {
  modules: ModuleWithLessons[];
}

export default function CourseView() {
  const { id } = useParams<{ id: string }>();
  const { isAuthenticated, isLoading: authLoading } = useAuth();
  const { toast } = useToast();
  const [selectedLesson, setSelectedLesson] = useState<Lesson | null>(null);

  const { data: course, isLoading } = useQuery<CourseWithModules>({
    queryKey: ["/api/courses", id],
    enabled: isAuthenticated && !!id,
  });

  const { data: enrollment } = useQuery<Enrollment>({
    queryKey: ["/api/enrollments/course", id],
    enabled: isAuthenticated && !!id,
  });

  const { data: lessonProgress } = useQuery<string[]>({
    queryKey: ["/api/lesson-progress/course", id],
    enabled: isAuthenticated && !!id,
  });

  const { data: lessonQuizzes } = useQuery<any[]>({
    queryKey: ["/api/quizzes/lesson", selectedLesson?.id],
    queryFn: async () => {
      if (!selectedLesson?.id) return [];
      const res = await fetch(`/api/quizzes/lesson/${selectedLesson.id}`, {
        credentials: "include",
      });
      if (!res.ok) return [];
      return res.json();
    },
    enabled: isAuthenticated && !!selectedLesson?.id,
  });

  const markCompleteMutation = useMutation({
    mutationFn: async (lessonId: string) => {
      return await apiRequest("POST", "/api/lesson-progress", { lessonId, completed: true });
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["/api/lesson-progress/course", id] });
      queryClient.invalidateQueries({ queryKey: ["/api/enrollments/course", id] });
      toast({
        title: "¡Lección completada!",
        description: "Tu progreso ha sido actualizado",
      });
    },
    onError: (error: Error) => {
      if (isUnauthorizedError(error)) {
        toast({
          title: "Unauthorized",
          description: "You are logged out. Logging in again...",
          variant: "destructive",
        });
        setTimeout(() => {
          window.location.href = "/api/login";
        }, 500);
        return;
      }
      toast({
        title: "Error",
        description: "No se pudo marcar la lección como completada",
        variant: "destructive",
      });
    },
  });

  useEffect(() => {
    if (!authLoading && !isAuthenticated) {
      toast({
        title: "Unauthorized",
        description: "You are logged out. Logging in again...",
        variant: "destructive",
      });
      setTimeout(() => {
        window.location.href = "/api/login";
      }, 500);
      return;
    }
  }, [isAuthenticated, authLoading, toast]);

  useEffect(() => {
    if (course && course.modules.length > 0 && course.modules[0].lessons.length > 0) {
      setSelectedLesson(course.modules[0].lessons[0]);
    }
  }, [course]);

  if (authLoading || isLoading) {
    return (
      <div className="flex items-center justify-center h-screen">
        <div className="space-y-4 text-center">
          <div className="h-12 w-12 mx-auto rounded-full border-4 border-primary border-t-transparent animate-spin" />
          <p className="text-muted-foreground">Cargando curso...</p>
        </div>
      </div>
    );
  }

  if (!course) {
    return (
      <Card className="p-12">
        <div className="text-center space-y-4">
          <h3 className="text-xl font-semibold">Curso no encontrado</h3>
          <Button onClick={() => window.location.href = "/courses"}>
            Volver a cursos
          </Button>
        </div>
      </Card>
    );
  }

  const isLessonComplete = (lessonId: string) => lessonProgress?.includes(lessonId) || false;

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center gap-4">
        <Button
          variant="ghost"
          size="icon"
          onClick={() => window.location.href = "/"}
          data-testid="button-back-to-dashboard"
        >
          <ArrowLeft className="h-4 w-4" />
        </Button>
        <div className="flex-1">
          <h1 className="text-2xl font-bold" data-testid="text-course-title">{course.title}</h1>
          <p className="text-muted-foreground">{course.description}</p>
        </div>
      </div>

      {/* Progress Bar */}
      {enrollment && (
        <Card>
          <CardContent className="pt-6">
            <div className="space-y-2">
              <div className="flex items-center justify-between text-sm">
                <span className="font-medium">Progreso del Curso</span>
                <span className="text-muted-foreground">{enrollment.progressPercentage}%</span>
              </div>
              <Progress value={enrollment.progressPercentage} />
            </div>
          </CardContent>
        </Card>
      )}

      {/* Main Content */}
      <div className="grid lg:grid-cols-3 gap-6">
        {/* Video Player and Content */}
        <div className="lg:col-span-2 space-y-6">
          {selectedLesson ? (
            <>
              {/* Video Player */}
              <Card>
                <CardContent className="p-0">
                  <div className="aspect-video rounded-t-lg bg-gradient-to-br from-primary/20 to-primary/5 flex items-center justify-center">
                    {selectedLesson.videoUrl ? (
                      <video
                        src={selectedLesson.videoUrl}
                        controls
                        className="w-full h-full rounded-t-lg"
                        data-testid="video-player"
                      />
                    ) : (
                      <div className="text-center space-y-4">
                        <PlayCircle className="h-16 w-16 text-primary mx-auto" />
                        <p className="text-muted-foreground">Video próximamente disponible</p>
                      </div>
                    )}
                  </div>
                  <div className="p-6 space-y-4">
                    <div className="flex items-start justify-between gap-4">
                      <div className="flex-1">
                        <h2 className="text-2xl font-bold mb-2" data-testid="text-lesson-title">
                          {selectedLesson.title}
                        </h2>
                        <p className="text-muted-foreground">{selectedLesson.description}</p>
                      </div>
                      {!isLessonComplete(selectedLesson.id) && (
                        <Button
                          onClick={() => markCompleteMutation.mutate(selectedLesson.id)}
                          disabled={markCompleteMutation.isPending}
                          data-testid="button-mark-complete"
                        >
                          {markCompleteMutation.isPending ? "Guardando..." : "Marcar como completada"}
                        </Button>
                      )}
                      {isLessonComplete(selectedLesson.id) && (
                        <div className="flex items-center gap-2 text-green-600">
                          <CheckCircle2 className="h-5 w-5" />
                          <span className="font-medium">Completada</span>
                        </div>
                      )}
                    </div>
                    {selectedLesson.duration && (
                      <div className="flex items-center gap-2 text-sm text-muted-foreground">
                        <Clock className="h-4 w-4" />
                        <span>{Math.floor(selectedLesson.duration / 60)} minutos</span>
                      </div>
                    )}
                  </div>
                </CardContent>
              </Card>

              {/* Quizzes Section */}
              {lessonQuizzes && lessonQuizzes.length > 0 && (
                <Card>
                  <CardHeader>
                    <div className="flex items-center gap-2">
                      <ClipboardCheck className="h-5 w-5 text-primary" />
                      <CardTitle>Evaluaciones</CardTitle>
                    </div>
                    <CardDescription>
                      Completa los quizzes para evaluar tu conocimiento
                    </CardDescription>
                  </CardHeader>
                  <CardContent>
                    <Tabs defaultValue={lessonQuizzes[0]?.id} className="w-full">
                      <TabsList className="grid w-full" style={{ gridTemplateColumns: `repeat(${lessonQuizzes.length}, 1fr)` }}>
                        {lessonQuizzes.map((quiz: any, index: number) => (
                          <TabsTrigger key={quiz.id} value={quiz.id} data-testid={`tab-quiz-${index}`}>
                            {quiz.title}
                          </TabsTrigger>
                        ))}
                      </TabsList>
                      {lessonQuizzes.map((quiz: any) => (
                        <TabsContent key={quiz.id} value={quiz.id} className="mt-6">
                          <QuizTaker quizId={quiz.id} />
                        </TabsContent>
                      ))}
                    </Tabs>
                  </CardContent>
                </Card>
              )}
            </>
          ) : (
            <Card className="p-12">
              <div className="text-center space-y-4">
                <PlayCircle className="h-16 w-16 text-muted-foreground mx-auto" />
                <p className="text-muted-foreground">Selecciona una lección para comenzar</p>
              </div>
            </Card>
          )}
        </div>

        {/* Lesson Sidebar */}
        <div>
          <Card>
            <CardHeader>
              <CardTitle>Contenido del Curso</CardTitle>
              <CardDescription>
                {course.modules.length} módulos • {course.modules.reduce((acc, m) => acc + m.lessons.length, 0)} lecciones
              </CardDescription>
            </CardHeader>
            <CardContent className="p-0">
              <ScrollArea className="h-[600px]">
                <Accordion type="multiple" className="w-full" defaultValue={course.modules.map(m => m.id)}>
                  {course.modules.map((module) => (
                    <AccordionItem key={module.id} value={module.id} className="border-b-0 px-6">
                      <AccordionTrigger className="hover:no-underline">
                        <div className="flex items-center gap-3 text-left">
                          <FileText className="h-4 w-4 text-muted-foreground" />
                          <span className="font-medium">{module.title}</span>
                        </div>
                      </AccordionTrigger>
                      <AccordionContent>
                        <div className="space-y-1 pl-7 pt-2">
                          {module.lessons.map((lesson) => (
                            <button
                              key={lesson.id}
                              onClick={() => setSelectedLesson(lesson)}
                              className={`w-full flex items-center gap-3 p-3 rounded-md text-left hover-elevate ${
                                selectedLesson?.id === lesson.id ? "bg-muted" : ""
                              }`}
                              data-testid={`button-lesson-${lesson.id}`}
                            >
                              {isLessonComplete(lesson.id) ? (
                                <CheckCircle2 className="h-4 w-4 text-green-600 flex-shrink-0" />
                              ) : (
                                <Circle className="h-4 w-4 text-muted-foreground flex-shrink-0" />
                              )}
                              <div className="flex-1 min-w-0">
                                <p className="text-sm font-medium truncate">{lesson.title}</p>
                                {lesson.duration && (
                                  <p className="text-xs text-muted-foreground">
                                    {Math.floor(lesson.duration / 60)} min
                                  </p>
                                )}
                              </div>
                            </button>
                          ))}
                        </div>
                      </AccordionContent>
                    </AccordionItem>
                  ))}
                </Accordion>
              </ScrollArea>
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  );
}
