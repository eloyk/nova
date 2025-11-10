import { useState, useRef } from "react";
import { useToast } from "@/hooks/use-toast";
import { apiRequest } from "@/lib/queryClient";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Progress } from "@/components/ui/progress";
import { Upload, CheckCircle2, XCircle } from "lucide-react";

interface ObjectUploaderProps {
  onUploadComplete: (url: string) => void;
  allowedFileTypes?: string[];
  maxFileSize?: number;
  note?: string;
}

export function ObjectUploader({
  onUploadComplete,
  allowedFileTypes = ["video/*"],
  maxFileSize = 500 * 1024 * 1024, // 500MB default
  note = "Sube tu archivo (máx. 500MB)",
}: ObjectUploaderProps) {
  const { toast } = useToast();
  const [uploading, setUploading] = useState(false);
  const [progress, setProgress] = useState(0);
  const [error, setError] = useState<string | null>(null);
  const [success, setSuccess] = useState(false);
  const fileInputRef = useRef<HTMLInputElement>(null);

  const handleFileSelect = async (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (!file) return;

    // Validate file size
    if (file.size > maxFileSize) {
      const maxSizeMB = Math.round(maxFileSize / (1024 * 1024));
      setError(`El archivo es muy grande. Tamaño máximo: ${maxSizeMB}MB`);
      toast({
        title: "Error",
        description: `El archivo excede el tamaño máximo de ${maxSizeMB}MB`,
        variant: "destructive",
      });
      return;
    }

    setUploading(true);
    setError(null);
    setSuccess(false);
    setProgress(0);

    try {
      // Get presigned upload URL
      const response: any = await apiRequest("POST", "/api/objects/upload", {});
      const uploadURL = response.uploadURL as string;

      // Upload file using presigned URL
      const xhr = new XMLHttpRequest();

      xhr.upload.addEventListener("progress", (e) => {
        if (e.lengthComputable) {
          const percentComplete = (e.loaded / e.total) * 100;
          setProgress(percentComplete);
        }
      });

      xhr.addEventListener("load", () => {
        if (xhr.status === 200) {
          setSuccess(true);
          onUploadComplete(uploadURL);
          toast({
            title: "¡Archivo cargado!",
            description: "El archivo se ha subido exitosamente",
          });
        } else {
          setError("Error al cargar el archivo");
          toast({
            title: "Error",
            description: "No se pudo cargar el archivo",
            variant: "destructive",
          });
        }
        setUploading(false);
      });

      xhr.addEventListener("error", () => {
        setError("Error de red al cargar el archivo");
        toast({
          title: "Error",
          description: "Error de red al cargar el archivo",
          variant: "destructive",
        });
        setUploading(false);
      });

      xhr.open("PUT", uploadURL);
      xhr.setRequestHeader("Content-Type", file.type || "application/octet-stream");
      xhr.send(file);
    } catch (err) {
      console.error("Upload error:", err);
      setError("No se pudo iniciar la carga");
      toast({
        title: "Error",
        description: "No se pudo iniciar la carga del archivo",
        variant: "destructive",
      });
      setUploading(false);
    }
  };

  return (
    <div className="space-y-4 rounded-lg border p-6">
      <div className="space-y-2">
        <Input
          ref={fileInputRef}
          type="file"
          accept={allowedFileTypes.join(",")}
          onChange={handleFileSelect}
          disabled={uploading || success}
          data-testid="input-file-upload"
          className="cursor-pointer"
        />
        {note && <p className="text-sm text-muted-foreground">{note}</p>}
      </div>

      {uploading && (
        <div className="space-y-2">
          <div className="flex items-center justify-between text-sm">
            <span className="text-muted-foreground">Subiendo...</span>
            <span className="font-medium">{Math.round(progress)}%</span>
          </div>
          <Progress value={progress} />
        </div>
      )}

      {success && (
        <div className="flex items-center gap-2 text-sm text-green-600">
          <CheckCircle2 className="h-4 w-4" />
          <span>Archivo cargado exitosamente</span>
        </div>
      )}

      {error && (
        <div className="flex items-center gap-2 text-sm text-destructive">
          <XCircle className="h-4 w-4" />
          <span>{error}</span>
        </div>
      )}
    </div>
  );
}
