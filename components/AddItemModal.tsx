/**
 * Add a custom packing item.
 */
import React, { useEffect, useRef, useState } from 'react';
import { useStore } from '../store';
import { CATEGORIES } from '../data';
import { SHOP_GROUPS } from '../types';
import type { PackItem, Priority, ShopGroup } from '../types';
import { classNames } from '../utils';
import { IconBolt, IconCart, IconX } from './Icons';

export default function AddItemModal({
  defaultCategory,
  onClose,
}: {
  defaultCategory?: string;
  onClose: () => void;
}) {
  const { addItem } = useStore();
  const [label, setLabel] = useState('');
  const [category, setCategory] = useState(defaultCategory ?? CATEGORIES[0].id);
  const [qty, setQty] = useState(1);
  const [priority, setPriority] = useState<Priority>('must');
  const [note, setNote] = useState('');
  const [needBuy, setNeedBuy] = useState(false);
  const [needCharge, setNeedCharge] = useState(false);
  const [shop, setShop] = useState<ShopGroup>('Target / general');
  const inputRef = useRef<HTMLInputElement>(null);

  useEffect(() => {
    inputRef.current?.focus();
    const onKey = (e: KeyboardEvent) => e.key === 'Escape' && onClose();
    window.addEventListener('keydown', onKey);
    return () => window.removeEventListener('keydown', onKey);
  }, [onClose]);

  const submit = () => {
    const trimmed = label.trim();
    if (!trimmed) return;
    addItem({
      label: trimmed,
      category,
      qty,
      priority,
      note: note.trim(),
      needBuy,
      needCharge,
      shop,
    } as Partial<PackItem> & { label: string; category: string });
    onClose();
  };

  return (
    <div className="modal-overlay" onClick={onClose}>
      <div className="modal" onClick={(e) => e.stopPropagation()} role="dialog" aria-label="Add item">
        <div className="modal-head">
          <h3>Add an item</h3>
          <button className="icon-btn" onClick={onClose} aria-label="Close"><IconX size={18} /></button>
        </div>

        <label className="field">
          <span>Name</span>
          <input
            ref={inputRef}
            value={label}
            placeholder="e.g. Trucker hat, extra SD card…"
            onChange={(e) => setLabel(e.target.value)}
            onKeyDown={(e) => e.key === 'Enter' && submit()}
          />
        </label>

        <div className="field-row">
          <label className="field">
            <span>Category</span>
            <select value={category} onChange={(e) => setCategory(e.target.value)}>
              {CATEGORIES.map((c) => (
                <option key={c.id} value={c.id}>{c.title}</option>
              ))}
            </select>
          </label>
          <label className="field qty-field">
            <span>Qty</span>
            <div className="stepper">
              <button onClick={() => setQty((q) => Math.max(1, q - 1))}>−</button>
              <span>{qty}</span>
              <button onClick={() => setQty((q) => q + 1)}>+</button>
            </div>
          </label>
        </div>

        <div className="field-row">
          <label className="field">
            <span>Priority</span>
            <select value={priority} onChange={(e) => setPriority(e.target.value as Priority)}>
              <option value="must">Must</option>
              <option value="nice">Nice-to-have</option>
            </select>
          </label>
          <label className="field">
            <span>Shop aisle</span>
            <select value={shop} onChange={(e) => setShop(e.target.value as ShopGroup)}>
              {SHOP_GROUPS.map((g) => (
                <option key={g} value={g}>{g}</option>
              ))}
            </select>
          </label>
        </div>

        <label className="field">
          <span>Note</span>
          <input value={note} placeholder="Optional" onChange={(e) => setNote(e.target.value)} />
        </label>

        <div className="toggle-row">
          <button className={classNames('toggle', needBuy && 'on')} onClick={() => setNeedBuy((v) => !v)}>
            <IconCart size={15} /> Need to buy
          </button>
          <button className={classNames('toggle', needCharge && 'on')} onClick={() => setNeedCharge((v) => !v)}>
            <IconBolt size={15} /> Need to charge
          </button>
        </div>

        <div className="modal-actions">
          <button className="btn-ghost" onClick={onClose}>Cancel</button>
          <button className="btn-primary" onClick={submit} disabled={!label.trim()}>Add item</button>
        </div>
      </div>
    </div>
  );
}
