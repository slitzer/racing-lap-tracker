import { render, screen } from '@testing-library/react';

jest.mock('../api', () => ({
  getLapTimes: () => Promise.resolve([]),
  getGames: () => Promise.resolve([]),
  getTracks: () => Promise.resolve([]),
  getCars: () => Promise.resolve([]),
}));

import LapTimesPage from './LapTimesPage';

test('renders lap times heading', () => {
  render(<LapTimesPage />);
  expect(screen.getByRole('heading', { name: /Lap Times/i })).toBeInTheDocument();
});
