import type {
  ResearchJobPayload,
  ResearchJobResult,
  ResearchJobStatus,
  ResearchJobSummary
} from "@/types/research";
import type { VideoExportType, VideoJob, VideoJobStatus, VideoSegment } from "@/types/video";

export async function createResearchJob(payload: ResearchJobPayload) {
  const response = await fetch("/api/research/jobs", {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(payload)
  });
  if (!response.ok) throw new Error("Не вдалося створити дослідження");
  return (await response.json()) as { jobId: string };
}

export async function listResearchJobs(limit = 20) {
  const response = await fetch(`/api/research/jobs?limit=${limit}`);
  if (!response.ok) throw new Error("Не вдалося завантажити список");
  return (await response.json()) as ResearchJobSummary[];
}

export async function fetchResearchStatus(jobId: string) {
  const response = await fetch(`/api/research/jobs/${jobId}/status`);
  if (!response.ok) throw new Error("Не вдалося отримати статус");
  return (await response.json()) as ResearchJobStatus;
}

export async function fetchResearchResult(jobId: string) {
  const response = await fetch(`/api/research/jobs/${jobId}/result`);
  if (!response.ok) throw new Error("Не вдалося отримати результати");
  return (await response.json()) as ResearchJobResult;
}

export async function updateResearchReport(jobId: string, reportMd: string) {
  const response = await fetch(`/api/research/jobs/${jobId}/report/update`, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ reportMd })
  });
  if (!response.ok) throw new Error("Не вдалося оновити звіт");
  return (await response.json()) as { ok: true };
}

export async function createVideoJob(filename: string) {
  const response = await fetch("/api/video/jobs", {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ filename })
  });
  if (!response.ok) throw new Error("Не вдалося створити відеозадачу");
  return (await response.json()) as { jobId: string; uploadUrl: string };
}

export async function listVideoJobs(limit = 20) {
  const response = await fetch(`/api/video/jobs?limit=${limit}`);
  if (!response.ok) throw new Error("Не вдалося отримати проекти");
  return (await response.json()) as VideoJob[];
}

export async function fetchVideoStatus(jobId: string) {
  const response = await fetch(`/api/video/jobs/${jobId}/status`);
  if (!response.ok) throw new Error("Не вдалося отримати статус відео");
  return (await response.json()) as VideoJobStatus;
}

export async function updateVideoSegments(jobId: string, segments: VideoSegment[]) {
  const response = await fetch(`/api/video/jobs/${jobId}/segments`, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ segments })
  });
  if (!response.ok) throw new Error("Не вдалося зберегти сегменти");
  return (await response.json()) as { ok: true };
}

export async function exportVideo(jobId: string, type: VideoExportType) {
  const response = await fetch(`/api/video/jobs/${jobId}/export`, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ type })
  });
  if (!response.ok) throw new Error("Не вдалося експортувати");
  return (await response.json()) as { urls: string[] };
}
