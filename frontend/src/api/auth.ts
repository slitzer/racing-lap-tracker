import apiClient from './client';
import { User } from '../types';

export async function login(email: string, password: string): Promise<{ token: string }> {
  const res = await apiClient.post('/auth/login', { email, password });
  return res.data;
}

export async function register(username: string, email: string, password: string): Promise<{ user: User; token: string }> {
  const res = await apiClient.post('/auth/register', { username, email, password });
  return res.data;
}

export async function getCurrentUser(): Promise<User> {
  const res = await apiClient.get('/users/me');
  return res.data;
}
