
import { Team, Match, Round } from '../types';

/**
 * Generates a round-robin schedule for a given set of teams.
 * @param teams - The array of teams to schedule matches for.
 * @returns An array of rounds, where each round contains the matches for that round.
 */
const generateSingleRoundRobin = (teams: Team[]): Match[] => {
    const schedule: Match[] = [];
    if (teams.length < 2) return [];

    // If odd number of teams, add a dummy "bye" team
    const localTeams = [...teams];
    if (localTeams.length % 2 !== 0) {
        localTeams.push({ id: 'bye', name: 'BYE' });
    }

    const n = localTeams.length;
    const teamIndices = Array.from(localTeams.keys());

    for (let r = 0; r < n - 1; r++) {
        for (let i = 0; i < n / 2; i++) {
            const team1 = localTeams[teamIndices[i]];
            const team2 = localTeams[teamIndices[n - 1 - i]];

            if (team1.id !== 'bye' && team2.id !== 'bye') {
                 // Alternate home/away for fairness in subsequent rounds if needed
                if (r % 2 === 1) {
                    schedule.push({
                        id: `${Date.now()}-${team2.id}-vs-${team1.id}-${r}-${i}`,
                        team1: team2,
                        team2: team1,
                        score1: null,
                        score2: null,
                        winner: null,
                    });
                } else {
                    schedule.push({
                        id: `${Date.now()}-${team1.id}-vs-${team2.id}-${r}-${i}`,
                        team1: team1,
                        team2: team2,
                        score1: null,
                        score2: null,
                        winner: null,
                    });
                }
            }
        }
        // Rotate teams, keeping the first one fixed
        const last = teamIndices.pop()!;
        teamIndices.splice(1, 0, last);
    }

    return schedule;
};


/**
 * Generates the full tournament schedule for a specified number of round-robin rounds.
 * @param teams - The array of teams.
 * @param numberOfRounds - The number of full round-robin cycles to generate.
 * @returns An array of Round objects.
 */
export const generateTournamentRounds = (teams: Team[], numberOfRounds: number): Round[] => {
    const allRounds: Round[] = [];
    const teamsInRound = teams.length % 2 === 0 ? teams.length / 2 : (teams.length -1) / 2;
    
    let allMatches: Match[] = [];
    for (let i = 0; i < numberOfRounds; i++) {
        allMatches.push(...generateSingleRoundRobin(teams));
    }

    for (let i = 0; i < allMatches.length / teamsInRound; i++) {
        allRounds.push({
            roundNumber: i + 1,
            matches: allMatches.slice(i * teamsInRound, (i + 1) * teamsInRound)
        });
    }

    return allRounds;
};
