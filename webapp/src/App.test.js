import { render, screen } from '@testing-library/react';
import App from './App.jsx';

test('renders learn react link', () => {
  render(<App />);
  const linkElement = screen.getByTestId('text-rendered');
  expect(linkElement).toHaveTextContent(/wiq7\s*quiz\s*game/i);
});
