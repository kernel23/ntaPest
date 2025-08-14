import { render, screen } from '@testing-library/react';
import App from './App';

// Mocking Leaflet as it can cause issues in a JSDOM environment
jest.mock('leaflet');

test('renders the login page by default', () => {
  render(<App />);
  // The app should initially show the login page, which contains this heading
  const headingElement = screen.getByRole('heading', { name: /agri-guard/i });
  expect(headingElement).toBeInTheDocument();
});
