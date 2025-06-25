import React, { useEffect, useState } from 'react';
import { BarChart } from 'lucide-react';
import { useAuth } from '../contexts/AuthContext';
import { getUserStats, getLapTimes } from '../api';
import { UserStats, LapTime } from '../types';
import { formatTime } from '../utils/time';

const StatsPage: React.FC = () => {
  const { user } = useAuth();
  const [stats, setStats] = useState<UserStats | null>(null);
  const [laps, setLaps] = useState<LapTime[]>([]);

  useEffect(() => {
    getUserStats().then(setStats).catch(() => {});
    if (user) {
      getLapTimes({ userId: user.id }).then((data) => {
        data.sort((a, b) => a.timeMs - b.timeMs);
        setLaps(data.slice(0, 5));
      });
    }
  }, [user]);

  if (!user) return null;

  return (
    <div className="container mx-auto py-6 space-y-6 max-w-lg">
      <div className="flex items-center space-x-2 mb-4">
        <BarChart className="h-6 w-6" />
        <h1 className="text-3xl font-bold">Your Stats</h1>
      </div>
      {stats && (
        <div className="border rounded p-4 space-y-2 text-sm">
          <p>
            <span className="font-medium">Total Laps:</span> {stats.lapCount}
          </p>
          <p>
            <span className="font-medium">Best Lap:</span>{' '}
            {stats.bestLapMs !== null ? formatTime(stats.bestLapMs) : 'N/A'}
          </p>
          <p>
            <span className="font-medium">Average Lap:</span>{' '}
            {stats.avgLapMs !== null ? formatTime(stats.avgLapMs) : 'N/A'}
          </p>
          {stats.favoriteCarName && (
            <p>
              <span className="font-medium">Most Used Car:</span> {stats.favoriteCarName}
            </p>
          )}
        </div>
      )}
      {laps.length > 0 && (
        <div className="border rounded p-4">
          <p className="font-medium mb-2">Top Times</p>
          <ul className="text-sm space-y-1">
            {laps.map((l) => (
              <li key={l.id}>{new Date(l.lapDate).toLocaleDateString()} - {formatTime(l.timeMs)}</li>
            ))}
          </ul>
        </div>
      )}
    </div>
  );
};

export default StatsPage;
