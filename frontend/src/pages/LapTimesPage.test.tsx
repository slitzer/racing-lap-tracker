import { render, screen } from '@testing-library/react';
import { useAuth } from '../contexts/AuthContext';

jest.mock('../api', () => ({
  getLapTimes: () => Promise.resolve([]),
  getWorldRecords: () => Promise.resolve([]),
}));

jest.mock('../contexts/AuthContext', () => ({ useAuth: jest.fn() }));

import LapTimesPage from './LapTimesPage';

const mockedUseAuth = useAuth as jest.MockedFunction<typeof useAuth>;

beforeEach(() => {
  mockedUseAuth.mockReturnValue({ user: null, isLoading: false, login: jest.fn(), register: jest.fn(), logout: jest.fn(), refreshUser: jest.fn() });
});

test('renders lap times heading', () => {
  render(<LapTimesPage />);
  expect(screen.getByRole('heading', { name: /Lap Times/i })).toBeInTheDocument();
});
