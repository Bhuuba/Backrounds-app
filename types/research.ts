export type ResearchMode = "fast" | "deep";
export type ResearchLang = "uk" | "ru" | "en";

export interface ResearchJobPayload {
  query: string;
  criteria: string[];
  entities: string[];
  lang: ResearchLang;
  mode: ResearchMode;
}

export interface ResearchJobSummary {
  id: string;
  topic: string;
  status: "queued" | "running" | "done" | "failed";
  createdAt: string;
}

export interface ResearchJobStatus {
  status: ResearchJobSummary["status"];
  progress: number;
  steps: Array<{
    name: string;
    status: "queued" | "running" | "done" | "failed";
    log?: string;
  }>;
}

export interface ResearchFinding {
  entity: string;
  criterion: string;
  evidence: string;
  snippet: string;
}

export interface ResearchJobResult {
  findings: ResearchFinding[];
  reportMd: string;
}
