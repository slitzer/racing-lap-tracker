import { render, screen } from '@testing-library/react';
import InputTypeBadge from './InputTypeBadge';

test('renders input type with emoji', () => {
  render(<InputTypeBadge inputType="Wheel" />);
  expect(screen.getByText(/Wheel/)).toBeInTheDocument();
});
