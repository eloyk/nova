import { useState } from "react";
import { useQuery, useMutation } from "@tanstack/react-query";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Textarea } from "@/components/ui/textarea";
import { Avatar, AvatarFallback } from "@/components/ui/avatar";
import { Separator } from "@/components/ui/separator";
import { Star, Send } from "lucide-react";
import { useToast } from "@/hooks/use-toast";
import { apiRequest, queryClient } from "@/lib/queryClient";
import type { Review } from "@shared/schema";

interface ReviewSectionProps {
  courseId: string;
  isEnrolled: boolean;
}

export function ReviewSection({ courseId, isEnrolled }: ReviewSectionProps) {
  const { toast } = useToast();
  const [rating, setRating] = useState(0);
  const [hoveredRating, setHoveredRating] = useState(0);
  const [comment, setComment] = useState("");

  const { data: reviews } = useQuery<Review[]>({
    queryKey: ["/api/reviews/course", courseId],
  });

  const { data: userReview } = useQuery<Review | null>({
    queryKey: ["/api/reviews/course", courseId, "me"],
    enabled: isEnrolled,
    retry: false,
    throwOnError: false,
  });

  const createReviewMutation = useMutation({
    mutationFn: async (data: { courseId: string; rating: number; comment: string }) => {
      return await apiRequest("POST", "/api/reviews", data);
    },
    onSuccess: async () => {
      await Promise.all([
        queryClient.invalidateQueries({ queryKey: ["/api/reviews/course", courseId] }),
        queryClient.invalidateQueries({ queryKey: ["/api/reviews/course", courseId, "me"] }),
        queryClient.invalidateQueries({ queryKey: ["/api/instructor/stats"] }),
      ]);
      toast({
        title: "¡Reseña publicada!",
        description: "Gracias por compartir tu opinión",
      });
      setRating(0);
      setComment("");
    },
    onError: (error: any) => {
      toast({
        title: "Error",
        description: error.message || "No se pudo publicar la reseña",
        variant: "destructive",
      });
    },
  });

  const handleSubmit = () => {
    if (rating === 0) {
      toast({
        title: "Calificación requerida",
        description: "Por favor selecciona una calificación",
        variant: "destructive",
      });
      return;
    }

    createReviewMutation.mutate({
      courseId,
      rating,
      comment: comment.trim(),
    });
  };

  const averageRating = reviews && reviews.length > 0
    ? (reviews.reduce((acc, r) => acc + r.rating, 0) / reviews.length).toFixed(1)
    : "0.0";

  return (
    <Card>
      <CardHeader>
        <div className="flex items-center justify-between">
          <div>
            <CardTitle>Reseñas del Curso</CardTitle>
            <CardDescription>
              {reviews?.length || 0} reseña{reviews?.length !== 1 ? "s" : ""} • Promedio: {averageRating} ⭐
            </CardDescription>
          </div>
        </div>
      </CardHeader>
      <CardContent className="space-y-6">
        {/* Form to create a review */}
        {isEnrolled && !userReview && (
          <div className="space-y-4">
            <div>
              <p className="text-sm font-medium mb-2">Tu calificación</p>
              <div className="flex items-center gap-1">
                {[1, 2, 3, 4, 5].map((star) => (
                  <button
                    key={star}
                    type="button"
                    onMouseEnter={() => setHoveredRating(star)}
                    onMouseLeave={() => setHoveredRating(0)}
                    onClick={() => setRating(star)}
                    disabled={createReviewMutation.isPending}
                    className="hover-elevate active-elevate-2 p-1 rounded disabled:opacity-50 disabled:cursor-not-allowed"
                    data-testid={`button-rating-${star}`}
                  >
                    <Star
                      className={`h-6 w-6 ${
                        star <= (hoveredRating || rating)
                          ? "fill-yellow-400 text-yellow-400"
                          : "text-muted-foreground"
                      }`}
                    />
                  </button>
                ))}
                {rating > 0 && (
                  <span className="ml-2 text-sm text-muted-foreground">{rating} de 5</span>
                )}
              </div>
            </div>

            <div>
              <p className="text-sm font-medium mb-2">Tu reseña (opcional)</p>
              <Textarea
                value={comment}
                onChange={(e) => setComment(e.target.value)}
                placeholder="Comparte tu experiencia con este curso..."
                rows={4}
                data-testid="input-review-comment"
              />
            </div>

            <Button
              onClick={handleSubmit}
              disabled={createReviewMutation.isPending || rating === 0}
              data-testid="button-submit-review"
            >
              <Send className="h-4 w-4 mr-2" />
              {createReviewMutation.isPending ? "Publicando..." : "Publicar Reseña"}
            </Button>
          </div>
        )}

        {userReview && (
          <div className="p-4 bg-muted rounded-lg">
            <p className="text-sm font-medium mb-2">Tu reseña</p>
            <div className="flex items-center gap-1 mb-2">
              {[1, 2, 3, 4, 5].map((star) => (
                <Star
                  key={star}
                  className={`h-4 w-4 ${
                    star <= userReview.rating
                      ? "fill-yellow-400 text-yellow-400"
                      : "text-muted-foreground"
                  }`}
                />
              ))}
            </div>
            {userReview.comment && (
              <p className="text-sm text-muted-foreground">{userReview.comment}</p>
            )}
          </div>
        )}

        {/* List of reviews */}
        {reviews && reviews.length > 0 && (
          <>
            <Separator />
            <div className="space-y-4">
              {reviews.map((review) => (
                <div key={review.id} className="space-y-2" data-testid={`review-${review.id}`}>
                  <div className="flex items-start gap-3">
                    <Avatar>
                      <AvatarFallback>
                        {review.userId.substring(0, 2).toUpperCase()}
                      </AvatarFallback>
                    </Avatar>
                    <div className="flex-1">
                      <div className="flex items-center gap-2 mb-1">
                        <p className="font-medium text-sm">Estudiante</p>
                        <div className="flex items-center gap-1">
                          {[1, 2, 3, 4, 5].map((star) => (
                            <Star
                              key={star}
                              className={`h-3 w-3 ${
                                star <= review.rating
                                  ? "fill-yellow-400 text-yellow-400"
                                  : "text-muted-foreground"
                              }`}
                            />
                          ))}
                        </div>
                      </div>
                      {review.comment && (
                        <p className="text-sm text-muted-foreground">{review.comment}</p>
                      )}
                      <p className="text-xs text-muted-foreground mt-1">
                        {new Date(review.createdAt!).toLocaleDateString()}
                      </p>
                    </div>
                  </div>
                  <Separator />
                </div>
              ))}
            </div>
          </>
        )}

        {reviews && reviews.length === 0 && !isEnrolled && (
          <p className="text-center text-muted-foreground py-8">
            Aún no hay reseñas para este curso
          </p>
        )}
      </CardContent>
    </Card>
  );
}
