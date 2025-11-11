"use client";

import { useState } from "react";
import { Download } from "lucide-react";

import { Button } from "@/components/ui/button";
import { trackEvent } from "@/lib/analytics";

interface ExportButtonsProps {
  jobId: string;
}

export function ExportButtons({ jobId }: ExportButtonsProps) {
  const [isExporting, setIsExporting] = useState(false);

  const handleExport = async (format: "md" | "pdf") => {
    setIsExporting(true);
    trackEvent({ type: "research:export", payload: { jobId, format } });
    await new Promise((resolve) => setTimeout(resolve, 800));
    setIsExporting(false);
  };

  return (
    <div className="flex flex-wrap gap-2">
      <Button onClick={() => handleExport("md")} disabled={isExporting}>
        <Download className="mr-2 h-4 w-4" /> Export Markdown
      </Button>
      <Button variant="secondary" onClick={() => handleExport("pdf")} disabled={isExporting}>
        <Download className="mr-2 h-4 w-4" /> Export PDF
      </Button>
    </div>
  );
}
