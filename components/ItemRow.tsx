/**
 * A single packing item — tactile checkbox + expandable editor.
 */
import React, { useState } from 'react';
import type { PackItem } from '../types';
import { CATEGORIES } from '../data';
import { SHOP_GROUPS } from '../types';
import { useStore } from '../store';
import { classNames } from '../utils';
import { IconBolt, IconCart, IconChevron, IconNote, IconTrash } from './Icons';

export default function ItemRow({ item }: { item: PackItem }) {
  const { togglePacked, updateItem, deleteItem } = useStore();
  const [open, setOpen] = useState(false);

  return (
    <div className={classNames('item', item.packed && 'is-packed', open && 'is-open')}>
      <div className="item-main">
        <button
          className={classNames('checkbox', item.packed && 'checked')}
          onClick={() => togglePacked(item.id)}
          aria-pressed={item.packed}
          aria-label={item.packed ? `Mark ${item.label} unpacked` : `Mark ${item.label} packed`}
        >
          <svg viewBox="0 0 24 24" width="16" height="16" aria-hidden="true">
            <path d="m5 12.5 4.5 4.5L19 7" fill="none" stroke="currentColor" strokeWidth="2.4" strokeLinecap="round" strokeLinejoin="round" />
          </svg>
        </button>

        <button className="item-body" onClick={() => setOpen((o) => !o)}>
          <span className="item-label">
            {item.label}
            {item.qty > 1 && <span className="item-qty">×{item.qty}</span>}
          </span>
          <span className="item-badges">
            {item.priority === 'must' ? (
              <span className="tag tag-must">Must</span>
            ) : (
              <span className="tag tag-nice">Nice</span>
            )}
            {item.needBuy && <span className="tag tag-buy"><IconCart size={12} /> Buy</span>}
            {item.needCharge && <span className="tag tag-charge"><IconBolt size={12} /> Charge</span>}
            {item.note && <span className="tag tag-note"><IconNote size={12} /></span>}
          </span>
        </button>

        <button
          className={classNames('item-chevron', open && 'rot')}
          onClick={() => setOpen((o) => !o)}
          aria-label="Edit item"
        >
          <IconChevron size={18} />
        </button>
      </div>

      {open && (
        <div className="item-edit">
          <label className="field">
            <span>Name</span>
            <input
              value={item.label}
              onChange={(e) => updateItem(item.id, { label: e.target.value })}
            />
          </label>

          <div className="field-row">
            <label className="field qty-field">
              <span>Qty</span>
              <div className="stepper">
                <button onClick={() => updateItem(item.id, { qty: Math.max(1, item.qty - 1) })}>−</button>
                <span>{item.qty}</span>
                <button onClick={() => updateItem(item.id, { qty: item.qty + 1 })}>+</button>
              </div>
            </label>

            <label className="field">
              <span>Priority</span>
              <select
                value={item.priority}
                onChange={(e) => updateItem(item.id, { priority: e.target.value as PackItem['priority'] })}
              >
                <option value="must">Must</option>
                <option value="nice">Nice-to-have</option>
              </select>
            </label>
          </div>

          <div className="field-row">
            <label className="field">
              <span>Category</span>
              <select
                value={item.category}
                onChange={(e) => updateItem(item.id, { category: e.target.value })}
              >
                {CATEGORIES.map((c) => (
                  <option key={c.id} value={c.id}>{c.title}</option>
                ))}
              </select>
            </label>
            <label className="field">
              <span>Shop aisle</span>
              <select
                value={item.shop}
                onChange={(e) => updateItem(item.id, { shop: e.target.value as PackItem['shop'] })}
              >
                {SHOP_GROUPS.map((g) => (
                  <option key={g} value={g}>{g}</option>
                ))}
              </select>
            </label>
          </div>

          <label className="field">
            <span>Note</span>
            <input
              value={item.note}
              placeholder="Add a note…"
              onChange={(e) => updateItem(item.id, { note: e.target.value })}
            />
          </label>

          <div className="toggle-row">
            <button
              className={classNames('toggle', item.needBuy && 'on')}
              onClick={() => updateItem(item.id, { needBuy: !item.needBuy })}
            >
              <IconCart size={15} /> Need to buy
            </button>
            <button
              className={classNames('toggle', item.needCharge && 'on')}
              onClick={() => updateItem(item.id, { needCharge: !item.needCharge })}
            >
              <IconBolt size={15} /> Need to charge
            </button>
          </div>

          <button className="delete-link" onClick={() => deleteItem(item.id)}>
            <IconTrash size={15} /> Delete item
          </button>
        </div>
      )}
    </div>
  );
}
