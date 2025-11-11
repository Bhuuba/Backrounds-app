import { describe, expect, it } from "vitest";

import { cn } from "@/lib/utils";

describe("cn", () => {
  it("merges class names and removes duplicates", () => {
    expect(cn("px-2", "px-2", { hidden: false }, "text-sm")).toBe("px-2 text-sm");
  });
});
