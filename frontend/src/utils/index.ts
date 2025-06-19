export * from './cn';
export * from './slug';

export function getInitials(name: string) {
  return name
    .split(' ')
    .map((n) => n.charAt(0))
    .join('')
    .slice(0, 2)
    .toUpperCase();
}

export function getImageUrl(path?: string | null) {
  if (!path) return undefined;
  if (/^https?:\/\//i.test(path)) return path;
  if (!path.startsWith('/uploads')) return path;
  const envBase =
    (globalThis as any).__API_BASE_URL__ ||
    process.env.VITE_API_URL ||
    '';
  const base = (envBase || '').replace(/\/api\/?$/, '');
  return `${base}${path}`;
}
