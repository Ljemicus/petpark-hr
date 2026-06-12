import { Metadata } from 'next';
import { AIMatchingContent } from './ai-matching-content';

export const metadata: Metadata = {
  title: 'AI Pronalaženje Čuvara',
  description: 'Naš AI uspoređuje iskustvo, ocjene, vrijeme odgovora i lokaciju kako bi predložio prikladne čuvare za vašeg ljubimca.',
  openGraph: {
    title: 'AI Pronalaženje Čuvara',
    description: 'Pronađite prikladnog čuvara uz pomoć umjetne inteligencije.',
  },
};

export default function AIMatchingPage() {
  return <AIMatchingContent />;
}
