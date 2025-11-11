import { NextResponse } from "next/server";

import { mockStore } from "@/lib/mock-db";

export async function GET(
  _request: Request,
  { params }: { params: { id: string } }
) {
  const record = mockStore.video.get(params.id);
  if (!record) {
    return NextResponse.json({ message: "Not found" }, { status: 404 });
  }

  if (record.status.status !== "done") {
    const next = Math.min(1, record.status.progress + 0.15);
    record.status.progress = next;
    if (next >= 1) {
      record.status.status = "done";
      record.summary.status = "done";
      record.status.segments = record.status.segments.length
        ? record.status.segments
        : [
            { id: `${params.id}-s1`, title: "Intro", start: 0, end: 12.5 },
            { id: `${params.id}-s2`, title: "Main", start: 12.5, end: 54.2 }
          ];
      record.status.thumbnails = [
        "https://dummyimage.com/640x360/1e40af/ffffff&text=Preview",
        "https://dummyimage.com/640x360/0f172a/ffffff&text=Clip"
      ];
    } else {
      record.status.status = next > 0 ? "running" : "queued";
      record.summary.status = record.status.status;
      if (!record.status.segments.length && next > 0.5) {
        record.status.segments = [
          { id: `${params.id}-s1`, title: "Intro", start: 0, end: 10 },
          { id: `${params.id}-s2`, title: "Scene", start: 10, end: 35 }
        ];
      }
      if (!record.status.thumbnails.length && next > 0.6) {
        record.status.thumbnails = [
          "https://dummyimage.com/640x360/1e3a8a/ffffff&text=Processing"
        ];
      }
    }
  }

  return NextResponse.json(record.status);
}
