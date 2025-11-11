"use client";

import { useRouter } from "next/navigation";

import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { UploadArea } from "@/components/video/UploadArea";

export default function NewVideoPage() {
  const router = useRouter();

  return (
    <div className="space-y-6">
      <header className="space-y-2">
        <h1 className="text-3xl font-semibold">Нове відео</h1>
        <p className="text-muted-foreground">Завантажте матеріал для авто-сегментації та подальшого редагування.</p>
      </header>
      <Card>
        <CardHeader>
          <CardTitle>Завантаження</CardTitle>
          <CardDescription>tus/resumable upload з обмеженням 2GB.</CardDescription>
        </CardHeader>
        <CardContent>
          <UploadArea onUploaded={(jobId) => router.push(`/video/project/${jobId}`)} />
        </CardContent>
      </Card>
    </div>
  );
}
