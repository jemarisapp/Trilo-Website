import { SeedAssignments, BracketPicks } from './bracket.types';
import { getTeam } from './teams';
import {
  FIRST_ROUND_MATCHUPS,
  QUARTERFINAL_BYES,
  SEMIFINAL_MATCHUPS,
  pickFirstRound,
  pickQuarterfinal,
  pickSemifinal,
  pickChampionship,
} from './bracketUtils';
import React from 'react';

interface BracketProps {
  seeds: SeedAssignments;
  picks: BracketPicks;
  onPicksChange: (picks: BracketPicks) => void;
  onReset: () => void;
}

interface TeamPillProps {
  name: string | null;
  seed?: number;
  isWinner: boolean;
  isLoser: boolean;
  isAvailable: boolean;
  isChampionship?: boolean;
  onClick?: () => void;
}

// ── Color tokens: near-black base, very faint blue-grey tint ──────────────
const C = {
  pillLose:     '#070708',
  pillIdle:     '#111214',
  borderLose:   '#111113',
  borderIdle:   '#1E2025',
  seedBgIdle:   '#161719',
  seedColorIdle:'#5E6168',
  textIdle:     '#C8CDD6',
  textLose:     '#3A3D44',
  cardBg:       '#090A0C',
  cardBorder:   '#15171B',
  panelBg:      '#090A0C',
  panelBorder:  '#15171B',
  roundLabel:   '#5E6370',
};

const TeamPill = ({ name, seed, isWinner, isLoser, isAvailable, isChampionship, onClick }: TeamPillProps) => {
  const team = getTeam(name);

  const bg          = isWinner ? (team?.primary ?? '#F97316') : isLoser ? C.pillLose  : C.pillIdle;
  const textColor   = isWinner ? (team?.textColor ?? 'white') : isLoser ? C.textLose  : C.textIdle;
  const borderColor = isWinner ? (team?.primary ?? '#F97316') : isLoser ? C.borderLose : C.borderIdle;
  const seedBg      = isWinner ? 'rgba(0,0,0,0.15)' : C.seedBgIdle;
  const seedColor   = isWinner
    ? (team?.textColor === 'black' ? 'rgba(0,0,0,0.6)' : 'rgba(255,255,255,0.7)')
    : isLoser ? '#2A2D34' : C.seedColorIdle;

  const isChampWinner = isChampionship && isWinner;
  const goldBorder = isChampWinner ? 'rgba(255,210,50,0.7)' : borderColor;
  const goldGlow = isChampWinner ? '0 0 14px rgba(255,200,30,0.55), 0 0 28px rgba(255,165,0,0.25)' : undefined;

  return (
    <div
      onClick={isAvailable && name ? onClick : undefined}
      style={{
        display: 'flex',
        alignItems: 'stretch',
        background: bg,
        border: `1px solid ${goldBorder}`,
        borderRadius: 6,
        cursor: isAvailable && name ? 'pointer' : 'default',
        transition: 'all 0.15s ease-out',
        opacity: isLoser ? 0.55 : 1,
        height: 40,
        overflow: 'hidden',
        userSelect: 'none',
        boxShadow: goldGlow,
      }}
      onMouseEnter={(e) => {
        if (isAvailable && name && !isWinner && !isLoser) {
          (e.currentTarget as HTMLDivElement).style.borderColor = '#2E3138';
          (e.currentTarget as HTMLDivElement).style.background = '#161719';
        }
      }}
      onMouseLeave={(e) => {
        if (isAvailable && name && !isWinner && !isLoser) {
          (e.currentTarget as HTMLDivElement).style.borderColor = borderColor;
          (e.currentTarget as HTMLDivElement).style.background = bg;
        }
      }}
    >
      {/* Seed block */}
      {seed !== undefined && (
        <div style={{
          width: 30,
          background: seedBg,
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          fontSize: 11,
          fontWeight: 700,
          color: seedColor,
          borderRight: `1px solid ${isWinner ? 'rgba(0,0,0,0.12)' : '#1E2025'}`,
          flexShrink: 0,
          fontFamily: 'system-ui, -apple-system, sans-serif',
        }}>
          {seed}
        </div>
      )}

      {/* Name + checkmark */}
      <div style={{ flex: 1, padding: '0 10px', display: 'flex', alignItems: 'center', justifyContent: 'space-between', overflow: 'hidden', gap: 6 }}>
        <span style={{
          fontSize: isChampWinner && window.innerWidth < 640 ? 16 : 13,
          fontWeight: isChampWinner ? 700 : 600,
          color: textColor,
          fontFamily: 'system-ui, -apple-system, sans-serif',
          letterSpacing: '-0.01em',
          whiteSpace: 'nowrap',
          overflow: 'hidden',
          textOverflow: 'ellipsis',
        }}>
          {name ?? 'TBD'}
        </span>
        {isWinner && !isChampWinner && (
          <svg width="13" height="13" viewBox="0 0 14 14" fill="none" style={{ flexShrink: 0, opacity: team?.textColor === 'black' ? 0.8 : 0.85 }}>
            <path d="M2.5 7.5L5.5 10.5L11.5 3.5" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
          </svg>
        )}
        {isChampWinner && (
          <svg width="14" height="14" viewBox="0 0 24 24" fill="none" style={{ flexShrink: 0 }}>
            <path d="M7 3H17V12C17 14.7614 14.7614 17 12 17C9.23858 17 7 14.7614 7 12V3Z" stroke="#FFD700" strokeWidth="2" strokeLinejoin="round"/>
            <path d="M7 6H4C3.44772 6 3 6.44772 3 7V8C3 10.2091 4.79086 12 7 12" stroke="#FFD700" strokeWidth="2" strokeLinecap="round"/>
            <path d="M17 6H20C20.5523 6 21 6.44772 21 7V8C21 10.2091 19.2091 12 17 12" stroke="#FFD700" strokeWidth="2" strokeLinecap="round"/>
            <path d="M12 17V21" stroke="#FFD700" strokeWidth="2" strokeLinecap="round"/>
            <path d="M9 21H15" stroke="#FFD700" strokeWidth="2" strokeLinecap="round"/>
          </svg>
        )}
      </div>
    </div>
  );
};

