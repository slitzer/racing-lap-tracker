export interface User {
  id: string;
  username: string;
  email: string;
  avatarUrl?: string | null;
  isAdmin?: boolean;
}

export interface Game {
  id: string;
  name: string;
}

export interface Track {
  id: string;
  gameId: string;
  name: string;
}

export interface Layout {
  id: string;
  trackId: string;
  name: string;
}

export interface Car {
  id: string;
  gameId: string;
  name: string;
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
  gameName?: string;
  gameImageUrl?: string | null;
  trackName?: string;
  trackImageUrl?: string | null;
  layoutName?: string;
  layoutImageUrl?: string | null;
  carName?: string;
  carImageUrl?: string | null;
}
