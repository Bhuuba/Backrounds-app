"use client";

import dynamic from "next/dynamic";
import { useMemo } from "react";

import { Textarea } from "@/components/ui/textarea";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";

const ReactMarkdown = dynamic(() => import("react-markdown"), { ssr: false });

interface MarkdownEditorProps {
  value: string;
  onChange: (next: string) => void;
}

export function MarkdownEditor({ value, onChange }: MarkdownEditorProps) {
  const preview = useMemo(() => value, [value]);

  return (
    <Tabs defaultValue="edit" className="w-full">
      <TabsList className="mb-2 w-full justify-start">
        <TabsTrigger value="edit">Редагування</TabsTrigger>
        <TabsTrigger value="preview">Перегляд</TabsTrigger>
      </TabsList>
      <TabsContent value="edit" className="space-y-2">
        <Textarea
          value={value}
          onChange={(event) => onChange(event.target.value)}
          className="min-h-[240px] font-mono"
          aria-label="Markdown editor"
        />
      </TabsContent>
      <TabsContent value="preview" className="prose prose-sm max-w-none dark:prose-invert">
        <ReactMarkdown>{preview}</ReactMarkdown>
      </TabsContent>
    </Tabs>
  );
}
