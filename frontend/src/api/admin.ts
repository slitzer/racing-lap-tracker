import apiClient from './client';
import { LapTime, Game, Track, Layout, Car, User } from '../types';

export async function getUnverifiedLapTimes(): Promise<LapTime[]> {
  const res = await apiClient.get('/admin/lapTimes/unverified');
  return res.data;
}

export async function verifyLapTime(id: string): Promise<LapTime> {
  const res = await apiClient.put(`/admin/lapTimes/${id}/verify`);
  return res.data;
}

export async function deleteLapTime(id: string): Promise<LapTime> {
  const res = await apiClient.delete(`/admin/lapTimes/${id}`);
  return res.data;
}

export async function createGame(data: Partial<Game>): Promise<Game> {
  const res = await apiClient.post('/games', data);
  return res.data;
}

export async function updateGame(id: string, data: Partial<Game>): Promise<Game> {
  const res = await apiClient.put(`/games/${id}`, data);
  return res.data;
}

export async function deleteGame(id: string): Promise<Game> {
  const res = await apiClient.delete(`/games/${id}`);
  return res.data;
}

export async function createTrack(data: Partial<Track>): Promise<Track> {
  const res = await apiClient.post('/tracks', data);
  return res.data;
}

export async function updateTrack(id: string, data: Partial<Track>): Promise<Track> {
  const res = await apiClient.put(`/tracks/${id}`, data);
  return res.data;
}

export async function deleteTrack(id: string): Promise<Track> {
  const res = await apiClient.delete(`/tracks/${id}`);
  return res.data;
}

export async function createLayout(data: Partial<Layout>): Promise<Layout> {
  const res = await apiClient.post('/layouts', data);
  return res.data;
}

export async function updateLayout(id: string, data: Partial<Layout>): Promise<Layout> {
  const res = await apiClient.put(`/layouts/${id}`, data);
  return res.data;
}

export async function deleteLayout(id: string): Promise<Layout> {
  const res = await apiClient.delete(`/layouts/${id}`);
  return res.data;
}

export async function createCar(data: Partial<Car>): Promise<Car> {
  const res = await apiClient.post('/cars', data);
  return res.data;
}

export async function updateCar(id: string, data: Partial<Car>): Promise<Car> {
  const res = await apiClient.put(`/cars/${id}`, data);
  return res.data;
}

export async function deleteCar(id: string): Promise<Car> {
  const res = await apiClient.delete(`/cars/${id}`);
  return res.data;
}

export async function exportDatabase(): Promise<any> {
  const res = await apiClient.get('/admin/export');
  return res.data;
}

export async function importDatabase(
  data: any,
  onProgress?: (percent: number) => void
): Promise<{ message: string }> {
  const res = await apiClient.post('/admin/import', data, {
    onUploadProgress: (evt) => {
      if (onProgress && evt.total) {
        const pct = Math.round((evt.loaded / evt.total) * 100);
        onProgress(pct);
      }
    },
  });
  return res.data;
}

export async function getAdminUsers(): Promise<User[]> {
  const res = await apiClient.get('/admin/users');
  return res.data;
}

export async function createUser(data: Partial<User> & { password: string }): Promise<User> {
  const res = await apiClient.post('/admin/users', data);
  return res.data;
}

export async function updateUser(id: string, data: Partial<User> & { password?: string }): Promise<User> {
  const res = await apiClient.put(`/admin/users/${id}`, data);
  return res.data;
}

export async function deleteUser(id: string, keepTimes?: boolean): Promise<any> {
  const res = await apiClient.delete(`/admin/users/${id}`, { params: { keepTimes } });
  return res.data;
}
