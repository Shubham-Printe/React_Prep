'use client';

import { useEffect, useRef, useState } from 'react';

type SeatMotionProps = {
  stack: number;
  currentBet: number;
  folded: boolean;
  children: React.ReactNode;
};

/**
 * One-shot CSS animations when this seat's stack/bet/fold state changes (bet placed, fold).
 */
export function SeatMotion({ stack, currentBet, folded, children }: SeatMotionProps) {
  const prev = useRef({ stack, currentBet, folded });
  const [anim, setAnim] = useState<'bet' | 'fold' | null>(null);

  useEffect(() => {
    const p = prev.current;
    let next: 'bet' | 'fold' | null = null;
    if (!p.folded && folded) next = 'fold';
    else if (currentBet > p.currentBet && !folded) next = 'bet';

    prev.current = { stack, currentBet, folded };

    if (!next) return;
    setAnim(next);
    const t = window.setTimeout(() => setAnim(null), 550);
    return () => window.clearTimeout(t);
  }, [stack, currentBet, folded]);

  return (
    <div
      className={
        anim === 'fold'
          ? 'animate-seat-fold'
          : anim === 'bet'
            ? 'animate-seat-bet'
            : ''
      }
    >
      {children}
    </div>
  );
}
