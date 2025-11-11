"use client";

import { useEffect } from "react";
import { useMutation, useQuery } from "@tanstack/react-query";
import { useParams } from "next/navigation";
import { toast } from "sonner";

import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Separator } from "@/components/ui/separator";
import { ExportModal } from "@/components/video/ExportModal";
import { JobStatus } from "@/components/video/JobStatus";
import { SegmentsList } from "@/components/video/SegmentsList";
import { Timeline } from "@/components/video/Timeline";
import { VideoPlayer } from "@/components/video/VideoPlayer";
import { fetchVideoStatus, updateVideoSegments } from "@/lib/api";
import { trackEvent } from "@/lib/analytics";
import { useVideoEditorStore } from "@/stores/video-editor-store";

export default function VideoProjectPage() {
  const params = useParams<{ id: string }>();
  const jobId = params.id;
  const setSegments = useVideoEditorStore((state) => state.setSegments);
  const segments = useVideoEditorStore((state) => state.segments);

  const statusQuery = useQuery({
    queryKey: ["video-status", jobId],
    queryFn: () => fetchVideoStatus(jobId),
    refetchInterval: (query) => (query.state.data?.status === "done" ? false : 2500)
  });

  useEffect(() => {
    const incoming = statusQuery.data?.segments;
    if (incoming && useVideoEditorStore.getState().segments.length === 0) {
      setSegments(incoming);
    }
  }, [setSegments, statusQuery.data?.segments]);

  const saveMutation = useMutation({
    mutationFn: () => updateVideoSegments(jobId, segments),
    onSuccess: () => toast.success("Сегменти збережено"),
    onError: () => toast.error("Не вдалося зберегти")
  });

  const duration = segments.at(-1)?.end ?? 0;

  return (
    <div className="space-y-6">
      <header className="flex flex-col gap-2">
        <h1 className="text-3xl font-semibold">Відео проект {jobId}</h1>
        <p className="text-muted-foreground">Редагуйте таймлайн, експортуйте та відправляйте у рендер.</p>
      </header>
      <div className="grid gap-6 xl:grid-cols-[2fr_1fr]">
        <Card>
          <CardHeader>
            <CardTitle>Таймлайн</CardTitle>
            <CardDescription>Автосегментація + ручне редагування.</CardDescription>
          </CardHeader>
          <CardContent className="space-y-6">
            <VideoPlayer poster={statusQuery.data?.thumbnails?.[0]} />
            <Timeline duration={duration} />
            <div className="flex flex-wrap items-center gap-2">
              <Button onClick={() => saveMutation.mutate()} disabled={saveMutation.isPending}>
                {saveMutation.isPending ? "Зберігаємо..." : "Зберегти сегменти"}
              </Button>
              <ExportModal jobId={jobId} />
              <Button
                variant="outline"
                onClick={() => {
                  trackEvent({ type: "video:export", payload: { jobId, format: "clips" } });
                  toast.info("Запит на рендер відправлено (мок)");
                }}
              >
                Request render
              </Button>
            </div>
          </CardContent>
        </Card>
        <Card>
          <CardHeader>
            <CardTitle>Сегменти</CardTitle>
            <CardDescription>Перейменовуйте та коригуйте точки.</CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            <JobStatus status={statusQuery.data} />
            <Separator />
            <SegmentsList jobId={jobId} />
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
