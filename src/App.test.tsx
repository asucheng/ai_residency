import { render, screen } from '@testing-library/react';
import { describe, expect, it } from 'vitest';
import App from './App';

describe('App', () => {
  it('renders the main heading', () => {
    render(<App />);
    expect(screen.getByRole('heading', { level: 1 })).toHaveTextContent(
      /answered in seconds/i,
    );
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

  it('links to the waitlist from the header and the hero', () => {
    render(<App />);
    const links = screen.getAllByRole('link', { name: /join the waitlist/i });
    expect(links.length).toBeGreaterThanOrEqual(2);
    for (const link of links) {
      expect(link).toHaveAttribute('href', '#waitlist');
    }
  });

  it('says in the footer that the store is fictional', () => {
    render(<App />);
    expect(screen.getByRole('contentinfo')).toHaveTextContent(/fictional/i);
  });
});
