"use client";

import { LayoutGrid, List } from "lucide-react";

export type LayoutMode = "grid" | "list";

interface LayoutToggleProps {
  layout: LayoutMode;
  onChange: (layout: LayoutMode) => void;
}

export function LayoutToggle({ layout, onChange }: LayoutToggleProps) {
  return (
    <div className="flex rounded-lg bg-white/[0.04] border border-white/[0.06] p-0.5">
      <button
        onClick={() => onChange("grid")}
        className={`p-1.5 rounded-md transition-all duration-200 ${
          layout === "grid"
            ? "bg-white/[0.08] text-zinc-200"
            : "text-zinc-500 hover:text-zinc-300"
        }`}
      >
        <LayoutGrid className="w-3.5 h-3.5" />
      </button>
      <button
        onClick={() => onChange("list")}
        className={`p-1.5 rounded-md transition-all duration-200 ${
          layout === "list"
            ? "bg-white/[0.08] text-zinc-200"
            : "text-zinc-500 hover:text-zinc-300"
        }`}
      >
        <List className="w-3.5 h-3.5" />
      </button>
    </div>
  );
}
