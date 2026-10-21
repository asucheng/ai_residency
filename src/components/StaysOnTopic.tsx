import { ON_TOPIC_SUBJECTS } from '../content';

export function StaysOnTopic() {
  return (
    <section id="on-topic" className="section section-alt">
      <div className="container narrow">
        <h2>Stays on topic</h2>
        <p className="section-intro">Your assistant is there for your shoppers. It talks about:</p>
        <ul className="check-list">
          {ON_TOPIC_SUBJECTS.map((subject) => (
            <li key={subject}>{subject}</li>
          ))}
        </ul>
        <p>
          Anything else, like homework, news or general chat, gets a polite &ldquo;sorry, I can
          only help with the store&rdquo; and a nudge back to what it can help with.
        </p>
      </div>
    </section>
  );
}
