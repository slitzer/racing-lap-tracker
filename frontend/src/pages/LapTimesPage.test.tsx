import { render, screen } from '@testing-library/react';
import { MemoryRouter } from 'react-router-dom';

const mockedApi = {
  getLapTimes: jest.fn(),
  getGames: jest.fn(),
  getTracks: jest.fn(),
  getCars: jest.fn(),
};

jest.mock('../api', () => mockedApi);

import LapTimesPage from './LapTimesPage';

beforeEach(() => {
  mockedApi.getLapTimes.mockResolvedValue([]);
  mockedApi.getGames.mockResolvedValue([]);
  mockedApi.getTracks.mockResolvedValue([]);
  mockedApi.getCars.mockResolvedValue([]);
});

test('renders lap times heading', () => {
  render(
    <MemoryRouter>
      <LapTimesPage />
    </MemoryRouter>
  );
  expect(screen.getByRole('heading', { name: /Lap Times/i })).toBeInTheDocument();
});

test('renders assists when provided', async () => {
  mockedApi.getLapTimes.mockResolvedValueOnce([
    {
      id: '1',
      userId: 'u1',
      gameId: 'g1',
      trackId: 't1',
      layoutId: 'l1',
      carId: 'c1',
      inputType: 'Wheel',
      timeMs: 1234,
      lapDate: '2023-01-01',
      username: 'User',
      gameName: 'Game',
      trackName: 'Track',
      carName: 'Car',
      assists: ['ABS']
    }
  ]);

  render(
    <MemoryRouter>
      <LapTimesPage />
    </MemoryRouter>
  );
  expect(await screen.findByText('ABS')).toBeInTheDocument();
});
