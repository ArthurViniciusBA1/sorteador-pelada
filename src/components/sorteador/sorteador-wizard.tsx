"use client";

import { House } from "lucide-react";
import Link from "next/link";
import { StepConfigureDraw } from "@/components/sorteador/step-configure-draw";
import { StepConfirmPlayers } from "@/components/sorteador/step-confirm-players";
import { StepFinish } from "@/components/sorteador/step-finish";
import { StepPasteRoster } from "@/components/sorteador/step-paste-roster";
import { StepPlayers } from "@/components/sorteador/step-players";
import { StepResults } from "@/components/sorteador/step-results";
import { useSorteadorState, type WizardStep } from "@/components/sorteador/use-sorteador-state";
import { Button } from "@/components/ui/button";

const STEP_TITLES: Record<WizardStep, string> = {
  paste: "Cole a lista da pelada",
  players: "Confirme os jogadores",
  configure: "Configure o sorteio",
  confirm: "Revise antes de sortear",
  results: "Times sorteados",
  finish: "Finalizar sorteio",
};

export function SorteadorWizard() {
  const [state, dispatch] = useSorteadorState();

  return (
    <div className="mx-auto flex h-dvh w-full max-w-3xl flex-col overflow-hidden">
      <header className="relative shrink-0 bg-primary px-4 py-4 text-primary-foreground">
        <Button
          asChild
          variant="ghost"
          size="icon"
          className="absolute top-1/2 left-2 -translate-y-1/2 text-primary-foreground hover:bg-primary-foreground/10 hover:text-primary-foreground"
        >
          <Link href="/" aria-label="Voltar ao início">
            <House className="size-4" />
          </Link>
        </Button>
        <h1 className="text-center font-heading text-xl font-bold tracking-tight">
          {STEP_TITLES[state.step]}
        </h1>
      </header>

      <div className="flex min-h-0 flex-1 flex-col px-4 pt-3 pb-3">
        {state.step === "paste" && (
          <StepPasteRoster
            rawText={state.rawRosterText}
            onRawTextChange={(text) => dispatch({ type: "SET_RAW_TEXT", text })}
            players={state.players}
            onNext={() => dispatch({ type: "GO_TO_STEP", step: "players" })}
          />
        )}

        {state.step === "players" && (
          <StepPlayers
            players={state.players}
            onRenamePlayer={(id, name) => dispatch({ type: "RENAME_PLAYER", id, name })}
            onAddPlayer={(name) => dispatch({ type: "ADD_MANUAL_PLAYER", name })}
            onRemovePlayer={(id) => dispatch({ type: "REMOVE_PLAYER", id })}
            onBack={() => dispatch({ type: "GO_TO_STEP", step: "paste" })}
            onNext={() => dispatch({ type: "GO_TO_STEP", step: "configure" })}
          />
        )}

        {state.step === "configure" && (
          <StepConfigureDraw
            config={state.config}
            confirmedCount={state.players.length}
            onConfigChange={(patch) => dispatch({ type: "SET_CONFIG", patch })}
            onBack={() => dispatch({ type: "GO_TO_STEP", step: "players" })}
            onNext={() => dispatch({ type: "GO_TO_STEP", step: "confirm" })}
          />
        )}

        {state.step === "confirm" && (
          <StepConfirmPlayers
            confirmedPlayers={state.players}
            fixedGoalkeepers={state.config.fixedGoalkeepers}
            onFixedGoalkeepersChange={(checked) =>
              dispatch({ type: "SET_CONFIG", patch: { fixedGoalkeepers: checked } })
            }
            numTeams={state.config.numTeams}
            goalkeeperIds={state.goalkeeperIds}
            onToggleGoalkeeper={(id) => dispatch({ type: "TOGGLE_GOALKEEPER", id })}
            onBack={() => dispatch({ type: "GO_TO_STEP", step: "configure" })}
            onDraw={() => dispatch({ type: "DRAW" })}
          />
        )}

        {state.step === "results" && state.drawResult && (
          <StepResults
            drawResult={state.drawResult}
            fixedGoalkeepers={state.config.fixedGoalkeepers}
            teamNames={state.teamNames}
            onRenameTeam={(teamId, name) => dispatch({ type: "RENAME_TEAM", teamId, name })}
            onRedraw={() => dispatch({ type: "REDRAW" })}
            onFinish={() => dispatch({ type: "GO_TO_STEP", step: "finish" })}
            onBack={() => dispatch({ type: "GO_TO_STEP", step: "confirm" })}
          />
        )}

        {state.step === "finish" && state.drawResult && (
          <StepFinish
            drawResult={state.drawResult}
            fixedGoalkeepers={state.config.fixedGoalkeepers}
            teamNames={state.teamNames}
            onBack={() => dispatch({ type: "GO_TO_STEP", step: "results" })}
          />
        )}
      </div>
    </div>
  );
}
