import { STEPS } from '../content';

export function HowItWorks() {
  return (
    <section id="how" className="section">
      <div className="container">
        <h2>How it works</h2>
        <ol className="steps">
          {STEPS.map((step) => (
            <li key={step.title} className="card step">
              <h3>{step.title}</h3>
              <p>{step.description}</p>
            </li>
          ))}
        </ol>
      </div>
    </section>
  );
}
