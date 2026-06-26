/**
 * Knowhere Afterglow — seed data
 *
 * Everything the trip ships with. Stable, slugged ids so a stored state can be
 * reconciled with future seed changes if needed. User edits live in localStorage;
 * "Reset trip" re-seeds from here.
 */

import type {
  AppState,
  Category,
  CheckItem,
  PackItem,
  RouteLeg,
  ShotCard,
  ShopGroup,
} from './types';

export const APP_VERSION = 1;

export const CATEGORIES: Category[] = [
  { id: 'festival', title: 'Festival Essentials', blurb: 'Thursday–Sunday at Knowhere', accent: 'amber' },
  { id: 'van', title: 'Van Basecamp', blurb: 'Comfort, cleanup, water + food', accent: 'redwood' },
  { id: 'clothing', title: 'Yosemite + Big Sur Clothing', blurb: 'Alpine layers + coastal soft', accent: 'ocean' },
  { id: 'content', title: 'Content Kit', blurb: 'Roadsurfer partnership gear', accent: 'amber' },
  { id: 'health', title: 'Health + Recovery', blurb: 'The bag that saves a day', accent: 'redwood' },
  { id: 'food', title: 'Road Food', blurb: 'Reset groceries + drive snacks', accent: 'ocean' },
];

let _n = 0;
const uid = (cat: string) => `${cat}-${(++_n).toString().padStart(3, '0')}`;

type Opts = Partial<Omit<PackItem, 'id' | 'label' | 'category'>>;

function mk(cat: string, label: string, opts: Opts = {}): PackItem {
  // Sensible default shop aisle by category, overridable per item.
  const defaultShop: Record<string, ShopGroup> = {
    festival: 'Target / general',
    van: 'Outdoor / camping',
    clothing: 'Target / general',
    content: 'Camera / tech',
    health: 'Pharmacy',
    food: 'Grocery',
  };
  return {
    id: uid(cat),
    label,
    category: cat,
    qty: opts.qty ?? 1,
    note: opts.note ?? '',
    needBuy: opts.needBuy ?? false,
    needCharge: opts.needCharge ?? false,
    priority: opts.priority ?? 'must',
    packed: false,
    shop: opts.shop ?? defaultShop[cat] ?? 'Target / general',
    group: opts.group,
    custom: false,
  };
}