interface MatchupCardProps {
  top: string | null;
  topSeed?: number;
  bottom: string | null;
  bottomSeed?: number;
  winner: string | null;
  onPickTop: () => void;
  onPickBottom: () => void;
  isChampionship?: boolean;
}

const MatchupCard: React.FC<MatchupCardProps> = ({ top, topSeed, bottom, bottomSeed, winner, onPickTop, onPickBottom, isChampionship }) => {
  const isAvailable = !!(top && bottom);
  const hasChampWinner = isChampionship && !!winner;
  return (
    <div style={{
      background: C.cardBg,
      border: `1px solid ${hasChampWinner ? 'rgba(255,200,30,0.25)' : C.cardBorder}`,
      borderRadius: 8,
      padding: 5,
      display: 'flex',
      flexDirection: 'column',
      gap: 4,
      boxShadow: hasChampWinner
        ? '0 0 24px rgba(255,185,0,0.2), 0 4px 16px rgba(0,0,0,0.6)'
        : '0 2px 8px rgba(0,0,0,0.5)',
      transition: 'box-shadow 0.3s ease, border-color 0.3s ease',
    }}>
      <TeamPill name={top} seed={topSeed}
        isWinner={winner === top && top !== null}
        isLoser={winner !== null && winner !== top && top !== null}
        isAvailable={isAvailable} onClick={onPickTop}
        isChampionship={isChampionship} />
      <TeamPill name={bottom} seed={bottomSeed}
        isWinner={winner === bottom && bottom !== null}
        isLoser={winner !== null && winner !== bottom && bottom !== null}
        isAvailable={isAvailable} onClick={onPickBottom}
        isChampionship={isChampionship} />
    </div>
  );
};

const RoundHeader = ({ label, accent = false }: { label: string; accent?: boolean }) => (
  <div style={{ display: 'flex', alignItems: 'center', gap: 8, marginBottom: 14 }}>
    <div style={{ width: 3, height: 12, borderRadius: 2, background: accent ? '#F97316' : '#252830', flexShrink: 0 }} />
    <span style={{
      fontSize: 11,
      fontWeight: 800,
      letterSpacing: '0.1em',
      textTransform: 'uppercase',
      color: accent ? '#F97316' : C.roundLabel,
      fontFamily: "'Barlow Condensed', 'Arial Narrow', Arial, sans-serif",
    }}>
      {label}
    </span>
  </div>
);

const getSeedFor = (teamName: string | null, seeds: SeedAssignments): number | undefined => {
  if (!teamName) return undefined;
  const entry = Object.entries(seeds).find(([, name]) => name === teamName);
  return entry ? Number(entry[0]) : undefined;
};

