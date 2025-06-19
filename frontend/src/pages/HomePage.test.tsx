import { render, screen } from '@testing-library/react';

const mockedApi = {
  getTracks: jest.fn().mockResolvedValue([]),
  getGames: jest.fn().mockResolvedValue([]),
  getLapTimes: jest.fn().mockResolvedValue([]),
  getWorldRecords: jest.fn().mockResolvedValue([]),
};

jest.mock('../api', () => mockedApi);

import HomePage from './HomePage';

test('renders headings', () => {
  render(<HomePage />);
  expect(screen.getByText(/Racing Lap Tracker/i)).toBeInTheDocument();
  expect(screen.getByText(/Discover Tracks/i)).toBeInTheDocument();
  expect(screen.getByText(/Lap Records/i)).toBeInTheDocument();
});
