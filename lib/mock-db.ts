import { ResearchJobPayload, ResearchJobResult, ResearchJobStatus, ResearchJobSummary } from "@/types/research";
import { VideoJob, VideoJobStatus } from "@/types/video";

interface ResearchJobRecord {
  summary: ResearchJobSummary;
  payload: ResearchJobPayload;
  status: ResearchJobStatus;
  result: ResearchJobResult;
}

interface VideoJobRecord {
  summary: VideoJob;
  status: VideoJobStatus;
}

type StoreShape = {
  research: Map<string, ResearchJobRecord>;
  video: Map<string, VideoJobRecord>;
};

const globalStore = globalThis as unknown as { __mockStore?: StoreShape };

if (!globalStore.__mockStore) {
  globalStore.__mockStore = {
    research: new Map(),
    video: new Map()
  };
}

export const mockStore = globalStore.__mockStore;
