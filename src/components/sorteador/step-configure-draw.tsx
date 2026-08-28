"use client";

import { ArrowLeft, ArrowRight } from "lucide-react";
import { NumberStepper } from "@/components/sorteador/number-stepper";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Label } from "@/components/ui/label";
import { type DrawConfig, suggestNumTeams, suggestPlayersPerTeam } from "@/lib/team-draw";
import { cn } from "@/lib/utils";

type StepConfigureDrawProps = {
  config: DrawConfig;
  confirmedCount: number;
  onConfigChange: (patch: Partial<DrawConfig>) => void;
  onBack: () => void;
  onNext: () => void;
};

export function StepConfigureDraw({
  config,
  confirmedCount,
  onConfigChange,
  onBack,
  onNext,
}: StepConfigureDrawProps) {
  // Each stepper's ceiling is "how far can this go without asking for more players than
  // exist, given where the other stepper currently sits" — not a fixed shared maximum.
  // Going lower than the ceiling is fine (it just means some players sit out); going
  // higher never is, so each field caps independently instead of forcing the other to
  // jump to whatever uses up every confirmed player.
  const playersPerTeamMax = suggestPlayersPerTeam(confirmedCount, config.numTeams);
  const numTeamsMax = suggestNumTeams(confirmedCount, config.playersPerTeam);

  return (
    <div className="flex h-full min-h-0 flex-col gap-3">
      <Card className="flex min-h-0 flex-1 flex-col gap-3 py-4">
        <CardContent className="flex min-h-0 flex-1 flex-col justify-center gap-4 overflow-y-auto">
          <div className="flex flex-col items-center gap-2 rounded-md border bg-muted/50 p-4">
            <div className="flex flex-col items-center gap-0.5">
              <Label id="players-per-team-label">Número de jogadores por time</Label>
              <p className="text-xs text-muted-foreground">(incluindo goleiro)</p>
            </div>
            <NumberStepper
              id="players-per-team"
              value={config.playersPerTeam}
              min={1}
              max={playersPerTeamMax}
              onChange={(playersPerTeam) => onConfigChange({ playersPerTeam })}
            />
            <p
              className={cn(
                "text-xs text-muted-foreground",
                config.playersPerTeam < playersPerTeamMax && "invisible",
              )}
            >
              Máximo com {config.numTeams} time{config.numTeams === 1 ? "" : "s"}.
            </p>
          </div>

          <div className="flex flex-col items-center gap-2 rounded-md border bg-muted/50 p-4">
            <Label id="num-teams-label">Número de times</Label>
            <NumberStepper
              id="num-teams"
              value={config.numTeams}
              min={1}
              max={numTeamsMax}
              onChange={(numTeams) => onConfigChange({ numTeams })}
            />
            <p
              className={cn(
                "text-xs text-muted-foreground",
                config.numTeams < numTeamsMax && "invisible",
              )}
            >
              Máximo com {config.playersPerTeam} jogador{config.playersPerTeam === 1 ? "" : "es"}{" "}
              por time.
            </p>
          </div>
        </CardContent>
      </Card>

      <div className="flex shrink-0 justify-between gap-2">
        <Button type="button" variant="outline" onClick={onBack} size="lg">
          <ArrowLeft className="size-4" />
          Voltar
        </Button>
        <Button type="button" onClick={onNext} size="lg">
          Continuar
          <ArrowRight className="size-4" />
        </Button>
      </div>
    </div>
  );
}
