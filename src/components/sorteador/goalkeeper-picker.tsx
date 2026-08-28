"use client";

import { Checkbox as CheckboxPrimitive } from "radix-ui";
import type { ParsedPlayer } from "@/lib/roster-parser";
import { cn } from "@/lib/utils";

type GoalkeeperPickerProps = {
  confirmedPlayers: ParsedPlayer[];
  numTeams: number;
  goalkeeperIds: Set<string>;
  onToggleGoalkeeper: (id: string) => void;
};

export function GoalkeeperPicker({
  confirmedPlayers,
  numTeams,
  goalkeeperIds,
  onToggleGoalkeeper,
}: GoalkeeperPickerProps) {
  const markedCount = confirmedPlayers.filter((p) => goalkeeperIds.has(p.id)).length;

  return (
    <div className="flex h-full min-h-0 flex-col gap-2">
      <p className="shrink-0 text-sm text-muted-foreground">
        {markedCount} de {numTeams} goleiros marcados
      </p>
      <ul className="flex min-h-0 flex-1 flex-col gap-1 overflow-y-auto">
        {confirmedPlayers.map((player) => {
          const isGoalkeeper = goalkeeperIds.has(player.id);
          return (
            <li key={player.id}>
              <CheckboxPrimitive.Root
                checked={isGoalkeeper}
                onCheckedChange={() => onToggleGoalkeeper(player.id)}
                aria-label={`Marcar ${player.name} como goleiro`}
                className={cn(
                  "flex w-full items-center gap-2 rounded-md px-2 py-1.5 text-left text-sm outline-none transition-colors focus-visible:ring-2 focus-visible:ring-ring/50",
                  isGoalkeeper && "bg-primary/10",
                )}
              >
                {isGoalkeeper && (
                  <span className="text-base" aria-hidden>
                    🧤
                  </span>
                )}
                <span className="flex-1">{player.name}</span>
              </CheckboxPrimitive.Root>
            </li>
          );
        })}
      </ul>
    </div>
  );
}
