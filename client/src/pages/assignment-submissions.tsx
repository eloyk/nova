import { useParams, useLocation } from "wouter";
import { useQuery, useMutation } from "@tanstack/react-query";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Badge } from "@/components/ui/badge";
import { Textarea } from "@/components/ui/textarea";
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { useAuth } from "@/hooks/useAuth";
import { useToast } from "@/hooks/use-toast";
import { apiRequest, queryClient } from "@/lib/queryClient";
import { ArrowLeft, FileText, Calendar, CheckCircle2, Clock, Award } from "lucide-react";
import { useState } from "react";
import type { Assignment, AssignmentSubmission, User } from "@shared/schema";

interface SubmissionWithUser extends AssignmentSubmission {
  user: User;
}

export default function AssignmentSubmissions() {
  const { id } = useParams<{ id: string }>();
  const [, setLocation] = useLocation();
  const { isAuthenticated, isLoading: authLoading } = useAuth();
  const { toast } = useToast();
  const [gradingSubmission, setGradingSubmission] = useState<SubmissionWithUser | null>(null);
  const [gradeValue, setGradeValue] = useState("");
  const [feedback, setFeedback] = useState("");

  const { data: assignment, isLoading: assignmentLoading } = useQuery<Assignment>({
    queryKey: ["/api/assignments", id],
    enabled: isAuthenticated && !!id,
  });

  const { data: submissions, isLoading: submissionsLoading } = useQuery<SubmissionWithUser[]>({
    queryKey: ["/api/assignment-submissions/assignment", id],
    queryFn: async () => {
      const res = await fetch(`/api/assignment-submissions/assignment/${id}`, {
        credentials: "include",
      });
      if (!res.ok) throw new Error("Failed to fetch submissions");
      return res.json();
    },
    enabled: isAuthenticated && !!id,
  });

  const gradeSubmissionMutation = useMutation({
    mutationFn: async ({ submissionId, grade, feedback }: { submissionId: string; grade: number; feedback?: string }) => {
      return await apiRequest("PUT", `/api/assignment-submissions/${submissionId}`, {
        grade,
        feedback,
      });
    },
    onSuccess: async () => {
      await queryClient.invalidateQueries({ queryKey: ["/api/assignment-submissions/assignment", id] });
      toast({
        title: "¡Calificación guardada!",
        description: "La calificación ha sido registrada exitosamente",
      });
      setGradingSubmission(null);
      setGradeValue("");
      setFeedback("");
    },
    onError: (error: any) => {
      toast({
        title: "Error",
        description: error.message || "No se pudo guardar la calificación",
        variant: "destructive",
      });
    },
  });

  const handleGrade = () => {
    if (!gradingSubmission) return;
    
    const grade = parseFloat(gradeValue);
    if (isNaN(grade) || grade < 0 || grade > 100) {
      toast({
        title: "Calificación inválida",
        description: "La calificación debe ser un número entre 0 y 100",
        variant: "destructive",
      });
      return;
    }

    gradeSubmissionMutation.mutate({
      submissionId: gradingSubmission.id,
      grade,
      feedback: feedback.trim() || undefined,
    });
  };

  if (authLoading || assignmentLoading) {
    return (
      <div className="flex items-center justify-center h-96">
        <div className="space-y-4 text-center">
          <div className="h-12 w-12 mx-auto rounded-full border-4 border-primary border-t-transparent animate-spin" />
          <p className="text-muted-foreground">Cargando...</p>
        </div>
      </div>
    );
  }

  if (!assignment) {
    return (
      <Card>
        <CardContent className="py-12">
          <div className="text-center space-y-4">
            <FileText className="h-12 w-12 mx-auto text-muted-foreground" />
            <div className="space-y-2">
              <h3 className="text-lg font-semibold">Tarea no encontrada</h3>
              <p className="text-muted-foreground">
                La tarea que buscas no existe o no tienes permisos para verla
              </p>
            </div>
          </div>
        </CardContent>
      </Card>
    );
  }

  const submittedCount = submissions?.length || 0;
  const gradedCount = submissions?.filter(s => s.grade !== null).length || 0;

  return (
    <div className="space-y-6">
      <div className="flex items-center gap-4">
        <Button 
          variant="ghost" 
          size="icon" 
          onClick={() => window.history.back()}
          data-testid="button-back"
        >
          <ArrowLeft className="h-5 w-5" />
        </Button>
        <div className="flex-1">
          <h1 className="text-3xl font-bold">{assignment.title}</h1>
          <p className="text-muted-foreground mt-1">Entregas de estudiantes</p>
        </div>
      </div>

      <div className="grid gap-6 md:grid-cols-3">
        <Card>
          <CardHeader className="flex flex-row items-center justify-between gap-1 space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Total de Entregas</CardTitle>
            <FileText className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold" data-testid="text-submissions-count">{submittedCount}</div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between gap-1 space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Calificadas</CardTitle>
            <CheckCircle2 className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold" data-testid="text-graded-count">{gradedCount}</div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between gap-1 space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Pendientes</CardTitle>
            <Clock className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold" data-testid="text-pending-count">{submittedCount - gradedCount}</div>
          </CardContent>
        </Card>
      </div>

      {assignment.description && (
        <Card>
          <CardHeader>
            <CardTitle>Descripción de la Tarea</CardTitle>
          </CardHeader>
          <CardContent>
            <p className="text-muted-foreground whitespace-pre-wrap">{assignment.description}</p>
            {assignment.dueDate && (
              <div className="flex items-center gap-2 mt-4 text-sm text-muted-foreground">
                <Calendar className="h-4 w-4" />
                <span>
                  Fecha de entrega: {new Date(assignment.dueDate as Date).toLocaleDateString('es-ES', {
                    year: 'numeric',
                    month: 'long',
                    day: 'numeric',
                    hour: '2-digit',
                    minute: '2-digit',
                  })}
                </span>
              </div>
            )}
          </CardContent>
        </Card>
      )}

      <div className="space-y-4">
        <h2 className="text-2xl font-bold">Entregas</h2>

        {submissionsLoading ? (
          <div className="flex items-center justify-center py-12">
            <div className="h-8 w-8 rounded-full border-4 border-primary border-t-transparent animate-spin" />
          </div>
        ) : submissions && submissions.length > 0 ? (
          <div className="space-y-4">
            {submissions.map((submission) => (
              <Card key={submission.id} className="hover-elevate" data-testid={`card-submission-${submission.id}`}>
                <CardHeader>
                  <div className="flex items-start justify-between gap-4">
                    <div className="flex-1">
                      <CardTitle className="text-lg">
                        {submission.user.firstName} {submission.user.lastName}
                      </CardTitle>
                      <CardDescription className="mt-1">
                        {submission.user.email}
                      </CardDescription>
                      <div className="flex items-center gap-2 mt-2 text-sm text-muted-foreground">
                        <Calendar className="h-4 w-4" />
                        <span>
                          Entregado: {new Date(submission.submittedAt).toLocaleDateString('es-ES', {
                            year: 'numeric',
                            month: 'long',
                            day: 'numeric',
                            hour: '2-digit',
                            minute: '2-digit',
                          })}
                        </span>
                      </div>
                    </div>
                    <div className="flex flex-col items-end gap-2">
                      {submission.grade !== null ? (
                        <Badge variant="default" className="gap-1">
                          <Award className="h-3 w-3" />
                          {submission.grade}/100
                        </Badge>
                      ) : (
                        <Badge variant="secondary">Sin calificar</Badge>
                      )}
                      <Button
                        variant="outline"
                        size="sm"
                        onClick={() => {
                          setGradingSubmission(submission);
                          setGradeValue(submission.grade?.toString() || "");
                          setFeedback(submission.feedback || "");
                        }}
                        data-testid={`button-grade-${submission.id}`}
                      >
                        {submission.grade !== null ? "Ver/Editar" : "Calificar"}
                      </Button>
                    </div>
                  </div>
                  {submission.content && (
                    <div className="mt-4 pt-4 border-t">
                      <p className="text-sm font-medium mb-2">Contenido:</p>
                      <p className="text-sm text-muted-foreground whitespace-pre-wrap">
                        {submission.content}
                      </p>
                    </div>
                  )}
                  {submission.fileUrl && (
                    <div className="mt-4 pt-4 border-t">
                      <a
                        href={submission.fileUrl}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="text-sm text-primary hover:underline flex items-center gap-2"
                        data-testid={`link-file-${submission.id}`}
                      >
                        <FileText className="h-4 w-4" />
                        Ver archivo adjunto
                      </a>
                    </div>
                  )}
                  {submission.feedback && (
                    <div className="mt-4 pt-4 border-t">
                      <p className="text-sm font-medium mb-2">Retroalimentación:</p>
                      <p className="text-sm text-muted-foreground whitespace-pre-wrap">
                        {submission.feedback}
                      </p>
                    </div>
                  )}
                </CardHeader>
              </Card>
            ))}
          </div>
        ) : (
          <Card>
            <CardContent className="py-12">
              <div className="text-center space-y-4">
                <FileText className="h-12 w-12 mx-auto text-muted-foreground" />
                <div className="space-y-2">
                  <h3 className="text-lg font-semibold">No hay entregas aún</h3>
                  <p className="text-muted-foreground">
                    Los estudiantes aún no han entregado esta tarea
                  </p>
                </div>
              </div>
            </CardContent>
          </Card>
        )}
      </div>

      {gradingSubmission && (
        <Dialog open={!!gradingSubmission} onOpenChange={(open) => !open && setGradingSubmission(null)}>
          <DialogContent className="max-w-2xl">
            <DialogHeader>
              <DialogTitle>
                Calificar: {gradingSubmission.user.firstName} {gradingSubmission.user.lastName}
              </DialogTitle>
            </DialogHeader>
            
            <div className="space-y-6">
              {gradingSubmission.content && (
                <div className="space-y-2">
                  <label className="text-sm font-medium">Contenido de la entrega:</label>
                  <div className="p-4 rounded-md bg-muted">
                    <p className="text-sm whitespace-pre-wrap">{gradingSubmission.content}</p>
                  </div>
                </div>
              )}

              {gradingSubmission.fileUrl && (
                <div className="space-y-2">
                  <label className="text-sm font-medium">Archivo adjunto:</label>
                  <a
                    href={gradingSubmission.fileUrl}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="text-sm text-primary hover:underline flex items-center gap-2"
                  >
                    <FileText className="h-4 w-4" />
                    Ver archivo
                  </a>
                </div>
              )}

              <div className="space-y-2">
                <label className="text-sm font-medium">Calificación (0-100)</label>
                <Input
                  type="number"
                  min="0"
                  max="100"
                  value={gradeValue}
                  onChange={(e) => setGradeValue(e.target.value)}
                  placeholder="Ejemplo: 85"
                  data-testid="input-grade"
                />
              </div>

              <div className="space-y-2">
                <label className="text-sm font-medium">Retroalimentación (Opcional)</label>
                <Textarea
                  value={feedback}
                  onChange={(e) => setFeedback(e.target.value)}
                  placeholder="Escribe tu retroalimentación para el estudiante..."
                  rows={6}
                  data-testid="input-feedback"
                />
              </div>

              <div className="flex justify-end gap-3">
                <Button
                  variant="outline"
                  onClick={() => setGradingSubmission(null)}
                  data-testid="button-cancel-grading"
                >
                  Cancelar
                </Button>
                <Button
                  onClick={handleGrade}
                  disabled={gradeSubmissionMutation.isPending}
                  data-testid="button-save-grade"
                >
                  {gradeSubmissionMutation.isPending ? "Guardando..." : "Guardar Calificación"}
                </Button>
              </div>
            </div>
          </DialogContent>
        </Dialog>
      )}
    </div>
  );
}
