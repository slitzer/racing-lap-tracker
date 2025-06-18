import { render, screen } from '@testing-library/react';
import userEvent from '@testing-library/user-event';

const mockedApi = {
  getUnverifiedLapTimes: jest.fn(),
  getGames: jest.fn(),
  getTracks: jest.fn(),
  getLayouts: jest.fn(),
  getCars: jest.fn(),
  verifyLapTime: jest.fn(),
  deleteLapTime: jest.fn(),
};

jest.mock('../api', () => mockedApi);

import AdminPage from './AdminPage';

beforeEach(() => {
  mockedApi.getUnverifiedLapTimes.mockResolvedValue([]);
  mockedApi.getGames.mockResolvedValue([]);
  mockedApi.getTracks.mockResolvedValue([]);
  mockedApi.getLayouts.mockResolvedValue([]);
  mockedApi.getCars.mockResolvedValue([]);
});

test('renders admin heading', () => {
  render(<AdminPage />);
  expect(screen.getByText(/Admin/i)).toBeInTheDocument();
});

test('verifies a lap time', async () => {
  mockedApi.getUnverifiedLapTimes.mockResolvedValue([{ id: '1', timeMs: 123 }]);
  mockedApi.verifyLapTime.mockResolvedValue({ id: '1', verified: true });
  render(<AdminPage />);
  expect(await screen.findByText('1')).toBeInTheDocument();
  await userEvent.click(screen.getByRole('button', { name: /verify/i }));
  expect(mockedApi.verifyLapTime).toHaveBeenCalledWith('1');
});

test('deletes a lap time', async () => {
  mockedApi.getUnverifiedLapTimes.mockResolvedValue([{ id: '2', timeMs: 456 }]);
  mockedApi.deleteLapTime.mockResolvedValue({ id: '2' });
  render(<AdminPage />);
  expect(await screen.findByText('2')).toBeInTheDocument();
  await userEvent.click(screen.getAllByRole('button', { name: /delete/i })[0]);
  expect(mockedApi.deleteLapTime).toHaveBeenCalledWith('2');
});
