import React, { useEffect, useState } from 'react';
import { Search, Settings } from 'lucide-react';
import { Link } from 'react-router-dom';
import {
  searchInfo,
  searchImages,
  createGame,
  createTrack,
  createLayout,
  createCar,
  updateGame,
  updateTrack,
  updateLayout,
  updateCar,
  getGames,
  getTracks,
  getLayouts,
  getCars,
  uploadFile,
} from '../api';
import { slugify } from '../utils';
import { Button } from '../components/ui/button';

const InfoSearchPage: React.FC = () => {
  const [term, setTerm] = useState('');
  const [result, setResult] = useState<{ title: string; description: string; imageUrl: string | null } | null>(null);
  const [type, setType] = useState<'game' | 'track' | 'layout' | 'car'>('game');
  const [games, setGames] = useState<any[]>([]);
  const [tracks, setTracks] = useState<any[]>([]);
  const [layouts, setLayouts] = useState<any[]>([]);
  const [cars, setCars] = useState<any[]>([]);
  const [gameId, setGameId] = useState('');
  const [trackId, setTrackId] = useState('');
  const [message, setMessage] = useState('');
  const [images, setImages] = useState<string[]>([]);
  const [selectedImage, setSelectedImage] = useState<string | null>(null);
  const [addAsNew, setAddAsNew] = useState(true);
  const [existingId, setExistingId] = useState('');
  const [name, setName] = useState('');

  useEffect(() => {
    getGames().then(setGames).catch(() => {});
    getTracks().then(setTracks).catch(() => {});
    getLayouts().then(setLayouts).catch(() => {});
    getCars().then(setCars).catch(() => {});
  }, []);

  const handleSearch = async () => {
    if (!term.trim()) return;
    const info = await searchInfo(term.trim());
    setResult(info);
    setName(info.title);
    setMessage('');
    try {
      const imgRes = await searchImages(term.trim());
      setImages(imgRes.images);
      setSelectedImage(imgRes.images[0] || info.imageUrl || null);
    } catch {
      setImages([]);
      setSelectedImage(info.imageUrl || null);
    }
  };

  const handleSave = async () => {
    if (!result) return;
    let imageUrl: string | undefined = selectedImage || undefined;
    if (selectedImage) {
      try {
        const resp = await fetch(selectedImage);
        const blob = await resp.blob();
        const extMatch = /\.([a-z0-9]+)(?:$|\?)/i.exec(selectedImage);
        const ext = extMatch ? `.${extMatch[1]}` : '.jpg';
        const filename = `${slugify(name)}-${Date.now()}${ext}`;
        const file = new File([blob], filename, { type: blob.type || 'image/jpeg' });
        const folder =
          type === 'game'
            ? 'images/games'
            : type === 'track'
            ? 'images/tracks'
            : type === 'layout'
            ? 'images/layouts'
            : 'images/cars';
        const upload = await uploadFile(file, folder, filename);
        imageUrl = upload.url;
      } catch {
        // ignore and fall back to original URL
      }
    }
    if (type === 'game') {
      if (addAsNew) {
        await createGame({ name, imageUrl });
      } else if (existingId) {
        await updateGame(existingId, { name, imageUrl });
      }
    } else if (type === 'track') {
      if (!gameId) return;
      if (addAsNew) {
        await createTrack({ gameId, name, imageUrl, description: result.description });
      } else if (existingId) {
        await updateTrack(existingId, { gameId, name, imageUrl, description: result.description });
      }
    } else if (type === 'layout') {
      if (!trackId) return;
      if (addAsNew) {
        await createLayout({ trackId, name, imageUrl });
      } else if (existingId) {
        await updateLayout(existingId, { trackId, name, imageUrl });
      }
    } else if (type === 'car') {
      if (!gameId) return;
      if (addAsNew) {
        await createCar({ gameId, name, imageUrl, description: result.description });
      } else if (existingId) {
        await updateCar(existingId, { gameId, name, imageUrl, description: result.description });
      }
    }
    setMessage('Saved');
  };

  return (
    <div className="container mx-auto py-6 space-y-4">
      <div className="flex items-center space-x-2 mb-4">
        <Settings className="h-6 w-6" />
        <h1 className="text-3xl font-bold">Info Search</h1>
        <Link to="/admin" className="text-sm underline ml-2">Back to Admin</Link>
      </div>
      <div className="flex space-x-2">
        <input
          className="border p-1 flex-1"
          placeholder="Search Wikipedia"
          value={term}
          onChange={(e) => setTerm(e.target.value)}
        />
        <Button size="sm" onClick={handleSearch}>
          <Search className="h-4 w-4 mr-1" /> Search
        </Button>
      </div>
      {result && (
        <div className="border p-4 space-y-2">
          <h2 className="text-lg font-semibold">{result.title}</h2>
          {selectedImage && <img src={selectedImage} alt={name} className="h-32" />}
          {images.length > 0 && (
            <div className="flex space-x-2 overflow-x-auto py-1">
              {images.map((img) => (
                <img
                  key={img}
                  src={img}
                  alt="option"
                  onClick={() => setSelectedImage(img)}
                  className={`h-16 cursor-pointer border ${selectedImage === img ? 'border-blue-500' : 'border-transparent'}`}
                />
              ))}
            </div>
          )}
          <p className="text-sm whitespace-pre-line">{result.description}</p>
          <div className="flex flex-wrap items-end gap-2">
            <select value={type} onChange={(e) => setType(e.target.value as any)} className="border p-1">
              <option value="game">Game</option>
              <option value="track">Track</option>
              <option value="layout">Layout</option>
              <option value="car">Car</option>
            </select>
            {(type === 'track' || type === 'car') && (
              <select value={gameId} onChange={(e) => setGameId(e.target.value)} className="border p-1">
                <option value="">Game</option>
                {games.map((g) => (
                  <option key={g.id} value={g.id}>
                    {g.name}
                  </option>
                ))}
              </select>
            )}
            {type === 'layout' && (
              <select value={trackId} onChange={(e) => setTrackId(e.target.value)} className="border p-1">
                <option value="">Track</option>
                {tracks.map((t) => (
                  <option key={t.id} value={t.id}>
                    {t.name}
                  </option>
                ))}
              </select>
            )}
            <label className="flex items-center space-x-1 text-sm">
              <input type="checkbox" checked={addAsNew} onChange={(e) => setAddAsNew(e.target.checked)} />
              <span>Add as new</span>
            </label>
            {!addAsNew && (
              <select value={existingId} onChange={(e) => setExistingId(e.target.value)} className="border p-1">
                <option value="">Select Existing</option>
                {(type === 'game' ? games : type === 'track' ? tracks : type === 'layout' ? layouts : cars).map((i: any) => (
                  <option key={i.id} value={i.id}>
                    {i.name}
                  </option>
                ))}
              </select>
            )}
            <input value={name} onChange={(e) => setName(e.target.value)} className="border p-1" />
            <Button size="sm" onClick={handleSave}>Save</Button>
            {message && <span className="text-green-600 text-sm">{message}</span>}
          </div>
        </div>
      )}
    </div>
  );
};

export default InfoSearchPage;
