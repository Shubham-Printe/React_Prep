import Link from 'next/link';

export const metadata = {
  title: 'Easy poker rules | Poker Assistant',
  description: 'How to play easy poker: one blind, three betting rounds, fixed bet, no raises.',
};

export default function EasyPokerRulesPage() {
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
            Standard rules
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
            What is easy poker?
          </h2>
          <p className="text-slate-300 leading-relaxed">
            Easy poker uses the same cards, hand rankings, and <strong className="text-slate-100">betting
            strategy</strong> as standard (check, call, bet, raise; min-raise and max
            raises per street). The only simplification is <strong className="text-slate-100">one blind</strong> at
            the start (everyone posts the same amount) and <strong className="text-slate-100">three betting
            rounds</strong> instead of small/big blind and four rounds.
          </p>
        </section>

        <section>
          <h2 className="mb-3 text-lg font-semibold text-slate-200">
            Flow of a hand (1 blind + 3 betting rounds)
          </h2>
          <p className="mb-3 text-slate-300">
            Each hand has <strong className="text-slate-100">one blind</strong> (everyone
            puts in the same amount before any cards), then{' '}
            <strong className="text-slate-100">three betting rounds</strong>. After
            that, if more than one player is still in, you have a showdown and decide
            the winner.
          </p>
          <ol className="list-decimal space-y-3 pl-5 text-slate-300">
            <li>
              <strong className="text-slate-100">Blind</strong> — Before any cards are
              dealt, <strong className="text-slate-100">everyone</strong> puts in the
              agreed blind (e.g. 1 chip). This builds the pot from the start. The
              dealer (button) still rotates each hand so the order of play changes.
            </li>
            <li>
              <strong className="text-slate-100">Pre-flop</strong> — Deal two hole
              cards to each player. First betting round: the same betting strategy as
              standard applies. In turn, each player can <strong className="text-slate-100">fold</strong>,{' '}
              <strong className="text-slate-100">check</strong> (if no one has bet yet),{' '}
              <strong className="text-slate-100">call</strong> (match the current bet), or{' '}
              <strong className="text-slate-100">bet / raise</strong>. The minimum raise
              equals the blind amount. Max raises per street is set in the app (unlimited,
              same as players, or half of players). The player to the left of the dealer
              acts first.
            </li>
            <li>
              <strong className="text-slate-100">Flop</strong> — Deal three community
              cards. Second betting round: same options — fold, check, call, bet, or raise.
            </li>
            <li>
              <strong className="text-slate-100">Turn &amp; river</strong> — Deal the
              fourth and fifth community cards (so all five are out). Third and final
              betting round: same — fold, check, call, bet, or raise.
            </li>
            <li>
              <strong className="text-slate-100">Showdown</strong> — If more than one
              player is still in, they show their cards. The best five-card hand (from
              hole cards + board) wins the pot. If only one player is left (everyone
              else folded), that player wins without showing.
            </li>
          </ol>
          <p className="mt-3 text-slate-400 text-sm">
            So in total: <strong className="text-slate-100">1 blind + 3 betting rounds</strong> (pre-flop, after flop, after turn &amp; river), then showdown.
          </p>
        </section>

        <section>
          <h2 className="mb-3 text-lg font-semibold text-slate-200">
            Hand rankings (highest to lowest)
          </h2>
          <p className="mb-3 text-slate-400 text-sm">
            Same as standard poker. Use your best five cards (from your hole cards and
            the board). Ace can be high or low in a straight.
          </p>
          <ol className="list-decimal space-y-1 pl-5 text-slate-300 text-sm">
            <li><strong className="text-slate-100">Royal flush</strong> — A, K, Q, J, 10 same suit</li>
            <li><strong className="text-slate-100">Straight flush</strong> — Five in a row, same suit</li>
            <li><strong className="text-slate-100">Four of a kind</strong></li>
            <li><strong className="text-slate-100">Full house</strong> — Three + pair</li>
            <li><strong className="text-slate-100">Flush</strong> — Five same suit</li>
            <li><strong className="text-slate-100">Straight</strong> — Five in a row</li>
            <li><strong className="text-slate-100">Three of a kind</strong></li>
            <li><strong className="text-slate-100">Two pair</strong></li>
            <li><strong className="text-slate-100">One pair</strong></li>
            <li><strong className="text-slate-100">High card</strong></li>
          </ol>
        </section>

        <section>
          <h2 className="mb-3 text-lg font-semibold text-slate-200">
            Betting rules (same strategy as standard)
          </h2>
          <p className="mb-3 text-slate-300">
            Easy poker uses the <strong className="text-slate-100">same betting strategy</strong> as
            standard: you can fold, check, call, bet, or raise. The only simplification is
            one blind and three rounds instead of small/big blind and four rounds.
          </p>
          <ul className="space-y-2 text-slate-300">
            <li>
              <strong className="text-slate-100">Blind</strong> — One amount (e.g. 1 chip)
              that everyone posts before any cards. This amount also defines the minimum
              raise in each betting round.
            </li>
            <li>
              <strong className="text-slate-100">Min-raise</strong> — A raise must be at
              least the size of the blind above the current bet (min-raise = blind).
            </li>
            <li>
              <strong className="text-slate-100">Max raises per street</strong> — You set
              this in the app: unlimited, same as number of players, or half of players.
              Once that many raises have been made on the current street, only call or
              fold are allowed.
            </li>
          </ul>
        </section>

        <section>
          <h2 className="mb-3 text-lg font-semibold text-slate-200">
            Settlement and “out” in this app
          </h2>
          <p className="text-slate-300 leading-relaxed">
            At showdown the app asks <strong className="text-slate-100">Who won?</strong>{' '}
            You tap the winner. The app uses a single pot: the winner gets the pot; if
            anyone went all-in, the others get back their{' '}
            <strong className="text-slate-100">extra</strong> (what they put in above
            the all-in amount). Anyone who loses and has 0 stack is{' '}
            <strong className="text-slate-100">out of the game</strong> and is skipped
            for the next hands until you reset.
          </p>
        </section>

        <section>
          <h2 className="mb-3 text-lg font-semibold text-slate-200">
            Terms
          </h2>
          <dl className="space-y-2 text-slate-300">
            <div>
              <dt className="font-medium text-slate-100">Blind</dt>
              <dd className="pl-4">In easy poker, the amount everyone puts in before any cards are dealt. Same amount for all; no small or big blind.</dd>
            </div>
            <div>
              <dt className="font-medium text-slate-100">Pot</dt>
              <dd className="pl-4">All chips bet in the hand. The winner takes the pot (after the app settles any all-in refunds).</dd>
            </div>
            <div>
              <dt className="font-medium text-slate-100">Stack</dt>
              <dd className="pl-4">Chips in front of you that aren’t in the pot yet.</dd>
            </div>
            <div>
              <dt className="font-medium text-slate-100">Dealer (button)</dt>
              <dd className="pl-4">Moves one seat left each hand. The player to the left of the dealer acts first each betting round.</dd>
            </div>
            <div>
              <dt className="font-medium text-slate-100">Fold / Check / Call / Bet / Raise</dt>
              <dd className="pl-4">Same as standard poker: fold (quit the hand), check (bet nothing when no one has bet), call (match the current bet), bet or raise (put in more; min-raise = blind, max raises per street as set in the app).</dd>
            </div>
          </dl>
        </section>

        <p className="text-slate-400 text-sm">
          When you’re comfortable with easy poker, try{' '}
          <Link href="/rules" className="text-emerald-400 underline hover:no-underline">
            standard poker
          </Link>{' '}
          for small/big blinds and raises.
        </p>
      </div>
    </main>
  );
}
