"use client";

import { ArrowLeft, Copy, Download } from "lucide-react";
import Link from "next/link";
import { useEffect, useRef, useState } from "react";
import { toast } from "sonner";
import { ResultsDisplay, type ResultsDisplayHandle } from "@/components/sorteador/results-display";
import { Button } from "@/components/ui/button";
import { buildResultsFilename, exportNodeAsPng } from "@/lib/export-image";
import { formatResultsAsText } from "@/lib/format-results-text";
import { getSavedDraw, type SavedDraw } from "@/lib/saved-draws";

function formatSavedAt(iso: string): string {
  return new Date(iso).toLocaleString("pt-BR", {
    day: "2-digit",
    month: "2-digit",
    year: "numeric",
    hour: "2-digit",
    minute: "2-digit",
  });
}

export function SavedDrawView({ id }: { id: string }) {
  const displayRef = useRef<ResultsDisplayHandle>(null);
  const [draw, setDraw] = useState<SavedDraw | null | undefined>(undefined);

  useEffect(() => {
    setDraw(getSavedDraw(id));
  }, [id]);

  async function handleCopy() {
    if (!draw) return;
    try {
      const text = formatResultsAsText(
        draw.drawResult.teams,
        draw.drawResult.bench,
        draw.teamNames,
      );
      await navigator.clipboard.writeText(text);
      toast.success("Lista copiada!");
    } catch {
      toast.error("Não foi possível copiar. Tente novamente.");
    }
  }

  async function handleExport() {
    const node = displayRef.current?.getExportNode();
    if (!node) return;
    try {
      await exportNodeAsPng(node, buildResultsFilename());
      toast.success("Imagem salva!");
    } catch {
      toast.error("Falha ao salvar imagem.");
    }
  }

  if (draw === undefined) {
    return null;
  }

  if (draw === null) {
    return (
      <div className="mx-auto flex h-dvh w-full max-w-3xl flex-col overflow-hidden">
        <div className="shrink-0 px-4 pt-4">
          <header className="rounded-lg bg-primary/70 px-4 py-4 text-primary-foreground backdrop-blur-xl">
            <h1 className="text-center font-heading text-xl font-bold tracking-tight">
              Sorteio não encontrado
            </h1>
          </header>
        </div>
        <div className="flex min-h-0 flex-1 flex-col justify-center gap-3 px-4">
          <p className="text-center text-sm text-muted-foreground">
            Esse sorteio não existe mais neste navegador.
          </p>
          <Button asChild variant="outline" size="lg">
            <Link href="/sorteios">
              <ArrowLeft className="size-4" />
              Voltar
            </Link>
          </Button>
        </div>
      </div>
    );
  }

  return (
    <div className="mx-auto flex h-dvh w-full max-w-3xl flex-col overflow-hidden">
      <div className="shrink-0 px-4 pt-4">
        <header className="rounded-lg bg-primary/70 px-4 py-4 text-primary-foreground backdrop-blur-xl">
          <h1 className="text-center font-heading text-xl font-bold tracking-tight">
            Sorteio de {formatSavedAt(draw.savedAt)}
          </h1>
        </header>
      </div>

      <div className="flex min-h-0 flex-1 flex-col gap-3 px-4 pt-3 pb-3">
        <ResultsDisplay
          ref={displayRef}
          teams={draw.drawResult.teams}
          bench={draw.drawResult.bench}
          teamNames={draw.teamNames}
          fixedGoalkeepers={draw.fixedGoalkeepers}
        />

        <div className="flex shrink-0 items-center gap-2">
          <Button asChild variant="outline" size="icon">
            <Link href="/sorteios" aria-label="Voltar">
              <ArrowLeft className="size-4" />
            </Link>
          </Button>
          <Button
            type="button"
            variant="outline"
            className="flex-1"
            onClick={() => void handleCopy()}
          >
            <Copy className="size-4" />
            Copiar lista
          </Button>
          <Button
            type="button"
            variant="outline"
            className="flex-1"
            onClick={() => void handleExport()}
          >
            <Download className="size-4" />
            Salvar imagem
          </Button>
        </div>
      </div>
    </div>
  );
}