function seedItems(): PackItem[] {
  const items: PackItem[] = [];
  const push = (...xs: PackItem[]) => items.push(...xs);

  // ---- A. Festival Essentials ---------------------------------------------
  const fMust = (l: string, o: Opts = {}) => mk('festival', l, { group: 'Must pack', ...o });
  push(
    fMust('Ticket / QR code saved offline'),
    fMust("Driver's license"),
    fMust('Credit card + small cash'),
    fMust('Reusable water bottle'),
    fMust('Reusable mug / camp cup'),
    fMust('Sunglasses'),
    fMust('Sunscreen', { needBuy: true, shop: 'Pharmacy' }),
    fMust('Hat'),
    fMust('Earplugs'),
    fMust('Portable phone charger', { needCharge: true }),
    fMust('Charging cable'),
    fMust('Headlamp / flashlight', { needCharge: true }),
    fMust('Bandana'),
    fMust('Lip balm'),
    fMust('Hand sanitizer'),
    fMust('Mini wipes', { needBuy: true, shop: 'Pharmacy' }),
    fMust('Prescriptions / daily meds'),
    fMust('Electrolyte packets', { needBuy: true, shop: 'Pharmacy' }),
  );
  const fCloth = (l: string, o: Opts = {}) => mk('festival', l, { group: 'Festival clothing', ...o });
  push(
    fCloth('Daytime festival outfits', { qty: 3 }),
    fCloth('Nighttime festival outfits', { qty: 2 }),
    fCloth('Hoodie / fleece / crewneck'),
    fCloth('Lightweight windbreaker'),
    fCloth('Swimsuit'),
    fCloth('Pool towel'),
    fCloth('Sandals / slides'),
    fCloth('Closed-toe shoes / boots'),
    fCloth('Dusty socks', { qty: 4 }),
    fCloth('Underwear / basics (3–4 days)', { qty: 4 }),
    fCloth('Sleep clothes'),
    fCloth('Clean Sunday travel outfit'),
  );
  const fNice = (l: string, o: Opts = {}) => mk('festival', l, { group: 'Nice-to-have', priority: 'nice', ...o });
  push(
    fNice('Disposable / point-and-shoot camera'),
    fNice('Film camera'),
    fNice('Notebook + pen'),
    fNice('Face wipes'),
    fNice('Dry shampoo'),
    fNice('Hair ties / clips'),
    fNice('Mini mirror'),
    fNice('Tote bag'),
    fNice('Sarong / lightweight blanket'),
    fNice('One fun accessory / costume piece'),
    fNice('Extra hydration packet'),
  );

  // ---- B. Van Basecamp ----------------------------------------------------
  const vComfort = (l: string, o: Opts = {}) => mk('van', l, { group: 'Comfort', ...o });
  push(
    vComfort('Two camp chairs', { qty: 2, needBuy: true, shop: 'Target / general', priority: 'nice' }),
    vComfort('Small outdoor blanket'),
    vComfort('Compact picnic mat'),
    vComfort('Rechargeable lantern', { needCharge: true }),
    vComfort('Headlamps', { qty: 2 }),
    vComfort('Small battery-powered fan', { needCharge: true }),
    vComfort('Throw blanket'),
    vComfort('Pillowcases / familiar blanket'),
    vComfort('Eye masks', { qty: 2 }),
    vComfort('Earplugs'),
    vComfort('White-noise option', { priority: 'nice' }),
  );
  const vClean = (l: string, o: Opts = {}) => mk('van', l, { group: 'Campsite / cleanup', ...o });
  push(
    vClean('Bug spray', { needBuy: true, shop: 'Pharmacy' }),
    vClean('Bug-repellent wipes'),
    vClean('Camp towel'),
    vClean('Extra microfiber towels'),
    vClean('Paper towels', { needBuy: true, shop: 'Target / general' }),
    vClean('Trash bags', { needBuy: true, shop: 'Target / general' }),
    vClean('Ziplock bags', { needBuy: true, shop: 'Target / general' }),
    vClean('Wet wipes'),
    vClean('Dish soap'),
    vClean('Sponge'),
    vClean('Small broom / dustpan', { priority: 'nice' }),
    vClean('Hand soap'),
    vClean('Toilet paper backup'),
    vClean('Lighter / matches (where fire rules permit)'),
    vClean('Small utility knife'),
    vClean('Carabiners', { qty: 4 }),
    vClean('Paracord / clothesline'),
    vClean('Towel clips', { priority: 'nice' }),
  );
  const vWater = (l: string, o: Opts = {}) => mk('van', l, { group: 'Water + food', ...o });
  push(
    vWater('Extra drinking water', { needBuy: true, shop: 'Grocery' }),
    vWater('Electrolytes', { needBuy: true, shop: 'Pharmacy' }),
    vWater('Coffee setup'),
    vWater('Coffee mugs', { qty: 2 }),
    vWater('Cooler snacks'),
    vWater('Fruit', { needBuy: true, shop: 'Grocery' }),
    vWater('Protein bars', { needBuy: true, shop: 'Grocery' }),
    vWater('Trail mix'),
    vWater('Sparkling water', { needBuy: true, shop: 'Grocery' }),
    vWater('Easy breakfast'),
    vWater('One easy campsite dinner'),
  );

  // ---- D. Yosemite + Big Sur Clothing -------------------------------------
  const cl = (l: string, o: Opts = {}) => mk('clothing', l, o);
  push(
    cl('Lightweight puffer'),
    cl('Hoodie'),
    cl('Rain shell / windbreaker'),
    cl('Long pants', { qty: 2 }),
    cl('Hiking socks', { qty: 3 }),
    cl('Comfortable walking shoes'),
    cl('Trail shoes / boots'),
    cl('Beanie'),
    cl('Baseball cap'),
    cl('Warm sleep socks'),
    cl('Swimsuit'),
    cl('Neutral light outfit (granite / meadow)'),
    cl('Darker outfit (redwoods / Big Sur)'),
    cl('One clean easy travel outfit'),
  );

  // ---- E. Roadsurfer Content Kit ------------------------------------------
  const cam = (l: string, o: Opts = {}) => mk('content', l, { group: 'Camera', ...o });
  push(
    cam('Phone', { needCharge: true }),
    cam('Phone tripod / MagSafe mount'),
    cam('Small flexible tripod'),
    cam('Camera body', { needCharge: true }),
    cam('Main lens'),
    cam('Wide lens (interior)'),
    cam('Longer lens (van-in-landscape)'),
    cam('SD cards', { qty: 3, needBuy: true, shop: 'Camera / tech' }),
    cam('Card reader'),
    cam('Extra batteries', { qty: 3, needCharge: true }),
    cam('Battery charger', { needCharge: true }),
    cam('Portable SSD'),
    cam('Lens cloth'),
    cam('ND filter'),
    cam('Pocket LED', { needCharge: true }),
    cam('DJI mic kit', { needCharge: true }),
    cam('Wind protection for mic', { needBuy: true, shop: 'Camera / tech' }),
    cam('Lav clips / tape'),
    cam('Gaffer tape', { needBuy: true, shop: 'Camera / tech' }),
    cam('Rain cover / Ziplock backup'),
  );
  const vanShoot = (l: string, o: Opts = {}) => mk('content', l, { group: 'Van shooting', priority: 'nice', ...o });
  push(
    vanShoot('Suction-cup mount'),
    vanShoot('Clamp mount'),
    vanShoot('Small warm interior light', { needCharge: true }),
    vanShoot('Extension cable'),
    vanShoot('Microfiber cloth for windshield/dash'),
    vanShoot('Neutral blanket'),
    vanShoot('Clean mugs', { qty: 2 }),
    vanShoot('One or two books', { qty: 2 }),
    vanShoot('Film camera'),
    vanShoot('Small lantern', { needCharge: true }),
    vanShoot('Fruit / pastry / coffee props'),
    vanShoot('Tote bag'),
    vanShoot('Travel journal'),
  );
  // Power / electronics (listed under Van Pickup in brief — logically content/tech power)
  const power = (l: string, o: Opts = {}) => mk('content', l, { group: 'Power / electronics', ...o });
  push(
    power('USB-C charging brick'),
    power('Car charger'),
    power('Power strip'),
    power('Long USB-C cable', { needBuy: true, shop: 'Camera / tech' }),
    power('USB-A cable'),
    power('Portable power bank', { needCharge: true, needBuy: true, shop: 'Camera / tech' }),
    power('AirTag in luggage / camera bag'),
  );

  // ---- F. Health + Recovery Kit -------------------------------------------
  const h = (l: string, o: Opts = {}) => mk('health', l, o);
  push(
    h('Electrolytes', { needBuy: true, shop: 'Pharmacy' }),
    h('Magnesium (if part of routine)', { priority: 'nice' }),
    h('Ibuprofen / naproxen'),
    h('Acetaminophen'),
    h('Antacid'),
    h('Stomach relief'),
    h('Allergy medicine'),
    h('Blister bandages'),
    h('Band-Aids'),
    h('Antibiotic ointment'),
    h('Hydrocortisone cream'),
    h('Bug-bite relief'),
    h('Saline spray'),
    h('Eye drops'),
    h('Sunscreen stick'),
    h('SPF lip balm', { needBuy: true, shop: 'Pharmacy' }),
    h('Hand lotion'),
    h('Neck / back topical'),
    h('Small first-aid kit', { needBuy: true, shop: 'Pharmacy', note: 'Restock basics' }),
  );

  // ---- G. Road Food -------------------------------------------------------
  const sun = (l: string, o: Opts = {}) => mk('food', l, { group: 'Sunday reset groceries', needBuy: true, shop: 'Grocery', ...o });
  push(
    sun('Eggs or breakfast burritos'),
    sun('Fruit'),
    sun('Greek yogurt'),
    sun('Coffee'),
    sun('Bagels / bread'),
    sun('Cheese'),
    sun('Sandwich ingredients'),
    sun('Chips / crackers'),
    sun('Sparkling water'),
    sun('Electrolytes', { shop: 'Pharmacy' }),
    sun('Easy dinner'),
  );
  const drive = (l: string, o: Opts = {}) => mk('food', l, { group: 'Mon / Tue drive food', priority: 'nice', ...o });
  push(
    drive('Protein bars', { needBuy: true }),
    drive('Trail mix'),
    drive('Jerky'),
    drive('Fruit'),
    drive('Cold brew'),
    drive('Water'),
    drive('Granola'),
    drive('Peanut butter'),
    drive('Tortillas'),
    drive('Premade salads / wraps'),
    drive('"Pretty" content snacks (cherries, peaches, croissants, strawberries)'),
  );

  return items;
}

