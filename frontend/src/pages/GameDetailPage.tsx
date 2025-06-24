import React, { useEffect, useState } from 'react';
import { useParams, Link } from 'react-router-dom';
import {
  getGames,
  getLapTimes,
  getWorldRecords,
  updateGame,
  uploadFile,
} from '../api';
import { Game, LapTime } from '../types';
import { getImageUrl, slugify } from '../utils';
import { formatTime } from '../utils/time';
import InputTypeBadge from '../components/InputTypeBadge';
import { useAuth } from '../contexts/AuthContext';

const GameDetailPage: React.FC = () => {
  const { id } = useParams<{ id: string }>();
  const { user } = useAuth();
  const [game, setGame] = useState<Game | null>(null);
  const [recent, setRecent] = useState<LapTime[]>([]);
  const [top, setTop] = useState<LapTime[]>([]);
  const [tab, setTab] = useState<'top' | 'recent'>('top');
  const [editing, setEditing] = useState(false);
  const [name, setName] = useState('');
  const [imageFile, setImageFile] = useState<File | null>(null);

  useEffect(() => {
    if (!id) return;
    getGames()
      .then((data) => {
        const g = data.find((gm) => gm.id === id) || null;
        setGame(g);
        if (g) {
          setName(g.name);
        }
      })
      .catch(() => {});
    getWorldRecords()
      .then((data) => setTop(data.filter((l) => l.gameId === id)))
      .catch(() => {});
    getLapTimes()
      .then((data) => {
        const filtered = data.filter((l) => l.gameId === id);
        filtered.sort(
          (a, b) => new Date(b.lapDate).getTime() - new Date(a.lapDate).getTime()
        );
        setRecent(filtered.slice(0, 10));
      })
      .catch(() => {});
  }, [id]);

  if (!game) {
    return (
      <div className="container mx-auto py-6 text-center">
        <p className="text-muted-foreground">Game not found.</p>
      </div>
    );
  }

  const renderTable = (laps: LapTime[]) => (
    <div className="overflow-x-auto">
      <table className="min-w-full text-sm border">
        <thead>
          <tr className="border-b">
            <th className="px-2 py-1 text-left">Driver</th>
            <th className="px-2 py-1 text-left">Track</th>
            <th className="px-2 py-1 text-left">Car</th>
            <th className="px-2 py-1 text-left">Input</th>
            <th className="px-2 py-1 text-right">Time</th>
          </tr>
        </thead>
        <tbody>
          {laps.map((r) => (
            <tr key={r.id} className="border-b last:border-0">
              <td className="px-2 py-1">{r.username}</td>
              <td className="px-2 py-1">
                <Link to={`/track/${r.trackId}`} className="underline">
                  {r.trackName}
                </Link>
              </td>
              <td className="px-2 py-1">
                <Link to={`/car/${r.carId}`} className="underline">
                  {r.carName}
                </Link>
              </td>
              <td className="px-2 py-1">
                <InputTypeBadge inputType={r.inputType} />
              </td>
              <td className="px-2 py-1 text-right">{formatTime(r.timeMs)}</td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );

  const handleSave = async () => {
    if (!game) return;
    let imageUrl: string | undefined = game.imageUrl || undefined;
    if (imageFile) {
      const ext = imageFile.name.substring(imageFile.name.lastIndexOf('.'));
      const filename = `${slugify(name)}-${Date.now()}${ext}`;
      try {
        const res = await uploadFile(imageFile, 'images/games', filename);
        imageUrl = res.url;
      } catch {
        imageUrl = game.imageUrl || undefined;
      }
    }
    const updated = await updateGame(game.id, {
      name,
      imageUrl,
    });
    setGame(updated);
    setEditing(false);
    setImageFile(null);
  };

  const handleCancel = () => {
    if (!game) return;
    setName(game.name);
    setImageFile(null);
    setEditing(false);
  };

  return (
    <div className="container mx-auto py-6 space-y-6">
      <div className="text-center space-y-2">
        <h1 className="text-3xl font-bold">{game.name}</h1>
        {game.imageUrl && (
          <img
            src={getImageUrl(game.imageUrl)}
            alt={game.name}
            className="mx-auto max-w-lg rounded"
          />
        )}
        {user?.isAdmin && !editing && (
          <button
            className="text-sm underline text-primary"
            onClick={() => setEditing(true)}
          >
            Edit
          </button>
        )}
        {editing && (
          <div className="space-y-2">
            <div className="space-y-1">
              <label className="block text-sm font-medium">Name</label>
              <input
                className="w-full rounded border px-3 py-2"
                value={name}
                onChange={(e) => setName(e.target.value)}
              />
            </div>
            <div className="space-y-1">
              <label className="block text-sm font-medium">Image</label>
              <input
                type="file"
                accept="image/*"
                onChange={(e) => setImageFile(e.target.files?.[0] || null)}
              />
            </div>
            <div className="flex space-x-2">
              <button
                className="px-4 py-2 rounded bg-primary text-primary-foreground"
                onClick={handleSave}
              >
                Save
              </button>
              <button className="px-4 py-2 rounded border" onClick={handleCancel}>
                Cancel
              </button>
            </div>
          </div>
        )}
      </div>
      <div className="space-y-4">
        <div className="flex justify-center">
          <button
            className={`px-4 py-2 rounded-l border ${
              tab === 'top' ? 'bg-primary text-primary-foreground' : 'bg-muted'
            }`}
            onClick={() => setTab('top')}
          >
            Top
          </button>
          <button
            className={`px-4 py-2 rounded-r border-t border-b border-r ${
              tab === 'recent' ? 'bg-primary text-primary-foreground' : 'bg-muted'
            }`}
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
      </div>
      <div>
        <Link to="/lap-times" className="text-primary underline">
          View all lap times
        </Link>
      </div>
    </div>
  );
};

export default GameDetailPage;

