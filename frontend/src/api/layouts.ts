import apiClient from './client';
import { Layout } from '../types';

export async function getLayouts(trackId?: string): Promise<Layout[]> {
  const res = await apiClient.get('/layouts', { params: trackId ? { trackId } : {} });
  return res.data;
}
