import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Switch } from "@/components/ui/switch";
import { Label } from "@/components/ui/label";
import { useAuth } from "@/hooks/useAuth";
import { useEffect } from "react";
import { useToast } from "@/hooks/use-toast";
import { Bell, Mail, Shield, Trash2 } from "lucide-react";

export default function Settings() {
  const { isLoading: authLoading, isAuthenticated } = useAuth();
  const { toast } = useToast();

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

  if (authLoading) {
    return (
      <div className="flex items-center justify-center h-screen">
        <div className="space-y-4 text-center">
          <div className="h-12 w-12 mx-auto rounded-full border-4 border-primary border-t-transparent animate-spin" />
          <p className="text-muted-foreground">Cargando configuración...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="max-w-3xl mx-auto space-y-8">
      <div className="space-y-2">
        <h1 className="text-3xl font-bold">Configuración</h1>
        <p className="text-muted-foreground">
          Gestiona tus preferencias y configuración de la cuenta
        </p>
      </div>

      {/* Notifications */}
      <Card>
        <CardHeader>
          <div className="flex items-center gap-2">
            <Bell className="h-5 w-5" />
            <CardTitle>Notificaciones</CardTitle>
          </div>
          <CardDescription>
            Controla qué notificaciones deseas recibir
          </CardDescription>
        </CardHeader>
        <CardContent className="space-y-6">
          <div className="flex items-center justify-between">
            <div className="space-y-1">
              <Label htmlFor="email-notifications">Notificaciones por Email</Label>
              <p className="text-sm text-muted-foreground">
                Recibe actualizaciones sobre tus cursos por email
              </p>
            </div>
            <Switch id="email-notifications" defaultChecked data-testid="switch-email-notifications" />
          </div>
          <div className="flex items-center justify-between">
            <div className="space-y-1">
              <Label htmlFor="course-updates">Actualizaciones de Cursos</Label>
              <p className="text-sm text-muted-foreground">
                Notificaciones cuando se publique nuevo contenido
              </p>
            </div>
            <Switch id="course-updates" defaultChecked data-testid="switch-course-updates" />
          </div>
          <div className="flex items-center justify-between">
            <div className="space-y-1">
              <Label htmlFor="assignment-reminders">Recordatorios de Tareas</Label>
              <p className="text-sm text-muted-foreground">
                Recordatorios sobre fechas límite de tareas
              </p>
            </div>
            <Switch id="assignment-reminders" defaultChecked data-testid="switch-assignment-reminders" />
          </div>
        </CardContent>
      </Card>

      {/* Privacy */}
      <Card>
        <CardHeader>
          <div className="flex items-center gap-2">
            <Shield className="h-5 w-5" />
            <CardTitle>Privacidad</CardTitle>
          </div>
          <CardDescription>
            Gestiona tu privacidad y visibilidad
          </CardDescription>
        </CardHeader>
        <CardContent className="space-y-6">
          <div className="flex items-center justify-between">
            <div className="space-y-1">
              <Label htmlFor="profile-visibility">Perfil Público</Label>
              <p className="text-sm text-muted-foreground">
                Permite que otros usuarios vean tu perfil
              </p>
            </div>
            <Switch id="profile-visibility" data-testid="switch-profile-visibility" />
          </div>
          <div className="flex items-center justify-between">
            <div className="space-y-1">
              <Label htmlFor="progress-visibility">Mostrar Progreso</Label>
              <p className="text-sm text-muted-foreground">
                Permite que instructores vean tu progreso
              </p>
            </div>
            <Switch id="progress-visibility" defaultChecked data-testid="switch-progress-visibility" />
          </div>
        </CardContent>
      </Card>

      {/* Email Preferences */}
      <Card>
        <CardHeader>
          <div className="flex items-center gap-2">
            <Mail className="h-5 w-5" />
            <CardTitle>Preferencias de Email</CardTitle>
          </div>
          <CardDescription>
            Controla la frecuencia de emails
          </CardDescription>
        </CardHeader>
        <CardContent className="space-y-6">
          <div className="flex items-center justify-between">
            <div className="space-y-1">
              <Label htmlFor="weekly-digest">Resumen Semanal</Label>
              <p className="text-sm text-muted-foreground">
                Recibe un resumen semanal de tu actividad
              </p>
            </div>
            <Switch id="weekly-digest" defaultChecked data-testid="switch-weekly-digest" />
          </div>
          <div className="flex items-center justify-between">
            <div className="space-y-1">
              <Label htmlFor="promotional-emails">Emails Promocionales</Label>
              <p className="text-sm text-muted-foreground">
                Recibe ofertas y novedades de NovaLearn
              </p>
            </div>
            <Switch id="promotional-emails" data-testid="switch-promotional-emails" />
          </div>
        </CardContent>
      </Card>

      {/* Danger Zone */}
      <Card className="border-destructive/50">
        <CardHeader>
          <div className="flex items-center gap-2">
            <Trash2 className="h-5 w-5 text-destructive" />
            <CardTitle className="text-destructive">Zona de Peligro</CardTitle>
          </div>
          <CardDescription>
            Acciones irreversibles para tu cuenta
          </CardDescription>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="rounded-lg border border-destructive/50 p-4 space-y-3">
            <div className="space-y-1">
              <h4 className="font-medium">Eliminar Cuenta</h4>
              <p className="text-sm text-muted-foreground">
                Una vez eliminada, tu cuenta no podrá ser recuperada. Todos tus datos serán eliminados permanentemente.
              </p>
            </div>
            <Button variant="destructive" data-testid="button-delete-account">
              Eliminar Mi Cuenta
            </Button>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
