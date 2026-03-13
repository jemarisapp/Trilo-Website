import { SeedAssignments, BracketPicks, BracketMatchup } from './bracket.types';

const STORAGE_KEY = 'trilo_cfp_bracket';

// Seed matchup structure -- fixed for 12-team CFP format
// First Round matchups: [top seed, bottom seed]
export const FIRST_ROUND_MATCHUPS: [number, number][] = [
  [12, 5],
  [9, 8],
  [11, 6],
  [10, 7],
];

// Quarterfinal top seeds (byes) paired with their first round feeder index
// bye seed -> which firstRound game winner they face
export const QUARTERFINAL_BYES: number[] = [4, 1, 3, 2];

// QF index 0: seed 4 vs winner of FR[0] (12v5)
// QF index 1: seed 1 vs winner of FR[1] (9v8)
// QF index 2: seed 3 vs winner of FR[2] (11v6)
// QF index 3: seed 2 vs winner of FR[3] (10v7)

// Semifinal pairings: QF winner index pairs
export const SEMIFINAL_MATCHUPS: [number, number][] = [
  [0, 1], // QF winner 0 vs QF winner 1
  [2, 3], // QF winner 2 vs QF winner 3
];

export const buildFirstRoundMatchups = (seeds: SeedAssignments): BracketMatchup[] => {
  return FIRST_ROUND_MATCHUPS.map(([topSeed, bottomSeed]) => ({
    top: seeds[topSeed] ?? null,
    bottom: seeds[bottomSeed] ?? null,
    winner: null,
  }));
};

export const buildQuarterfinalMatchups = (
  seeds: SeedAssignments,
  picks: BracketPicks
): BracketMatchup[] => {
  return QUARTERFINAL_BYES.map((byeSeed, i) => ({
    top: seeds[byeSeed] ?? null,
    bottom: picks.firstRound[i] ?? null,
    winner: picks.quarterfinal[i] ?? null,
  }));
};

export const buildSemifinalMatchups = (picks: BracketPicks): BracketMatchup[] => {
  return SEMIFINAL_MATCHUPS.map(([a, b]) => ({
    top: picks.quarterfinal[a] ?? null,
    bottom: picks.quarterfinal[b] ?? null,
    winner: picks.semifinal[SEMIFINAL_MATCHUPS.indexOf([a, b] as [number, number])] ?? null,
  }));
};

export const emptyPicks = (): BracketPicks => ({
  firstRound: [null, null, null, null],
  quarterfinal: [null, null, null, null],
  semifinal: [null, null],
  championship: null,
});

// When a first round pick changes, clear downstream QF, SF, championship for that slot
export const pickFirstRound = (
  picks: BracketPicks,
  gameIndex: number,
  winner: string
): BracketPicks => {
  const newPicks = structuredClone(picks);
  newPicks.firstRound[gameIndex] = winner;
  // Clear QF pick for this slot
  newPicks.quarterfinal[gameIndex] = null;
  // Clear SF and championship that may have depended on this QF slot
  const sfIndex = gameIndex <= 1 ? 0 : 1;
  newPicks.semifinal[sfIndex] = null;
  newPicks.championship = null;
  return newPicks;
};

export const pickQuarterfinal = (
  picks: BracketPicks,
  gameIndex: number,
  winner: string
): BracketPicks => {
  const newPicks = structuredClone(picks);
  newPicks.quarterfinal[gameIndex] = winner;
  const sfIndex = gameIndex <= 1 ? 0 : 1;
  newPicks.semifinal[sfIndex] = null;
  newPicks.championship = null;
  return newPicks;
};

export const pickSemifinal = (
  picks: BracketPicks,
  gameIndex: number,
  winner: string
): BracketPicks => {
  const newPicks = structuredClone(picks);
  newPicks.semifinal[gameIndex] = winner;
  newPicks.championship = null;
  return newPicks;
};

export const pickChampionship = (picks: BracketPicks, winner: string): BracketPicks => {
  const newPicks = structuredClone(picks);
  newPicks.championship = winner;
  return newPicks;
};

// localStorage helpers
export const saveToStorage = (seeds: SeedAssignments, picks: BracketPicks): void => {
  try {
    localStorage.setItem(STORAGE_KEY, JSON.stringify({ seeds, picks }));
  } catch {
    // fail silently
  }
};

export const loadFromStorage = (): { seeds: SeedAssignments; picks: BracketPicks } | null => {
  try {
    const raw = localStorage.getItem(STORAGE_KEY);
    if (!raw) return null;
    return JSON.parse(raw);
  } catch {
    return null;
  }
};

export const clearStorage = (): void => {
  try {
    localStorage.removeItem(STORAGE_KEY);
  } catch {
    // fail silently
  }
};

export const allSeedsFilled = (seeds: SeedAssignments): boolean => {
  for (let i = 1; i <= 12; i++) {
    if (!seeds[i]) return false;
  }
  return true;
};
