import React, { useEffect, useState } from 'react';
import { useParams, Link } from 'react-router-dom';
import { getCars, getGames, getLapTimes, getWorldRecords, updateCar, uploadFile } from '../api';
import { Car, LapTime } from '../types';
import { getImageUrl, slugify } from '../utils';
import { formatTime } from '../utils/time';
import InputTypeBadge from '../components/InputTypeBadge';
import MarkdownRenderer from '../components/MarkdownRenderer';
import { useAuth } from '../contexts/AuthContext';

const CarDetailPage: React.FC = () => {
  const { id } = useParams<{ id: string }>();
  const { user } = useAuth();
  const [car, setCar] = useState<Car | null>(null);
  const [recent, setRecent] = useState<LapTime[]>([]);
  const [top, setTop] = useState<LapTime[]>([]);
  const [tab, setTab] = useState<'top' | 'recent'>('top');
  const [editing, setEditing] = useState(false);
  const [name, setName] = useState('');
  const [description, setDescription] = useState('');
  const [imageFile, setImageFile] = useState<File | null>(null);
  const [packDesc, setPackDesc] = useState<string | null>(null);
  const [packData, setPackData] = useState<any | null>(null);
  const [images, setImages] = useState<string[]>([]);
  const [imgIdx, setImgIdx] = useState(0);

  useEffect(() => {
    if (!id) return;
    getCars()
      .then((data) => {
        const c = data.find((car) => car.id === id) || null;
        setCar(c);
        if (c) {
          setName(c.name);
          setDescription(c.description || '');
        }
      })
      .catch(() => {});
    getWorldRecords()
      .then((data) => setTop(data.filter((l) => l.carId === id)))
      .catch(() => {});
    getLapTimes({ carId: id })
      .then((data) => {
        data.sort((a, b) => new Date(b.lapDate).getTime() - new Date(a.lapDate).getTime());
        setRecent(data.slice(0, 10));
      })
      .catch(() => {});
  }, [id]);

  useEffect(() => {
    if (!car) return;
    setPackDesc(null);
    setPackData(null);
    setImages(car.imageUrl ? [car.imageUrl] : []);
    setImgIdx(0);
    getGames()
      .then((games) => {
        const g = games.find((gm) => gm.id === car.gameId);
        if (!g) return;
        const gameSegment = encodeURIComponent(g.name);
        const base = `/GamePack/${gameSegment}/cars/${slugify(car.name)}`;
        const fetchExtras = async (p: string) => {
          let found = false;
          try {
            const res = await fetch(`${p}/info.md`);
            if (res.ok) {
              const txt = await res.text();
              setPackDesc(txt);
              found = true;
            }
          } catch {
            // ignore
          }
          try {
            const resj = await fetch(`${p}/car.json`);
            if (resj.ok) {
              const data = await resj.json();
              setPackData(data);
              const imgs: string[] = [];
              if (data.media?.imageUrl) imgs.push(data.media.imageUrl);
              if (Array.isArray(data.media?.additionalImages)) {
                imgs.push(...data.media.additionalImages);
              }
              if (imgs.length > 0) {
                setImages(imgs);
              }
              found = true;
            }
          } catch {
            // ignore
          }
          return found;
        };
        fetchExtras(base).then((ok) => {
          if (!ok && car.imageUrl) {
            const idx = car.imageUrl.lastIndexOf('/');
            if (idx !== -1) {
              const altBase = encodeURI(car.imageUrl.substring(0, idx));
              fetchExtras(altBase);
            }
          }
        });
      })
      .catch(() => {});
  }, [car]);

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
              <td className="px-2 py-1">
                <Link to={`/track/${r.trackId}`} className="underline">
                  {r.trackName}
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
    if (!car) return;
    let imageUrl: string | undefined = car.imageUrl || undefined;
    if (imageFile) {
      const ext = imageFile.name.substring(imageFile.name.lastIndexOf('.'));
      const filename = `${slugify(name)}-${Date.now()}${ext}`;
      try {
        const res = await uploadFile(imageFile, 'images/cars', filename);
        imageUrl = res.url;
      } catch {
        imageUrl = car.imageUrl || undefined;
      }
    }
    const updated = await updateCar(car.id, {
      gameId: car.gameId,
      name,
      imageUrl,
      description,
    });
    setCar(updated);
    setEditing(false);
    setImageFile(null);
  };

  const handleCancel = () => {
    if (!car) return;
    setName(car.name);
    setDescription(car.description || '');
    setImageFile(null);
    setEditing(false);
  };

  const detailPairs: [string, string | number | boolean][] = [];
  if (packData) {
    if (packData.manufacturer) detailPairs.push(['Manufacturer', packData.manufacturer]);
    if (packData.model) detailPairs.push(['Model', packData.model]);
    if (packData.year) detailPairs.push(['Year', packData.year]);
    if (packData.class) detailPairs.push(['Class', packData.class]);
    if (packData.series) detailPairs.push(['Series', packData.series]);
    if (packData.dlc) detailPairs.push(['DLC', packData.dlc]);
    const specMap: Record<string, string> = {
      powerHP: 'Power (HP)',
      torqueNM: 'Torque (NM)',
      weightKG: 'Weight (kg)',
      topSpeedKPH: 'Top Speed (kph)',
      acceleration0to100: '0-100 (s)',
      brakingDistance100to0: 'Braking 100-0 (m)',
      massDistribution: 'Mass Distribution',
      engine: 'Engine',
      fuelType: 'Fuel',
      drivetrain: 'Drivetrain',
      gearbox: 'Gearbox',
      inputType: 'Input',
      isElectric: 'Electric',
      headlights: 'Headlights',
      ers: 'ERS',
      abs: 'ABS',
      tc: 'TC',
    };
    if (packData.specs) {
      Object.entries(packData.specs).forEach(([k, v]) => {
        if (v !== undefined && specMap[k]) {
          const val = typeof v === 'boolean' ? (v ? 'Yes' : 'No') : v;
          detailPairs.push([specMap[k], val as any]);
        }
      });
    }
  }
  const mid = Math.ceil(detailPairs.length / 2);
  const leftPairs = detailPairs.slice(0, mid);
  const rightPairs = detailPairs.slice(mid);

  return (
    <div className="container mx-auto py-6 space-y-6">
      <div className="text-center space-y-2">
        <h1 className="text-3xl font-bold">{car.name}</h1>
        {packDesc && !editing ? (
          <MarkdownRenderer content={packDesc} className="text-muted-foreground" />
        ) : car.description && !editing ? (
          <MarkdownRenderer content={car.description} className="text-muted-foreground" />
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
              <button className="px-4 py-2 rounded border" onClick={handleCancel}>
                Cancel
              </button>
            </div>
          </div>
        )}
      </div>
      <div className="md:flex md:space-x-4">
        <div className="md:w-1/2">
          <div className="relative group">
            {images[imgIdx] && (
              <img
                src={getImageUrl(images[imgIdx])}
                alt={car.name}
                className="rounded w-full"
              />
            )}
            {images.length > 1 && (
              <>
                <button
                  className="absolute left-2 top-1/2 -translate-y-1/2 bg-black bg-opacity-50 text-white px-2 py-1 hidden group-hover:block"
                  onClick={() =>
                    setImgIdx((i) => (i - 1 + images.length) % images.length)
                  }
                >
                  &lt;
                </button>
                <button
                  className="absolute right-2 top-1/2 -translate-y-1/2 bg-black bg-opacity-50 text-white px-2 py-1 hidden group-hover:block"
                  onClick={() => setImgIdx((i) => (i + 1) % images.length)}
                >
                  &gt;
                </button>
              </>
            )}
          </div>
        </div>
        <div className="md:w-1/2 mt-4 md:mt-0">
          <div className="grid grid-cols-4 gap-x-2 text-sm">
            <div className="space-y-1">
              {leftPairs.map(([k]) => (
                <div key={k} className="font-semibold">
                  {k}
                </div>
              ))}
            </div>
            <div className="space-y-1">
              {leftPairs.map(([k, v]) => (
                <div key={k}>{v}</div>
              ))}
            </div>
            <div className="space-y-1">
              {rightPairs.map(([k]) => (
                <div key={k} className="font-semibold">
                  {k}
                </div>
              ))}
            </div>
            <div className="space-y-1">
              {rightPairs.map(([k, v]) => (
                <div key={k}>{v}</div>
              ))}
            </div>
          </div>
        </div>
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
