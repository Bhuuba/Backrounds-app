import { create } from "zustand";
import { nanoid } from "nanoid";

import type { VideoSegment } from "@/types/video";

interface VideoEditorState {
  segments: VideoSegment[];
  selectedSegmentId?: string;
  setSegments: (segments: VideoSegment[]) => void;
  selectSegment: (id: string) => void;
  splitSegment: (id: string, time: number) => void;
  mergeWithNext: (id: string) => void;
  removeSegment: (id: string) => void;
  updateSegment: (id: string, patch: Partial<VideoSegment>) => void;
}

export const useVideoEditorStore = create<VideoEditorState>((set, get) => ({
  segments: [],
  selectedSegmentId: undefined,
  setSegments: (segments) => set({ segments }),
  selectSegment: (id) => set({ selectedSegmentId: id }),
  splitSegment: (id, time) => {
    const segments = get().segments;
    const target = segments.find((segment) => segment.id === id);
    if (!target || time <= target.start || time >= target.end) return;
    const first: VideoSegment = { ...target, end: time };
    const second: VideoSegment = { id: nanoid(), title: `${target.title} part 2`, start: time, end: target.end };
    const nextSegments = segments.flatMap((segment) => (segment.id === id ? [first, second] : [segment]));
    set({ segments: nextSegments, selectedSegmentId: first.id });
  },
  mergeWithNext: (id) => {
    const segments = get().segments;
    const index = segments.findIndex((segment) => segment.id === id);
    if (index === -1 || index === segments.length - 1) return;
    const current = segments[index];
    const next = segments[index + 1];
    const merged: VideoSegment = {
      id: current.id,
      title: `${current.title} + ${next.title}`,
      start: current.start,
      end: next.end
    };
    const newSegments = [...segments.slice(0, index), merged, ...segments.slice(index + 2)];
    set({ segments: newSegments, selectedSegmentId: merged.id });
  },
  removeSegment: (id) => {
    const segments = get().segments.filter((segment) => segment.id !== id);
    set({ segments, selectedSegmentId: segments[0]?.id });
  },
  updateSegment: (id, patch) => {
    const segments = get().segments.map((segment) =>
      segment.id === id
        ? {
            ...segment,
            ...patch
          }
        : segment
    );
    set({ segments });
  }
}));
