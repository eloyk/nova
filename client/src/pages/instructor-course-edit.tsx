import { useState } from "react";
import { useParams } from "wouter";
import { useQuery, useMutation } from "@tanstack/react-query";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle, DialogTrigger, DialogFooter } from "@/components/ui/dialog";
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage, FormDescription } from "@/components/ui/form";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Badge } from "@/components/ui/badge";
import { ScrollArea } from "@/components/ui/scroll-area";
import { Separator } from "@/components/ui/separator";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { useAuth } from "@/hooks/useAuth";
import { useToast } from "@/hooks/use-toast";
import { apiRequest, queryClient } from "@/lib/queryClient";
import { isUnauthorizedError } from "@/lib/authUtils";
import { ObjectUploader } from "@/components/ObjectUploader";
import { QuizCreatorDialog } from "@/components/quiz-creator-dialog";
import { 
  ArrowLeft, Plus, Edit2, Trash2, Video, FileText, ClipboardCheck, 
  Eye, EyeOff, Save, Upload, BookOpen, List, CheckCircle2
} from "lucide-react";
import { 
  insertModuleSchema, insertLessonSchema, insertQuizSchema, 
  insertQuizQuestionSchema, insertAssignmentSchema,
  type Course, type Module, type Lesson, type Quiz, type QuizQuestion, type Assignment
} from "@shared/schema";
import { z } from "zod";

interface ModuleWithLessons extends Module {
  lessons: Lesson[];
}

interface CourseWithModules extends Course {
  modules: ModuleWithLessons[];
}

