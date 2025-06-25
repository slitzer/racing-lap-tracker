import apiClient from './client';
import { User, UserStats } from '../types';

export async function updateProfile(
  data: {
    username?: string;
    avatarUrl?: string;
    wheel?: string;
    frame?: string;
    brakes?: string;
    equipment?: string;
    favoriteSim?: string;
    favoriteTrack?: string;
    favoriteCar?: string;
    defaultAssists?: string[];
    league?: string;
  }
): Promise<User> {
  const res = await apiClient.put('/users/me', data);
  const {
    is_admin,
    avatar_url,
    default_assists,
    favorite_sim,
    favorite_track,
    favorite_car,
    wheel,
    frame,
    brakes,
    equipment,
    league,
    ...rest
  } = res.data;
  return {
    ...rest,
    isAdmin: is_admin,
    avatarUrl: avatar_url,
    defaultAssists: default_assists || [],
    favoriteSim: favorite_sim || '',
    favoriteTrack: favorite_track || '',
    favoriteCar: favorite_car || '',
    wheel: wheel || '',
    frame: frame || '',
    brakes: brakes || '',
    equipment: equipment || '',
    league: league || '',
  } as User;
}

export async function getUserStats(): Promise<UserStats> {
  const res = await apiClient.get('/users/me/stats');
  return res.data;
}

export async function followUser(userId: string): Promise<void> {
  await apiClient.post(`/users/${userId}/follow`);
}

export async function unfollowUser(userId: string): Promise<void> {
  await apiClient.delete(`/users/${userId}/follow`);
}

export async function isFollowing(userId: string): Promise<boolean> {
  const res = await apiClient.get(`/users/${userId}/follow`);
  return res.data.isFollowing;
}

export async function getUsers(): Promise<Pick<User, 'id' | 'username'>[]> {
  const res = await apiClient.get('/users');
  return res.data;
}
