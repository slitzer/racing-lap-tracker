import apiClient from './client';
import { Track } from '../types';

export async function getTracks(gameId?: string): Promise<Track[]> {
  const res = await apiClient.get('/tracks', { params: gameId ? { gameId } : {} });
  return res.data;
}
