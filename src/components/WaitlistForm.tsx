import { useRef, useState, type FormEvent } from 'react';
import { isValidEmail, normalizeEmail } from '../lib/email';
import { joinWaitlist, type WaitlistResult } from '../lib/waitlist';

type Props = {
  submit?: (email: string) => Promise<WaitlistResult>;
};

type Status = 'idle' | 'submitting' | 'success';

const INVALID_EMAIL_MESSAGE = 'Please enter a valid email address.';

export function WaitlistForm({ submit = joinWaitlist }: Props) {
  const [email, setEmail] = useState('');
  const [status, setStatus] = useState<Status>('idle');
  const [error, setError] = useState<string | null>(null);
  // State updates are async, so a ref blocks a second submit fired before re-render.
  const inFlight = useRef(false);

  async function handleSubmit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    if (inFlight.current) return;

    const normalized = normalizeEmail(email);
    if (!isValidEmail(normalized)) {
      setError(INVALID_EMAIL_MESSAGE);
      return;
    }

    inFlight.current = true;
    setError(null);
    setStatus('submitting');
    const result = await submit(normalized);
    inFlight.current = false;

    if (result.ok) {
      setStatus('success');
    } else {
      setError(result.message);
      setStatus('idle');
    }
  }

  if (status === 'success') {
    return (
      <p role="status" className="form-success">
        You&rsquo;re on the list! We&rsquo;ll email you when new toys launch.
      </p>
    );
  }

  const submitting = status === 'submitting';

  return (
    <form className="waitlist-form" onSubmit={handleSubmit} noValidate>
      <label htmlFor="waitlist-email">Email address</label>
      <div className="form-row">
        <input
          id="waitlist-email"
          type="email"
          autoComplete="email"
          placeholder="you@example.com"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
          aria-invalid={error ? true : undefined}
          aria-describedby={error ? 'waitlist-error' : undefined}
        />
        <button type="submit" className="button" disabled={submitting}>
          {submitting ? 'Joining…' : 'Join the waitlist'}
        </button>
      </div>
      {error && (
        <p id="waitlist-error" role="alert" className="form-error">
          {error}
        </p>
      )}
    </form>
  );
}
