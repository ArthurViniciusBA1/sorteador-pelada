"use client";

import { ArrowLeft, Copy, Download, Save } from "lucide-react";
import { useRouter } from "next/navigation";
import { useRef, useState } from "react";
import { toast } from "sonner";
import { ResultsDisplay, type ResultsDisplayHandle } from "@/components/sorteador/results-display";
import { Button } from "@/components/ui/button";
import { buildResultsFilename, exportNodeAsPng } from "@/lib/export-image";
import { formatResultsAsText } from "@/lib/format-results-text";
import { saveDraw } from "@/lib/saved-draws";
import type { DrawResult } from "@/lib/team-draw";

type StepFinishProps = {
  drawResult: DrawResult;
  fixedGoalkeepers: boolean;
  teamNames: Record<string, string>;
  onBack: () => void;
};

export function StepFinish({ drawResult, fixedGoalkeepers, teamNames, onBack }: StepFinishProps) {
  const router = useRouter();
  const displayRef = useRef<ResultsDisplayHandle>(null);
  const [saving, setSaving] = useState(false);
  const { teams, bench } = drawResult;

  async function handleCopy() {
    try {
      await navigator.clipboard.writeText(formatResultsAsText(teams, bench, teamNames));
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

  function handleSaveDraw() {
    setSaving(true);
    saveDraw(drawResult, teamNames, fixedGoalkeepers);
    toast.success("Sorteio salvo!");
    router.push("/");
  }

  return (
    <div className="flex h-full min-h-0 flex-col gap-3">
      <ResultsDisplay
        ref={displayRef}
        teams={teams}
        bench={bench}
        teamNames={teamNames}
        fixedGoalkeepers={fixedGoalkeepers}
      />

      <div className="flex shrink-0 flex-col gap-2">
        <div className="flex items-center gap-2">
          <Button type="button" variant="outline" size="icon" onClick={onBack} aria-label="Voltar">
            <ArrowLeft className="size-4" />
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
        <Button
          type="button"
          onClick={handleSaveDraw}
          disabled={saving}
          size="lg"
          className="w-full"
        >
          <Save className="size-4" />
          Salvar sorteio
        </Button>
      </div>
    </div>
  );
}
