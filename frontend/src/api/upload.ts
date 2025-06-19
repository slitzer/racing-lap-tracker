import apiClient from './client';

export async function uploadFile(
  file: File,
  folder?: string
): Promise<{ url: string }> {
  const formData = new FormData();
  formData.append('file', file);
  const url = folder ? `/uploads?folder=${encodeURIComponent(folder)}` : '/uploads';
  const res = await apiClient.post(url, formData, {
    headers: { 'Content-Type': 'multipart/form-data' },
  });
  return res.data;
}
