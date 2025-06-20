import { render, screen } from '@testing-library/react';
import { MemoryRouter } from 'react-router-dom';

const mockedApi = {
  getLapTimes: jest.fn(),
  getGames: jest.fn(),
  getTracks: jest.fn(),
  getCars: jest.fn(),
  getUsers: jest.fn(),
  getAssists: jest.fn(),
};

jest.mock('../api', () => mockedApi);

import LapTimesPage from './LapTimesPage';

beforeEach(() => {
  mockedApi.getLapTimes.mockResolvedValue([]);
  mockedApi.getGames.mockResolvedValue([]);
  mockedApi.getTracks.mockResolvedValue([]);
  mockedApi.getCars.mockResolvedValue([]);
  mockedApi.getUsers.mockResolvedValue([]);
  mockedApi.getAssists.mockResolvedValue([]);
});

test('renders lap times heading', () => {
  render(
    <MemoryRouter>
      <LapTimesPage />
    </MemoryRouter>
  );
  expect(screen.getByRole('heading', { name: /Lap Times/i })).toBeInTheDocument();
  expect(screen.getByPlaceholderText('Search...')).toBeInTheDocument();
});

test('renders assists when provided', async () => {
  mockedApi.getLapTimes.mockResolvedValueOnce([
    {
      id: '1',
      userId: 'u1',
      gameId: 'g1',
      trackLayoutId: 'tl1',
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

test('shows input type badge', async () => {
  mockedApi.getLapTimes.mockResolvedValueOnce([
    {
      id: '1',
      userId: 'u1',
      gameId: 'g1',
      trackLayoutId: 'tl1',
      trackId: 't1',
      layoutId: 'l1',
      carId: 'c1',
      inputType: 'Controller',
      timeMs: 1500,
      lapDate: '2023-01-01',
      username: 'User',
      gameName: 'Game',
      trackName: 'Track',
      carName: 'Car',
      assists: []
    }
  ]);

  render(
    <MemoryRouter>
      <LapTimesPage />
    </MemoryRouter>
  );
  expect(await screen.findByText(/Controller/)).toBeInTheDocument();
});

test('shows user filter when filter view selected', async () => {
  render(
    <MemoryRouter>
      <LapTimesPage />
    </MemoryRouter>
  );
  screen.getByRole('button', { name: 'Filter' }).click();
  expect(await screen.findByText('All users')).toBeInTheDocument();
});
