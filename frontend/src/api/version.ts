import apiClient from './client';

export interface VersionInfo {
  appVersion: string;
  dbVersion: string;
}

export async function getVersion(): Promise<VersionInfo> {
  const res = await apiClient.get('/version');
  return res.data as VersionInfo;
}
