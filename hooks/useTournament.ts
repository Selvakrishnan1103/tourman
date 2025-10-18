import React, { useState, useEffect, useMemo, useCallback, createContext, useContext, ReactNode } from 'react';
import { Team, Round, Standings, TournamentData, TournamentStage, Playoff, PlayoffMatch, Match } from '../types';
import { generateTournamentRounds } from '../utils/scheduler';

const TOURNAMENT_STORAGE_KEY = 'tournamentData';

const initialData: TournamentData = {
  tournamentName: '',
  teams: [],
  rounds: [],
  playoff: null,
  stage: TournamentStage.SETUP,
};

// --- Helper Functions ---
const loadFromLocalStorage = (): TournamentData => {
  try {
    const storedData = localStorage.getItem(TOURNAMENT_STORAGE_KEY);
    if (storedData) {
      return JSON.parse(storedData);
    }
  } catch (error) {
    console.error('Failed to parse tournament data from localStorage:', error);
  }
  return initialData;
};

// --- Custom Hook ---
const useTournamentManager = () => {
  const [data, setData] = useState<TournamentData>(loadFromLocalStorage);
  const { tournamentName, teams, rounds, playoff, stage } = data;
  
  useEffect(() => {
    localStorage.setItem(TOURNAMENT_STORAGE_KEY, JSON.stringify(data));
  }, [data]);

  const setTournamentName = useCallback((name: string) => {
    setData(prev => ({ ...prev, tournamentName: name }));
  }, []);

  const addTeam = useCallback((teamName: string) => {
    if (teamName.trim() === '' || teams.some(t => t.name.toLowerCase() === teamName.trim().toLowerCase())) {
      return;
    }
    const newTeam: Team = { id: `team-${Date.now()}`, name: teamName.trim() };
    setData(prev => ({ ...prev, teams: [...prev.teams, newTeam] }));
  }, [teams]);

  const removeTeam = useCallback((teamId: string) => {
    setData(prev => ({ ...prev, teams: prev.teams.filter(t => t.id !== teamId) }));
  }, []);
  
  const proceedToScheduler = useCallback(() => {
     if(teams.length >= 2 && tournamentName.trim() !== '') {
        setData(prev => ({ ...prev, stage: TournamentStage.SCHEDULING }));
     }
  }, [teams.length, tournamentName]);

  const generateRounds = useCallback((numberOfRounds: number) => {
    const generated = generateTournamentRounds(teams, numberOfRounds);
    setData(prev => ({ ...prev, rounds: generated }));
  }, [teams]);

  const updateMatchResult = useCallback((roundNumber: number, matchId: string, score1: number, score2: number) => {
    setData(prev => {
      const newRounds = prev.rounds.map(r => {
        if (r.roundNumber === roundNumber) {
          return {
            ...r,
            matches: r.matches.map(m => {
              if (m.id === matchId) {
                return {
                  ...m,
                  score1,
                  score2,
                  winner: score1 > score2 ? m.team1 : score2 > score1 ? m.team2 : null,
                };
              }
              return m;
            }),
          };
        }
        return r;
      });
      return { ...prev, rounds: newRounds };
    });
  }, []);

  const standings: Standings[] = useMemo(() => {
    const stats: { [key: string]: Standings } = {};
    teams.forEach(team => {
      stats[team.id] = { team, played: 0, wins: 0, losses: 0, scoreDifference: 0, points: 0 };
    });

    rounds.forEach(round => {
      round.matches.forEach(match => {
        if (match.score1 !== null && match.score2 !== null) {
          const { team1, team2, score1, score2 } = match;

          // Team 1 stats
          stats[team1.id].played++;
          stats[team1.id].scoreDifference += score1 - score2;

          // Team 2 stats
          stats[team2.id].played++;
          stats[team2.id].scoreDifference += score2 - score1;

          if (score1 > score2) {
            stats[team1.id].wins++;
            stats[team1.id].points += 2;
            stats[team2.id].losses++;
          } else if (score2 > score1) {
            stats[team2.id].wins++;
            stats[team2.id].points += 2;
            stats[team1.id].losses++;
          } else {
            // Draw - 1 point each (can be adjusted)
            stats[team1.id].points += 1;
            stats[team2.id].points += 1;
          }
        }
      });
    });

    return Object.values(stats).sort((a, b) => {
      if (b.points !== a.points) return b.points - a.points;
      return b.scoreDifference - a.scoreDifference;
    });
  }, [teams, rounds]);
  
  const isRoundRobinComplete = useMemo(() => {
    if (rounds.length === 0) return false;
    return rounds.every(r => r.matches.every(m => m.score1 !== null && m.score2 !== null));
  }, [rounds]);

  const startPlayoffs = useCallback(() => {
    if (!isRoundRobinComplete || teams.length < 4) return;

    const [first, second, third, fourth] = standings.map(s => s.team);

    const playoffMatches: PlayoffMatch[] = [
      { id: 'playoff-qualifier', name: 'Qualifier', team1: third, team2: fourth, score1: null, score2: null, winner: null },
      { id: 'playoff-semi', name: 'Semi-Final', team1: second, team2: { source: 'playoff-qualifier' }, score1: null, score2: null, winner: null },
      { id: 'playoff-final', name: 'Final', team1: first, team2: { source: 'playoff-semi' }, score1: null, score2: null, winner: null },
    ];
    
    setData(prev => ({
      ...prev,
      playoff: { matches: playoffMatches, champion: null },
      stage: TournamentStage.PLAYOFFS,
    }));

  }, [isRoundRobinComplete, standings, teams.length]);

  const getPlayoffTeam = useCallback((teamOrSource: Team | { source: string }): Team | null => {
      if ('id' in teamOrSource) {
          return teamOrSource as Team;
      }
      const sourceMatch = playoff?.matches.find(m => m.id === teamOrSource.source);
      return sourceMatch?.winner || null;
  }, [playoff]);

  const updatePlayoffResult = useCallback((matchId: string, score1: number, score2: number) => {
      setData(prev => {
          if (!prev.playoff) return prev;
          
          let newChampion: Team | null = null;
          
          const newMatches = prev.playoff.matches.map(m => {
              if (m.id === matchId) {
                  const team1 = getPlayoffTeam(m.team1);
                  const team2 = getPlayoffTeam(m.team2);
                  if(!team1 || !team2) return m;

                  const winner = score1 > score2 ? team1 : (score2 > score1 ? team2 : null);
                  if (m.id === 'playoff-final') {
                      newChampion = winner;
                  }
                  return { ...m, score1, score2, winner };
              }
              return m;
          });

          const newStage = newChampion ? TournamentStage.COMPLETE : prev.stage;

          return { ...prev, playoff: { ...prev.playoff, matches: newMatches, champion: newChampion }, stage: newStage };
      });
  }, [getPlayoffTeam]);

  const resetTournament = useCallback(() => {
    if (window.confirm('Are you sure you want to reset the entire tournament? This action cannot be undone.')) {
        setData(initialData);
        localStorage.removeItem(TOURNAMENT_STORAGE_KEY);
    }
  }, []);

  return {
    tournamentName, setTournamentName,
    teams, addTeam, removeTeam,
    rounds, generateRounds, updateMatchResult,
    standings,
    stage,
    playoff, startPlayoffs, updatePlayoffResult, getPlayoffTeam,
    isRoundRobinComplete,
    proceedToScheduler,
    resetTournament,
  };
};

