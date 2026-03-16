'use client';

import React, { createContext, useCallback, useContext, useMemo, useState } from 'react';
import type { GameMode, GameRules, GameState, Player, TableState } from '@/types/poker';

const defaultRules: GameRules = {
  variant: 'texas-holdem',
  smallBlind: 5,
  bigBlind: 10,
  minRaise: 10,
  maxRaisesPerStreetOption: 'half',
  betPerStreet: 10,
};

const DEFAULT_PLAYER_COUNT = 4;
const DEFAULT_STARTING_STACK = 1000;

function createDefaultPlayers(count: number, stack: number): Player[] {
  return Array.from({ length: count }, (_, i) => ({
    id: `player-${i}`,
    name: `Player ${i + 1}`,
    stack,
    currentBet: 0,
    totalBetThisHand: 0,
    folded: false,
    isDealer: false,
    isSmallBlind: false,
    isBigBlind: false,
    seatIndex: i,
  }));
}

const defaultTable: TableState = {
  pot: 0,
  street: 'preflop',
  currentMaxBet: 0,
  actionOnIndex: 0,
  handNumber: 0,
  raisesThisStreet: 0,
  firstToActThisStreet: 0,
  lastAggressorIndex: null,
  bettingCompleteThisStreet: false,
};

/** Get effective max raises for this street (standard mode). */
function getMaxRaises(players: Player[], rules: GameRules): number {
  const active = players.filter((p) => !p.outOfGame).length;
  if (rules.maxRaisesPerStreetOption === 'unlimited') return Infinity;
  if (rules.maxRaisesPerStreetOption === 'players') return active;
  return Math.floor(active / 2);
}

/** Next active player index (not outOfGame), starting after fromIndex. */
function nextActiveIndex(players: Player[], fromIndex: number): number {
  const n = players.length;
  for (let i = 1; i <= n; i++) {
    const idx = (fromIndex + i) % n;
    if (!players[idx].outOfGame) return idx;
  }
  return -1;
}

/** Next player to act: not folded, not outOfGame. Used for check and fold. */
function nextToActIndex(players: Player[], fromIndex: number): number {
  const n = players.length;
  for (let i = 1; i <= n; i++) {
    const idx = (fromIndex + i) % n;
    const p = players[idx];
    if (!p.folded && !p.outOfGame) return idx;
  }
  return -1;
}

/** Next player who hasn't acted in the blind round: !outOfGame, currentBet === 0, !folded. */
function nextBlindToActIndex(players: Player[], fromIndex: number): number {
  const n = players.length;
  for (let i = 1; i <= n; i++) {
    const idx = (fromIndex + i) % n;
    const p = players[idx];
    if (!p.outOfGame && p.currentBet === 0 && !p.folded) return idx;
  }
  return -1;
}

/** Transition from blinds to preflop (or showdown if everyone folded). */
function transitionBlindsToPreflop(prev: GameState): GameState {
  const players = prev.players.map((p) => ({ ...p, currentBet: 0 }));
  const firstToAct = prev.players.findIndex((p) => !p.folded && !p.outOfGame);
  const everyoneFolded = firstToAct === -1;
  const newActionOn = firstToAct === -1 ? 0 : firstToAct;
  return {
    ...prev,
    players,
    table: {
      ...prev.table,
      street: everyoneFolded ? 'showdown' : 'preflop',
      currentMaxBet: 0,
      actionOnIndex: newActionOn,
      raisesThisStreet: 0,
      firstToActThisStreet: newActionOn,
      lastAggressorIndex: null,
      bettingCompleteThisStreet: false,
    },
  };
}

/** Pure transition to next street: reset currentBet, advance street, set first to act. */
function applyNextStreet(prev: GameState): GameState {
  const standardOrder: TableState['street'][] = ['blinds', 'preflop', 'flop', 'turn', 'river', 'showdown'];
  const easyOrder: TableState['street'][] = ['blinds', 'preflop', 'flop', 'river', 'showdown'];
  const order = prev.mode === 'easy' ? easyOrder : standardOrder;
  const idx = order.indexOf(prev.table.street);
  const nextStreetName = idx < order.length - 1 ? order[idx + 1] : prev.table.street;
  if (prev.table.street === 'blinds' && nextStreetName === 'preflop') {
    return transitionBlindsToPreflop(prev);
  }
  const players = prev.players.map((p) => ({ ...p, currentBet: 0 }));
  const dealerIndex = prev.players.findIndex((p) => p.isDealer);
  const firstToAct = nextActiveIndex(players, dealerIndex);
  const newActionOn = firstToAct === -1 ? dealerIndex : firstToAct;
  return {
    ...prev,
    players,
    table: {
      ...prev.table,
      street: nextStreetName,
      currentMaxBet: 0,
      actionOnIndex: newActionOn,
      raisesThisStreet: 0,
      firstToActThisStreet: newActionOn,
      lastAggressorIndex: null,
      bettingCompleteThisStreet: false,
    },
  };
}

