import React, { useState } from 'react';
import CreatorView from './CreatorView';
import ConsumerView from './ConsumerView';

export default function App() {
  const [view, setView] = useState<'creator' | 'consumer'>('creator');

  return (
    <div style={{ textAlign: 'center', fontFamily: 'sans-serif' }}>
      <h1>PhotoGram 📸</h1>

      <div style={{ marginBottom: 20 }}>
        <button onClick={() => setView('creator')}>Creator View</button>
        <button onClick={() => setView('consumer')}>Consumer View</button>
      </div>

      {view === 'creator' ? <CreatorView /> : <ConsumerView />}
    </div>
  );
}
