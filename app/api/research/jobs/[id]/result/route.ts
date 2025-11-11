import { NextResponse } from "next/server";

import { mockStore } from "@/lib/mock-db";

export async function GET(
  _request: Request,
  { params }: { params: { id: string } }
) {
  const record = mockStore.research.get(params.id);
  if (!record) {
    return NextResponse.json({ message: "Not found" }, { status: 404 });
  }

  return NextResponse.json(record.result);
}
