import apiClient from './client';
import { User } from '../types';

export async function login(email: string, password: string): Promise<{ token: string }> {
  const res = await apiClient.post('/auth/login', { email, password });
  return res.data;
}

export async function register(
  username: string,
  email: string,
  password: string
): Promise<{ user: User; token: string }> {
  const res = await apiClient.post('/auth/register', {
    username,
    email,
    password,
  });
  const { user, token } = res.data;
  if (user) {
    const { is_admin, avatar_url, ...rest } = user;
    return {
      user: { ...rest, isAdmin: is_admin, avatarUrl: avatar_url },
      token,
    };
  }
  return res.data;
}

export async function getCurrentUser(): Promise<User> {
  const res = await apiClient.get('/users/me');
  const { is_admin, avatar_url, default_assists, favorite_sim, favorite_track, favorite_car, wheel, frame, brakes, equipment, league, ...rest } = res.data;
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
