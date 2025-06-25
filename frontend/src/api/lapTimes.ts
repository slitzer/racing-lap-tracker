import apiClient from './client';
import { LapTime, Comment } from '../types';

export async function getLapTimes(filters?: {
  userId?: string;
  carId?: string;
  dateFrom?: string;
  dateTo?: string;
  assist?: string;
}): Promise<LapTime[]> {
  const params: Record<string, string> = {};
  if (!filters) filters = {};
  if (filters.userId) params.userId = filters.userId;
  if (filters.carId) params.carId = filters.carId;
  if (filters.dateFrom) params.dateFrom = filters.dateFrom;
  if (filters.dateTo) params.dateTo = filters.dateTo;
  if (filters.assist) params.assist = filters.assist;
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

export async function getComments(lapTimeId: string): Promise<Comment[]> {
  const res = await apiClient.get(`/lapTimes/${lapTimeId}/comments`);
  return res.data;
}

export async function addComment(lapTimeId: string, content: string): Promise<Comment> {
  const res = await apiClient.post(`/lapTimes/${lapTimeId}/comments`, { content });
  return res.data;
}
