import React from 'react';
import { NavLink } from 'react-router-dom';
import { useTournament } from '../hooks/useTournament';
import Button from './common/Button';

const Header: React.FC = () => {
  const { tournamentName, resetTournament } = useTournament();

  const handleReset = () => {
    if (window.confirm('Are you sure you want to reset the entire tournament? This action cannot be undone.')) {
      resetTournament();
    }
  };

  const navLinkClass = ({ isActive }: { isActive: boolean }) =>
    `px-3 py-2 rounded-md text-sm font-medium transition-colors ${
      isActive ? 'bg-accent text-primary' : 'text-text-secondary hover:bg-secondary hover:text-text-primary'
    }`;

  return (
    <header className="bg-secondary shadow-md sticky top-0 z-10">
      <div className="container mx-auto px-4 py-3 flex justify-between items-center">
        <div className="flex items-center space-x-8">
          <h1 className="text-xl font-bold text-accent">{tournamentName || 'Tournament Manager'}</h1>
          <nav className="flex space-x-4">
            <NavLink to="/" className={navLinkClass}>Home</NavLink>
            <NavLink to="/setup" className={navLinkClass}>Setup</NavLink>
            <NavLink to="/schedule" className={navLinkClass}>Schedule</NavLink>
            <NavLink to="/standings" className={navLinkClass}>Standings</NavLink>
            <NavLink to="/playoffs" className={navLinkClass}>Playoffs</NavLink>
          </nav>
        </div>
        <Button onClick={handleReset} variant="danger" size-sm>
          Reset Tournament
        </Button>
      </div>
    </header>
  );
};

export default Header;