// --- Context for providing the hook ---
interface TournamentContextType {
  tournamentName: string;
  setTournamentName: (name: string) => void;
  teams: Team[];
  addTeam: (teamName: string) => void;
  removeTeam: (teamId: string) => void;
  rounds: Round[];
  generateRounds: (numberOfRounds: number) => void;
  updateMatchResult: (roundNumber: number, matchId: string, score1: number, score2: number) => void;
  standings: Standings[];
  stage: TournamentStage;
  playoff: Playoff | null;
  startPlayoffs: () => void;
  updatePlayoffResult: (matchId: string, score1: number, score2: number) => void;
  getPlayoffTeam: (teamOrSource: Team | { source: string }) => Team | null;
  isRoundRobinComplete: boolean;
  proceedToScheduler: () => void;
  resetTournament: () => void;
}

const TournamentContext = createContext<TournamentContextType | null>(null);

export const TournamentProvider = ({ children }: { children: ReactNode }) => {
  const tournament = useTournamentManager();
  // FIX: Replaced JSX with React.createElement to prevent parsing errors in a .ts file.
  return React.createElement(TournamentContext.Provider, { value: tournament }, children);
};

export const useTournament = (): TournamentContextType => {
  const context = useContext(TournamentContext);
  if (!context) {
    throw new Error('useTournament must be used within a TournamentProvider');
  }
  return context;
};