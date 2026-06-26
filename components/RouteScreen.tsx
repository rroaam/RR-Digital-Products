/**
 * Route — a vertical journey timeline + route-prep checklist.
 */
import React from 'react';
import { useStore } from '../store';
import { ROUTE_LEGS } from '../data';
import { classNames } from '../utils';

export default function RouteScreen() {
  const { state, toggleRoutePrep } = useStore();
  const done = state.routePrep.filter((p) => p.done).length;

  return (
    <div className="screen route">
      <header className="screen-head">
        <p className="eyebrow">The arc</p>
        <h1 className="screen-title">The Route</h1>
        <p className="screen-lede">Four chapters, one continuous road movie.</p>
      </header>

      <div className="timeline">
        {ROUTE_LEGS.map((leg, i) => (
          <div key={leg.num} className={`leg accent-${leg.accent}`} style={{ animationDelay: `${i * 80}ms` }}>
            <div className="leg-rail">
              <span className="leg-dot" />
              {i < ROUTE_LEGS.length - 1 && <span className="leg-line" />}
            </div>
            <div className="leg-card card">
              <span className="leg-num">{leg.num}</span>
              <h3 className="leg-title">{leg.title}</h3>
              <p className="leg-row"><span className="leg-key">Mood</span> {leg.mood}</p>
              <p className="leg-row"><span className="leg-key">Focus</span> {leg.focus}</p>
            </div>
          </div>
        ))}
      </div>

      <section className="prep card">
        <header className="prep-head">
          <h3>Route prep</h3>
          <span>{done}/{state.routePrep.length}</span>
        </header>
        <div className="prep-list">
          {state.routePrep.map((p) => (
            <button
              key={p.id}
              className={classNames('check-row', p.done && 'done')}
              onClick={() => toggleRoutePrep(p.id)}
            >
              <span className={classNames('checkbox sm', p.done && 'checked')}>
                <svg viewBox="0 0 24 24" width="14" height="14" aria-hidden="true">
                  <path d="m5 12.5 4.5 4.5L19 7" fill="none" stroke="currentColor" strokeWidth="2.6" strokeLinecap="round" strokeLinejoin="round" />
                </svg>
              </span>
              <span>{p.label}</span>
            </button>
          ))}
        </div>
      </section>
    </div>
  );
}
