"use client";

import { ArrowLeft, Shuffle } from "lucide-react";
import { useState } from "react";
import { DrawingOverlay } from "@/components/sorteador/drawing-overlay";
import { GoalkeeperPicker } from "@/components/sorteador/goalkeeper-picker";
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
import { Card, CardContent } from "@/components/ui/card";
import { Label } from "@/components/ui/label";
import { Switch } from "@/components/ui/switch";
import type { ParsedPlayer } from "@/lib/roster-parser";

const DRAW_ANIMATION_MS = 2000;

type StepConfirmPlayersProps = {
  confirmedPlayers: ParsedPlayer[];
  fixedGoalkeepers: boolean;
  onFixedGoalkeepersChange: (checked: boolean) => void;
  numTeams: number;
  goalkeeperIds: Set<string>;
  onToggleGoalkeeper: (id: string) => void;
  onBack: () => void;
  onDraw: () => void;
};

export function StepConfirmPlayers({
  confirmedPlayers,
  fixedGoalkeepers,
  onFixedGoalkeepersChange,
  numTeams,
  goalkeeperIds,
  onToggleGoalkeeper,
  onBack,
  onDraw,
}: StepConfirmPlayersProps) {
  const [confirmOpen, setConfirmOpen] = useState(false);
  const [isDrawing, setIsDrawing] = useState(false);
  const markedCount = confirmedPlayers.filter((p) => goalkeeperIds.has(p.id)).length;
  const hasMismatch = fixedGoalkeepers && markedCount !== numTeams;

  function startDraw() {
    setIsDrawing(true);
    setTimeout(() => {
      setIsDrawing(false);
      onDraw();
    }, DRAW_ANIMATION_MS);
  }

  function handleDrawClick() {
    if (hasMismatch) {
      setConfirmOpen(true);
    } else {
      startDraw();
    }
  }

  function confirmDraw() {
    setConfirmOpen(false);
    startDraw();
  }

  if (isDrawing) {
    return <DrawingOverlay />;
  }

  return (
    <div className="flex h-full min-h-0 flex-col gap-3">
      <Card className="flex min-h-0 flex-1 flex-col gap-3 py-4">
        <CardContent className="min-h-0 flex-1 overflow-hidden">
          {fixedGoalkeepers ? (
            <GoalkeeperPicker
              confirmedPlayers={confirmedPlayers}
              numTeams={numTeams}
              goalkeeperIds={goalkeeperIds}
              onToggleGoalkeeper={onToggleGoalkeeper}
            />
          ) : (
            <ul className="flex h-full flex-col gap-1 overflow-y-auto text-sm text-muted-foreground">
              {confirmedPlayers.map((player) => (
                <li key={player.id} className="px-2 py-1">
                  {player.name}
                </li>
              ))}
            </ul>
          )}
        </CardContent>
      </Card>

      <div className="flex shrink-0 items-center justify-between gap-4 rounded-md border bg-muted/50 p-3">
        <div className="flex flex-col gap-0.5">
          <Label htmlFor="fixed-goalkeepers">Goleiros fixos</Label>
          <p className="text-sm text-muted-foreground">
            Sorteia 1 goleiro por time separadamente dos jogadores de linha.
          </p>
        </div>
        <Switch
          id="fixed-goalkeepers"
          checked={fixedGoalkeepers}
          onCheckedChange={onFixedGoalkeepersChange}
        />
      </div>

      <div className="flex shrink-0 justify-between gap-2">
        <Button type="button" variant="outline" onClick={onBack} size="lg">
          <ArrowLeft className="size-4" />
          Voltar
        </Button>
        <Button
          type="button"
          onClick={handleDrawClick}
          disabled={confirmedPlayers.length === 0}
          size="lg"
        >
          <Shuffle className="size-4" />
          Sortear times
        </Button>
      </div>

      <AlertDialog open={confirmOpen} onOpenChange={setConfirmOpen}>
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>Nem todo time vai ter goleiro fixo</AlertDialogTitle>
            <AlertDialogDescription>
              {markedCount} de {numTeams} goleiros marcados
              {markedCount < numTeams
                ? " — alguns times ficarão sem goleiro fixo."
                : " — o excedente entra no sorteio normal de linha."}
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel>Cancelar</AlertDialogCancel>
            <AlertDialogAction onClick={confirmDraw}>Sortear mesmo assim</AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    </div>
  );
}
