import React from 'react';
import { describe, it, expect, vi, beforeEach, afterEach } from 'vitest';
import { render, screen, act } from '@testing-library/react';
import App from './App';

describe('App', () => {
  beforeEach(() => {
    global.fetch = vi.fn();
  });

  afterEach(() => {
    vi.restoreAllMocks();
  });

  it('renders without crashing', async () => {
    global.fetch.mockResolvedValueOnce({ ok: true, json: async () => ({}) });
    const div = document.createElement('div');
    render(<App />, { container: div });
    await act(async () => {
      await Promise.resolve();
    });
  });

  it('renders a skip link targeting the main content', async () => {
    global.fetch.mockResolvedValueOnce({ ok: true, json: async () => ({}) });
    render(<App />);
    const skipLink = screen.getByText('Skip to main content');
    expect(skipLink).toHaveAttribute('href', '#about');
    await act(async () => {
      await Promise.resolve();
    });
  });

  it('renders section content once resumeData.json loads successfully', async () => {
    global.fetch.mockResolvedValueOnce({
      ok: true,
      json: async () => ({
        main: {
          name: 'Richard Hollon',
          social: [],
          address: { street: '', city: '', state: '', zip: '' },
        },
      }),
    });

    render(<App />);

    expect(
      await screen.findByText(
        (_, element) => element?.tagName === 'H1' && element.textContent === "I'm Richard Hollon."
      )
    ).toBeInTheDocument();
  });

  it('logs an error and does not crash when the fetch response is not ok', async () => {
    const consoleSpy = vi.spyOn(console, 'error').mockImplementation(() => {});
    global.fetch.mockResolvedValueOnce({ ok: false, status: 500 });

    render(<App />);

    await vi.waitFor(() => expect(consoleSpy).toHaveBeenCalled());
    expect(consoleSpy.mock.calls[0][0]).toBeInstanceOf(Error);
  });

  it('logs an error and does not crash when the fetch call rejects', async () => {
    const consoleSpy = vi.spyOn(console, 'error').mockImplementation(() => {});
    global.fetch.mockRejectedValueOnce(new Error('network down'));

    render(<App />);

    await vi.waitFor(() => expect(consoleSpy).toHaveBeenCalledWith(expect.any(Error)));
  });
});
