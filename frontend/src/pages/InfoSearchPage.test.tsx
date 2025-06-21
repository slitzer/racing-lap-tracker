import { render, screen } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { MemoryRouter } from 'react-router-dom';
import InfoSearchPage from './InfoSearchPage';
import * as api from '../api';

jest.mock('../api', () => ({
  searchInfo: jest.fn(),
  createGame: jest.fn(),
  createTrack: jest.fn(),
  createLayout: jest.fn(),
  createCar: jest.fn(),
  getGames: jest.fn(),
  getTracks: jest.fn(),
}));

const mockedApi = api as jest.Mocked<typeof api>;

beforeEach(() => {
  mockedApi.searchInfo.mockResolvedValue({ title: 'Monza', description: 'd', imageUrl: '/img' });
  mockedApi.getGames.mockResolvedValue([]);
  mockedApi.getTracks.mockResolvedValue([]);
});

test('searches and saves a game', async () => {
  render(
    <MemoryRouter>
      <InfoSearchPage />
    </MemoryRouter>
  );
  await userEvent.type(screen.getByPlaceholderText(/search/i), 'Monza');
  await userEvent.click(screen.getByRole('button', { name: /search/i }));
  expect(await screen.findByText('Monza')).toBeInTheDocument();
  await userEvent.click(screen.getByRole('button', { name: /save/i }));
  expect(mockedApi.createGame).toHaveBeenCalled();
});
