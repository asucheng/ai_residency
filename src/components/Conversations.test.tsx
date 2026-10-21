import { render, screen, within } from '@testing-library/react';
import { describe, expect, it } from 'vitest';
import { CONVERSATIONS } from '../content';
import { Conversations } from './Conversations';

describe('Conversations', () => {
  it('covers answering, declining and handing off', () => {
    expect(CONVERSATIONS.map((c) => c.id)).toEqual(['product', 'policy', 'off-topic', 'refund']);
  });

  it('comes from more than one kind of store', () => {
    expect(new Set(CONVERSATIONS.map((c) => c.store)).size).toBeGreaterThanOrEqual(3);
  });

  it('shows every conversation with its store and each message in order', () => {
    render(<Conversations />);
    for (const conversation of CONVERSATIONS) {
      const article = screen.getByRole('article', { name: conversation.label });
      expect(article).toHaveTextContent(conversation.store);
      const items = within(article).getAllByRole('listitem');
      expect(items).toHaveLength(conversation.messages.length);
      conversation.messages.forEach((message, i) => {
        expect(items[i]).toHaveTextContent(message.text);
        expect(items[i]).toHaveTextContent(
          message.from === 'shopper' ? 'Shopper:' : 'Assistant:',
        );
      });
    }
  });
});
