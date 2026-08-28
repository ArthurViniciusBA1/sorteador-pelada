"use client";

import { Trash2 } from "lucide-react";
import Link from "next/link";
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
import type { SavedDraw } from "@/lib/saved-draws";

type SavedDrawListItemProps = {
  draw: SavedDraw;
  onDelete: (id: string) => void;
};

function formatSavedAt(iso: string): string {
  return new Date(iso).toLocaleString("pt-BR", {
    day: "2-digit",
    month: "2-digit",
    year: "numeric",
    hour: "2-digit",
    minute: "2-digit",
  });
}

export function SavedDrawListItem({ draw, onDelete }: SavedDrawListItemProps) {
  const teamCount = draw.drawResult.teams.length;

  return (
    <div className="flex items-center gap-2 rounded-md border bg-muted/50 p-3">
      <Link href={`/sorteios/${draw.id}`} className="flex-1">
        <p className="text-sm font-medium">{formatSavedAt(draw.savedAt)}</p>
        <p className="text-xs text-muted-foreground">
          {teamCount} time{teamCount === 1 ? "" : "s"}
        </p>
      </Link>

      <AlertDialog>
        <AlertDialogTrigger asChild>
          <Button
            type="button"
            variant="ghost"
            size="icon"
            className="shrink-0"
            aria-label="Remover sorteio"
          >
            <Trash2 className="size-4" />
          </Button>
        </AlertDialogTrigger>
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>Remover este sorteio?</AlertDialogTitle>
            <AlertDialogDescription>Essa ação não pode ser desfeita.</AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel>Cancelar</AlertDialogCancel>
            <AlertDialogAction onClick={() => onDelete(draw.id)}>Remover</AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    </div>
  );
}
