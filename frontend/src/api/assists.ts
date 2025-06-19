import apiClient from './client';
import { Assist } from '../types';

export async function getAssists(): Promise<Assist[]> {
  const res = await apiClient.get('/assists');
  return res.data;
}
