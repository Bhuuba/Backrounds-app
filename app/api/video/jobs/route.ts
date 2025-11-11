import { NextResponse } from "next/server";

import { mockStore } from "@/lib/mock-db";

export async function GET(request: Request) {
  const { searchParams } = new URL(request.url);
  const limit = Number(searchParams.get("limit") ?? 20);
  const jobs = Array.from(mockStore.video.values())
    .map((job) => job.summary)
    .sort((a, b) => (a.createdAt < b.createdAt ? 1 : -1))
    .slice(0, limit);

  return NextResponse.json(jobs);
}

export async function POST(request: Request) {
  const body = (await request.json()) as { filename: string };
  const id = `vid_${Date.now()}`;
  const now = new Date().toISOString();
  const summary = {
    id,
    filename: body.filename,
    status: "queued" as const,
    createdAt: now
  };
  const status = {
    status: "queued" as const,
    progress: 0,
    segments: [],
    thumbnails: []
  };

  mockStore.video.set(id, { summary, status });

  return NextResponse.json({ jobId: id, uploadUrl: `mock://uploads/${id}` }, { status: 201 });
}
