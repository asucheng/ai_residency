import { CONVERSATIONS } from '../content';

export function Conversations() {
  return (
    <section id="examples" className="section section-alt">
      <div className="container">
        <h2>See it in action</h2>
        <p className="section-intro">
          Examples of how the assistant answers, declines, and hands questions to a person.
        </p>
        <div className="conversation-grid">
          {CONVERSATIONS.map((conversation) => (
            <article
              key={conversation.id}
              className="conversation"
              aria-labelledby={`conversation-${conversation.id}`}
            >
              <h3 id={`conversation-${conversation.id}`}>{conversation.label}</h3>
              <ol className="messages">
                {conversation.messages.map((message, i) => (
                  <li key={i} className={`message message-${message.from}`}>
                    <span className="visually-hidden">
                      {message.from === 'shopper' ? 'Shopper: ' : 'Assistant: '}
                    </span>
                    {message.text}
                  </li>
                ))}
              </ol>
            </article>
          ))}
        </div>
      </div>
    </section>
  );
}
