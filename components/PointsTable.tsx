
import React from 'react';
import { useTournament } from '../hooks/useTournament';
import Card from './common/Card';

const PointsTable: React.FC = () => {
  const { standings } = useTournament();

  if (standings.length === 0) {
    return (
      <div className="space-y-6">
        <h2 className="text-3xl font-bold text-accent text-center">Standings</h2>
        <Card>
            <p className="text-center text-text-secondary">No teams or matches yet. Standings will appear here once matches are played.</p>
        </Card>
      </div>
    );
  }

  return (
    <div className="space-y-6">
       <h2 className="text-3xl font-bold text-accent text-center">Standings</h2>
        <Card className="overflow-x-auto">
            <table className="w-full text-left">
                <thead className="border-b-2 border-slate-600">
                <tr>
                    <th className="p-3">#</th>
                    <th className="p-3">Team</th>
                    <th className="p-3 text-center">MP</th>
                    <th className="p-3 text-center">W</th>
                    <th className="p-3 text-center">L</th>
                    <th className="p-3 text-center">SD</th>
                    <th className="p-3 text-center">Pts</th>
                </tr>
                </thead>
                <tbody>
                {standings.map((s, index) => (
                    <tr key={s.team.id} className="border-b border-slate-700 last:border-b-0">
                    <td className="p-3 font-semibold">{index + 1}</td>
                    <td className="p-3">{s.team.name}</td>
                    <td className="p-3 text-center">{s.played}</td>
                    <td className="p-3 text-center">{s.wins}</td>
                    <td className="p-3 text-center">{s.losses}</td>
                    <td className="p-3 text-center">{s.scoreDifference > 0 ? `+${s.scoreDifference}` : s.scoreDifference}</td>
                    <td className="p-3 text-center font-bold text-accent">{s.points}</td>
                    </tr>
                ))}
                </tbody>
            </table>
        </Card>
    </div>
  );
};

export default PointsTable;
