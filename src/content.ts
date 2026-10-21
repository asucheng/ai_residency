export type NavLink = { href: string; label: string };
export type Step = { title: string; description: string };
export type Topic = { title: string; description: string; example: string };
export type ChatMessage = { from: 'shopper' | 'assistant'; text: string };
export type Conversation = { id: string; store: string; label: string; messages: ChatMessage[] };
export type HandoffRule = { title: string; description: string };

export const BRAND_NAME = 'StoreSidekick';

export const NAV_LINKS: NavLink[] = [
  { href: '#how', label: 'How it works' },
  { href: '#answers', label: 'What it answers' },
  { href: '#examples', label: 'Examples' },
  { href: '#pricing', label: 'Pricing' },
];

export const STEPS: Step[] = [
  {
    title: 'Tell us about your store',
    description: 'Share your store URL, what you sell, and where customers reach you today.',
  },
  {
    title: 'We build your assistant',
    description: 'We shape it around your products, your brand voice and your store policies.',
  },
  {
    title: 'It handles the routine',
    description:
      'Shoppers get instant answers. Anything unusual, or anything involving money, comes to you.',
  },
];

export const ANSWER_TOPICS: Topic[] = [
  {
    title: 'Your products',
    description: 'Sizes, materials, compatibility, and which product suits which customer.',
    example: 'Will this harness fit a 30 kg dog?',
  },
  {
    title: 'Your brand',
    description: 'Your story, values and standards, told in your voice.',
    example: 'Are your products cruelty-free?',
  },
  {
    title: 'Your policies',
    description: 'Shipping times, returns and exchanges, exactly as your store sets them.',
    example: 'Can I return an opened item?',
  },
];

export const CONVERSATIONS: Conversation[] = [
  {
    id: 'product',
    store: 'Pet toy store',
    label: 'A product question',
    messages: [
      { from: 'shopper', text: 'Is the rope tug toy okay for a heavy chewer?' },
      {
        from: 'assistant',
        text: "Yes. It's double-braided cotton rope rated for strong chewers. For dogs over 30 kg, go for the XL size.",
      },
    ],
  },
  {
    id: 'policy',
    store: 'Skincare store',
    label: 'A policy question',
    messages: [
      { from: 'shopper', text: "Can I return a moisturiser I've opened?" },
      {
        from: 'assistant',
        text: 'Yes, within 30 days of delivery, even if it has been opened. Start a return from the link in your order email.',
      },
    ],
  },
  {
    id: 'off-topic',
    store: 'Outdoor gear store',
    label: 'An off-topic request',
    messages: [
      { from: 'shopper', text: 'Can you help me write my history essay?' },
      {
        from: 'assistant',
        text: 'Sorry, I can only help with our gear, orders and store policies. Are you shopping for anything in particular?',
      },
    ],
  },
  {
    id: 'refund',
    store: 'Pet toy store',
    label: 'A refund request',
    messages: [
      { from: 'shopper', text: 'My order arrived damaged. Can I get a refund?' },
      {
        from: 'assistant',
        text: "I'm sorry it arrived damaged. Refunds are decided by the store owner, so I've emailed them your details. They'll reply to the email on your order within one business day.",
      },
    ],
  },
];

export const ON_TOPIC_SUBJECTS: string[] = [
  'Your products and how to choose them',
  'Orders, shipping and delivery',
  'Your brand and what it stands for',
  'Returns and store policies',
];

export const HANDOFF_RULES: HandoffRule[] = [
  {
    title: "It isn't sure of the answer",
    description:
      "If your store information doesn't clearly answer a question, the assistant says so instead of guessing, and passes it to you.",
  },
  {
    title: 'Money is involved',
    description: 'Refunds, discounts and pricing exceptions are always your decision.',
  },
];
