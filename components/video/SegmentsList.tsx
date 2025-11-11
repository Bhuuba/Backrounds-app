"use client";

import { ChangeEvent } from "react";
import { GripVertical } from "lucide-react";

import { Input } from "@/components/ui/input";
import { ScrollArea } from "@/components/ui/scroll-area";
import { useVideoEditorStore } from "@/stores/video-editor-store";
import { trackEvent } from "@/lib/analytics";

interface SegmentsListProps {
  jobId: string;
}

export function SegmentsList({ jobId }: SegmentsListProps) {
  const { segments, selectedSegmentId, selectSegment, updateSegment } = useVideoEditorStore();

  const handleTitleChange = (segmentId: string) => (event: ChangeEvent<HTMLInputElement>) => {
    updateSegment(segmentId, { title: event.target.value });
    trackEvent({ type: "video:segment:update", payload: { jobId, segmentId } });
  };

  return (
    <ScrollArea className="h-80 rounded-lg border">
      <ul className="divide-y">
        {segments.map((segment) => (
          <li
            key={segment.id}
            className="flex items-center gap-3 px-4 py-3 text-sm hover:bg-muted/60"
            aria-current={selectedSegmentId === segment.id ? "true" : undefined}
          >
            <button
              type="button"
              onClick={() => selectSegment(segment.id)}
              className="rounded-md border bg-background p-2"
              aria-label="Select segment"
            >
              <GripVertical className="h-4 w-4" />
            </button>
            <div className="flex-1 space-y-1">
              <Input value={segment.title} onChange={handleTitleChange(segment.id)} />
              <p className="text-xs text-muted-foreground">
                {segment.start.toFixed(1)}s – {segment.end.toFixed(1)}s
              </p>
            </div>
          </li>
        ))}
        {segments.length === 0 && (
          <li className="px-4 py-6 text-sm text-muted-foreground">Сегменти відсутні.</li>
        )}
      </ul>
    </ScrollArea>
  );
}
