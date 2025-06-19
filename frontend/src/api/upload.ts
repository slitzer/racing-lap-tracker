import apiClient from './client';
import axios from 'axios';

export async function uploadFile(
  file: File,
  folder?: string,
  filename?: string
): Promise<{ url: string }> {
  const formData = new FormData();
  formData.append('file', file);
  const params = new URLSearchParams();
  if (folder) params.append('folder', folder);
  if (filename) params.append('filename', filename);
  const query = params.toString();
  const url = query ? `/uploads?${query}` : '/uploads';
try {
  const res = await apiClient.post(url, formData, {
    headers: { 'Content-Type': 'multipart/form-data' },
  });
  return res.data;
} catch (err: any) {
  if (axios.isAxiosError(err) && err.response) {
    if (err.response.status === 401) {
      throw new Error('Authentication required to upload files');
    }
    if (err.response.status === 403) {
      throw new Error('You do not have permission to upload files');
    }
  }
  throw err;
}

}