export default function InstructorCourseEdit() {
  const { id } = useParams<{ id: string }>();
  const { user, isAuthenticated, isLoading: authLoading } = useAuth();
  const { toast } = useToast();
  const [activeTab, setActiveTab] = useState("overview");
  const [isModuleDialogOpen, setIsModuleDialogOpen] = useState(false);
  const [isLessonDialogOpen, setIsLessonDialogOpen] = useState(false);
  const [isQuizDialogOpen, setIsQuizDialogOpen] = useState(false);
  const [selectedModule, setSelectedModule] = useState<Module | null>(null);
  const [selectedLesson, setSelectedLesson] = useState<Lesson | null>(null);
  const [selectedLessonForQuiz, setSelectedLessonForQuiz] = useState<{ id: string; title: string } | null>(null);
  const [uploadingVideo, setUploadingVideo] = useState(false);
  const [videoUrl, setVideoUrl] = useState("");

  const { data: course, isLoading } = useQuery<CourseWithModules>({
    queryKey: ["/api/courses", id],
    enabled: isAuthenticated && !!id,
  });

  const { data: quizzes } = useQuery<any[]>({
    queryKey: ["/api/courses", id, "quizzes"],
    queryFn: async () => {
      const res = await fetch(`/api/courses/${id}/quizzes`, {
        credentials: "include",
      });
      if (!res.ok) throw new Error("Failed to fetch quizzes");
      return res.json();
    },
    enabled: isAuthenticated && !!id,
  });

  const { data: assignments } = useQuery<Assignment[]>({
    queryKey: ["/api/courses", id, "assignments"],
    enabled: isAuthenticated && !!id,
  });

  // Module form
  const moduleForm = useForm({
    resolver: zodResolver(insertModuleSchema.omit({ courseId: true })),
    defaultValues: {
      title: "",
      description: "",
      order: 0,
    },
  });

  // Lesson form
  const lessonForm = useForm({
    resolver: zodResolver(insertLessonSchema.omit({ moduleId: true })),
    defaultValues: {
      title: "",
      description: "",
      videoUrl: "",
      duration: 0,
      order: 0,
    },
  });

  // Module mutations
  const createModuleMutation = useMutation({
    mutationFn: async (data: any) => {
      return await apiRequest("POST", "/api/modules", { ...data, courseId: id });
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["/api/courses", id] });
      toast({ title: "¡Módulo creado!", description: "El módulo se ha creado exitosamente" });
      setIsModuleDialogOpen(false);
      moduleForm.reset();
    },
    onError: (error: Error) => {
      toast({ title: "Error", description: "No se pudo crear el módulo", variant: "destructive" });
    },
  });

  // Lesson mutations
  const createLessonMutation = useMutation({
    mutationFn: async (data: any) => {
      return await apiRequest("POST", "/api/lessons", { ...data, moduleId: selectedModule?.id });
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["/api/courses", id] });
      toast({ title: "¡Lección creada!", description: "La lección se ha creado exitosamente" });
      setIsLessonDialogOpen(false);
      lessonForm.reset();
      setVideoUrl("");
    },
    onError: (error: Error) => {
      toast({ title: "Error", description: "No se pudo crear la lección", variant: "destructive" });
    },
  });

  const updateLessonVideoMutation = useMutation({
    mutationFn: async ({ lessonId, videoUrl }: { lessonId: string; videoUrl: string }) => {
      return await apiRequest("PUT", `/api/lessons/${lessonId}/video`, { videoUrl });
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["/api/courses", id] });
      toast({ title: "¡Video actualizado!", description: "El video se ha subido exitosamente" });
      setUploadingVideo(false);
    },
    onError: (error: Error) => {
      toast({ title: "Error", description: "No se pudo actualizar el video", variant: "destructive" });
      setUploadingVideo(false);
    },
  });

  // Toggle course status
  const toggleStatusMutation = useMutation({
    mutationFn: async () => {
      const newStatus = course?.status === "published" ? "draft" : "published";
      return await apiRequest("PUT", `/api/courses/${id}`, { status: newStatus });
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["/api/courses", id] });
      toast({ 
        title: course?.status === "published" ? "Curso despublicado" : "¡Curso publicado!",
        description: course?.status === "published" 
          ? "El curso ahora está en borrador" 
          : "El curso ahora está disponible para estudiantes"
      });
    },
    onError: (error: Error) => {
      toast({ title: "Error", description: "No se pudo cambiar el estado del curso", variant: "destructive" });
    },
  });

  const onModuleSubmit = (data: any) => {
    createModuleMutation.mutate(data);
  };

  const onLessonSubmit = (data: any) => {
    createLessonMutation.mutate({ ...data, videoUrl });
  };

  const handleVideoUpload = (url: string) => {
    setVideoUrl(url);
    toast({ title: "Video cargado", description: "El video está listo para ser guardado" });
  };

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
      <div className="flex items-center justify-center h-screen">
        <Card>
          <CardContent className="pt-6">
            <p className="text-muted-foreground">Curso no encontrado</p>
          </CardContent>
        </Card>
      </div>
    );
  }

  const totalLessons = course.modules.reduce((acc, module) => acc + module.lessons.length, 0);

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
        <div className="flex items-center gap-4">
          <Button
            variant="ghost"
            size="icon"
            onClick={() => window.location.href = "/instructor"}
            data-testid="button-back"
          >
            <ArrowLeft className="h-5 w-5" />
          </Button>
          <div className="space-y-1">
            <h1 className="text-3xl font-bold" data-testid="text-course-title">
              {course.title}
            </h1>
            <div className="flex items-center gap-2">
              <Badge variant={course.status === "published" ? "default" : "secondary"} data-testid="badge-status">
                {course.status === "published" ? "Publicado" : "Borrador"}
              </Badge>
              <span className="text-sm text-muted-foreground">
                {course.modules.length} módulos • {totalLessons} lecciones
              </span>
            </div>
          </div>
        </div>
        <Button
          onClick={() => toggleStatusMutation.mutate()}
          variant={course.status === "published" ? "outline" : "default"}
          data-testid="button-toggle-status"
        >
          {course.status === "published" ? (
            <><EyeOff className="h-4 w-4 mr-2" />Despublicar</>
          ) : (
            <><Eye className="h-4 w-4 mr-2" />Publicar</>
          )}
        </Button>
      </div>

      {/* Tabs */}
      <Tabs value={activeTab} onValueChange={setActiveTab} className="w-full">
        <TabsList className="grid w-full grid-cols-4">
          <TabsTrigger value="overview" data-testid="tab-overview">Resumen</TabsTrigger>
          <TabsTrigger value="content" data-testid="tab-content">Contenido</TabsTrigger>
          <TabsTrigger value="quizzes" data-testid="tab-quizzes">Quizzes</TabsTrigger>
          <TabsTrigger value="assignments" data-testid="tab-assignments">Tareas</TabsTrigger>
        </TabsList>

        {/* Overview Tab */}
        <TabsContent value="overview" className="space-y-6">
          <Card>
            <CardHeader>
              <CardTitle>Información del Curso</CardTitle>
              <CardDescription>Detalles básicos del curso</CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="grid gap-4 sm:grid-cols-2">
                <div>
                  <Label className="text-sm font-medium">Categoría</Label>
                  <p className="text-sm text-muted-foreground">{course.category || "Sin categoría"}</p>
                </div>
                <div>
                  <Label className="text-sm font-medium">Nivel</Label>
                  <p className="text-sm text-muted-foreground capitalize">{course.level}</p>
                </div>
              </div>
              <div>
                <Label className="text-sm font-medium">Descripción</Label>
                <p className="text-sm text-muted-foreground mt-1">{course.description}</p>
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle>Estadísticas</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="grid gap-4 sm:grid-cols-3">
                <div className="space-y-1">
                  <p className="text-sm text-muted-foreground">Módulos</p>
                  <p className="text-2xl font-bold">{course.modules.length}</p>
                </div>
                <div className="space-y-1">
                  <p className="text-sm text-muted-foreground">Lecciones</p>
                  <p className="text-2xl font-bold">{totalLessons}</p>
                </div>
                <div className="space-y-1">
                  <p className="text-sm text-muted-foreground">Evaluaciones</p>
                  <p className="text-2xl font-bold">{(quizzes?.length || 0) + (assignments?.length || 0)}</p>
                </div>
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        {/* Content Tab */}
        <TabsContent value="content" className="space-y-6">
          <div className="flex justify-between items-center">
            <h2 className="text-2xl font-bold">Módulos y Lecciones</h2>
            <Dialog open={isModuleDialogOpen} onOpenChange={setIsModuleDialogOpen}>
              <DialogTrigger asChild>
                <Button data-testid="button-add-module">
                  <Plus className="h-4 w-4 mr-2" />
                  Agregar Módulo
                </Button>
              </DialogTrigger>
              <DialogContent>
                <DialogHeader>
                  <DialogTitle>Nuevo Módulo</DialogTitle>
                  <DialogDescription>Crea un nuevo módulo para organizar las lecciones</DialogDescription>
                </DialogHeader>
                <Form {...moduleForm}>
                  <form onSubmit={moduleForm.handleSubmit(onModuleSubmit)} className="space-y-4">
                    <FormField
                      control={moduleForm.control}
                      name="title"
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel>Título</FormLabel>
                          <FormControl>
                            <Input {...field} placeholder="Introducción a..." data-testid="input-module-title" />
                          </FormControl>
                          <FormMessage />
                        </FormItem>
                      )}
                    />
                    <FormField
                      control={moduleForm.control}
                      name="description"
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel>Descripción</FormLabel>
                          <FormControl>
                            <Textarea {...field} placeholder="Este módulo cubre..." rows={3} data-testid="input-module-description" />
                          </FormControl>
                          <FormMessage />
                        </FormItem>
                      )}
                    />
                    <FormField
                      control={moduleForm.control}
                      name="order"
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel>Orden</FormLabel>
                          <FormControl>
                            <Input {...field} type="number" data-testid="input-module-order" />
                          </FormControl>
                          <FormMessage />
                        </FormItem>
                      )}
                    />
                    <DialogFooter>
                      <Button type="submit" disabled={createModuleMutation.isPending} data-testid="button-save-module">
                        {createModuleMutation.isPending ? "Creando..." : "Crear Módulo"}
                      </Button>
                    </DialogFooter>
                  </form>
                </Form>
              </DialogContent>
            </Dialog>
          </div>

          {course.modules.length === 0 ? (
            <Card>
              <CardContent className="py-12">
                <div className="text-center space-y-4">
                  <BookOpen className="h-12 w-12 mx-auto text-muted-foreground" />
                  <div className="space-y-2">
                    <h3 className="text-lg font-semibold">No hay módulos</h3>
                    <p className="text-muted-foreground">
                      Comienza agregando tu primer módulo para organizar el contenido
                    </p>
                  </div>
                </div>
              </CardContent>
            </Card>
          ) : (
            <div className="space-y-4">
              {course.modules.map((module) => (
                <Card key={module.id}>
                  <CardHeader>
                    <div className="flex items-start justify-between">
                      <div className="space-y-1">
                        <CardTitle>{module.title}</CardTitle>
                        <CardDescription>{module.description}</CardDescription>
                      </div>
                      <Button
                        size="sm"
                        onClick={() => {
                          setSelectedModule(module);
                          setIsLessonDialogOpen(true);
                        }}
                        data-testid={`button-add-lesson-${module.id}`}
                      >
                        <Plus className="h-4 w-4 mr-2" />
                        Agregar Lección
                      </Button>
                    </div>
                  </CardHeader>
                  <CardContent>
                    {module.lessons.length === 0 ? (
                      <p className="text-sm text-muted-foreground py-4">No hay lecciones en este módulo</p>
                    ) : (
                      <div className="space-y-2">
                        {module.lessons.map((lesson) => (
                          <div key={lesson.id} className="flex items-center justify-between p-3 rounded-md border hover-elevate" data-testid={`lesson-${lesson.id}`}>
                            <div className="flex items-center gap-3">
                              <Video className="h-5 w-5 text-muted-foreground" />
                              <div>
                                <p className="font-medium">{lesson.title}</p>
                                <p className="text-sm text-muted-foreground">{lesson.duration} min</p>
                              </div>
                            </div>
                            {lesson.videoUrl ? (
                              <Badge variant="outline" className="gap-1">
                                <CheckCircle2 className="h-3 w-3" />
                                Video cargado
                              </Badge>
                            ) : (
                              <Badge variant="secondary">Sin video</Badge>
                            )}
                          </div>
                        ))}
                      </div>
                    )}
                  </CardContent>
                </Card>
              ))}
            </div>
          )}

          {/* Lesson Dialog */}
          <Dialog open={isLessonDialogOpen} onOpenChange={setIsLessonDialogOpen}>
            <DialogContent className="max-w-2xl">
              <DialogHeader>
                <DialogTitle>Nueva Lección</DialogTitle>
                <DialogDescription>
                  Agrega una nueva lección a "{selectedModule?.title}"
                </DialogDescription>
              </DialogHeader>
              <Form {...lessonForm}>
                <form onSubmit={lessonForm.handleSubmit(onLessonSubmit)} className="space-y-4">
                  <FormField
                    control={lessonForm.control}
                    name="title"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Título</FormLabel>
                        <FormControl>
                          <Input {...field} placeholder="Título de la lección" data-testid="input-lesson-title" />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                  <FormField
                    control={lessonForm.control}
                    name="description"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Descripción</FormLabel>
                        <FormControl>
                          <Textarea {...field} placeholder="Descripción de la lección" rows={2} data-testid="input-lesson-description" />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                  <FormField
                    control={lessonForm.control}
                    name="duration"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Duración (minutos)</FormLabel>
                        <FormControl>
                          <Input 
                            {...field} 
                            type="number" 
                            onChange={(e) => field.onChange(e.target.valueAsNumber || 0)}
                            data-testid="input-lesson-duration" 
                          />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                  <FormField
                    control={lessonForm.control}
                    name="order"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Orden</FormLabel>
                        <FormControl>
                          <Input 
                            {...field} 
                            type="number" 
                            onChange={(e) => field.onChange(e.target.valueAsNumber || 0)}
                            data-testid="input-lesson-order" 
                          />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                  
                  <div className="space-y-2">
                    <Label>Video de la Lección</Label>
                    {videoUrl ? (
                      <div className="flex items-center gap-2 p-3 rounded-md border bg-muted">
                        <CheckCircle2 className="h-5 w-5 text-green-500" />
                        <span className="text-sm flex-1">Video cargado exitosamente</span>
                        <Button
                          type="button"
                          variant="ghost"
                          size="sm"
                          onClick={() => setVideoUrl("")}
                        >
                          Cambiar
                        </Button>
                      </div>
                    ) : (
                      <ObjectUploader
                        onUploadComplete={handleVideoUpload}
                        allowedFileTypes={["video/*"]}
                        note="Sube un video para esta lección (máx. 500MB)"
                      />
                    )}
                  </div>

                  <DialogFooter>
                    <Button type="submit" disabled={createLessonMutation.isPending} data-testid="button-save-lesson">
                      {createLessonMutation.isPending ? "Creando..." : "Crear Lección"}
                    </Button>
                  </DialogFooter>
                </form>
              </Form>
            </DialogContent>
          </Dialog>
        </TabsContent>

        {/* Quizzes Tab */}
        <TabsContent value="quizzes" className="space-y-6">
          <div className="flex justify-between items-center">
            <h2 className="text-2xl font-bold">Quizzes</h2>
            <Dialog open={isQuizDialogOpen} onOpenChange={setIsQuizDialogOpen}>
              <DialogTrigger asChild>
                <Button data-testid="button-add-quiz" disabled={!course?.modules?.length}>
                  <Plus className="h-4 w-4 mr-2" />
                  Crear Quiz
                </Button>
              </DialogTrigger>
              <DialogContent>
                <DialogHeader>
                  <DialogTitle>Seleccionar Lección</DialogTitle>
                  <DialogDescription>
                    Selecciona la lección para la cual deseas crear un quiz
                  </DialogDescription>
                </DialogHeader>
                <div className="space-y-4 py-4">
                  {course?.modules?.map((module) => (
                    <div key={module.id} className="space-y-2">
                      <h3 className="font-semibold text-sm text-muted-foreground">{module.title}</h3>
                      <div className="space-y-1">
                        {module.lessons?.map((lesson) => (
                          <Button
                            key={lesson.id}
                            variant="outline"
                            className="w-full justify-start"
                            onClick={() => {
                              setSelectedLessonForQuiz({ id: lesson.id, title: lesson.title });
                              setIsQuizDialogOpen(false);
                            }}
                            data-testid={`button-select-lesson-${lesson.id}`}
                          >
                            {lesson.title}
                          </Button>
                        ))}
                      </div>
                    </div>
                  ))}
                  {(!course?.modules?.length || !course?.modules?.some(m => m.lessons?.length)) && (
                    <p className="text-sm text-muted-foreground text-center">
                      Necesitas crear módulos y lecciones antes de agregar quizzes
                    </p>
                  )}
                </div>
              </DialogContent>
            </Dialog>
          </div>

          {quizzes && quizzes.length > 0 ? (
            <div className="grid gap-4">
              {quizzes.map((quiz: any) => (
                <Card key={quiz.id}>
                  <CardHeader>
                    <div className="flex items-center justify-between">
                      <div className="space-y-1">
                        <CardTitle className="text-lg">{quiz.title}</CardTitle>
                        <CardDescription>
                          {quiz.moduleTitle} → {quiz.lessonTitle}
                        </CardDescription>
                      </div>
                      <Badge variant="secondary">
                        {quiz.passPercentage}% para aprobar
                      </Badge>
                    </div>
                  </CardHeader>
                </Card>
              ))}
            </div>
          ) : (
            <Card>
              <CardContent className="py-12">
                <div className="text-center space-y-4">
                  <ClipboardCheck className="h-12 w-12 mx-auto text-muted-foreground" />
                  <div className="space-y-2">
                    <h3 className="text-lg font-semibold">No hay quizzes aún</h3>
                    <p className="text-muted-foreground">
                      Crea tu primer quiz para evaluar a tus estudiantes
                    </p>
                  </div>
                </div>
              </CardContent>
            </Card>
          )}

          {selectedLessonForQuiz && (
            <QuizCreatorDialog
              open={!!selectedLessonForQuiz}
              onOpenChange={(open) => !open && setSelectedLessonForQuiz(null)}
              lessonId={selectedLessonForQuiz.id}
              courseId={id || ""}
            />
          )}
        </TabsContent>

        {/* Assignments Tab */}
        <TabsContent value="assignments" className="space-y-6">
          <div className="flex justify-between items-center">
            <h2 className="text-2xl font-bold">Tareas</h2>
            <Button data-testid="button-add-assignment">
              <Plus className="h-4 w-4 mr-2" />
              Crear Tarea
            </Button>
          </div>
          <Card>
            <CardContent className="py-12">
              <div className="text-center space-y-4">
                <FileText className="h-12 w-12 mx-auto text-muted-foreground" />
                <div className="space-y-2">
                  <h3 className="text-lg font-semibold">Próximamente</h3>
                  <p className="text-muted-foreground">
                    La funcionalidad de tareas se implementará pronto
                  </p>
                </div>
              </div>
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>
    </div>
  );
}

function Label({ children, className = "", ...props }: any) {
  return (
    <label className={`text-sm font-medium leading-none peer-disabled:cursor-not-allowed peer-disabled:opacity-70 ${className}`} {...props}>
      {children}
    </label>
  );
}
