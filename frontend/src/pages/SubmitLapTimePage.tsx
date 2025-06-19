import React, { useEffect, useState } from 'react';
import { PlusCircle } from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import {
  getGames,
  getTracks,
  getLayouts,
  getCars,
  getAssists,
  submitLapTime,
  uploadFile,
} from '../api';
import { Game, Track, Layout, Car, Assist } from '../types';
import { parseTime } from '../utils/time';
import { Button } from '../components/ui/button';

const inputTypes = ['Wheel', 'Controller', 'Keyboard'];

const SubmitLapTimePage: React.FC = () => {
  const navigate = useNavigate();
  const [games, setGames] = useState<Game[]>([]);
  const [tracks, setTracks] = useState<Track[]>([]);
  const [layouts, setLayouts] = useState<Layout[]>([]);
  const [cars, setCars] = useState<Car[]>([]);
  const [assists, setAssists] = useState<Assist[]>([]);
  const [selectedAssists, setSelectedAssists] = useState<string[]>([]);

  const [gameId, setGameId] = useState('');
  const [trackId, setTrackId] = useState('');
  const [trackLayoutId, setTrackLayoutId] = useState('');
  const [carId, setCarId] = useState('');
  const [inputType, setInputType] = useState(inputTypes[0]);
  const [time, setTime] = useState('');
  const [lapDate, setLapDate] = useState('');
  const [screenshot, setScreenshot] = useState<File | null>(null);
  const [error, setError] = useState('');
  const [submitting, setSubmitting] = useState(false);

  useEffect(() => {
    getGames().then(setGames).catch(() => {});
    getAssists().then(setAssists).catch(() => {});
  }, []);

  useEffect(() => {
    if (gameId) {
      getTracks(gameId)
        .then(setTracks)
        .catch(() => setTracks([]));
      getCars(gameId)
        .then(setCars)
        .catch(() => setCars([]));
    } else {
      setTracks([]);
      setCars([]);
      setTrackId('');
      setCarId('');
    }
  }, [gameId]);

  useEffect(() => {
    if (trackId) {
      getLayouts(trackId)
        .then(setLayouts)
        .catch(() => setLayouts([]));
    } else {
      setLayouts([]);
      setTrackLayoutId('');
    }
  }, [trackId]);

  const toggleAssist = (id: string) => {
    setSelectedAssists((prev) =>
      prev.includes(id) ? prev.filter((a) => a !== id) : [...prev, id]
    );
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    const timeMs = parseTime(time);
    if (timeMs === null) {
      setError('Invalid time format. Use m:ss.mmm');
      return;
    }
    setSubmitting(true);
    setError('');
    try {
      let screenshotUrl: string | undefined;
      if (screenshot) {
        const res = await uploadFile(screenshot);
        screenshotUrl = res.url;
      }
      await submitLapTime({
        gameId,
        trackLayoutId,
        carId,
        inputType,
        timeMs,
        lapDate,
        screenshotUrl,
        assists: selectedAssists,
      });
      navigate('/lap-times');
    } catch (err: any) {
      setError(err.message || 'Failed to submit lap time');
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <div className="container mx-auto max-w-md py-6">
      <div className="flex items-center justify-center space-x-2 mb-6">
        <PlusCircle className="h-6 w-6" />
        <h1 className="text-3xl font-bold">Submit Lap Time</h1>
      </div>
      <form onSubmit={handleSubmit} className="space-y-4">
        {error && <p className="text-destructive text-sm">{error}</p>}
        <div className="space-y-1">
          <label className="block text-sm font-medium">Game</label>
          <select
            value={gameId}
            onChange={(e) => setGameId(e.target.value)}
            className="w-full rounded border px-3 py-2"
            required
          >
            <option value="">Select game</option>
            {games.map((g) => (
              <option key={g.id} value={g.id}>
                {g.name}
              </option>
            ))}
          </select>
        </div>
        <div className="space-y-1">
          <label className="block text-sm font-medium">Track</label>
          <select
            value={trackId}
            onChange={(e) => setTrackId(e.target.value)}
            className="w-full rounded border px-3 py-2"
            required
            disabled={!gameId}
          >
            <option value="">Select track</option>
            {tracks.map((t) => (
              <option key={t.id} value={t.id}>
                {t.name}
              </option>
            ))}
          </select>
        </div>
        <div className="space-y-1">
          <label className="block text-sm font-medium">Layout</label>
          <select
            value={trackLayoutId}
            onChange={(e) => setTrackLayoutId(e.target.value)}
            className="w-full rounded border px-3 py-2"
            required
            disabled={!trackId}
          >
            <option value="">Select layout</option>
            {layouts.map((l) => (
              <option key={l.id} value={l.trackLayoutId || l.id}>
                {l.name}
              </option>
            ))}
          </select>
        </div>
        <div className="space-y-1">
          <label className="block text-sm font-medium">Car</label>
          <select
            value={carId}
            onChange={(e) => setCarId(e.target.value)}
            className="w-full rounded border px-3 py-2"
            required
            disabled={!gameId}
          >
            <option value="">Select car</option>
            {cars.map((c) => (
              <option key={c.id} value={c.id}>
                {c.name}
              </option>
            ))}
          </select>
        </div>
        <div className="space-y-1">
          <label className="block text-sm font-medium">Input Type</label>
          <select
            value={inputType}
            onChange={(e) => setInputType(e.target.value)}
            className="w-full rounded border px-3 py-2"
          >
            {inputTypes.map((type) => (
              <option key={type} value={type}>
                {type}
              </option>
            ))}
          </select>
        </div>
        <div className="space-y-1">
          <label className="block text-sm font-medium">Assists</label>
          <div className="flex flex-wrap gap-2">
            {assists.map((a) => (
              <label key={a.id} className="flex items-center space-x-1">
                <input
                  type="checkbox"
                  checked={selectedAssists.includes(a.id)}
                  onChange={() => toggleAssist(a.id)}
                  className="accent-primary"
                />
                <span>{a.name}</span>
              </label>
            ))}
          </div>
        </div>
        <div className="space-y-1">
          <label className="block text-sm font-medium">Time (m:ss.mmm)</label>
          <input
            value={time}
            onChange={(e) => setTime(e.target.value)}
            className="w-full rounded border px-3 py-2"
            placeholder="1:23.456"
            required
          />
        </div>
        <div className="space-y-1">
          <label className="block text-sm font-medium">Lap Date</label>
          <input
            type="date"
            value={lapDate}
            onChange={(e) => setLapDate(e.target.value)}
            className="w-full rounded border px-3 py-2"
            required
          />
        </div>
        <div className="space-y-1">
          <label className="block text-sm font-medium">Screenshot</label>
          <input
            type="file"
            accept="image/*"
            onChange={(e) => setScreenshot(e.target.files?.[0] || null)}
            className="w-full"
          />
        </div>
        <Button type="submit" className="w-full" disabled={submitting}>
          Submit
        </Button>
      </form>
    </div>
  );
};

export default SubmitLapTimePage;
