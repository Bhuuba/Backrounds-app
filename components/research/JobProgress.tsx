"use client";

import { useMemo } from "react";
import { CheckCircle2, Loader2, XCircle } from "lucide-react";

import type { ResearchJobStatus } from "@/types/research";
import { cn } from "@/lib/utils";

interface JobProgressProps {
  status: ResearchJobStatus;
}

export function JobProgress({ status }: JobProgressProps) {
  const steps = useMemo(() => status.steps ?? [], [status.steps]);

  return (
    <ol className="space-y-3" aria-live="polite">
      {steps.map((step) => {
        const isDone = step.status === "done";
        const isRunning = step.status === "running";
        const Icon = isDone ? CheckCircle2 : step.status === "failed" ? XCircle : Loader2;

        return (
          <li key={step.name} className="flex items-start gap-3 rounded-md border px-3 py-2">
            <Icon
              className={cn(
                "mt-0.5 h-5 w-5",
                isDone && "text-green-500",
                step.status === "failed" && "text-destructive",
                isRunning && "animate-spin text-primary"
              )}
              aria-hidden
            />
            <div>
              <p className="text-sm font-medium capitalize">{step.name.replace("-", " ")}</p>
              <p className="text-xs text-muted-foreground">
                {step.log ||
                  (isDone
                    ? "Завершено"
                    : isRunning
                    ? "Виконується..."
                    : "Очікує запуску")}
              </p>
            </div>
          </li>
        );
      })}
      <div className="h-2 w-full rounded-full bg-muted">
        <div
          className="h-2 rounded-full bg-primary transition-all"
          style={{ width: `${Math.round((status.progress ?? 0) * 100)}%` }}
          role="progressbar"
          aria-valuemin={0}
          aria-valuemax={100}
          aria-valuenow={Math.round((status.progress ?? 0) * 100)}
        />
      </div>
    </ol>
  );
}
