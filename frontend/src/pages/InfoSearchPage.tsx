import React, { useEffect, useState } from 'react';
import { Search, Settings } from 'lucide-react';
import { Link } from 'react-router-dom';
import {
  searchInfo,
  createGame,
  createTrack,
  createLayout,
  createCar,
  getGames,
  getTracks,
} from '../api';
import { Button } from '../components/ui/button';

const InfoSearchPage: React.FC = () => {
  const [term, setTerm] = useState('');
  const [result, setResult] = useState<{ title: string; description: string; imageUrl: string | null } | null>(null);
  const [type, setType] = useState<'game' | 'track' | 'layout' | 'car'>('game');
  const [games, setGames] = useState<any[]>([]);
  const [tracks, setTracks] = useState<any[]>([]);
  const [gameId, setGameId] = useState('');
  const [trackId, setTrackId] = useState('');
  const [message, setMessage] = useState('');

  useEffect(() => {
    getGames().then(setGames).catch(() => {});
    getTracks().then(setTracks).catch(() => {});
  }, []);

  const handleSearch = async () => {
    if (!term.trim()) return;
    const info = await searchInfo(term.trim());
    setResult(info);
    setMessage('');
  };

  const handleSave = async () => {
    if (!result) return;
    if (type === 'game') {
      await createGame({ name: result.title, imageUrl: result.imageUrl, description: result.description });
    } else if (type === 'track') {
      if (!gameId) return;
      await createTrack({ gameId, name: result.title, imageUrl: result.imageUrl, description: result.description });
    } else if (type === 'layout') {
      if (!trackId) return;
      await createLayout({ trackId, name: result.title, imageUrl: result.imageUrl });
    } else if (type === 'car') {
      if (!gameId) return;
      await createCar({ gameId, name: result.title, imageUrl: result.imageUrl, description: result.description });
    }
    setMessage('Saved');
  };

  return (
    <div className="container mx-auto py-6 space-y-4">
      <div className="flex items-center space-x-2 mb-4">
        <Settings className="h-6 w-6" />
        <h1 className="text-3xl font-bold">Info Search</h1>
        <Link to="/admin" className="text-sm underline ml-2">Back to Admin</Link>
      </div>
      <div className="flex space-x-2">
        <input
          className="border p-1 flex-1"
          placeholder="Search Wikipedia"
          value={term}
          onChange={(e) => setTerm(e.target.value)}
        />
        <Button size="sm" onClick={handleSearch}>
          <Search className="h-4 w-4 mr-1" /> Search
        </Button>
      </div>
      {result && (
        <div className="border p-4 space-y-2">
          <h2 className="text-lg font-semibold">{result.title}</h2>
          {result.imageUrl && <img src={result.imageUrl} alt={result.title} className="h-32" />}
          <p className="text-sm whitespace-pre-line">{result.description}</p>
          <div className="flex flex-wrap items-end gap-2">
            <select value={type} onChange={(e) => setType(e.target.value as any)} className="border p-1">
              <option value="game">Game</option>
              <option value="track">Track</option>
              <option value="layout">Layout</option>
              <option value="car">Car</option>
            </select>
            {(type === 'track' || type === 'car') && (
              <select value={gameId} onChange={(e) => setGameId(e.target.value)} className="border p-1">
                <option value="">Game</option>
                {games.map((g) => (
                  <option key={g.id} value={g.id}>
                    {g.name}
                  </option>
                ))}
              </select>
            )}
            {type === 'layout' && (
              <select value={trackId} onChange={(e) => setTrackId(e.target.value)} className="border p-1">
                <option value="">Track</option>
                {tracks.map((t) => (
                  <option key={t.id} value={t.id}>
                    {t.name}
                  </option>
                ))}
              </select>
            )}
            <Button size="sm" onClick={handleSave}>Save</Button>
            {message && <span className="text-green-600 text-sm">{message}</span>}
          </div>
        </div>
      )}
    </div>
  );
};

export default InfoSearchPage;
