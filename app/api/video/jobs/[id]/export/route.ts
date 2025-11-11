import { NextResponse } from "next/server";

import { mockStore } from "@/lib/mock-db";
import type { VideoExportType } from "@/types/video";

export async function POST(
  request: Request,
  { params }: { params: { id: string } }
) {
  const record = mockStore.video.get(params.id);
  if (!record) {
    return NextResponse.json({ message: "Not found" }, { status: 404 });
  }

  const body = (await request.json()) as { type: VideoExportType };
  const url = `https://example.com/exports/${params.id}/${body.type}`;

  return NextResponse.json({ urls: [url] });
}
