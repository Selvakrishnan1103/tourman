import React from 'react';
import { useNavigate } from 'react-router-dom';
import { useTournament } from '../hooks/useTournament';
import Card from './common/Card';
import Button from './common/Button';
import { TournamentStage } from '../types';

const Landing: React.FC = () => {
  const { tournamentName, stage, resetTournament } = useTournament();
  const navigate = useNavigate();

  const getContinuePath = () => {
    switch (stage) {
      case TournamentStage.SCHEDULING:
        return '/schedule';
      case TournamentStage.PLAYOFFS:
      case TournamentStage.COMPLETE:
        return '/playoffs';
      case TournamentStage.SETUP:
      default:
        return '/setup';
    }
  };

  const handleNewTournament = () => {
    if (tournamentName) {
        if (window.confirm('Starting a new tournament will erase all data from the current one. Are you sure?')) {
            resetTournament();
            navigate('/setup');
        }
    } else {
        navigate('/setup');
    }
  };

  return (
    <div className="flex flex-col items-center justify-center h-full text-center">
      <Card className="max-w-md w-full">
        {tournamentName ? (
          <>
            <h1 className="text-3xl font-bold mb-2">Welcome Back!</h1>
            <p className="text-xl text-accent font-semibold mb-6">{tournamentName}</p>
            <div className="space-y-4">
              <Button onClick={() => navigate(getContinuePath())} className="w-full text-lg">
                Continue Tournament
              </Button>
              <Button onClick={handleNewTournament} variant="secondary" className="w-full">
                Start a New Tournament
              </Button>
            </div>
          </>
        ) : (
          <>
            <h1 className="text-3xl font-bold mb-4">Tournament Manager</h1>
            <p className="text-text-secondary mb-6">
              Create and manage your own tournaments with ease.
            </p>
            <Button onClick={handleNewTournament} className="w-full text-lg">
              Create New Tournament
            </Button>
          </>
        )}
      </Card>
    </div>
  );
};

export default Landing;
