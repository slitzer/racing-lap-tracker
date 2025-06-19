import apiClient from './client';
import { LapTime } from '../types';

export async function getLeaderboard(params: {
  gameId: string;
  trackLayoutId: string;
}): Promise<LapTime[]> {
  const res = await apiClient.get('/leaderboards', { params });
  return res.data;
}
