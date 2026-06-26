/**
 * Knowhere Afterglow — app shell + bottom navigation.
 */
import React, { useState } from 'react';
import { StoreProvider } from './store';
import HomeScreen from './components/HomeScreen';
import PackScreen, { type PackView } from './components/PackScreen';
import RouteScreen from './components/RouteScreen';
import ContentScreen from './components/ContentScreen';
import VanScreen from './components/VanScreen';
import {
  IconCamera,
  IconHome,
  IconPack,
  IconRoute,
  IconVan,
} from './components/Icons';

export type Tab = 'home' | 'pack' | 'route' | 'content' | 'van';

const NAV: { key: Tab; label: string; Icon: React.FC<any> }[] = [
  { key: 'home', label: 'Home', Icon: IconHome },
  { key: 'pack', label: 'Pack', Icon: IconPack },
  { key: 'route', label: 'Route', Icon: IconRoute },
  { key: 'content', label: 'Content', Icon: IconCamera },
  { key: 'van', label: 'Van', Icon: IconVan },
];

function Shell() {
  const [tab, setTab] = useState<Tab>('home');
  const [packView, setPackView] = useState<PackView>('list');
  const [addSignal, setAddSignal] = useState(0);
  const scrollRef = React.useRef<HTMLDivElement>(null);

  const navigate = (next: Tab, view?: PackView) => {
    setTab(next);
    if (view) setPackView(view);
    // Snap to top on screen change.
    requestAnimationFrame(() => scrollRef.current?.scrollTo({ top: 0 }));
  };

  const requestAdd = () => {
    setTab('pack');
    setPackView('list');
    setAddSignal((n) => n + 1);
  };

  return (
    <div className="app">
      <div className="scroll" ref={scrollRef}>
        <main className="content-area">
          {tab === 'home' && <HomeScreen navigate={navigate} requestAdd={requestAdd} />}
          {tab === 'pack' && (
            <PackScreen view={packView} setView={setPackView} addSignal={addSignal} />
          )}
          {tab === 'route' && <RouteScreen />}
          {tab === 'content' && <ContentScreen />}
          {tab === 'van' && <VanScreen />}
        </main>
      </div>

      <nav className="bottom-nav">
        {NAV.map(({ key, label, Icon }) => (
          <button
            key={key}
            className={`nav-btn ${tab === key ? 'active' : ''}`}
            onClick={() => navigate(key)}
            aria-current={tab === key}
          >
            <Icon size={22} />
            <span>{label}</span>
          </button>
        ))}
      </nav>
    </div>
  );
}

export default function App() {
  return (
    <StoreProvider>
      <Shell />
    </StoreProvider>
  );
}
