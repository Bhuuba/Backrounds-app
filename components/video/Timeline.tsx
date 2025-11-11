"use client";

import { useMemo } from "react";
import { Scissors, Merge, Trash } from "lucide-react";

import { Button } from "@/components/ui/button";
import { useVideoEditorStore } from "@/stores/video-editor-store";
import { cn } from "@/lib/utils";

interface TimelineProps {
  duration: number;
}

export function Timeline({ duration }: TimelineProps) {
  const { segments, selectedSegmentId, selectSegment, splitSegment, mergeWithNext, removeSegment } =
    useVideoEditorStore();

  const totalDuration = useMemo(() => duration || segments.at(-1)?.end || 0, [duration, segments]);

  return (
    <div className="space-y-3">
      <div className="relative h-24 rounded-lg border bg-muted/50 p-4">
        {segments.length === 0 && (
          <p className="text-sm text-muted-foreground">Сегменти з&apos;являться після автосегментації.</p>
        )}
        <div className="flex h-12 items-stretch gap-2">
          {segments.map((segment) => {
            const width = totalDuration ? ((segment.end - segment.start) / totalDuration) * 100 : 0;
            const isSelected = selectedSegmentId === segment.id;
            return (
              <button
                key={segment.id}
                type="button"
                className={cn(
                  "flex flex-col justify-center rounded-md border border-dashed bg-card/80 px-2 text-left text-xs transition",
                  isSelected && "border-primary bg-primary/10 text-primary"
                )}
                style={{ width: `${width}%` }}
                onClick={() => selectSegment(segment.id)}
              >
                <span className="font-semibold">{segment.title}</span>
                <span>
                  {segment.start.toFixed(1)}s – {segment.end.toFixed(1)}s
                </span>
              </button>
            );
          })}
        </div>
      </div>
      {selectedSegmentId && (
        <div className="flex flex-wrap items-center gap-2" aria-live="polite">
          <Button
            size="sm"
            variant="outline"
            onClick={() => {
              const segment = useVideoEditorStore.getState().segments.find((s) => s.id === selectedSegmentId);
              if (!segment) return;
              const mid = segment.start + (segment.end - segment.start) / 2;
              splitSegment(segment.id, mid);
            }}
          >
            <Scissors className="mr-1 h-4 w-4" /> Split in half
          </Button>
          <Button size="sm" variant="outline" onClick={() => mergeWithNext(selectedSegmentId)}>
            <Merge className="mr-1 h-4 w-4" /> Merge with next
          </Button>
          <Button size="sm" variant="destructive" onClick={() => removeSegment(selectedSegmentId)}>
            <Trash className="mr-1 h-4 w-4" /> Delete
          </Button>
        </div>
      )}
    </div>
  );
}
