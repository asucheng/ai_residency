import { BRAND_NAME } from '../content';

export function Hero() {
  return (
    <section id="top" className="hero">
      <div className="container">
        <h1>Customer support that knows your store.</h1>
        <p>
          {BRAND_NAME} builds an AI assistant around your products, brand and policies. It answers
          shoppers instantly, so you can cut your support workload without growing your team.
        </p>
        <div className="hero-actions">
          <a href="#quote" className="button">
            Request a quote
          </a>
          <a href="#how" className="button button-secondary">
            See how it works
          </a>
        </div>
      </div>
    </section>
  );
}
