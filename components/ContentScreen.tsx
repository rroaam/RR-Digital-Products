/**
 * Content — the Roadsurfer Shot Board.
 */
import React, { useMemo, useState } from 'react';
import { useStore } from '../store';
import type { Leg, ShotCard } from '../types';
import { classNames } from '../utils';
import { IconCheck, IconStar } from './Icons';

const LEGS: { key: Leg; label: string; accent: string }[] = [
  { key: 'festival', label: 'Festival → Van Reset', accent: 'amber' },
  { key: 'yosemite', label: 'Yosemite', accent: 'alpine' },
  { key: 'bigsur', label: 'Big Sur', accent: 'ocean' },
];

function Card({ shot, accent }: { shot: ShotCard; accent: string }) {
  const { updateShot } = useStore();
  const [open, setOpen] = useState(false);
  return (
    <div className={classNames('shot-card card', `accent-${accent}`, shot.captured && 'captured')}>
      <div className="shot-top">
        <button
          className={classNames('capture-btn', shot.captured && 'on')}
          onClick={() => updateShot(shot.id, { captured: !shot.captured })}
          aria-pressed={shot.captured}
        >
          <IconCheck size={15} /> {shot.captured ? 'Captured' : 'Capture'}
        </button>
        <span className="shot-time">{shot.time}</span>
      </div>
      <h3 className="shot-title" onClick={() => setOpen((o) => !o)}>{shot.title}</h3>
      <p className="shot-mood">{shot.mood}</p>
      <p className="shot-gear"><span>Gear</span> {shot.gear}</p>

      <div className="stars" role="group" aria-label="Rating">
        {[1, 2, 3, 4, 5].map((n) => (
          <button
            key={n}
            className="star"
            onClick={() => updateShot(shot.id, { rating: shot.rating === n ? 0 : n })}
            aria-label={`${n} star${n > 1 ? 's' : ''}`}
          >
            <IconStar size={16} filled={n <= shot.rating} />
          </button>
        ))}
      </div>

      <input
        className="shot-note"
        value={shot.note}
        placeholder="Note — location, idea, timing…"
        onChange={(e) => updateShot(shot.id, { note: e.target.value })}
      />
    </div>
  );
}

export default function ContentScreen() {
  const { state } = useStore();
  const [active, setActive] = useState<Leg | 'all'>('all');

  const captured = state.shots.filter((s) => s.captured).length;

  const visible = useMemo(
    () => (active === 'all' ? state.shots : state.shots.filter((s) => s.leg === active)),
    [state.shots, active],
  );

  return (
    <div className="screen content">
      <header className="screen-head">
        <p className="eyebrow">Roadsurfer partnership</p>
        <h1 className="screen-title">Shot Board</h1>
        <p className="screen-lede">{captured}/{state.shots.length} shots in the can.</p>
      </header>

      <div className="leg-filters">
        <button className={classNames('leg-chip', active === 'all' && 'active')} onClick={() => setActive('all')}>All</button>
        {LEGS.map((l) => (
          <button
            key={l.key}
            className={classNames('leg-chip', `accent-${l.accent}`, active === l.key && 'active')}
            onClick={() => setActive(l.key)}
          >
            {l.label}
          </button>
        ))}
      </div>

      {LEGS.filter((l) => active === 'all' || active === l.key).map((l) => {
        const shots = visible.filter((s) => s.leg === l.key);
        if (!shots.length) return null;
        return (
          <section key={l.key} className="shot-section">
            {active === 'all' && <h2 className={`shot-section-title accent-${l.accent}`}>{l.label}</h2>}
            <div className="shot-grid">
              {shots.map((s) => <Card key={s.id} shot={s} accent={l.accent} />)}
            </div>
          </section>
        );
      })}
    </div>
  );
}
