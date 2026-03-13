export interface Team {
  name: string;
  primary: string;
  secondary: string;
  textColor: string; // 'white' | 'black' for contrast
}

export type SeedAssignments = Record<number, string>; // seed -> team name

export interface BracketPicks {
  firstRound: (string | null)[];    // 4 games
  quarterfinal: (string | null)[];  // 4 games
  semifinal: (string | null)[];     // 2 games
  championship: string | null;
}

export interface BracketMatchup {
  top: string | null;
  bottom: string | null;
  winner: string | null;
}

export type Phase = 'seed-picker' | 'bracket';

export interface BracketToolState {
  phase: Phase;
  seedAssignments: SeedAssignments;
  picks: BracketPicks;
}
