import { useState, useEffect } from 'react';
import { Phase, SeedAssignments, BracketPicks } from './bracket.types';
import { SeedPicker } from './SeedPicker';
import { Bracket } from './Bracket';
import {
  emptyPicks,
  saveToStorage,
  loadFromStorage,
  clearStorage,
} from './bracketUtils';

export const BracketTool = () => {
  const [phase, setPhase] = useState<Phase>('seed-picker');
  const [seeds, setSeeds] = useState<SeedAssignments>({});
  const [picks, setPicks] = useState<BracketPicks>(emptyPicks());

  // Load from localStorage on mount
  useEffect(() => {
    const saved = loadFromStorage();
    if (saved) {
      setSeeds(saved.seeds);
      setPicks(saved.picks);
      // If seeds were already locked in, go straight to bracket
      const allFilled = Object.keys(saved.seeds).length === 12 &&
        Object.values(saved.seeds).every(Boolean);
      if (allFilled) {
        setPhase('bracket');
      }
    }
  }, []);

  const handleSeedChange = (seed: number, teamName: string) => {
    setSeeds((prev) => {
      const updated = { ...prev, [seed]: teamName };
      if (!teamName) {
        delete updated[seed];
      }
      return updated;
    });
  };

  const handleLockIn = () => {
    const clearedPicks = emptyPicks();
    setPicks(clearedPicks);
    saveToStorage(seeds, clearedPicks);
    setPhase('bracket');
  };

  const handlePicksChange = (newPicks: BracketPicks) => {
    setPicks(newPicks);
    saveToStorage(seeds, newPicks);
  };

  const handleReset = () => {
    clearStorage();
    setSeeds({});
    setPicks(emptyPicks());
    setPhase('seed-picker');
  };

  return (
    <div
      style={{
        background: '#0a0a0a',
        minHeight: '100vh',
        color: '#fff',
      }}
    >
      {/* Phase tabs */}
      <div
        style={{
          display: 'flex',
          borderBottom: '1px solid #1a1a1a',
          padding: '0 16px',
          gap: 0,
        }}
      >
        {(['seed-picker', 'bracket'] as Phase[]).map((p, i) => (
          <button
            key={p}
            onClick={() => phase === 'bracket' && p === 'bracket' ? null : setPhase(p)}
            disabled={p === 'bracket' && phase === 'seed-picker'}
            style={{
              background: 'none',
              border: 'none',
              borderBottom: phase === p ? '2px solid #F97316' : '2px solid transparent',
              color: phase === p ? '#F97316' : '#555',
              fontWeight: 800,
              fontSize: 12,
              letterSpacing: '0.1em',
              textTransform: 'uppercase',
              padding: '14px 16px 12px',
              cursor: p === 'bracket' && phase === 'seed-picker' ? 'not-allowed' : 'pointer',
              fontFamily: "'Barlow Condensed', 'Arial Narrow', Arial, sans-serif",
              transition: 'color 0.2s',
            }}
          >
            {i + 1}. {p === 'seed-picker' ? 'Pick Seeds' : 'Bracket'}
          </button>
        ))}
      </div>

      {/* Phase content */}
      {phase === 'seed-picker' ? (
        <SeedPicker
          seeds={seeds}
          onSeedChange={handleSeedChange}
          onLockIn={handleLockIn}
        />
      ) : (
        <Bracket
          seeds={seeds}
          picks={picks}
          onPicksChange={handlePicksChange}
          onReset={handleReset}
        />
      )}
    </div>
  );
};

export default BracketTool;
