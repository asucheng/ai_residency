import { STORE_NAME } from '../content';

export function Hero() {
  return (
    <section id="top" className="hero">
      <div className="container">
        <h1>Pet toy questions, answered in seconds.</h1>
        <p>
          {STORE_NAME}&rsquo;s AI assistant answers shoppers&rsquo; questions about our toys, store,
          brand and policies, day or night. A small shop gets fast support without hiring a
          support team.
        </p>
        <div className="hero-actions">
          <a href="#waitlist" className="button">
            Join the waitlist
          </a>
          <a href="#examples" className="button button-secondary">
            See it in action
          </a>
        </div>
      </div>
    </section>
  );
}
