import React, { useEffect, useState } from 'react';
import { User as UserIcon } from 'lucide-react';
import { useAuth } from '../contexts/AuthContext';
import { uploadFile, updateProfile, getUserStats } from '../api';
import { Avatar, AvatarImage, AvatarFallback } from '../components/ui/avatar';
import { Button } from '../components/ui/button';
import { getInitials } from '../utils';
import { formatTime } from '../utils/time';
import { UserStats } from '../types';

const ProfilePage: React.FC = () => {
  const { user, refreshUser } = useAuth();
  const [stats, setStats] = useState<UserStats | null>(null);
  const [uploading, setUploading] = useState(false);

  useEffect(() => {
    getUserStats().then(setStats).catch(() => {});
  }, []);

  const handleAvatarChange = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;
    setUploading(true);
    try {
      const { url } = await uploadFile(file);
      await updateProfile({ avatarUrl: url });
      await refreshUser();
    } catch {
      // ignore errors for now
    } finally {
      setUploading(false);
    }
  };

  if (!user) return null;

  return (
    <div className="container py-6 space-y-6 max-w-md">
      <div className="flex items-center space-x-2 mb-4">
        <UserIcon className="h-6 w-6" />
        <h1 className="text-3xl font-bold">Profile</h1>
      </div>
      <div className="flex flex-col items-center space-y-3">
        <Avatar className="h-24 w-24">
          <AvatarImage src={user.avatarUrl || undefined} alt={user.username} />
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
    </div>
  );
};

export default ProfilePage;
