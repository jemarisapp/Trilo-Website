import React, { useState, useEffect } from 'react';
import { Phase, SeedAssignments, BracketPicks } from './bracket.types';
import { SeedPicker } from './SeedPicker';
import { Bracket } from './Bracket';
import {
  emptyPicks,
  saveToStorage,
  loadFromStorage,
  clearStorage,
} from './bracketUtils';
import { exportBracket } from '../exportBracket';

interface BracketToolProps {
  onScanImage?: () => void;
}

export const BracketTool: React.FC<BracketToolProps> = ({ onScanImage }) => {
  const [phase, setPhase] = useState<Phase>('seed-picker');
  const [seeds, setSeeds] = useState<SeedAssignments>({});
  const [picks, setPicks] = useState<BracketPicks>(emptyPicks());
  const [exporting, setExporting] = useState(false);
  const [isMobile, setIsMobile] = useState(() => typeof window !== 'undefined' && window.innerWidth < 640);

  useEffect(() => {
    const onResize = () => setIsMobile(window.innerWidth < 640);
    window.addEventListener('resize', onResize);
    return () => window.removeEventListener('resize', onResize);
  }, []);

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
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  const handlePicksChange = (newPicks: BracketPicks) => {
    setPicks(newPicks);
    saveToStorage(seeds, newPicks);
  };

  const handleReset = () => {
    const clearedPicks = emptyPicks();
    setPicks(clearedPicks);
    saveToStorage(seeds, clearedPicks);
  };

  const handleExport = () => {
    setExporting(true);
    setTimeout(() => {
      try {
        exportBracket(seeds, picks);
      } finally {
        setExporting(false);
      }
    }, 50);
  };

  return (
    <div
      style={{
        background: '#080809',
        minHeight: '100vh',
        color: '#fff',
      }}
    >
      {/* Product Chrome / Top Utility Row */}
      <div
        style={{
          borderBottom: '1px solid #141416',
          background: '#0C0D0F',
          position: 'sticky',
          top: 0,
          zIndex: 10,
        }}
      >
        {/* Tabs + desktop actions row */}
        <div style={{
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'space-between',
          padding: isMobile ? '0 16px' : '0 24px',
          height: isMobile ? '48px' : '60px',
        }}>
          {/* Phase Tabs */}
          <div style={{ display: 'flex', height: '100%', gap: 4 }}>
            {(['seed-picker', 'bracket'] as Phase[]).map((p, i) => {
              const isActive = phase === p;
              return (
                <button
                  key={p}
                  onClick={() => isActive ? null : setPhase(p)}
                  style={{
                    background: 'none',
                    border: 'none',
                    borderBottom: isActive ? '2px solid #F97316' : '2px solid transparent',
                    color: isActive ? '#fff' : '#666',
                    fontWeight: isActive ? 600 : 500,
                    fontSize: isMobile ? 12 : 14,
                    letterSpacing: '0.02em',
                    padding: isMobile ? '0 8px' : '0 12px',
                    display: 'flex',
                    alignItems: 'center',
                    cursor: isActive ? 'default' : 'pointer',
                    transition: 'color 0.2s, border-color 0.2s',
                    height: '100%',
                    whiteSpace: 'nowrap',
                  }}
                >
                  {i + 1}. {p === 'seed-picker' ? 'Pick Seeds' : 'Bracket View'}
                </button>
              );
            })}
          </div>

          {/* Action Buttons — desktop only (inline), hidden on mobile */}
          {!isMobile && phase === 'bracket' && (
            <div style={{ display: 'flex', alignItems: 'center', gap: 12 }}>
              <button
                onClick={handleReset}
                style={{
                  background: 'transparent',
                  border: '1px solid #202226',
                  color: '#999',
                  borderRadius: '6px',
                  padding: '8px 16px',
                  fontSize: 13,
                  fontWeight: 600,
                  cursor: 'pointer',
                  transition: 'all 0.15s ease',
                }}
                onMouseEnter={(e) => {
                  (e.currentTarget as HTMLButtonElement).style.color = '#fff';
                  (e.currentTarget as HTMLButtonElement).style.borderColor = '#444';
                }}
                onMouseLeave={(e) => {
                  (e.currentTarget as HTMLButtonElement).style.color = '#999';
                  (e.currentTarget as HTMLButtonElement).style.borderColor = '#202226';
                }}
              >
                Reset
              </button>

              <button
                onClick={handleExport}
                disabled={exporting}
                style={{
                  background: exporting ? '#2a1a08' : '#F97316',
                  color: '#fff',
                  border: 'none',
                  borderRadius: '6px',
                  padding: '8px 20px',
                  fontSize: 13,
                  fontWeight: 600,
                  cursor: exporting ? 'wait' : 'pointer',
                  opacity: exporting ? 0.7 : 1,
                  display: 'flex',
                  alignItems: 'center',
                  gap: 8,
                  transition: 'background 0.15s ease',
                  boxShadow: '0 2px 8px rgba(249,115,22,0.2)',
                }}
                onMouseEnter={(e) => {
                  if (!exporting) (e.currentTarget as HTMLButtonElement).style.background = '#ea6a0a';
                }}
                onMouseLeave={(e) => {
                  if (!exporting) (e.currentTarget as HTMLButtonElement).style.background = '#F97316';
                }}
              >
                {exporting ? 'Generating...' : (
                  <>
                    <svg width="14" height="14" viewBox="0 0 15 15" fill="none">
                      <rect x="1" y="1" width="13" height="10" rx="1.5" stroke="white" strokeWidth="1.6" fill="none" />
                      <path d="M5 13.5H10" stroke="white" strokeWidth="1.6" strokeLinecap="round" />
                      <path d="M7.5 11V13.5" stroke="white" strokeWidth="1.6" strokeLinecap="round" />
                    </svg>
                    Export Bracket
                  </>
                )}
              </button>
            </div>
          )}
        </div>

        {/* Mobile action buttons row — shown below tabs when in bracket phase */}
        {isMobile && phase === 'bracket' && (
          <div style={{
            display: 'flex',
            alignItems: 'center',
            gap: 8,
            padding: '8px 16px',
            borderTop: '1px solid #141416',
          }}>
            <button
              onClick={handleReset}
              style={{
                background: 'transparent',
                border: '1px solid #202226',
                color: '#999',
                borderRadius: '6px',
                padding: '7px 14px',
                fontSize: 12,
                fontWeight: 600,
                cursor: 'pointer',
                flex: '0 0 auto',
              }}
            >
              Reset Picks
            </button>

            <button
              onClick={handleExport}
              disabled={exporting}
              style={{
                background: exporting ? '#2a1a08' : '#F97316',
                color: '#fff',
                border: 'none',
                borderRadius: '6px',
                padding: '7px 14px',
                fontSize: 12,
                fontWeight: 600,
                cursor: exporting ? 'wait' : 'pointer',
                opacity: exporting ? 0.7 : 1,
                display: 'flex',
                alignItems: 'center',
                gap: 6,
                flex: 1,
                justifyContent: 'center',
                boxShadow: '0 2px 8px rgba(249,115,22,0.2)',
              }}
            >
              {exporting ? 'Generating...' : (
                <>
                  <svg width="13" height="13" viewBox="0 0 15 15" fill="none">
                    <rect x="1" y="1" width="13" height="10" rx="1.5" stroke="white" strokeWidth="1.6" fill="none" />
                    <path d="M5 13.5H10" stroke="white" strokeWidth="1.6" strokeLinecap="round" />
                    <path d="M7.5 11V13.5" stroke="white" strokeWidth="1.6" strokeLinecap="round" />
                  </svg>
                  Export Bracket
                </>
              )}
            </button>
          </div>
        )}
      </div>

      {/* Phase content */}
      {phase === 'seed-picker' ? (
        <SeedPicker
          seeds={seeds}
          onSeedChange={handleSeedChange}
          onLockIn={handleLockIn}
          onScanImage={onScanImage}
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
