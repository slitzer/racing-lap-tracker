import apiClient from './client';
import { Car } from '../types';

export async function getCars(gameId?: string): Promise<Car[]> {
  const res = await apiClient.get('/cars', { params: gameId ? { gameId } : {} });
  return res.data;
}
