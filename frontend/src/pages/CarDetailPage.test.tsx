import { render, screen } from '@testing-library/react';
import { MemoryRouter, Route, Routes } from 'react-router-dom';
const mockedApi = {
  getCars: jest.fn(),
  getLapTimes: jest.fn(),
  getWorldRecords: jest.fn(),
};

jest.mock('../api', () => mockedApi);

import CarDetailPage from './CarDetailPage';

describe('CarDetailPage', () => {
  beforeEach(() => {
    mockedApi.getCars.mockResolvedValue([{ id: 'c1', gameId: 'g1', name: 'Car', imageUrl: '' }]);
    mockedApi.getLapTimes.mockResolvedValue([]);
    mockedApi.getWorldRecords.mockResolvedValue([]);
  });

  it('renders car name', async () => {
    render(
      <MemoryRouter initialEntries={["/car/c1"]}>
        <Routes>
          <Route path="/car/:id" element={<CarDetailPage />} />
        </Routes>
      </MemoryRouter>
    );
    expect(await screen.findByRole('heading', { name: 'Car' })).toBeInTheDocument();
  });
});
