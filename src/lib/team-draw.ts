export type Player = { id: string; name: string };

export type DrawConfig = {
  numTeams: number;
  playersPerTeam: number;
  fixedGoalkeepers: boolean;
};

export type Team = {
  id: string;
  name: string;
  goalkeeper: Player | null;
  linePlayers: Player[];
};

export type DrawResult = {
  teams: Team[];
  bench: Player[];
  shortfalls: { teamId: string; missing: number }[];
};

export function suggestNumTeams(confirmedCount: number, playersPerTeam: number): number {
  if (playersPerTeam <= 0) return 1;
  return Math.max(1, Math.floor(confirmedCount / playersPerTeam));
}

export function suggestPlayersPerTeam(confirmedCount: number, numTeams: number): number {
  if (numTeams <= 0) return 1;
  return Math.max(1, Math.floor(confirmedCount / numTeams));
}

export function shuffle<T>(items: T[]): T[] {
  const result = items.slice();
  for (let i = result.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1));
    const tmp = result[i];
    result[i] = result[j];
    result[j] = tmp;
  }
  return result;
}

export function drawTeams(
  confirmedPlayers: Player[],
  goalkeeperIds: Set<string>,
  config: DrawConfig,
): DrawResult {
  const { numTeams, playersPerTeam, fixedGoalkeepers } = config;

  const teams: Team[] = Array.from({ length: numTeams }, (_, i) => ({
    id: `team-${i}`,
    name: `Time ${i + 1}`,
    goalkeeper: null,
    linePlayers: [],
  }));

  let goalkeeperPool: Player[] = [];
  let linePool: Player[];

  if (fixedGoalkeepers) {
    goalkeeperPool = confirmedPlayers.filter((p) => goalkeeperIds.has(p.id));
    linePool = confirmedPlayers.filter((p) => !goalkeeperIds.has(p.id));
  } else {
    linePool = confirmedPlayers.slice();
  }

  if (fixedGoalkeepers && goalkeeperPool.length > 0) {
    const shuffledKeepers = shuffle(goalkeeperPool);
    const teamOrder = shuffle(teams.map((_, i) => i));
    const assignedCount = Math.min(shuffledKeepers.length, numTeams);

    for (let i = 0; i < assignedCount; i++) {
      teams[teamOrder[i]].goalkeeper = shuffledKeepers[i];
    }

    if (shuffledKeepers.length > numTeams) {
      linePool = linePool.concat(shuffledKeepers.slice(numTeams));
    }
  }

  // playersPerTeam is the total team size including the goalkeeper slot, so a team that
  // already has a goalkeeper has one fewer line-player slot than a team that doesn't.
  const lineCaps = teams.map((t) => Math.max(0, playersPerTeam - (t.goalkeeper ? 1 : 0)));

  const shuffledLine = shuffle(linePool);
  const bench: Player[] = [];
  let teamIndex = 0;

  for (const player of shuffledLine) {
    let attempts = 0;
    while (teams[teamIndex].linePlayers.length >= lineCaps[teamIndex] && attempts < numTeams) {
      teamIndex = (teamIndex + 1) % numTeams;
      attempts += 1;
    }
    if (attempts >= numTeams) {
      bench.push(player);
      continue;
    }
    teams[teamIndex].linePlayers.push(player);
    teamIndex = (teamIndex + 1) % numTeams;
  }

  const shortfalls = teams
    .map((t, i) => ({ teamId: t.id, missing: lineCaps[i] - t.linePlayers.length }))
    .filter((s) => s.missing > 0);

  return { teams, bench, shortfalls };
}
