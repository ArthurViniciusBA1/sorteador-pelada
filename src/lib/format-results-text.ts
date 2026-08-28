import type { Player, Team } from "@/lib/team-draw";

export function formatResultsAsText(
  teams: Team[],
  bench: Player[],
  teamNames: Record<string, string>,
): string {
  const blocks = teams.map((team) => {
    const lines = [`*${teamNames[team.id] ?? team.name}*`];
    if (team.goalkeeper) {
      lines.push(`🧤 Goleiro: ${team.goalkeeper.name}`);
    }
    team.linePlayers.forEach((player, i) => {
      lines.push(`${i + 1}. ${player.name}`);
    });
    return lines.join("\n");
  });

  const parts = [blocks.join("\n\n")];

  if (bench.length > 0) {
    parts.push(`Ficaram de fora: ${bench.map((p) => p.name).join(", ")}`);
  }

  return parts.join("\n\n").trim();
}
