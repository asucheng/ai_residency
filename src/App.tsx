import { Conversations } from './components/Conversations';
import { Footer } from './components/Footer';
import { Header } from './components/Header';
import { Hero } from './components/Hero';
import { HowItWorks } from './components/HowItWorks';
import { HumanHandoff } from './components/HumanHandoff';
import { Pricing } from './components/Pricing';
import { QuoteSection } from './components/QuoteSection';
import { StaysOnTopic } from './components/StaysOnTopic';
import { WhatItAnswers } from './components/WhatItAnswers';

export default function App() {
  return (
    <>
      <Header />
      <main>
        <Hero />
        <HowItWorks />
        <WhatItAnswers />
        <Conversations />
        <StaysOnTopic />
        <HumanHandoff />
        <Pricing />
        <QuoteSection />
      </main>
      <Footer />
    </>
  );
}
