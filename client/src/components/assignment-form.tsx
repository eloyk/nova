import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { useMutation } from "@tanstack/react-query";
import { insertAssignmentSchema, type InsertAssignment } from "@shared/schema";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from "@/components/ui/form";
import { useToast } from "@/hooks/use-toast";
import { apiRequest, queryClient } from "@/lib/queryClient";
import { Calendar } from "lucide-react";

interface AssignmentFormProps {
  lessonId: string;
  courseId: string;
  onSuccess?: () => void;
}

export function AssignmentForm({ lessonId, courseId, onSuccess }: AssignmentFormProps) {
  const { toast } = useToast();

  const form = useForm<InsertAssignment>({
    resolver: zodResolver(insertAssignmentSchema),
    defaultValues: {
      lessonId,
      title: "",
      description: "",
      dueDate: undefined,
    },
  });

  const createAssignmentMutation = useMutation({
    mutationFn: async (data: InsertAssignment) => {
      return await apiRequest("POST", "/api/assignments", data);
    },
    onSuccess: async () => {
      await Promise.all([
        queryClient.invalidateQueries({ queryKey: ["/api/courses", courseId, "assignments"] }),
      ]);
      toast({
        title: "¡Tarea creada!",
        description: "La tarea ha sido creada exitosamente",
      });
      form.reset();
      onSuccess?.();
    },
    onError: (error: any) => {
      toast({
        title: "Error",
        description: error.message || "No se pudo crear la tarea",
        variant: "destructive",
      });
    },
  });

  const onSubmit = (data: InsertAssignment) => {
    createAssignmentMutation.mutate(data);
  };

  return (
    <Form {...form}>
      <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6">
        <FormField
          control={form.control}
          name="title"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Título de la Tarea</FormLabel>
              <FormControl>
                <Input
                  {...field}
                  placeholder="Ejemplo: Ensayo sobre Algoritmos"
                  data-testid="input-assignment-title"
                />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />

        <FormField
          control={form.control}
          name="description"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Descripción</FormLabel>
              <FormControl>
                <Textarea
                  {...field}
                  placeholder="Describe la tarea y sus requisitos..."
                  rows={6}
                  data-testid="input-assignment-description"
                />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />

        <FormField
          control={form.control}
          name="dueDate"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Fecha de Entrega (Opcional)</FormLabel>
              <FormControl>
                <div className="relative">
                  <Input
                    type="datetime-local"
                    {...field}
                    value={field.value ? new Date(field.value).toISOString().slice(0, 16) : ""}
                    onChange={(e) => field.onChange(e.target.value ? new Date(e.target.value) : undefined)}
                    data-testid="input-assignment-due-date"
                  />
                  <Calendar className="absolute right-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground pointer-events-none" />
                </div>
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />

        <div className="flex justify-end gap-3">
          <Button
            type="submit"
            disabled={createAssignmentMutation.isPending}
            data-testid="button-create-assignment"
          >
            {createAssignmentMutation.isPending ? "Creando..." : "Crear Tarea"}
          </Button>
        </div>
      </form>
    </Form>
  );
}
