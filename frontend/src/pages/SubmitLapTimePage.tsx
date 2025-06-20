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
  const [lapDate, setLapDate] = useState(() => new Date().toISOString().slice(0, 10));
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
        if (obj.lapDate) setLapDate(obj.lapDate);
      } catch {}
    }
  }, []);

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
    const obj = { gameId, trackId, trackLayoutId, carId, inputType, lapDate };
    localStorage.setItem('lapFormLast', JSON.stringify(obj));
  }, [gameId, trackId, trackLayoutId, carId, inputType, lapDate]);

  const toggleAssist = (id: string) => {
    setSelectedAssists((prev) =>
      prev.includes(id) ? prev.filter((a) => a !== id) : [...prev, id]
    );
  };

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
      {/* Add your redesigned form layout here */}
    </div>
  );
};

export default SubmitLapTimePage;