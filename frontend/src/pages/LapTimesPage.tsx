import React, { useEffect, useState } from 'react';
import { Timer } from 'lucide-react';
import { Link } from 'react-router-dom';
import {
  getLapTimes,
  getGames,
  getTracks,
  getCars,
  getUsers,
  getAssists,
} from '../api';
import { LapTime, Game, Track, Car, User, Assist } from '../types';
import { formatTime } from '../utils/time';
import { getImageUrl } from '../utils';
import AssistTags from '../components/AssistTags';
import InputTypeBadge from '../components/InputTypeBadge';
import { Dialog, DialogContent } from '../components/ui/dialog';
import LapTimePopup from '../components/LapTimePopup';

const LapTimesPage: React.FC = () => {
  const [view, setView] = useState<'all' | 'filter'>('all');
  const [laps, setLaps] = useState<LapTime[]>([]);
  const [selectedLap, setSelectedLap] = useState<LapTime | null>(null);

  const [games, setGames] = useState<Game[]>([]);
  const [tracks, setTracks] = useState<Track[]>([]);
  const [cars, setCars] = useState<Car[]>([]);
  const [users, setUsers] = useState<Pick<User, 'id' | 'username'>[]>([]);
  const [assists, setAssists] = useState<Assist[]>([]);
  const [filters, setFilters] = useState({
    gameId: '',
    trackId: '',
    carId: '',
    userId: '',
    assist: '',
  });
  const [search, setSearch] = useState('');
  const [sort, setSort] = useState('timeAsc');

  useEffect(() => {
    getLapTimes()
      .then((data) => {
        data.sort((a, b) => a.timeMs - b.timeMs);
        setLaps(data);
      })
      .catch(() => {});
  }, []);

  useEffect(() => {
    if (view === 'filter') {
      getGames().then(setGames).catch(() => {});
      getCars(filters.gameId || undefined).then(setCars).catch(() => {});
      getUsers().then(setUsers).catch(() => {});
      getAssists().then(setAssists).catch(() => {});
    }
  }, [view, filters.gameId]);

  useEffect(() => {
    if (view === 'filter' && filters.gameId) {
      getTracks(filters.gameId)
        .then(setTracks)
        .catch(() => setTracks([]));
    } else {
      setTracks([]);
      setFilters((f) => ({ ...f, trackId: '' }));
    }
  }, [view, filters.gameId]);

  const filteredLaps = laps.filter((l) => {
    const searchLower = search.toLowerCase();
    return (
      (!filters.gameId || l.gameId === filters.gameId) &&
      (!filters.trackId || l.trackId === filters.trackId) &&
      (!filters.carId || l.carId === filters.carId) &&
      (!filters.userId || l.userId === filters.userId) &&
      (!filters.assist || l.assists?.includes(filters.assist)) &&
      (!search ||
        l.username?.toLowerCase().includes(searchLower) ||
        l.gameName?.toLowerCase().includes(searchLower) ||
        l.trackName?.toLowerCase().includes(searchLower) ||
        l.carName?.toLowerCase().includes(searchLower) ||
        l.layoutName?.toLowerCase().includes(searchLower) ||
        l.notes?.toLowerCase().includes(searchLower))
    );
  });

  const sortedLaps = [...filteredLaps].sort((a, b) => {
    switch (sort) {
      case 'timeAsc':
        return a.timeMs - b.timeMs;
      case 'timeDesc':
        return b.timeMs - a.timeMs;
      case 'dateAsc':
        return (
          new Date(a.lapDate).getTime() - new Date(b.lapDate).getTime()
        );
      case 'dateDesc':
        return (
          new Date(b.lapDate).getTime() - new Date(a.lapDate).getTime()
        );
      default:
        return 0;
    }
  });

  const renderTable = (data: LapTime[]) => (
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
          {data.map((l) => (
            <tr
              key={l.id}
              className="border-b last:border-0 cursor-pointer hover:bg-muted"
              onClick={() => setSelectedLap(l)}
            >
              <td className="px-2 py-1">{l.username}</td>
              <td className="px-2 py-1">
                {l.gameImageUrl && (
                  <img
                    src={getImageUrl(l.gameImageUrl)}
                    alt={l.gameName || ''}
                    className="h-8 w-14 object-cover rounded mb-1"
                  />
                )}
                {l.gameName}
              </td>
              <td className="px-2 py-1">
                {l.trackImageUrl && (
                  <img
                    src={getImageUrl(l.trackImageUrl)}
                    alt={l.trackName || ''}
                    className="h-8 w-14 object-cover rounded mb-1"
                  />
                )}
                <Link to={`/track/${l.trackId}`} className="underline">
                  {l.trackName}
                </Link>
                {l.layoutName ? ` - ${l.layoutName}` : ''}
              </td>
              <td className="px-2 py-1">
                {l.carImageUrl && (
                  <img
                    src={getImageUrl(l.carImageUrl)}
                    alt={l.carName || ''}
                    className="h-8 w-14 object-cover rounded mb-1"
                  />
                )}
                <Link to={`/car/${l.carId}`} className="underline">
                  {l.carName}
                </Link>
                <div className="mt-1 flex flex-wrap gap-1">
                  <InputTypeBadge inputType={l.inputType} />
                  <AssistTags assists={l.assists} />
                </div>
              </td>
              <td className="px-2 py-1 text-right">{formatTime(l.timeMs)}</td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );

  return (
    <div className="container mx-auto py-6 space-y-6">
      <div className="flex items-center justify-center space-x-2 mb-4">
        <Timer className="h-6 w-6" />
        <h1 className="text-3xl font-bold">Lap Times</h1>
      </div>
      <div className="flex justify-center mb-6">
        <button
          className={`px-4 py-2 rounded-l border ${
            view === 'all' ? 'bg-primary text-primary-foreground' : 'bg-muted'
          }`}
          onClick={() => setView('all')}
        >
          All Times
        </button>
        <button
          className={`px-4 py-2 rounded-r border-t border-b border-r ${
            view === 'filter' ? 'bg-primary text-primary-foreground' : 'bg-muted'
          }`}
          onClick={() => setView('filter')}
        >
          Filter
        </button>
      </div>
      <div className="flex flex-col md:flex-row md:items-end gap-4 mb-6">
        <input
          type="text"
          placeholder="Search..."
          value={search}
          onChange={(e) => setSearch(e.target.value)}
          className="w-full md:w-64 rounded border px-3 py-2"
        />
        <select
          value={sort}
          onChange={(e) => setSort(e.target.value)}
          className="w-full md:w-48 rounded border px-3 py-2"
        >
          <option value="timeAsc">Time ↑</option>
          <option value="timeDesc">Time ↓</option>
          <option value="dateDesc">Date ↓</option>
          <option value="dateAsc">Date ↑</option>
        </select>
      </div>
      {view === 'filter' && (
        <div className="grid grid-cols-1 md:grid-cols-3 lg:grid-cols-5 gap-4 mb-6">
          <select
            value={filters.gameId}
            onChange={(e) => setFilters({ ...filters, gameId: e.target.value })}
            className="w-full rounded border px-3 py-2"
          >
            <option value="">All games</option>
            {games.map((g) => (
              <option key={g.id} value={g.id}>
                {g.name}
              </option>
            ))}
          </select>
          <select
            value={filters.trackId}
            onChange={(e) => setFilters({ ...filters, trackId: e.target.value })}
            className="w-full rounded border px-3 py-2"
            disabled={!filters.gameId}
          >
            <option value="">All tracks</option>
            {tracks.map((t) => (
              <option key={t.id} value={t.id}>
                {t.name}
              </option>
            ))}
          </select>
          <select
            value={filters.carId}
            onChange={(e) => setFilters({ ...filters, carId: e.target.value })}
            className="w-full rounded border px-3 py-2"
          >
            <option value="">All cars</option>
            {cars.map((c) => (
              <option key={c.id} value={c.id}>
                {c.name}
              </option>
            ))}
          </select>
          <select
            value={filters.userId}
            onChange={(e) => setFilters({ ...filters, userId: e.target.value })}
            className="w-full rounded border px-3 py-2"
          >
            <option value="">All users</option>
            {users.map((u) => (
              <option key={u.id} value={u.id}>
                {u.username}
              </option>
            ))}
          </select>
          <select
            value={filters.assist}
            onChange={(e) => setFilters({ ...filters, assist: e.target.value })}
            className="w-full rounded border px-3 py-2"
          >
            <option value="">All assists</option>
            {assists.map((a) => (
              <option key={a.id} value={a.name}>
                {a.name}
              </option>
            ))}
          </select>
        </div>
      )}
      {sortedLaps.length > 0 ? (
        renderTable(sortedLaps)
      ) : (
        <p className="text-center text-muted-foreground">No lap times found.</p>
      )}

      <Dialog open={!!selectedLap} onOpenChange={(o) => !o && setSelectedLap(null)}>
        <DialogContent>
          {selectedLap && <LapTimePopup lap={selectedLap} />}
        </DialogContent>
      </Dialog>
    </div>
  );
};

export default LapTimesPage;