function seedShots(): ShotCard[] {
  let s = 0;
  const sid = () => `shot-${(++s).toString().padStart(2, '0')}`;
  const c = (
    leg: ShotCard['leg'],
    title: string,
    mood: string,
    gear: string,
    time: string,
  ): ShotCard => ({ id: sid(), leg, title, mood, gear, time, captured: false, note: '', rating: 0 });

  return [
    // Festival → Van Reset
    c('festival', 'Festival wristband in cupholder', 'Dusty, intimate', 'Phone macro', 'Golden hour'),
    c('festival', 'Festival gear / dusty boots loaded into van', 'Transitional, warm', 'Wide lens', 'Late afternoon'),
    c('festival', 'Side door opening at sunrise', 'Quiet, hopeful', 'Wide lens, tripod', 'Sunrise'),
    c('festival', 'First coffee in the van', 'Cozy, slow', 'Main lens, pocket LED', 'Early morning'),
    c('festival', 'Van pull-away from Deloro Valley', 'Cinematic departure', 'Longer lens', 'Mid-morning'),
    // Yosemite
    c('yosemite', 'Van tiny under granite', 'Epic scale', 'Longer lens', 'Midday / golden'),
    c('yosemite', 'Windshield POV on Tioga Road', 'Driving, expansive', 'Suction mount, wide', 'Midday'),
    c('yosemite', 'Coffee through the side door', 'Calm, alpine', 'Main lens', 'Early morning'),
    c('yosemite', 'Scenic turnout (legal parking only)', 'Grand, still', 'Tripod, ND filter', 'Golden hour'),
    c('yosemite', 'Hiking wide — van small in background', 'Human-in-landscape', 'Longer lens', 'Afternoon'),
    // Big Sur
    c('bigsur', 'Pop-top opening under redwoods', 'Soft, sheltered', 'Wide lens, tripod', 'Morning'),
    c('bigsur', 'Shower / towel / skincare reset', 'Lifestyle, intimate', 'Main lens, warm light', 'Morning'),
    c('bigsur', 'Breakfast from side door', 'Homey, golden', 'Main lens', 'Early morning'),
    c('bigsur', 'Cooking with ocean / redwood atmosphere', 'Sensory, warm', 'Wide + main, mic', 'Late afternoon'),
    c('bigsur', 'Bixby Bridge driving beat', 'Iconic, momentum', 'Longer lens / clamp', 'Golden hour'),
    c('bigsur', 'Coastal grass / walking footage', 'Windy, free', 'Main lens', 'Golden hour'),
    c('bigsur', 'Sunset interior with warm lantern', 'Glowing, soft', 'Warm interior light', 'Blue hour'),
    c('bigsur', 'Van doors closing at blue hour', 'Closing montage', 'Tripod, wide', 'Blue hour'),
  ];
}

