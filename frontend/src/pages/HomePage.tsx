import React, { useEffect, useState } from 'react';
import { Timer } from 'lucide-react';
import { Link } from 'react-router-dom';
import { getTracks, getGames, getLapTimes, getWorldRecords, getCars } from '../api';
import { Track, Game, LapTime, Car } from '../types';
import { getImageUrl } from '../utils';
import { formatTime } from '../utils/time';
import InputTypeBadge from '../components/InputTypeBadge';

const HomePage: React.FC = () => {
  const [tracks, setTracks] = useState<Track[]>([]);
  const [displayTracks, setDisplayTracks] = useState<Track[]>([]);
  const [games, setGames] = useState<Game[]>([]);
  const [cars, setCars] = useState<Car[]>([]);
  const [displayCars, setDisplayCars] = useState<Car[]>([]);
  const [recent, setRecent] = useState<LapTime[]>([]);
  const [top, setTop] = useState<LapTime[]>([]);
  const [tab, setTab] = useState<'top' | 'recent'>('top');

  useEffect(() => {
    getTracks().then(setTracks).catch(() => {});
    getGames().then(setGames).catch(() => {});
    getCars().then(setCars).catch(() => {});
    getWorldRecords().then(setTop).catch(() => {});
    getLapTimes().then((data) => {
      data.sort((a, b) => new Date(b.lapDate).getTime() - new Date(a.lapDate).getTime());
      setRecent(data.slice(0, 10));
    }).catch(() => {});
  }, []);

  useEffect(() => {
    if (tracks.length === 0) return;
    const pick = () => {
      const shuffled = [...tracks].sort(() => 0.5 - Math.random());
      setDisplayTracks(shuffled.slice(0, 6));
    };
    pick();
    const id = setInterval(pick, 10000);
    return () => clearInterval(id);
  }, [tracks]);

  useEffect(() => {
    if (cars.length === 0) return;
    const pick = () => {
      const shuffled = [...cars].sort(() => 0.5 - Math.random());
      setDisplayCars(shuffled.slice(0, 6));
    };
    pick();
    const id = setInterval(pick, 10000);
    return () => clearInterval(id);
  }, [cars]);

  const renderTable = (laps: LapTime[]) => (
    <div className="overflow-x-auto">
      <table className="min-w-full text-sm border">
        <thead>
          <tr className="border-b">
            <th className="px-2 py-1 text-left">Driver</th>
            <th className="px-2 py-1 text-left">Track</th>
            <th className="px-2 py-1 text-left">Car</th>
            <th className="px-2 py-1 text-right">Time</th>
          </tr>
        </thead>
        <tbody>
          {laps.map((r) => (
            <tr key={r.id} className="border-b last:border-0">
              <td className="px-2 py-1">{r.username}</td>
              <td className="px-2 py-1">{r.trackName}</td>
              <td className="px-2 py-1 flex items-center gap-1">
                {r.carImageUrl && (
                  <img src={getImageUrl(r.carImageUrl)} alt={r.carName || ''} className="h-5 w-8 object-cover rounded" />
                )}
                {r.carName}
                <InputTypeBadge inputType={r.inputType} className="ml-1" />
              </td>
              <td className="px-2 py-1 text-right">{formatTime(r.timeMs)}</td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );

  return (
    <div className="container mx-auto py-6 space-y-8">
      <div className="text-center space-y-2">
        <div className="flex items-center justify-center space-x-2">
          <Timer className="h-6 w-6" />
          <h1 className="text-3xl font-bold">Racing Lap Tracker</h1>
        </div>
        <p className="text-muted-foreground">Track your fastest laps and compete with other drivers.</p>
      </div>

      <section className="space-y-4">
        <h2 className="text-2xl font-semibold">Discover Tracks</h2>
        <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
          {displayTracks.map((t) => {
            const game = games.find((g) => g.id === t.gameId);
            return (
              <Link key={t.id} to={`/track/${t.id}`} className="border rounded hover:shadow bg-card">
                {t.imageUrl && (
                  <img src={getImageUrl(t.imageUrl)} alt={t.name} className="w-full h-32 object-cover rounded-t" />
                )}
                <div className="p-2 space-y-1">
                  <div className="flex items-center justify-between">
                    <h3 className="font-semibold">{t.name}</h3>
                    {game && game.imageUrl && (
                      <img src={getImageUrl(game.imageUrl)} alt={game.name} className="h-5 w-8 object-cover rounded" />
                    )}
                  </div>
                  {t.description && (
                    <p className="text-sm text-muted-foreground line-clamp-2">{t.description}</p>
                  )}
                </div>
              </Link>
            );
          })}
        </div>
      </section>

      <section className="space-y-4">
        <h2 className="text-2xl font-semibold">Discover Cars</h2>
        <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
          {displayCars.map((c) => {
            const game = games.find((g) => g.id === c.gameId);
            return (
              <Link key={c.id} to={`/car/${c.id}`} className="border rounded hover:shadow bg-card">
                {c.imageUrl && (
                  <img src={getImageUrl(c.imageUrl)} alt={c.name} className="w-full h-32 object-cover rounded-t" />
                )}
                <div className="p-2 space-y-1">
                  <div className="flex items-center justify-between">
                    <h3 className="font-semibold">{c.name}</h3>
                    {game && game.imageUrl && (
                      <img src={getImageUrl(game.imageUrl)} alt={game.name} className="h-5 w-8 object-cover rounded" />
                    )}
                  </div>
                  {c.description && (
                    <p className="text-sm text-muted-foreground line-clamp-2">{c.description}</p>
                  )}
                </div>
              </Link>
            );
          })}
        </div>
      </section>

      <section className="space-y-4">
        <h2 className="text-2xl font-semibold">Lap Records</h2>
        <div className="flex justify-center mb-4">
          <button
            className={`px-4 py-2 rounded-l border ${tab === 'top' ? 'bg-primary text-primary-foreground' : 'bg-muted'}`}
            onClick={() => setTab('top')}
          >
            Top
          </button>
          <button
            className={`px-4 py-2 rounded-r border-t border-b border-r ${tab === 'recent' ? 'bg-primary text-primary-foreground' : 'bg-muted'}`}
            onClick={() => setTab('recent')}
          >
            Recent
          </button>
        </div>
        {tab === 'top' ? (
          top.length > 0 ? (
            renderTable(top)
          ) : (
            <p className="text-center text-muted-foreground">No records yet.</p>
          )
        ) : recent.length > 0 ? (
          renderTable(recent)
        ) : (
          <p className="text-center text-muted-foreground">No records yet.</p>
        )}
      </section>
    </div>
  );
};

export default HomePage;
