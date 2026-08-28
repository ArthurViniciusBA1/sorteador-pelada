import type { DrawResult } from "@/lib/team-draw";

export type SavedDraw = {
  id: string;
  savedAt: string;
  drawResult: DrawResult;
  teamNames: Record<string, string>;
  fixedGoalkeepers: boolean;
};

const STORAGE_KEY = "sorteador-pelada:saved-draws";

function readAll(): SavedDraw[] {
  if (typeof window === "undefined") return [];
  try {
    const raw = window.localStorage.getItem(STORAGE_KEY);
    if (!raw) return [];
    const parsed = JSON.parse(raw);
    return Array.isArray(parsed) ? parsed : [];
  } catch {
    return [];
  }
}

function writeAll(draws: SavedDraw[]): void {
  window.localStorage.setItem(STORAGE_KEY, JSON.stringify(draws));
}

export function listSavedDraws(): SavedDraw[] {
  return readAll().sort((a, b) => b.savedAt.localeCompare(a.savedAt));
}

export function getSavedDraw(id: string): SavedDraw | null {
  return readAll().find((draw) => draw.id === id) ?? null;
}

export function saveDraw(
  drawResult: DrawResult,
  teamNames: Record<string, string>,
  fixedGoalkeepers: boolean,
): SavedDraw {
  const draw: SavedDraw = {
    id: `draw-${Date.now()}-${Math.random().toString(36).slice(2, 8)}`,
    savedAt: new Date().toISOString(),
    drawResult,
    teamNames,
    fixedGoalkeepers,
  };
  writeAll([...readAll(), draw]);
  return draw;
}

export function deleteSavedDraw(id: string): void {
  writeAll(readAll().filter((draw) => draw.id !== id));
}
