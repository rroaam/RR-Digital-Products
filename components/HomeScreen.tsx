/**
 * Home Dashboard — the trip at a glance.
 */
import React, { useMemo } from 'react';
import { useStore } from '../store';
import { COPY } from '../constants';
import { CATEGORIES, ROUTE_STOPS } from '../data';
import { daysUntil } from '../utils';
import ProgressRing from './ProgressRing';
import {
  IconBolt,
  IconCart,
  IconPlus,
  IconVan,
  IconCamera,
  IconBag,
} from './Icons';
import type { Tab } from '../App';

interface Props {
  navigate: (tab: Tab, view?: 'list' | 'pack-this-way' | 'shopping') => void;
  requestAdd: () => void;
}

const QUICK_CARDS: { cat: string; name: string; Icon: React.FC<any> }[] = [
  { cat: 'festival', name: 'Festival Bag', Icon: IconBag },
  { cat: 'van', name: 'Van Basecamp', Icon: IconVan },
  { cat: 'content', name: 'Content Kit', Icon: IconCamera },
];

export default function HomeScreen({ navigate, requestAdd }: Props) {
  const { state, setDeparture } = useStore();
  const { items } = state;

  const stats = useMemo(() => {
    const total = items.length;
    const packed = items.filter((i) => i.packed).length;
    const buy = items.filter((i) => i.needBuy && !i.packed).length;
    const charge = items.filter((i) => i.needCharge && !i.packed).length;
    const byCat = (cat: string) => {
      const list = items.filter((i) => i.category === cat);
      const done = list.filter((i) => i.packed).length;
      return { done, total: list.length };
    };
    return { total, packed, buy, charge, byCat };
  }, [items]);

  const pct = stats.total ? stats.packed / stats.total : 0;
  const days = daysUntil(state.departureDate);

  return (
    <div className="screen home">
      <header className="hero">
        <div className="hero-glow" aria-hidden="true" />
        <p className="eyebrow">A Roadsurfer road movie</p>
        <h1 className="display">{COPY.headline}</h1>
        <p className="serif-sub">{COPY.subhead}</p>
        <p className="hero-tag">{COPY.tagline}</p>
      </header>

      <section className="card overview-card">
        <ProgressRing
          value={pct}
          label={`${stats.packed}/${stats.total}`}
          sublabel="packed"
        />
        <div className="overview-meta">
          <div className="overview-stat">
            <span className="stat-num">{Math.round(pct * 100)}%</span>
            <span className="stat-cap">trip ready</span>
          </div>
          <div className="overview-pills">
            <button className="pill pill-buy" onClick={() => navigate('pack', 'shopping')}>
              <IconCart size={15} /> {stats.buy} to buy
            </button>
            <button className="pill pill-charge" onClick={() => navigate('pack', 'list')}>
              <IconBolt size={15} /> {stats.charge} to charge
            </button>
          </div>
        </div>
      </section>

      <section className="card departure-card">
        <div>
          <p className="card-kicker">Days until departure</p>
          <p className="departure-num">
            {days == null ? '—' : days < 0 ? 'Rolling' : days}
            {days != null && days >= 0 && <span className="departure-unit">days</span>}
          </p>
        </div>
        <label className="departure-input">
          <span>Set date</span>
          <input
            type="date"
            value={state.departureDate ?? ''}
            onChange={(e) => setDeparture(e.target.value || null)}
          />
        </label>
      </section>

      <section className="quick-cards">
        {QUICK_CARDS.map(({ cat, name, Icon }) => {
          const c = stats.byCat(cat);
          const p = c.total ? c.done / c.total : 0;
          const meta = CATEGORIES.find((x) => x.id === cat);
          return (
            <button
              key={cat}
              className={`quick-card accent-${meta?.accent ?? 'amber'}`}
              onClick={() => navigate('pack', 'list')}
            >
              <Icon size={20} />
              <span className="quick-name">{name}</span>
              <span className="quick-count">{c.done}/{c.total}</span>
              <span className="quick-bar"><span style={{ width: `${p * 100}%` }} /></span>
            </button>
          );
        })}
      </section>

      <section className="actions-grid">
        <button className="action-btn" onClick={requestAdd}>
          <IconPlus size={18} /> Add item
        </button>
        <button className="action-btn" onClick={() => navigate('pack', 'shopping')}>
          <IconCart size={18} /> Shopping list
        </button>
        <button className="action-btn" onClick={() => navigate('van')}>
          <IconVan size={18} /> Van pickup
        </button>
        <button className="action-btn" onClick={() => navigate('content')}>
          <IconCamera size={18} /> Shot prompts
        </button>
      </section>

      <section className="route-strip">
        {ROUTE_STOPS.map((s, idx) => (
          <React.Fragment key={s}>
            <button className="route-dot-wrap" onClick={() => navigate('route')}>
              <span className="route-dot" />
              <span className="route-dot-label">{s}</span>
            </button>
            {idx < ROUTE_STOPS.length - 1 && <span className="route-line" />}
          </React.Fragment>
        ))}
      </section>
    </div>
  );
}
