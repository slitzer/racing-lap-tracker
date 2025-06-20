import React, { useEffect, useState } from 'react';
import { User as UserIcon } from 'lucide-react';
import { useAuth } from '../contexts/AuthContext';
import { uploadFile, updateProfile, getUserStats, getAssists } from '../api';
import { Avatar, AvatarImage, AvatarFallback } from '../components/ui/avatar';
import { Button } from '../components/ui/button';
import { toast } from 'sonner';
import { getInitials, getImageUrl } from '../utils';
import { formatTime } from '../utils/time';
import { UserStats, Assist } from '../types';

const ProfilePage: React.FC = () => {
  const { user, refreshUser } = useAuth();
  const [stats, setStats] = useState<UserStats | null>(null);
  const [uploading, setUploading] = useState(false);
  const [assists, setAssists] = useState<Assist[]>([]);

  const [wheel, setWheel] = useState('');
  const [frame, setFrame] = useState('');
  const [brakes, setBrakes] = useState('');
  const [equipment, setEquipment] = useState('');
  const [favoriteSim, setFavoriteSim] = useState('');
  const [favoriteTrack, setFavoriteTrack] = useState('');
  const [favoriteCar, setFavoriteCar] = useState('');
  const [league, setLeague] = useState('');
  const [defaultAssists, setDefaultAssists] = useState<string[]>([]);

  useEffect(() => {
    getUserStats().then(setStats).catch(() => {});
    getAssists().then(setAssists).catch(() => {});
  }, []);

  useEffect(() => {
    if (!user) return;
    setWheel(user.wheel || '');
    setFrame(user.frame || '');
    setBrakes(user.brakes || '');
    setEquipment(user.equipment || '');
    setFavoriteSim(user.favoriteSim || '');
    setFavoriteTrack(user.favoriteTrack || '');
    setFavoriteCar(user.favoriteCar || '');
    setLeague(user.league || '');
    setDefaultAssists(user.defaultAssists || []);
  }, [user]);

  const handleAvatarChange = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;
    setUploading(true);
    try {
      const ext = file.name.substring(file.name.lastIndexOf('.'));
      const filename = `user_${user?.id ?? 'avatar'}${ext}`;
      const { url } = await uploadFile(file, 'images/avatars', filename);
      await updateProfile({ avatarUrl: url });
      await refreshUser();
    } catch (err) {
      // Show an error toast and log for debugging
      toast.error('Failed to upload avatar');
      console.error(err);
    } finally {
      setUploading(false);
    }
  };

  if (!user) return null;

  return (
    <div className="container mx-auto py-6 space-y-6 max-w-md">
      <div className="flex items-center space-x-2 mb-4">
        <UserIcon className="h-6 w-6" />
        <h1 className="text-3xl font-bold">Profile</h1>
      </div>
      <div className="flex flex-col items-center space-y-3">
        <Avatar className="h-24 w-24">
          <AvatarImage
            src={getImageUrl(user.avatarUrl) || undefined}
            alt={user.username}
          />
          <AvatarFallback className="text-2xl">
            {getInitials(user.username)}
          </AvatarFallback>
        </Avatar>
        <input
          type="file"
          accept="image/*"
          onChange={handleAvatarChange}
          disabled={uploading}
        />
        <div className="text-center">
          <p className="font-semibold text-lg">{user.username}</p>
          <p className="text-sm text-muted-foreground">{user.email}</p>
        </div>
      </div>
      {stats && (
        <div className="border rounded p-4 space-y-2 text-sm">
          <p>
            <span className="font-medium">Total Laps:</span> {stats.lapCount}
          </p>
          <p>
            <span className="font-medium">Best Lap:</span>{' '}
            {stats.bestLapMs !== null ? formatTime(stats.bestLapMs) : 'N/A'}
          </p>
          <p>
            <span className="font-medium">Average Lap:</span>{' '}
            {stats.avgLapMs !== null ? formatTime(stats.avgLapMs) : 'N/A'}
          </p>
        </div>
      )}
      <form
        onSubmit={async (e) => {
          e.preventDefault();
          try {
            await updateProfile({
              wheel,
              frame,
              brakes,
              equipment,
              favoriteSim,
              favoriteTrack,
              favoriteCar,
              league,
              defaultAssists,
            });
            toast.success('Profile updated');
            await refreshUser();
          } catch (err) {
            toast.error('Failed to update profile');
            console.error(err);
          }
        }}
        className="space-y-4"
      >
        <div className="space-y-1">
          <label className="block text-sm font-medium">Wheel</label>
          <input
            className="w-full rounded border px-3 py-2"
            value={wheel}
            onChange={(e) => setWheel(e.target.value)}
          />
        </div>
        <div className="space-y-1">
          <label className="block text-sm font-medium">Frame</label>
          <input
            className="w-full rounded border px-3 py-2"
            value={frame}
            onChange={(e) => setFrame(e.target.value)}
          />
        </div>
        <div className="space-y-1">
          <label className="block text-sm font-medium">Brakes</label>
          <input
            className="w-full rounded border px-3 py-2"
            value={brakes}
            onChange={(e) => setBrakes(e.target.value)}
          />
        </div>
        <div className="space-y-1">
          <label className="block text-sm font-medium">Other Equipment</label>
          <input
            className="w-full rounded border px-3 py-2"
            value={equipment}
            onChange={(e) => setEquipment(e.target.value)}
          />
        </div>
        <div className="space-y-1">
          <label className="block text-sm font-medium">Favorite Sim/Game</label>
          <input
            className="w-full rounded border px-3 py-2"
            value={favoriteSim}
            onChange={(e) => setFavoriteSim(e.target.value)}
          />
        </div>
        <div className="space-y-1">
          <label className="block text-sm font-medium">Favorite Track</label>
          <input
            className="w-full rounded border px-3 py-2"
            value={favoriteTrack}
            onChange={(e) => setFavoriteTrack(e.target.value)}
          />
        </div>
        <div className="space-y-1">
          <label className="block text-sm font-medium">Favorite Car</label>
          <input
            className="w-full rounded border px-3 py-2"
            value={favoriteCar}
            onChange={(e) => setFavoriteCar(e.target.value)}
          />
        </div>
        <div className="space-y-1">
          <label className="block text-sm font-medium">League</label>
          <input
            className="w-full rounded border px-3 py-2"
            value={league}
            onChange={(e) => setLeague(e.target.value)}
            placeholder="Optional"
          />
        </div>
        <div className="space-y-1">
          <label className="block text-sm font-medium">Default Assists</label>
          <div className="grid grid-cols-2 gap-2">
            {assists.map((a) => (
              <label key={a.id} className="flex items-center space-x-1">
                <input
                  type="checkbox"
                  checked={defaultAssists.includes(a.id)}
                  onChange={() =>
                    setDefaultAssists((prev) =>
                      prev.includes(a.id)
                        ? prev.filter((id) => id !== a.id)
                        : [...prev, a.id]
                    )
                  }
                  className="accent-primary"
                />
                <span>{a.name}</span>
              </label>
            ))}
          </div>
        </div>
        <Button type="submit" className="w-full">
          Save
        </Button>
      </form>
    </div>
  );
};

export default ProfilePage;
