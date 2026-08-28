"use client";

import { forwardRef, useImperativeHandle, useRef } from "react";
import { TeamResultCard } from "@/components/sorteador/team-result-card";
import type { Player, Team } from "@/lib/team-draw";
import { cn } from "@/lib/utils";

export type ResultsDisplayHandle = { getExportNode: () => HTMLDivElement | null };

type ResultsDisplayProps = {
  teams: Team[];
  bench: Player[];
  teamNames: Record<string, string>;
  fixedGoalkeepers: boolean;
  onRenameTeam?: (teamId: string, name: string) => void;
};

const EXPORT_COLUMN_WIDTH = 320;

export const ResultsDisplay = forwardRef<ResultsDisplayHandle, ResultsDisplayProps>(
  function ResultsDisplay({ teams, bench, teamNames, fixedGoalkeepers, onRenameTeam }, ref) {
    const exportRef = useRef<HTMLDivElement>(null);
    const exportColumns = teams.length >= 6 ? 3 : 2;

    useImperativeHandle(ref, () => ({
      getExportNode: () => exportRef.current,
    }));

    const renderTeams = (keyPrefix: string, exportMode: boolean) =>
      teams.map((team) => (
        <TeamResultCard
          key={`${keyPrefix}-${team.id}`}
          team={team}
          displayName={teamNames[team.id] ?? team.name}
          fixedGoalkeepers={fixedGoalkeepers}
          onRenameTeam={onRenameTeam ? (name) => onRenameTeam(team.id, name) : undefined}
          exportMode={exportMode}
        />
      ));

    const renderBench = (exportMode: boolean) =>
      bench.length > 0 && (
        <div
          className={cn(
            "rounded-lg border p-4 text-sm",
            exportMode
              ? "border-neutral-200 bg-white text-neutral-700"
              : "border-border bg-card text-card-foreground",
          )}
        >
          <p className={cn("mb-1 font-medium", exportMode ? "text-neutral-900" : "")}>
            Ficaram de fora
          </p>
          {bench.map((p) => p.name).join(", ")}
        </div>
      );

    return (
      <>
        <div className="min-h-0 flex-1 overflow-y-auto">
          <div className="flex flex-col gap-4 p-2">
            <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
              {renderTeams("view", false)}
            </div>
            {renderBench(false)}
          </div>
        </div>

        {/* Fixed-width copy laid out specifically for PNG export: 2 columns normally, 3 once
            there are 6+ teams — independent of the on-screen responsive grid above, and always
            light-themed regardless of the app's current theme (see TeamResultCard's exportMode).
            Clipped to zero height (not pushed off-screen) so html-to-image's DOM clone still
            renders it. */}
        <div className="h-0 overflow-hidden">
          <div
            ref={exportRef}
            aria-hidden
            className="flex flex-col gap-4 bg-white p-4"
            style={{ width: exportColumns * EXPORT_COLUMN_WIDTH }}
          >
            <div className={cn("grid gap-4", exportColumns === 3 ? "grid-cols-3" : "grid-cols-2")}>
              {renderTeams("export", true)}
            </div>
            {renderBench(true)}
          </div>
        </div>
      </>
    );
  },
);
