'use client';

import { useGame } from '@/contexts/GameContext';
import type { GameMode, GameVariant, MaxRaisesOption } from '@/types/poker';

const MAX_RAISES_OPTIONS: { value: MaxRaisesOption; label: string }[] = [
  { value: 'unlimited', label: 'Unlimited' },
  { value: 'players', label: 'Same as number of players' },
  { value: 'half', label: 'Half of players' },
];

const VARIANTS: { value: GameVariant; label: string }[] = [
  { value: 'texas-holdem', label: 'Texas Hold\'em' },
  { value: 'omaha', label: 'Omaha' },
];

export function GameSetup() {
  const {
    state,
    setMode,
    setPlayerCount,
    setPlayerName,
    setRules,
    setStartingStack,
    startGame,
  } = useGame();

  const count = state.players.length;
  const canStart =
    count >= 2 &&
    state.players.every((p) => p.name.trim() !== '') &&
    state.players.every((p) => p.stack > 0);
  const isEasy = state.mode === 'easy';

  return (
    <div className="mx-auto max-w-lg space-y-8">
      <section className="card p-6">
        <h2 className="mb-4 text-lg font-semibold tracking-tight text-slate-100">Game version</h2>
        <div className="flex gap-3">
          <button
            type="button"
            onClick={() => setMode('standard')}
            className={`flex-1 rounded-xl px-4 py-3 text-sm font-semibold transition ${
              !isEasy
                ? 'bg-emerald-600 text-white shadow-lg shadow-emerald-900/30'
                : 'bg-slate-700/80 text-slate-300 hover:bg-slate-600'
            }`}
          >
            Standard poker
          </button>
          <button
            type="button"
            onClick={() => setMode('easy')}
            className={`flex-1 rounded-xl px-4 py-3 text-sm font-semibold transition ${
              isEasy
                ? 'bg-emerald-600 text-white shadow-lg shadow-emerald-900/30'
                : 'bg-slate-700/80 text-slate-300 hover:bg-slate-600'
            }`}
          >
            Easy poker
          </button>
        </div>
        {isEasy && (
          <p className="mt-4 text-sm leading-relaxed text-slate-400">
            One blind (everyone posts), then 3 betting rounds. Same betting strategy as standard: check, call, bet, raise (min-raise = blind; max raises per street).
          </p>
        )}
      </section>

      <section className="card p-6">
        <h2 className="mb-4 text-lg font-semibold tracking-tight text-slate-100">Rules</h2>
        <div className="space-y-5">
          <div>
            <label className="mb-1.5 block text-sm font-medium text-slate-400">Game variant</label>
            <select
              value={state.rules.variant}
              onChange={(e) => setRules({ variant: e.target.value as GameVariant })}
              className="input-field"
            >
              {VARIANTS.map((v) => (
                <option key={v.value} value={v.value}>
                  {v.label}
                </option>
              ))}
            </select>
          </div>
          {isEasy ? (
            <>
              <div>
                <label className="mb-1.5 block text-sm font-medium text-slate-400">Blind & bet amount (chips)</label>
                <input
                  type="number"
                  min={1}
                  value={state.rules.betPerStreet}
                  onChange={(e) => setRules({ betPerStreet: Number(e.target.value) || 1 })}
                  className="input-field"
                />
                <p className="mt-1.5 text-xs text-slate-500">Blind (everyone posts) and min-raise for the 3 betting rounds.</p>
              </div>
              <div>
                <label className="mb-1.5 block text-sm font-medium text-slate-400">Max raises per street</label>
                <select
                  value={state.rules.maxRaisesPerStreetOption}
                  onChange={(e) => setRules({ maxRaisesPerStreetOption: e.target.value as MaxRaisesOption })}
                  className="input-field"
                >
                  {MAX_RAISES_OPTIONS.map((o) => (
                    <option key={o.value} value={o.value}>
                      {o.label}
                    </option>
                  ))}
                </select>
              </div>
            </>
          ) : (
            <>
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="mb-1.5 block text-sm font-medium text-slate-400">Small blind</label>
                  <input
                    type="number"
                    min={1}
                    value={state.rules.smallBlind}
                    onChange={(e) => setRules({ smallBlind: Number(e.target.value) || 1 })}
                    className="input-field"
                  />
                </div>
                <div>
                  <label className="mb-1.5 block text-sm font-medium text-slate-400">Big blind</label>
                  <input
                    type="number"
                    min={1}
                    value={state.rules.bigBlind}
                    onChange={(e) => setRules({ bigBlind: Number(e.target.value) || 1 })}
                    className="input-field"
                  />
                  <p className="mt-1.5 text-xs text-slate-500">Min raise = big blind</p>
                </div>
              </div>
              <div>
                <label className="mb-1.5 block text-sm font-medium text-slate-400">Max raises per street</label>
                <select
                  value={state.rules.maxRaisesPerStreetOption}
                  onChange={(e) => setRules({ maxRaisesPerStreetOption: e.target.value as MaxRaisesOption })}
                  className="input-field"
                >
                  {MAX_RAISES_OPTIONS.map((o) => (
                    <option key={o.value} value={o.value}>
                      {o.label}
                    </option>
                  ))}
                </select>
              </div>
            </>
          )}
        </div>
      </section>

      <section className="card p-6">
        <h2 className="mb-4 text-lg font-semibold tracking-tight text-slate-100">Players</h2>
        <div className="space-y-5">
          <div>
            <label className="mb-1.5 block text-sm font-medium text-slate-400">Number of players (2–10)</label>
            <input
              type="number"
              min={2}
              max={10}
              value={count || ''}
              onChange={(e) => setPlayerCount(Math.min(10, Math.max(2, Number(e.target.value) || 0)))}
              className="input-field"
            />
          </div>
          <div>
            <label className="mb-1.5 block text-sm font-medium text-slate-400">Starting stack (chips each)</label>
            <input
              type="number"
              min={1}
              value={state.players[0]?.stack || 100}
              onChange={(e) => setStartingStack(Number(e.target.value) || 100)}
              className="input-field"
            />
          </div>
          {state.players.length > 0 && (
            <div className="space-y-3">
              <span className="block text-sm font-medium text-slate-400">Names</span>
              {state.players.map((p, i) => (
                <input
                  key={p.id}
                  type="text"
                  placeholder={`Player ${i + 1}`}
                  value={p.name}
                  onChange={(e) => setPlayerName(i, e.target.value)}
                  className="input-field"
                />
              ))}
            </div>
          )}
        </div>
      </section>

      <button
        type="button"
        onClick={startGame}
        disabled={!canStart}
        className="btn-primary w-full bg-emerald-600 py-3.5 hover:bg-emerald-500 disabled:cursor-not-allowed disabled:opacity-50 disabled:shadow-none"
      >
        Start game
      </button>
    </div>
  );
}
