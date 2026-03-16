import Link from 'next/link';

export const metadata = {
  title: 'Rules of poker | Poker Assistant',
  description: 'How poker is played: hand rankings, betting, and flow of the game.',
};

export default function RulesPage() {
  return (
    <main className="min-h-screen p-4 md:p-6">
      <header className="mb-6 flex items-center justify-between border-b border-slate-700 pb-4">
        <h1 className="text-xl font-bold tracking-tight text-emerald-400">
          Poker Assistant
        </h1>
        <nav className="flex items-center gap-2">
          <Link
            href="/rules/easy"
            className="rounded-lg border border-slate-600 px-3 py-1.5 text-sm text-slate-300 hover:bg-slate-800"
          >
            Easy poker rules
          </Link>
          <Link
            href="/how-it-works"
            className="rounded-lg border border-slate-600 px-3 py-1.5 text-sm text-slate-300 hover:bg-slate-800"
          >
            How the app works
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
            What is poker?
          </h2>
          <p className="text-slate-300 leading-relaxed">
            Poker is a card game where players bet on who has the best hand (or who can
            make others fold). You win by having the highest-ranked hand at showdown, or
            by being the last player left after everyone else folds. Games usually use
            chips to represent money; the pot is the total of all bets in that hand.
          </p>
        </section>

        <section>
          <h2 className="mb-3 text-lg font-semibold text-slate-200">
            Hand rankings (highest to lowest)
          </h2>
          <p className="mb-3 text-slate-400 text-sm">
            Standard order for high hands. Ace can be high or low in a straight (e.g. A-2-3-4-5).
          </p>
          <ol className="list-decimal space-y-2 pl-5 text-slate-300">
            <li><strong className="text-slate-100">Royal flush</strong> — A, K, Q, J, 10 of the same suit.</li>
            <li><strong className="text-slate-100">Straight flush</strong> — Five consecutive cards of the same suit (e.g. 9-8-7-6-5 of hearts).</li>
            <li><strong className="text-slate-100">Four of a kind</strong> — Four cards of the same rank (e.g. four kings).</li>
            <li><strong className="text-slate-100">Full house</strong> — Three of a kind plus a pair (e.g. three 7s and two 4s).</li>
            <li><strong className="text-slate-100">Flush</strong> — Five cards of the same suit, not in sequence.</li>
            <li><strong className="text-slate-100">Straight</strong> — Five consecutive cards of mixed suits (e.g. 10-9-8-7-6).</li>
            <li><strong className="text-slate-100">Three of a kind</strong> — Three cards of the same rank.</li>
            <li><strong className="text-slate-100">Two pair</strong> — Two different pairs (e.g. K-K and 5-5).</li>
            <li><strong className="text-slate-100">One pair</strong> — Two cards of the same rank.</li>
            <li><strong className="text-slate-100">High card</strong> — No pair; highest card wins (then next highest if tied, etc.).</li>
          </ol>
        </section>

        <section>
          <h2 className="mb-3 text-lg font-semibold text-slate-200">
            Flow of a hand (e.g. Texas Hold’em)
          </h2>
          <p className="mb-3 text-slate-300">
            Each hand has forced bets (blinds), then several betting rounds as community
            cards are revealed. Players use their hole cards plus the board to make the
            best five-card hand.
          </p>
          <ol className="list-decimal space-y-3 pl-5 text-slate-300">
            <li>
              <strong className="text-slate-100">Blinds</strong> — Before any cards, the
              player to the left of the dealer posts the small blind, and the next player
              posts the big blind. These are forced bets so there is always something to
              play for.
            </li>
            <li>
              <strong className="text-slate-100">Pre-flop</strong> — Each player gets
              their hole cards (e.g. two cards in Texas Hold’em). First to act is the
              player to the left of the big blind. Betting goes clockwise. Players can
              fold, call (match the big blind), or raise.
            </li>
            <li>
              <strong className="text-slate-100">Flop</strong> — The dealer burns one
              card and deals three community cards face up. Another betting round; the
              player to the left of the dealer (first still in the hand) acts first.
              Players can check (bet zero) if no one has bet yet, or bet, call, raise, or
              fold.
            </li>
            <li>
              <strong className="text-slate-100">Turn</strong> — One more community card
              is dealt (four total). Another betting round, same options.
            </li>
            <li>
              <strong className="text-slate-100">River</strong> — The fifth and final
              community card is dealt. Final betting round.
            </li>
            <li>
              <strong className="text-slate-100">Showdown</strong> — If more than one
              player remains, they show their cards. The best five-card hand (using any
              combination of hole and community cards) wins the pot. If only one player
              is left (everyone else folded), that player wins without showing.
            </li>
          </ol>
        </section>

        <section>
          <h2 className="mb-3 text-lg font-semibold text-slate-200">
            Betting actions
          </h2>
          <dl className="space-y-2 text-slate-300">
            <div>
              <dt className="font-medium text-slate-100">Fold</dt>
              <dd className="pl-4">Give up your hand and sit out for the rest of that hand. You lose any chips you already put in.</dd>
            </div>
            <div>
              <dt className="font-medium text-slate-100">Check</dt>
              <dd className="pl-4">Bet nothing for now. Only allowed when no one has bet in the current round.</dd>
            </div>
            <div>
              <dt className="font-medium text-slate-100">Call</dt>
              <dd className="pl-4">Match the current bet to stay in the hand.</dd>
            </div>
            <div>
              <dt className="font-medium text-slate-100">Bet</dt>
              <dd className="pl-4">Put chips in when no one has bet yet this round (you open the betting).</dd>
            </div>
            <div>
              <dt className="font-medium text-slate-100">Raise</dt>
              <dd className="pl-4">Bet more than the current bet. A raise must be at least the size of the big blind above the previous bet (min-raise = BB). Others must at least call your raise to stay in. Re-raises are allowed until the max raises per street is reached (see below).</dd>
            </div>
          </dl>
        </section>

        <section>
          <h2 className="mb-3 text-lg font-semibold text-slate-200">
            Rules used in this app (standard poker)
          </h2>
          <p className="mb-3 text-slate-300">
            The app applies these rules so you can set up the table once and play consistently.
          </p>
          <ul className="space-y-2 text-slate-300">
            <li>
              <strong className="text-slate-100">Min-raise = big blind</strong> — The minimum raise is always equal to the big blind. You can’t raise by less (e.g. if BB is 2, a raise must add at least 2 to the current bet).
            </li>
            <li>
              <strong className="text-slate-100">Max raises per street</strong> — You choose one: <strong className="text-slate-100">Unlimited</strong>, <strong className="text-slate-100">Same as number of players</strong>, or <strong className="text-slate-100">Half of players</strong>. Once that many raises have been made on the current street, no one can raise anymore; only call or fold.
            </li>
            <li>
              <strong className="text-slate-100">Single pot</strong> — There is only one pot. No side pots. At showdown you pick the winner; the app distributes the pot and any “extra” (see All-in below).
            </li>
            <li>
              <strong className="text-slate-100">All-in and settlement</strong> — If someone goes all-in (bets their whole stack), the app still uses one pot. When you pick the winner at showdown: the winner gets the pot (minus any refunds). Each other player who was in the hand gets back their <strong className="text-slate-100">extra</strong> — the amount they put in above the smallest total bet in the hand. Example: A, B (20 all-in), C (folded), D each put 20; B wins and gets 80; A, C, D get 0 back (no extra). If someone had put 50, they’d get 30 back.
            </li>
            <li>
              <strong className="text-slate-100">Out of the game</strong> — If a player loses and their stack is 0 (e.g. they went all-in and lost), they are out. They no longer get dealt in or post blinds; the button and blinds skip them until the game is reset.
            </li>
          </ul>
        </section>

        <section>
          <h2 className="mb-3 text-lg font-semibold text-slate-200">
            Common terms
          </h2>
          <dl className="space-y-2 text-slate-300">
            <div>
              <dt className="font-medium text-slate-100">Button (dealer)</dt>
              <dd className="pl-4">A marker that moves clockwise each hand. The player with the button is the “dealer” for that hand; they act last post-flop. Blinds are posted by the players to the left of the button. Players who are out are skipped.</dd>
            </div>
            <div>
              <dt className="font-medium text-slate-100">Small blind (SB) / Big blind (BB)</dt>
              <dd className="pl-4">Forced bets before the cards are dealt. The big blind is usually double the small blind and is the minimum bet pre-flop. In this app, min-raise equals the big blind.</dd>
            </div>
            <div>
              <dt className="font-medium text-slate-100">Pot</dt>
              <dd className="pl-4">All the chips bet in the current hand (one pot only). At showdown you pick the winner; the app gives them the pot and returns any “extra” to others if there was an all-in.</dd>
            </div>
            <div>
              <dt className="font-medium text-slate-100">Stack</dt>
              <dd className="pl-4">The chips a player has in front of them, not yet in the pot.</dd>
            </div>
            <div>
              <dt className="font-medium text-slate-100">All-in</dt>
              <dd className="pl-4">Betting your entire stack. In this app there is a single pot: the winner takes it; others get back any amount they put in above the all-in amount. If you lose with 0 stack, you’re out of the game.</dd>
            </div>
          </dl>
        </section>

        <section>
          <h2 className="mb-3 text-lg font-semibold text-slate-200">
            Variants
          </h2>
          <p className="text-slate-300 leading-relaxed">
            <strong className="text-slate-100">Texas Hold’em</strong> — Each player gets two hole cards; five community cards are dealt (flop, turn, river). You make the best five-card hand from any combination of your two and the five on the board. Most common for cash games and tournaments.
          </p>
          <p className="mt-2 text-slate-300 leading-relaxed">
            <strong className="text-slate-100">Omaha</strong> — Each player gets four hole cards. You must use exactly two of them plus exactly three community cards to make your best five-card hand. Betting structure is often pot-limit.
          </p>
          <p className="mt-2 text-slate-300 leading-relaxed">
            <strong className="text-slate-100">Short deck (6+)</strong> — Played with 36 cards (no 2–5). Flush usually ranks above full house in many house rules. Hand rankings and sometimes betting rules differ; agree before you play.
          </p>
        </section>

        <section>
          <h2 className="mb-3 text-lg font-semibold text-slate-200">
            Easy poker
          </h2>
          <p className="text-slate-300 leading-relaxed">
            Easy poker uses the same cards, hand rankings, and <strong className="text-slate-100">betting
            strategy</strong> (check, call, bet, raise; min-raise and max raises per street).
            Simplifications: <strong className="text-slate-100">one blind</strong> (everyone posts) and{' '}
            <strong className="text-slate-100">three betting rounds</strong> (pre-flop, after flop,
            after turn &amp; river). Great for beginners.
          </p>
          <p className="mt-2">
            <Link
              href="/rules/easy"
              className="text-emerald-400 underline hover:no-underline"
            >
              Read the full easy poker rules →
            </Link>
          </p>
        </section>
      </div>
    </main>
  );
}
