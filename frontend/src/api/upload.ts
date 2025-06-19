import apiClient from './client';

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
  const res = await apiClient.post(url, formData, {
    headers: { 'Content-Type': 'multipart/form-data' },
  });
  return res.data;
}
