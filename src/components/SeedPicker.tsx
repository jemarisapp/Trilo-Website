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

const SEED_LABELS: Record<number, string> = {
  1: 'Bye',
  2: 'Bye',
  3: 'Bye',
  4: 'Bye',
  5: 'First Round',
  6: 'First Round',
  7: 'First Round',
  8: 'First Round',
  9: 'First Round',
  10: 'First Round',
  11: 'First Round',
  12: 'First Round',
};

export const SeedPicker = ({ seeds, onSeedChange, onLockIn, onScanImage }: SeedPickerProps) => {
  const assignedNames = Object.values(seeds).filter(Boolean) as string[];
  const filled = allSeedsFilled(seeds);

  return (
    <div
      style={{
        maxWidth: 640,
        margin: '0 auto',
        padding: '24px 16px',
        fontFamily: "'Barlow Condensed', 'Arial Narrow', Arial, sans-serif",
      }}
    >
      {/* Header */}
      <div style={{ marginBottom: 24, textAlign: 'center' }}>
        <div
          style={{
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
          }}
        >
          Step 1 of 2
        </div>
        <h2
          style={{
            color: '#fff',
            fontSize: 28,
            fontWeight: 800,
            margin: 0,
            letterSpacing: '-0.02em',
            textTransform: 'uppercase',
          }}
        >
          Assign Your Seeds
        </h2>
        <p style={{ color: '#888', fontSize: 14, marginTop: 8, marginBottom: 0 }}>
          Assign all 12 seeds to build your bracket.
        </p>
      </div>

      {/* Scan banner */}
      {onScanImage && (
        <button
          onClick={onScanImage}
          style={{
            width: '100%',
            background: 'linear-gradient(135deg, rgba(249,115,22,0.08) 0%, rgba(249,115,22,0.04) 100%)',
            border: '1px solid rgba(249,115,22,0.22)',
            borderRadius: 12,
            padding: '14px 18px',
            marginBottom: 20,
            display: 'flex',
            alignItems: 'center',
            gap: 14,
            cursor: 'pointer',
            textAlign: 'left',
            transition: 'border-color 0.2s, background 0.2s',
            fontFamily: "'Barlow Condensed', 'Arial Narrow', Arial, sans-serif",
          }}
          onMouseEnter={(e) => {
            (e.currentTarget as HTMLButtonElement).style.borderColor = 'rgba(249,115,22,0.55)';
            (e.currentTarget as HTMLButtonElement).style.background = 'linear-gradient(135deg, rgba(249,115,22,0.13) 0%, rgba(249,115,22,0.07) 100%)';
          }}
          onMouseLeave={(e) => {
            (e.currentTarget as HTMLButtonElement).style.borderColor = 'rgba(249,115,22,0.22)';
            (e.currentTarget as HTMLButtonElement).style.background = 'linear-gradient(135deg, rgba(249,115,22,0.08) 0%, rgba(249,115,22,0.04) 100%)';
          }}
        >
          {/* Camera icon */}
          <div style={{ flexShrink: 0, display: 'flex', alignItems: 'center', justifyContent: 'center', width: 38, height: 38, background: 'rgba(249,115,22,0.12)', borderRadius: 8 }}>
            <svg width="20" height="18" viewBox="0 0 20 18" fill="none">
              <path d="M7.5 2L6 4H2C1.45 4 1 4.45 1 5V16C1 16.55 1.45 17 2 17H18C18.55 17 19 16.55 19 16V5C19 4.45 18.55 4 18 4H14L12.5 2H7.5Z" stroke="#F97316" strokeWidth="1.5" strokeLinejoin="round" fill="none"/>
              <circle cx="10" cy="10.5" r="3.5" stroke="#F97316" strokeWidth="1.5" fill="none"/>
              <circle cx="10" cy="10.5" r="1.5" fill="#F97316"/>
            </svg>
          </div>
          {/* Text */}
          <div style={{ flex: 1 }}>
            <div style={{ color: '#fff', fontWeight: 800, fontSize: 14, letterSpacing: '0.06em', textTransform: 'uppercase' }}>
              Scan Bracket Image
            </div>
          </div>
          {/* Arrow */}
          <svg width="16" height="16" viewBox="0 0 16 16" fill="none" style={{ flexShrink: 0, opacity: 0.4 }}>
            <path d="M6 3L11 8L6 13" stroke="#F97316" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round"/>
          </svg>
        </button>
      )}

      {/* Seed Grid */}
      <div
        style={{
          display: 'grid',
          gridTemplateColumns: '1fr 1fr',
          gridTemplateRows: 'repeat(6, auto)',
          gridAutoFlow: 'column',
          gap: 10,
          marginBottom: 28,
        }}
      >
        {Array.from({ length: 12 }, (_, i) => i + 1).map((seed) => {
          const teamName = seeds[seed] || '';
          const team = getTeam(teamName);
          const isBye = seed <= 4;

          return (
            <div
              key={seed}
              style={{
                background: '#111',
                border: `1px solid ${team ? team.primary + '55' : '#222'}`,
                borderRadius: 10,
                padding: 12,
                transition: 'border-color 0.2s',
              }}
            >
              <div
                style={{
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'space-between',
                  marginBottom: 8,
                }}
              >
                <div style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
                  <div
                    style={{
                      width: 28,
                      height: 28,
                      borderRadius: 6,
                      background: team ? team.primary : '#222',
                      display: 'flex',
                      alignItems: 'center',
                      justifyContent: 'center',
                      color: '#fff',
                      fontWeight: 800,
                      fontSize: 14,
                      transition: 'background 0.2s',
                    }}
                  >
                    {seed}
                  </div>
                  {teamName && (
                    <span
                      style={{
                        color: '#fff',
                        fontWeight: 700,
                        fontSize: 13,
                        letterSpacing: '0.02em',
                      }}
                    >
                      {teamName}
                    </span>
                  )}
                </div>
                <span
                  style={{
                    fontSize: 10,
                    fontWeight: 700,
                    letterSpacing: '0.1em',
                    textTransform: 'uppercase',
                    color: isBye ? '#F97316' : '#555',
                  }}
                >
                  {SEED_LABELS[seed]}
                </span>
              </div>
              <TeamSearchInput
                value={teamName}
                onChange={(name) => onSeedChange(seed, name)}
                excludeNames={assignedNames.filter((n) => n !== teamName)}
                placeholder={`Seed ${seed} team...`}
              />
            </div>
          );
        })}
      </div>

      {/* Progress bar */}
      <div style={{ marginBottom: 20 }}>
        <div
          style={{
            display: 'flex',
            justifyContent: 'space-between',
            color: '#666',
            fontSize: 12,
            marginBottom: 6,
          }}
        >
          <span>Seeds filled</span>
          <span style={{ color: filled ? '#F97316' : '#fff' }}>
            {assignedNames.length} / 12
          </span>
        </div>
        <div
          style={{
            height: 4,
            background: '#222',
            borderRadius: 4,
            overflow: 'hidden',
          }}
        >
          <div
            style={{
              height: '100%',
              width: `${(assignedNames.length / 12) * 100}%`,
              background: filled ? '#F97316' : '#555',
              borderRadius: 4,
              transition: 'width 0.3s ease, background 0.3s',
            }}
          />
        </div>
      </div>

      {/* Lock In Button */}
      <button
        onClick={onLockIn}
        disabled={!filled}
        style={{
          width: '100%',
          padding: '14px 0',
          background: filled ? '#F97316' : '#222',
          color: filled ? '#000' : '#444',
          border: 'none',
          borderRadius: 10,
          fontWeight: 800,
          fontSize: 15,
          letterSpacing: '0.08em',
          textTransform: 'uppercase',
          cursor: filled ? 'pointer' : 'not-allowed',
          transition: 'background 0.2s, color 0.2s',
          fontFamily: 'inherit',
        }}
      >
        {filled ? 'Lock In Bracket' : `Fill All 12 Seeds to Continue`}
      </button>
    </div>
  );
};