export const Bracket = ({ seeds, picks, onPicksChange }: BracketProps) => {
  const handleFirstRound   = (i: number, w: string) => onPicksChange(pickFirstRound(picks, i, w));
  const handleQuarterfinal = (i: number, w: string) => onPicksChange(pickQuarterfinal(picks, i, w));
  const handleSemifinal    = (i: number, w: string) => onPicksChange(pickSemifinal(picks, i, w));
  const handleChampionship = (w: string)            => onPicksChange(pickChampionship(picks, w));

  return (
    <div style={{
      display: 'flex',
      alignItems: 'flex-start',
      gap: 20,
      padding: '20px 16px',
      maxWidth: 1440,
      margin: '0 auto',
      flexWrap: 'wrap',
    }}>

      {/* ── Horizontal bracket tree ──────────────────────────────────────────
          minWidth: 0 is the critical fix — without it a flex item won't shrink
          below its content size, so overflowX: auto never kicks in on mobile. */}
      <div style={{
        flex: '1 1 600px',
        minWidth: 0,
        display: 'flex',
        gap: 16,
        overflowX: 'auto',
        overflowY: 'visible',
        paddingBottom: 16,
      }}>

        {/* FIRST ROUND */}
        <div style={{ width: 240, flexShrink: 0, display: 'flex', flexDirection: 'column', gap: 14 }}>
          <RoundHeader label="First Round" />
          {FIRST_ROUND_MATCHUPS.map(([topSeed, bottomSeed], i) => (
            <MatchupCard key={i}
              top={seeds[topSeed] ?? null} topSeed={topSeed}
              bottom={seeds[bottomSeed] ?? null} bottomSeed={bottomSeed}
              winner={picks.firstRound[i]}
              onPickTop={() => seeds[topSeed] && handleFirstRound(i, seeds[topSeed])}
              onPickBottom={() => seeds[bottomSeed] && handleFirstRound(i, seeds[bottomSeed])}
            />
          ))}
        </div>

        {/* QUARTERFINAL */}
        <div style={{ width: 240, flexShrink: 0, display: 'flex', flexDirection: 'column', gap: 14 }}>
          <RoundHeader label="Quarterfinal" />
          {QUARTERFINAL_BYES.map((byeSeed, i) => {
            const byeTeam  = seeds[byeSeed] ?? null;
            const frWinner = picks.firstRound[i];
            return (
              <MatchupCard key={i}
                top={byeTeam} topSeed={byeSeed}
                bottom={frWinner} bottomSeed={frWinner ? getSeedFor(frWinner, seeds) : undefined}
                winner={picks.quarterfinal[i]}
                onPickTop={() => byeTeam && handleQuarterfinal(i, byeTeam)}
                onPickBottom={() => frWinner && handleQuarterfinal(i, frWinner)}
              />
            );
          })}
        </div>

        {/* SEMIFINAL */}
        <div style={{ width: 240, flexShrink: 0, display: 'flex', flexDirection: 'column', gap: 14 }}>
          <RoundHeader label="Semifinal" />
          <div style={{ flex: 1, display: 'flex', flexDirection: 'column', justifyContent: 'center', gap: 48 }}>
            {SEMIFINAL_MATCHUPS.map(([a, b], i) => {
              const top = picks.quarterfinal[a];
              const bot = picks.quarterfinal[b];
              return (
                <MatchupCard key={i}
                  top={top} topSeed={top ? getSeedFor(top, seeds) : undefined}
                  bottom={bot} bottomSeed={bot ? getSeedFor(bot, seeds) : undefined}
                  winner={picks.semifinal[i]}
                  onPickTop={() => top && handleSemifinal(i, top)}
                  onPickBottom={() => bot && handleSemifinal(i, bot)}
                />
              );
            })}
          </div>
        </div>

        {/* CHAMPIONSHIP */}
        <div style={{ width: 240, flexShrink: 0, display: 'flex', flexDirection: 'column', gap: 14 }}>
          <RoundHeader label="National Championship" accent />
          <div style={{ flex: 1, display: 'flex', flexDirection: 'column', justifyContent: 'center' }}>
            <MatchupCard
              top={picks.semifinal[0]} topSeed={picks.semifinal[0] ? getSeedFor(picks.semifinal[0], seeds) : undefined}
              bottom={picks.semifinal[1]} bottomSeed={picks.semifinal[1] ? getSeedFor(picks.semifinal[1], seeds) : undefined}
              winner={picks.championship}
              onPickTop={() => picks.semifinal[0] && handleChampionship(picks.semifinal[0])}
              onPickBottom={() => picks.semifinal[1] && handleChampionship(picks.semifinal[1])}
              isChampionship
            />
          </div>
        </div>
      </div>

    </div>
  );
};
