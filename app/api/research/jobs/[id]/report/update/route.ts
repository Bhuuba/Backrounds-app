import { NextResponse } from "next/server";

import { mockStore } from "@/lib/mock-db";

export async function POST(
  request: Request,
  { params }: { params: { id: string } }
) {
  const record = mockStore.research.get(params.id);
  if (!record) {
    return NextResponse.json({ message: "Not found" }, { status: 404 });
  }

  const body = (await request.json()) as { reportMd: string };
  record.result.reportMd = body.reportMd;

  return NextResponse.json({ ok: true });
}
