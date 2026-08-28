export type ParsedPlayer = {
  id: string;
  name: string;
  originSection: "numbered" | "manual";
};

export type RosterLine = { text: string; recognized: boolean };

const PLAYER_LINE_RE = /^\s*\d{1,3}\s*[-.):]\s*(.+?)\s*$/;
const CHECKMARK_RE = /[✅✔]️?/g;
const HAS_LETTER_RE = /[A-Za-zÀ-ÖØ-öø-ÿ]/;

function stripCheckmark(text: string): string {
  return text.replace(CHECKMARK_RE, "").trim();
}

function matchPlayerLine(rawLine: string): string | null {
  const line = rawLine.trim();
  if (!line) return null;

  const match = line.match(PLAYER_LINE_RE);
  if (!match) return null;

  const rest = match[1];
  if (!HAS_LETTER_RE.test(rest)) return null;
  return stripCheckmark(rest) || null;
}

export function classifyRosterLines(raw: string): RosterLine[] {
  return raw.split(/\r?\n/).map((text) => ({ text, recognized: matchPlayerLine(text) !== null }));
}

export function parseRoster(raw: string): ParsedPlayer[] {
  const players: ParsedPlayer[] = [];
  let counter = 0;

  for (const rawLine of raw.split(/\r?\n/)) {
    const name = matchPlayerLine(rawLine);
    if (name) {
      players.push({ id: `p-${counter++}`, name, originSection: "numbered" });
    }
  }

  return players;
}
