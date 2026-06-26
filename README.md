# Knowhere Afterglow

> Festival dust → Yosemite granite → Big Sur Pacific.

A polished, mobile-first mini guide app for a two-person **Knowhere Festival →
Yosemite → Big Sur / Highway 1 → Los Angeles** camper-van road trip. It is a
compact "travel operating system": packing, van setup, content planning, and the
road home — editorial, cinematic, and built to feel great on an iPhone.

No backend, no accounts. Everything persists to `localStorage`.

## Features

- **Home dashboard** — overall packing progress, days-until-departure, quick
  category cards, action shortcuts, and a mini route strip.
- **Packing checklist** (the main experience) — progress ring, status filters
  (All / Need to Buy / Need to Charge / Packed), search, per-item quantity,
  note, category, shop aisle, buy/charge flags, and must / nice-to-have
  priority. Add, edit, and delete custom items. Mark-all-packed and reset.
- **Pack This Way** — a five-container packing system (festival duffel, clean
  road-trip duffel, camp bin, food bin, camera backpack, front-seat pouch).
- **Shopping list** — auto-populated from every "need to buy" item, grouped by
  aisle, with copy-list and clear-purchased.
- **Route** — a vertical journey timeline (Knowhere → Yosemite → Big Sur → LA)
  plus a route-prep checklist.
- **Shot Board** — Roadsurfer content prompts per leg with mood, gear, time of
  day, "captured" toggle, 1–5 rating, and notes.
- **Van Pickup** — a Sprinter operations checklist to walk with the rep, plus
  the power / electronics kit.
- **Export / import** — packing list as Markdown, full app state as JSON.

## Tech

React + TypeScript + Vite. Custom CSS design system, inline SVG icons, zero
runtime dependencies beyond React. `localStorage` persistence.

## Run locally

**Prerequisites:** Node.js

```bash
npm install
npm run dev      # http://localhost:3000
npm run build    # production build → dist/
npm run preview  # preview the production build
```
