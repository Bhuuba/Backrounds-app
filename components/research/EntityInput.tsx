"use client";

import { Textarea } from "@/components/ui/textarea";

interface EntityInputProps {
  value: string[];
  onChange: (entities: string[]) => void;
}

export function EntityInput({ value, onChange }: EntityInputProps) {
  return (
    <Textarea
      value={value.join("\n")}
      onChange={(event) => {
        const next = event.target.value
          .split(/[\n,]+/)
          .map((item) => item.trim())
          .filter(Boolean);
        onChange(next);
      }}
      placeholder="Bank A, Bank B або кожен з нового рядка"
      aria-describedby="entity-hint"
      className="min-h-[120px]"
    />
  );
}
