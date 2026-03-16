'use client';

import { useGame } from '@/contexts/GameContext';
import { useState } from 'react';

const STREETS: Record<string, string> = {
  blinds: 'Blinds',
  preflop: 'Pre-flop',
  flop: 'Flop',
  turn: 'Turn',
  river: 'River',
  showdown: 'Showdown',
};

export function PokerTable() {
  const { state, placeBet, check, fold, postBlind, nextStreet, settleHand, newHand, resetGame, getMaxRaises } = useGame();
  const [betAmount, setBetAmount] = useState(state.table.currentMaxBet || state.rules.bigBlind);

  const { players, table, rules } = state;
  const actionIndex = table.actionOnIndex;
  const activePlayer = players[actionIndex];
  const callAmount = activePlayer
    ? Math.min(table.currentMaxBet - activePlayer.currentBet, activePlayer.stack + activePlayer.currentBet)
    : 0;
  const noBetToMatch = callAmount === 0;
  const minBet = rules.bigBlind;
  const minRaiseBy = rules.minRaise;
  const minRaiseTotal = table.currentMaxBet + minRaiseBy;
  const maxTotal = activePlayer ? activePlayer.stack + activePlayer.currentBet : 0;
  const maxRaises = getMaxRaises();
  const raiseAtCap = table.raisesThisStreet >= maxRaises;
  const canRaise = !noBetToMatch && maxTotal - table.currentMaxBet >= minRaiseBy;
  const isBlinds = table.street === 'blinds';
  const canActBlinds =
    activePlayer &&
    !activePlayer.outOfGame &&
    activePlayer.currentBet === 0 &&
    !activePlayer.folded &&
    isBlinds;
  const canAct =
    activePlayer &&
    !activePlayer.folded &&
    !activePlayer.outOfGame &&
    table.street !== 'showdown' &&
    table.street !== 'blinds' &&
    !table.bettingCompleteThisStreet;
  const atShowdownWithPot = table.street === 'showdown' && table.pot > 0;
  const inHand = players.filter((p) => !p.folded && !p.outOfGame);
  const blindAmount = rules.bigBlind;
  const maxBetRounded = Math.floor(maxTotal / minBet) * minBet;
  const maxRaiseBy = Math.max(0, maxTotal - table.currentMaxBet);
  const maxRaiseByRounded = Math.floor(maxRaiseBy / minRaiseBy) * minRaiseBy;
  const displayBetTotal = Math.min(maxBetRounded, Math.max(minBet, Math.round(betAmount / minBet) * minBet || minBet));
  const displayRaiseBy = Math.min(maxRaiseByRounded, Math.max(minRaiseBy, Math.round(betAmount / minRaiseBy) * minRaiseBy || minRaiseBy));

  const handleBet = (totalBet: number) => {
    if (!activePlayer || totalBet < 0) return;
    placeBet(actionIndex, Math.min(totalBet, maxTotal));
    setBetAmount(noBetToMatch ? minBet : minRaiseBy);
  };

  const handleRaise = () => {
    if (!activePlayer || noBetToMatch) return;
    placeBet(actionIndex, Math.min(table.currentMaxBet + displayRaiseBy, maxTotal));
    setBetAmount(minRaiseBy);
  };

  const stepBetDown = () => setBetAmount((a) => Math.max(minBet, a - minBet));
  const stepBetUp = () => setBetAmount((a) => Math.min(maxBetRounded, a + minBet));
  const stepRaiseDown = () => setBetAmount((a) => Math.max(minRaiseBy, a - minRaiseBy));
  const stepRaiseUp = () => setBetAmount((a) => Math.min(maxRaiseByRounded, a + minRaiseBy));

  return (
    <div className="mx-auto max-w-4xl space-y-6">
      {/* Top bar: Back to setup right */}
      <div className="flex justify-end">
        <button
          type="button"
          onClick={resetGame}
          className="btn-secondary"
        >
          Back to setup
        </button>
      </div>

      {/* Pot & street */}
      <div className="card-felt flex flex-wrap items-center justify-between gap-4 p-5">
        <div className="flex items-baseline gap-3">
          <span className="text-sm font-medium uppercase tracking-wider text-slate-400">Pot</span>
          <span className="text-3xl font-bold tabular-nums text-amber-400 drop-shadow-sm">{table.pot}</span>
        </div>
        <div className="flex flex-wrap items-center gap-2">
          <span className="badge rounded-lg bg-slate-700/90 px-3 py-1.5 text-slate-200">
            {STREETS[table.street]}
          </span>
          {table.street !== 'showdown' && table.street !== 'blinds' && (
            <>
              {table.bettingCompleteThisStreet && (
                <span className="text-sm text-slate-400">Betting complete —</span>
              )}
              <button
                type="button"
                onClick={nextStreet}
                className="rounded-lg bg-slate-600/90 px-3 py-1.5 text-sm font-medium text-slate-100 transition hover:bg-slate-500"
              >
                Next street →
              </button>
            </>
          )}
        </div>
      </div>

      {/* Players */}
      <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
        {players.map((p, i) => (
          <div
            key={p.id}
            className={`card p-4 transition ${
              p.outOfGame
                ? 'opacity-50'
                : i === actionIndex && !p.folded
                  ? 'border-emerald-500/80 bg-emerald-950/40 ring-2 ring-emerald-500/50'
                  : p.folded
                    ? 'opacity-70'
                    : ''
            }`}
          >
            <div className="mb-3 flex items-center justify-between">
              <span className="font-semibold text-slate-100">{p.name}</span>
              <span className="flex flex-wrap gap-1.5">
                {p.outOfGame && (
                  <span className="badge bg-slate-600 text-slate-300">Out</span>
                )}
                {!p.outOfGame && p.isDealer && (
                  <span className="badge bg-slate-600 text-slate-200">D</span>
                )}
                {p.isSmallBlind && (
                  <span className="badge bg-amber-900/70 text-amber-300">SB</span>
                )}
                {p.isBigBlind && (
                  <span className="badge bg-amber-900/70 text-amber-300">BB</span>
                )}
                {p.folded && (
                  <span className="badge bg-red-900/50 text-red-300">Folded</span>
                )}
              </span>
            </div>
            <div className="flex justify-between text-sm">
              <span className="text-slate-400">Stack</span>
              <span className="font-mono font-medium tabular-nums text-slate-100">{p.stack}</span>
            </div>
            <div className="flex justify-between text-sm">
              <span className="text-slate-400">Bet this street</span>
              <span className="font-mono font-medium tabular-nums text-amber-400">{p.currentBet}</span>
            </div>
          </div>
        ))}
      </div>

      {/* Blinds: Place Blind or Fold (simulate who stays in) */}
      {canActBlinds && (
        <div className="card border-amber-800/50 bg-amber-950/30 p-5">
          <p className="mb-4 text-sm text-slate-400">
            <strong className="text-slate-100">{activePlayer.name}</strong> — post blind to play or fold to sit out
          </p>
          <div className="flex flex-wrap items-center gap-3">
            <button
              type="button"
              onClick={() => postBlind(actionIndex)}
              disabled={activePlayer.stack < blindAmount}
              className="btn-primary bg-amber-600 hover:bg-amber-500 disabled:cursor-not-allowed disabled:opacity-50"
            >
              Place blind ({blindAmount})
            </button>
            <button
              type="button"
              onClick={() => fold(actionIndex)}
              className="rounded-xl border border-red-800/60 bg-red-900/50 px-4 py-2.5 text-sm font-semibold text-red-200 transition hover:bg-red-900/70"
            >
              Fold (sit out)
            </button>
          </div>
        </div>
      )}

      {/* Actions (for current player) */}
      {canAct && (
        <div className="card p-5">
          <p className="mb-4 text-sm text-slate-400">
            <strong className="text-slate-100">{activePlayer.name}</strong> to act
          </p>
          <div className="flex flex-wrap items-center gap-3">
            <button
              type="button"
              onClick={() => fold(actionIndex)}
              className="rounded-xl border border-red-800/60 bg-red-900/50 px-4 py-2.5 text-sm font-semibold text-red-200 transition hover:bg-red-900/70"
            >
              Fold
            </button>
            {noBetToMatch ? (
              <>
                <button
                  type="button"
                  onClick={() => check(actionIndex)}
                  className="btn-secondary"
                >
                  Check
                </button>
                <div className="flex items-center gap-2">
                  <div className="flex items-center rounded-xl border border-slate-600 bg-slate-800/80">
                    <button
                      type="button"
                      onClick={stepBetDown}
                      disabled={betAmount <= minBet}
                      className="flex h-10 w-10 items-center justify-center rounded-l-xl text-slate-300 transition hover:bg-slate-600 disabled:opacity-40 disabled:hover:bg-transparent"
                      aria-label="Decrease bet"
                    >
                      <span className="text-lg font-medium">−</span>
                    </button>
                    <span className="min-w-[3rem] py-2 text-center font-mono text-slate-100" aria-live="polite">
                      {displayBetTotal}
                    </span>
                    <button
                      type="button"
                      onClick={stepBetUp}
                      disabled={displayBetTotal >= maxBetRounded}
                      className="flex h-10 w-10 items-center justify-center rounded-r-xl text-slate-300 transition hover:bg-slate-600 disabled:opacity-40 disabled:hover:bg-transparent"
                      aria-label="Increase bet"
                    >
                      <span className="text-lg font-medium">+</span>
                    </button>
                  </div>
                  <button
                    type="button"
                    onClick={() => handleBet(displayBetTotal)}
                    className="btn-primary bg-emerald-600 hover:bg-emerald-500"
                  >
                    Bet
                  </button>
                </div>
              </>
            ) : (
              <>
                <button
                  type="button"
                  onClick={() => handleBet(table.currentMaxBet)}
                  className="btn-secondary"
                >
                  Call {callAmount}
                </button>
                <div className="flex items-center gap-2">
                  <div className="flex items-center rounded-xl border border-slate-600 bg-slate-800/80">
                    <button
                      type="button"
                      onClick={stepRaiseDown}
                      disabled={displayRaiseBy <= minRaiseBy}
                      className="flex h-10 w-10 items-center justify-center rounded-l-xl text-slate-300 transition hover:bg-slate-600 disabled:opacity-40 disabled:hover:bg-transparent"
                      aria-label="Decrease raise by"
                    >
                      <span className="text-lg font-medium">−</span>
                    </button>
                    <span className="min-w-[3rem] py-2 text-center font-mono text-slate-100" aria-live="polite">
                      {displayRaiseBy}
                    </span>
                    <button
                      type="button"
                      onClick={stepRaiseUp}
                      disabled={displayRaiseBy >= maxRaiseByRounded}
                      className="flex h-10 w-10 items-center justify-center rounded-r-xl text-slate-300 transition hover:bg-slate-600 disabled:opacity-40 disabled:hover:bg-transparent"
                      aria-label="Increase raise by"
                    >
                      <span className="text-lg font-medium">+</span>
                    </button>
                  </div>
                  <button
                    type="button"
                    onClick={handleRaise}
                    disabled={raiseAtCap || !canRaise}
                    className="btn-primary bg-emerald-600 hover:bg-emerald-500 disabled:cursor-not-allowed disabled:opacity-50"
                  >
                    Raise by
                  </button>
                  {(raiseAtCap || !canRaise) && (
                    <span className="text-xs text-slate-500">
                      {raiseAtCap ? 'Max raises this street' : 'Cannot min-raise'}
                    </span>
                  )}
                </div>
              </>
            )}
          </div>
        </div>
      )}

      {/* Showdown: select winner to settle (single pot, all-in logic) */}
      {atShowdownWithPot && inHand.length > 0 && (
        <div className="card border-amber-800/50 bg-amber-950/30 p-5">
          <p className="mb-4 text-sm font-semibold text-amber-200">Who won the hand?</p>
          <div className="flex flex-wrap gap-3">
            {inHand.map((p) => {
              const i = players.indexOf(p);
              return (
                <button
                  key={p.id}
                  type="button"
                  onClick={() => settleHand(i)}
                  className="btn-primary bg-amber-600 hover:bg-amber-500"
                >
                  {p.name}
                </button>
              );
            })}
          </div>
          <p className="mt-3 text-xs leading-relaxed text-slate-400">
            Winner gets the pot. If winner was all-in, others get back their extra chips. Losers with 0 stack are out.
          </p>
        </div>
      )}

      {/* New hand */}
      <div className="flex justify-center border-t border-slate-600/80 pt-6">
        <button
          type="button"
          onClick={newHand}
          className="btn-primary bg-slate-600 hover:bg-slate-500"
        >
          New hand
        </button>
      </div>
    </div>
  );
}
