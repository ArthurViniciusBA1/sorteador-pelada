"use client";

import { Minus, Plus } from "lucide-react";
import { Button } from "@/components/ui/button";

type NumberStepperProps = {
  value: number;
  onChange: (value: number) => void;
  min?: number;
  max?: number;
  id?: string;
};

export function NumberStepper({ value, onChange, min = 1, max, id }: NumberStepperProps) {
  return (
    <div className="flex items-center gap-4">
      <Button
        type="button"
        variant="outline"
        size="icon"
        className="size-11"
        onClick={() => onChange(Math.max(min, value - 1))}
        disabled={value <= min}
        aria-label="Diminuir"
      >
        <Minus className="size-5" />
      </Button>
      <span id={id} className="w-20 text-center text-6xl font-bold tabular-nums">
        {value}
      </span>
      <Button
        type="button"
        variant="outline"
        size="icon"
        className="size-11"
        onClick={() => onChange(max === undefined ? value + 1 : Math.min(max, value + 1))}
        disabled={max !== undefined && value >= max}
        aria-label="Aumentar"
      >
        <Plus className="size-5" />
      </Button>
    </div>
  );
}
