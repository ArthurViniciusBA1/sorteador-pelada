"use client";

import { Trash2 } from "lucide-react";
import { useState } from "react";
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
  AlertDialogTrigger,
} from "@/components/ui/alert-dialog";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import type { ParsedPlayer } from "@/lib/roster-parser";

type ConfirmedPlayersEditorProps = {
  players: ParsedPlayer[];
  onRenamePlayer: (id: string, name: string) => void;
  onRemovePlayer: (id: string) => void;
};

export function ConfirmedPlayersEditor({
  players,
  onRenamePlayer,
  onRemovePlayer,
}: ConfirmedPlayersEditorProps) {
  const [editingId, setEditingId] = useState<string | null>(null);
  const [draftName, setDraftName] = useState("");

  function startEdit(player: ParsedPlayer) {
    setEditingId(player.id);
    setDraftName(player.name);
  }

  function commitEdit() {
    if (editingId) onRenamePlayer(editingId, draftName);
    setEditingId(null);
  }

  if (players.length === 0) {
    return <p className="text-sm text-muted-foreground">Nenhum jogador reconhecido ainda.</p>;
  }

  return (
    <ul className="no-scrollbar flex h-full min-h-0 flex-col gap-1 overflow-y-auto">
      {players.map((player) => (
        <li
          key={player.id}
          className="flex items-center gap-2 rounded-md border border-transparent px-2 py-1.5 hover:border-border"
        >
          {editingId === player.id ? (
            <Input
              autoFocus
              value={draftName}
              onChange={(e) => setDraftName(e.target.value)}
              onBlur={commitEdit}
              onKeyDown={(e) => {
                if (e.key === "Enter") {
                  e.preventDefault();
                  commitEdit();
                } else if (e.key === "Escape") {
                  e.preventDefault();
                  setEditingId(null);
                }
              }}
              className="h-8 flex-1"
            />
          ) : (
            <button
              type="button"
              onClick={() => startEdit(player)}
              className="flex-1 truncate text-left text-sm"
            >
              {player.name}
            </button>
          )}

          <AlertDialog>
            <AlertDialogTrigger asChild>
              <Button
                type="button"
                variant="ghost"
                size="icon"
                className="size-7 shrink-0"
                aria-label={`Remover ${player.name}`}
              >
                <Trash2 className="size-3.5" />
              </Button>
            </AlertDialogTrigger>
            <AlertDialogContent>
              <AlertDialogHeader>
                <AlertDialogTitle>Remover {player.name}?</AlertDialogTitle>
                <AlertDialogDescription>
                  Essa ação não pode ser desfeita. O jogador será retirado da lista.
                </AlertDialogDescription>
              </AlertDialogHeader>
              <AlertDialogFooter>
                <AlertDialogCancel>Cancelar</AlertDialogCancel>
                <AlertDialogAction onClick={() => onRemovePlayer(player.id)}>
                  Remover
                </AlertDialogAction>
              </AlertDialogFooter>
            </AlertDialogContent>
          </AlertDialog>
        </li>
      ))}
    </ul>
  );
}
