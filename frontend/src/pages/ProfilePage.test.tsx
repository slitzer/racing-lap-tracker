import { render, screen } from '@testing-library/react';
import ProfilePage from './ProfilePage';
import { useAuth } from '../contexts/AuthContext';

jest.mock('../contexts/AuthContext', () => ({ useAuth: jest.fn() }));
jest.mock('../api', () => ({ getUserStats: () => Promise.resolve({ lapCount: 0, bestLapMs: null, avgLapMs: null }), uploadFile: jest.fn(), updateProfile: jest.fn() }));

const mockedUseAuth = useAuth as jest.MockedFunction<typeof useAuth>;

beforeEach(() => {
  mockedUseAuth.mockReturnValue({ user: { id: '1', username: 'u', email: 'e' }, isLoading: false, login: jest.fn(), register: jest.fn(), logout: jest.fn(), refreshUser: jest.fn() });
});

test('renders profile heading', async () => {
  render(<ProfilePage />);
  expect(screen.getByText(/Profile/i)).toBeInTheDocument();
});
