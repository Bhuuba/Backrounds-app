import { NextResponse } from "next/server";

import { mockStore } from "@/lib/mock-db";
import type { ResearchJobPayload } from "@/types/research";

export async function GET(request: Request) {
  const { searchParams } = new URL(request.url);
  const limit = Number(searchParams.get("limit") ?? 20);
  const items = Array.from(mockStore.research.values())
    .map((job) => job.summary)
    .sort((a, b) => (a.createdAt < b.createdAt ? 1 : -1))
    .slice(0, limit);

  return NextResponse.json(items);
}

export async function POST(request: Request) {
  const payload = (await request.json()) as ResearchJobPayload;
  const id = `job_${Date.now()}`;
  const now = new Date().toISOString();
  const summary = {
    id,
    topic: payload.query.slice(0, 80) || "Untitled research",
    status: "queued" as const,
    createdAt: now
  };
  const status = {
    status: "queued" as const,
    progress: 0,
    steps: [
      { name: "web-search", status: "queued" as const },
      { name: "extract", status: "queued" as const },
      { name: "synthesis", status: "queued" as const }
    ]
  };
  const result = {
    findings: [],
    reportMd: "# Новий звіт\nОчікуйте завершення обробки."
  };

  mockStore.research.set(id, { summary, payload, status, result });

  return NextResponse.json({ jobId: id }, { status: 201 });
}
