"use client";

import { useRef } from "react";
import { classifyRosterLines } from "@/lib/roster-parser";
import { cn } from "@/lib/utils";

type HighlightedRosterTextareaProps = {
  value: string;
  onChange: (value: string) => void;
  className?: string;
};

const SHARED_TEXT_CLASSES =
  "whitespace-pre-wrap break-words rounded-lg border px-2.5 py-2 font-mono text-base leading-relaxed md:text-sm";

export function HighlightedRosterTextarea({
  value,
  onChange,
  className,
}: HighlightedRosterTextareaProps) {
  const textareaRef = useRef<HTMLTextAreaElement>(null);
  const overlayRef = useRef<HTMLDivElement>(null);
  const lines = classifyRosterLines(value);

  function syncScroll() {
    if (!textareaRef.current || !overlayRef.current) return;
    overlayRef.current.scrollTop = textareaRef.current.scrollTop;
    overlayRef.current.scrollLeft = textareaRef.current.scrollLeft;
  }

  return (
    <div className={cn("relative min-h-0 flex-1", className)}>
      <div
        ref={overlayRef}
        aria-hidden
        className={cn(SHARED_TEXT_CLASSES, "absolute inset-0 overflow-hidden border-transparent")}
      >
        {lines.map((line, i) => (
          <div
            // biome-ignore lint/suspicious/noArrayIndexKey: lines are recomputed wholesale from `value` every render, never reordered
            key={i}
            className={cn(line.recognized && "rounded bg-primary/20")}
          >
            {line.text.length === 0 ? " " : line.text}
          </div>
        ))}
      </div>
      <textarea
        ref={textareaRef}
        value={value}
        onChange={(e) => onChange(e.target.value)}
        onScroll={syncScroll}
        spellCheck={false}
        autoCorrect="off"
        autoCapitalize="off"
        className={cn(
          SHARED_TEXT_CLASSES,
          "relative h-full w-full resize-none border-input bg-transparent text-transparent caret-foreground outline-none focus-visible:border-ring focus-visible:ring-3 focus-visible:ring-ring/50",
        )}
      />
    </div>
  );
}
