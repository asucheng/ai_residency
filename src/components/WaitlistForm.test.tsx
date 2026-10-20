import { act, fireEvent, render, screen } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { describe, expect, it, vi } from 'vitest';
import type { WaitlistResult } from '../lib/waitlist';
import { WaitlistForm } from './WaitlistForm';

type Submit = (email: string) => Promise<WaitlistResult>;

function setup(submit = vi.fn<Submit>(() => Promise.resolve({ ok: true }))) {
  const user = userEvent.setup();
  render(<WaitlistForm submit={submit} />);
  return {
    user,
    submit,
    input: screen.getByLabelText(/email address/i),
    button: screen.getByRole('button', { name: /join/i }),
  };
}

describe('WaitlistForm', () => {
  it('shows an inline error and does not submit an invalid email', async () => {
    const { user, submit, input, button } = setup();
    await user.type(input, 'not-an-email');
    await user.click(button);
    expect(screen.getByRole('alert')).toHaveTextContent('Please enter a valid email address.');
    expect(input).toHaveAttribute('aria-invalid', 'true');
    expect(submit).not.toHaveBeenCalled();
  });

  it('submits the normalized email and shows a success message', async () => {
    const { user, submit, input, button } = setup();
    await user.type(input, '  Ana@Example.com ');
    await user.click(button);
    expect(submit).toHaveBeenCalledWith('ana@example.com');
    expect(await screen.findByRole('status')).toHaveTextContent(/you.re on the list/i);
    expect(screen.queryByLabelText(/email address/i)).not.toBeInTheDocument();
  });

  it('disables the button and sends only one request while submitting', async () => {
    let resolve!: (result: WaitlistResult) => void;
    const submit = vi.fn<Submit>(
      () =>
        new Promise((r) => {
          resolve = r;
        }),
    );
    const { user, input, button } = setup(submit);
    await user.type(input, 'ana@example.com');
    await user.click(button);
    expect(button).toBeDisabled();
    expect(button).toHaveTextContent('Joining…');
    fireEvent.submit(input.closest('form')!);
    expect(submit).toHaveBeenCalledTimes(1);
    await act(async () => resolve({ ok: true }));
    expect(await screen.findByRole('status')).toBeInTheDocument();
  });

  it('shows the error and keeps the typed email when submission fails', async () => {
    const submit = vi.fn<Submit>(() =>
      Promise.resolve({ ok: false, message: 'Something went wrong. Please try again.' }),
    );
    const { user, input, button } = setup(submit);
    await user.type(input, 'ana@example.com');
    await user.click(button);
    expect(await screen.findByRole('alert')).toHaveTextContent('Something went wrong. Please try again.');
    expect(input).toHaveValue('ana@example.com');
    expect(button).toBeEnabled();
  });
});
