/**
 * "Pack This Way" — the five-container packing system diagram.
 */
import React from 'react';
import { IconBag, IconBin, IconCamera, IconVan } from './Icons';

interface Container {
  tag: string;
  name: string;
  desc: string;
  accent: string;
  Icon: React.FC<any>;
}

const CONTAINERS: Container[] = [
  { tag: 'Bag 1', name: 'Festival Duffel', desc: 'Everything needed Thursday–Sunday morning.', accent: 'amber', Icon: IconBag },
  { tag: 'Bag 2', name: 'Clean Road-Trip Duffel', desc: 'Fresh clothes, Yosemite layers, Big Sur outfits. Stays clean and separate from festival dust.', accent: 'ocean', Icon: IconBag },
  { tag: 'Bin 1', name: 'Camp Supplies', desc: 'Lanterns, towels, toiletries, wipes, trash bags, blankets, bug spray.', accent: 'redwood', Icon: IconBin },
  { tag: 'Bin 2', name: 'Food + Coffee', desc: 'Dry food, snacks, coffee, mugs, utensils.', accent: 'amber', Icon: IconBin },
  { tag: 'Backpack', name: 'Camera Backpack', desc: 'Never gets buried in the van.', accent: 'alpine', Icon: IconCamera },
  { tag: 'Pouch', name: 'Front-Seat Pouch', desc: 'Wallet, IDs, reservation screenshots, chargers, sunglasses, sunscreen, water, headlamp.', accent: 'ocean', Icon: IconVan },
];

export default function PackThisWay() {
  return (
    <div className="pack-way">
      <div className="callout">
        <span className="callout-title">Why this matters</span>
        <p>
          Keep Sunday clean clothes separate from dusty festival stuff. The shift
          from Knowhere to Yosemite should feel like a full reset.
        </p>
      </div>

      <div className="container-grid">
        {CONTAINERS.map((c, i) => (
          <div key={c.name} className={`container-card accent-${c.accent}`} style={{ animationDelay: `${i * 60}ms` }}>
            <div className="container-icon"><c.Icon size={22} /></div>
            <div className="container-text">
              <span className="container-tag">{c.tag}</span>
              <h4>{c.name}</h4>
              <p>{c.desc}</p>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
