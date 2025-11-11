import { NextResponse } from "next/server";

import { mockStore } from "@/lib/mock-db";
import type { VideoSegment } from "@/types/video";

export async function POST(
  request: Request,
  { params }: { params: { id: string } }
) {
  const record = mockStore.video.get(params.id);
  if (!record) {
    return NextResponse.json({ message: "Not found" }, { status: 404 });
  }

  const body = (await request.json()) as { segments: VideoSegment[] };
  record.status.segments = body.segments;

  return NextResponse.json({ ok: true });
}
