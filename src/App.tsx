import { AskTopics } from './components/AskTopics';
import { Conversations } from './components/Conversations';
import { Footer } from './components/Footer';
import { Header } from './components/Header';
import { Hero } from './components/Hero';
import { HumanHandoff } from './components/HumanHandoff';
import { StaysOnTopic } from './components/StaysOnTopic';
import { WaitlistSection } from './components/WaitlistSection';

export default function App() {
  return (
    <>
      <Header />
      <main>
        <Hero />
        <AskTopics />
        <Conversations />
        <StaysOnTopic />
        <HumanHandoff />
        <WaitlistSection />
      </main>
      <Footer />
    </>
  );
}
