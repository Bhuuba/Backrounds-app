"use client";

import { useState } from "react";
import { Plus, Trash } from "lucide-react";

import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";

interface CriteriaListProps {
  value: string[];
  onChange: (criteria: string[]) => void;
}

export function CriteriaList({ value, onChange }: CriteriaListProps) {
  const [draft, setDraft] = useState("");

  const addItem = () => {
    const trimmed = draft.trim();
    if (!trimmed) return;
    onChange([...value, trimmed]);
    setDraft("");
  };

  const removeItem = (index: number) => {
    onChange(value.filter((_, i) => i !== index));
  };

  return (
    <div className="space-y-3">
      <div className="flex gap-2">
        <Input
          value={draft}
          onChange={(event) => setDraft(event.target.value)}
          placeholder="Додайте критерій"
          onKeyDown={(event) => {
            if (event.key === "Enter") {
              event.preventDefault();
              addItem();
            }
          }}
          aria-label="Новий критерій"
        />
        <Button type="button" onClick={addItem} aria-label="Додати критерій">
          <Plus className="h-4 w-4" />
        </Button>
      </div>
      <ul className="space-y-2">
        {value.length === 0 && (
          <li className="text-sm text-muted-foreground">Критерії ще не задані.</li>
        )}
        {value.map((item, index) => (
          <li key={`${item}-${index}`} className="flex items-center justify-between rounded-md border px-3 py-2 text-sm">
            <span>{item}</span>
            <Button
              type="button"
              variant="ghost"
              size="icon"
              onClick={() => removeItem(index)}
              aria-label={`Видалити ${item}`}
            >
              <Trash className="h-4 w-4" />
            </Button>
          </li>
        ))}
      </ul>
    </div>
  );
}
