import { useState } from "react";
import { useQuery, useMutation } from "@tanstack/react-query";
import { Card, CardContent, CardDescription, CardHeader, CardTitle, CardFooter } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Badge } from "@/components/ui/badge";
import { Search, BookOpen, Users, Clock, Filter } from "lucide-react";
import { useAuth } from "@/hooks/useAuth";
import { useToast } from "@/hooks/use-toast";
import { apiRequest, queryClient } from "@/lib/queryClient";
import { isUnauthorizedError } from "@/lib/authUtils";
import type { Course } from "@shared/schema";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";

export default function Courses() {
  const { isAuthenticated, isStudent } = useAuth();
  const { toast } = useToast();
  const [searchTerm, setSearchTerm] = useState("");
  const [categoryFilter, setCategoryFilter] = useState<string>("all");
  const [levelFilter, setLevelFilter] = useState<string>("all");

  const { data: courses, isLoading } = useQuery<Course[]>({
    queryKey: ["/api/courses"],
  });

  const { data: enrolledCourseIds } = useQuery<string[]>({
    queryKey: ["/api/enrollments/course-ids"],
    enabled: isAuthenticated && isStudent,
  });

  const enrollMutation = useMutation({
    mutationFn: async (courseId: string) => {
      return await apiRequest("POST", "/api/enrollments", { courseId });
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["/api/enrollments/course-ids"] });
      queryClient.invalidateQueries({ queryKey: ["/api/enrollments/my-courses"] });
      toast({
        title: "¡Inscripción exitosa!",
        description: "Ya puedes comenzar a aprender",
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
        description: "No se pudo inscribir en el curso",
        variant: "destructive",
      });
    },
  });

  const filteredCourses = courses?.filter(course => {
    const matchesSearch = course.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
      course.description?.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesCategory = categoryFilter === "all" || course.category === categoryFilter;
    const matchesLevel = levelFilter === "all" || course.level === levelFilter;
    return matchesSearch && matchesCategory && matchesLevel && course.status === "published";
  });

  const categories = Array.from(new Set(courses?.map(c => c.category).filter(Boolean))) as string[];
  const levels = ["beginner", "intermediate", "advanced"];

  return (
    <div className="space-y-8">
      {/* Header */}
      <div className="space-y-2">
        <h1 className="text-3xl font-bold">Catálogo de Cursos</h1>
        <p className="text-muted-foreground">
          Explora nuestra colección de cursos de alta calidad
        </p>
      </div>

      {/* Search and Filters */}
      <div className="flex flex-col sm:flex-row gap-4">
        <div className="relative flex-1">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
          <Input
            placeholder="Buscar cursos..."
            className="pl-10"
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            data-testid="input-search-courses"
          />
        </div>
        <Select value={categoryFilter} onValueChange={setCategoryFilter}>
          <SelectTrigger className="w-full sm:w-48" data-testid="select-category">
            <Filter className="h-4 w-4 mr-2" />
            <SelectValue placeholder="Categoría" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="all">Todas las categorías</SelectItem>
            {categories.map(category => (
              <SelectItem key={category} value={category}>{category}</SelectItem>
            ))}
          </SelectContent>
        </Select>
        <Select value={levelFilter} onValueChange={setLevelFilter}>
          <SelectTrigger className="w-full sm:w-48" data-testid="select-level">
            <SelectValue placeholder="Nivel" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="all">Todos los niveles</SelectItem>
            {levels.map(level => (
              <SelectItem key={level} value={level}>
                {level === "beginner" ? "Principiante" : level === "intermediate" ? "Intermedio" : "Avanzado"}
              </SelectItem>
            ))}
          </SelectContent>
        </Select>
      </div>

      {/* Course Grid */}
      {isLoading ? (
        <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
          {[1, 2, 3, 4, 5, 6].map(i => (
            <Card key={i} className="animate-pulse">
              <CardHeader>
                <div className="aspect-video rounded-md bg-muted mb-4" />
                <div className="h-6 bg-muted rounded w-3/4" />
                <div className="h-4 bg-muted rounded w-full mt-2" />
              </CardHeader>
            </Card>
          ))}
        </div>
      ) : filteredCourses && filteredCourses.length > 0 ? (
        <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
          {filteredCourses.map((course) => {
            const isEnrolled = enrolledCourseIds?.includes(course.id);
            return (
              <Card key={course.id} className="hover-elevate flex flex-col" data-testid={`card-course-${course.id}`}>
                <CardHeader className="space-y-0 pb-4">
                  <div className="aspect-video rounded-md bg-gradient-to-br from-primary/20 to-primary/5 mb-4 flex items-center justify-center">
                    <BookOpen className="h-12 w-12 text-primary" />
                  </div>
                  <div className="flex gap-2 mb-2 flex-wrap">
                    {course.category && (
                      <Badge variant="secondary" className="text-xs">
                        {course.category}
                      </Badge>
                    )}
                    {course.level && (
                      <Badge variant="outline" className="text-xs">
                        {course.level === "beginner" ? "Principiante" : course.level === "intermediate" ? "Intermedio" : "Avanzado"}
                      </Badge>
                    )}
                  </div>
                  <CardTitle className="line-clamp-2">
                    {course.title}
                  </CardTitle>
                  <CardDescription className="line-clamp-3">
                    {course.description}
                  </CardDescription>
                </CardHeader>
                <CardFooter className="mt-auto pt-4">
                  {isEnrolled ? (
                    <Button 
                      className="w-full" 
                      onClick={() => window.location.href = `/course/${course.id}`}
                      data-testid={`button-view-course-${course.id}`}
                    >
                      Ver Curso
                    </Button>
                  ) : (
                    <Button 
                      className="w-full"
                      onClick={() => enrollMutation.mutate(course.id)}
                      disabled={enrollMutation.isPending || !isStudent}
                      data-testid={`button-enroll-${course.id}`}
                    >
                      {enrollMutation.isPending ? "Inscribiendo..." : "Inscribirse"}
                    </Button>
                  )}
                </CardFooter>
              </Card>
            );
          })}
        </div>
      ) : (
        <Card className="p-12">
          <div className="text-center space-y-4">
            <div className="flex h-20 w-20 mx-auto items-center justify-center rounded-full bg-muted">
              <BookOpen className="h-10 w-10 text-muted-foreground" />
            </div>
            <div className="space-y-2">
              <h3 className="text-xl font-semibold">No se encontraron cursos</h3>
              <p className="text-muted-foreground">
                Intenta ajustar los filtros de búsqueda
              </p>
            </div>
          </div>
        </Card>
      )}
    </div>
  );
}
