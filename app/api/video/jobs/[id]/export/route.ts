import { NextResponse } from "next/server";

export async function POST(
  request: Request,
  { params }: { params: { id: string } }
) {
  const VIDEO_API_URL = process.env.NEXT_PUBLIC_VIDEO_API_URL || "http://localhost:8001";

  try {
    const body = await request.json();

    // Forward request to Python Backend
    const backendResponse = await fetch(`${VIDEO_API_URL}/api/video/jobs/${params.id}/export`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify(body),
    });

    if (!backendResponse.ok) {
      return NextResponse.json(
        { message: "Backend export failed" },
        { status: backendResponse.status }
      );
    }

    const data = await backendResponse.json();
    return NextResponse.json(data);
  } catch (error) {
    console.error("Export proxy error:", error);
    return NextResponse.json(
      { message: "Internal Server Error" },
      { status: 500 }
    );
  }
}