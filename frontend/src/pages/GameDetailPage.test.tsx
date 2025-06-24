import { render, screen } from '@testing-library/react';
import { MemoryRouter, Route, Routes } from 'react-router-dom';

const mockedApi = {
  getGames: jest.fn(),
  getLapTimes: jest.fn(),
  getWorldRecords: jest.fn(),
};

jest.mock('../api', () => mockedApi);

import GameDetailPage from './GameDetailPage';
import { useAuth } from '../contexts/AuthContext';

jest.mock('../contexts/AuthContext', () => ({ useAuth: jest.fn() }));
const mockedUseAuth = useAuth as jest.MockedFunction<typeof useAuth>;

describe('GameDetailPage', () => {
  beforeEach(() => {
    mockedUseAuth.mockReturnValue({
      user: null,
      isLoading: false,
      login: jest.fn(),
      register: jest.fn(),
      logout: jest.fn(),
      refreshUser: jest.fn(),
    });
    mockedApi.getGames.mockResolvedValue([{ id: 'g1', name: 'Game', imageUrl: '' }]);
    mockedApi.getLapTimes.mockResolvedValue([]);
    mockedApi.getWorldRecords.mockResolvedValue([]);
  });

  it('renders game name', async () => {
    render(
      <MemoryRouter initialEntries={["/game/g1"]}>
        <Routes>
          <Route path="/game/:id" element={<GameDetailPage />} />
        </Routes>
      </MemoryRouter>
    );
    expect(await screen.findByRole('heading', { name: 'Game' })).toBeInTheDocument();
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
      <MemoryRouter initialEntries={["/game/g1"]}>
        <Routes>
          <Route path="/game/:id" element={<GameDetailPage />} />
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
      <MemoryRouter initialEntries={["/game/g1"]}>
        <Routes>
          <Route path="/game/:id" element={<GameDetailPage />} />
        </Routes>
      </MemoryRouter>
    );
    expect(screen.queryByRole('button', { name: /edit/i })).toBeNull();
  });
});
