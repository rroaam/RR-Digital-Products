/**
 * Knowhere Afterglow — domain types
 */

export type Priority = 'must' | 'nice';

/** Shopping aisle groups for the Shopping List screen. */
export type ShopGroup =
  | 'Pharmacy'
  | 'Grocery'
  | 'Target / general'
  | 'Camera / tech'
  | 'Outdoor / camping';

export const SHOP_GROUPS: ShopGroup[] = [
  'Pharmacy',
  'Grocery',
  'Target / general',
  'Camera / tech',
  'Outdoor / camping',
];

export type AccentKey = 'amber' | 'redwood' | 'ocean' | 'alpine';

export interface PackItem {
  id: string;
  label: string;
  /** Category id (see CATEGORIES). */
  category: string;
  /** Optional sub-group label shown within a category. */
  group?: string;
  qty: number;
  note: string;
  needBuy: boolean;
  needCharge: boolean;
  priority: Priority;
  packed: boolean;
  /** Which shopping aisle this lands in when "need to buy" is on. */
  shop: ShopGroup;
  /** True for user-created items. */
  custom?: boolean;
}

export interface Category {
  id: string;
  title: string;
  blurb: string;
  accent: AccentKey;
}

export type Leg = 'festival' | 'yosemite' | 'bigsur';

export interface ShotCard {
  id: string;
  leg: Leg;
  title: string;
  mood: string;
  gear: string;
  time: string;
  captured: boolean;
  note: string;
  rating: number; // 0–5
}

export interface CheckItem {
  id: string;
  label: string;
  done: boolean;
  group?: string;
}

export interface RouteLeg {
  num: string;
  title: string;
  mood: string;
  focus: string;
  accent: AccentKey;
}

export type StatusFilter = 'all' | 'buy' | 'charge' | 'packed';

/** The full persisted app state. */
export interface AppState {
  version: number;
  departureDate: string | null; // ISO date (yyyy-mm-dd)
  items: PackItem[];
  shots: ShotCard[];
  vanOps: CheckItem[];
  routePrep: CheckItem[];
}
