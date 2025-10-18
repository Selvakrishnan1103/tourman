
import React from 'react';
import { HashRouter, Routes, Route, Navigate } from 'react-router-dom';
import { TournamentProvider, useTournament } from './hooks/useTournament';
import Header from './components/Header';
import TeamSetup from './components/TeamSetup';
import MatchScheduler from './components/MatchScheduler';
import PointsTable from './components/PointsTable';
import PlayoffBracket from './components/PlayoffBracket';
import { TournamentStage } from './types';

const AppRoutes: React.FC = () => {
    const { stage } = useTournament();

    return (
        <Routes>
            <Route path="/" element={<TeamSetup />} />
            <Route path="/schedule" element={stage === TournamentStage.SETUP ? <Navigate to="/" /> : <MatchScheduler />} />
            <Route path="/standings" element={stage === TournamentStage.SETUP ? <Navigate to="/" /> : <PointsTable />} />
            <Route path="/playoffs" element={stage === TournamentStage.SETUP ? <Navigate to="/" /> : <PlayoffBracket />} />
            <Route path="*" element={<Navigate to="/" />} />
        </Routes>
    );
}

const App: React.FC = () => {
  return (
    <TournamentProvider>
      <HashRouter>
        <div className="min-h-screen flex flex-col">
          <Header />
          <main className="flex-grow container mx-auto p-4 md:p-8">
            <AppRoutes />
          </main>
          <footer className="text-center p-4 text-sm text-text-secondary">
            Built by a World-Class Senior Frontend React Engineer
          </footer>
        </div>
      </HashRouter>
    </TournamentProvider>
  );
};

export default App;
