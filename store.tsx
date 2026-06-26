/**
 * Knowhere Afterglow — app store
 *
 * Single source of truth, persisted to localStorage. Exposes a typed context
 * with granular mutators so screens stay declarative.
 */

import React, {
  createContext,
  useCallback,
  useContext,
  useEffect,
  useMemo,
  useRef,
  useState,
} from 'react';
import type { AppState, CheckItem, PackItem, ShotCard } from './types';
import { APP_VERSION, createInitialState } from './data';
import { generateId } from './utils';

const STORAGE_KEY = 'knowhere-afterglow:v1';

function loadState(): AppState {
  try {
    const raw = localStorage.getItem(STORAGE_KEY);
    if (!raw) return createInitialState();
    const parsed = JSON.parse(raw) as Partial<AppState>;
    const fresh = createInitialState();
    // Shallow-merge so new seed sections survive an old save.
    return {
      version: APP_VERSION,
      departureDate: parsed.departureDate ?? fresh.departureDate,
      items: Array.isArray(parsed.items) ? (parsed.items as PackItem[]) : fresh.items,
      shots: Array.isArray(parsed.shots) ? (parsed.shots as ShotCard[]) : fresh.shots,
      vanOps: Array.isArray(parsed.vanOps) ? (parsed.vanOps as CheckItem[]) : fresh.vanOps,
      routePrep: Array.isArray(parsed.routePrep) ? (parsed.routePrep as CheckItem[]) : fresh.routePrep,
    };
  } catch {
    return createInitialState();
  }
}

interface Store {
  state: AppState;
  // packing
  togglePacked: (id: string) => void;
  updateItem: (id: string, patch: Partial<PackItem>) => void;
  addItem: (partial: Partial<PackItem> & { label: string; category: string }) => void;
  deleteItem: (id: string) => void;
  markAllPacked: (ids: string[]) => void;
  resetTrip: () => void;
  setDeparture: (iso: string | null) => void;
  // shots
  updateShot: (id: string, patch: Partial<ShotCard>) => void;
  // checklists
  toggleVanOp: (id: string) => void;
  toggleRoutePrep: (id: string) => void;
  // io
  replaceState: (next: AppState) => void;
}

const StoreContext = createContext<Store | null>(null);

export function StoreProvider({ children }: { children: React.ReactNode }) {
  const [state, setState] = useState<AppState>(loadState);
  const firstRender = useRef(true);

  // Persist on change (skip the very first paint to avoid a redundant write).
  useEffect(() => {
    if (firstRender.current) {
      firstRender.current = false;
      return;
    }
    try {
      localStorage.setItem(STORAGE_KEY, JSON.stringify(state));
    } catch {
      /* storage may be full or unavailable */
    }
  }, [state]);

  const mapItems = useCallback(
    (fn: (i: PackItem) => PackItem) =>
      setState((s) => ({ ...s, items: s.items.map(fn) })),
    [],
  );

  const togglePacked = useCallback(
    (id: string) =>
      mapItems((i) => (i.id === id ? { ...i, packed: !i.packed } : i)),
    [mapItems],
  );

  const updateItem = useCallback(
    (id: string, patch: Partial<PackItem>) =>
      mapItems((i) => (i.id === id ? { ...i, ...patch } : i)),
    [mapItems],
  );

  const addItem = useCallback(
    (partial: Partial<PackItem> & { label: string; category: string }) =>
      setState((s) => ({
        ...s,
        items: [
          {
            id: `custom-${generateId()}`,
            qty: 1,
            note: '',
            needBuy: false,
            needCharge: false,
            priority: 'must',
            packed: false,
            shop: 'Target / general',
            custom: true,
            ...partial,
          } as PackItem,
          ...s.items,
        ],
      })),
    [],
  );

  const deleteItem = useCallback(
    (id: string) =>
      setState((s) => ({ ...s, items: s.items.filter((i) => i.id !== id) })),
    [],
  );

  const markAllPacked = useCallback(
    (ids: string[]) => {
      const set = new Set(ids);
      mapItems((i) => (set.has(i.id) ? { ...i, packed: true } : i));
    },
    [mapItems],
  );

  const resetTrip = useCallback(() => setState(createInitialState()), []);

  const setDeparture = useCallback(
    (iso: string | null) => setState((s) => ({ ...s, departureDate: iso })),
    [],
  );

  const updateShot = useCallback(
    (id: string, patch: Partial<ShotCard>) =>
      setState((s) => ({
        ...s,
        shots: s.shots.map((sh) => (sh.id === id ? { ...sh, ...patch } : sh)),
      })),
    [],
  );

  const toggleVanOp = useCallback(
    (id: string) =>
      setState((s) => ({
        ...s,
        vanOps: s.vanOps.map((o) => (o.id === id ? { ...o, done: !o.done } : o)),
      })),
    [],
  );

  const toggleRoutePrep = useCallback(
    (id: string) =>
      setState((s) => ({
        ...s,
        routePrep: s.routePrep.map((o) =>
          o.id === id ? { ...o, done: !o.done } : o,
        ),
      })),
    [],
  );

  const replaceState = useCallback((next: AppState) => setState(next), []);

  const value = useMemo<Store>(
    () => ({
      state,
      togglePacked,
      updateItem,
      addItem,
      deleteItem,
      markAllPacked,
      resetTrip,
      setDeparture,
      updateShot,
      toggleVanOp,
      toggleRoutePrep,
      replaceState,
    }),
    [
      state,
      togglePacked,
      updateItem,
      addItem,
      deleteItem,
      markAllPacked,
      resetTrip,
      setDeparture,
      updateShot,
      toggleVanOp,
      toggleRoutePrep,
      replaceState,
    ],
  );

  return <StoreContext.Provider value={value}>{children}</StoreContext.Provider>;
}

export function useStore(): Store {
  const ctx = useContext(StoreContext);
  if (!ctx) throw new Error('useStore must be used within StoreProvider');
  return ctx;
}
