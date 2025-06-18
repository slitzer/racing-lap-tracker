import React, { useEffect, useState } from 'react';
import { Timer, Crown, Users } from 'lucide-react';
import { getLapTimes, getWorldRecords } from '../api';
import { LapTime } from '../types';
import { formatTime } from '../utils/time';
import { useAuth } from '../contexts/AuthContext';

const LapTimesPage: React.FC = () => {
  const { user } = useAuth();
  const [myLaps, setMyLaps] = useState<LapTime[]>([]);
  const [otherLaps, setOtherLaps] = useState<LapTime[]>([]);
  const [records, setRecords] = useState<LapTime[]>([]);

  useEffect(() => {
    getLapTimes()
      .then((data) => {
        if (user) {
          setMyLaps(data.filter((l) => l.userId === user.id));
          setOtherLaps(data.filter((l) => l.userId !== user.id));
        } else {
          setOtherLaps(data);
        }
      })
      .catch(() => {});
    getWorldRecords()
      .then(setRecords)
      .catch(() => {});
  }, [user]);

  const renderTable = (laps: LapTime[]) => (
    <div className="overflow-x-auto">
      <table className="min-w-full text-sm border">
        <thead>
          <tr className="border-b">
            <th className="px-2 py-1 text-left">Driver</th>
            <th className="px-2 py-1 text-left">Game</th>
            <th className="px-2 py-1 text-left">Track</th>
            <th className="px-2 py-1 text-left">Car</th>
            <th className="px-2 py-1 text-right">Time</th>
          </tr>
        </thead>
        <tbody>
          {laps.map((l) => (
            <tr key={l.id} className="border-b last:border-0">
              <td className="px-2 py-1">{l.username}</td>
              <td className="px-2 py-1">
                {l.gameImageUrl && (
                  <img
                    src={l.gameImageUrl}
                    alt={l.gameName || ''}
                    className="h-8 w-14 object-cover rounded mb-1"
                  />
                )}
                {l.gameName}
              </td>
              <td className="px-2 py-1">
                {l.trackImageUrl && (
                  <img
                    src={l.trackImageUrl}
                    alt={l.trackName || ''}
                    className="h-8 w-14 object-cover rounded mb-1"
                  />
                )}
                {l.trackName}
                {l.layoutName ? ` - ${l.layoutName}` : ''}
              </td>
              <td className="px-2 py-1">
                {l.carImageUrl && (
                  <img
                    src={l.carImageUrl}
                    alt={l.carName || ''}
                    className="h-8 w-14 object-cover rounded mb-1"
                  />
                )}
                {l.carName}
              </td>
              <td className="px-2 py-1 text-right">{formatTime(l.timeMs)}</td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );

  return (
    <div className="container py-6 space-y-8">
      <div className="flex items-center justify-center space-x-2 mb-6">
        <Timer className="h-6 w-6" />
        <h1 className="text-3xl font-bold">Lap Times</h1>
      </div>

      <section>
        <div className="flex items-center space-x-2 mb-2">
          <Crown className="h-5 w-5" />
          <h2 className="text-xl font-semibold">World Records</h2>
        </div>
        {records.length > 0 ? (
          renderTable(records)
        ) : (
          <p className="text-center text-muted-foreground">No records found.</p>
        )}
      </section>

      {user && (
        <section>
          <div className="flex items-center space-x-2 mb-2">
            <Timer className="h-5 w-5" />
            <h2 className="text-xl font-semibold">Your Lap Times</h2>
          </div>
          {myLaps.length > 0 ? (
            renderTable(myLaps)
          ) : (
            <p className="text-center text-muted-foreground">
              You have not submitted any laps.
            </p>
          )}
        </section>
      )}

      <section>
        <div className="flex items-center space-x-2 mb-2">
          <Users className="h-5 w-5" />
          <h2 className="text-xl font-semibold">Other Users</h2>
        </div>
        {otherLaps.length > 0 ? (
          renderTable(otherLaps)
        ) : (
          <p className="text-center text-muted-foreground">No lap times found.</p>
        )}
      </section>
    </div>
  );
};

export default LapTimesPage;
