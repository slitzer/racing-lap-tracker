export interface User {
  id: number;
  username: string;
  email: string;
  avatarUrl?: string | null;
  isAdmin?: boolean;
}

export interface LapTime {
  id: number;
  userId: number;
  gameId: number;
  trackId: number;
  layoutId: number;
  carId: number;
  inputType: string;
  timeMs: number;
  lapDate: string;
  screenshotUrl?: string | null;
  username?: string;
}
