'use client';

import type { ReactNode } from 'react';
import type { Player } from '@/types/poker';

type RoundPokerTableProps = {
  players: Player[];
  actionOnIndex: number;
  centerContent: ReactNode;
  renderSeat: (player: Player, seatIndex: number, isActive: boolean) => ReactNode;
};

/** Seat orbit radius: push cards toward the felt edge (before wood rail). */
function seatOrbitRadiusVmin(n: number): string {
  if (n >= 9) return 'clamp(11.75rem, 46vmin, 19.5rem)';
  if (n >= 7) return 'clamp(11rem, 44.5vmin, 18rem)';
  if (n >= 5) return 'clamp(10.25rem, 42.5vmin, 16.25rem)';
  return 'clamp(9.5rem, 40vmin, 15rem)';
}

/** Wider canvas when more seats so angular spacing stays comfortable. */
function tableMaxWidth(n: number): string {
  if (n >= 9) return 'min(calc(100vw - 0.5rem), 46rem)';
  if (n >= 7) return 'min(calc(100vw - 1rem), 40rem)';
  if (n >= 5) return 'min(calc(100vw - 1.25rem), 36rem)';
  return 'min(calc(100vw - 2rem), 32rem)';
}

/** Narrower seat cards for high player counts to reduce overlap at the rail. */
function seatWrapperClass(n: number): string {
  if (n >= 9) return 'w-[min(17vw,6.75rem)] max-w-[108px] scale-[0.92] sm:max-w-[118px] sm:scale-95';
  if (n >= 7) return 'w-[min(19vw,7.5rem)] max-w-[120px] scale-95 sm:max-w-[128px] sm:scale-[0.97]';
  if (n >= 5) return 'w-[min(22vw,8.5rem)] max-w-[138px] sm:max-w-[148px]';
  return 'w-[min(26vw,10rem)] max-w-[160px] sm:max-w-[168px]';
}

/** Smaller center hub when many players — wider felt band between pot and seats. */
function hubInsetClass(n: number): string {
  if (n >= 9) return 'inset-[26%] p-1.5 sm:inset-[27%] sm:p-2';
  if (n >= 7) return 'inset-[23%] p-2 sm:inset-[24%] sm:p-3';
  if (n >= 5) return 'inset-[20%] p-2 sm:inset-[21%] sm:p-3';
  return 'inset-[18%] p-2 sm:inset-[19%] sm:p-4';
}

/**
 * Players arranged around a circular felt table; center holds pot / controls.
 * Table and seats scale with player count so 10 seats stay readable, not crowded.
 */
export function RoundPokerTable({ players, actionOnIndex, centerContent, renderSeat }: RoundPokerTableProps) {
  const n = players.length;
  if (n === 0) return null;

  const orbit = seatOrbitRadiusVmin(n);
  const seatClass = seatWrapperClass(n);

  return (
    <div className="mx-auto w-full px-1 sm:px-2" style={{ maxWidth: tableMaxWidth(n) }}>
      <div
        className="relative mx-auto aspect-square w-full"
        style={{ maxWidth: tableMaxWidth(n) }}
      >
        {/* Table rim + felt */}
        <div className="absolute inset-[1.5%] rounded-full border-[8px] border-amber-950 bg-gradient-to-b from-amber-950/90 to-amber-900 shadow-2xl shadow-black/60 ring-1 ring-amber-800/50 sm:inset-[2%] sm:border-[12px] md:border-[14px]">
          <div className="absolute inset-[5%] rounded-full bg-gradient-to-br from-emerald-900 via-emerald-950 to-emerald-950 shadow-inner ring-1 ring-emerald-800/40 sm:inset-[6%]">
            {/* subtle felt texture */}
            <div
              className="pointer-events-none absolute inset-0 rounded-full opacity-30"
              style={{
                backgroundImage: `radial-gradient(circle at 20% 30%, rgba(255,255,255,0.06) 0%, transparent 45%),
                  radial-gradient(circle at 80% 70%, rgba(0,0,0,0.15) 0%, transparent 40%)`,
              }}
            />

            {/* Center hub */}
            <div
              className={`absolute flex flex-col items-center justify-center rounded-full border border-emerald-800/50 bg-emerald-950/40 shadow-inner ${hubInsetClass(n)}`}
            >
              {centerContent}
            </div>

            {/* Seats — orbit radius places card center near outer felt (rail edge) */}
            {players.map((player, i) => {
              const angleDeg = (360 / n) * i - 90;
              const isActive = i === actionOnIndex && !player.folded && !player.outOfGame;
              return (
                <div
                  key={player.id}
                  className={`absolute left-1/2 top-1/2 z-10 ${seatClass}`}
                  style={{
                    transform: `translate(-50%, -50%) rotate(${angleDeg}deg) translateY(calc(-1 * ${orbit})) rotate(${-angleDeg}deg)`,
                  }}
                >
                  {renderSeat(player, i, isActive)}
                </div>
              );
            })}
          </div>
        </div>
      </div>
    </div>
  );
}
