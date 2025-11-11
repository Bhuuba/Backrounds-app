"use client";

import { useQuery } from "@tanstack/react-query";
import Link from "next/link";

import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { listVideoJobs } from "@/lib/api";

const statusLabel: Record<string, string> = {
  queued: "Queued",
  running: "Processing",
  done: "Done",
  failed: "Failed"
};

export default function VideoProjectsPage() {
  const { data, isLoading } = useQuery({ queryKey: ["video-projects"], queryFn: () => listVideoJobs(50) });

  return (
    <div className="space-y-6">
      <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
        <div>
          <h1 className="text-3xl font-semibold">Проекти відео</h1>
          <p className="text-muted-foreground">Переглядайте статуси авто-сегментації та редагуйте таймлайни.</p>
        </div>
        <Button asChild>
          <Link href="/video/new">Нове відео</Link>
        </Button>
      </div>
      <Card>
        <CardHeader>
          <CardTitle>Останні обробки</CardTitle>
        </CardHeader>
        <CardContent>
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>ID</TableHead>
                <TableHead>Файл</TableHead>
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
              {data?.map((job) => (
                <TableRow key={job.id}>
                  <TableCell className="font-mono text-xs">{job.id}</TableCell>
                  <TableCell>{job.filename}</TableCell>
                  <TableCell>
                    <Badge variant={job.status === "failed" ? "destructive" : "secondary"}>
                      {statusLabel[job.status] ?? job.status}
                    </Badge>
                  </TableCell>
                  <TableCell>{new Date(job.createdAt).toLocaleString()}</TableCell>
                  <TableCell className="text-right">
                    <Button asChild size="sm" variant="outline">
                      <Link href={`/video/project/${job.id}`}>Відкрити</Link>
                    </Button>
                  </TableCell>
                </TableRow>
              ))}
              {!isLoading && !data?.length && (
                <TableRow>
                  <TableCell colSpan={5} className="text-center text-sm text-muted-foreground">
                    Немає проектів. Завантажте відео щоб почати.
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
