import { HANDOFF_RULES } from '../content';

export function HumanHandoff() {
  return (
    <section id="handoff" className="section section-alt">
      <div className="container narrow">
        <h2>When a human steps in</h2>
        <p className="section-intro">
          The assistant emails the store owner, who makes the final call, when:
        </p>
        <ul className="rule-list">
          {HANDOFF_RULES.map((rule) => (
            <li key={rule.title}>
              <strong>{rule.title}.</strong> {rule.description}
            </li>
          ))}
        </ul>
        <p>The shopper is told their question has been passed on and that the owner will reply by email.</p>
      </div>
    </section>
  );
}
