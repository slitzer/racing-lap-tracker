import { render, screen } from '@testing-library/react';

const mockedApi = {
  getGames: jest.fn().mockResolvedValue([]),
  getTracks: jest.fn().mockResolvedValue([]),
  getCars: jest.fn().mockResolvedValue([]),
};

jest.mock('../api', () => mockedApi);

import ShowcasePage from './ShowcasePage';

it('renders heading', () => {
  render(<ShowcasePage />);
  expect(screen.getByText(/Showcase/i)).toBeInTheDocument();
});
