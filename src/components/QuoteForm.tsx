import { useRef, useState, type FormEvent } from 'react';
import {
  CHANNEL_OPTIONS,
  FIELD_ORDER,
  validateQuoteRequest,
  type FieldErrors,
  type QuoteField,
  type QuoteRequestInput,
} from '../lib/quoteRequest';
import { submitQuoteRequest, type QuotePayload, type SubmitResult } from '../lib/submitQuote';

type Props = {
  submit?: (payload: QuotePayload) => Promise<SubmitResult>;
};

type Status = 'idle' | 'submitting' | 'success';

const EMPTY: QuoteRequestInput = {
  email: '',
  storeUrl: '',
  productType: '',
  supportChannels: [],
  otherChannel: '',
};

// The element that receives focus when a field has an error.
const FOCUS_IDS: Record<QuoteField, string> = {
  email: 'quote-email',
  storeUrl: 'quote-store-url',
  productType: 'quote-product-type',
  supportChannels: `quote-channel-${CHANNEL_OPTIONS[0].id}`,
  otherChannel: 'quote-other-channel',
};

export function QuoteForm({ submit = submitQuoteRequest }: Props) {
  const [values, setValues] = useState<QuoteRequestInput>(EMPTY);
  const [website, setWebsite] = useState('');
  const [errors, setErrors] = useState<FieldErrors>({});
  const [formError, setFormError] = useState<string | null>(null);
  const [status, setStatus] = useState<Status>('idle');
  // State updates are async, so a ref blocks a second submit fired before re-render.
  const inFlight = useRef(false);

  function update(field: 'email' | 'storeUrl' | 'productType' | 'otherChannel', value: string) {
    setValues((current) => ({ ...current, [field]: value }));
  }

  function toggleChannel(id: string, checked: boolean) {
    setValues((current) => ({
      ...current,
      supportChannels: checked
        ? [...current.supportChannels, id]
        : current.supportChannels.filter((channel) => channel !== id),
    }));
  }

  function showErrors(next: FieldErrors) {
    setErrors(next);
    const first = FIELD_ORDER.find((field) => next[field]);
    if (first) document.getElementById(FOCUS_IDS[first])?.focus();
  }

  async function handleSubmit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    if (inFlight.current) return;
    setFormError(null);

    const result = validateQuoteRequest(values);
    if (!result.ok) {
      showErrors(result.errors);
      return;
    }

    setErrors({});
    inFlight.current = true;
    setStatus('submitting');
    const response = await submit({
      ...result.value,
      otherChannel: result.value.otherChannel ?? '',
      website,
    });
    inFlight.current = false;

    if (response.ok) {
      setStatus('success');
      return;
    }
    setStatus('idle');
    setFormError(response.message);
    if (response.errors) showErrors(response.errors);
  }

  if (status === 'success') {
    return (
      <p role="status" className="form-success">
        Thanks, we&rsquo;ll review your store and email you a quote.
      </p>
    );
  }

  function errorProps(field: QuoteField) {
    return errors[field]
      ? { 'aria-invalid': true as const, 'aria-describedby': `quote-${field}-error` }
      : {};
  }

  function fieldError(field: QuoteField) {
    return errors[field] ? (
      <p id={`quote-${field}-error`} className="field-error">
        {errors[field]}
      </p>
    ) : null;
  }

  const submitting = status === 'submitting';
  const otherTicked = values.supportChannels.includes('other');

  return (
    <form className="quote-form" onSubmit={handleSubmit} noValidate>
      <div className="field">
        <label htmlFor="quote-email">Contact email</label>
        <input
          id="quote-email"
          type="email"
          autoComplete="email"
          value={values.email}
          onChange={(e) => update('email', e.target.value)}
          {...errorProps('email')}
        />
        {fieldError('email')}
      </div>

      <div className="field">
        <label htmlFor="quote-store-url">Store URL</label>
        <input
          id="quote-store-url"
          type="text"
          inputMode="url"
          autoComplete="url"
          placeholder="mystore.com"
          value={values.storeUrl}
          onChange={(e) => update('storeUrl', e.target.value)}
          {...errorProps('storeUrl')}
        />
        {fieldError('storeUrl')}
      </div>

      <div className="field">
        <label htmlFor="quote-product-type">What you sell</label>
        <input
          id="quote-product-type"
          type="text"
          placeholder="e.g. pet toys, skincare, outdoor gear"
          value={values.productType}
          onChange={(e) => update('productType', e.target.value)}
          {...errorProps('productType')}
        />
        {fieldError('productType')}
      </div>

      <fieldset
        className="field"
        aria-describedby={errors.supportChannels ? 'quote-supportChannels-error' : undefined}
      >
        <legend>Support channels you use today</legend>
        <div className="checkbox-grid">
          {CHANNEL_OPTIONS.map((option) => (
            <label key={option.id} className="checkbox">
              <input
                id={`quote-channel-${option.id}`}
                type="checkbox"
                checked={values.supportChannels.includes(option.id)}
                onChange={(e) => toggleChannel(option.id, e.target.checked)}
              />
              {option.label}
            </label>
          ))}
        </div>
        {fieldError('supportChannels')}
      </fieldset>

      {otherTicked && (
        <div className="field">
          <label htmlFor="quote-other-channel">Which other channel?</label>
          <input
            id="quote-other-channel"
            type="text"
            value={values.otherChannel}
            onChange={(e) => update('otherChannel', e.target.value)}
            {...errorProps('otherChannel')}
          />
          {fieldError('otherChannel')}
        </div>
      )}

      <div className="honeypot" aria-hidden="true">
        <label htmlFor="quote-website">Leave this empty</label>
        <input
          id="quote-website"
          type="text"
          tabIndex={-1}
          autoComplete="off"
          value={website}
          onChange={(e) => setWebsite(e.target.value)}
        />
      </div>

      {formError && (
        <p role="alert" className="form-error">
          {formError}
        </p>
      )}

      <button type="submit" className="button" disabled={submitting}>
        {submitting ? 'Sending…' : 'Request a quote'}
      </button>
    </form>
  );
}
