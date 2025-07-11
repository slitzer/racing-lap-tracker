import React, { useEffect, useState } from 'react';
import { Settings } from 'lucide-react';
import { Link } from 'react-router-dom';
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
  exportDatabase,
  importDatabase,
  clearLapTimes,
  clearGameData,
  scanGamePack,
  uploadGamePack,
  getVersion,
  getAdminUsers,
  createUser,
  updateUser,
  deleteUser,
} from '../api';
import { LapTime, Game, Track, Layout, Car, User } from '../types';
import { Button } from '../components/ui/button';
import { formatTime } from '../utils/time';
import { slugify, getImageUrl, cn } from '../utils';
import EditableTable, { Column } from '../components/admin/EditableTable';
import ProgressBar from '../components/admin/ProgressBar';
import CollapsibleSection from '../components/admin/CollapsibleSection';
import { toast } from 'sonner';

const AdminPage: React.FC = () => {
  const [lapTimes, setLapTimes] = useState<LapTime[]>([]);
  const [games, setGames] = useState<Game[]>([]);
  const [tracks, setTracks] = useState<Track[]>([]);
  const [layouts, setLayouts] = useState<Layout[]>([]);
  const [cars, setCars] = useState<Car[]>([]);
  const [users, setUsers] = useState<User[]>([]);
  const [appVersion, setAppVersion] = useState('');
  const [dbVersion, setDbVersion] = useState('');

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
  const [newUsername, setNewUsername] = useState('');
  const [newEmail, setNewEmail] = useState('');
  const [newPassword, setNewPassword] = useState('');
  const [newIsAdmin, setNewIsAdmin] = useState(false);
  const [importFile, setImportFile] = useState<File | null>(null);
  const [importProgress, setImportProgress] = useState(0);
  const [packFile, setPackFile] = useState<File | null>(null);
  const [clearGameId, setClearGameId] = useState('');
  const [logs, setLogs] = useState<string[]>([]);
  const [activeSection, setActiveSection] = useState('dbEditor');
  const navClass = (key: string) =>
    cn(
      'block w-full text-left px-2 py-1 rounded transition-colors',
      activeSection === key ? 'bg-muted font-semibold' : 'hover:bg-muted'
    );

  const gameColumns: Column<Game>[] = [
    { key: 'id', label: 'ID' },
    { key: 'name', label: 'Name', editable: true },
    { key: 'imageUrl', label: 'Image URL', editable: true },
  ];
  const trackColumns: Column<Track>[] = [
    { key: 'id', label: 'ID' },
    { key: 'gameId', label: 'Game ID', editable: true },
    { key: 'name', label: 'Name', editable: true },
    { key: 'imageUrl', label: 'Image URL', editable: true },
  ];
  const layoutColumns: Column<Layout>[] = [
    { key: 'id', label: 'ID' },
    { key: 'trackId', label: 'Track ID', editable: true },
    { key: 'name', label: 'Name', editable: true },
    { key: 'imageUrl', label: 'Image URL', editable: true },
  ];
  const carColumns: Column<Car>[] = [
    { key: 'id', label: 'ID' },
    { key: 'gameId', label: 'Game ID', editable: true },
    { key: 'name', label: 'Name', editable: true },
    { key: 'imageUrl', label: 'Image URL', editable: true },
  ];
  const userColumns: Column<User>[] = [
    { key: 'id', label: 'ID' },
    { key: 'username', label: 'Username', editable: true },
    { key: 'email', label: 'Email', editable: true },
    { key: 'isAdmin', label: 'Admin', editable: true },
  ];

  useEffect(() => {
    getUnverifiedLapTimes().then(setLapTimes).catch(() => {});
    getGames().then(setGames).catch(() => {});
    getTracks().then(setTracks).catch(() => {});
    getLayouts().then(setLayouts).catch(() => {});
    getCars().then(setCars).catch(() => {});
    getAdminUsers().then(setUsers).catch(() => {});
    getVersion()
      .then((v) => {
        setAppVersion(v.appVersion);
        setDbVersion(v.dbVersion);
      })
      .catch(() => {});
  }, []);

  const refreshGames = () => getGames().then(setGames).catch(() => {});
  const refreshTracks = () => getTracks().then(setTracks).catch(() => {});
  const refreshLayouts = () => getLayouts().then(setLayouts).catch(() => {});
  const refreshCars = () => getCars().then(setCars).catch(() => {});
  const refreshUsers = () => getAdminUsers().then(setUsers).catch(() => {});

  const updateGameRow = async (id: string, data: Partial<Game>) => {
    const existing = games.find((g) => g.id === id);
    if (!existing) return;
    await updateGame(id, { ...existing, ...data });
    refreshGames();
  };
  const updateTrackRow = async (id: string, data: Partial<Track>) => {
    const existing = tracks.find((t) => t.id === id);
    if (!existing) return;
    await updateTrack(id, { ...existing, ...data });
    refreshTracks();
  };
  const updateLayoutRow = async (id: string, data: Partial<Layout>) => {
    const existing = layouts.find((l) => l.id === id);
    if (!existing) return;
    await updateLayout(id, { ...existing, ...data });
    refreshLayouts();
  };
  const updateCarRow = async (id: string, data: Partial<Car>) => {
    const existing = cars.find((c) => c.id === id);
    if (!existing) return;
    await updateCar(id, { ...existing, ...data });
    refreshCars();
  };
  const updateUserRow = async (id: string, data: Partial<User>) => {
    const existing = users.find((u) => u.id === id);
    if (!existing) return;
    await updateUser(id, { ...existing, ...data });
    refreshUsers();
  };

  const handleSaveGame = async () => {
    let imageUrl: string | undefined;
    if (gameImage) {
      const ext = gameImage.name.substring(gameImage.name.lastIndexOf('.'));
      const filename = `${slugify(gameName)}-${Date.now()}${ext}`;
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
      const filename = `${slugify(trackName)}-${Date.now()}${ext}`;
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
      const filename = `${slugify(layoutName)}-${Date.now()}${ext}`;
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
      const filename = `${slugify(carName)}-${Date.now()}${ext}`;
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

  const handleCreateUser = async () => {
    await createUser({
      username: newUsername,
      email: newEmail,
      password: newPassword,
      isAdmin: newIsAdmin,
    });
    setNewUsername('');
    setNewEmail('');
    setNewPassword('');
    setNewIsAdmin(false);
    refreshUsers();
  };

  const handleDeleteUser = async (id: string) => {
    const keep = window.confirm('Keep lap times for this user?');
    await deleteUser(id, keep);
    refreshUsers();
  };

  const verify = async (id: string) => {
    await verifyLapTime(id);
    setLapTimes((lt) => lt.filter((l) => l.id !== id));
  };

  const remove = async (id: string) => {
    await deleteLapTime(id);
    setLapTimes((lt) => lt.filter((l) => l.id !== id));
  };

  const handleExportDb = async () => {
    const data = await exportDatabase();
    const blob = new Blob([JSON.stringify(data, null, 2)], { type: 'application/json' });
    const url = URL.createObjectURL(blob);
    const link = document.createElement('a');
    link.href = url;
    link.download = `backup-${Date.now()}.json`;
    link.click();
    URL.revokeObjectURL(url);
  };

  const handleImportDb = async () => {
    if (!importFile) return;
    const text = await importFile.text();
    const json = JSON.parse(text);
    setLogs((l) => [...l, `Importing ${importFile.name}...`]);
    await importDatabase(json, setImportProgress)
      .then(() => setLogs((l) => [...l, 'Import completed']))
      .catch(() => setLogs((l) => [...l, 'Import failed']));
    setImportFile(null);
    setImportProgress(0);
  };

  const handleClearLapTimes = async () => {
    if (window.confirm('Delete ALL lap times? This cannot be undone.')) {
      await clearLapTimes();
      refreshGames();
      refreshTracks();
      refreshLayouts();
      refreshCars();
    }
  };

  const handleClearGame = async () => {
    if (!clearGameId) return;
    if (window.confirm('Remove data for this game? This cannot be undone.')) {
      await clearGameData(clearGameId);
      setClearGameId('');
      refreshGames();
      refreshTracks();
      refreshLayouts();
      refreshCars();
    }
  };

  const handleScanGamePack = async () => {
    toast.info('Scanning GamePack...');
    try {
      const res = await scanGamePack();
      toast.success(
        `Scan completed: ${res.summary.games} games, ${res.summary.tracks} tracks, ${res.summary.layouts} layouts, ${res.summary.cars} cars`
      );
      refreshGames();
      refreshTracks();
      refreshLayouts();
      refreshCars();
    } catch (err) {
      toast.error('Scan failed');
    }
  };

  const handleUploadGamePack = async () => {
    if (!packFile) return;
    toast.info('Uploading GamePack...');
    try {
      const res = await uploadGamePack(packFile);
      toast.success(
        `Upload completed: ${res.summary.games} games, ${res.summary.tracks} tracks, ${res.summary.layouts} layouts, ${res.summary.cars} cars`
      );
      setPackFile(null);
      refreshGames();
      refreshTracks();
      refreshLayouts();
      refreshCars();
    } catch (err) {
      toast.error('Upload failed');
    }
  };

  return (
    <div className="container mx-auto py-6 flex">
      <aside className="w-56 pr-4 border-r space-y-6">
        <div>
          <h3 className="mb-2 text-sm font-semibold uppercase">General</h3>
          <nav className="space-y-1">
            <button
              type="button"
              onClick={() => setActiveSection('appearance')}
              className={navClass('appearance')}
            >
              Appearance
            </button>
          </nav>
        </div>
        <div>
          <h3 className="mb-2 text-sm font-semibold uppercase flex items-center gap-1">
            <span role="img" aria-label="database">🔧</span> Database Management
          </h3>
          <nav className="space-y-1">
            <button type="button" onClick={() => setActiveSection('dbEditor')} className={navClass('dbEditor')}>
              Database Editor
            </button>
            <button type="button" onClick={() => setActiveSection('legacyEditor')} className={navClass('legacyEditor')}>
              Legacy Editor
            </button>
            <button type="button" onClick={() => setActiveSection('dbTools')} className={navClass('dbTools')}>
              Database Tools
            </button>
          </nav>
        </div>
        <div>
          <h3 className="mb-2 text-sm font-semibold uppercase flex items-center gap-1">
            <span role="img" aria-label="user">👤</span> User Management
          </h3>
          <nav className="space-y-1">
            <button type="button" onClick={() => setActiveSection('userTools')} className={navClass('userTools')}>
              User Tools
            </button>
          </nav>
        </div>
        <div>
          <h3 className="mb-2 text-sm font-semibold uppercase flex items-center gap-1">
            <span role="img" aria-label="media">🖼️</span> Media Manager
          </h3>
          <nav className="space-y-1">
            <button type="button" onClick={() => setActiveSection('uploadScreenshots')} className={navClass('uploadScreenshots')}>
              Upload Screenshots
            </button>
            <button type="button" onClick={() => setActiveSection('mediaReview')} className={navClass('mediaReview')}>
              Media Review
            </button>
          </nav>
        </div>
      </aside>
      <main className="flex-1 pl-4 space-y-8">
        <div className="flex items-center space-x-2 mb-4">
          <Settings className="h-6 w-6" />
          <h1 className="text-3xl font-bold">Admin</h1>
          <Link to="/admin/search" className="underline text-sm ml-2">
            Info Search
          </Link>
        </div>

        {activeSection === 'appearance' && (
          <div>Appearance settings coming soon.</div>
        )}

        {activeSection === 'dbTools' && (
          <section>
            <h2 className="text-xl font-semibold mb-2">Database Tools</h2>
            <div className="flex items-center space-x-2 mb-4">
              <Button size="sm" onClick={handleExportDb}>Export</Button>
              <input
                type="file"
                accept="application/json"
                onChange={(e) => {
                  setImportFile(e.target.files?.[0] || null);
                  setImportProgress(0);
                  setLogs([]);
                }}
              />
              <Button size="sm" onClick={handleImportDb} disabled={!importFile}>
                Import
              </Button>
              <input
                type="file"
                accept=".zip"
                onChange={(e) => setPackFile(e.target.files?.[0] || null)}
              />
              <Button size="sm" onClick={handleUploadGamePack} disabled={!packFile}>
                Upload GamePack
              </Button>
              <Button size="sm" onClick={handleScanGamePack}>Scan GamePack</Button>
            </div>
            {importProgress > 0 && <ProgressBar progress={importProgress} />}
            {logs.length > 0 && (
              <div className="border p-2 bg-gray-50 text-xs h-24 overflow-auto space-y-1">
                {logs.map((l, i) => (
                  <div key={i}>{l}</div>
                ))}
              </div>
            )}
            <div className="mt-4 space-y-2">
              <Button size="sm" variant="destructive" onClick={handleClearLapTimes}>
                Clear All Lap Times
              </Button>
              <div className="flex items-center space-x-2">
                <select
                  className="border p-1"
                  value={clearGameId}
                  onChange={(e) => setClearGameId(e.target.value)}
                >
                  <option value="">Select Game</option>
                  {games.map((g) => (
                    <option key={g.id} value={g.id}>
                      {g.name}
                    </option>
                  ))}
                </select>
                <Button
                  size="sm"
                  variant="destructive"
                  onClick={handleClearGame}
                  disabled={!clearGameId}
                >
                  Clear Game Data
                </Button>
              </div>
            </div>
          </section>
        )}

        {activeSection === 'userTools' && (
          <section className="space-y-4">
            <h2 className="text-xl font-semibold mb-2">User Management</h2>
            <div className="flex flex-wrap items-end gap-2">
              <input
                className="border p-1"
                placeholder="Username"
                value={newUsername}
                onChange={(e) => setNewUsername(e.target.value)}
              />
              <input
                className="border p-1"
                placeholder="Email"
                value={newEmail}
                onChange={(e) => setNewEmail(e.target.value)}
              />
              <input
                className="border p-1"
                type="password"
                placeholder="Password"
                value={newPassword}
                onChange={(e) => setNewPassword(e.target.value)}
              />
              <label className="flex items-center gap-1 text-sm">
                <input
                  type="checkbox"
                  checked={newIsAdmin}
                  onChange={(e) => setNewIsAdmin(e.target.checked)}
                />
                Admin
              </label>
              <Button size="sm" onClick={handleCreateUser}>Create</Button>
            </div>
            <EditableTable
              data={users}
              columns={userColumns}
              onUpdate={updateUserRow}
              onDelete={handleDeleteUser}
            />
          </section>
        )}

        {activeSection === 'dbEditor' && (
          <>
            <CollapsibleSection title="Unverified Lap Times" defaultOpen={false}>
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
                        <Link to={`/track/${lt.trackId}`} className="underline">
                          {lt.trackName}
                        </Link>
                        {lt.layoutName ? ` - ${lt.layoutName}` : ''}
                      </td>
                      <td className="p-2">{lt.carName}</td>
                      <td className="p-2">{formatTime(lt.timeMs)}</td>
                      <td className="p-2">
                        {lt.screenshotUrl && (
                          <img src={getImageUrl(lt.screenshotUrl)} className="h-12" />
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
            </CollapsibleSection>

            <CollapsibleSection title="Database Editor" defaultOpen={false}>
              <div>
                <h3 className="font-semibold mb-2">Games</h3>
                <EditableTable data={games} columns={gameColumns} onUpdate={updateGameRow} />
              </div>
              <div>
                <h3 className="font-semibold mb-2">Tracks</h3>
                <EditableTable data={tracks} columns={trackColumns} onUpdate={updateTrackRow} />
              </div>
              <div>
                <h3 className="font-semibold mb-2">Layouts</h3>
                <EditableTable data={layouts} columns={layoutColumns} onUpdate={updateLayoutRow} />
              </div>
              <div>
                <h3 className="font-semibold mb-2">Cars</h3>
                <EditableTable data={cars} columns={carColumns} onUpdate={updateCarRow} />
              </div>
            </CollapsibleSection>
          </>
        )}

        {activeSection === 'legacyEditor' && (
          <section className="space-y-6">
            <h2 className="text-xl font-semibold mb-2">Legacy Editor</h2>
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
                  <img src={getImageUrl(gamePreview)} alt="preview" className="h-10" />
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
                  <img src={getImageUrl(trackPreview)} alt="preview" className="h-10" />
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
                  <img src={getImageUrl(layoutPreview)} alt="preview" className="h-10" />
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
                  <img src={getImageUrl(carPreview)} alt="preview" className="h-10" />
                )}
                <Button size="sm" onClick={handleSaveCar}>Save</Button>
                <Button size="sm" variant="ghost" onClick={handleDeleteCar}>
                  Delete
                </Button>
              </div>
            </div>
          </section>
        )}

        {activeSection === 'uploadScreenshots' && <div>Upload screenshots coming soon.</div>}
        {activeSection === 'mediaReview' && <div>Media review coming soon.</div>}

        <section className="mt-6 text-sm text-gray-500">
          <p>App version: {appVersion}</p>
          <p>Database version: {dbVersion}</p>
        </section>
      </main>
    </div>
  );
};

export default AdminPage;
