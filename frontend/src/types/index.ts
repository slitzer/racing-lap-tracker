export interface User {
  id: string;
  username: string;
  email: string;
  avatarUrl?: string | null;
  isAdmin?: boolean;
  wheel?: string | null;
  frame?: string | null;
  brakes?: string | null;
  equipment?: string | null;
  favoriteSim?: string | null;
  favoriteTrack?: string | null;
  favoriteCar?: string | null;
  defaultAssists?: string[];
  league?: string | null;
}

export interface UserStats {
  lapCount: number;
  bestLapMs: number | null;
  avgLapMs: number | null;
}

export interface Game {
  id: string;
  name: string;
  imageUrl?: string | null;
}

export interface Track {
  id: string;
  gameId: string;
  name: string;
  imageUrl?: string | null;
  description?: string | null;
}

export interface Layout {
  id: string;
  trackId: string;
  name: string;
  imageUrl?: string | null;
  trackLayoutId?: string;
}

export interface Car {
  id: string;
  gameId: string;
  name: string;
  imageUrl?: string | null;
  description?: string | null;
}

export interface LapTime {
  id: string;
  userId: string;
  gameId: string;
  trackLayoutId: string;
  trackId?: string;
  layoutId?: string;
  carId: string;
  inputType: string;
  timeMs: number;
  lapDate: string;
  screenshotUrl?: string | null;
  notes?: string | null;
  username?: string;
  avatarUrl?: string | null;
  gameName?: string;
  gameImageUrl?: string | null;
  trackName?: string;
  trackImageUrl?: string | null;
  layoutName?: string;
  layoutImageUrl?: string | null;
  carName?: string;
  carImageUrl?: string | null;
  assists?: string[];
}

export interface Assist {
  id: string;
  name: string;
}