function seedVanOps(): CheckItem[] {
  let v = 0;
  const id = () => `ops-${(++v).toString().padStart(2, '0')}`;
  const at = (label: string, group = 'Ask Roadsurfer at pickup'): CheckItem => ({ id: id(), label, done: false, group });
  return [
    at('Locate shore power cable'),
    at('Confirm included adapters'),
    at('Learn fresh-water fill location'),
    at('Learn gray-water controls'),
    at('Learn black-water controls'),
    at('Learn toilet setup / chemicals'),
    at('Check battery monitor'),
    at('Check inverter controls'),
    at('Learn fridge controls'),
    at('Learn stove / propane controls'),
    at('Learn pop-top operation (if included)'),
    at('Learn awning operation'),
    at('Locate fire extinguisher'),
    at('Check tire pressure / spare / roadside kit'),
    at('Write vehicle height in Notes'),
    at('Save roadside assistance phone number'),
    at('Save rental agreement offline'),
    at('Save insurance details offline'),
    at('Ask about generator rules (if applicable)'),
  ];
}

function seedRoutePrep(): CheckItem[] {
  let r = 0;
  const id = () => `prep-${(++r).toString().padStart(2, '0')}`;
  const p = (label: string): CheckItem => ({ id: id(), label, done: false });
  return [
    p('Download Google Maps offline'),
    p('Save campsite reservations offline'),
    p('Check Yosemite conditions'),
    p('Check Highway 1 / Caltrans conditions'),
    p('Confirm campground check-in time'),
    p('Top off fuel before remote stretches'),
    p('Refill fresh water'),
    p('Empty waste tanks at valid dump locations'),
  ];
}

export const ROUTE_LEGS: RouteLeg[] = [
  { num: '01', title: 'Knowhere Festival', mood: 'Dusty, warm, high-energy', focus: 'Opening narrative / festival comedown', accent: 'amber' },
  { num: '02', title: 'Yosemite', mood: 'Cool, alpine, massive scale', focus: 'Granite, meadow, mountain road, clean reset', accent: 'alpine' },
  { num: '03', title: 'Big Sur / Highway 1', mood: 'Redwoods, Pacific wind, soft interior lifestyle', focus: 'Roadsurfer van as mobile suite', accent: 'ocean' },
  { num: '04', title: 'Los Angeles', mood: 'Sunset return / final road-movie ending', focus: 'Closing montage', accent: 'redwood' },
];

export const ROUTE_STOPS = ['Knowhere', 'Yosemite', 'Big Sur', 'Los Angeles'];

/** Build a brand-new app state from seed. */
export function createInitialState(): AppState {
  _n = 0; // reset id counter for deterministic ids per build
  return {
    version: APP_VERSION,
    departureDate: null,
    items: seedItems(),
    shots: seedShots(),
    vanOps: seedVanOps(),
    routePrep: seedRoutePrep(),
  };
}
