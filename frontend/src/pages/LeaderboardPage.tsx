import React from 'react';
import { Trophy } from 'lucide-react';

const LeaderboardPage: React.FC = () => {
  return (
    <div className="container py-6 text-center">
      <div className="flex items-center justify-center space-x-2 mb-6">
        <Trophy className="h-6 w-6" />
        <h1 className="text-3xl font-bold">Leaderboard</h1>
      </div>
      <p className="text-muted-foreground">Leaderboard functionality coming soon.</p>
    </div>
  );
};

export default LeaderboardPage;
