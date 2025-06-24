import React, { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import { getGames, getTracks, getCars } from '../api';
import { Game, Track, Car } from '../types';
import { getImageUrl } from '../utils';

const ShowcasePage: React.FC = () => {
  const [games, setGames] = useState<Game[]>([]);
  const [tracks, setTracks] = useState<Track[]>([]);
  const [cars, setCars] = useState<Car[]>([]);
  const [search, setSearch] = useState('');
  const [gameFilter, setGameFilter] = useState('');

  useEffect(() => {
    getGames().then(setGames).catch(() => {});
    getTracks().then(setTracks).catch(() => {});
    getCars().then(setCars).catch(() => {});
  }, []);

  const searchLower = search.toLowerCase();
  const filteredGames = games.filter((g) =>
    g.name.toLowerCase().includes(searchLower)
  );
  const filteredTracks = tracks.filter(
    (t) =>
      (!gameFilter || t.gameId === gameFilter) &&
      t.name.toLowerCase().includes(searchLower)
  );
  const filteredCars = cars.filter(
    (c) =>
      (!gameFilter || c.gameId === gameFilter) &&
      c.name.toLowerCase().includes(searchLower)
  );

  return (
    <div className="container mx-auto py-6 space-y-8">
      <h1 className="text-3xl font-bold text-center">Showcase</h1>
      <div className="flex flex-col md:flex-row md:items-end gap-4">
        <input
          type="text"
          placeholder="Search..."
          value={search}
          onChange={(e) => setSearch(e.target.value)}
          className="w-full md:w-64 rounded border px-3 py-2"
        />
        <select
          value={gameFilter}
          onChange={(e) => setGameFilter(e.target.value)}
          className="w-full md:w-64 rounded border px-3 py-2"
        >
          <option value="">All games</option>
          {games.map((g) => (
            <option key={g.id} value={g.id}>
              {g.name}
            </option>
          ))}
        </select>
      </div>

      <section className="space-y-4">
        <h2 className="text-2xl font-semibold">Games</h2>
        <div className="grid gap-4 grid-cols-2 md:grid-cols-3 lg:grid-cols-4">
          {filteredGames.map((g) => (
            <Link
              key={g.id}
              to={`/game/${g.id}`}
              className="border rounded hover:shadow bg-card"
            >
              {g.imageUrl && (
                <img
                  src={getImageUrl(g.imageUrl)}
                  alt={g.name}
                  className="w-full h-32 object-cover rounded-t"
                />
              )}
              <div className="p-2">
                <h3 className="font-semibold">{g.name}</h3>
              </div>
            </Link>
          ))}
        </div>
      </section>

      <section className="space-y-4">
        <h2 className="text-2xl font-semibold">Tracks</h2>
        <div className="grid gap-4 grid-cols-2 md:grid-cols-3 lg:grid-cols-4">
          {filteredTracks.map((t) => (
            <Link
              key={t.id}
              to={`/track/${t.id}`}
              className="border rounded hover:shadow bg-card"
            >
              {t.imageUrl && (
                <img
                  src={getImageUrl(t.imageUrl)}
                  alt={t.name}
                  className="w-full h-32 object-cover rounded-t"
                />
              )}
              <div className="p-2">
                <h3 className="font-semibold">{t.name}</h3>
              </div>
            </Link>
          ))}
        </div>
      </section>

      <section className="space-y-4">
        <h2 className="text-2xl font-semibold">Cars</h2>
        <div className="grid gap-4 grid-cols-2 md:grid-cols-3 lg:grid-cols-4">
          {filteredCars.map((c) => (
            <Link
              key={c.id}
              to={`/car/${c.id}`}
              className="border rounded hover:shadow bg-card"
            >
              {c.imageUrl && (
                <img
                  src={getImageUrl(c.imageUrl)}
                  alt={c.name}
                  className="w-full h-32 object-cover rounded-t"
                />
              )}
              <div className="p-2">
                <h3 className="font-semibold">{c.name}</h3>
              </div>
            </Link>
          ))}
        </div>
      </section>
    </div>
  );
};

export default ShowcasePage;
