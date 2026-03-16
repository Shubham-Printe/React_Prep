import type { Metadata } from 'next';
import { Outfit } from 'next/font/google';
import './globals.css';
import { GameProvider } from '@/contexts/GameContext';

const outfit = Outfit({
  subsets: ['latin'],
  variable: '--font-sans',
  display: 'swap',
});

export const metadata: Metadata = {
  title: 'Poker Assistant',
  description: 'Track chips, bets, and pot when playing poker with physical cards.',
};

export default function RootLayout({
  children,
}: Readonly<{ children: React.ReactNode }>) {
  return (
    <html lang="en" className={outfit.variable}>
      <body className="min-h-screen bg-slate-900 text-slate-100">
        <GameProvider>{children}</GameProvider>
      </body>
    </html>
  );
}
