import apiClient from './client';

export interface Game {
  id: number;
  name: string;
}

export async function getGames(): Promise<Game[]> {
  const res = await apiClient.get('/games');
  return res.data;
}
