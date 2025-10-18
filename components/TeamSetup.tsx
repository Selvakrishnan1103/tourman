
import React, { useState } from 'react';
import { useTournament } from '../hooks/useTournament';
import { useNavigate } from 'react-router-dom';
import Card from './common/Card';
import Input from './common/Input';
import Button from './common/Button';

const TeamSetup: React.FC = () => {
  const { tournamentName, setTournamentName, teams, addTeam, removeTeam, proceedToScheduler } = useTournament();
  const [newTeamName, setNewTeamName] = useState('');
  const navigate = useNavigate();

  const handleAddTeam = (e: React.FormEvent) => {
    e.preventDefault();
    addTeam(newTeamName);
    setNewTeamName('');
  };

  const handleProceed = () => {
    proceedToScheduler();
    navigate('/schedule');
  };

  return (
    <div className="space-y-6">
      <h2 className="text-3xl font-bold text-accent text-center">Tournament Setup</h2>
      <Card>
        <div className="space-y-4">
          <label htmlFor="tournamentName" className="block font-medium text-text-secondary">Tournament Name</label>
          <Input
            id="tournamentName"
            value={tournamentName}
            onChange={(e) => setTournamentName(e.target.value)}
            placeholder="e.g., Summer Cup 2024"
          />
        </div>
      </Card>

      <Card>
        <h3 className="text-xl font-semibold mb-4">Register Teams</h3>
        <form onSubmit={handleAddTeam} className="flex space-x-2 mb-4">
          <Input
            value={newTeamName}
            onChange={(e) => setNewTeamName(e.target.value)}
            placeholder="Enter new team name"
            className="flex-grow"
          />
          <Button type="submit">Add Team</Button>
        </form>
        <ul className="space-y-2">
          {teams.map((team, index) => (
            <li key={team.id} className="bg-primary p-3 rounded-md flex justify-between items-center">
              <span>{index + 1}. {team.name}</span>
              <Button onClick={() => removeTeam(team.id)} variant="danger" className="px-2 py-1 text-xs">
                Remove
              </Button>
            </li>
          ))}
        </ul>
      </Card>
      
      <div className="text-center">
        <Button 
          onClick={handleProceed} 
          disabled={teams.length < 2 || tournamentName.trim() === ''}
          className="w-full md:w-auto text-lg"
        >
          Proceed to Scheduler
        </Button>
        {(teams.length < 2 || tournamentName.trim() === '') && (
            <p className="text-sm text-amber-400 mt-2">
                Please enter a tournament name and add at least 2 teams to proceed.
            </p>
        )}
      </div>
    </div>
  );
};

export default TeamSetup;
