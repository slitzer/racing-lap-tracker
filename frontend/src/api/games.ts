import apiClient from './client';
import { Game } from '../types';

export async function getGames(): Promise<Game[]> {
  const res = await apiClient.get('/games');
  return res.data;
}
