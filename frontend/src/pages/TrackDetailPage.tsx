import React, { useEffect, useState } from 'react';
import { useParams, Link } from 'react-router-dom';
import { getTracks, getGames, getLayouts, getLeaderboard, updateTrack, uploadFile } from '../api';
import { Track, Layout, LapTime } from '../types';
import { getImageUrl, slugify } from '../utils';
import { formatTime } from '../utils/time';
import InputTypeBadge from '../components/InputTypeBadge';
import { useAuth } from '../contexts/AuthContext';
import MarkdownRenderer from '../components/MarkdownRenderer';

interface LayoutWithTL extends Layout {
  trackLayoutId?: string;
}

const TrackDetailPage: React.FC = () => {
  const { id } = useParams<{ id: string }>();
  const { user } = useAuth();
  const [track, setTrack] = useState<Track | null>(null);
  const [layouts, setLayouts] = useState<LayoutWithTL[]>([]);
  const [records, setRecords] = useState<Record<string, LapTime[]>>({});
  const [editing, setEditing] = useState(false);
  const [name, setName] = useState('');
  const [description, setDescription] = useState('');
  const [imageFile, setImageFile] = useState<File | null>(null);
  const [packDesc, setPackDesc] = useState<string | null>(null);
  const [packImage, setPackImage] = useState<string | null>(null);

  useEffect(() => {
    if (!id) return;
    getTracks()
      .then((data) => {
        const t = data.find((tr) => tr.id === id) || null;
        setTrack(t || null);
        if (t) {
          setName(t.name);
          setDescription(t.description || '');
        }
      })
      .catch(() => {});
  }, [id]);

  useEffect(() => {
    if (!track) return;
    getLayouts(track.id)
      .then((data) => setLayouts(data as LayoutWithTL[]))
      .catch(() => {});
  }, [track]);

  useEffect(() => {
    if (!track) return;
    setPackDesc(null);
    setPackImage(null);
    getGames()
      .then((games) => {
        const g = games.find((gm) => gm.id === track.gameId);
        if (!g) return;
        const base = `/GamePack/${slugify(g.name)}/tracks/${slugify(track.name)}`;
        const fetchInfo = async (p: string) => {
          try {
            const res = await fetch(`${p}/info.md`);
            if (!res.ok) throw new Error('missing');
            const txt = await res.text();
            setPackDesc(txt);
            const exts = ['jpg', 'png', 'jpeg', 'webp'];
            for (const ext of exts) {
              try {
                const r = await fetch(`${p}/track.${ext}`, { method: 'HEAD' });
                if (r.ok) {
                  setPackImage(`${p}/track.${ext}`);
                  return;
                }
              } catch {
                // ignore and try next
              }
            }
          } catch {
            return false;
          }
          return true;
        };
        fetchInfo(base).then((ok) => {
          if (!ok && track.imageUrl) {
            const idx = track.imageUrl.lastIndexOf('/');
            if (idx !== -1) {
              const altBase = track.imageUrl.substring(0, idx);
              fetchInfo(altBase);
            }
          }
        });
      })
      .catch(() => {});
  }, [track]);

  useEffect(() => {
    if (!track) return;
    layouts.forEach((l) => {
      if (!l.trackLayoutId) return;
      getLeaderboard({ gameId: track.gameId, trackLayoutId: l.trackLayoutId })
        .then((res) =>
          setRecords((r) => ({ ...r, [l.id]: res }))
        )
        .catch(() => {});
    });
  }, [track, layouts]);

  if (!track) {
    return (
      <div className="container mx-auto py-6 text-center">
        <p className="text-muted-foreground">Track not found.</p>
      </div>
    );
  }

  const handleSave = async () => {
    if (!track) return;
    let imageUrl: string | undefined = track.imageUrl || undefined;
    if (imageFile) {
      const ext = imageFile.name.substring(imageFile.name.lastIndexOf('.'));
      const filename = `${slugify(name)}-${Date.now()}${ext}`;
      try {
        const res = await uploadFile(imageFile, 'images/tracks', filename);
        imageUrl = res.url;
      } catch {
        imageUrl = track.imageUrl || undefined;
      }
    }
    const updated = await updateTrack(track.id, {
      gameId: track.gameId,
      name,
      imageUrl,
      description,
    });
    setTrack(updated);
    setEditing(false);
    setImageFile(null);
  };

  const handleCancel = () => {
    if (!track) return;
    setName(track.name);
    setDescription(track.description || '');
    setImageFile(null);
    setEditing(false);
  };

  return (
    <div className="container mx-auto py-6 space-y-6">
      <div className="text-center space-y-2">
        <h1 className="text-3xl font-bold">{track.name}</h1>
        {(packImage || track.imageUrl) && (
          <img
            src={packImage || getImageUrl(track.imageUrl)}
            alt={track.name}
            className="mx-auto max-w-lg rounded"
          />
        )}
        {packDesc && !editing ? (
          <MarkdownRenderer content={packDesc} className="text-muted-foreground" />
        ) : track.description && !editing ? (
          <MarkdownRenderer content={track.description} className="text-muted-foreground" />
        ) : null}
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
              <label className="block text-sm font-medium">Description</label>
              <textarea
                className="w-full rounded border px-3 py-2"
                value={description}
                onChange={(e) => setDescription(e.target.value)}
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
              <button
                className="px-4 py-2 rounded border"
                onClick={handleCancel}
              >
                Cancel
              </button>
            </div>
          </div>
        )}
      </div>
      {layouts.map((layout) => (
        <div key={layout.id} className="space-y-2">
          <h2 className="text-2xl font-semibold">{layout.name}</h2>
          <div className="flex flex-col md:flex-row md:space-x-4">
            {layout.imageUrl && (
              <img
                src={getImageUrl(layout.imageUrl)}
                alt={layout.name}
                className="max-w-lg rounded mb-2 md:mb-0"
              />
            )}
            <div className="text-sm space-y-1 md:w-80">
              {layout.location && (
                <p>
                  <strong>Location:</strong> {layout.location}
                </p>
              )}
              {layout.pitSpeedLimitHighKPH && (
                <p>
                  <strong>Pit Speed Limit:</strong> {layout.pitSpeedLimitHighKPH} kph
                </p>
              )}
              {layout.maxAIParticipants && (
                <p>
                  <strong>Max AI participants:</strong> {layout.maxAIParticipants}
                </p>
              )}
              {layout.numberOfTurns && (
                <p>
                  <strong>Number Of Turns:</strong> {layout.numberOfTurns}
                </p>
              )}
              {layout.trackSurface && (
                <p>
                  <strong>Track Surface:</strong> {layout.trackSurface}
                </p>
              )}
              {layout.trackType && (
                <p>
                  <strong>Track Type:</strong> {layout.trackType}
                </p>
              )}
              {(layout.raceDateYear || layout.raceDateMonth || layout.raceDateDay) && (
                <p>
                  <strong>Race Date:</strong>{' '}
                  {[layout.raceDateYear, layout.raceDateMonth, layout.raceDateDay]
                    .filter(Boolean)
                    .join('-')}
                </p>
              )}
              {layout.trackGradeFilter && (
                <p>
                  <strong>Track Grade:</strong> {layout.trackGradeFilter}
                </p>
              )}
              {layout.trackTimeZone && (
                <p>
                  <strong>Time Zone:</strong> {layout.trackTimeZone}
                </p>
              )}
              {layout.trackAltitude && (
                <p>
                  <strong>Altitude:</strong> {layout.trackAltitude}
                </p>
              )}
              {layout.length && (
                <p>
                  <strong>Length:</strong> {layout.length}
                </p>
              )}
              {layout.dlcId && (
                <p>
                  <strong>DLC ID:</strong> {layout.dlcId}
                </p>
              )}
            </div>
          </div>
          {records[layout.id] && records[layout.id].length > 0 ? (
            <div className="overflow-x-auto">
              <table className="min-w-full text-sm border">
                <thead>
                  <tr className="border-b">
                    <th className="px-2 py-1 text-left">Driver</th>
                    <th className="px-2 py-1 text-left">Car</th>
                    <th className="px-2 py-1 text-left">Input</th>
                    <th className="px-2 py-1 text-right">Time</th>
                  </tr>
                </thead>
                <tbody>
                  {records[layout.id].map((r) => (
                    <tr key={r.id} className="border-b last:border-0">
                      <td className="px-2 py-1">{r.username}</td>
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
          ) : (
            <p className="text-muted-foreground text-sm">No records yet.</p>
          )}
        </div>
      ))}
      <div>
        <Link to="/lap-times" className="text-primary underline">
          View all lap times
        </Link>
      </div>
    </div>
  );
};

export default TrackDetailPage;

