import { useState } from "react";
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { apiRequest } from "@/lib/queryClient";
import { useToast } from "@/hooks/use-toast";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group";
import { Label } from "@/components/ui/label";
import { Badge } from "@/components/ui/badge";
import { Progress } from "@/components/ui/progress";
import { CheckCircle2, XCircle, Trophy, AlertCircle } from "lucide-react";

interface QuizTakerProps {
  quizId: string;
  onComplete?: () => void;
}

export function QuizTaker({ quizId, onComplete }: QuizTakerProps) {
  const { toast } = useToast();
  const queryClient = useQueryClient();
  const [currentQuestionIndex, setCurrentQuestionIndex] = useState(0);
  const [answers, setAnswers] = useState<Record<string, string>>({});
  const [showResults, setShowResults] = useState(false);
  const [attemptResult, setAttemptResult] = useState<any>(null);

  const { data: questions, isLoading: questionsLoading } = useQuery<any[]>({
    queryKey: ["/api/quizzes", quizId, "questions"],
    queryFn: async () => {
      const res = await fetch(`/api/quizzes/${quizId}/questions`, {
        credentials: "include",
      });
      if (!res.ok) throw new Error("Failed to fetch questions");
      return res.json();
    },
  });

  const { data: quiz } = useQuery<any>({
    queryKey: ["/api/quizzes", quizId],
    queryFn: async () => {
      const res = await fetch(`/api/courses`, {
        credentials: "include",
      });
      if (!res.ok) throw new Error("Failed to fetch quiz");
      return res.json();
    },
    enabled: false,
  });

  const submitQuizMutation = useMutation({
    mutationFn: async (data: any) => {
      return await apiRequest("POST", "/api/quiz-attempts", data);
    },
    onSuccess: (result: any) => {
      setAttemptResult(result);
      setShowResults(true);
      queryClient.invalidateQueries({ queryKey: ["/api/quizzes", quizId] });
      toast({
        title: result.passed ? "¡Aprobado!" : "No aprobado",
        description: `Obtuviste ${result.score}% en el quiz`,
        variant: result.passed ? "default" : "destructive",
      });
      if (onComplete) onComplete();
    },
    onError: (error: any) => {
      toast({
        title: "Error",
        description: error.message || "No se pudo enviar el quiz",
        variant: "destructive",
      });
    },
  });

  if (questionsLoading) {
    return (
      <Card>
        <CardContent className="py-12">
          <p className="text-center text-muted-foreground">Cargando quiz...</p>
        </CardContent>
      </Card>
    );
  }

  if (!questions || questions.length === 0) {
    return (
      <Card>
        <CardContent className="py-12">
          <div className="text-center space-y-4">
            <AlertCircle className="h-12 w-12 mx-auto text-muted-foreground" />
            <p className="text-muted-foreground">Este quiz no tiene preguntas aún</p>
          </div>
        </CardContent>
      </Card>
    );
  }

  const currentQuestion = questions[currentQuestionIndex];
  const progress = ((currentQuestionIndex + 1) / questions.length) * 100;

  const handleAnswerChange = (answer: string) => {
    setAnswers({
      ...answers,
      [currentQuestion.id]: answer,
    });
  };

  const handleNext = () => {
    if (currentQuestionIndex < questions.length - 1) {
      setCurrentQuestionIndex(currentQuestionIndex + 1);
    }
  };

  const handlePrevious = () => {
    if (currentQuestionIndex > 0) {
      setCurrentQuestionIndex(currentQuestionIndex - 1);
    }
  };

  const handleSubmit = () => {
    const correctAnswers = questions.reduce((count, question) => {
      return count + (answers[question.id] === question.correctAnswer ? 1 : 0);
    }, 0);

    const score = Math.round((correctAnswers / questions.length) * 100);
    const passed = score >= (quiz?.passPercentage || 70);

    submitQuizMutation.mutate({
      quizId,
      answers,
      score,
      passed,
    });
  };

  if (showResults && attemptResult) {
    return (
      <Card>
        <CardHeader>
          <div className="flex items-center justify-between">
            <div className="space-y-1">
              <CardTitle className="text-2xl">Resultados del Quiz</CardTitle>
              <CardDescription>
                {attemptResult.passed ? "¡Felicitaciones!" : "Sigue intentando"}
              </CardDescription>
            </div>
            {attemptResult.passed ? (
              <Trophy className="h-12 w-12 text-yellow-500" />
            ) : (
              <XCircle className="h-12 w-12 text-red-500" />
            )}
          </div>
        </CardHeader>
        <CardContent className="space-y-6">
          <div className="space-y-2">
            <div className="flex items-center justify-between">
              <span className="text-sm font-medium">Puntaje</span>
              <span className="text-2xl font-bold">{attemptResult.score}%</span>
            </div>
            <Progress value={attemptResult.score} className="h-2" />
          </div>

          <div className="grid grid-cols-2 gap-4">
            <div className="space-y-1">
              <p className="text-sm text-muted-foreground">Respuestas Correctas</p>
              <p className="text-2xl font-bold text-green-600">
                {Math.round((attemptResult.score / 100) * questions.length)} / {questions.length}
              </p>
            </div>
            <div className="space-y-1">
              <p className="text-sm text-muted-foreground">Estado</p>
              <Badge variant={attemptResult.passed ? "default" : "destructive"}>
                {attemptResult.passed ? "Aprobado" : "No Aprobado"}
              </Badge>
            </div>
          </div>

          <div className="space-y-4 pt-4 border-t">
            <h3 className="font-semibold">Revisión de Respuestas</h3>
            {questions.map((question, index) => {
              const isCorrect = answers[question.id] === question.correctAnswer;
              return (
                <Card key={question.id} className={isCorrect ? "border-green-500" : "border-red-500"}>
                  <CardContent className="p-4">
                    <div className="flex items-start gap-3">
                      {isCorrect ? (
                        <CheckCircle2 className="h-5 w-5 text-green-600 mt-1" />
                      ) : (
                        <XCircle className="h-5 w-5 text-red-600 mt-1" />
                      )}
                      <div className="flex-1 space-y-2">
                        <p className="font-medium">
                          {index + 1}. {question.question}
                        </p>
                        <div className="space-y-1">
                          <p className="text-sm">
                            <span className="text-muted-foreground">Tu respuesta: </span>
                            <span className={isCorrect ? "text-green-600" : "text-red-600"}>
                              {answers[question.id] || "Sin respuesta"}
                            </span>
                          </p>
                          {!isCorrect && (
                            <p className="text-sm">
                              <span className="text-muted-foreground">Respuesta correcta: </span>
                              <span className="text-green-600">{question.correctAnswer}</span>
                            </p>
                          )}
                        </div>
                      </div>
                    </div>
                  </CardContent>
                </Card>
              );
            })}
          </div>
        </CardContent>
      </Card>
    );
  }

  const allQuestionsAnswered = questions.every((q) => answers[q.id]);

  return (
    <Card>
      <CardHeader>
        <div className="space-y-4">
          <div className="flex items-center justify-between">
            <CardTitle>
              Pregunta {currentQuestionIndex + 1} de {questions.length}
            </CardTitle>
            <Badge variant="outline">
              {Object.keys(answers).length} / {questions.length} respondidas
            </Badge>
          </div>
          <Progress value={progress} className="h-2" />
        </div>
      </CardHeader>
      <CardContent className="space-y-6">
        <div className="space-y-4">
          <h3 className="text-lg font-medium">{currentQuestion.question}</h3>

          <RadioGroup
            value={answers[currentQuestion.id] || ""}
            onValueChange={handleAnswerChange}
          >
            {currentQuestion.type === "multiple_choice" ? (
              <div className="space-y-3">
                {currentQuestion.options?.map((option: string, index: number) => (
                  <div key={index} className="flex items-center space-x-2">
                    <RadioGroupItem
                      value={option}
                      id={`option-${index}`}
                      data-testid={`radio-option-${index}`}
                    />
                    <Label htmlFor={`option-${index}`} className="flex-1 cursor-pointer">
                      <div className="flex items-center gap-2">
                        <span className="font-medium">{String.fromCharCode(65 + index)}.</span>
                        <span>{option}</span>
                      </div>
                    </Label>
                  </div>
                ))}
              </div>
            ) : (
              <div className="space-y-3">
                <div className="flex items-center space-x-2">
                  <RadioGroupItem
                    value="Verdadero"
                    id="option-true"
                    data-testid="radio-option-true"
                  />
                  <Label htmlFor="option-true" className="flex-1 cursor-pointer">
                    Verdadero
                  </Label>
                </div>
                <div className="flex items-center space-x-2">
                  <RadioGroupItem
                    value="Falso"
                    id="option-false"
                    data-testid="radio-option-false"
                  />
                  <Label htmlFor="option-false" className="flex-1 cursor-pointer">
                    Falso
                  </Label>
                </div>
              </div>
            )}
          </RadioGroup>
        </div>

        <div className="flex items-center justify-between pt-4 border-t">
          <Button
            variant="outline"
            onClick={handlePrevious}
            disabled={currentQuestionIndex === 0}
            data-testid="button-previous"
          >
            Anterior
          </Button>

          <div className="flex gap-2">
            {currentQuestionIndex < questions.length - 1 ? (
              <Button
                onClick={handleNext}
                disabled={!answers[currentQuestion.id]}
                data-testid="button-next"
              >
                Siguiente
              </Button>
            ) : (
              <Button
                onClick={handleSubmit}
                disabled={!allQuestionsAnswered || submitQuizMutation.isPending}
                data-testid="button-submit-quiz"
              >
                {submitQuizMutation.isPending ? "Enviando..." : "Finalizar Quiz"}
              </Button>
            )}
          </div>
        </div>
      </CardContent>
    </Card>
  );
}
