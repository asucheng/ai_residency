export type NavLink = { href: string; label: string };
export type Topic = { title: string; description: string; example: string };
export type ChatMessage = { from: 'shopper' | 'assistant'; text: string };
export type Conversation = { id: string; label: string; messages: ChatMessage[] };
export type HandoffRule = { title: string; description: string };

export const STORE_NAME = 'Wag & Whisker';

export const NAV_LINKS: NavLink[] = [
  { href: '#ask', label: 'What you can ask' },
  { href: '#examples', label: 'Examples' },
  { href: '#on-topic', label: 'Stays on topic' },
  { href: '#handoff', label: 'Human hand-off' },
];

export const TOPICS: Topic[] = [
  {
    title: 'A specific toy',
    description: 'Materials, sizes, durability, and which pets it suits.',
    example: 'Is the Tug Titan safe for a heavy chewer?',
  },
  {
    title: 'The store',
    description: 'Ordering, delivery times, and how to reach us.',
    example: 'How long does delivery take?',
  },
  {
    title: 'Our brand',
    description: 'Who we are and the safety standards our toys meet.',
    example: 'Are your toys made with non-toxic materials?',
  },
  {
    title: 'Policies',
    description: 'Shipping, returns, and exchanges.',
    example: 'Can I return a toy my cat ignored?',
  },
];

export const CONVERSATIONS: Conversation[] = [
  {
    id: 'toy',
    label: 'A toy question',
    messages: [
      { from: 'shopper', text: 'Is the Tug Titan rope toy okay for a heavy chewer?' },
      {
        from: 'assistant',
        text: 'Yes. The Tug Titan is double-braided cotton rope rated for strong chewers. For dogs over 30 kg, go for the XL size, and replace it once it starts to fray.',
      },
    ],
  },
  {
    id: 'policy',
    label: 'A policy question',
    messages: [
      { from: 'shopper', text: 'How long does shipping take?' },
      {
        from: 'assistant',
        text: 'Orders ship within 1 business day and arrive in 3–5 business days. Shipping is free on orders over $35.',
      },
    ],
  },
  {
    id: 'off-topic',
    label: 'An off-topic request',
    messages: [
      { from: 'shopper', text: 'Can you help me write my history essay?' },
      {
        from: 'assistant',
        text: "Sorry, I can only help with Wag & Whisker toys, orders and store policies. Is there a toy I can help you find?",
      },
    ],
  },
  {
    id: 'refund',
    label: 'A refund request',
    messages: [
      { from: 'shopper', text: 'My order arrived damaged. Can I get a refund?' },
      {
        from: 'assistant',
        text: "I'm sorry it arrived damaged. Refunds are decided by our owner, so I've emailed them your details. They'll reply to the email on your order within one business day.",
      },
    ],
  },
];

export const ON_TOPIC_SUBJECTS: string[] = [
  'Our toys and how to choose them',
  'Orders, shipping and delivery',
  'The Wag & Whisker brand',
  'Returns and store policies',
];

export const HANDOFF_RULES: HandoffRule[] = [
  {
    title: "It isn't sure of the answer",
    description:
      "If our store information doesn't clearly answer a question, the assistant says so instead of guessing, and passes it on.",
  },
  {
    title: 'Money is involved',
    description: 'Refunds, discounts and pricing exceptions are always decided by the owner.',
  },
];
