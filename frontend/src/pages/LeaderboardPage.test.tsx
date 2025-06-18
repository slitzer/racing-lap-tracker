import { render, screen } from '@testing-library/react';

jest.mock('../api', () => ({
  getGames: () => Promise.resolve([]),
  getTracks: () => Promise.resolve([]),
  getLayouts: () => Promise.resolve([]),
  getLeaderboard: () => Promise.resolve([]),
}));

import LeaderboardPage from './LeaderboardPage';

test('renders leaderboard heading', () => {
  render(<LeaderboardPage />);
  expect(screen.getByText(/Leaderboard/i)).toBeInTheDocument();
});
