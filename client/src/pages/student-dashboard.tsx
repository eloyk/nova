import { useQuery } from "@tanstack/react-query";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Progress } from "@/components/ui/progress";
import { Button } from "@/components/ui/button";
import { BookOpen, Clock, Trophy, TrendingUp, Play, Calendar } from "lucide-react";
import { useAuth } from "@/hooks/useAuth";
import { useEffect } from "react";
import { useToast } from "@/hooks/use-toast";
import type { Course, Enrollment } from "@shared/schema";

interface EnrollmentWithCourse extends Enrollment {
  course: Course;
}

export default function StudentDashboard() {
  const { user, isLoading: authLoading, isAuthenticated } = useAuth();
  const { toast } = useToast();

  const { data: enrollments, isLoading } = useQuery<EnrollmentWithCourse[]>({
    queryKey: ["/api/enrollments/my-courses"],
    enabled: isAuthenticated,
  });

  const { data: stats } = useQuery({
    queryKey: ["/api/students/stats"],
    enabled: isAuthenticated,
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

  const inProgressCourses = enrollments?.filter(e => !e.completedAt && e.progressPercentage > 0) || [];
  const notStartedCourses = enrollments?.filter(e => e.progressPercentage === 0) || [];
  const completedCourses = enrollments?.filter(e => e.completedAt) || [];

  return (
    <div className="space-y-8">
      {/* Welcome Header */}
      <div className="space-y-2">
        <h1 className="text-3xl font-bold" data-testid="text-welcome">
          Bienvenido de vuelta, {user?.firstName || "Estudiante"}
        </h1>
        <p className="text-muted-foreground">
          Continúa tu aprendizaje donde lo dejaste
        </p>
      </div>

      {/* Stats Cards */}
      <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-4">
        <Card>
          <CardHeader className="flex flex-row items-center justify-between gap-2 space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">
              Cursos Activos
            </CardTitle>
            <BookOpen className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold" data-testid="text-active-courses">
              {inProgressCourses.length}
            </div>
            <p className="text-xs text-muted-foreground">
              En progreso
            </p>
          </CardContent>
        </Card>
        <Card>
          <CardHeader className="flex flex-row items-center justify-between gap-2 space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">
              Completados
            </CardTitle>
            <Trophy className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold" data-testid="text-completed-courses">
              {completedCourses.length}
            </div>
            <p className="text-xs text-muted-foreground">
              Cursos finalizados
            </p>
          </CardContent>
        </Card>
        <Card>
          <CardHeader className="flex flex-row items-center justify-between gap-2 space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">
              Horas de Aprendizaje
            </CardTitle>
            <Clock className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{stats?.totalHours || 0}</div>
            <p className="text-xs text-muted-foreground">
              Este mes
            </p>
          </CardContent>
        </Card>
        <Card>
          <CardHeader className="flex flex-row items-center justify-between gap-2 space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">
              Progreso Promedio
            </CardTitle>
            <TrendingUp className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">
              {stats?.averageProgress || 0}%
            </div>
            <p className="text-xs text-muted-foreground">
              En todos los cursos
            </p>
          </CardContent>
        </Card>
      </div>

      {/* Continue Learning Section */}
      {inProgressCourses.length > 0 && (
        <div className="space-y-4">
          <div className="flex items-center justify-between">
            <h2 className="text-2xl font-semibold">Continuar Aprendiendo</h2>
          </div>
          <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
            {inProgressCourses.map((enrollment) => (
              <Card key={enrollment.id} className="hover-elevate group">
                <CardHeader className="space-y-0 pb-4">
                  <div className="aspect-video rounded-md bg-gradient-to-br from-primary/20 to-primary/5 mb-4 flex items-center justify-center">
                    <Play className="h-12 w-12 text-primary" />
                  </div>
                  <CardTitle className="line-clamp-2" data-testid={`text-course-title-${enrollment.courseId}`}>
                    {enrollment.course.title}
                  </CardTitle>
                  <CardDescription className="line-clamp-2">
                    {enrollment.course.description}
                  </CardDescription>
                </CardHeader>
                <CardContent className="space-y-4">
                  <div className="space-y-2">
                    <div className="flex items-center justify-between text-sm">
                      <span className="text-muted-foreground">Progreso</span>
                      <span className="font-medium">{enrollment.progressPercentage}%</span>
                    </div>
                    <Progress value={enrollment.progressPercentage} />
                  </div>
                  <Button 
                    className="w-full" 
                    data-testid={`button-continue-${enrollment.courseId}`}
                    onClick={() => window.location.href = `/course/${enrollment.courseId}`}
                  >
                    Continuar
                  </Button>
                </CardContent>
              </Card>
            ))}
          </div>
        </div>
      )}

      {/* Not Started Courses */}
      {notStartedCourses.length > 0 && (
        <div className="space-y-4">
          <h2 className="text-2xl font-semibold">Comenzar</h2>
          <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
            {notStartedCourses.map((enrollment) => (
              <Card key={enrollment.id} className="hover-elevate">
                <CardHeader className="space-y-0 pb-4">
                  <div className="aspect-video rounded-md bg-muted mb-4 flex items-center justify-center">
                    <BookOpen className="h-12 w-12 text-muted-foreground" />
                  </div>
                  <CardTitle className="line-clamp-2">
                    {enrollment.course.title}
                  </CardTitle>
                  <CardDescription className="line-clamp-2">
                    {enrollment.course.description}
                  </CardDescription>
                </CardHeader>
                <CardContent>
                  <Button 
                    className="w-full" 
                    variant="outline"
                    onClick={() => window.location.href = `/course/${enrollment.courseId}`}
                    data-testid={`button-start-${enrollment.courseId}`}
                  >
                    Comenzar Curso
                  </Button>
                </CardContent>
              </Card>
            ))}
          </div>
        </div>
      )}

      {/* Empty State */}
      {enrollments && enrollments.length === 0 && (
        <Card className="p-12">
          <div className="text-center space-y-6">
            <div className="flex h-20 w-20 mx-auto items-center justify-center rounded-full bg-muted">
              <BookOpen className="h-10 w-10 text-muted-foreground" />
            </div>
            <div className="space-y-2">
              <h3 className="text-2xl font-semibold">No hay cursos inscritos</h3>
              <p className="text-muted-foreground max-w-sm mx-auto">
                Explora nuestro catálogo y comienza tu viaje de aprendizaje
              </p>
            </div>
            <Button 
              size="lg"
              onClick={() => window.location.href = "/courses"}
              data-testid="button-browse-courses"
            >
              Explorar Cursos
            </Button>
          </div>
        </Card>
      )}
    </div>
  );
}
