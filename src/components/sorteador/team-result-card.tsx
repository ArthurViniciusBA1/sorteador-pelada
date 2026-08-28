"use client";

import type { Team } from "@/lib/team-draw";
import { cn } from "@/lib/utils";

type TeamResultCardProps = {
  team: Team;
  displayName: string;
  fixedGoalkeepers: boolean;
  onRenameTeam?: (name: string) => void;
  /** Locked to light colors for the PNG export copy, which can't rely on oklch theme
   * tokens rendering correctly on canvas. The on-screen copy follows the app's theme. */
  exportMode?: boolean;
};

export function TeamResultCard({
  team,
  displayName,
  fixedGoalkeepers,
  onRenameTeam,
  exportMode = false,
}: TeamResultCardProps) {
  return (
    <div
      className={cn(
        "flex flex-col gap-3 rounded-lg border p-4",
        exportMode
          ? "border-neutral-200 bg-white text-neutral-900"
          : "border-border bg-card text-card-foreground",
      )}
    >
      {onRenameTeam ? (
        <input
          value={displayName}
          onChange={(e) => onRenameTeam(e.target.value)}
          className="w-full border-none bg-transparent font-heading text-lg font-semibold outline-none focus-visible:ring-0"
        />
      ) : (
        <p className="font-heading text-lg font-semibold">{displayName}</p>
      )}

      {team.goalkeeper ? (
        <div
          className={cn(
            "flex items-center gap-2 rounded-md px-2 py-1.5 text-sm",
            exportMode ? "bg-neutral-100" : "bg-muted",
          )}
        >
          <span aria-hidden>🧤</span>
          <span className="font-medium">{team.goalkeeper.name}</span>
        </div>
      ) : (
        fixedGoalkeepers && (
          <p className={cn("text-sm", exportMode ? "text-neutral-400" : "text-muted-foreground")}>
            Sem goleiro fixo
          </p>
        )
      )}

      <ol className="flex flex-col gap-1 text-sm">
        {team.linePlayers.map((player, i) => (
          <li key={player.id} className="flex gap-2">
            <span className={exportMode ? "text-neutral-400" : "text-muted-foreground"}>
              {i + 1}.
            </span>
            {player.name}
          </li>
        ))}
      </ol>
    </div>
  );
}
