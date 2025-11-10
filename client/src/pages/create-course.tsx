import { useState } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { useMutation } from "@tanstack/react-query";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Form, FormControl, FormDescription, FormField, FormItem, FormLabel, FormMessage } from "@/components/ui/form";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { useToast } from "@/hooks/use-toast";
import { apiRequest } from "@/lib/queryClient";
import { isUnauthorizedError } from "@/lib/authUtils";
import { insertCourseSchema, type InsertCourse } from "@shared/schema";
import { useAuth } from "@/hooks/useAuth";
import { useEffect } from "react";
import { ArrowLeft } from "lucide-react";

export default function CreateCourse() {
  const { toast } = useToast();
  const { isAuthenticated, isLoading: authLoading, isInstructor } = useAuth();
  const [step, setStep] = useState(1);

  useEffect(() => {
    if (!authLoading && (!isAuthenticated || !isInstructor)) {
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
  }, [isAuthenticated, isInstructor, authLoading, toast]);

  const form = useForm<InsertCourse>({
    resolver: zodResolver(insertCourseSchema),
    defaultValues: {
      title: "",
      description: "",
      category: "",
      level: "beginner",
      status: "draft",
      thumbnailUrl: "",
      instructorId: "",
    },
  });

  const createCourseMutation = useMutation({
    mutationFn: async (data: InsertCourse) => {
      return await apiRequest("POST", "/api/courses", data);
    },
    onSuccess: (data: any) => {
      toast({
        title: "¡Curso creado!",
        description: "Tu curso ha sido creado exitosamente",
      });
      window.location.href = `/instructor/course/${data.id}`;
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
        description: "No se pudo crear el curso",
        variant: "destructive",
      });
    },
  });

  const onSubmit = (data: InsertCourse) => {
    createCourseMutation.mutate(data);
  };

  if (authLoading) {
    return (
      <div className="flex items-center justify-center h-screen">
        <div className="space-y-4 text-center">
          <div className="h-12 w-12 mx-auto rounded-full border-4 border-primary border-t-transparent animate-spin" />
          <p className="text-muted-foreground">Cargando...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="max-w-3xl mx-auto space-y-8">
      {/* Header */}
      <div className="flex items-center gap-4">
        <Button
          variant="ghost"
          size="icon"
          onClick={() => window.location.href = "/instructor"}
          data-testid="button-back"
        >
          <ArrowLeft className="h-4 w-4" />
        </Button>
        <div>
          <h1 className="text-3xl font-bold">Crear Nuevo Curso</h1>
          <p className="text-muted-foreground">Comparte tu conocimiento con estudiantes de todo el mundo</p>
        </div>
      </div>

      {/* Progress Steps */}
      <div className="flex items-center gap-4">
        {[1, 2, 3].map((s) => (
          <div key={s} className="flex items-center gap-2 flex-1">
            <div className={`flex h-8 w-8 items-center justify-center rounded-full text-sm font-medium ${
              step >= s ? "bg-primary text-primary-foreground" : "bg-muted text-muted-foreground"
            }`}>
              {s}
            </div>
            <span className={`text-sm ${step >= s ? "text-foreground" : "text-muted-foreground"}`}>
              {s === 1 ? "Información Básica" : s === 2 ? "Detalles" : "Revisión"}
            </span>
            {s < 3 && <div className="flex-1 h-0.5 bg-muted" />}
          </div>
        ))}
      </div>

      {/* Form */}
      <Card>
        <CardHeader>
          <CardTitle>
            {step === 1 && "Información Básica"}
            {step === 2 && "Detalles del Curso"}
            {step === 3 && "Revisar y Publicar"}
          </CardTitle>
          <CardDescription>
            {step === 1 && "Proporciona la información básica de tu curso"}
            {step === 2 && "Añade detalles adicionales sobre el curso"}
            {step === 3 && "Revisa la información antes de crear"}
          </CardDescription>
        </CardHeader>
        <CardContent>
          <Form {...form}>
            <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6">
              {step === 1 && (
                <>
                  <FormField
                    control={form.control}
                    name="title"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Título del Curso *</FormLabel>
                        <FormControl>
                          <Input 
                            placeholder="Ej: Introducción a JavaScript" 
                            {...field} 
                            data-testid="input-course-title"
                          />
                        </FormControl>
                        <FormDescription>
                          Un título descriptivo y atractivo para tu curso
                        </FormDescription>
                        <FormMessage />
                      </FormItem>
                    )}
                  />

                  <FormField
                    control={form.control}
                    name="description"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Descripción</FormLabel>
                        <FormControl>
                          <Textarea 
                            placeholder="Describe de qué trata tu curso..."
                            className="min-h-32"
                            {...field}
                            value={field.value || ""}
                            data-testid="input-course-description"
                          />
                        </FormControl>
                        <FormDescription>
                          Explica qué aprenderán los estudiantes
                        </FormDescription>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                </>
              )}

              {step === 2 && (
                <>
                  <FormField
                    control={form.control}
                    name="category"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Categoría</FormLabel>
                        <FormControl>
                          <Input 
                            placeholder="Ej: Programación, Diseño, Marketing..."
                            {...field}
                            value={field.value || ""}
                            data-testid="input-course-category"
                          />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />

                  <FormField
                    control={form.control}
                    name="level"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Nivel</FormLabel>
                        <Select onValueChange={field.onChange} defaultValue={field.value || "beginner"}>
                          <FormControl>
                            <SelectTrigger data-testid="select-course-level">
                              <SelectValue placeholder="Selecciona el nivel" />
                            </SelectTrigger>
                          </FormControl>
                          <SelectContent>
                            <SelectItem value="beginner">Principiante</SelectItem>
                            <SelectItem value="intermediate">Intermedio</SelectItem>
                            <SelectItem value="advanced">Avanzado</SelectItem>
                          </SelectContent>
                        </Select>
                        <FormMessage />
                      </FormItem>
                    )}
                  />

                  <FormField
                    control={form.control}
                    name="status"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Estado</FormLabel>
                        <Select onValueChange={field.onChange} defaultValue={field.value || "draft"}>
                          <FormControl>
                            <SelectTrigger data-testid="select-course-status">
                              <SelectValue placeholder="Selecciona el estado" />
                            </SelectTrigger>
                          </FormControl>
                          <SelectContent>
                            <SelectItem value="draft">Borrador</SelectItem>
                            <SelectItem value="published">Publicado</SelectItem>
                          </SelectContent>
                        </Select>
                        <FormDescription>
                          Los borradores no son visibles para los estudiantes
                        </FormDescription>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                </>
              )}

              {step === 3 && (
                <div className="space-y-4">
                  <div className="rounded-lg border p-4 space-y-3">
                    <div>
                      <h4 className="font-medium">Título</h4>
                      <p className="text-sm text-muted-foreground">{form.watch("title")}</p>
                    </div>
                    <div>
                      <h4 className="font-medium">Descripción</h4>
                      <p className="text-sm text-muted-foreground">{form.watch("description") || "Sin descripción"}</p>
                    </div>
                    <div className="grid grid-cols-2 gap-4">
                      <div>
                        <h4 className="font-medium">Categoría</h4>
                        <p className="text-sm text-muted-foreground">{form.watch("category") || "Sin categoría"}</p>
                      </div>
                      <div>
                        <h4 className="font-medium">Nivel</h4>
                        <p className="text-sm text-muted-foreground">
                          {form.watch("level") === "beginner" ? "Principiante" : form.watch("level") === "intermediate" ? "Intermedio" : "Avanzado"}
                        </p>
                      </div>
                    </div>
                  </div>
                </div>
              )}

              <div className="flex items-center justify-between pt-4 border-t">
                {step > 1 && (
                  <Button
                    type="button"
                    variant="outline"
                    onClick={() => setStep(step - 1)}
                    data-testid="button-previous"
                  >
                    Anterior
                  </Button>
                )}
                {step < 3 ? (
                  <Button
                    type="button"
                    onClick={() => setStep(step + 1)}
                    className="ml-auto"
                    data-testid="button-next"
                  >
                    Siguiente
                  </Button>
                ) : (
                  <Button
                    type="submit"
                    disabled={createCourseMutation.isPending}
                    className="ml-auto"
                    data-testid="button-create-course"
                  >
                    {createCourseMutation.isPending ? "Creando..." : "Crear Curso"}
                  </Button>
                )}
              </div>
            </form>
          </Form>
        </CardContent>
      </Card>
    </div>
  );
}
