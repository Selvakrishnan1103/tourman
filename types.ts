export interface Team {
  id: string;
  name: string;
}

export interface Match {
  id: string;
  team1: Team;
  team2: Team;
  score1: number | null;
  score2: number | null;
  winner: Team | null;
}

export interface Round {
  roundNumber: number;
  matches: Match[];
}

export interface PlayoffMatch {
  id: string;
  name: string; // e.g., "Qualifier", "Semi-Final", "Final"
  team1: Team | { source: string }; // Team or a reference to winner of another match
  team2: Team | { source: string };
  score1: number | null;
  score2: number | null;
  winner: Team | null;
}

export interface Playoff {
  matches: PlayoffMatch[];
  champion: Team | null;
}

export interface Standings {
  team: Team;
  played: number;
  wins: number;
  losses: number;
  draws: number;
  scoreDifference: number;
  points: number;
}

export enum TournamentStage {
  SETUP = 'SETUP',
  SCHEDULING = 'SCHEDULING',
  PLAYOFFS = 'PLAYOFFS',
  COMPLETE = 'COMPLETE',
}

export interface TournamentData {
  tournamentName: string;
  teams: Team[];
  rounds: Round[];
  playoff: Playoff | null;
  stage: TournamentStage;
}
