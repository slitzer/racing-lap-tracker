export function formatTime(ms: number) {
  const minutes = Math.floor(ms / 60000);
  const seconds = Math.floor((ms % 60000) / 1000);
  const milliseconds = ms % 1000;
  return `${minutes}:${seconds.toString().padStart(2, '0')}.${milliseconds
    .toString()
    .padStart(3, '0')}`;
}

export function parseTime(time: string): number | null {
  const match = time.trim().match(/^(\d+):(\d{1,2})\.(\d{1,3})$/);
  if (!match) return null;
  const minutes = parseInt(match[1], 10);
  const seconds = parseInt(match[2], 10);
  const ms = parseInt(match[3].padEnd(3, '0'), 10);
  if (seconds >= 60) return null;
  return minutes * 60000 + seconds * 1000 + ms;
}
