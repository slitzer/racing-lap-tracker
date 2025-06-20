import { render, screen } from '@testing-library/react';

const mockedApi = {
  getGames: jest.fn(),
  getTracks: jest.fn(),
  getLayouts: jest.fn(),
  getCars: jest.fn(),
  getAssists: jest.fn(),
  submitLapTime: jest.fn(),
  uploadFile: jest.fn(),
};

jest.mock('../api', () => mockedApi);
jest.mock('react-router-dom', () => ({
  ...jest.requireActual('react-router-dom'),
  useNavigate: () => jest.fn(),
}));

import SubmitLapTimePage from './SubmitLapTimePage';

beforeEach(() => {
  mockedApi.getGames.mockResolvedValue([]);
  mockedApi.getTracks.mockResolvedValue([]);
  mockedApi.getLayouts.mockResolvedValue([]);
  mockedApi.getCars.mockResolvedValue([]);
  mockedApi.getAssists.mockResolvedValue([{ id: 'a1', name: 'ABS' }]);
});

test('renders assist checkboxes', async () => {
  render(<SubmitLapTimePage />);
  expect(await screen.findByLabelText(/ABS/)).toBeInTheDocument();
});

test('shows comments textarea', () => {
  render(<SubmitLapTimePage />);
  expect(screen.getByLabelText(/Comments/i)).toBeInTheDocument();
});
