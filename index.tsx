/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
*/

//Vibe coded by ammaar@google.com

import React from 'react';
import ReactDOM from 'react-dom/client';
import GlobeVisualization from './components/GlobeVisualization';

function App() {
  return (
    <>
        <div className="immersive-app">
            <GlobeVisualization />
        </div>
    </>
  );
}

const rootElement = document.getElementById('root');
if (rootElement) {
  const root = ReactDOM.createRoot(rootElement);
  root.render(<React.StrictMode><App /></React.StrictMode>);
}