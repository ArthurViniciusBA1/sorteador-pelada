"use client";

import { ArrowRight } from "lucide-react";
import { HighlightedRosterTextarea } from "@/components/sorteador/highlighted-roster-textarea";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import type { ParsedPlayer } from "@/lib/roster-parser";

type StepPasteRosterProps = {
  rawText: string;
  onRawTextChange: (text: string) => void;
  players: ParsedPlayer[];
  onNext: () => void;
};

export function StepPasteRoster({
  rawText,
  onRawTextChange,
  players,
  onNext,
}: StepPasteRosterProps) {
  return (
    <div className="flex h-full min-h-0 flex-col gap-3">
      <Card className="flex min-h-0 flex-1 flex-col gap-3 py-4">
        <CardContent className="flex min-h-0 flex-1 flex-col gap-2">
          <HighlightedRosterTextarea value={rawText} onChange={onRawTextChange} />
          <p className="shrink-0 text-sm text-muted-foreground">
            {players.length === 0 ? (
              "Nenhum jogador identificado ainda."
            ) : (
              <>
                <span className="text-base font-bold text-primary">{players.length}</span> jogador
                {players.length === 1 ? "" : "es"} identificado
                {players.length === 1 ? "" : "s"}.
              </>
            )}
          </p>
        </CardContent>
      </Card>

      <Button
        type="button"
        onClick={onNext}
        disabled={players.length === 0}
        size="lg"
        className="shrink-0"
      >
        Continuar
        <ArrowRight className="size-4" />
      </Button>
    </div>
  );
}
