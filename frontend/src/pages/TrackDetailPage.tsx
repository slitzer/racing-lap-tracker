import React, { useEffect, useState } from 'react';
import { useParams, Link } from 'react-router-dom';
import { getTracks, getLayouts, getLeaderboard } from '../api';
import { Track, Layout, LapTime } from '../types';
import { getImageUrl } from '../utils';
import { formatTime } from '../utils/time';

interface LayoutWithTL extends Layout {
  trackLayoutId?: string;
}

const TrackDetailPage: React.FC = () => {
  const { id } = useParams<{ id: string }>();
  const [track, setTrack] = useState<Track | null>(null);
  const [layouts, setLayouts] = useState<LayoutWithTL[]>([]);
  const [records, setRecords] = useState<Record<string, LapTime[]>>({});

  useEffect(() => {
    if (!id) return;
    getTracks()
      .then((data) => {
        const t = data.find((tr) => tr.id === id) || null;
        setTrack(t || null);
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

  return (
    <div className="container mx-auto py-6 space-y-6">
      <div className="text-center space-y-2">
        <h1 className="text-3xl font-bold">{track.name}</h1>
        {track.imageUrl && (
          <img
            src={getImageUrl(track.imageUrl)}
            alt={track.name}
            className="mx-auto max-w-lg rounded"
          />
        )}
      </div>
      {layouts.map((layout) => (
        <div key={layout.id} className="space-y-2">
          <h2 className="text-2xl font-semibold">{layout.name}</h2>
          {layout.imageUrl && (
            <img
              src={getImageUrl(layout.imageUrl)}
              alt={layout.name}
              className="max-w-lg rounded mb-2"
            />
          )}
          {records[layout.id] && records[layout.id].length > 0 ? (
            <div className="overflow-x-auto">
              <table className="min-w-full text-sm border">
                <thead>
                  <tr className="border-b">
                    <th className="px-2 py-1 text-left">Driver</th>
                    <th className="px-2 py-1 text-left">Car</th>
                    <th className="px-2 py-1 text-right">Time</th>
                  </tr>
                </thead>
                <tbody>
                  {records[layout.id].map((r) => (
                    <tr key={r.id} className="border-b last:border-0">
                      <td className="px-2 py-1">{r.username}</td>
                      <td className="px-2 py-1">{r.carName}</td>
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

