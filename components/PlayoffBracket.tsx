
import React, { useState } from 'react';
import { useTournament } from '../hooks/useTournament';
import { PlayoffMatch, Team } from '../types';
import Card from './common/Card';
import Input from './common/Input';
import Button from './common/Button';

interface PlayoffMatchCardProps {
    match: PlayoffMatch;
}

const PlayoffMatchCard: React.FC<PlayoffMatchCardProps> = ({ match }) => {
    const { getPlayoffTeam, updatePlayoffResult } = useTournament();
    const team1 = getPlayoffTeam(match.team1);
    const team2 = getPlayoffTeam(match.team2);

    const [score1, setScore1] = useState(match.score1?.toString() || '');
    const [score2, setScore2] = useState(match.score2?.toString() || '');
    
    const canEnterScores = team1 && team2 && match.winner === null;

    const handleSave = () => {
        const s1 = parseInt(score1, 10);
        const s2 = parseInt(score2, 10);
        if (!isNaN(s1) && !isNaN(s2)) {
            updatePlayoffResult(match.id, s1, s2);
        }
    }

    const renderTeamName = (team: Team | null, source: { source: string } | Team) => {
        if (team) {
            return team.name;
        }
        if ('source' in source) {
            const sourceMatch = source.source.split('-')[1];
            return `Winner of ${sourceMatch}`;
        }
        return 'TBD';
    };
    
    const isWinner = (team: Team | null) => match.winner && team && match.winner.id === team.id;

    return (
        <Card className="w-72">
            <h4 className="text-center font-bold text-accent mb-2">{match.name}</h4>
            <div className="space-y-2">
                <div className={`flex items-center justify-between p-2 rounded ${isWinner(team1) ? 'bg-green-700 font-bold' : 'bg-primary'}`}>
                    <span>{renderTeamName(team1, match.team1)}</span>
                    <Input type="number" value={score1} onChange={e => setScore1(e.target.value)} className="w-12 text-center" disabled={!canEnterScores} />
                </div>
                 <div className={`flex items-center justify-between p-2 rounded ${isWinner(team2) ? 'bg-green-700 font-bold' : 'bg-primary'}`}>
                    <span>{renderTeamName(team2, match.team2)}</span>
                    <Input type="number" value={score2} onChange={e => setScore2(e.target.value)} className="w-12 text-center" disabled={!canEnterScores} />
                </div>
            </div>
            {canEnterScores && (
                <Button onClick={handleSave} className="w-full mt-4">Save Result</Button>
            )}
        </Card>
    );
};


const PlayoffBracket: React.FC = () => {
  const { playoff, stage } = useTournament();

  if (stage === 'COMPLETE' && playoff?.champion) {
    return (
        <div className="text-center">
            <h2 className="text-3xl font-bold text-accent mb-4">Tournament Complete!</h2>
            <Card className="inline-block">
                <h3 className="text-2xl font-semibold">Champion</h3>
                <p className="text-5xl font-bold text-amber-400 my-4 animate-pulse">{playoff.champion.name}</p>
            </Card>
        </div>
    )
  }

  if (!playoff) {
    return (
        <div className="text-center">
            <h2 className="text-3xl font-bold text-accent text-center">Playoffs</h2>
            <Card>
                <p className="text-text-secondary">Playoffs have not started yet. Complete all round robin matches on the Schedule page.</p>
            </Card>
        </div>
    );
  }
  
  const qualifier = playoff.matches.find(m => m.id === 'playoff-qualifier');
  const semi = playoff.matches.find(m => m.id === 'playoff-semi');
  const final = playoff.matches.find(m => m.id === 'playoff-final');

  return (
    <div className="space-y-6">
        <h2 className="text-3xl font-bold text-accent text-center">Playoff Bracket</h2>
        <div className="flex flex-col md:flex-row items-center justify-center space-y-8 md:space-y-0 md:space-x-8 lg:space-x-16">
            {/* Column 1: Qualifier */}
            <div className="flex flex-col items-center">
                {qualifier && <PlayoffMatchCard match={qualifier} />}
            </div>

            {/* Connecting Lines and Column 2 */}
            <div className="flex items-center">
                <div className="w-8 h-px bg-slate-500 hidden md:block"></div>
                <div className="flex flex-col items-center">
                    {semi && <PlayoffMatchCard match={semi} />}
                </div>
            </div>

             {/* Connecting Lines and Column 3 */}
            <div className="flex items-center">
                 <div className="w-8 h-px bg-slate-500 hidden md:block"></div>
                <div className="flex flex-col items-center">
                    {final && <PlayoffMatchCard match={final} />}
                </div>
            </div>
        </div>
    </div>
  );
};

export default PlayoffBracket;
