/**
 * Shopping List — auto-populated from every item flagged "need to buy",
 * grouped by aisle. Buying an item here marks it packed (acquired).
 */
import React, { useMemo, useState } from 'react';
import { useStore } from '../store';
import { SHOP_GROUPS } from '../types';
import type { ShopGroup } from '../types';
import { classNames, copyText } from '../utils';
import { IconCart, IconCopy, IconCheck } from './Icons';

export default function ShoppingList() {
  const { state, togglePacked, updateItem } = useStore();
  const [copied, setCopied] = useState(false);

  const groups = useMemo(() => {
    const map = new Map<ShopGroup, typeof state.items>();
    SHOP_GROUPS.forEach((g) => map.set(g, []));
    state.items
      .filter((i) => i.needBuy)
      .forEach((i) => map.get(i.shop)?.push(i));
    return map;
  }, [state.items]);

  const toBuy = state.items.filter((i) => i.needBuy && !i.packed);
  const total = state.items.filter((i) => i.needBuy).length;

  const copyList = async () => {
    const lines: string[] = ['Knowhere Afterglow — Shopping List', ''];
    SHOP_GROUPS.forEach((g) => {
      const list = groups.get(g) ?? [];
      if (!list.length) return;
      lines.push(`## ${g}`);
      list.forEach((i) =>
        lines.push(`- [${i.packed ? 'x' : ' '}] ${i.label}${i.qty > 1 ? ` ×${i.qty}` : ''}`),
      );
      lines.push('');
    });
    const ok = await copyText(lines.join('\n'));
    if (ok) {
      setCopied(true);
      setTimeout(() => setCopied(false), 1600);
    }
  };

  const clearPurchased = () => {
    // "Clear purchased" = remove the buy flag from items already acquired (packed).
    state.items
      .filter((i) => i.needBuy && i.packed)
      .forEach((i) => updateItem(i.id, { needBuy: false }));
  };

  if (total === 0) {
    return (
      <div className="empty">
        <IconCart size={30} />
        <p>Nothing on the list yet.</p>
        <span>Flag any item “Need to buy” and it shows up here, sorted by aisle.</span>
      </div>
    );
  }

  return (
    <div className="shopping">
      <div className="shopping-head">
        <p className="shopping-count">
          <strong>{toBuy.length}</strong> to grab · {total} total
        </p>
        <div className="shopping-actions">
          <button className="chip-btn" onClick={copyList}>
            {copied ? <IconCheck size={15} /> : <IconCopy size={15} />}
            {copied ? 'Copied' : 'Copy list'}
          </button>
          <button className="chip-btn" onClick={clearPurchased}>Clear purchased</button>
        </div>
      </div>

      {SHOP_GROUPS.map((g) => {
        const list = groups.get(g) ?? [];
        if (!list.length) return null;
        const done = list.filter((i) => i.packed).length;
        return (
          <section key={g} className="shop-group">
            <header className="shop-group-head">
              <h3>{g}</h3>
              <span>{done}/{list.length}</span>
            </header>
            <div className="shop-items">
              {list.map((i) => (
                <button
                  key={i.id}
                  className={classNames('shop-item', i.packed && 'bought')}
                  onClick={() => togglePacked(i.id)}
                >
                  <span className={classNames('checkbox sm', i.packed && 'checked')}>
                    <svg viewBox="0 0 24 24" width="14" height="14" aria-hidden="true">
                      <path d="m5 12.5 4.5 4.5L19 7" fill="none" stroke="currentColor" strokeWidth="2.6" strokeLinecap="round" strokeLinejoin="round" />
                    </svg>
                  </span>
                  <span className="shop-label">{i.label}</span>
                  {i.qty > 1 && <span className="shop-qty">×{i.qty}</span>}
                </button>
              ))}
            </div>
          </section>
        );
      })}
    </div>
  );
}
