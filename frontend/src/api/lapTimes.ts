import apiClient from './client';
import { LapTime } from '../types';

export async function getLapTimes(userId?: string, carId?: string): Promise<LapTime[]> {
  const params: Record<string, string> = {};
  if (userId) params.userId = userId;
  if (carId) params.carId = carId;
  const res = await apiClient.get('/lapTimes', { params: Object.keys(params).length ? params : undefined });
  return res.data;
}

export async function getWorldRecords(): Promise<LapTime[]> {
  const res = await apiClient.get('/lapTimes/records');
  return res.data;
}

export async function submitLapTime(data: Omit<LapTime, 'id' | 'userId'>): Promise<LapTime> {
  const res = await apiClient.post('/lapTimes', data);
  return res.data;
}
