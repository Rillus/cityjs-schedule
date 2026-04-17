import { render, screen, waitFor } from '@testing-library/react';
import { BrowserRouter } from 'react-router-dom';
import App from './App';

global.fetch = jest.fn();

const mockScheduleResponse = {
  modified: '2026-04-16',
  name: 'CityJS London',
  locations: [
    {
      name: 'Kensington Town Hall — Day 1',
      events: [
        {
          name: 'Test session',
          short: 'testsession',
          start: '2026-04-15 10:00',
          end: '2026-04-15 11:00'
        }
      ]
    }
    ,
    {
      name: 'Great Hall - Ground Floor',
      events: [
        {
          name: 'Day 3 session',
          short: 'day3-session',
          start: '2026-04-17 10:00',
          end: '2026-04-17 10:30'
        }
      ]
    }
  ]
};

beforeEach(() => {
  fetch.mockClear();
});

test('renders app title', async () => {
  fetch.mockResolvedValueOnce({
    ok: true,
    json: async () => mockScheduleResponse,
  });

  render(
    <BrowserRouter>
      <App />
    </BrowserRouter>
  );

  await waitFor(() => {
    expect(screen.getByText(/Data: 2026-04-16/)).toBeInTheDocument();
  });

  const linkElement = screen.getByRole('heading', { name: /My schedule/i });
  expect(linkElement).toBeInTheDocument();
});

test('shows "My CityJS" in the navigation menu', async () => {
  fetch.mockResolvedValueOnce({
    ok: true,
    json: async () => mockScheduleResponse,
  });

  render(
    <BrowserRouter>
      <App />
    </BrowserRouter>
  );

  await waitFor(() => {
    expect(screen.getByRole('link', { name: /My CityJS/i })).toBeInTheDocument();
  });
});

test('loads bundled CityJS schedule JSON', async () => {
  fetch.mockResolvedValueOnce({
    ok: true,
    json: async () => mockScheduleResponse,
  });

  render(
    <BrowserRouter>
      <App />
    </BrowserRouter>
  );

  await waitFor(() => {
    expect(fetch).toHaveBeenCalledWith('/cityjs-london.json');
    expect(screen.getByText(/Data: 2026-04-16/)).toBeInTheDocument();
  });
});

test('filters out Day 1 and Day 2 sessions', async () => {
  fetch.mockResolvedValueOnce({
    ok: true,
    json: async () => mockScheduleResponse,
  });

  render(
    <BrowserRouter>
      <App />
    </BrowserRouter>
  );

  await waitFor(() => {
    expect(screen.queryByText('Kensington Town Hall — Day 1')).not.toBeInTheDocument();
  });
});
