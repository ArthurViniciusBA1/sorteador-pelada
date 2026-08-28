"use client";

import { ArrowLeft } from "lucide-react";
import Link from "next/link";
import { useEffect, useState } from "react";
import { SavedDrawListItem } from "@/components/history/saved-draw-list-item";
import { Button } from "@/components/ui/button";
import { deleteSavedDraw, listSavedDraws, type SavedDraw } from "@/lib/saved-draws";

export function SavedDrawsList() {
  const [draws, setDraws] = useState<SavedDraw[] | null>(null);

  useEffect(() => {
    setDraws(listSavedDraws());
  }, []);

  function handleDelete(id: string) {
    deleteSavedDraw(id);
    setDraws(listSavedDraws());
  }

  return (
    <div className="mx-auto flex h-dvh w-full max-w-3xl flex-col overflow-hidden">
      <div className="shrink-0 px-4 pt-4">
        <header className="rounded-lg bg-primary/70 px-4 py-4 text-primary-foreground backdrop-blur-xl">
          <h1 className="text-center font-heading text-xl font-bold tracking-tight">
            Sorteios anteriores
          </h1>
        </header>
      </div>

      <div className="flex min-h-0 flex-1 flex-col gap-3 px-4 pt-3 pb-3">
        <div className="min-h-0 flex-1 overflow-y-auto">
          {draws === null ? null : draws.length === 0 ? (
            <p className="text-sm text-muted-foreground">Nenhum sorteio salvo ainda.</p>
          ) : (
            <ul className="flex flex-col gap-2">
              {draws.map((draw) => (
                <li key={draw.id}>
                  <SavedDrawListItem draw={draw} onDelete={handleDelete} />
                </li>
              ))}
            </ul>
          )}
        </div>

        <Button asChild variant="outline" size="lg" className="shrink-0">
          <Link href="/">
            <ArrowLeft className="size-4" />
            Voltar
          </Link>
        </Button>
      </div>
    </div>
  );
}
