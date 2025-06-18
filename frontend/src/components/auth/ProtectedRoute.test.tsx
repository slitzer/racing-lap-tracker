import { render, screen } from '@testing-library/react';
import { MemoryRouter, Routes, Route } from 'react-router-dom';
import { useAuth } from '../../contexts/AuthContext';
import ProtectedRoute from './ProtectedRoute';

jest.mock('../../contexts/AuthContext', () => ({ useAuth: jest.fn() }));
const mockedUseAuth = useAuth as jest.MockedFunction<typeof useAuth>;

describe('ProtectedRoute', () => {
  it('redirects unauthenticated users', () => {
    mockedUseAuth.mockReturnValue({ user: null, isLoading: false, login: jest.fn(), register: jest.fn(), logout: jest.fn() });
    render(
      <MemoryRouter initialEntries={['/private']}>
        <Routes>
          <Route path="/private" element={<ProtectedRoute><div>Private</div></ProtectedRoute>} />
          <Route path="/login" element={<div>Login</div>} />
        </Routes>
      </MemoryRouter>
    );
    expect(screen.getByText('Login')).toBeInTheDocument();
  });

  it('shows access denied for non-admin', () => {
    mockedUseAuth.mockReturnValue({ user: { id: '1', username: 'u', email: 'e', isAdmin: false }, isLoading: false, login: jest.fn(), register: jest.fn(), logout: jest.fn() });
    render(
      <MemoryRouter initialEntries={['/admin']}>
        <Routes>
          <Route path="/admin" element={<ProtectedRoute requireAdmin><div>Admin</div></ProtectedRoute>} />
        </Routes>
      </MemoryRouter>
    );
    expect(screen.getByText(/Access Denied/i)).toBeInTheDocument();
  });

  it('renders children for authorised admin', () => {
    mockedUseAuth.mockReturnValue({ user: { id: '1', username: 'u', email: 'e', isAdmin: true }, isLoading: false, login: jest.fn(), register: jest.fn(), logout: jest.fn() });
    render(
      <MemoryRouter initialEntries={['/admin']}>
        <Routes>
          <Route path="/admin" element={<ProtectedRoute requireAdmin><div>Admin</div></ProtectedRoute>} />
        </Routes>
      </MemoryRouter>
    );
    expect(screen.getByText('Admin')).toBeInTheDocument();
  });
});
