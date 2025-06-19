import React, { useEffect, useState } from 'react';
import { useParams, Link } from 'react-router-dom';
import { getCars, getLapTimes, getWorldRecords } from '../api';
import { Car, LapTime } from '../types';
import { getImageUrl } from '../utils';
import { formatTime } from '../utils/time';
import InputTypeBadge from '../components/InputTypeBadge';

const CarDetailPage: React.FC = () => {
  const { id } = useParams<{ id: string }>();
  const [car, setCar] = useState<Car | null>(null);
  const [recent, setRecent] = useState<LapTime[]>([]);
  const [top, setTop] = useState<LapTime[]>([]);
  const [tab, setTab] = useState<'top' | 'recent'>('top');

  useEffect(() => {
    if (!id) return;
    getCars()
      .then((data) => setCar(data.find((c) => c.id === id) || null))
      .catch(() => {});
    getWorldRecords()
      .then((data) => setTop(data.filter((l) => l.carId === id)))
      .catch(() => {});
    getLapTimes(undefined, id)
      .then((data) => {
        data.sort((a, b) => new Date(b.lapDate).getTime() - new Date(a.lapDate).getTime());
        setRecent(data.slice(0, 10));
      })
      .catch(() => {});
  }, [id]);

  if (!car) {
    return (
      <div className="container mx-auto py-6 text-center">
        <p className="text-muted-foreground">Car not found.</p>
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
            <th className="px-2 py-1 text-left">Input</th>
            <th className="px-2 py-1 text-right">Time</th>
          </tr>
        </thead>
        <tbody>
          {laps.map((r) => (
            <tr key={r.id} className="border-b last:border-0">
              <td className="px-2 py-1">{r.username}</td>
              <td className="px-2 py-1">{r.trackName}</td>
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

  return (
    <div className="container mx-auto py-6 space-y-6">
      <div className="text-center space-y-2">
        <h1 className="text-3xl font-bold">{car.name}</h1>
        {car.imageUrl && (
          <img src={getImageUrl(car.imageUrl)} alt={car.name} className="mx-auto max-w-lg rounded" />
        )}
        {car.description && <p className="text-muted-foreground text-sm">{car.description}</p>}
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

export default CarDetailPage;
