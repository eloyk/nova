import { useQuery } from "@tanstack/react-query";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { BookOpen, Users, Star, TrendingUp, Plus } from "lucide-react";
import { useAuth } from "@/hooks/useAuth";
import { useEffect } from "react";
import { useToast } from "@/hooks/use-toast";
import type { Course } from "@shared/schema";

export default function InstructorDashboard() {
  const { user, isLoading: authLoading, isAuthenticated, isInstructor } = useAuth();
  const { toast } = useToast();

  const { data: courses, isLoading } = useQuery<Course[]>({
    queryKey: ["/api/instructor/courses"],
    enabled: isAuthenticated && isInstructor,
  });

  const { data: stats } = useQuery({
    queryKey: ["/api/instructor/stats"],
    enabled: isAuthenticated && isInstructor,
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

  if (authLoading || isLoading) {
    return (
      <div className="flex items-center justify-center h-screen">
        <div className="space-y-4 text-center">
          <div className="h-12 w-12 mx-auto rounded-full border-4 border-primary border-t-transparent animate-spin" />
          <p className="text-muted-foreground">Cargando tu dashboard...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="space-y-8">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
        <div className="space-y-1">
          <h1 className="text-3xl font-bold" data-testid="text-welcome-instructor">
            Panel de Instructor
          </h1>
          <p className="text-muted-foreground">
            Gestiona tus cursos y monitorea el progreso de los estudiantes
          </p>
        </div>
        <Button 
          onClick={() => window.location.href = "/instructor/create-course"}
          data-testid="button-create-course"
        >
          <Plus className="h-4 w-4 mr-2" />
          Crear Curso
        </Button>
      </div>

      {/* Stats Cards */}
      <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-4">
        <Card>
          <CardHeader className="flex flex-row items-center justify-between gap-2 space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">
              Total Cursos
            </CardTitle>
            <BookOpen className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold" data-testid="text-total-courses">
              {courses?.length || 0}
            </div>
            <p className="text-xs text-muted-foreground">
              {courses?.filter(c => c.status === "published").length || 0} publicados
            </p>
          </CardContent>
        </Card>
        <Card>
          <CardHeader className="flex flex-row items-center justify-between gap-2 space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">
              Total Estudiantes
            </CardTitle>
            <Users className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{stats?.totalStudents || 0}</div>
            <p className="text-xs text-muted-foreground">
              En todos tus cursos
            </p>
          </CardContent>
        </Card>
        <Card>
          <CardHeader className="flex flex-row items-center justify-between gap-2 space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">
              Calificación Promedio
            </CardTitle>
            <Star className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{stats?.averageRating || "N/A"}</div>
            <p className="text-xs text-muted-foreground">
              De {stats?.totalReviews || 0} reseñas
            </p>
          </CardContent>
        </Card>
        <Card>
          <CardHeader className="flex flex-row items-center justify-between gap-2 space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">
              Tasa de Completación
            </CardTitle>
            <TrendingUp className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{stats?.completionRate || 0}%</div>
            <p className="text-xs text-muted-foreground">
              Promedio en cursos
            </p>
          </CardContent>
        </Card>
      </div>

      {/* My Courses */}
      <div className="space-y-4">
        <h2 className="text-2xl font-semibold">Mis Cursos</h2>
        {courses && courses.length > 0 ? (
          <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
            {courses.map((course) => (
              <Card key={course.id} className="hover-elevate" data-testid={`card-course-${course.id}`}>
                <CardHeader className="space-y-0 pb-4">
                  <div className="aspect-video rounded-md bg-gradient-to-br from-primary/20 to-primary/5 mb-4 flex items-center justify-center">
                    <BookOpen className="h-12 w-12 text-primary" />
                  </div>
                  <div className="flex items-center gap-2 mb-2">
                    <span className={`inline-flex items-center rounded-full px-2.5 py-0.5 text-xs font-medium ${
                      course.status === "published" 
                        ? "bg-green-100 text-green-800 dark:bg-green-900 dark:text-green-300" 
                        : course.status === "draft"
                        ? "bg-yellow-100 text-yellow-800 dark:bg-yellow-900 dark:text-yellow-300"
                        : "bg-gray-100 text-gray-800 dark:bg-gray-800 dark:text-gray-300"
                    }`}>
                      {course.status === "published" ? "Publicado" : course.status === "draft" ? "Borrador" : "Archivado"}
                    </span>
                  </div>
                  <CardTitle className="line-clamp-2">{course.title}</CardTitle>
                  <CardDescription className="line-clamp-2">{course.description}</CardDescription>
                </CardHeader>
                <CardContent className="space-y-2">
                  <Button 
                    className="w-full" 
                    variant="outline"
                    onClick={() => window.location.href = `/instructor/course/${course.id}`}
                    data-testid={`button-manage-${course.id}`}
                  >
                    Gestionar Curso
                  </Button>
                </CardContent>
              </Card>
            ))}
          </div>
        ) : (
          <Card className="p-12">
            <div className="text-center space-y-6">
              <div className="flex h-20 w-20 mx-auto items-center justify-center rounded-full bg-muted">
                <BookOpen className="h-10 w-10 text-muted-foreground" />
              </div>
              <div className="space-y-2">
                <h3 className="text-2xl font-semibold">No hay cursos creados</h3>
                <p className="text-muted-foreground max-w-sm mx-auto">
                  Crea tu primer curso y comparte tu conocimiento con el mundo
                </p>
              </div>
              <Button 
                size="lg"
                onClick={() => window.location.href = "/instructor/create-course"}
                data-testid="button-create-first-course"
              >
                <Plus className="h-4 w-4 mr-2" />
                Crear Mi Primer Curso
              </Button>
            </div>
          </Card>
        )}
      </div>
    </div>
  );
}
