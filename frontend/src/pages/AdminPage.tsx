import React, { useEffect, useState } from 'react';
import { Settings } from 'lucide-react';
import {
  getUnverifiedLapTimes,
  verifyLapTime,
  deleteLapTime,
  getGames,
  getTracks,
  getLayouts,
  getCars,
  createGame,
  updateGame,
  deleteGame,
  createTrack,
  updateTrack,
  deleteTrack,
  createLayout,
  updateLayout,
  deleteLayout,
  createCar,
  updateCar,
  deleteCar,
  uploadFile,
} from '../api';
import { LapTime, Game, Track, Layout, Car } from '../types';
import { Button } from '../components/ui/button';
import { formatTime } from '../utils/time';
import { slugify } from '../utils';

const AdminPage: React.FC = () => {
  const [lapTimes, setLapTimes] = useState<LapTime[]>([]);
  const [games, setGames] = useState<Game[]>([]);
  const [tracks, setTracks] = useState<Track[]>([]);
  const [layouts, setLayouts] = useState<Layout[]>([]);
  const [cars, setCars] = useState<Car[]>([]);

  const [gameImage, setGameImage] = useState<File | null>(null);
  const [trackImage, setTrackImage] = useState<File | null>(null);
  const [layoutImage, setLayoutImage] = useState<File | null>(null);
  const [carImage, setCarImage] = useState<File | null>(null);
  const [gamePreview, setGamePreview] = useState<string | null>(null);
  const [trackPreview, setTrackPreview] = useState<string | null>(null);
  const [layoutPreview, setLayoutPreview] = useState<string | null>(null);
  const [carPreview, setCarPreview] = useState<string | null>(null);

  const [gameName, setGameName] = useState('');
  const [selectedGame, setSelectedGame] = useState('');

  const [trackName, setTrackName] = useState('');
  const [trackGameId, setTrackGameId] = useState('');
  const [selectedTrack, setSelectedTrack] = useState('');

  const [layoutName, setLayoutName] = useState('');
  const [layoutTrackId, setLayoutTrackId] = useState('');
  const [selectedLayout, setSelectedLayout] = useState('');

  const [carName, setCarName] = useState('');
  const [carGameId, setCarGameId] = useState('');
  const [selectedCar, setSelectedCar] = useState('');

  useEffect(() => {
    getUnverifiedLapTimes().then(setLapTimes).catch(() => {});
    getGames().then(setGames).catch(() => {});
    getTracks().then(setTracks).catch(() => {});
    getLayouts().then(setLayouts).catch(() => {});
    getCars().then(setCars).catch(() => {});
  }, []);

  const refreshGames = () => getGames().then(setGames).catch(() => {});
  const refreshTracks = () => getTracks().then(setTracks).catch(() => {});
  const refreshLayouts = () => getLayouts().then(setLayouts).catch(() => {});
  const refreshCars = () => getCars().then(setCars).catch(() => {});

  const handleSaveGame = async () => {
    let imageUrl: string | undefined;
    if (gameImage) {
      const ext = gameImage.name.substring(gameImage.name.lastIndexOf('.'));
      const filename = `${slugify(gameName)}${ext}`;
      const { url } = await uploadFile(gameImage, 'images/games', filename);
      imageUrl = url;
      setGameImage(null);
      setGamePreview(null);
    }
    if (selectedGame) {
      await updateGame(selectedGame, { name: gameName, imageUrl });
    } else {
      await createGame({ name: gameName, imageUrl });
    }
    setGameName('');
    setSelectedGame('');
    refreshGames();
  };

  const handleDeleteGame = async () => {
    if (selectedGame) {
      await deleteGame(selectedGame);
      setSelectedGame('');
      setGameName('');
      setGamePreview(null);
      refreshGames();
    }
  };

  const handleSaveTrack = async () => {
    let imageUrl: string | undefined;
    if (trackImage) {
      const ext = trackImage.name.substring(trackImage.name.lastIndexOf('.'));
      const filename = `${slugify(trackName)}${ext}`;
      const { url } = await uploadFile(trackImage, 'images/tracks', filename);
      imageUrl = url;
      setTrackImage(null);
      setTrackPreview(null);
    }
    if (selectedTrack) {
      await updateTrack(selectedTrack, { gameId: trackGameId, name: trackName, imageUrl });
    } else {
      await createTrack({ gameId: trackGameId, name: trackName, imageUrl });
    }
    setTrackName('');
    setSelectedTrack('');
    refreshTracks();
  };

  const handleDeleteTrack = async () => {
    if (selectedTrack) {
      await deleteTrack(selectedTrack);
      setSelectedTrack('');
      setTrackName('');
      setTrackPreview(null);
      refreshTracks();
    }
  };

  const handleSaveLayout = async () => {
    let imageUrl: string | undefined;
    if (layoutImage) {
      const ext = layoutImage.name.substring(layoutImage.name.lastIndexOf('.'));
      const filename = `${slugify(layoutName)}${ext}`;
      const { url } = await uploadFile(layoutImage, 'images/layouts', filename);
      imageUrl = url;
      setLayoutImage(null);
      setLayoutPreview(null);
    }
    if (selectedLayout) {
      await updateLayout(selectedLayout, { trackId: layoutTrackId, name: layoutName, imageUrl });
    } else {
      await createLayout({ trackId: layoutTrackId, name: layoutName, imageUrl });
    }
    setLayoutName('');
    setSelectedLayout('');
    refreshLayouts();
  };

  const handleDeleteLayout = async () => {
    if (selectedLayout) {
      await deleteLayout(selectedLayout);
      setSelectedLayout('');
      setLayoutName('');
      setLayoutPreview(null);
      refreshLayouts();
    }
  };

  const handleSaveCar = async () => {
    let imageUrl: string | undefined;
    if (carImage) {
      const ext = carImage.name.substring(carImage.name.lastIndexOf('.'));
      const filename = `${slugify(carName)}${ext}`;
      const { url } = await uploadFile(carImage, 'images/cars', filename);
      imageUrl = url;
      setCarImage(null);
      setCarPreview(null);
    }
    if (selectedCar) {
      await updateCar(selectedCar, { gameId: carGameId, name: carName, imageUrl });
    } else {
      await createCar({ gameId: carGameId, name: carName, imageUrl });
    }
    setCarName('');
    setSelectedCar('');
    refreshCars();
  };

  const handleDeleteCar = async () => {
    if (selectedCar) {
      await deleteCar(selectedCar);
      setSelectedCar('');
      setCarName('');
      setCarPreview(null);
      refreshCars();
    }
  };

  const verify = async (id: string) => {
    await verifyLapTime(id);
    setLapTimes((lt) => lt.filter((l) => l.id !== id));
  };

  const remove = async (id: string) => {
    await deleteLapTime(id);
    setLapTimes((lt) => lt.filter((l) => l.id !== id));
  };

  return (
    <div className="container mx-auto py-6 space-y-8">
      <div className="flex items-center space-x-2 mb-4">
        <Settings className="h-6 w-6" />
        <h1 className="text-3xl font-bold">Admin</h1>
      </div>

      <section>
        <h2 className="text-xl font-semibold mb-2">Unverified Lap Times</h2>
        <table className="w-full text-sm text-left border">
          <thead>
            <tr className="border-b">
              <th className="p-2">ID</th>
              <th className="p-2">Driver</th>
              <th className="p-2">Game</th>
              <th className="p-2">Track</th>
              <th className="p-2">Car</th>
              <th className="p-2">Time</th>
              <th className="p-2">Screenshot</th>
              <th className="p-2">Actions</th>
            </tr>
          </thead>
          <tbody>
            {lapTimes.map((lt) => (
              <tr key={lt.id} className="border-b">
                <td className="p-2">{lt.id}</td>
                <td className="p-2">{lt.username}</td>
                <td className="p-2">{lt.gameName}</td>
                <td className="p-2">
                  {lt.trackName}
                  {lt.layoutName ? ` - ${lt.layoutName}` : ''}
                </td>
                <td className="p-2">{lt.carName}</td>
                <td className="p-2">{formatTime(lt.timeMs)}</td>
                <td className="p-2">
                  {lt.screenshotUrl && (
                    <img src={lt.screenshotUrl} className="h-12" />
                  )}
                </td>
                <td className="p-2 space-x-2">
                  <Button size="sm" onClick={() => verify(lt.id)}>Verify</Button>
                  <Button size="sm" variant="ghost" onClick={() => remove(lt.id)}>
                    Delete
                  </Button>
                </td>
              </tr>
            ))}
            {lapTimes.length === 0 && (
              <tr>
                <td colSpan={8} className="p-2 text-center text-muted-foreground">
                  No unverified lap times
                </td>
              </tr>
            )}
          </tbody>
        </table>
      </section>

      <section className="space-y-6">
        <div>
          <h3 className="font-semibold mb-2">Games</h3>
          <div className="flex space-x-2 mb-2">
            <select
              value={selectedGame}
              onChange={(e) => {
                const id = e.target.value;
                setSelectedGame(id);
                const game = games.find((g) => g.id === id);
                setGameName(game ? game.name : '');
                setGamePreview(game ? game.imageUrl || null : null);
              }}
              className="border p-1"
            >
              <option value="">New</option>
              {games.map((g) => (
                <option key={g.id} value={g.id}>
                  {g.name}
                </option>
              ))}
            </select>
            <input
              className="border p-1 flex-1"
              value={gameName}
              onChange={(e) => setGameName(e.target.value)}
              placeholder="Name"
            />
            <input
              type="file"
              accept="image/*"
              onChange={(e) => {
                const file = e.target.files?.[0] || null;
                setGameImage(file);
                setGamePreview(file ? URL.createObjectURL(file) : null);
              }}
            />
            {gamePreview && (
              <img src={gamePreview} alt="preview" className="h-10" />
            )}
            <Button size="sm" onClick={handleSaveGame}>Save</Button>
            <Button size="sm" variant="ghost" onClick={handleDeleteGame}>
              Delete
            </Button>
          </div>
        </div>

        <div>
          <h3 className="font-semibold mb-2">Tracks</h3>
          <div className="flex space-x-2 mb-2">
            <select
              value={selectedTrack}
              onChange={(e) => {
                const id = e.target.value;
                setSelectedTrack(id);
                const track = tracks.find((t) => t.id === id);
                setTrackName(track ? track.name : '');
                setTrackGameId(track ? track.gameId : '');
                setTrackPreview(track ? track.imageUrl || null : null);
              }}
              className="border p-1"
            >
              <option value="">New</option>
              {tracks.map((t) => (
                <option key={t.id} value={t.id}>
                  {t.name}
                </option>
              ))}
            </select>
            <select
              value={trackGameId}
              onChange={(e) => setTrackGameId(e.target.value)}
              className="border p-1"
            >
              <option value="">Game</option>
              {games.map((g) => (
                <option key={g.id} value={g.id}>
                  {g.name}
                </option>
              ))}
            </select>
            <input
              className="border p-1 flex-1"
              value={trackName}
              onChange={(e) => setTrackName(e.target.value)}
              placeholder="Name"
            />
            <input
              type="file"
              accept="image/*"
              onChange={(e) => {
                const file = e.target.files?.[0] || null;
                setTrackImage(file);
                setTrackPreview(file ? URL.createObjectURL(file) : null);
              }}
            />
            {trackPreview && (
              <img src={trackPreview} alt="preview" className="h-10" />
            )}
            <Button size="sm" onClick={handleSaveTrack}>Save</Button>
            <Button size="sm" variant="ghost" onClick={handleDeleteTrack}>
              Delete
            </Button>
          </div>
        </div>

        <div>
          <h3 className="font-semibold mb-2">Layouts</h3>
          <div className="flex space-x-2 mb-2">
            <select
              value={selectedLayout}
              onChange={(e) => {
                const id = e.target.value;
                setSelectedLayout(id);
                const layout = layouts.find((l) => l.id === id);
                setLayoutName(layout ? layout.name : '');
                setLayoutTrackId(layout ? layout.trackId : '');
                setLayoutPreview(layout ? layout.imageUrl || null : null);
              }}
              className="border p-1"
            >
              <option value="">New</option>
              {layouts.map((l) => (
                <option key={l.id} value={l.id}>
                  {l.name}
                </option>
              ))}
            </select>
            <select
              value={layoutTrackId}
              onChange={(e) => setLayoutTrackId(e.target.value)}
              className="border p-1"
            >
              <option value="">Track</option>
              {tracks.map((t) => (
                <option key={t.id} value={t.id}>
                  {t.name}
                </option>
              ))}
            </select>
            <input
              className="border p-1 flex-1"
              value={layoutName}
              onChange={(e) => setLayoutName(e.target.value)}
              placeholder="Name"
            />
            <input
              type="file"
              accept="image/*"
              onChange={(e) => {
                const file = e.target.files?.[0] || null;
                setLayoutImage(file);
                setLayoutPreview(file ? URL.createObjectURL(file) : null);
              }}
            />
            {layoutPreview && (
              <img src={layoutPreview} alt="preview" className="h-10" />
            )}
            <Button size="sm" onClick={handleSaveLayout}>Save</Button>
            <Button size="sm" variant="ghost" onClick={handleDeleteLayout}>
              Delete
            </Button>
          </div>
        </div>

        <div>
          <h3 className="font-semibold mb-2">Cars</h3>
          <div className="flex space-x-2 mb-2">
            <select
              value={selectedCar}
              onChange={(e) => {
                const id = e.target.value;
                setSelectedCar(id);
                const car = cars.find((c) => c.id === id);
                setCarName(car ? car.name : '');
                setCarGameId(car ? car.gameId : '');
                setCarPreview(car ? car.imageUrl || null : null);
              }}
              className="border p-1"
            >
              <option value="">New</option>
              {cars.map((c) => (
                <option key={c.id} value={c.id}>
                  {c.name}
                </option>
              ))}
            </select>
            <select
              value={carGameId}
              onChange={(e) => setCarGameId(e.target.value)}
              className="border p-1"
            >
              <option value="">Game</option>
              {games.map((g) => (
                <option key={g.id} value={g.id}>
                  {g.name}
                </option>
              ))}
            </select>
            <input
              className="border p-1 flex-1"
              value={carName}
              onChange={(e) => setCarName(e.target.value)}
              placeholder="Name"
            />
            <input
              type="file"
              accept="image/*"
              onChange={(e) => {
                const file = e.target.files?.[0] || null;
                setCarImage(file);
                setCarPreview(file ? URL.createObjectURL(file) : null);
              }}
            />
            {carPreview && (
              <img src={carPreview} alt="preview" className="h-10" />
            )}
            <Button size="sm" onClick={handleSaveCar}>Save</Button>
            <Button size="sm" variant="ghost" onClick={handleDeleteCar}>
              Delete
            </Button>
          </div>
        </div>
      </section>
    </div>
  );
};

export default AdminPage;
