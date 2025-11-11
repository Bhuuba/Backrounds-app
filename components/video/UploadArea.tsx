"use client";

import { useCallback, useRef, useState } from "react";
import { Upload } from "lucide-react";
import { toast } from "sonner";
import { Upload as TusUpload } from "tus-js-client";

import { Button } from "@/components/ui/button";
import { trackEvent } from "@/lib/analytics";

interface UploadAreaProps {
  onUploaded: (jobId: string) => void;
  maxSizeMb?: number;
}

export function UploadArea({ onUploaded, maxSizeMb = 2048 }: UploadAreaProps) {
  const inputRef = useRef<HTMLInputElement>(null);
  const [isUploading, setIsUploading] = useState(false);
  const [progress, setProgress] = useState(0);

  const handleFiles = useCallback(
    async (fileList: FileList | null) => {
      if (!fileList || fileList.length === 0) return;
      const file = fileList[0];
      if (file.size / (1024 * 1024) > maxSizeMb) {
        toast.error(`Файл перевищує ${maxSizeMb}MB`);
        return;
      }

      setIsUploading(true);
      setProgress(0);

      const response = await fetch("/api/video/jobs", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ filename: file.name })
      });

      if (!response.ok) {
        toast.error("Не вдалося створити задачу");
        setIsUploading(false);
        return;
      }

      const { jobId, uploadUrl } = (await response.json()) as { jobId: string; uploadUrl: string };

      if (uploadUrl.startsWith("mock://")) {
        let current = 0;
        const interval = setInterval(() => {
          current += Math.random() * 25;
          if (current >= 100) {
            clearInterval(interval);
            setProgress(100);
            setIsUploading(false);
            toast.success("Відео завантажено (мок)");
            trackEvent({ type: "video:create", payload: { jobId } });
            onUploaded(jobId);
          } else {
            setProgress(Math.min(99, Math.round(current)));
          }
        }, 350);
      } else {
        const uploader = new TusUpload(file, {
          endpoint: uploadUrl,
          metadata: { filename: file.name },
          onError(error) {
            console.error(error);
            toast.error("Помилка завантаження");
            setIsUploading(false);
          },
          onProgress(bytesSent, bytesTotal) {
            setProgress(Math.round((bytesSent / bytesTotal) * 100));
          },
          async onSuccess() {
            toast.success("Відео завантажено");
            setIsUploading(false);
            setProgress(100);
            trackEvent({ type: "video:create", payload: { jobId } });
            onUploaded(jobId);
          }
        });

        uploader.start();
      }
    },
    [maxSizeMb, onUploaded]
  );

  return (
    <div
      className="flex flex-col items-center justify-center gap-4 rounded-lg border border-dashed bg-card/40 p-10 text-center"
      onDragOver={(event) => {
        event.preventDefault();
        event.dataTransfer.dropEffect = "copy";
      }}
      onDrop={(event) => {
        event.preventDefault();
        handleFiles(event.dataTransfer.files);
      }}
    >
      <Upload className="h-10 w-10 text-primary" aria-hidden />
      <p className="max-w-md text-sm text-muted-foreground">
        Перетягніть файл або оберіть його вручну. Підтримка tus/resumable upload, обмеження {maxSizeMb}MB.
      </p>
      <input
        type="file"
        accept="video/*"
        ref={inputRef}
        hidden
        onChange={(event) => handleFiles(event.target.files)}
      />
      <Button type="button" onClick={() => inputRef.current?.click()} disabled={isUploading}>
        Обрати файл
      </Button>
      {isUploading && <p className="text-sm">Прогрес: {progress}%</p>}
    </div>
  );
}
