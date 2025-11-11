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

  if (record.status.status !== "done") {
    const nextProgress = Math.min(1, record.status.progress + 0.2);
    record.status.progress = nextProgress;

    if (nextProgress >= 1) {
      record.status.status = "done";
      record.status.steps = record.status.steps.map((step) => ({ ...step, status: "done" as const }));
      record.summary.status = "done";
      record.result = {
        findings: [
          {
            entity: record.payload.entities[0] ?? "Demo Entity",
            criterion: record.payload.criteria[0] ?? "Coverage",
            evidence: "https://example.com/source",
            snippet: "Стислий опис джерела..."
          }
        ],
        reportMd: `# ${record.summary.topic}\n\n## Висновки\n- Головний пункт для ${record.payload.mode} режиму.\n`
      };
    } else {
      record.status.status = nextProgress > 0 ? "running" : "queued";
      record.status.steps = record.status.steps.map((step, index) => {
        if (index === 0 && nextProgress > 0.2) {
          return { ...step, status: "done" as const };
        }
        if (index === 1 && nextProgress > 0.6) {
          return { ...step, status: "running" as const, log: "Обробка документів..." };
        }
        if (index === 2 && nextProgress > 0.8) {
          return { ...step, status: "running" as const, log: "Генерація звіту..." };
        }
        return step;
      });
      record.summary.status = record.status.status;
    }
  }

  return NextResponse.json(record.status);
}
