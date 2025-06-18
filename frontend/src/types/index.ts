export interface User {
  id: string;
  username: string;
  email: string;
  avatarUrl?: string | null;
  isAdmin?: boolean;
}

export interface LapTime {
  id: string;
  userId: string;
  gameId: string;
  trackId: string;
  layoutId: string;
  carId: string;
  inputType: string;
  timeMs: number;
  lapDate: string;
  screenshotUrl?: string | null;
  username?: string;
}
