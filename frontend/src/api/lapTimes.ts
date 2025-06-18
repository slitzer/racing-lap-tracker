import apiClient from './client';
import { LapTime } from '../types';

export async function getLapTimes(): Promise<LapTime[]> {
  const res = await apiClient.get('/lapTimes');
  return res.data;
}

export async function submitLapTime(data: Omit<LapTime, 'id' | 'userId'>): Promise<LapTime> {
  const res = await apiClient.post('/lapTimes', data);
  return res.data;
}
