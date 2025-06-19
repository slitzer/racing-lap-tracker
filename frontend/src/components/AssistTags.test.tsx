import { render, screen } from '@testing-library/react';
import AssistTags from './AssistTags';

test('renders assist names', () => {
  render(<AssistTags assists={['ABS', 'TCS']} />);
  expect(screen.getByText('ABS')).toBeInTheDocument();
  expect(screen.getByText('TCS')).toBeInTheDocument();
});
