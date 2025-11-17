import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { BookOpen, Users, Trophy, TrendingUp, PlayCircle, Award, ChevronRight } from "lucide-react";

export default function Landing() {
  return (
    <div className="min-h-screen bg-background">
      {/* Header */}
      <header className="sticky top-0 z-50 w-full border-b bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60">
        <div className="max-w-7xl mx-auto flex h-16 items-center justify-between px-4 sm:px-6 lg:px-8">
          <div className="flex items-center gap-2">
            <div className="flex h-9 w-9 items-center justify-center rounded-md bg-primary">
              <BookOpen className="h-5 w-5 text-primary-foreground" />
            </div>
            <span className="text-xl font-bold">NovaLearn</span>
          </div>
          <Button 
            onClick={() => window.location.href = "/api/auth/login"}
            data-testid="button-login"
          >
            Iniciar Sesión
          </Button>
        </div>
      </header>

      {/* Hero Section */}
      <section className="relative overflow-hidden">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-24 sm:py-32">
          <div className="grid lg:grid-cols-2 gap-12 items-center">
            <div className="space-y-8">
              <div className="space-y-4">
                <h1 className="text-4xl sm:text-5xl lg:text-6xl font-bold tracking-tight" data-testid="text-hero-title">
                  Democratizar el aprendizaje a través de la{" "}
                  <span className="text-primary">tecnología</span>
                </h1>
                <p className="text-xl text-muted-foreground" data-testid="text-hero-description">
                  Plataforma educativa moderna con cursos interactivos, evaluaciones automáticas y seguimiento personalizado de progreso.
                </p>
              </div>
              <div className="flex flex-wrap gap-4">
                <Button 
                  size="lg" 
                  onClick={() => window.location.href = "/api/auth/login"}
                  className="group"
                  data-testid="button-get-started"
                >
                  Comenzar Ahora
                  <ChevronRight className="ml-2 h-4 w-4 transition-transform group-hover:translate-x-1" />
                </Button>
                <Button size="lg" variant="outline" data-testid="button-explore-courses">
                  Explorar Cursos
                </Button>
              </div>
              <div className="grid grid-cols-3 gap-8 pt-8 border-t">
                <div>
                  <div className="text-3xl font-bold text-primary">500+</div>
                  <div className="text-sm text-muted-foreground">Cursos</div>
                </div>
                <div>
                  <div className="text-3xl font-bold text-primary">10K+</div>
                  <div className="text-sm text-muted-foreground">Estudiantes</div>
                </div>
                <div>
                  <div className="text-3xl font-bold text-primary">95%</div>
                  <div className="text-sm text-muted-foreground">Satisfacción</div>
                </div>
              </div>
            </div>
            <div className="relative">
              <div className="aspect-[4/3] rounded-lg bg-gradient-to-br from-primary/20 to-primary/5 flex items-center justify-center">
                <PlayCircle className="h-24 w-24 text-primary" />
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Features Section */}
      <section className="py-24 bg-muted/50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center space-y-4 mb-16">
            <h2 className="text-3xl sm:text-4xl font-bold">¿Por qué elegir NovaLearn?</h2>
            <p className="text-xl text-muted-foreground max-w-2xl mx-auto">
              Herramientas poderosas diseñadas para potenciar tu aprendizaje
            </p>
          </div>
          <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-6">
            <Card className="hover-elevate">
              <CardContent className="pt-6 space-y-4">
                <div className="flex h-12 w-12 items-center justify-center rounded-md bg-primary/10">
                  <BookOpen className="h-6 w-6 text-primary" />
                </div>
                <h3 className="text-lg font-semibold">Cursos Interactivos</h3>
                <p className="text-sm text-muted-foreground">
                  Contenido multimedia con videos, documentos y recursos descargables
                </p>
              </CardContent>
            </Card>
            <Card className="hover-elevate">
              <CardContent className="pt-6 space-y-4">
                <div className="flex h-12 w-12 items-center justify-center rounded-md bg-primary/10">
                  <Users className="h-6 w-6 text-primary" />
                </div>
                <h3 className="text-lg font-semibold">Instructores Expertos</h3>
                <p className="text-sm text-muted-foreground">
                  Aprende de profesionales con experiencia en la industria
                </p>
              </CardContent>
            </Card>
            <Card className="hover-elevate">
              <CardContent className="pt-6 space-y-4">
                <div className="flex h-12 w-12 items-center justify-center rounded-md bg-primary/10">
                  <Trophy className="h-6 w-6 text-primary" />
                </div>
                <h3 className="text-lg font-semibold">Evaluaciones Automáticas</h3>
                <p className="text-sm text-muted-foreground">
                  Quizzes inteligentes con retroalimentación instantánea
                </p>
              </CardContent>
            </Card>
            <Card className="hover-elevate">
              <CardContent className="pt-6 space-y-4">
                <div className="flex h-12 w-12 items-center justify-center rounded-md bg-primary/10">
                  <TrendingUp className="h-6 w-6 text-primary" />
                </div>
                <h3 className="text-lg font-semibold">Seguimiento de Progreso</h3>
                <p className="text-sm text-muted-foreground">
                  Analíticas detalladas para monitorear tu avance
                </p>
              </CardContent>
            </Card>
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="py-24">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <Card className="bg-gradient-to-r from-primary to-primary/80 border-0 text-primary-foreground">
            <CardContent className="p-12 text-center space-y-6">
              <div className="flex h-16 w-16 mx-auto items-center justify-center rounded-full bg-primary-foreground/20">
                <Award className="h-8 w-8" />
              </div>
              <h2 className="text-3xl sm:text-4xl font-bold">
                Comienza tu viaje de aprendizaje hoy
              </h2>
              <p className="text-xl text-primary-foreground/90 max-w-2xl mx-auto">
                Únete a miles de estudiantes que ya están transformando sus carreras
              </p>
              <Button 
                size="lg" 
                variant="secondary"
                onClick={() => window.location.href = "/api/login"}
                data-testid="button-cta-signup"
              >
                Registrarse Gratis
              </Button>
            </CardContent>
          </Card>
        </div>
      </section>

      {/* Footer */}
      <footer className="border-t py-12 bg-muted/30">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex flex-col sm:flex-row justify-between items-center gap-4">
            <div className="flex items-center gap-2">
              <div className="flex h-8 w-8 items-center justify-center rounded-md bg-primary">
                <BookOpen className="h-4 w-4 text-primary-foreground" />
              </div>
              <span className="font-semibold">NovaLearn LMS</span>
            </div>
            <p className="text-sm text-muted-foreground">
              © 2025 NovaLearn Labs. Democratizando el aprendizaje.
            </p>
          </div>
        </div>
      </footer>
    </div>
  );
}
