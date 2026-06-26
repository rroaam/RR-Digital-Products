/**
 * Packing — the main experience. Checklist · Pack This Way · Shopping.
 */
import React, { useEffect, useMemo, useRef, useState } from 'react';
import { useStore } from '../store';
import { COPY } from '../constants';
import { CATEGORIES, APP_VERSION } from '../data';
import type { AppState, PackItem, StatusFilter } from '../types';
import { classNames, downloadFile } from '../utils';
import ProgressRing from './ProgressRing';
import ItemRow from './ItemRow';
import AddItemModal from './AddItemModal';
import PackThisWay from './PackThisWay';
import ShoppingList from './ShoppingList';
import {
  IconBolt,
  IconCart,
  IconCheck,
  IconChevron,
  IconDownload,
  IconPlus,
  IconReset,
  IconSearch,
  IconUpload,
} from './Icons';

export type PackView = 'list' | 'pack-this-way' | 'shopping';

interface Props {
  view: PackView;
  setView: (v: PackView) => void;
  addSignal: number;
}

const FILTERS: { key: StatusFilter; label: string }[] = [
  { key: 'all', label: 'All' },
  { key: 'buy', label: 'Need to Buy' },
  { key: 'charge', label: 'Need to Charge' },
  { key: 'packed', label: 'Packed' },
];

