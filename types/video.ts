export interface VideoJob {
  id: string;
  filename: string;
  status: "queued" | "running" | "done" | "failed";
  createdAt: string;
}

export interface VideoSegment {
  id: string;
  title: string;
  start: number;
  end: number;
}

export interface VideoJobStatus {
  status: VideoJob["status"];
  progress: number;
  segments: VideoSegment[];
  thumbnails: string[];
}

export type VideoExportType = "srt" | "json" | "edl" | "clips";
