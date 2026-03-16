/**
 * Poker assistant – types for game rules, players, and table state.
 * You play with physical cards; this app tracks chips, bets, and pot.
 */

export type GameVariant = 'texas-holdem' | 'omaha';

export type GameMode = 'standard' | 'easy';

export type Street = 'blinds' | 'preflop' | 'flop' | 'turn' | 'river' | 'showdown';

/** Standard mode: max raises per street = this option applied to number of players */
export type MaxRaisesOption = 'unlimited' | 'players' | 'half';

export interface GameRules {
  variant: GameVariant;
  /** Small blind amount (in chip units) – standard mode only */
  smallBlind: number;
  /** Big blind amount – standard mode only */
  bigBlind: number;
  /** Minimum raise above current bet – standard mode only; typically = bigBlind */
  minRaise: number;
  /** Max raises per street – standard mode only */
  maxRaisesPerStreetOption: MaxRaisesOption;
  /** Fixed bet each street – easy mode only; everyone pays this or folds */
  betPerStreet: number;
}

export interface Player {
  id: string;
  name: string;
  /** Current chip stack */
  stack: number;
  /** Amount bet this street (before any new action) */
  currentBet: number;
  /** Total put in this hand (for all-in / settlement) */
  totalBetThisHand: number;
  folded: boolean;
  isDealer: boolean;
  isSmallBlind: boolean;
  isBigBlind: boolean;
  /** Seat index for display order */
  seatIndex: number;
  /** True if stack is 0 after losing all-in; excluded from next hands */
  outOfGame?: boolean;
}

export interface TableState {
  /** Main pot (chips in the middle); single pot only */
  pot: number;
  /** Current street of the hand */
  street: Street;
  /** Minimum amount to call (current max bet this street) */
  currentMaxBet: number;
  /** Index of player whose turn it is (for betting order) */
  actionOnIndex: number;
  /** Hand number (increments each new hand) */
  handNumber: number;
  /** Number of raises this street (standard mode); resets each street */
  raisesThisStreet: number;
  /** Who was first to act when this street started (for detecting "everyone checked") */
  firstToActThisStreet: number;
  /** Who made the last bet/raise this street; null if no bet yet (for detecting "everyone called") */
  lastAggressorIndex: number | null;
  /** True when everyone has acted and pot unchanged; betting disabled until user clicks Next street */
  bettingCompleteThisStreet?: boolean;
}

export interface GameState {
  /** Standard = full betting (blinds, raises). Easy = fixed bet per street, no raises. */
  mode: GameMode;
  rules: GameRules;
  players: Player[];
  table: TableState;
  /** Whether the game has been started (setup completed) */
  started: boolean;
}
