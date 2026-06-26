/**
 * Animated SVG progress ring with a warm-sunlight gradient stroke.
 */
import React, { useId } from 'react';

interface Props {
  value: number; // 0..1
  size?: number;
  stroke?: number;
  label?: string;
  sublabel?: string;
}

export default function ProgressRing({
  value,
  size = 92,
  stroke = 8,
  label,
  sublabel,
}: Props) {
  const gid = useId();
  const r = (size - stroke) / 2;
  const c = 2 * Math.PI * r;
  const clamped = Math.max(0, Math.min(1, value));
  const offset = c * (1 - clamped);

  return (
    <div className="ring" style={{ width: size, height: size }}>
      <svg width={size} height={size} aria-hidden="true">
        <defs>
          <linearGradient id={gid} x1="0%" y1="0%" x2="100%" y2="100%">
            <stop offset="0%" stopColor="var(--amber)" />
            <stop offset="55%" stopColor="var(--sun)" />
            <stop offset="100%" stopColor="var(--ocean)" />
          </linearGradient>
        </defs>
        <circle
          cx={size / 2}
          cy={size / 2}
          r={r}
          fill="none"
          stroke="rgba(255,255,255,0.08)"
          strokeWidth={stroke}
        />
        <circle
          cx={size / 2}
          cy={size / 2}
          r={r}
          fill="none"
          stroke={`url(#${gid})`}
          strokeWidth={stroke}
          strokeLinecap="round"
          strokeDasharray={c}
          strokeDashoffset={offset}
          transform={`rotate(-90 ${size / 2} ${size / 2})`}
          style={{ transition: 'stroke-dashoffset 0.7s cubic-bezier(.22,1,.36,1)' }}
        />
      </svg>
      <div className="ring-center">
        {label != null && <span className="ring-label">{label}</span>}
        {sublabel != null && <span className="ring-sub">{sublabel}</span>}
      </div>
    </div>
  );
}
