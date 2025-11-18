import { useState } from "react";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import { apiRequest } from "@/lib/queryClient";
import { useToast } from "@/hooks/use-toast";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Card, CardContent } from "@/components/ui/card";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Textarea } from "@/components/ui/textarea";
import { Plus, Trash2 } from "lucide-react";

interface QuizQuestion {
  question: string;
  type: "multiple_choice" | "true_false";
  correctAnswer: string;
  options: string[];
  order: number;
}

interface QuizCreatorDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  lessonId: string;
  courseId: string;
}

export function QuizCreatorDialog({ open, onOpenChange, lessonId, courseId }: QuizCreatorDialogProps) {
  const { toast } = useToast();
  const queryClient = useQueryClient();
  const [title, setTitle] = useState("");
  const [passPercentage, setPassPercentage] = useState(70);
  const [questions, setQuestions] = useState<QuizQuestion[]>([]);
  const [currentQuestion, setCurrentQuestion] = useState<Partial<QuizQuestion>>({
    question: "",
    type: "multiple_choice",
    correctAnswer: "",
    options: ["", "", "", ""],
  });

  const createQuizMutation = useMutation({
    mutationFn: async (data: any) => {
      return await apiRequest("POST", "/api/quizzes", data);
    },
  });

  const createQuestionMutation = useMutation({
    mutationFn: async (data: any) => {
      return await apiRequest("POST", "/api/quiz-questions", data);
    },
  });

  const handleAddQuestion = () => {
    if (!currentQuestion.question || !currentQuestion.correctAnswer) {
      toast({
        title: "Error",
        description: "La pregunta y la respuesta correcta son requeridas",
        variant: "destructive",
      });
      return;
    }

    if (currentQuestion.type === "multiple_choice") {
      const validOptions = currentQuestion.options?.filter(o => o.trim() !== "") || [];
      if (validOptions.length < 2) {
        toast({
          title: "Error",
          description: "Debes agregar al menos 2 opciones",
          variant: "destructive",
        });
        return;
      }

      if (!validOptions.includes(currentQuestion.correctAnswer)) {
        toast({
          title: "Error",
          description: "La respuesta correcta debe estar en las opciones",
          variant: "destructive",
        });
        return;
      }
    }

    setQuestions([
      ...questions,
      {
        ...currentQuestion as QuizQuestion,
        order: questions.length,
      },
    ]);

    setCurrentQuestion({
      question: "",
      type: "multiple_choice",
      correctAnswer: "",
      options: ["", "", "", ""],
    });
  };

  const handleRemoveQuestion = (index: number) => {
    setQuestions(questions.filter((_, i) => i !== index));
  };

  const handleSubmit = async () => {
    if (!title || questions.length === 0) {
      toast({
        title: "Error",
        description: "El título y al menos una pregunta son requeridos",
        variant: "destructive",
      });
      return;
    }

    try {
      // Create quiz first
      const quizResponse = await createQuizMutation.mutateAsync({
        lessonId,
        title,
        passPercentage,
      });
      
      // Parse the response to get the quiz object
      const quiz: any = await quizResponse.json();
      console.log("Quiz created:", quiz);

      // Then create all questions
      for (const question of questions) {
        console.log("Creating question for quizId:", quiz.id);
        await createQuestionMutation.mutateAsync({
          quizId: quiz.id,
          question: question.question,
          type: question.type,
          correctAnswer: question.correctAnswer,
          options: question.type === "multiple_choice" ? question.options.filter(o => o.trim() !== "") : null,
          order: question.order,
        });
      }

      // Invalidate cache to refresh quiz lists
      queryClient.invalidateQueries({ queryKey: ["/api/courses", courseId] });
      queryClient.invalidateQueries({ queryKey: ["/api/quizzes/lesson", lessonId] });
      
      // Show success message
      toast({
        title: "Quiz creado",
        description: "El quiz se ha creado exitosamente con todas las preguntas",
      });

      // Reset form and close dialog
      resetForm();
      onOpenChange(false);
    } catch (error: any) {
      console.error("Error creating quiz:", error);
      toast({
        title: "Error",
        description: error.message || "No se pudo crear el quiz",
        variant: "destructive",
      });
    }
  };

  const resetForm = () => {
    setTitle("");
    setPassPercentage(70);
    setQuestions([]);
    setCurrentQuestion({
      question: "",
      type: "multiple_choice",
      correctAnswer: "",
      options: ["", "", "", ""],
    });
  };

  const updateOption = (index: number, value: string) => {
    const newOptions = [...(currentQuestion.options || ["", "", "", ""])];
    newOptions[index] = value;
    setCurrentQuestion({ ...currentQuestion, options: newOptions });
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="max-w-3xl max-h-[90vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle>Crear Quiz</DialogTitle>
          <DialogDescription>
            Crea un quiz para evaluar a tus estudiantes
          </DialogDescription>
        </DialogHeader>

        <div className="space-y-6">
          <div className="space-y-4">
            <div className="space-y-2">
              <Label htmlFor="quiz-title">Título del Quiz</Label>
              <Input
                id="quiz-title"
                data-testid="input-quiz-title"
                placeholder="Ej: Quiz de Introducción"
                value={title}
                onChange={(e) => setTitle(e.target.value)}
              />
            </div>

            <div className="space-y-2">
              <Label htmlFor="pass-percentage">Porcentaje para Aprobar (%)</Label>
              <Input
                id="pass-percentage"
                data-testid="input-pass-percentage"
                type="number"
                min="0"
                max="100"
                value={passPercentage}
                onChange={(e) => setPassPercentage(parseInt(e.target.value))}
              />
            </div>
          </div>

          <div className="border-t pt-6">
            <h3 className="text-lg font-semibold mb-4">Preguntas Agregadas ({questions.length})</h3>
            {questions.length === 0 ? (
              <p className="text-sm text-muted-foreground">No hay preguntas agregadas aún</p>
            ) : (
              <div className="space-y-3">
                {questions.map((q, index) => (
                  <Card key={index}>
                    <CardContent className="p-4">
                      <div className="flex items-start justify-between">
                        <div className="flex-1">
                          <p className="font-medium">
                            {index + 1}. {q.question}
                          </p>
                          <p className="text-sm text-muted-foreground mt-1">
                            Tipo: {q.type === "multiple_choice" ? "Opción Múltiple" : "Verdadero/Falso"}
                          </p>
                          {q.type === "multiple_choice" && (
                            <div className="mt-2 space-y-1">
                              {q.options.map((opt, i) => (
                                <p
                                  key={i}
                                  className={`text-sm ${opt === q.correctAnswer ? "text-green-600 font-medium" : "text-muted-foreground"}`}
                                >
                                  {String.fromCharCode(65 + i)}. {opt}
                                  {opt === q.correctAnswer && " ✓"}
                                </p>
                              ))}
                            </div>
                          )}
                        </div>
                        <Button
                          variant="ghost"
                          size="icon"
                          onClick={() => handleRemoveQuestion(index)}
                          data-testid={`button-remove-question-${index}`}
                        >
                          <Trash2 className="h-4 w-4" />
                        </Button>
                      </div>
                    </CardContent>
                  </Card>
                ))}
              </div>
            )}
          </div>

          <div className="border-t pt-6 space-y-4">
            <h3 className="text-lg font-semibold">Agregar Pregunta</h3>

            <div className="space-y-2">
              <Label htmlFor="question-type">Tipo de Pregunta</Label>
              <Select
                value={currentQuestion.type}
                onValueChange={(value: "multiple_choice" | "true_false") =>
                  setCurrentQuestion({ ...currentQuestion, type: value, options: value === "true_false" ? [] : ["", "", "", ""] })
                }
              >
                <SelectTrigger id="question-type" data-testid="select-question-type">
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="multiple_choice">Opción Múltiple</SelectItem>
                  <SelectItem value="true_false">Verdadero/Falso</SelectItem>
                </SelectContent>
              </Select>
            </div>

            <div className="space-y-2">
              <Label htmlFor="question-text">Pregunta</Label>
              <Textarea
                id="question-text"
                data-testid="input-question-text"
                placeholder="Escribe tu pregunta aquí"
                value={currentQuestion.question}
                onChange={(e) => setCurrentQuestion({ ...currentQuestion, question: e.target.value })}
                rows={3}
              />
            </div>

            {currentQuestion.type === "multiple_choice" ? (
              <>
                <div className="space-y-2">
                  <Label>Opciones</Label>
                  {[0, 1, 2, 3].map((index) => (
                    <div key={index} className="flex items-center gap-2">
                      <span className="text-sm font-medium w-6">{String.fromCharCode(65 + index)}.</span>
                      <Input
                        data-testid={`input-option-${index}`}
                        placeholder={`Opción ${index + 1}`}
                        value={currentQuestion.options?.[index] || ""}
                        onChange={(e) => updateOption(index, e.target.value)}
                      />
                    </div>
                  ))}
                </div>

                <div className="space-y-2">
                  <Label htmlFor="correct-answer-mc">Respuesta Correcta</Label>
                  <Select
                    value={currentQuestion.correctAnswer}
                    onValueChange={(value) => setCurrentQuestion({ ...currentQuestion, correctAnswer: value })}
                  >
                    <SelectTrigger id="correct-answer-mc" data-testid="select-correct-answer">
                      <SelectValue placeholder="Selecciona la respuesta correcta" />
                    </SelectTrigger>
                    <SelectContent>
                      {currentQuestion.options?.filter(o => o.trim() !== "").map((option, index) => (
                        <SelectItem key={index} value={option}>
                          {String.fromCharCode(65 + index)}. {option}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>
              </>
            ) : (
              <div className="space-y-2">
                <Label htmlFor="correct-answer-tf">Respuesta Correcta</Label>
                <Select
                  value={currentQuestion.correctAnswer}
                  onValueChange={(value) => setCurrentQuestion({ ...currentQuestion, correctAnswer: value })}
                >
                  <SelectTrigger id="correct-answer-tf" data-testid="select-correct-answer-tf">
                    <SelectValue placeholder="Selecciona la respuesta correcta" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="Verdadero">Verdadero</SelectItem>
                    <SelectItem value="Falso">Falso</SelectItem>
                  </SelectContent>
                </Select>
              </div>
            )}

            <Button
              onClick={handleAddQuestion}
              variant="outline"
              className="w-full"
              data-testid="button-add-question"
            >
              <Plus className="h-4 w-4 mr-2" />
              Agregar Pregunta
            </Button>
          </div>
        </div>

        <DialogFooter>
          <Button
            variant="outline"
            onClick={() => onOpenChange(false)}
            data-testid="button-cancel-quiz"
          >
            Cancelar
          </Button>
          <Button
            onClick={handleSubmit}
            disabled={createQuizMutation.isPending || !title || questions.length === 0}
            data-testid="button-save-quiz"
          >
            {createQuizMutation.isPending ? "Creando..." : "Crear Quiz"}
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}
