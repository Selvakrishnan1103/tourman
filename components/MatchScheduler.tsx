
import React, { useState } from 'react';
import { useTournament } from '../hooks/useTournament';
import { Match } from '../types';
import Card from './common/Card';
import Button from './common/Button';
import Input from './common/Input';
import { useNavigate } from 'react-router-dom';

interface MatchResultInputProps {
    match: Match;
    roundNumber: number;
}

const MatchResultInput: React.FC<MatchResultInputProps> = ({ match, roundNumber }) => {
    const { updateMatchResult } = useTournament();
    const [score1, setScore1] = useState(match.score1?.toString() || '');
    const [score2, setScore2] = useState(match.score2?.toString() || '');

    const handleSave = () => {
        const s1 = parseInt(score1, 10);
        const s2 = parseInt(score2, 10);
        if (!isNaN(s1) && !isNaN(s2)) {
            updateMatchResult(roundNumber, match.id, s1, s2);
        }
    };
    
    const scoresEntered = match.score1 !== null && match.score2 !== null;

    return (
        <Card className={`mb-4 ${scoresEntered ? 'border-l-4 border-green-500' : 'border-l-4 border-amber-500'}`}>
            <div className="flex items-center justify-between">
                <div className="flex-1 text-center font-semibold">{match.team1.name}</div>
                <div className="flex items-center space-x-2 mx-4">
                    <Input type="number" value={score1} onChange={e => setScore1(e.target.value)} className="w-16 text-center" disabled={scoresEntered} />
                    <span>vs</span>
                    <Input type="number" value={score2} onChange={e => setScore2(e.target.value)} className="w-16 text-center" disabled={scoresEntered} />
                </div>
                <div className="flex-1 text-center font-semibold">{match.team2.name}</div>
                <Button onClick={handleSave} disabled={scoresEntered} className="ml-4">
                  {scoresEntered ? 'Saved' : 'Save'}
                </Button>
            </div>
        </Card>
    )
}


const MatchScheduler: React.FC = () => {
    const { rounds, generateRounds, teams, isRoundRobinComplete, startPlayoffs } = useTournament();
    const [numRounds, setNumRounds] = useState(1);
    const navigate = useNavigate();

    const handleGenerate = () => {
        if(numRounds > 0 && teams.length > 1) {
            generateRounds(numRounds);
        }
    };

    const handleStartPlayoffs = () => {
        startPlayoffs();
        navigate('/playoffs');
    }

    if (teams.length < 2) {
        return <div className="text-center text-text-secondary">Please set up at least 2 teams on the Setup page first.</div>;
    }

    if (rounds.length === 0) {
        return (
            <div className="space-y-6">
                <h2 className="text-3xl font-bold text-accent text-center">Match Scheduler</h2>
                <Card>
                    <div className="flex flex-col items-center space-y-4">
                        <label className="font-medium">Number of Round Robin cycles:</label>
                        <Input type="number" value={numRounds} onChange={e => setNumRounds(Math.max(1, parseInt(e.target.value) || 1))} className="w-24 text-center" />
                        <Button onClick={handleGenerate}>Generate Schedule</Button>
                    </div>
                </Card>
            </div>
        );
    }
    
    return (
        <div className="space-y-8">
             <h2 className="text-3xl font-bold text-accent text-center">Match Schedule & Results</h2>
             {rounds.map(round => (
                <div key={round.roundNumber}>
                    <h3 className="text-xl font-semibold mb-4 text-text-secondary border-b-2 border-slate-700 pb-2">Round {round.roundNumber}</h3>
                    <div>
                        {round.matches.map(match => (
                            <MatchResultInput key={match.id} match={match} roundNumber={round.roundNumber} />
                        ))}
                    </div>
                </div>
             ))}

             {isRoundRobinComplete && (
                <Card className="text-center bg-green-900 border border-green-500">
                    <h3 className="text-2xl font-bold mb-4">Round Robin Complete!</h3>
                    <p className="mb-4 text-green-200">All matches have been played. You can now proceed to the playoffs.</p>
                    <Button onClick={handleStartPlayoffs} className="text-lg">
                        Start Playoffs
                    </Button>
                </Card>
             )}
        </div>
    );
};

export default MatchScheduler;
