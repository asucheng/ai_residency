import { render, screen } from '@testing-library/react';
import { describe, expect, it } from 'vitest';
import App from './App';

describe('App', () => {
  it('renders the main heading', () => {
    render(<App />);
    expect(screen.getByRole('heading', { level: 1 })).toHaveTextContent(/knows your store/i);
  });

  it('every in-page link points to a section that exists', () => {
    const { container } = render(<App />);
    const hrefs = Array.from(container.querySelectorAll('a[href^="#"]')).map(
      (a) => a.getAttribute('href')!,
    );
    expect(hrefs.length).toBeGreaterThan(0);
    for (const href of hrefs) {
      expect(container.querySelector(href), `missing target for ${href}`).not.toBeNull();
    }
  });

  it('links to the quote form from the header, hero and pricing', () => {
    render(<App />);
    const links = screen.getAllByRole('link', { name: /request a quote/i });
    expect(links.length).toBeGreaterThanOrEqual(3);
    for (const link of links) {
      expect(link).toHaveAttribute('href', '#quote');
    }
  });

  it('says in the footer that this is a demo project', () => {
    render(<App />);
    expect(screen.getByRole('contentinfo')).toHaveTextContent(/demo project/i);
  });
});
