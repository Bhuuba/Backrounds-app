"use client";

import { useState } from "react";
import { useMutation } from "@tanstack/react-query";
import { useRouter } from "next/navigation";
import { toast } from "sonner";

import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Textarea } from "@/components/ui/textarea";
import { CriteriaList } from "@/components/research/CriteriaList";
import { EntityInput } from "@/components/research/EntityInput";
import { createResearchJob } from "@/lib/api";
import { trackEvent } from "@/lib/analytics";
import type { ResearchLang, ResearchMode } from "@/types/research";

const defaultCriteria = ["Фінансові показники", "Публікації у ЗМІ"];

export default function NewResearchPage() {
  const router = useRouter();
  const [query, setQuery] = useState("Банківський сектор України");
  const [criteria, setCriteria] = useState<string[]>(defaultCriteria);
  const [entities, setEntities] = useState<string[]>(["Bank A", "Bank B"]);
  const [lang, setLang] = useState<ResearchLang>("uk");
  const [mode, setMode] = useState<ResearchMode>("deep");

  const mutation = useMutation({
    mutationFn: createResearchJob,
    onSuccess: ({ jobId }) => {
      toast.success("Запуск створено");
      trackEvent({ type: "research:create", payload: { jobId } });
      router.push(`/research/run/${jobId}`);
    },
    onError: () => toast.error("Помилка запуску")
  });

  const handleSubmit = (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    mutation.mutate({ query, criteria, entities, lang, mode });
  };

  return (
    <div className="space-y-6">
      <header className="space-y-2">
        <h1 className="text-3xl font-semibold">Нове дослідження</h1>
        <p className="text-muted-foreground">Опишіть задачу, критерії та сутності для моніторингу.</p>
      </header>
      <Card>
        <form onSubmit={handleSubmit} className="space-y-6">
          <CardHeader>
            <CardTitle>Параметри запиту</CardTitle>
            <CardDescription>Гнучкі налаштування для fast/deep режимів дослідження.</CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="space-y-2">
              <Label htmlFor="query">Питання</Label>
              <Textarea
                id="query"
                value={query}
                onChange={(event) => setQuery(event.target.value)}
                placeholder="Опишіть дослідницьке питання"
                required
                className="min-h-[120px]"
              />
            </div>
            <div className="grid gap-4 md:grid-cols-2">
              <div className="space-y-2">
                <Label>Критерії</Label>
                <CriteriaList value={criteria} onChange={setCriteria} />
              </div>
              <div className="space-y-2">
                <Label htmlFor="entities">Сутності</Label>
                <EntityInput value={entities} onChange={setEntities} />
                <p id="entity-hint" className="text-xs text-muted-foreground">
                  Використовуйте кому або новий рядок.
                </p>
              </div>
            </div>
            <div className="grid gap-4 md:grid-cols-2">
              <div className="space-y-2">
                <Label htmlFor="lang">Мова</Label>
                <Select value={lang} onValueChange={(value: ResearchLang) => setLang(value)}>
                  <SelectTrigger id="lang">
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="uk">Українська</SelectItem>
                    <SelectItem value="ru">Російська</SelectItem>
                    <SelectItem value="en">English</SelectItem>
                  </SelectContent>
                </Select>
              </div>
              <div className="space-y-2">
                <Label htmlFor="mode">Режим</Label>
                <Select value={mode} onValueChange={(value: ResearchMode) => setMode(value)}>
                  <SelectTrigger id="mode">
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="fast">Fast — 3-5 хв</SelectItem>
                    <SelectItem value="deep">Deep — 15-20 хв</SelectItem>
                  </SelectContent>
                </Select>
              </div>
            </div>
            <div className="space-y-2">
              <Label htmlFor="notify">Email для нотифікацій (опц.)</Label>
              <Input id="notify" type="email" placeholder="ops@company.com" disabled />
            </div>
          </CardContent>
          <div className="flex items-center justify-between border-t px-6 py-4">
            <p className="text-xs text-muted-foreground">
              Дані надсилаються у безпечному каналі. Ви зможете стежити за прогресом у live-режимі.
            </p>
            <Button type="submit" disabled={mutation.isPending}>
              {mutation.isPending ? "Запускаємо..." : "Створити запуск"}
            </Button>
          </div>
        </form>
      </Card>
    </div>
  );
}
