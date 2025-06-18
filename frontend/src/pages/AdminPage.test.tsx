import { render, screen } from '@testing-library/react';

jest.mock('../api', () => ({
  getUnverifiedLapTimes: () => Promise.resolve([]),
  getGames: () => Promise.resolve([]),
  getTracks: () => Promise.resolve([]),
  getLayouts: () => Promise.resolve([]),
  getCars: () => Promise.resolve([]),
}));

import AdminPage from './AdminPage';

test('renders admin heading', () => {
  render(<AdminPage />);
  expect(screen.getByText(/Admin/i)).toBeInTheDocument();
});
