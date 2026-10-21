import { ANSWER_TOPICS } from '../content';

export function WhatItAnswers() {
  return (
    <section id="answers" className="section section-alt">
      <div className="container">
        <h2>What it answers</h2>
        <p className="section-intro">
          Every assistant learns one store, so its answers are about yours.
        </p>
        <ul className="card-grid">
          {ANSWER_TOPICS.map((topic) => (
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
