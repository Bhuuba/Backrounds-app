// "use client";
//
// import { useCallback, useRef, useState } from "react";
// import { Upload } from "lucide-react";
// import { toast } from "sonner";
// import { Upload as TusUpload } from "tus-js-client";
//
// import { Button } from "@/components/ui/button";
// import { trackEvent } from "@/lib/analytics";
//
// interface UploadAreaProps {
//   onUploaded: (jobId: string) => void;
//   maxSizeMb?: number;
// }
//
// export function UploadArea({ onUploaded, maxSizeMb = 2048 }: UploadAreaProps) {
//   const inputRef = useRef<HTMLInputElement>(null);
//   const [isUploading, setIsUploading] = useState(false);
//   const [progress, setProgress] = useState(0);
//
//   const handleFiles = useCallback(
//     async (fileList: FileList | null) => {
//       if (!fileList || fileList.length === 0) return;
//       const file = fileList[0];
//       if (file.size / (1024 * 1024) > maxSizeMb) {
//         toast.error(`Файл перевищує ${maxSizeMb}MB`);
//         return;
//       }
//
//       setIsUploading(true);
//       setProgress(0);
//
//       const response = await fetch("/api/video/jobs", {
//         method: "POST",
//         headers: { "Content-Type": "application/json" },
//         body: JSON.stringify({ filename: file.name })
//       });
//
//       if (!response.ok) {
//         toast.error("Не вдалося створити задачу");
//         setIsUploading(false);
//         return;
//       }
//
//       const { jobId, uploadUrl } = (await response.json()) as { jobId: string; uploadUrl: string };
//
//       if (uploadUrl.startsWith("mock://")) {
//         let current = 0;
//         const interval = setInterval(() => {
//           current += Math.random() * 25;
//           if (current >= 100) {
//             clearInterval(interval);
//             setProgress(100);
//             setIsUploading(false);
//             toast.success("Відео завантажено (мок)");
//             trackEvent({ type: "video:create", payload: { jobId } });
//             onUploaded(jobId);
//           } else {
//             setProgress(Math.min(99, Math.round(current)));
//           }
//         }, 350);
//       } else {
//         const uploader = new TusUpload(file, {
//           endpoint: uploadUrl,
//           metadata: { filename: file.name },
//           onError(error) {
//             console.error(error);
//             toast.error("Помилка завантаження");
//             setIsUploading(false);
//           },
//           onProgress(bytesSent, bytesTotal) {
//             setProgress(Math.round((bytesSent / bytesTotal) * 100));
//           },
//           async onSuccess() {
//             toast.success("Відео завантажено");
//             setIsUploading(false);
//             setProgress(100);
//             trackEvent({ type: "video:create", payload: { jobId } });
//             onUploaded(jobId);
//           }
//         });
//
//         uploader.start();
//       }
//     },
//     [maxSizeMb, onUploaded]
//   );
//
//   return (
//     <div
//       className="flex flex-col items-center justify-center gap-4 rounded-lg border border-dashed bg-card/40 p-10 text-center"
//       onDragOver={(event) => {
//         event.preventDefault();
//         event.dataTransfer.dropEffect = "copy";
//       }}
//       onDrop={(event) => {
//         event.preventDefault();
//         handleFiles(event.dataTransfer.files);
//       }}
//     >
//       <Upload className="h-10 w-10 text-primary" aria-hidden />
//       <p className="max-w-md text-sm text-muted-foreground">
//         Перетягніть файл або оберіть його вручну. Підтримка tus/resumable upload, обмеження {maxSizeMb}MB.
//       </p>
//       <input
//         type="file"
//         accept="video/*"
//         ref={inputRef}
//         hidden
//         onChange={(event) => handleFiles(event.target.files)}
//       />
//       <Button type="button" onClick={() => inputRef.current?.click()} disabled={isUploading}>
//         Обрати файл
//       </Button>
//       {isUploading && <p className="text-sm">Прогрес: {progress}%</p>}
//     </div>
//   );
// }

"use client";

import { useState } from "react";
import { Link as LinkIcon} from "lucide-react";
import { toast } from "sonner";

import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { trackEvent } from "@/lib/analytics";
import { createVideoJob } from "@/lib/api"; // We will update this function next

interface UploadAreaProps {
  onUploaded: (jobId: string) => void;
  maxSizeMb?: number;
}

export function UploadArea({ onUploaded }: UploadAreaProps) {
  const [url, setUrl] = useState("");
  const [isUploading, setIsUploading] = useState(false);

  const handleSubmit = async () => {
    if (!url) return;

    setIsUploading(true);
    try {
      const { jobId } = await createVideoJob(url);
      toast.success("Processing started");
      trackEvent({ type: "video:create", payload: { jobId } });
      onUploaded(jobId);
    } catch (error) {
      console.error(error);
      toast.error("Failed to start video job");
    } finally {
      setIsUploading(false);
    }
  };

  return (
    <div className="flex flex-col items-center justify-center gap-6 rounded-lg border border-dashed bg-card/40 p-10 text-center">
      <div className="rounded-full bg-primary/10 p-4">
        <LinkIcon className="h-8 w-8 text-primary" />
      </div>
      <div className="space-y-2">
        <h3 className="text-lg font-medium">Analyze YouTube Video</h3>
        <p className="max-w-md text-sm text-muted-foreground">
          Enter a YouTube URL to start the automated segmentation pipeline.
        </p>
      </div>

      <div className="flex w-full max-w-sm items-center space-x-2">
        <Input
          type="url"
          placeholder="https://youtube.com/watch?v=..."
          value={url}
          onChange={(e) => setUrl(e.target.value)}
          disabled={isUploading}
        />
        <Button type="button" onClick={handleSubmit} disabled={isUploading || !url}>
          {isUploading ? "Starting..." : "Start"}
        </Button>
      </div>
    </div>
  );
}
