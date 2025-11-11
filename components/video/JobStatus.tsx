import { Badge } from "@/components/ui/badge";
import type { VideoJobStatus } from "@/types/video";

interface JobStatusProps {
  status?: VideoJobStatus;
}

export function JobStatus({ status }: JobStatusProps) {
  if (!status) {
    return <p className="text-sm text-muted-foreground">Завантаження ще не почалось.</p>;
  }

  const label =
    status.status === "done"
      ? "Готово"
      : status.status === "running"
      ? "Обробляємо"
      : status.status === "failed"
      ? "Помилка"
      : "В черзі";

  return (
    <div className="space-y-1">
      <Badge variant={status.status === "failed" ? "destructive" : "secondary"}>{label}</Badge>
      <div className="h-2 w-full rounded-full bg-muted">
        <div
          className="h-2 rounded-full bg-primary transition-all"
          style={{ width: `${Math.round((status.progress ?? 0) * 100)}%` }}
          aria-valuemin={0}
          aria-valuemax={100}
          aria-valuenow={Math.round((status.progress ?? 0) * 100)}
        />
      </div>
    </div>
  );
}
