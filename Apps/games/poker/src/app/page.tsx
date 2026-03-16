'use client';

import Link from 'next/link';
import { useGame } from '@/contexts/GameContext';
import { GameSetup } from '@/components/GameSetup';
import { PokerTable } from '@/components/PokerTable';
import { EasyPokerTable } from '@/components/EasyPokerTable';

export default function Home() {
  const { state } = useGame();

  return (
    <main className="min-h-screen p-4 md:p-6 lg:p-8">
      <header className="mb-8 flex flex-wrap items-center justify-between gap-4 border-b border-slate-600/80 pb-5">
        <h1 className="text-2xl font-bold tracking-tight text-emerald-400 drop-shadow-sm md:text-3xl">
          Poker Assistant
        </h1>
        <nav className="flex flex-wrap items-center gap-2">
          <Link
            href="/rules"
            className="rounded-xl border border-slate-600 bg-slate-800/60 px-4 py-2 text-sm font-medium text-slate-200 transition hover:border-slate-500 hover:bg-slate-700/80"
          >
            Rules of poker
          </Link>
          <Link
            href="/rules/easy"
            className="rounded-xl border border-slate-600 bg-slate-800/60 px-4 py-2 text-sm font-medium text-slate-200 transition hover:border-slate-500 hover:bg-slate-700/80"
          >
            Easy poker rules
          </Link>
          <Link
            href="/how-it-works"
            className="rounded-xl border border-slate-600 bg-slate-800/60 px-4 py-2 text-sm font-medium text-slate-200 transition hover:border-slate-500 hover:bg-slate-700/80"
          >
            How the app works
          </Link>
          {state.started && (
            <span className="badge rounded-lg bg-slate-700/80 px-3 py-1.5 text-slate-200">
              {state.mode === 'easy' ? 'Easy' : 'Standard'} · Hand #{state.table.handNumber}
            </span>
          )}
        </nav>
      </header>

      {!state.started ? (
        <GameSetup />
      ) : state.mode === 'easy' ? (
        <EasyPokerTable />
      ) : (
        <PokerTable />
      )}
    </main>
  );
}
