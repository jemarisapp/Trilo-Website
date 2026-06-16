import { SeedAssignments } from './bracket.types';
import { TeamSearchInput } from './TeamSearchInput';
import { getTeam } from './teams';
import { allSeedsFilled } from './bracketUtils';

interface SeedPickerProps {
  seeds: SeedAssignments;
  onSeedChange: (seed: number, teamName: string) => void;
  onLockIn: () => void;
  onScanImage?: () => void;
}

// Match the Bracket View color palette exactly
const C = {
  cardBg:        '#090A0C',
  cardBorder:    '#15171B',
  seedBgIdle:    '#161719',
  seedColorIdle: '#5E6168',
  roundLabel:    '#5E6370',
  panelBg:       '#090A0C',
};

const FONT_HEADING = "'Barlow Condensed', 'Arial Narrow', Arial, sans-serif";
const FONT_BODY    = "system-ui, -apple-system, sans-serif";

const SEED_LABELS: Record<number, string> = {
  1: 'BYE', 2: 'BYE', 3: 'BYE', 4: 'BYE',
  5: 'R1', 6: 'R1', 7: 'R1', 8: 'R1',
  9: 'R1', 10: 'R1', 11: 'R1', 12: 'R1',
};

export const SeedPicker = ({ seeds, onSeedChange, onLockIn, onScanImage }: SeedPickerProps) => {
  const assignedNames = Object.values(seeds).filter(Boolean) as string[];
  const filled = allSeedsFilled(seeds);
  const count = assignedNames.length;

  return (
    <div style={{
      maxWidth: 760,
      margin: '0 auto',
      padding: '24px 16px',
      fontFamily: FONT_BODY,
    }}>
      <style>{`
        .sp-section-labels { display: grid; grid-template-columns: 1fr 1fr; gap: 0 16px; margin-bottom: 8px; }
        .sp-seed-grid { display: grid; grid-template-columns: 1fr 1fr; grid-template-rows: repeat(6, auto); grid-auto-flow: column; gap: 6px; margin-bottom: 24px; }
        @media (max-width: 560px) {
          .sp-section-labels { grid-template-columns: 1fr; }
          .sp-section-labels > div:last-child { display: none; }
          .sp-seed-grid { grid-template-columns: 1fr; grid-template-rows: unset; grid-auto-flow: row; }
        }
      `}</style>

      {/* ── Header ── */}
      <div style={{ marginBottom: 24, textAlign: 'center' }}>
        <div style={{
          display: 'inline-block',
          background: '#F97316',
          color: '#000',
          fontWeight: 800,
          fontSize: 11,
          letterSpacing: '0.15em',
          padding: '4px 12px',
          borderRadius: 4,
          marginBottom: 12,
          textTransform: 'uppercase',
          fontFamily: FONT_HEADING,
        }}>
          Step 1 of 2
        </div>
        <h2 style={{
          color: '#fff',
          fontSize: 28,
          fontWeight: 800,
          margin: 0,
          letterSpacing: '0.01em',
          fontFamily: FONT_HEADING,
          textTransform: 'uppercase',
        }}>
          Assign Your Seeds
        </h2>
        <p style={{ color: C.roundLabel, fontSize: 14, marginTop: 8, marginBottom: 0, fontFamily: FONT_BODY }}>
          Assign all 12 seeds to build your bracket.
        </p>
      </div>

      {/* ── Scan banner ── */}
      {onScanImage && (
        <button
          onClick={onScanImage}
          style={{
            width: '100%',
            background: 'rgba(249,115,22,0.06)',
            border: '1px solid rgba(249,115,22,0.18)',
            borderRadius: 10,
            padding: '13px 16px',
            marginBottom: 16,
            display: 'flex',
            alignItems: 'center',
            gap: 12,
            cursor: 'pointer',
            textAlign: 'left',
            transition: 'border-color 0.2s, background 0.2s',
            fontFamily: FONT_HEADING,
          }}
          onMouseEnter={(e) => {
            (e.currentTarget as HTMLButtonElement).style.borderColor = 'rgba(249,115,22,0.45)';
            (e.currentTarget as HTMLButtonElement).style.background   = 'rgba(249,115,22,0.1)';
          }}
          onMouseLeave={(e) => {
            (e.currentTarget as HTMLButtonElement).style.borderColor = 'rgba(249,115,22,0.18)';
            (e.currentTarget as HTMLButtonElement).style.background   = 'rgba(249,115,22,0.06)';
          }}
        >
          <div style={{
            width: 34, height: 34, flexShrink: 0,
            background: 'rgba(249,115,22,0.12)', borderRadius: 7,
            display: 'flex', alignItems: 'center', justifyContent: 'center',
          }}>
            <svg width="18" height="16" viewBox="0 0 20 18" fill="none">
              <path d="M7.5 2L6 4H2C1.45 4 1 4.45 1 5V16C1 16.55 1.45 17 2 17H18C18.55 17 19 16.55 19 16V5C19 4.45 18.55 4 18 4H14L12.5 2H7.5Z" stroke="#F97316" strokeWidth="1.5" strokeLinejoin="round" fill="none"/>
              <circle cx="10" cy="10.5" r="3.5" stroke="#F97316" strokeWidth="1.5" fill="none"/>
              <circle cx="10" cy="10.5" r="1.5" fill="#F97316"/>
            </svg>
          </div>
          <span style={{ flex: 1, color: '#fff', fontWeight: 800, fontSize: 13, letterSpacing: '0.08em', textTransform: 'uppercase' }}>
            Scan Bracket Image
          </span>
          <svg width="14" height="14" viewBox="0 0 16 16" fill="none" style={{ flexShrink: 0, opacity: 0.35 }}>
            <path d="M6 3L11 8L6 13" stroke="#F97316" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round"/>
          </svg>
        </button>
      )}

      {/* ── Section labels ── */}
      <div className="sp-section-labels">
        {[{ label: 'Byes', range: '1–4' }, { label: 'First Round', range: '5–12' }].map(({ label, range }) => (
          <div key={label} style={{ display: 'flex', alignItems: 'center', gap: 8, paddingLeft: 2 }}>
            <div style={{ width: 3, height: 11, borderRadius: 2, background: '#252830', flexShrink: 0 }} />
            <span style={{
              fontSize: 11,
              fontWeight: 800,
              letterSpacing: '0.1em',
              textTransform: 'uppercase',
              color: C.roundLabel,
              fontFamily: FONT_HEADING,
            }}>
              {label} <span style={{ opacity: 0.45, fontWeight: 600 }}>({range})</span>
            </span>
          </div>
        ))}
      </div>

      {/* ── Seed rows ── */}
      <div className="sp-seed-grid">
        {Array.from({ length: 12 }, (_, i) => i + 1).map((seed) => {
          const teamName = seeds[seed] || '';
          const team     = getTeam(teamName);
          const isBye    = seed <= 4;

          const seedBg    = team ? team.primary : C.seedBgIdle;
          const seedColor = team
            ? (team.textColor === 'black' ? 'rgba(0,0,0,0.75)' : 'rgba(255,255,255,0.85)')
            : C.seedColorIdle;
          const borderColor = team ? `${team.primary}4D` : C.cardBorder;

          return (
            <div key={seed} style={{
              background: C.cardBg,
              border: `1px solid ${borderColor}`,
              borderRadius: 8,
              padding: 5,
              display: 'flex',
              alignItems: 'center',
              gap: 8,
              transition: 'border-color 0.2s',
            }}>

              {/* Seed number block — matches Bracket.tsx TeamPill */}
              <div style={{
                width: 36,
                height: 36,
                borderRadius: 6,
                background: seedBg,
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                color: seedColor,
                fontWeight: 800,
                fontSize: 13,
                flexShrink: 0,
                fontFamily: FONT_BODY,
                transition: 'background 0.2s, color 0.2s',
              }}>
                {seed}
              </div>

              {/* Search input */}
              <div style={{ flex: 1, minWidth: 0 }}>
                <TeamSearchInput
                  value={teamName}
                  onChange={(name) => onSeedChange(seed, name)}
                  excludeNames={assignedNames.filter((n) => n !== teamName)}
                  placeholder={`Seed ${seed}...`}
                />
              </div>

              {/* BYE / R1 badge */}
              <span style={{
                fontSize: 10,
                fontWeight: 800,
                letterSpacing: '0.1em',
                textTransform: 'uppercase',
                color: isBye ? '#F97316' : C.roundLabel,
                flexShrink: 0,
                fontFamily: FONT_HEADING,
                width: 26,
                textAlign: 'right',
              }}>
                {SEED_LABELS[seed]}
              </span>
            </div>
          );
        })}
      </div>

      {/* ── Progress bar ── */}
      <div style={{ marginBottom: 16 }}>
        <div style={{
          display: 'flex',
          justifyContent: 'space-between',
          color: C.roundLabel,
          fontSize: 12,
          marginBottom: 6,
          fontFamily: FONT_BODY,
        }}>
          <span>Seeds assigned</span>
          <span style={{ color: filled ? '#F97316' : '#fff', fontWeight: 700 }}>
            {count} / 12
          </span>
        </div>
        <div style={{ height: 3, background: C.cardBorder, borderRadius: 4, overflow: 'hidden' }}>
          <div style={{
            height: '100%',
            width: `${(count / 12) * 100}%`,
            background: filled ? '#F97316' : '#2E3138',
            borderRadius: 4,
            transition: 'width 0.3s ease, background 0.3s',
          }} />
        </div>
      </div>

      {/* ── Lock In Button ── */}
      <button
        onClick={onLockIn}
        disabled={!filled}
        style={{
          width: '100%',
          padding: '14px 0',
          background: filled ? 'linear-gradient(135deg, #F97316 0%, #ea6a0a 100%)' : C.cardBg,
          color: filled ? '#000' : '#3A3D44',
          border: `1px solid ${filled ? 'transparent' : C.cardBorder}`,
          borderRadius: 8,
          fontWeight: 800,
          fontSize: 14,
          letterSpacing: '0.1em',
          textTransform: 'uppercase',
          cursor: filled ? 'pointer' : 'not-allowed',
          transition: 'background 0.2s, color 0.2s, border-color 0.2s',
          fontFamily: FONT_HEADING,
        }}
      >
        {filled ? 'Lock In Bracket →' : `Fill All 12 Seeds to Continue`}
      </button>
    </div>
  );
};
