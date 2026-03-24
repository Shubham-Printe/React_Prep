'use client';

import { useEffect, useRef, useState } from 'react';

/** Visual poker chips (decorative stack); numeric value shown beside / below. */
const CHIP_LAYERS = [
  { ring: 'border-amber-200', face: 'bg-gradient-to-br from-amber-100 to-amber-300', shadow: 'shadow-amber-900/30' },
  { ring: 'border-red-900', face: 'bg-gradient-to-br from-red-500 to-red-800', shadow: 'shadow-red-950/40' },
  { ring: 'border-emerald-900', face: 'bg-gradient-to-br from-emerald-500 to-emerald-800', shadow: 'shadow-emerald-950/40' },
  { ring: 'border-slate-600', face: 'bg-gradient-to-br from-slate-700 to-slate-900', shadow: 'shadow-black/50' },
  { ring: 'border-blue-900', face: 'bg-gradient-to-br from-blue-500 to-blue-800', shadow: 'shadow-blue-950/40' },
] as const;

function stackDepthForAmount(amount: number): number {
  if (amount <= 0) return 3;
  const scaled = Math.min(10, Math.max(4, Math.ceil(Math.log10(amount + 1) * 2.5) + 3));
  return scaled;
}

export function ChipStack({
  amount,
  label,
  size = 'md',
  className = '',
}: {
  amount: number;
  /** e.g. "Stack" or omit to show amount only */
  label?: string;
  size?: 'sm' | 'md';
  className?: string;
}) {
  const depth = stackDepthForAmount(amount);
  const chipSize = size === 'sm' ? 'h-5 w-5' : 'h-6 w-6';
  const offset = size === 'sm' ? 2 : 2.5;

  return (
    <div className={`flex flex-col items-center gap-1 ${className}`}>
      <div
        className="relative flex justify-center"
        style={{ height: `${12 + depth * offset}px`, width: size === 'sm' ? '2.5rem' : '2.75rem' }}
        aria-hidden
      >
        {Array.from({ length: depth }, (_, i) => {
          const style = CHIP_LAYERS[i % CHIP_LAYERS.length];
          return (
            <div
              key={i}
              className={`absolute rounded-full border-2 ${style.ring} ${style.face} ${style.shadow} ${chipSize} shadow-md`}
              style={{
                bottom: i * offset,
                left: '50%',
                marginLeft: size === 'sm' ? '-0.625rem' : '-0.75rem',
                transform: `translateX(${(i % 2 === 0 ? -1 : 1) * 1}px)`,
              }}
            />
          );
        })}
      </div>
      <div className="text-center leading-tight">
        {label && <span className="block text-[10px] font-medium uppercase tracking-wide text-slate-500">{label}</span>}
        <span className="font-mono text-xs font-semibold tabular-nums text-slate-200 sm:text-sm">{amount}</span>
      </div>
    </div>
  );
}

/** Pot in the center — neat vertical stack (readable, not scattered). */
export function PotChipPile({ pot }: { pot: number }) {
  const prevPot = useRef<number | undefined>(undefined);
  const [bump, setBump] = useState(false);

  useEffect(() => {
    const changed = prevPot.current !== undefined && pot !== prevPot.current;
    prevPot.current = pot;
    if (!changed) return;
    setBump(true);
    const t = window.setTimeout(() => setBump(false), 560);
    return () => window.clearTimeout(t);
  }, [pot]);

  if (pot <= 0) {
    return (
      <div className="flex flex-col items-center gap-1 opacity-60">
        <div className="h-8 w-8 rounded-full border-2 border-dashed border-slate-500/60" />
        <span className="text-xs text-slate-500">Pot</span>
      </div>
    );
  }

  const depth = Math.min(12, Math.max(5, Math.ceil(Math.log10(pot + 1) * 2.8) + 4));
  const step = 2.5;
  const chipSize = 'h-6 w-6 sm:h-7 sm:w-7';

  return (
    <div
      className={`flex flex-col items-center gap-1 ${bump ? 'animate-pot-bump' : ''}`}
      style={{ transformOrigin: 'center center' }}
    >
      <div
        className="relative flex justify-center"
        style={{ height: `${14 + depth * step}px`, width: '2.75rem' }}
        aria-hidden
      >
        {Array.from({ length: depth }, (_, i) => {
          const style = CHIP_LAYERS[(i + 2) % CHIP_LAYERS.length];
          return (
            <div
              key={i}
              className={`absolute rounded-full border-2 ${style.ring} ${style.face} ${style.shadow} ${chipSize} shadow-lg`}
              style={{
                bottom: i * step,
                left: '50%',
                transform: `translateX(calc(-50% + ${((i % 3) - 1) * 0.5}px))`,
                zIndex: i,
              }}
            />
          );
        })}
      </div>
      <span className="text-[10px] font-medium uppercase tracking-wider text-amber-200/90">Pot</span>
      <span className="font-mono text-lg font-bold tabular-nums text-amber-300 sm:text-2xl">{pot}</span>
    </div>
  );
}
