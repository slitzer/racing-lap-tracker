import { render, screen } from '@testing-library/react';

const mockedApi = {
  getTracks: jest.fn(),
  getLayouts: jest.fn(),
  getLeaderboard: jest.fn(),
};

jest.mock('../api', () => mockedApi);

import TrackDetailPage from './TrackDetailPage';
import { MemoryRouter, Route, Routes } from 'react-router-dom';

describe('TrackDetailPage', () => {
  beforeEach(() => {
    mockedApi.getTracks.mockResolvedValue([{ id: 't1', gameId: 'g1', name: 'Track', imageUrl: '' }]);
    mockedApi.getLayouts.mockResolvedValue([]);
    mockedApi.getLeaderboard.mockResolvedValue([]);
  });

  it('renders track name', async () => {
    render(
      <MemoryRouter initialEntries={["/track/t1"]}>
        <Routes>
          <Route path="/track/:id" element={<TrackDetailPage />} />
        </Routes>
      </MemoryRouter>
    );
    expect(await screen.findByRole('heading', { name: 'Track' })).toBeInTheDocument();
  });

  it('shows input type badges in leaderboard', async () => {
    mockedApi.getLayouts.mockResolvedValueOnce([
      { id: 'l1', name: 'Layout', trackLayoutId: 'tl1', imageUrl: '' }
    ]);
    mockedApi.getLeaderboard.mockResolvedValueOnce([
      {
        id: 'lap1',
        userId: 'u1',
        gameId: 'g1',
        trackLayoutId: 'tl1',
        carId: 'c1',
        inputType: 'Keyboard',
        timeMs: 1000,
        lapDate: '2023-01-01',
        username: 'User',
        carName: 'Car'
      }
    ]);

    render(
      <MemoryRouter initialEntries={["/track/t1"]}>
        <Routes>
          <Route path="/track/:id" element={<TrackDetailPage />} />
        </Routes>
      </MemoryRouter>
    );

    expect(await screen.findByText(/Keyboard/)).toBeInTheDocument();
  });
});
