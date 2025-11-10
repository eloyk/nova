import { useState } from "react";
import Uppy from "@uppy/core";
import { Dashboard } from "@uppy/react";
import AwsS3 from "@uppy/aws-s3";
import { useToast } from "@/hooks/use-toast";
import { apiRequest } from "@/lib/queryClient";

interface ObjectUploaderProps {
  onUploadComplete: (url: string) => void;
  allowedFileTypes?: string[];
  maxFileSize?: number;
  note?: string;
}

export function ObjectUploader({
  onUploadComplete,
  allowedFileTypes,
  maxFileSize = 500 * 1024 * 1024, // 500MB default
  note,
}: ObjectUploaderProps) {
  const { toast } = useToast();
  const [uppy] = useState(() => {
    const uppyInstance = new Uppy({
      restrictions: {
        maxNumberOfFiles: 1,
        allowedFileTypes,
        maxFileSize,
      },
      autoProceed: false,
    });

    uppyInstance.use(AwsS3, {
      shouldUseMultipart: false,
      getUploadParameters: async (file) => {
        try {
          const response = await apiRequest("POST", "/api/objects/upload", {});
          const uploadURL = response.uploadURL;

          return {
            method: "PUT",
            url: uploadURL,
            headers: {
              "Content-Type": file.type || "application/octet-stream",
            },
          };
        } catch (error) {
          console.error("Error getting upload URL:", error);
          toast({
            title: "Error",
            description: "No se pudo obtener la URL de carga",
            variant: "destructive",
          });
          throw error;
        }
      },
    });

    uppyInstance.on("upload-success", (file, response) => {
      if (response.uploadURL) {
        onUploadComplete(response.uploadURL);
        toast({
          title: "¡Archivo cargado!",
          description: "El archivo se ha subido exitosamente",
        });
      }
    });

    uppyInstance.on("upload-error", (file, error) => {
      console.error("Upload error:", error);
      toast({
        title: "Error al cargar",
        description: error.message || "No se pudo cargar el archivo",
        variant: "destructive",
      });
    });

    return uppyInstance;
  });

  return (
    <div className="space-y-2">
      <Dashboard
        uppy={uppy}
        proudlyDisplayPoweredByUppy={false}
        height={350}
        note={note}
      />
    </div>
  );
}
