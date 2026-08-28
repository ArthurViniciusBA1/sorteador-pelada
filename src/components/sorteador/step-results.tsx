"use client";

import { ArrowLeft, CheckCircle2, Shuffle } from "lucide-react";
import { useState } from "react";
import { DrawingOverlay } from "@/components/sorteador/drawing-overlay";
import { ResultsDisplay } from "@/components/sorteador/results-display";
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
} from "@/components/ui/alert-dialog";
import { Button } from "@/components/ui/button";
import type { DrawResult } from "@/lib/team-draw";

type StepResultsProps = {
  drawResult: DrawResult;
  fixedGoalkeepers: boolean;
  teamNames: Record<string, string>;
  onRenameTeam: (teamId: string, name: string) => void;
  onRedraw: () => void;
  onFinish: () => void;
  onBack: () => void;
};

const DRAW_ANIMATION_MS = 2000;

export function StepResults({
  drawResult,
  fixedGoalkeepers,
  teamNames,
  onRenameTeam,
  onRedraw,
  onFinish,
  onBack,
}: StepResultsProps) {
  const [isDrawing, setIsDrawing] = useState(false);
  const [confirmOpen, setConfirmOpen] = useState(false);
  const { teams, bench, shortfalls } = drawResult;

  function startRedraw() {
    setIsDrawing(true);
    setTimeout(() => {
      setIsDrawing(false);
      onRedraw();
    }, DRAW_ANIMATION_MS);
  }

  function confirmRedraw() {
    setConfirmOpen(false);
    startRedraw();
  }

  if (isDrawing) {
    return <DrawingOverlay />;
  }

  return (
    <div className="flex h-full min-h-0 flex-col gap-3">
      {shortfalls.length > 0 && (
        <div className="shrink-0 rounded-md border border-amber-300 bg-amber-50 px-3 py-2 text-sm text-amber-800 dark:border-amber-900 dark:bg-amber-950 dark:text-amber-300">
          {shortfalls.length === 1
            ? "1 time ficou com menos jogadores que o configurado."
            : `${shortfalls.length} times ficaram com menos jogadores que o configurado.`}
        </div>
      )}

      <ResultsDisplay
        teams={teams}
        bench={bench}
        teamNames={teamNames}
        fixedGoalkeepers={fixedGoalkeepers}
        onRenameTeam={onRenameTeam}
      />

      <div className="flex shrink-0 flex-col gap-2">
        <div className="flex items-center justify-between gap-2">
          <Button type="button" variant="outline" onClick={onBack}>
            <ArrowLeft className="size-4" />
            Voltar
          </Button>
          <Button type="button" variant="outline" onClick={() => setConfirmOpen(true)}>
            <Shuffle className="size-4" />
            Sortear novamente
          </Button>
        </div>
        <Button type="button" onClick={onFinish} size="lg" className="w-full">
          <CheckCircle2 className="size-4" />
          Finalizar
        </Button>
      </div>

      <AlertDialog open={confirmOpen} onOpenChange={setConfirmOpen}>
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>Sortear novamente?</AlertDialogTitle>
            <AlertDialogDescription>
              Isso vai substituir o resultado atual por um novo sorteio.
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel>Cancelar</AlertDialogCancel>
            <AlertDialogAction onClick={confirmRedraw}>Sim, sortear</AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    </div>
  );
}
