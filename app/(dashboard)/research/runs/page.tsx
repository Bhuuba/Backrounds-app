"use client";

import { useQuery } from "@tanstack/react-query";
import Link from "next/link";

import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { listResearchJobs } from "@/lib/api";

const statusMap: Record<string, { label: string; variant: "default" | "secondary" | "destructive" }> = {
  queued: { label: "Queued", variant: "secondary" },
  running: { label: "Running", variant: "default" },
  done: { label: "Done", variant: "default" },
  failed: { label: "Failed", variant: "destructive" }
};

export default function ResearchRunsPage() {
  const { data, isLoading } = useQuery({ queryKey: ["research-runs"], queryFn: () => listResearchJobs(50) });

  return (
    <div className="space-y-6">
      <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
        <div>
          <h1 className="text-3xl font-semibold">Запуски досліджень</h1>
          <p className="text-muted-foreground">Стежте за прогресом та відкривайте звіти.</p>
        </div>
        <Button asChild>
          <Link href="/research/new">Новий запит</Link>
        </Button>
      </div>
      <Card>
        <CardHeader>
          <CardTitle>Останні запуски</CardTitle>
        </CardHeader>
        <CardContent>
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>ID</TableHead>
                <TableHead>Тема</TableHead>
                <TableHead>Статус</TableHead>
                <TableHead>Дата</TableHead>
                <TableHead className="text-right">Дія</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {isLoading && (
                <TableRow>
                  <TableCell colSpan={5} className="text-center text-sm text-muted-foreground">
                    Завантаження...
                  </TableCell>
                </TableRow>
              )}
              {data?.map((job) => {
                const badge = statusMap[job.status] ?? statusMap.queued;
                return (
                  <TableRow key={job.id}>
                    <TableCell className="font-mono text-xs">{job.id}</TableCell>
                    <TableCell>{job.topic}</TableCell>
                    <TableCell>
                      <Badge variant={badge.variant}>{badge.label}</Badge>
                    </TableCell>
                    <TableCell>{new Date(job.createdAt).toLocaleString()}</TableCell>
                    <TableCell className="text-right">
                      <Button asChild size="sm" variant="outline">
                        <Link href={`/research/run/${job.id}`}>Відкрити</Link>
                      </Button>
                    </TableCell>
                  </TableRow>
                );
              })}
              {!isLoading && !data?.length && (
                <TableRow>
                  <TableCell colSpan={5} className="text-center text-sm text-muted-foreground">
                    Ще немає запусків. Створіть перший запит.
                  </TableCell>
                </TableRow>
              )}
            </TableBody>
          </Table>
        </CardContent>
      </Card>
    </div>
  );
}
