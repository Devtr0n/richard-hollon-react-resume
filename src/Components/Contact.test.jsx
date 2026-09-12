import { describe, it, expect, vi, beforeEach, afterEach } from 'vitest';
import { render, screen, waitFor, fireEvent } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import Contact from './Contact';

const data = {
  name: 'Richard Hollon',
  address: { street: '1429 Escarpment Rd', city: 'New Braunfels', state: 'Texas', zip: '78132' },
  phone: '555-555-5555',
  contactmessage: 'Feel free to get in contact with me.',
};

describe('Contact', () => {
  beforeEach(() => {
    global.fetch = vi.fn();
  });

  afterEach(() => {
    vi.restoreAllMocks();
  });

  it('shows a validation error when required fields are missing', async () => {
    render(<Contact data={data} />);
    const user = userEvent.setup();

    await user.click(screen.getByRole('button', { name: /submit/i }));

    expect(
      await screen.findByText(/please fill in your name, email, and message/i)
    ).toBeInTheDocument();
    expect(global.fetch).not.toHaveBeenCalled();
  });

  it('submits the form via fetch (Formspree) without jQuery ajax', async () => {
    global.fetch.mockResolvedValueOnce({ ok: true, json: async () => ({}) });

    render(<Contact data={data} />);
    const user = userEvent.setup();

    await user.type(screen.getByLabelText(/name/i), 'Jane Doe');
    await user.type(screen.getByLabelText(/email/i), 'jane@example.com');
    await user.type(screen.getByLabelText(/message/i), 'Hello there!');
    await user.click(screen.getByRole('button', { name: /submit/i }));

    await waitFor(() => expect(global.fetch).toHaveBeenCalledTimes(1));

    const [, options] = global.fetch.mock.calls[0];
    expect(options.method).toBe('POST');
    expect(JSON.parse(options.body)).toMatchObject({
      name: 'Jane Doe',
      email: 'jane@example.com',
      message: 'Hello there!',
    });

    expect(await screen.findByText(/your message was sent/i)).toBeInTheDocument();
  });

  it('shows an error message when the request fails', async () => {
    global.fetch.mockRejectedValueOnce(new Error('network down'));

    render(<Contact data={data} />);
    const user = userEvent.setup();

    await user.type(screen.getByLabelText(/name/i), 'Jane Doe');
    await user.type(screen.getByLabelText(/email/i), 'jane@example.com');
    await user.type(screen.getByLabelText(/message/i), 'Hello there!');
    await user.click(screen.getByRole('button', { name: /submit/i }));

    expect(await screen.findByText(/network error/i)).toBeInTheDocument();
  });

  it('shows a server-provided error message when the response is not ok', async () => {
    global.fetch.mockResolvedValueOnce({
      ok: false,
      json: async () => ({ errors: [{ message: 'Invalid email address' }] }),
    });

    render(<Contact data={data} />);
    const user = userEvent.setup();

    await user.type(screen.getByLabelText(/name/i), 'Jane Doe');
    await user.type(screen.getByLabelText(/email/i), 'jane@example.com');
    await user.type(screen.getByLabelText(/message/i), 'Hello there!');
    await user.click(screen.getByRole('button', { name: /submit/i }));

    expect(await screen.findByText('Invalid email address')).toBeInTheDocument();
  });

  it('shows a generic error message when the response body cannot be parsed', async () => {
    global.fetch.mockResolvedValueOnce({
      ok: false,
      json: async () => {
        throw new Error('bad json');
      },
    });

    render(<Contact data={data} />);
    const user = userEvent.setup();

    await user.type(screen.getByLabelText(/name/i), 'Jane Doe');
    await user.type(screen.getByLabelText(/email/i), 'jane@example.com');
    await user.type(screen.getByLabelText(/message/i), 'Hello there!');
    await user.click(screen.getByRole('button', { name: /submit/i }));

    expect(
      await screen.findByText(/something went wrong sending your message/i)
    ).toBeInTheDocument();
  });

  it('shows a not-configured error when the Formspree endpoint is missing', async () => {
    vi.resetModules();
    vi.stubEnv('VITE_FORMSPREE_ENDPOINT', '');
    const { default: ContactWithoutEndpoint } = await import('./Contact');

    render(<ContactWithoutEndpoint data={data} />);
    const user = userEvent.setup();

    await user.type(screen.getByLabelText(/name/i), 'Jane Doe');
    await user.type(screen.getByLabelText(/email/i), 'jane@example.com');
    await user.type(screen.getByLabelText(/message/i), 'Hello there!');
    await user.click(screen.getByRole('button', { name: /submit/i }));

    expect(
      await screen.findByText(/contact form is not configured/i)
    ).toBeInTheDocument();
    expect(global.fetch).not.toHaveBeenCalled();

    vi.unstubAllEnvs();
  });

  it('ignores change events for unknown field names', async () => {
    const { container } = render(<Contact data={data} />);
    const nameInput = container.querySelector('#contactName');

    fireEvent.change(nameInput, { target: { name: 'unknownField', value: 'ignored' } });

    expect(nameInput).toHaveValue('');
  });
});