export default function PackScreen({ view, setView, addSignal }: Props) {
  const { state, markAllPacked, resetTrip, replaceState } = useStore();
  const { items } = state;
  const [filter, setFilter] = useState<StatusFilter>('all');
  const [query, setQuery] = useState('');
  const [showAdd, setShowAdd] = useState(false);
  const [tools, setTools] = useState(false);
  const [collapsed, setCollapsed] = useState<Record<string, boolean>>({});
  const fileRef = useRef<HTMLInputElement>(null);

  // Home / nav "Add item" deep link.
  useEffect(() => {
    if (addSignal > 0) {
      setView('list');
      setShowAdd(true);
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [addSignal]);

  const filtered = useMemo(() => {
    const q = query.trim().toLowerCase();
    return items.filter((i) => {
      if (filter === 'buy' && !i.needBuy) return false;
      if (filter === 'charge' && !i.needCharge) return false;
      if (filter === 'packed' && !i.packed) return false;
      if (q && !(i.label.toLowerCase().includes(q) || i.note.toLowerCase().includes(q)))
        return false;
      return true;
    });
  }, [items, filter, query]);

  const packed = items.filter((i) => i.packed).length;
  const pct = items.length ? packed / items.length : 0;

  const grouped = useMemo(() => {
    return CATEGORIES.map((cat) => ({
      cat,
      list: filtered.filter((i) => i.category === cat.id),
    })).filter((g) => g.list.length > 0);
  }, [filtered]);

  const exportMarkdown = () => {
    const lines: string[] = [`# ${COPY.headline} — Packing List`, '', COPY.subhead, ''];
    CATEGORIES.forEach((cat) => {
      const list = items.filter((i) => i.category === cat.id);
      if (!list.length) return;
      lines.push(`## ${cat.title}`);
      let group = '';
      list.forEach((i) => {
        if (i.group && i.group !== group) {
          group = i.group;
          lines.push(`\n**${group}**`);
        }
        const flags = [
          i.needBuy ? '🛒' : '',
          i.needCharge ? '⚡' : '',
          i.priority === 'must' ? '' : '(nice)',
        ].filter(Boolean).join(' ');
        lines.push(`- [${i.packed ? 'x' : ' '}] ${i.label}${i.qty > 1 ? ` ×${i.qty}` : ''}${flags ? ` ${flags}` : ''}${i.note ? ` — ${i.note}` : ''}`);
      });
      lines.push('');
    });
    downloadFile('knowhere-afterglow-packing.md', lines.join('\n'), 'text/markdown');
  };

  const exportJSON = () => {
    downloadFile('knowhere-afterglow-state.json', JSON.stringify(state, null, 2), 'application/json');
  };

  const importJSON = (file: File) => {
    const reader = new FileReader();
    reader.onload = () => {
      try {
        const data = JSON.parse(String(reader.result)) as AppState;
        if (!Array.isArray(data.items)) throw new Error('bad file');
        replaceState({ ...data, version: APP_VERSION });
        alert('Trip state imported.');
      } catch {
        alert('That file could not be read as Knowhere Afterglow state.');
      }
    };
    reader.readAsText(file);
  };

  const onReset = () => {
    if (confirm('Reset the whole trip? This restores the original list and clears your changes.')) {
      resetTrip();
    }
  };

  return (
    <div className="screen pack">
      <div className="subtabs">
        {(['list', 'pack-this-way', 'shopping'] as PackView[]).map((v) => (
          <button
            key={v}
            className={classNames('subtab', view === v && 'active')}
            onClick={() => setView(v)}
          >
            {v === 'list' ? 'Checklist' : v === 'pack-this-way' ? 'Pack This Way' : 'Shopping'}
          </button>
        ))}
      </div>

      {view === 'pack-this-way' && <PackThisWay />}
      {view === 'shopping' && <ShoppingList />}

      {view === 'list' && (
        <>
          <section className="pack-top card">
            <ProgressRing value={pct} size={78} stroke={7} label={`${packed}/${items.length}`} sublabel="packed" />
            <div className="pack-top-meta">
              <h2 className="pack-title">Packing</h2>
              <p className="pack-sub">
                {packed === items.length && items.length > 0
                  ? COPY.completion
                  : `${items.length - packed} left to pack`}
              </p>
              <div className="pack-top-actions">
                <button className="chip-btn" onClick={() => markAllPacked(filtered.map((i) => i.id))}>
                  <IconCheck size={15} /> Mark all packed
                </button>
                <button className="chip-btn" onClick={() => setTools((t) => !t)}>
                  Tools <IconChevron size={14} className={tools ? 'rot90' : ''} />
                </button>
              </div>
            </div>
          </section>

          {tools && (
            <div className="tools-row">
              <button className="tool-btn" onClick={exportMarkdown}><IconDownload size={15} /> Export .md</button>
              <button className="tool-btn" onClick={exportJSON}><IconDownload size={15} /> Export JSON</button>
              <button className="tool-btn" onClick={() => fileRef.current?.click()}><IconUpload size={15} /> Import JSON</button>
              <button className="tool-btn danger" onClick={onReset}><IconReset size={15} /> Reset trip</button>
              <input
                ref={fileRef}
                type="file"
                accept="application/json"
                hidden
                onChange={(e) => {
                  const f = e.target.files?.[0];
                  if (f) importJSON(f);
                  e.target.value = '';
                }}
              />
            </div>
          )}

          <div className="search-row">
            <div className="search">
              <IconSearch size={17} />
              <input
                value={query}
                placeholder="Search items…"
                onChange={(e) => setQuery(e.target.value)}
              />
            </div>
            <button className="add-fab" onClick={() => setShowAdd(true)} aria-label="Add item">
              <IconPlus size={20} />
            </button>
          </div>

          <div className="filters">
            {FILTERS.map((f) => {
              const count =
                f.key === 'buy' ? items.filter((i) => i.needBuy).length :
                f.key === 'charge' ? items.filter((i) => i.needCharge).length :
                f.key === 'packed' ? packed : items.length;
              return (
                <button
                  key={f.key}
                  className={classNames('filter', filter === f.key && 'active')}
                  onClick={() => setFilter(f.key)}
                >
                  {f.key === 'buy' && <IconCart size={13} />}
                  {f.key === 'charge' && <IconBolt size={13} />}
                  {f.label}
                  <span className="filter-count">{count}</span>
                </button>
              );
            })}
          </div>

          {grouped.length === 0 ? (
            <div className="empty">
              <p>{query || filter !== 'all' ? 'Nothing matches that filter.' : COPY.emptyPacking}</p>
            </div>
          ) : (
            grouped.map(({ cat, list }) => {
              const done = items.filter((i) => i.category === cat.id && i.packed).length;
              const tot = items.filter((i) => i.category === cat.id).length;
              const isCollapsed = collapsed[cat.id];
              // Render sub-group dividers within a category.
              let lastGroup = '';
              return (
                <section key={cat.id} className={`cat accent-${cat.accent}`}>
                  <button
                    className="cat-head"
                    onClick={() => setCollapsed((c) => ({ ...c, [cat.id]: !c[cat.id] }))}
                  >
                    <span className="cat-bar" />
                    <span className="cat-title-wrap">
                      <span className="cat-title">{cat.title}</span>
                      <span className="cat-blurb">{cat.blurb}</span>
                    </span>
                    <span className="cat-count">{done}/{tot}</span>
                    <IconChevron size={18} className={classNames('cat-chevron', !isCollapsed && 'rot90')} />
                  </button>
                  {!isCollapsed && (
                    <div className="cat-items">
                      {list.map((i: PackItem) => {
                        const showGroup = i.group && i.group !== lastGroup;
                        lastGroup = i.group ?? lastGroup;
                        return (
                          <React.Fragment key={i.id}>
                            {showGroup && <p className="subgroup">{i.group}</p>}
                            <ItemRow item={i} />
                          </React.Fragment>
                        );
                      })}
                    </div>
                  )}
                </section>
              );
            })
          )}
        </>
      )}

      {showAdd && <AddItemModal onClose={() => setShowAdd(false)} />}
    </div>
  );
}