type GameContextValue = {
  state: GameState;
  setMode: (mode: GameMode) => void;
  setPlayerCount: (count: number) => void;
  setPlayerName: (index: number, name: string) => void;
  setRules: (rules: Partial<GameRules>) => void;
  setStartingStack: (stack: number) => void;
  startGame: () => void;
  postBlind: (playerIndex: number) => void;
  placeBet: (playerIndex: number, amount: number) => void;
  check: (playerIndex: number) => void;
  fold: (playerIndex: number) => void;
  nextStreet: () => void;
  settleHand: (winnerIndex: number) => void;
  newHand: () => void;
  resetGame: () => void;
  getMaxRaises: () => number;
};

const GameContext = createContext<GameContextValue | null>(null);

export function GameProvider({ children }: { children: React.ReactNode }) {
  const [state, setState] = useState<GameState>({
    mode: 'standard',
    rules: defaultRules,
    players: createDefaultPlayers(DEFAULT_PLAYER_COUNT, DEFAULT_STARTING_STACK),
    table: defaultTable,
    started: false,
  });

  const setMode = useCallback((mode: GameMode) => {
    setState((prev) => ({ ...prev, mode }));
  }, []);

  const setPlayerCount = useCallback((count: number) => {
    setState((prev) => {
      const startingStack = prev.players[0]?.stack ?? DEFAULT_STARTING_STACK;
      const players: Player[] = Array.from({ length: count }, (_, i) => ({
        id: `player-${i}`,
        name: prev.players[i]?.name ?? `Player ${i + 1}`,
        stack: prev.players[i]?.stack ?? startingStack,
        currentBet: 0,
        totalBetThisHand: 0,
        folded: false,
        isDealer: false,
        isSmallBlind: false,
        isBigBlind: false,
        seatIndex: i,
        outOfGame: prev.players[i]?.outOfGame ?? false,
      }));
      return { ...prev, players };
    });
  }, []);

  const setPlayerName = useCallback((index: number, name: string) => {
    setState((prev) => {
      const players = [...prev.players];
      if (players[index]) players[index] = { ...players[index], name };
      return { ...prev, players };
    });
  }, []);

  const setRules = useCallback((rules: Partial<GameRules>) => {
    setState((prev) => {
      const next = { ...prev.rules, ...rules };
      if (typeof rules.bigBlind === 'number') next.minRaise = rules.bigBlind;
      return { ...prev, rules: next };
    });
  }, []);

  const setStartingStack = useCallback((stack: number) => {
    setState((prev) => ({
      ...prev,
      players: prev.players.map((p) => ({ ...p, stack })),
    }));
  }, []);

  const startGame = useCallback(() => {
    setState((prev) => {
      if (prev.players.length < 2) return prev;
      const n = prev.players.length;
      const dealer = 0;

      if (prev.mode === 'easy') {
        const players = prev.players.map((p, i) => ({
          ...p,
          stack: p.stack || 100,
          currentBet: 0,
          totalBetThisHand: 0,
          folded: false,
          isDealer: i === dealer,
          isSmallBlind: false,
          isBigBlind: false,
        }));
        const firstToAct = nextActiveIndex(players, dealer);
        const actionOn = firstToAct === -1 ? dealer : firstToAct;
        return {
          ...prev,
          players,
          started: true,
          table: {
            pot: 0,
            street: 'blinds',
            currentMaxBet: 0,
            actionOnIndex: actionOn,
            handNumber: 1,
            raisesThisStreet: 0,
            firstToActThisStreet: actionOn,
            lastAggressorIndex: null,
            bettingCompleteThisStreet: false,
          },
        };
      }

      const sbIndex = (dealer + 1) % n;
      const bbIndex = (dealer + 2) % n;
      const players = prev.players.map((p, i) => ({
        ...p,
        stack: p.stack || 100,
        currentBet: 0,
        totalBetThisHand: 0,
        folded: false,
        isDealer: i === dealer,
        isSmallBlind: i === sbIndex,
        isBigBlind: i === bbIndex,
      }));
      const firstToAct = nextActiveIndex(players, dealer);
      const actionOn = firstToAct === -1 ? dealer : firstToAct;
      return {
        ...prev,
        players,
        started: true,
        table: {
          ...defaultTable,
          pot: 0,
          street: 'blinds',
          currentMaxBet: 0,
          actionOnIndex: actionOn,
          handNumber: 1,
          firstToActThisStreet: actionOn,
          lastAggressorIndex: null,
          bettingCompleteThisStreet: false,
        },
      };
    });
  }, []);

  /** Post blind (during blinds street): player pays blind to stay in; only those who post continue. */
  const postBlind = useCallback((playerIndex: number) => {
    setState((prev) => {
      if (prev.table.street !== 'blinds') return prev;
      const player = prev.players[playerIndex];
      if (!player || player.outOfGame || player.currentBet > 0 || player.folded) return prev;
      const blindAmount = prev.mode === 'easy' ? prev.rules.betPerStreet : prev.rules.bigBlind;
      const pay = Math.min(blindAmount, player.stack);
      if (pay <= 0) return prev;
      const players = prev.players.map((p, i) =>
        i === playerIndex
          ? {
              ...p,
              stack: p.stack - pay,
              currentBet: pay,
              totalBetThisHand: pay,
            }
          : p
      );
      const nextAction = nextBlindToActIndex(players, playerIndex);
      if (nextAction === -1) {
        return transitionBlindsToPreflop({
          ...prev,
          players,
          table: {
            ...prev.table,
            pot: prev.table.pot + pay,
          },
        });
      }
      return {
        ...prev,
        players,
        table: {
          ...prev.table,
          pot: prev.table.pot + pay,
          actionOnIndex: nextAction,
        },
      };
    });
  }, []);

  const placeBet = useCallback((playerIndex: number, amount: number) => {
    setState((prev) => {
      const player = prev.players[playerIndex];
      if (!player || player.folded || amount < 0) return prev;
      const toPut = Math.min(amount, player.stack + player.currentBet);
      const added = toPut - player.currentBet;
      if (added <= 0) return prev;
      const { currentMaxBet } = prev.table;
      const blindAmount = prev.mode === 'easy' ? prev.rules.betPerStreet : prev.rules.bigBlind;
      const minRaiseAmount = prev.mode === 'easy' ? prev.rules.betPerStreet : prev.rules.minRaise;
      if (currentMaxBet === 0) {
        if (toPut % blindAmount !== 0) return prev;
      } else {
        if (toPut < currentMaxBet) return prev;
        if (toPut > currentMaxBet) {
          const raiseBy = toPut - currentMaxBet;
          if (raiseBy < minRaiseAmount || raiseBy % blindAmount !== 0) return prev;
        }
      }
      const isRaise = toPut > currentMaxBet;
      if (isRaise) {
        const maxRaises = getMaxRaises(prev.players, prev.rules);
        if (prev.table.raisesThisStreet >= maxRaises) return prev;
      }
      const players = prev.players.map((p, i) =>
        i === playerIndex
          ? {
              ...p,
              stack: p.stack - added,
              currentBet: toPut,
              totalBetThisHand: p.totalBetThisHand + added,
            }
          : p
      );
      const newMax = Math.max(prev.table.currentMaxBet, toPut);
      const nextAction = nextToActIndex(players, playerIndex);
      const lastAggressor = isRaise ? playerIndex : prev.table.lastAggressorIndex;
      const roundComplete =
        nextAction === -1 ||
        (prev.table.lastAggressorIndex !== null && nextAction === prev.table.lastAggressorIndex);
      const tableAfterBet = {
        ...prev.table,
        pot: prev.table.pot + added,
        currentMaxBet: newMax,
        actionOnIndex: nextAction === -1 ? (playerIndex + 1) % prev.players.length : nextAction,
        raisesThisStreet: isRaise ? prev.table.raisesThisStreet + 1 : prev.table.raisesThisStreet,
        lastAggressorIndex: lastAggressor,
        bettingCompleteThisStreet: !isRaise && roundComplete ? true : prev.table.bettingCompleteThisStreet,
      };
      return { ...prev, players, table: tableAfterBet };
    });
  }, []);

  /** Check = pass action to next player without betting (only when no bet to call). */
  const check = useCallback((playerIndex: number) => {
    setState((prev) => {
      const nextAction = nextToActIndex(prev.players, playerIndex);
      const actionOn = nextAction === -1 ? playerIndex : nextAction;
      const { firstToActThisStreet, lastAggressorIndex } = prev.table;
      const roundComplete =
        nextAction === -1 ||
        (lastAggressorIndex === null && nextAction === firstToActThisStreet) ||
        (lastAggressorIndex !== null && nextAction === lastAggressorIndex);
      return {
        ...prev,
        table: {
          ...prev.table,
          actionOnIndex: actionOn,
          bettingCompleteThisStreet: roundComplete ? true : prev.table.bettingCompleteThisStreet,
        },
      };
    });
  }, []);

  const fold = useCallback((playerIndex: number) => {
    setState((prev) => {
      const players = prev.players.map((p, i) =>
        i === playerIndex ? { ...p, folded: true } : p
      );
      if (prev.table.street === 'blinds') {
        const nextAction = nextBlindToActIndex(players, playerIndex);
        if (nextAction === -1) return transitionBlindsToPreflop({ ...prev, players });
        return {
          ...prev,
          players,
          table: { ...prev.table, actionOnIndex: nextAction },
        };
      }
      const nextAction = nextToActIndex(players, playerIndex);
      return {
        ...prev,
        players,
        table: {
          ...prev.table,
          actionOnIndex: nextAction === -1 ? (playerIndex + 1) % prev.players.length : nextAction,
        },
      };
    });
  }, []);

  const nextStreet = useCallback(() => {
    setState((prev) => {
      if (prev.table.street === 'blinds') return prev;
      return applyNextStreet(prev);
    });
  }, []);

  /** Single pot: winner gets pot minus refunds; others get their extra back. Losers with stack 0 are out. */
  const settleHand = useCallback((winnerIndex: number) => {
    setState((prev) => {
      const inHandIndexes = prev.players.map((_, i) => i).filter((i) => !prev.players[i].folded);
      if (inHandIndexes.length === 0 || prev.table.pot === 0) return prev;
      const winner = prev.players[winnerIndex];
      if (!winner || winner.folded) return prev;
      const allInAmount = Math.min(...inHandIndexes.map((i) => prev.players[i].totalBetThisHand));
      const refunds = inHandIndexes
        .filter((i) => i !== winnerIndex)
        .reduce((sum, i) => sum + (prev.players[i].totalBetThisHand - allInAmount), 0);
      const winnerGets = prev.table.pot - refunds;
      const players = prev.players.map((p, i) => {
        if (p.folded) return p;
        const extra = p.totalBetThisHand - allInAmount;
        const newStack = i === winnerIndex ? p.stack + winnerGets : p.stack + extra;
        return {
          ...p,
          stack: newStack,
          outOfGame: newStack <= 0 ? true : p.outOfGame,
        };
      });
      return {
        ...prev,
        players,
        table: { ...prev.table, pot: 0 },
      };
    });
  }, []);

  const newHand = useCallback(() => {
    setState((prev) => {
      const activeCount = prev.players.filter((p) => !p.outOfGame).length;
      if (activeCount < 2) return prev;
      const dealerIndex = prev.players.findIndex((p) => p.isDealer);
      const nextDealer = nextActiveIndex(prev.players, dealerIndex);
      if (nextDealer === -1) return prev;

      const players = prev.players.map((p, i) => ({
        ...p,
        currentBet: 0,
        totalBetThisHand: 0,
        folded: false,
        isDealer: i === nextDealer,
        isSmallBlind: false,
        isBigBlind: false,
      }));

      const firstToAct = nextActiveIndex(players, nextDealer);
      const actionOn = firstToAct === -1 ? nextDealer : firstToAct;

      return {
        ...prev,
        players,
        table: {
          ...prev.table,
          pot: 0,
          street: 'blinds',
          currentMaxBet: 0,
          actionOnIndex: actionOn,
          handNumber: prev.table.handNumber + 1,
          raisesThisStreet: 0,
          firstToActThisStreet: actionOn,
          lastAggressorIndex: null,
          bettingCompleteThisStreet: false,
        },
      };
    });
  }, []);

  const resetGame = useCallback(() => {
    setState((prev) => ({
      mode: prev.mode,
      rules: defaultRules,
      players: createDefaultPlayers(DEFAULT_PLAYER_COUNT, DEFAULT_STARTING_STACK),
      table: defaultTable,
      started: false,
    }));
  }, []);

  const getMaxRaisesValue = useCallback(() => getMaxRaises(state.players, state.rules), [state.players, state.rules]);

  const value = useMemo<GameContextValue>(
    () => ({
      state,
      setMode,
      setPlayerCount,
      setPlayerName,
      setRules,
      setStartingStack,
      startGame,
      postBlind,
      placeBet,
      check,
      fold,
      nextStreet,
      settleHand,
      newHand,
      resetGame,
      getMaxRaises: getMaxRaisesValue,
    }),
    [
      state,
      setMode,
      setPlayerCount,
      setPlayerName,
      setRules,
      setStartingStack,
      startGame,
      postBlind,
      placeBet,
      check,
      fold,
      nextStreet,
      settleHand,
      newHand,
      resetGame,
      getMaxRaisesValue,
    ]
  );

  return <GameContext.Provider value={value}>{children}</GameContext.Provider>;
}

export function useGame() {
  const ctx = useContext(GameContext);
  if (!ctx) throw new Error('useGame must be used within GameProvider');
  return ctx;
}
