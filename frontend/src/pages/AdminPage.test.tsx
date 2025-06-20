import { render, screen } from '@testing-library/react';
import { MemoryRouter } from 'react-router-dom';
import userEvent from '@testing-library/user-event';

const mockedApi = {
  getUnverifiedLapTimes: jest.fn(),
  getGames: jest.fn(),
  getTracks: jest.fn(),
  getLayouts: jest.fn(),
  getCars: jest.fn(),
  verifyLapTime: jest.fn(),
  deleteLapTime: jest.fn(),
  getVersion: jest.fn(),
  getUsers: jest.fn(),
  createUser: jest.fn(),
  updateUser: jest.fn(),
  deleteUser: jest.fn(),
};

jest.mock('../api', () => mockedApi);

import AdminPage from './AdminPage';

beforeEach(() => {
  mockedApi.getUnverifiedLapTimes.mockResolvedValue([]);
  mockedApi.getGames.mockResolvedValue([]);
  mockedApi.getTracks.mockResolvedValue([]);
  mockedApi.getLayouts.mockResolvedValue([]);
  mockedApi.getCars.mockResolvedValue([]);
  mockedApi.getUsers.mockResolvedValue([]);
  mockedApi.getVersion.mockResolvedValue({ appVersion: 'v0.1', dbVersion: 'v1' });
});

test('renders admin heading', () => {
  render(
    <MemoryRouter>
      <AdminPage />
    </MemoryRouter>
  );
  expect(screen.getByRole('heading', { name: /Admin/i })).toBeInTheDocument();
});

test('shows version information', async () => {
  render(
    <MemoryRouter>
      <AdminPage />
    </MemoryRouter>
  );
  expect(await screen.findByText(/App version/i)).toBeInTheDocument();
  expect(screen.getByText(/Database version/i)).toBeInTheDocument();
});

test('verifies a lap time', async () => {
  mockedApi.getUnverifiedLapTimes.mockResolvedValue([{ id: '1', timeMs: 123 }]);
  mockedApi.verifyLapTime.mockResolvedValue({ id: '1', verified: true });
  render(
    <MemoryRouter>
      <AdminPage />
    </MemoryRouter>
  );
  await userEvent.click(screen.getByRole('button', { name: /unverified lap times/i }));
  expect(await screen.findByText('1')).toBeInTheDocument();
  await userEvent.click(screen.getByRole('button', { name: /verify/i }));
  expect(mockedApi.verifyLapTime).toHaveBeenCalledWith('1');
});

test('deletes a lap time', async () => {
  mockedApi.getUnverifiedLapTimes.mockResolvedValue([{ id: '2', timeMs: 456 }]);
  mockedApi.deleteLapTime.mockResolvedValue({ id: '2' });
  render(
    <MemoryRouter>
      <AdminPage />
    </MemoryRouter>
  );
  await userEvent.click(screen.getByRole('button', { name: /unverified lap times/i }));
  expect(await screen.findByText('2')).toBeInTheDocument();
  await userEvent.click(screen.getAllByRole('button', { name: /delete/i })[0]);
  expect(mockedApi.deleteLapTime).toHaveBeenCalledWith('2');
});
