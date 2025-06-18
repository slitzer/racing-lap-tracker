import React, { useEffect, useState } from 'react';
import { Trophy } from 'lucide-react';
import { getGames, getTracks, getLayouts, getLeaderboard } from '../api';
import { Game, Track, Layout, LapTime } from '../types';
import { formatTime } from '../utils/time';

const LeaderboardPage: React.FC = () => {
  const [games, setGames] = useState<Game[]>([]);
  const [tracks, setTracks] = useState<Track[]>([]);
  const [layouts, setLayouts] = useState<Layout[]>([]);
  const [gameId, setGameId] = useState('');
  const [trackId, setTrackId] = useState('');
  const [layoutId, setLayoutId] = useState('');
  const [entries, setEntries] = useState<LapTime[]>([]);

  useEffect(() => {
    getGames().then(setGames).catch(() => {});
  }, []);

  useEffect(() => {
    if (gameId) {
      getTracks(gameId)
        .then(setTracks)
        .catch(() => setTracks([]));
    } else {
      setTracks([]);
      setTrackId('');
    }
  }, [gameId]);

  useEffect(() => {
    if (trackId) {
      getLayouts(trackId)
        .then(setLayouts)
        .catch(() => setLayouts([]));
    } else {
      setLayouts([]);
      setLayoutId('');
    }
  }, [trackId]);

  useEffect(() => {
    if (gameId && trackId && layoutId) {
      getLeaderboard({ gameId, trackId, layoutId })
        .then(setEntries)
        .catch(() => setEntries([]));
    } else {
      setEntries([]);
    }
  }, [gameId, trackId, layoutId]);

  return (
    <div className="container py-6">
      <div className="flex items-center justify-center space-x-2 mb-6">
        <Trophy className="h-6 w-6" />
        <h1 className="text-3xl font-bold">Leaderboard</h1>
      </div>
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-6">
        <select
          value={gameId}
          onChange={(e) => setGameId(e.target.value)}
          className="w-full rounded border px-3 py-2"
        >
          <option value="">Select game</option>
          {games.map((g) => (
            <option key={g.id} value={g.id}>
              {g.name}
            </option>
          ))}
        </select>
        <select
          value={trackId}
          onChange={(e) => setTrackId(e.target.value)}
          className="w-full rounded border px-3 py-2"
          disabled={!gameId}
        >
          <option value="">Select track</option>
          {tracks.map((t) => (
            <option key={t.id} value={t.id}>
              {t.name}
            </option>
          ))}
        </select>
        <select
          value={layoutId}
          onChange={(e) => setLayoutId(e.target.value)}
          className="w-full rounded border px-3 py-2"
          disabled={!trackId}
        >
          <option value="">Select layout</option>
          {layouts.map((l) => (
            <option key={l.id} value={l.id}>
              {l.name}
            </option>
          ))}
        </select>
      </div>
      {entries.length > 0 ? (
        <div className="overflow-x-auto">
          <table className="min-w-full text-sm border">
            <thead>
              <tr className="border-b">
                <th className="px-2 py-1">#</th>
                <th className="px-2 py-1 text-left">Driver</th>
                <th className="px-2 py-1 text-left">Game</th>
                <th className="px-2 py-1 text-left">Track</th>
                <th className="px-2 py-1 text-left">Car</th>
                <th className="px-2 py-1 text-right">Time</th>
              </tr>
            </thead>
            <tbody>
              {entries.map((e, idx) => (
                <tr key={e.id} className="border-b last:border-0">
                  <td className="px-2 py-1 text-center">{idx + 1}</td>
                  <td className="px-2 py-1">{e.username}</td>
                  <td className="px-2 py-1">
                    {e.gameImageUrl && (
                      <img
                        src={e.gameImageUrl}
                        alt={e.gameName || ''}
                        className="h-8 w-14 object-cover rounded mb-1"
                      />
                    )}
                    {e.gameName}
                  </td>
                  <td className="px-2 py-1">
                    {e.trackImageUrl && (
                      <img
                        src={e.trackImageUrl}
                        alt={e.trackName || ''}
                        className="h-8 w-14 object-cover rounded mb-1"
                      />
                    )}
                    {e.trackName}
                    {e.layoutName ? ` - ${e.layoutName}` : ''}
                  </td>
                  <td className="px-2 py-1">
                    {e.carImageUrl && (
                      <img
                        src={e.carImageUrl}
                        alt={e.carName || ''}
                        className="h-8 w-14 object-cover rounded mb-1"
                      />
                    )}
                    {e.carName}
                  </td>
                  <td className="px-2 py-1 text-right">
                    {formatTime(e.timeMs)}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      ) : (
        <p className="text-center text-muted-foreground">No lap times found.</p>
      )}
    </div>
  );
};

export default LeaderboardPage;
