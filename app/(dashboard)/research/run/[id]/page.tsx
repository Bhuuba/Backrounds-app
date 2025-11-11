"use client";

import { useEffect, useState } from "react";
import { useMutation, useQuery } from "@tanstack/react-query";
import { useParams } from "next/navigation";
import { toast } from "sonner";

import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { ExportButtons } from "@/components/research/ExportButtons";
import { FindingsTable } from "@/components/research/FindingsTable";
import { JobProgress } from "@/components/research/JobProgress";
import { MarkdownEditor } from "@/components/research/MarkdownEditor";
import {
  fetchResearchResult,
  fetchResearchStatus,
  updateResearchReport
} from "@/lib/api";

export default function ResearchRunPage() {
  const params = useParams<{ id: string }>();
  const jobId = params.id;
  const [report, setReport] = useState("");

  const statusQuery = useQuery({
    queryKey: ["research-status", jobId],
    queryFn: () => fetchResearchStatus(jobId),
    refetchInterval: (query) => (query.state.data?.status === "done" ? false : 2000)
  });

  const resultQuery = useQuery({
    queryKey: ["research-result", jobId],
    queryFn: () => fetchResearchResult(jobId),
    enabled: statusQuery.data?.status === "done"
  });

  useEffect(() => {
    if (resultQuery.data?.reportMd) {
      setReport(resultQuery.data.reportMd);
    }
  }, [resultQuery.data?.reportMd]);

  const saveMutation = useMutation({
    mutationFn: (content: string) => updateResearchReport(jobId, content),
    onSuccess: () => toast.success("Звіт збережено"),
    onError: () => toast.error("Помилка збереження")
  });

  return (
    <div className="space-y-6">
      <header className="space-y-2">
        <h1 className="text-3xl font-semibold">Прогрес дослідження</h1>
        <p className="text-muted-foreground">Статус і результати для запуску {jobId}.</p>
      </header>
      <div className="grid gap-6 lg:grid-cols-[1.2fr_0.8fr]">
        <Card>
          <CardHeader>
            <CardTitle>Репортаж</CardTitle>
            <CardDescription>Редагуйте Markdown і експортуйте у потрібному форматі.</CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            <Tabs defaultValue="report" className="space-y-4">
              <TabsList className="w-full justify-start">
                <TabsTrigger value="report">Report</TabsTrigger>
                <TabsTrigger value="findings">Findings</TabsTrigger>
              </TabsList>
              <TabsContent value="report" className="space-y-4">
                <MarkdownEditor value={report} onChange={setReport} />
                <div className="flex flex-wrap items-center gap-2">
                  <Button onClick={() => saveMutation.mutate(report)} disabled={saveMutation.isPending}>
                    {saveMutation.isPending ? "Збереження..." : "Зберегти"}
                  </Button>
                  <ExportButtons jobId={jobId} />
                  <Button variant="ghost" disabled>
                    Regenerate section (soon)
                  </Button>
                </div>
              </TabsContent>
              <TabsContent value="findings">
                <FindingsTable findings={resultQuery.data?.findings ?? []} />
              </TabsContent>
            </Tabs>
          </CardContent>
        </Card>
        <Card>
          <CardHeader>
            <CardTitle>Статус пайплайну</CardTitle>
            <CardDescription>Поточний прогрес та лог кроків.</CardDescription>
          </CardHeader>
          <CardContent>
            {statusQuery.data ? <JobProgress status={statusQuery.data} /> : <p>Очікуємо статус...</p>}
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
