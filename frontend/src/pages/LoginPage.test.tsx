import { render, screen } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import * as ReactRouter from 'react-router-dom';
import { useAuth } from '../contexts/AuthContext';
import LoginPage from './LoginPage';

jest.mock('../contexts/AuthContext', () => ({ useAuth: jest.fn() }));
jest.mock('react-router-dom', () => ({
  ...jest.requireActual('react-router-dom'),
  useNavigate: jest.fn(),
  useLocation: jest.fn(),
}));

const mockedUseAuth = useAuth as jest.MockedFunction<typeof useAuth>;
const navigate = jest.fn();
(ReactRouter.useNavigate as jest.Mock).mockReturnValue(navigate);
(ReactRouter.useLocation as jest.Mock).mockReturnValue({ state: { from: { pathname: '/dest' } } });

describe('LoginPage', () => {
  beforeEach(() => {
    mockedUseAuth.mockReturnValue({ login: jest.fn(), register: jest.fn(), logout: jest.fn(), user: null, isLoading: false, refreshUser: jest.fn() });
    navigate.mockClear();
  });

  it('submits credentials and navigates', async () => {
    const loginMock = jest.fn();
    mockedUseAuth.mockReturnValue({ login: loginMock, register: jest.fn(), logout: jest.fn(), user: null, isLoading: false, refreshUser: jest.fn() });
    render(
      <ReactRouter.MemoryRouter>
        <LoginPage />
      </ReactRouter.MemoryRouter>
    );
    await userEvent.type(screen.getAllByRole('textbox')[0], 'a@b.c');
    const passwordInput = screen.getByText('Password').parentElement!.querySelector('input')!;
    await userEvent.type(passwordInput, 'secret');
    await userEvent.click(screen.getByRole('button', { name: /login/i }));
    expect(loginMock).toHaveBeenCalledWith('a@b.c', 'secret');
    expect(navigate).toHaveBeenCalledWith('/dest', { replace: true });
  });
});
