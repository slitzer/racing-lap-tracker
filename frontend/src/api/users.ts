import apiClient from './client';
import { User, UserStats } from '../types';

export async function updateProfile(data: { username?: string; avatarUrl?: string }): Promise<User> {
  const res = await apiClient.put('/users/me', data);
  const { is_admin, avatar_url, ...rest } = res.data;
  return { ...rest, isAdmin: is_admin, avatarUrl: avatar_url };
}

export async function getUserStats(): Promise<UserStats> {
  const res = await apiClient.get('/users/me/stats');
  return res.data;
}
