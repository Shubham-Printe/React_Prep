import Link from 'next/link';

export const metadata = {
  title: 'How the app works | Poker Assistant',
  description: 'How to use the Poker Assistant to track chips and bets.',
};

export default function HowItWorksPage() {
  return (
    <main className="min-h-screen p-4 md:p-6">
      <header className="mb-6 flex items-center justify-between border-b border-slate-700 pb-4">
        <h1 className="text-xl font-bold tracking-tight text-emerald-400">
          Poker Assistant
        </h1>
        <nav className="flex items-center gap-2">
          <Link
            href="/rules"
            className="rounded-lg border border-slate-600 px-3 py-1.5 text-sm text-slate-300 hover:bg-slate-800"
          >
            Rules of poker
          </Link>
          <Link
            href="/"
            className="rounded-lg border border-slate-600 px-3 py-1.5 text-sm text-slate-300 hover:bg-slate-800"
          >
            ← Back to game
          </Link>
        </nav>
      </header>

      <div className="mx-auto max-w-3xl space-y-10">
        <section>
          <h2 className="mb-3 text-lg font-semibold text-slate-200">
            What this app does
          </h2>
          <p className="text-slate-300 leading-relaxed">
            You play with <strong className="text-slate-100">physical cards</strong> and
            real people. This app only tracks <strong className="text-slate-100">chips</strong>:
            who has how much, who bet how much this round, and the pot size. No chips
            needed at the table—everything is on screen.
          </p>
        </section>

        <section>
          <h2 className="mb-3 text-lg font-semibold text-slate-200">
            Setup
          </h2>
          <p className="mb-3 text-slate-300">
            Before starting a game, configure the table and rules:
          </p>
          <ul className="list-disc space-y-2 pl-5 text-slate-300">
            <li><strong className="text-slate-100">Rules</strong> — Choose game variant (Texas Hold’em or Omaha), set small blind, big blind, and minimum raise.</li>
            <li><strong className="text-slate-100">Players</strong> — Enter number of players (2–10), optional names, and starting stack per player.</li>
            <li>Tap <strong className="text-slate-100">Start game</strong> to begin. The app posts the first small and big blind and sets the dealer (button).</li>
          </ul>
        </section>

        <section>
          <h2 className="mb-3 text-lg font-semibold text-slate-200">
            During a hand
          </h2>
          <ul className="space-y-2 text-slate-300">
            <li><strong className="text-slate-100">Pot & street</strong> — The top bar shows the current pot size and which street you’re on (Pre-flop, Flop, Turn, River, Showdown). Use “Next street” when everyone has finished betting for that round (you deal the cards yourself).</li>
            <li><strong className="text-slate-100">Player cards</strong> — Each player row shows their stack, their bet this street, and badges (D = dealer, SB = small blind, BB = big blind, Folded if they folded). The player whose turn it is is highlighted.</li>
            <li><strong className="text-slate-100">Actions</strong> — For the active player you can: <strong className="text-slate-100">Fold</strong>, <strong className="text-slate-100">Check</strong> (when no bet to call), <strong className="text-slate-100">Call</strong> (match current bet), or enter an amount and tap <strong className="text-slate-100">Bet / Raise</strong>. The app moves action to the next player after each action.</li>
            <li><strong className="text-slate-100">New hand</strong> — After a hand ends, tap “New hand” to move the button, post blinds for the next hand, and reset bets for the new street. You decide who won the pot; the app does not evaluate hands.</li>
          </ul>
        </section>

        <section>
          <h2 className="mb-3 text-lg font-semibold text-slate-200">
            Back to setup
          </h2>
          <p className="text-slate-300">
            Use <strong className="text-slate-100">Back to setup</strong> to change the
            number of players, names, starting stacks, or rules. This clears the current
            game and returns you to the setup screen.
          </p>
        </section>
      </div>
    </main>
  );
}
