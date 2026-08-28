"use client";

import { ArrowLeft, ArrowRight, Plus } from "lucide-react";
import { useState } from "react";
import { ConfirmedPlayersEditor } from "@/components/sorteador/confirmed-players-editor";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import type { ParsedPlayer } from "@/lib/roster-parser";

type StepPlayersProps = {
  players: ParsedPlayer[];
  onRenamePlayer: (id: string, name: string) => void;
  onAddPlayer: (name: string) => void;
  onRemovePlayer: (id: string) => void;
  onBack: () => void;
  onNext: () => void;
};

export function StepPlayers({
  players,
  onRenamePlayer,
  onAddPlayer,
  onRemovePlayer,
  onBack,
  onNext,
}: StepPlayersProps) {
  const [newName, setNewName] = useState("");

  function handleAdd() {
    if (!newName.trim()) return;
    onAddPlayer(newName);
    setNewName("");
  }

  return (
    <div className="flex h-full min-h-0 flex-col gap-3">
      <Card className="flex min-h-0 flex-1 flex-col gap-3 py-4">
        <CardContent className="min-h-0 flex-1 overflow-hidden">
          <ConfirmedPlayersEditor
            players={players}
            onRenamePlayer={onRenamePlayer}
            onRemovePlayer={onRemovePlayer}
          />
        </CardContent>
      </Card>

      <div className="flex shrink-0 items-center gap-2">
        <Input
          placeholder="Adicionar jogador manualmente"
          value={newName}
          onChange={(e) => setNewName(e.target.value)}
          onKeyDown={(e) => {
            if (e.key === "Enter") {
              e.preventDefault();
              handleAdd();
            }
          }}
        />
        <Button type="button" variant="outline" onClick={handleAdd}>
          <Plus className="size-4" />
          Adicionar
        </Button>
      </div>

      <div className="flex shrink-0 justify-between gap-2">
        <Button type="button" variant="outline" onClick={onBack} size="lg">
          <ArrowLeft className="size-4" />
          Voltar
        </Button>
        <Button type="button" onClick={onNext} disabled={players.length === 0} size="lg">
          Continuar
          <ArrowRight className="size-4" />
        </Button>
      </div>
    </div>
  );
}
