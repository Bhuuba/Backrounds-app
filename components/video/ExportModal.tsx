"use client";

import { useState } from "react";
import { Download } from "lucide-react";

import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger
} from "@/components/ui/dialog";
import { Label } from "@/components/ui/label";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { trackEvent } from "@/lib/analytics";
import type { VideoExportType } from "@/types/video";

interface ExportModalProps {
  jobId: string;
}

export function ExportModal({ jobId }: ExportModalProps) {
  const [open, setOpen] = useState(false);
  const [format, setFormat] = useState<VideoExportType>("json");
  const [isLoading, setIsLoading] = useState(false);
  const [urls, setUrls] = useState<string[]>([]);

  const handleExport = async () => {
    setIsLoading(true);
    const response = await fetch(`/api/video/jobs/${jobId}/export`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ type: format })
    });
    setIsLoading(false);
    if (!response.ok) return;
    const data = (await response.json()) as { urls: string[] };
    setUrls(data.urls);
    trackEvent({ type: "video:export", payload: { jobId, format } });
  };

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogTrigger asChild>
        <Button>
          <Download className="mr-2 h-4 w-4" /> Export
        </Button>
      </DialogTrigger>
      <DialogContent>
        <DialogHeader>
          <DialogTitle>Експорт сегментів</DialogTitle>
          <DialogDescription>Обирайте формат і отримуйте посилання на завантаження.</DialogDescription>
        </DialogHeader>
        <div className="space-y-4">
          <div className="space-y-2">
            <Label htmlFor="export-format">Формат</Label>
            <Select value={format} onValueChange={(value: VideoExportType) => setFormat(value)}>
              <SelectTrigger id="export-format">
                <SelectValue placeholder="Оберіть формат" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="json">JSON</SelectItem>
                <SelectItem value="srt">SRT</SelectItem>
                <SelectItem value="edl">EDL</SelectItem>
                <SelectItem value="clips">Clips</SelectItem>
              </SelectContent>
            </Select>
          </div>
          {urls.length > 0 && (
            <div className="space-y-2">
              <p className="text-sm font-medium">Посилання</p>
              <ul className="list-disc space-y-1 pl-4 text-sm">
                {urls.map((url) => (
                  <li key={url}>
                    <a className="text-primary underline-offset-2 hover:underline" href={url} target="_blank" rel="noreferrer">
                      {url}
                    </a>
                  </li>
                ))}
              </ul>
            </div>
          )}
        </div>
        <DialogFooter>
          <Button onClick={handleExport} disabled={isLoading}>
            {isLoading ? "Готуємо..." : "Експортувати"}
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}
