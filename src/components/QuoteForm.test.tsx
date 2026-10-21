import { act, fireEvent, render, screen } from '@testing-library/react';
import userEvent, { type UserEvent } from '@testing-library/user-event';
import { describe, expect, it, vi } from 'vitest';
import { ERRORS } from '../lib/quoteRequest';
import { SUBMIT_ERROR_MESSAGE, type QuotePayload, type SubmitResult } from '../lib/submitQuote';
import { QuoteForm } from './QuoteForm';

type Submit = (payload: QuotePayload) => Promise<SubmitResult>;

function setup(submit = vi.fn<Submit>(() => Promise.resolve({ ok: true }))) {
  const user = userEvent.setup();
  render(<QuoteForm submit={submit} />);
  return { user, submit, button: screen.getByRole('button', { name: /request a quote/i }) };
}

async function fillValid(user: UserEvent) {
  await user.type(screen.getByLabelText('Contact email'), '  Owner@Shop.com ');
  await user.type(screen.getByLabelText('Store URL'), 'myshop.com');
  await user.type(screen.getByLabelText('What you sell'), 'Candles');
  await user.click(screen.getByRole('checkbox', { name: 'Email' }));
  await user.click(screen.getByRole('checkbox', { name: 'Live chat' }));
}

describe('QuoteForm', () => {
  it('shows field errors, focuses the first one, and does not submit an empty form', async () => {
    const { user, submit, button } = setup();
    await user.click(button);
    expect(screen.getByText(ERRORS.email)).toBeInTheDocument();
    expect(screen.getByText(ERRORS.storeUrl)).toBeInTheDocument();
    expect(screen.getByText(ERRORS.productTypeMissing)).toBeInTheDocument();
    expect(screen.getByText(ERRORS.channelsMissing)).toBeInTheDocument();
    expect(screen.getByLabelText('Contact email')).toHaveFocus();
    expect(screen.getByLabelText('Contact email')).toHaveAttribute('aria-invalid', 'true');
    expect(submit).not.toHaveBeenCalled();
  });

  it('shows the other-channel field only when Other is ticked', async () => {
    const { user } = setup();
    expect(screen.queryByLabelText('Which other channel?')).not.toBeInTheDocument();
    await user.click(screen.getByRole('checkbox', { name: 'Other' }));
    expect(screen.getByLabelText('Which other channel?')).toBeInTheDocument();
  });

  it('submits normalized answers and shows a thank-you message', async () => {
    const { user, submit, button } = setup();
    await fillValid(user);
    await user.click(button);
    expect(submit).toHaveBeenCalledWith({
      email: 'owner@shop.com',
      storeUrl: 'https://myshop.com',
      productType: 'Candles',
      supportChannels: ['email', 'live_chat'],
      otherChannel: '',
      website: '',
    });
    expect(await screen.findByRole('status')).toHaveTextContent(/we.ll review your store/i);
    expect(screen.queryByLabelText('Contact email')).not.toBeInTheDocument();
  });

  it('disables the button and sends only one request while submitting', async () => {
    let resolve!: (result: SubmitResult) => void;
    const submit = vi.fn<Submit>(
      () =>
        new Promise((r) => {
          resolve = r;
        }),
    );
    const { user, button } = setup(submit);
    await fillValid(user);
    await user.click(button);
    expect(button).toBeDisabled();
    expect(button).toHaveTextContent('Sending…');
    fireEvent.submit(button.closest('form')!);
    expect(submit).toHaveBeenCalledTimes(1);
    await act(async () => resolve({ ok: true }));
    expect(await screen.findByRole('status')).toBeInTheDocument();
  });

  it('shows an error and keeps the answers when sending fails', async () => {
    const submit = vi.fn<Submit>(() =>
      Promise.resolve({ ok: false, message: SUBMIT_ERROR_MESSAGE }),
    );
    const { user, button } = setup(submit);
    await fillValid(user);
    await user.click(button);
    expect(await screen.findByRole('alert')).toHaveTextContent(SUBMIT_ERROR_MESSAGE);
    // Email inputs drop trailing spaces as you type, so compare the trimmed value.
    expect((screen.getByLabelText('Contact email') as HTMLInputElement).value.trim()).toBe(
      'Owner@Shop.com',
    );
    expect(screen.getByRole('checkbox', { name: 'Email' })).toBeChecked();
    expect(button).toBeEnabled();
  });

  it('shows field errors returned by the server', async () => {
    const submit = vi.fn<Submit>(() =>
      Promise.resolve({
        ok: false,
        message: 'Please fix the highlighted fields.',
        errors: { storeUrl: 'We could not use that store address.' },
      }),
    );
    const { user, button } = setup(submit);
    await fillValid(user);
    await user.click(button);
    expect(await screen.findByText('We could not use that store address.')).toBeInTheDocument();
    expect(screen.getByLabelText('Store URL')).toHaveFocus();
  });
});
