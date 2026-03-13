import React, { useState, useEffect } from 'react';
import { BracketTool } from '../src/components/BracketTool';
import { BracketImageUpload } from '../src/components/BracketImageUpload';
import { exportBracket } from '../src/exportBracket';
import { saveToStorage, emptyPicks } from '../src/components/bracketUtils';
import { SeedAssignments } from '../src/components/bracket.types';

const STORAGE_KEY = 'trilo_cfp_bracket';
const FONT = "'Barlow Condensed', 'Arial Narrow', Arial, sans-serif";

function loadState() {
  try {
    const raw = localStorage.getItem(STORAGE_KEY);
    if (!raw) return null;
    return JSON.parse(raw);
  } catch {
    return null;
  }
}

function isBracketActive(state: ReturnType<typeof loadState>): boolean {
  if (!state?.seeds) return false;
  return (
    Object.keys(state.seeds).length === 12 &&
    Object.values(state.seeds).every(Boolean)
  );
}

export const BracketPage: React.FC = () => {
  const [showExport, setShowExport] = useState(false);
  const [exporting, setExporting] = useState(false);
  const [showUpload, setShowUpload] = useState(false);
  // Incrementing this key forces BracketTool to remount and re-read from localStorage
  const [mountKey, setMountKey] = useState(0);

  useEffect(() => {
    const check = () => {
      const state = loadState();
      setShowExport(isBracketActive(state));
    };
    check();
    const id = setInterval(check, 800);
    window.addEventListener('storage', check);
    return () => {
      clearInterval(id);
      window.removeEventListener('storage', check);
    };
  }, []);

  const handleExport = () => {
    const state = loadState();
    if (!state) return;
    setExporting(true);
    // Small delay so the "Generating..." label renders before the canvas work blocks
    setTimeout(() => {
      try {
        exportBracket(state.seeds, state.picks);
      } finally {
        setExporting(false);
      }
    }, 50);
  };

  const handleSeedsDetected = (seeds: SeedAssignments) => {
    // Persist seeds to localStorage so BracketTool picks them up on remount
    saveToStorage(seeds, emptyPicks());
    setShowUpload(false);
    // Remount BracketTool so it reads fresh state from localStorage
    setMountKey((k) => k + 1);
  };

  return (
    <div style={{ width: '100%', padding: 0, margin: 0, paddingTop: '72px' }}>
      {/* Main bracket tool — key forces remount when seeds are applied from image */}
      <BracketTool key={mountKey} onScanImage={() => setShowUpload(true)} />

      {/* Export section */}
      {showExport && (
        <div
          style={{
            background: '#0a0a0a',
            borderTop: '1px solid #1a1a2a',
            padding: '28px 16px 40px',
            display: 'flex',
            flexDirection: 'column',
            alignItems: 'center',
            gap: '10px',
          }}
        >
          <p
            style={{
              color: '#555',
              fontSize: '13px',
              margin: 0,
              fontFamily: FONT,
              letterSpacing: '0.08em',
              textTransform: 'uppercase',
            }}
          >
            View or screenshot your bracket
          </p>

          <button
            onClick={handleExport}
            disabled={exporting}
            style={{
              background: exporting
                ? '#2a1a08'
                : 'linear-gradient(135deg, #F97316 0%, #ea6a0a 100%)',
              color: '#fff',
              border: 'none',
              borderRadius: '10px',
              padding: '14px 36px',
              fontSize: '16px',
              fontFamily: "'Barlow Condensed', Arial Narrow, Arial, sans-serif",
              fontWeight: 800,
              letterSpacing: '0.1em',
              textTransform: 'uppercase',
              cursor: exporting ? 'not-allowed' : 'pointer',
              minHeight: '52px',
              minWidth: '220px',
              opacity: exporting ? 0.6 : 1,
              transition: 'opacity 0.2s, transform 0.1s',
              boxShadow: exporting ? 'none' : '0 4px 20px rgba(249,115,22,0.35)',
            }}
            onMouseEnter={(e) => {
              if (!exporting) (e.target as HTMLButtonElement).style.transform = 'scale(1.03)';
            }}
            onMouseLeave={(e) => {
              (e.target as HTMLButtonElement).style.transform = 'scale(1)';
            }}
          >
            {exporting ? 'Generating...' : (
              <span style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', gap: 8 }}>
                <svg width="15" height="15" viewBox="0 0 15 15" fill="none">
                  <rect x="1" y="1" width="13" height="10" rx="1.5" stroke="white" strokeWidth="1.6" fill="none"/>
                  <path d="M5 13.5H10" stroke="white" strokeWidth="1.6" strokeLinecap="round"/>
                  <path d="M7.5 11V13.5" stroke="white" strokeWidth="1.6" strokeLinecap="round"/>
                </svg>
                View Bracket Image
              </span>
            )}
          </button>
        </div>
      )}

      {/* Upload modal */}
      {showUpload && (
        <BracketImageUpload
          onSeedsDetected={handleSeedsDetected}
          onClose={() => setShowUpload(false)}
        />
      )}
    </div>
  );
};
