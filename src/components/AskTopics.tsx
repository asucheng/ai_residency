import { TOPICS } from '../content';

export function AskTopics() {
  return (
    <section id="ask" className="section">
      <div className="container">
        <h2>What you can ask</h2>
        <p className="section-intro">The assistant answers four kinds of questions straight away.</p>
        <ul className="card-grid">
          {TOPICS.map((topic) => (
            <li key={topic.title} className="card">
              <h3>{topic.title}</h3>
              <p>{topic.description}</p>
              <p className="card-example">&ldquo;{topic.example}&rdquo;</p>
            </li>
          ))}
        </ul>
      </div>
    </section>
  );
}
