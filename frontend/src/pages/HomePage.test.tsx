import { render, screen } from '@testing-library/react';
import HomePage from './HomePage';

test('renders heading', () => {
  render(<HomePage />);
  expect(screen.getByText(/Racing Lap Tracker/i)).toBeInTheDocument();
});
