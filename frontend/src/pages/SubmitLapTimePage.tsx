import React, { useEffect, useState } from 'react';
import { PlusCircle } from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import { useDropzone } from 'react-dropzone';
import { toast } from 'sonner';
import {
  getGames,
  getTracks,
  getLayouts,
  getCars,
  getAssists,
  submitLapTime,
  uploadFile,
  getLapTimes,
  getLeaderboard,
} from '../api';
import { Game, Track, Layout, Car, Assist, LapTime } from '../types';
import { parseTime, formatTime } from '../utils/time';
import { getImageUrl } from '../utils';
import { useAuth } from '../contexts/AuthContext';
import MarkdownRenderer from '../components/MarkdownRenderer';
import CollapsibleSection from '../components/admin/CollapsibleSection';
import { Button } from '../components/ui/button';

const inputTypes = ['Wheel', 'Controller', 'Keyboard'];

const assistEmojis: Record<string, string> = {
  'Traction Control': '🛞',
  ABS: '🛑',
  'Stability Control': '⚖️',
  'Auto Clutch': '🤖',
  'Automatic Transmission': '🚗',
  'Launch Control': '🚀',
  'Brake Assist': '🅱️',
  'Throttle Assist': '🏁',
  'Steering Assist': '↪️',
  'Racing Line': '🛣️',
  'Suggested Gear Indicator': '⚙️',
  'Braking Indicator': '🅱️',
  'Cornering Guide': '↩️',
  'Ghosting / Collision Off': '👻',
  'Tire Wear Off': '🛞',
  'Fuel Usage Off': '⛽',
  'Mechanical Failures Off': '🔧',
  'Damage Off': '💥',
};

