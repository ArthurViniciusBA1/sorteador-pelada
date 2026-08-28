import { Dices } from "lucide-react";

export function DrawingOverlay() {
  return (
    <div className="flex h-full min-h-0 flex-1 flex-col items-center justify-center gap-4">
      <Dices className="size-24 animate-spin text-primary" style={{ animationDuration: "0.5s" }} />
      <p className="text-base text-muted-foreground">Sorteando os times...</p>
    </div>
  );
}
