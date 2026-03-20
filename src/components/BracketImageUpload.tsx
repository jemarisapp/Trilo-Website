import { useState, useRef, useCallback } from 'react';
import { SeedAssignments } from './bracket.types';
import { parseBracketImage } from '../bracketVision';
import { TeamSearchInput } from './TeamSearchInput';

interface BracketImageUploadProps {
  onSeedsDetected: (seeds: SeedAssignments) => void;
  onClose: () => void;
}

type UploadState = 'idle' | 'loading' | 'done' | 'error';

const FONT = "'Barlow Condensed', 'Arial Narrow', Arial, sans-serif";

export const BracketImageUpload = ({ onSeedsDetected, onClose }: BracketImageUploadProps) => {
  const [state, setState] = useState<UploadState>('idle');
  const [previewUrl, setPreviewUrl] = useState<string | null>(null);
  const [detectedSeeds, setDetectedSeeds] = useState<SeedAssignments | null>(null);
  const [errorMsg, setErrorMsg] = useState('');
  const [dragging, setDragging] = useState(false);
  const [editingSeed, setEditingSeed] = useState<number | null>(null);
  const fileRef = useRef<HTMLInputElement>(null);

  const processFile = useCallback(async (file: File) => {
    if (!file.type.startsWith('image/')) {
      setErrorMsg('Please upload an image file (JPG, PNG, WEBP, etc.).');
      setState('error');
      return;
    }

    const url = URL.createObjectURL(file);
    setPreviewUrl(url);
    setState('loading');
    setDetectedSeeds(null);
    setErrorMsg('');

    try {
      const seeds = await parseBracketImage(file);
      setDetectedSeeds(seeds);
      setState('done');
    } catch (err: unknown) {
      setErrorMsg(err instanceof Error ? err.message : 'Failed to parse bracket image.');
      setState('error');
    }
  }, []);

  const handleDrop = (e: React.DragEvent) => {
    e.preventDefault();
    setDragging(false);
    const file = e.dataTransfer.files?.[0];
    if (file) processFile(file);
  };

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) processFile(file);
  };

  const handleRetry = () => {
    setState('idle');
    setPreviewUrl(null);
    setDetectedSeeds(null);
    setErrorMsg('');
    if (fileRef.current) fileRef.current.value = '';
  };

  const detectedCount = detectedSeeds ? Object.keys(detectedSeeds).length : 0;
  const allDetected = detectedCount === 12;

  return (
    /* Overlay */
    <div
      style={{
        position: 'fixed',
        inset: 0,
        background: 'rgba(0,0,0,0.85)',
        zIndex: 999,
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        padding: '16px',
        backdropFilter: 'blur(4px)',
      }}
      onClick={(e) => {
        if (e.target === e.currentTarget) onClose();
      }}
    >
      {/* Modal */}
      <div
        style={{
          background: '#111',
          border: '1px solid #222',
          borderRadius: 16,
          width: '100%',
          maxWidth: 560,
          maxHeight: '90vh',
          overflowY: 'auto',
          padding: '28px 24px',
          fontFamily: FONT,
          position: 'relative',
        }}
      >
        {/* Close */}
        <button
          onClick={onClose}
          style={{
            position: 'absolute',
            top: 16,
            right: 16,
            background: 'none',
            border: 'none',
            color: '#555',
            cursor: 'pointer',
            fontSize: 20,
            lineHeight: 1,
            padding: 4,
          }}
          aria-label="Close"
        >
          ✕
        </button>

        {/* Header */}
        <div style={{ marginBottom: 24 }}>
          <div
            style={{
              display: 'inline-block',
              background: '#F97316',
              color: '#000',
              fontWeight: 800,
              fontSize: 11,
              letterSpacing: '0.15em',
              padding: '3px 10px',
              borderRadius: 4,
              marginBottom: 10,
              textTransform: 'uppercase',
            }}
          >
            AI-Powered
          </div>
          <h2
            style={{
              color: '#fff',
              fontSize: 26,
              fontWeight: 800,
              margin: 0,
              letterSpacing: '-0.01em',
              textTransform: 'uppercase',
            }}
          >
            Scan Bracket Image
          </h2>
          <p style={{ color: '#666', fontSize: 14, marginTop: 6, marginBottom: 0 }}>
            Upload a photo or screenshot of your CFP bracket and we'll auto-fill all 12 seeds.
          </p>
        </div>

        {/* ── IDLE ── */}
        {state === 'idle' && (
          <div
            onDrop={handleDrop}
            onDragOver={(e) => { e.preventDefault(); setDragging(true); }}
            onDragLeave={() => setDragging(false)}
            onClick={() => fileRef.current?.click()}
            style={{
              border: `2px dashed ${dragging ? '#F97316' : '#333'}`,
              borderRadius: 12,
              padding: '48px 24px',
              textAlign: 'center',
              cursor: 'pointer',
              transition: 'border-color 0.2s, background 0.2s',
              background: dragging ? 'rgba(249,115,22,0.05)' : 'transparent',
            }}
          >
            <svg width="40" height="36" viewBox="0 0 40 36" fill="none" xmlns="http://www.w3.org/2000/svg" style={{ display: 'block', margin: '0 auto 12px', opacity: 0.5 }}>
              <path d="M15 4L12 8H4C2.9 8 2 8.9 2 10V32C2 33.1 2.9 34 4 34H36C37.1 34 38 33.1 38 32V10C38 8.9 37.1 8 36 8H28L25 4H15Z" stroke="#aaa" strokeWidth="2" strokeLinejoin="round" fill="none"/>
              <circle cx="20" cy="21" r="7" stroke="#aaa" strokeWidth="2" fill="none"/>
              <circle cx="20" cy="21" r="3.5" fill="#aaa"/>
              <rect x="30" y="12" width="4" height="3" rx="1" fill="#aaa"/>
            </svg>
            <div style={{ color: '#fff', fontWeight: 800, fontSize: 16, textTransform: 'uppercase', letterSpacing: '0.05em' }}>
              Drop image here
            </div>
            <div style={{ color: '#555', fontSize: 13, marginTop: 6 }}>
              or click to browse &mdash; JPG, PNG, WEBP
            </div>
            <input
              ref={fileRef}
              type="file"
              accept="image/*"
              onChange={handleInputChange}
              style={{ display: 'none' }}
            />
          </div>
        )}

        {/* ── LOADING ── */}
        {state === 'loading' && (
          <div style={{ textAlign: 'center' }}>
            {previewUrl && (
              <img
                src={previewUrl}
                alt="Bracket preview"
                style={{ width: '100%', maxHeight: 200, objectFit: 'contain', borderRadius: 8, marginBottom: 20, opacity: 0.7 }}
              />
            )}
            <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', gap: 12 }}>
              <Spinner />
              <span style={{ color: '#aaa', fontSize: 15, fontWeight: 700, textTransform: 'uppercase', letterSpacing: '0.08em' }}>
                Scanning bracket&hellip;
              </span>
            </div>
            <p style={{ color: '#444', fontSize: 13, marginTop: 12 }}>
              Trilo is reading your bracket image
            </p>
          </div>
        )}

        {/* ── DONE ── */}
        {state === 'done' && detectedSeeds && (
          <div>
            {previewUrl && (
              <img
                src={previewUrl}
                alt="Bracket preview"
                style={{ width: '100%', maxHeight: 160, objectFit: 'contain', borderRadius: 8, marginBottom: 16, opacity: 0.85 }}
              />
            )}

            {/* Detection status */}
            <div
              style={{
                background: allDetected ? 'rgba(34,197,94,0.08)' : 'rgba(249,115,22,0.08)',
                border: `1px solid ${allDetected ? '#22c55e33' : '#F9731633'}`,
                borderRadius: 8,
                padding: '10px 14px',
                marginBottom: 16,
                display: 'flex',
                alignItems: 'center',
                gap: 10,
              }}
            >
              {allDetected ? (
                <svg width="20" height="20" viewBox="0 0 20 20" fill="none" style={{ flexShrink: 0 }}>
                  <circle cx="10" cy="10" r="9" fill="rgba(34,197,94,0.2)" stroke="#22c55e" strokeWidth="1.5"/>
                  <path d="M6 10L8.5 12.5L14 7" stroke="#22c55e" strokeWidth="1.6" strokeLinecap="round" strokeLinejoin="round"/>
                </svg>
              ) : (
                <svg width="20" height="20" viewBox="0 0 20 20" fill="none" style={{ flexShrink: 0 }}>
                  <path d="M10 2L18.5 17H1.5L10 2Z" fill="rgba(249,115,22,0.15)" stroke="#F97316" strokeWidth="1.5" strokeLinejoin="round"/>
                  <path d="M10 8V11.5" stroke="#F97316" strokeWidth="1.6" strokeLinecap="round"/>
                  <circle cx="10" cy="14.5" r="0.8" fill="#F97316"/>
                </svg>
              )}
              <div>
                <div style={{ color: allDetected ? '#22c55e' : '#F97316', fontWeight: 800, fontSize: 13, textTransform: 'uppercase', letterSpacing: '0.08em' }}>
                  {allDetected ? 'All 12 seeds detected' : `${detectedCount} of 12 seeds detected`}
                </div>
                {!allDetected && (
                  <div style={{ color: '#666', fontSize: 12, marginTop: 2 }}>
                    Missing seeds will remain blank for you to fill in manually.
                  </div>
                )}
              </div>
            </div>

            {/* Seed list */}
            <div
              style={{
                display: 'grid',
                gridTemplateColumns: '1fr 1fr',
                gridTemplateRows: 'repeat(6, auto)',
                gridAutoFlow: 'column',
                gap: 6,
                marginBottom: 20,
              }}
            >
              {Array.from({ length: 12 }, (_, i) => i + 1).map((seed) => {
                const team = detectedSeeds[seed];
                const isEditing = editingSeed === seed;
                const excludeNames = Object.entries(detectedSeeds)
                  .filter(([s]) => Number(s) !== seed)
                  .map(([, n]) => n)
                  .filter(Boolean) as string[];

                if (isEditing) {
                  return (
                    <div
                      key={seed}
                      style={{
                        background: '#1a1a1a',
                        border: '1px solid #F97316',
                        borderRadius: 6,
                        padding: '6px 8px',
                        display: 'flex',
                        alignItems: 'center',
                        gap: 8,
                      }}
                    >
                      <div
                        style={{
                          width: 22,
                          height: 22,
                          borderRadius: 4,
                          background: seed <= 4 ? '#F97316' : '#333',
                          color: seed <= 4 ? '#000' : '#fff',
                          display: 'flex',
                          alignItems: 'center',
                          justifyContent: 'center',
                          fontWeight: 800,
                          fontSize: 12,
                          flexShrink: 0,
                        }}
                      >
                        {seed}
                      </div>
                      <div style={{ flex: 1, minWidth: 0 }}>
                        <TeamSearchInput
                          value={team ?? ''}
                          onChange={(name) => {
                            setDetectedSeeds((prev) => ({ ...prev, [seed]: name }));
                            if (name) setEditingSeed(null);
                          }}
                          excludeNames={excludeNames}
                          placeholder={`Seed ${seed} team...`}
                        />
                      </div>
                      <button
                        onClick={() => setEditingSeed(null)}
                        style={{
                          background: 'none',
                          border: 'none',
                          color: '#555',
                          cursor: 'pointer',
                          padding: '2px 4px',
                          fontSize: 13,
                          flexShrink: 0,
                        }}
                      >
                        ✕
                      </button>
                    </div>
                  );
                }

                return (
                  <div
                    key={seed}
                    style={{
                      background: team ? '#1a1a1a' : '#0d0d0d',
                      border: `1px solid ${team ? '#2a2a2a' : '#1a1a1a'}`,
                      borderRadius: 6,
                      padding: '7px 10px',
                      display: 'flex',
                      alignItems: 'center',
                      gap: 8,
                    }}
                  >
                    <div
                      style={{
                        width: 22,
                        height: 22,
                        borderRadius: 4,
                        background: seed <= 4 ? '#F97316' : '#333',
                        color: seed <= 4 ? '#000' : '#fff',
                        display: 'flex',
                        alignItems: 'center',
                        justifyContent: 'center',
                        fontWeight: 800,
                        fontSize: 12,
                        flexShrink: 0,
                      }}
                    >
                      {seed}
                    </div>
                    <span
                      style={{
                        color: team ? '#fff' : '#333',
                        fontSize: 13,
                        fontWeight: 700,
                        overflow: 'hidden',
                        textOverflow: 'ellipsis',
                        whiteSpace: 'nowrap',
                        flex: 1,
                      }}
                    >
                      {team ?? '—'}
                    </span>
                    <button
                      onClick={() => setEditingSeed(seed)}
                      title="Edit team"
                      style={{
                        background: 'none',
                        border: 'none',
                        cursor: 'pointer',
                        padding: '2px 4px',
                        flexShrink: 0,
                        opacity: 0.4,
                        display: 'flex',
                        alignItems: 'center',
                        transition: 'opacity 0.15s',
                      }}
                      onMouseEnter={(e) => (e.currentTarget.style.opacity = '1')}
                      onMouseLeave={(e) => (e.currentTarget.style.opacity = '0.4')}
                    >
                      <svg width="13" height="13" viewBox="0 0 13 13" fill="none" xmlns="http://www.w3.org/2000/svg">
                        <path d="M9 1.5L11.5 4L4 11.5H1.5V9L9 1.5Z" stroke="#aaa" strokeWidth="1.4" strokeLinejoin="round" fill="none"/>
                        <path d="M7.5 3L10 5.5" stroke="#aaa" strokeWidth="1.4" strokeLinecap="round"/>
                      </svg>
                    </button>
                  </div>
                );
              })}
            </div>

            {/* Actions */}
            <div style={{ display: 'flex', gap: 10 }}>
              <button
                onClick={() => onSeedsDetected(detectedSeeds)}
                style={{
                  flex: 1,
                  background: 'linear-gradient(135deg, #F97316 0%, #ea6a0a 100%)',
                  color: '#000',
                  border: 'none',
                  borderRadius: 8,
                  padding: '13px 0',
                  fontWeight: 800,
                  fontSize: 14,
                  letterSpacing: '0.08em',
                  textTransform: 'uppercase',
                  cursor: 'pointer',
                  fontFamily: FONT,
                }}
              >
                Apply Seeds
              </button>
              <button
                onClick={handleRetry}
                style={{
                  flex: 1,
                  background: 'none',
                  color: '#888',
                  border: '1px solid #333',
                  borderRadius: 8,
                  padding: '13px 0',
                  fontWeight: 700,
                  fontSize: 14,
                  letterSpacing: '0.08em',
                  textTransform: 'uppercase',
                  cursor: 'pointer',
                  fontFamily: FONT,
                }}
              >
                Try Another
              </button>
            </div>
          </div>
        )}

        {/* ── ERROR ── */}
        {state === 'error' && (
          <div style={{ textAlign: 'center' }}>
            <svg width="44" height="44" viewBox="0 0 44 44" fill="none" style={{ display: 'block', margin: '0 auto 12px' }}>
              <path d="M22 4L41 38H3L22 4Z" fill="rgba(239,68,68,0.12)" stroke="#ef4444" strokeWidth="2" strokeLinejoin="round"/>
              <path d="M22 16V26" stroke="#ef4444" strokeWidth="2.2" strokeLinecap="round"/>
              <circle cx="22" cy="32" r="1.5" fill="#ef4444"/>
            </svg>
            <div
              style={{
                background: 'rgba(239,68,68,0.08)',
                border: '1px solid rgba(239,68,68,0.25)',
                borderRadius: 8,
                padding: '14px 16px',
                marginBottom: 20,
                textAlign: 'left',
              }}
            >
              <div style={{ color: '#ef4444', fontWeight: 800, fontSize: 13, textTransform: 'uppercase', letterSpacing: '0.08em', marginBottom: 6 }}>
                Error
              </div>
              <div style={{ color: '#aaa', fontSize: 13, whiteSpace: 'pre-wrap', lineHeight: 1.5 }}>
                {errorMsg}
              </div>
            </div>
            <button
              onClick={handleRetry}
              style={{
                background: '#222',
                color: '#fff',
                border: '1px solid #333',
                borderRadius: 8,
                padding: '12px 28px',
                fontWeight: 700,
                fontSize: 14,
                letterSpacing: '0.08em',
                textTransform: 'uppercase',
                cursor: 'pointer',
                fontFamily: FONT,
              }}
            >
              Try Again
            </button>
          </div>
        )}
      </div>
    </div>
  );
};

function Spinner() {
  return (
    <div
      style={{
        width: 20,
        height: 20,
        border: '2px solid #333',
        borderTopColor: '#F97316',
        borderRadius: '50%',
        animation: 'spin 0.7s linear infinite',
        flexShrink: 0,
      }}
    >
      <style>{`@keyframes spin { to { transform: rotate(360deg); } }`}</style>
    </div>
  );
}