const SubmitLapTimePage: React.FC = () => {
  const navigate = useNavigate();
  const { user } = useAuth();
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
  const [deviceModel, setDeviceModel] = useState('');
  const [time, setTime] = useState('');
  const [timeError, setTimeError] = useState('');
  const [lapDate, setLapDate] = useState(() =>
    new Date().toISOString().slice(0, 10)
  );
  const [screenshot, setScreenshot] = useState<File | null>(null);
  const [screenshotPreview, setScreenshotPreview] = useState<string | null>(null);
  const [notes, setNotes] = useState('');
  const [error, setError] = useState('');
  const [submitting, setSubmitting] = useState(false);
  const [personalTimes, setPersonalTimes] = useState<LapTime[]>([]);
  const [personalBestMs, setPersonalBestMs] = useState<number | null>(null);
  const [rank, setRank] = useState<number | null>(null);

  const onDrop = React.useCallback((accepted: File[]) => {
    const file = accepted[0];
    if (file) {
      setScreenshot(file);
      setScreenshotPreview(URL.createObjectURL(file));
    }
  }, []);
  const { getRootProps, getInputProps, isDragActive } = useDropzone({ onDrop, accept: { 'image/*': [] } });

  useEffect(() => {
    getGames().then(setGames).catch(() => {});
    getAssists().then(setAssists).catch(() => {});
    const last = localStorage.getItem('lapFormLast');
    if (last) {
      try {
        const obj = JSON.parse(last);
        if (obj.gameId) setGameId(obj.gameId);
        if (obj.trackId) setTrackId(obj.trackId);
        if (obj.trackLayoutId) setTrackLayoutId(obj.trackLayoutId);
        if (obj.carId) setCarId(obj.carId);
        if (obj.inputType) setInputType(obj.inputType);
      } catch {}
    }
    if (user && user.defaultAssists && user.defaultAssists.length > 0) {
      setSelectedAssists(user.defaultAssists);
    }
  }, [user]);

  useEffect(() => {
    if (gameId) {
      setTrackId('');
      setTrackLayoutId('');
      setCarId('');
      setScreenshotPreview(null);
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
      setTrackLayoutId('');
      setCarId('');
      setScreenshotPreview(null);
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

  useEffect(() => {
    if (!user || !gameId || !trackLayoutId) {
      setPersonalTimes([]);
      setPersonalBestMs(null);
      setRank(null);
      return;
    }
    getLapTimes(user.id)
      .then((data) => {
        const filtered = data.filter(
          (t) => t.trackLayoutId === trackLayoutId && t.gameId === gameId
        );
        setPersonalTimes(filtered);
        if (filtered.length > 0) {
          setPersonalBestMs(Math.min(...filtered.map((t) => t.timeMs)));
        } else {
          setPersonalBestMs(null);
        }
      })
      .catch(() => {});
    getLeaderboard({ gameId, trackLayoutId })
      .then((lb) => {
        const idx = lb.findIndex((t) => t.userId === user.id);
        setRank(idx >= 0 ? idx + 1 : null);
      })
      .catch(() => {});
  }, [user, gameId, trackLayoutId]);

  useEffect(() => {
    const obj = { gameId, trackId, trackLayoutId, carId, inputType };
    localStorage.setItem('lapFormLast', JSON.stringify(obj));
  }, [gameId, trackId, trackLayoutId, carId, inputType]);

  const toggleAssist = (id: string) => {
    setSelectedAssists((prev) =>
      prev.includes(id) ? prev.filter((a) => a !== id) : [...prev, id]
    );
  };

  const selectedTrack = tracks.find((t) => t.id === trackId) || null;
  const selectedLayout =
    layouts.find((l) => (l.trackLayoutId || l.id) === trackLayoutId) || null;
  const selectedGame = games.find((g) => g.id === gameId) || null;
  const selectedCar = cars.find((c) => c.id === carId) || null;

  const handleTimeChange = (val: string) => {
    setTime(val);
    if (!val.trim()) {
      setTimeError('');
      return;
    }
    setTimeError(parseTime(val) === null ? 'Format m:ss.mmm' : '');
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
      const combinedNotes = deviceModel
        ? `${notes}${notes ? '\n' : ''}Device: ${deviceModel}`
        : notes;
      await submitLapTime({
        gameId,
        trackLayoutId,
        carId,
        inputType,
        timeMs,
        lapDate,
        screenshotUrl,
        assists: selectedAssists,
        notes: combinedNotes,
      });
      toast.success('Lap time submitted!');
      navigate('/lap-times');
    } catch (err: any) {
      setError(err.message || 'Failed to submit lap time');
    } finally {
      setSubmitting(false);
    }
  };

      return (
        <div className="container mx-auto max-w-3xl py-6">
          <div className="flex items-center justify-center space-x-2 mb-6">
            <PlusCircle className="h-6 w-6" />
            <h1 className="text-3xl font-bold">Submit Lap Time</h1>
          </div>
          <form onSubmit={handleSubmit} className="space-y-4">
            {error && <p className="text-destructive text-sm">{error}</p>}
            <div className="grid grid-cols-4 gap-2">
              {[selectedGame, selectedTrack, selectedLayout, selectedCar].map((it, i) => (
                <div
                  key={i}
                  className="h-20 border rounded overflow-hidden flex items-center justify-center bg-muted"
                >
                  {it?.imageUrl && (
                    <img
                      src={getImageUrl(it.imageUrl)}
                      alt="preview"
                      className="object-cover w-full h-full"
                    />
                  )}
                </div>
              ))}
            </div>
            <div className="md:grid md:grid-cols-2 md:gap-6">
              <div className="space-y-4">
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
                {(inputType === 'Controller' || inputType === 'Keyboard') && (
                  <div className="space-y-1">
                    <label className="block text-sm font-medium">Device</label>
                    <input
                      className="w-full rounded border px-3 py-2"
                      value={deviceModel}
                      onChange={(e) => setDeviceModel(e.target.value)}
                      placeholder="e.g. Xbox Controller"
                    />
                  </div>
                )}
                <div className="space-y-1">
                  <label className="block text-sm font-medium">Time (m:ss.mmm)</label>
                  <input
                    value={time}
                    onChange={(e) => handleTimeChange(e.target.value)}
                    className="w-full rounded border px-3 py-2"
                    placeholder="1:23.456"
                    required
                  />
                  {timeError && (
                    <p className="text-destructive text-xs">{timeError}</p>
                  )}
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
              </div>
              <div className="space-y-4 mt-6 md:mt-0">
                <div className="space-y-1">
                  <label className="block text-sm font-medium">Assists</label>
                  <div className="grid grid-cols-2 gap-2">
                    {assists.map((a) => (
                      <label key={a.id} className="flex items-center space-x-1">
                        <input
                          type="checkbox"
                          checked={selectedAssists.includes(a.id)}
                          onChange={() => toggleAssist(a.id)}
                          className="accent-primary"
                        />
                        <span>{(assistEmojis[a.name] || '🔧') + ' ' + a.name}</span>
                      </label>
                    ))}
                  </div>
                </div>
                <div className="space-y-1">
                  <label className="block text-sm font-medium">Screenshot</label>
                  <div
                    {...getRootProps({
                      className: 'border-dashed border rounded p-4 text-center cursor-pointer',
                    })}
                  >
                    <input {...getInputProps()} />
                    {isDragActive ? (
                      <p>Drop the file here...</p>
                    ) : (
                      <p>Drag & drop or click to select</p>
                    )}
                  </div>
                  {screenshotPreview && (
                    <img
                      src={screenshotPreview}
                      alt="preview"
                      className="max-h-32 mt-2 mx-auto"
                    />
                  )}
                </div>
                <div className="space-y-1">
                  <label htmlFor="notes" className="block text-sm font-medium">
                    Comments
                  </label>
                  <textarea
                    id="notes"
                    value={notes}
                    onChange={(e) => setNotes(e.target.value)}
                    className="w-full rounded border px-3 py-2"
                    rows={3}
                  />
                </div>
                {selectedLayout?.imageUrl || selectedTrack?.imageUrl ? (
                  <img
                    src={getImageUrl(
                      selectedLayout?.imageUrl || selectedTrack?.imageUrl || ''
                    )}
                    alt="track preview"
                    className="rounded w-full"
                  />
                ) : null}
                {selectedTrack?.description && (
                  <MarkdownRenderer
                    content={selectedTrack.description}
                    className="text-muted-foreground"
                  />
                )}
                {personalBestMs !== null && (
                  <div className="text-sm space-y-1">
                    <p>Personal Best: {formatTime(personalBestMs)}</p>
                    {rank && <p>Leaderboard Rank: #{rank}</p>}
                  </div>
                )}
              </div>
            </div>
            <div className="sticky bottom-0 bg-background p-4 border-t mt-4">
              <Button type="submit" className="w-full" disabled={submitting}>
                Submit
              </Button>
            </div>
          </form>
        </div>
      );
};

export default SubmitLapTimePage;
