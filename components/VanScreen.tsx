/**
 * Van — pickup / operations checklist + power gear pulled from packing.
 */
import React, { useMemo } from 'react';
import { useStore } from '../store';
import { COPY } from '../constants';
import { classNames } from '../utils';
import ProgressRing from './ProgressRing';
import { IconBolt } from './Icons';

export default function VanScreen() {
  const { state, toggleVanOp, togglePacked } = useStore();
  const done = state.vanOps.filter((o) => o.done).length;
  const pct = state.vanOps.length ? done / state.vanOps.length : 0;

  const power = useMemo(
    () => state.items.filter((i) => i.group === 'Power / electronics'),
    [state.items],
  );

  return (
    <div className="screen van">
      <header className="screen-head">
        <p className="eyebrow">Sprinter operations</p>
        <h1 className="screen-title">Van Pickup</h1>
        <p className="screen-lede">Ask Roadsurfer at pickup.</p>
      </header>

      <div className="callout van-callout">
        <span className="callout-title">Before you drive off</span>
        <p>{COPY.vanNote}</p>
      </div>

      <section className="card van-progress">
        <ProgressRing value={pct} size={70} stroke={7} label={`${done}/${state.vanOps.length}`} sublabel="learned" />
        <p>Walk the van with the rep and tick each system as you learn it. Don’t leave gaps.</p>
      </section>

      <section className="card prep">
        <header className="prep-head">
          <h3>Pickup checklist</h3>
          <span>{done}/{state.vanOps.length}</span>
        </header>
        <div className="prep-list">
          {state.vanOps.map((o) => (
            <button
              key={o.id}
              className={classNames('check-row', o.done && 'done')}
              onClick={() => toggleVanOp(o.id)}
            >
              <span className={classNames('checkbox sm', o.done && 'checked')}>
                <svg viewBox="0 0 24 24" width="14" height="14" aria-hidden="true">
                  <path d="m5 12.5 4.5 4.5L19 7" fill="none" stroke="currentColor" strokeWidth="2.6" strokeLinecap="round" strokeLinejoin="round" />
                </svg>
              </span>
              <span>{o.label}</span>
            </button>
          ))}
        </div>
      </section>

      {power.length > 0 && (
        <section className="card prep">
          <header className="prep-head">
            <h3><IconBolt size={16} /> Power / electronics</h3>
            <span>{power.filter((i) => i.packed).length}/{power.length}</span>
          </header>
          <div className="prep-list">
            {power.map((i) => (
              <button
                key={i.id}
                className={classNames('check-row', i.packed && 'done')}
                onClick={() => togglePacked(i.id)}
              >
                <span className={classNames('checkbox sm', i.packed && 'checked')}>
                  <svg viewBox="0 0 24 24" width="14" height="14" aria-hidden="true">
                    <path d="m5 12.5 4.5 4.5L19 7" fill="none" stroke="currentColor" strokeWidth="2.6" strokeLinecap="round" strokeLinejoin="round" />
                  </svg>
                </span>
                <span>{i.label}{i.qty > 1 ? ` ×${i.qty}` : ''}</span>
                {i.needCharge && <span className="mini-flag"><IconBolt size={12} /></span>}
              </button>
            ))}
          </div>
        </section>
      )}

      <p className="road-rule">{COPY.roadRule}</p>
    </div>
  );
}
