'use client';

import { useGame } from '@/contexts/GameContext';
import { useState } from 'react';
import { ChipStack, PotChipPile } from '@/components/poker/ChipStack';
import { RoundPokerTable } from '@/components/poker/RoundPokerTable';
import { SeatMotion } from '@/components/poker/SeatMotion';

const STREETS_EASY: Record<string, string> = {
  blinds: 'Blinds',
  preflop: 'Pre-flop',
  flop: 'Flop',
  river: 'Turn & River',
  showdown: 'Showdown',
};

export function EasyPokerTable() {
  const { state, placeBet, check, fold, postBlind, nextStreet, settleHand, newHand, resetGame, getMaxRaises } = useGame();
  const [betAmount, setBetAmount] = useState(state.table.currentMaxBet || state.rules.betPerStreet);

  const { players, table, rules } = state;
  const atShowdownWithPot = table.street === 'showdown' && table.pot > 0;
  const inHand = players.filter((p) => !p.folded && !p.outOfGame);
  const betPerStreet = rules.betPerStreet;
  const actionIndex = table.actionOnIndex;
  const activePlayer = players[actionIndex];
  const callAmount = activePlayer
    ? Math.min(table.currentMaxBet - activePlayer.currentBet, activePlayer.stack + activePlayer.currentBet)
    : 0;
  const noBetToMatch = callAmount === 0;
  const minBet = betPerStreet;
  const minRaiseBy = betPerStreet;
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
  const showBettingPanel =
    activePlayer &&
    !activePlayer.folded &&
    !activePlayer.outOfGame &&
    table.street !== 'showdown' &&
    table.street !== 'blinds';
  const canAct = showBettingPanel && !table.bettingCompleteThisStreet;

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

      <RoundPokerTable
        players={players}
        actionOnIndex={actionIndex}
        centerContent={
          <div
            className={`flex max-h-full w-full flex-col items-center justify-center px-1 sm:px-2 ${
              players.length >= 9 ? 'scale-90 gap-1 sm:gap-2' : players.length >= 6 ? 'gap-1.5 sm:gap-2.5' : 'gap-2 sm:gap-3'
            }`}
          >
            <PotChipPile pot={table.pot} />
            <div className="flex flex-wrap items-center justify-center gap-1.5 sm:gap-2">
              <span className="badge rounded-md bg-slate-800/90 px-2 py-1 text-[10px] text-slate-200 sm:rounded-lg sm:px-3 sm:py-1.5 sm:text-xs">
                {STREETS_EASY[table.street] ?? table.street}
              </span>
              {table.street !== 'showdown' && table.street !== 'blinds' && (
                <>
                  {table.bettingCompleteThisStreet && (
                    <span className="hidden text-[10px] text-slate-400 sm:inline sm:text-xs">Betting complete —</span>
                  )}
                  <button
                    type="button"
                    onClick={nextStreet}
                    className="rounded-md bg-slate-700/95 px-2 py-1 text-[10px] font-medium text-slate-100 transition hover:bg-slate-600 sm:rounded-lg sm:px-3 sm:py-1.5 sm:text-sm"
                  >
                    Next street →
                  </button>
                </>
              )}
              {table.street === 'showdown' && table.pot === 0 && (
                <span className="text-center text-[9px] leading-tight text-slate-500 sm:text-xs">
                  Hand over — new hand
                </span>
              )}
            </div>
          </div>
        }
        renderSeat={(p, i, isActive) => (
          <SeatMotion stack={p.stack} currentBet={p.currentBet} folded={p.folded}>
          <div
            className={`card border-slate-600/80 shadow-xl transition ${
              players.length >= 9 ? 'p-1.5 sm:p-2' : players.length >= 6 ? 'p-2 sm:p-2.5' : 'p-2 sm:p-3'
            } ${p.outOfGame ? 'opacity-50' : ''} ${p.folded ? 'opacity-70' : ''} ${
              isActive ? 'border-emerald-500/90 bg-emerald-950/50 ring-2 ring-emerald-400/70' : ''
            }`}
          >
            <div
              className={`flex flex-col items-center ${players.length >= 9 ? 'gap-1 sm:gap-1.5' : 'gap-1.5 sm:gap-2'}`}
            >
              <ChipStack amount={p.stack} label="Stack" size="sm" />
              {p.currentBet > 0 ? (
                <ChipStack amount={p.currentBet} label="Bet" size="sm" />
              ) : (
                <div className="h-8" aria-hidden />
              )}
              <div className="w-full min-w-0 border-t border-slate-600/50 pt-1.5 text-center">
                <span className="block truncate text-[11px] font-semibold text-slate-100 sm:text-xs">{p.name}</span>
                <span className="mt-1 flex flex-wrap justify-center gap-0.5">
                  {p.isDealer && (
                    <span className="badge bg-slate-600 text-[9px] text-slate-200">D</span>
                  )}
                  {p.folded && (
                    <span className="badge bg-red-900/50 text-[9px] text-red-300">Folded</span>
                  )}
                  {p.outOfGame && (
                    <span className="badge bg-slate-600 text-[9px] text-slate-300">Out</span>
                  )}
                </span>
              </div>
            </div>
          </div>
          </SeatMotion>
        )}
      />

      {canActBlinds && (
        <div className="card border-amber-800/50 bg-amber-950/30 p-5">
          <p className="mb-4 text-sm text-slate-400">
            <strong className="text-slate-100">{activePlayer.name}</strong> — post blind to play or fold to sit out
          </p>
          <div className="flex flex-wrap items-center gap-3">
            <button
              type="button"
              onClick={() => postBlind(actionIndex)}
              disabled={activePlayer.stack < betPerStreet}
              className="btn-primary bg-amber-600 hover:bg-amber-500 disabled:cursor-not-allowed disabled:opacity-50"
            >
              Place blind ({betPerStreet})
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
        </div>
      )}

      {showBettingPanel && (
        <div
          className={`card p-5 transition-opacity ${!canAct ? 'opacity-60' : ''}`}
          aria-busy={!canAct}
        >
          <p className="mb-4 text-sm text-slate-400">
            {canAct ? (
              <>
                <strong className="text-slate-100">{activePlayer.name}</strong> to act
              </>
            ) : (
              <>
                <strong className="text-slate-100">{activePlayer.name}</strong>
                <span className="block text-slate-500">
                  Betting complete — use <strong className="text-slate-400">Next street</strong> on the table.
                </span>
              </>
            )}
          </p>
          <div className={`flex flex-wrap items-center gap-3 ${!canAct ? 'pointer-events-none' : ''}`}>
            <button
              type="button"
              onClick={() => fold(actionIndex)}
              disabled={!canAct}
              className="rounded-xl border border-red-800/60 bg-red-900/50 px-4 py-2.5 text-sm font-semibold text-red-200 transition hover:bg-red-900/70 disabled:cursor-not-allowed disabled:opacity-50"
            >
              Fold
            </button>
            {noBetToMatch ? (
              <>
                <button
                  type="button"
                  onClick={() => check(actionIndex)}
                  disabled={!canAct}
                  className="btn-secondary disabled:cursor-not-allowed disabled:opacity-50"
                >
                  Check
                </button>
                <div className="flex items-center gap-2">
                  <div className="flex items-center rounded-xl border border-slate-600 bg-slate-800/80">
                    <button
                      type="button"
                      onClick={stepBetDown}
                      disabled={!canAct || displayBetTotal <= minBet}
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
                      disabled={!canAct || displayBetTotal >= maxBetRounded}
                      className="flex h-10 w-10 items-center justify-center rounded-r-xl text-slate-300 transition hover:bg-slate-600 disabled:opacity-40 disabled:hover:bg-transparent"
                      aria-label="Increase bet"
                    >
                      <span className="text-lg font-medium">+</span>
                    </button>
                  </div>
                  <button
                    type="button"
                    onClick={() => handleBet(displayBetTotal)}
                    disabled={!canAct}
                    className="btn-primary bg-emerald-600 hover:bg-emerald-500 disabled:cursor-not-allowed disabled:opacity-50"
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
                  disabled={!canAct}
                  className="btn-secondary disabled:cursor-not-allowed disabled:opacity-50"
                >
                  Call {callAmount}
                </button>
                <div className="flex items-center gap-2">
                  <div className="flex items-center rounded-xl border border-slate-600 bg-slate-800/80">
                    <button
                      type="button"
                      onClick={stepRaiseDown}
                      disabled={!canAct || displayRaiseBy <= minRaiseBy}
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
                      disabled={!canAct || displayRaiseBy >= maxRaiseByRounded}
                      className="flex h-10 w-10 items-center justify-center rounded-r-xl text-slate-300 transition hover:bg-slate-600 disabled:opacity-40 disabled:hover:bg-transparent"
                      aria-label="Increase raise by"
                    >
                      <span className="text-lg font-medium">+</span>
                    </button>
                  </div>
                  <button
                    type="button"
                    onClick={handleRaise}
                    disabled={!canAct || raiseAtCap || !canRaise}
                    className="btn-primary bg-emerald-600 hover:bg-emerald-500 disabled:cursor-not-allowed disabled:opacity-50"
                  >
                    Raise by
                  </button>
                  {(raiseAtCap || !canRaise) && canAct && (
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
