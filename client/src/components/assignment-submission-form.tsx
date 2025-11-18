import { useState } from "react";
import { useQuery, useMutation } from "@tanstack/react-query";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Textarea } from "@/components/ui/textarea";
import { Badge } from "@/components/ui/badge";
import { useToast } from "@/hooks/use-toast";
import { apiRequest, queryClient } from "@/lib/queryClient";
import { Calendar, CheckCircle2, Clock, Award } from "lucide-react";
import type { Assignment, AssignmentSubmission } from "@shared/schema";

interface AssignmentSubmissionFormProps {
  assignment: Assignment;
}

export function AssignmentSubmissionForm({ assignment }: AssignmentSubmissionFormProps) {
  const { toast } = useToast();
  const [content, setContent] = useState("");

  const { data: mySubmission, isLoading } = useQuery<AssignmentSubmission | null>({
    queryKey: ["/api/assignment-submissions/me", assignment.id],
    queryFn: async () => {
      const res = await fetch(`/api/assignment-submissions/me/${assignment.id}`, {
        credentials: "include",
      });
      if (!res.ok) throw new Error("Failed to fetch submission");
      return res.json();
    },
  });

  const submitAssignmentMutation = useMutation({
    mutationFn: async (content: string) => {
      return await apiRequest("POST", "/api/assignment-submissions", {
        assignmentId: assignment.id,
        content,
      });
    },
    onSuccess: async () => {
      await queryClient.invalidateQueries({ queryKey: ["/api/assignment-submissions/me", assignment.id] });
      toast({
        title: "¡Tarea entregada!",
        description: "Tu tarea ha sido entregada exitosamente",
      });
      setContent("");
    },
    onError: (error: any) => {
      toast({
        title: "Error",
        description: error.message || "No se pudo entregar la tarea",
        variant: "destructive",
      });
    },
  });

  const handleSubmit = () => {
    if (!content.trim()) {
      toast({
        title: "Contenido requerido",
        description: "Por favor escribe tu respuesta antes de entregar",
        variant: "destructive",
      });
      return;
    }

    submitAssignmentMutation.mutate(content);
  };

  if (isLoading) {
    return (
      <div className="flex items-center justify-center py-8">
        <div className="h-8 w-8 rounded-full border-4 border-primary border-t-transparent animate-spin" />
      </div>
    );
  }

  const isOverdue = assignment.dueDate && new Date(assignment.dueDate as Date) < new Date();
  const hasSubmission = !!mySubmission;

  return (
    <div className="space-y-4">
      <div className="space-y-2">
        <h3 className="text-lg font-semibold">{assignment.title}</h3>
        <p className="text-sm text-muted-foreground whitespace-pre-wrap">
          {assignment.description}
        </p>
        
        <div className="flex flex-wrap items-center gap-4 pt-2">
          {assignment.dueDate && (
            <div className="flex items-center gap-2 text-sm text-muted-foreground">
              <Calendar className="h-4 w-4" />
              <span>
                Vence: {new Date(assignment.dueDate as Date).toLocaleDateString('es-ES', {
                  year: 'numeric',
                  month: 'long',
                  day: 'numeric',
                  hour: '2-digit',
                  minute: '2-digit',
                })}
              </span>
            </div>
          )}
          {isOverdue && !hasSubmission && (
            <Badge variant="destructive" className="gap-1">
              <Clock className="h-3 w-3" />
              Vencida
            </Badge>
          )}
          {hasSubmission && (
            <Badge variant="default" className="gap-1">
              <CheckCircle2 className="h-3 w-3" />
              Entregada
            </Badge>
          )}
        </div>
      </div>

      {hasSubmission ? (
        <Card>
          <CardHeader>
            <CardTitle className="text-base">Tu Entrega</CardTitle>
            <CardDescription>
              Entregado el {new Date(mySubmission.submittedAt as Date).toLocaleDateString('es-ES', {
                year: 'numeric',
                month: 'long',
                day: 'numeric',
                hour: '2-digit',
                minute: '2-digit',
              })}
            </CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            <div>
              <p className="text-sm font-medium mb-2">Contenido:</p>
              <p className="text-sm text-muted-foreground whitespace-pre-wrap">
                {mySubmission.content}
              </p>
            </div>

            {mySubmission.grade !== null && (
              <div className="pt-4 border-t space-y-3">
                <div className="flex items-center gap-2">
                  <Award className="h-5 w-5 text-primary" />
                  <span className="font-semibold">Calificación: {mySubmission.grade}/100</span>
                </div>
                {mySubmission.feedback && (
                  <div>
                    <p className="text-sm font-medium mb-2">Retroalimentación del instructor:</p>
                    <p className="text-sm text-muted-foreground whitespace-pre-wrap">
                      {mySubmission.feedback}
                    </p>
                  </div>
                )}
              </div>
            )}
            
            {mySubmission.grade === null && (
              <div className="pt-4 border-t">
                <Badge variant="secondary">Pendiente de calificación</Badge>
              </div>
            )}
          </CardContent>
        </Card>
      ) : (
        <Card>
          <CardContent className="pt-6 space-y-4">
            <div className="space-y-2">
              <label className="text-sm font-medium">Tu Respuesta</label>
              <Textarea
                value={content}
                onChange={(e) => setContent(e.target.value)}
                placeholder="Escribe tu respuesta aquí..."
                rows={8}
                data-testid="input-assignment-content"
              />
            </div>

            <div className="flex justify-end">
              <Button
                onClick={handleSubmit}
                disabled={submitAssignmentMutation.isPending || !content.trim()}
                data-testid="button-submit-assignment"
              >
                {submitAssignmentMutation.isPending ? "Entregando..." : "Entregar Tarea"}
              </Button>
            </div>
          </CardContent>
        </Card>
      )}
    </div>
  );
}
