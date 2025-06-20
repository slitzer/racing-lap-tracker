import { render, screen } from '@testing-library/react';

const mockedApi = {
  getTracks: jest.fn(),
  getLayouts: jest.fn(),
  getLeaderboard: jest.fn(),
};

jest.mock('../api', () => mockedApi);

import TrackDetailPage from './TrackDetailPage';
import { MemoryRouter, Route, Routes } from 'react-router-dom';
import { useAuth } from '../contexts/AuthContext';

jest.mock('../contexts/AuthContext', () => ({ useAuth: jest.fn() }));
const mockedUseAuth = useAuth as jest.MockedFunction<typeof useAuth>;

describe('TrackDetailPage', () => {
  beforeEach(() => {
    mockedUseAuth.mockReturnValue({
      user: null,
      isLoading: false,
      login: jest.fn(),
      register: jest.fn(),
      logout: jest.fn(),
      refreshUser: jest.fn(),
    });
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

  it('shows edit button for admins', async () => {
    mockedUseAuth.mockReturnValue({
      user: { id: '1', username: 'admin', email: 'a@b.c', isAdmin: true },
      isLoading: false,
      login: jest.fn(),
      register: jest.fn(),
      logout: jest.fn(),
      refreshUser: jest.fn(),
    });
    render(
      <MemoryRouter initialEntries={["/track/t1"]}>
        <Routes>
          <Route path="/track/:id" element={<TrackDetailPage />} />
        </Routes>
      </MemoryRouter>
    );
    expect(await screen.findByRole('button', { name: /edit/i })).toBeInTheDocument();
  });

  it('hides edit button for non-admins', async () => {
    mockedUseAuth.mockReturnValue({
      user: { id: '1', username: 'user', email: 'u@b.c', isAdmin: false },
      isLoading: false,
      login: jest.fn(),
      register: jest.fn(),
      logout: jest.fn(),
      refreshUser: jest.fn(),
    });
    render(
      <MemoryRouter initialEntries={["/track/t1"]}>
        <Routes>
          <Route path="/track/:id" element={<TrackDetailPage />} />
        </Routes>
      </MemoryRouter>
    );
    expect(screen.queryByRole('button', { name: /edit/i })).toBeNull();
  });
});
