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
} from '../api';
import { LapTime, Game, Track, Layout, Car } from '../types';
import { Button } from '../components/ui/button';

const AdminPage: React.FC = () => {
  const [lapTimes, setLapTimes] = useState<LapTime[]>([]);
  const [games, setGames] = useState<Game[]>([]);
  const [tracks, setTracks] = useState<Track[]>([]);
  const [layouts, setLayouts] = useState<Layout[]>([]);
  const [cars, setCars] = useState<Car[]>([]);

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
    if (selectedGame) {
      await updateGame(selectedGame, { name: gameName });
    } else {
      await createGame({ name: gameName });
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
      refreshGames();
    }
  };

  const handleSaveTrack = async () => {
    if (selectedTrack) {
      await updateTrack(selectedTrack, { gameId: trackGameId, name: trackName });
    } else {
      await createTrack({ gameId: trackGameId, name: trackName });
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
      refreshTracks();
    }
  };

  const handleSaveLayout = async () => {
    if (selectedLayout) {
      await updateLayout(selectedLayout, { trackId: layoutTrackId, name: layoutName });
    } else {
      await createLayout({ trackId: layoutTrackId, name: layoutName });
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
      refreshLayouts();
    }
  };

  const handleSaveCar = async () => {
    if (selectedCar) {
      await updateCar(selectedCar, { gameId: carGameId, name: carName });
    } else {
      await createCar({ gameId: carGameId, name: carName });
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
    <div className="container py-6 space-y-8">
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
              <th className="p-2">Time (ms)</th>
              <th className="p-2">Actions</th>
            </tr>
          </thead>
          <tbody>
            {lapTimes.map((lt) => (
              <tr key={lt.id} className="border-b">
                <td className="p-2">{lt.id}</td>
                <td className="p-2">{lt.timeMs}</td>
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
                <td colSpan={3} className="p-2 text-center text-muted-foreground">
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
