import { HANDOFF_RULES } from '../content';

export function HumanHandoff() {
  return (
    <section id="handoff" className="section">
      <div className="container narrow">
        <h2>Hands off to you</h2>
        <p className="section-intro">Your assistant emails you, and you make the final call, when:</p>
        <ul className="rule-list">
          {HANDOFF_RULES.map((rule) => (
            <li key={rule.title}>
              <strong>{rule.title}.</strong> {rule.description}
            </li>
          ))}
        </ul>
        <p>The shopper is told their question has been passed on and that you&rsquo;ll reply by email.</p>
      </div>
    </section>
  );
}
