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
  onClick?: () => void;
}

const TeamPill = ({ name, seed, isWinner, isLoser, isAvailable, onClick }: TeamPillProps) => {
  const team = getTeam(name);
  const bg = isWinner ? team?.primary ?? '#F97316' : isLoser ? '#111' : '#1e1e1e';
  const textColor = isWinner ? team?.textColor ?? 'white' : isLoser ? '#2a2a2a' : '#bbb';
  const borderColor = isWinner ? team?.primary ?? '#F97316' : '#252525';

  return (
    <div
      onClick={isAvailable && name ? onClick : undefined}
      style={{
        display: 'flex',
        alignItems: 'center',
        gap: 8,
        padding: '10px 12px',
        background: bg,
        border: `1px solid ${borderColor}`,
        borderRadius: 8,
        cursor: isAvailable && name ? 'pointer' : 'default',
        transition: 'all 0.15s ease',
        opacity: isLoser ? 0.3 : 1,
        boxShadow: isWinner ? `0 0 16px ${team?.primary ?? '#F97316'}44` : 'none',
        WebkitTapHighlightColor: 'transparent',
        userSelect: 'none',
      }}
    >
      {seed !== undefined && (
        <span
          style={{
            fontSize: 11,
            fontWeight: 800,
            color: isWinner
              ? team?.textColor === 'black'
                ? 'rgba(0,0,0,0.4)'
                : 'rgba(255,255,255,0.45)'
              : '#444',
            minWidth: 16,
            textAlign: 'center',
            flexShrink: 0,
          }}
        >
          {seed}
        </span>
      )}
      <span
        style={{
          fontSize: 14,
          fontWeight: 700,
          color: textColor,
          overflow: 'hidden',
          textOverflow: 'ellipsis',
          whiteSpace: 'nowrap',
          letterSpacing: '0.01em',
          flex: 1,
        }}
      >
        {name ?? 'TBD'}
      </span>
      {isWinner && <span style={{ fontSize: 12, flexShrink: 0 }}>✓</span>}
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
}

const MatchupCard = ({ top, topSeed, bottom, bottomSeed, winner, onPickTop, onPickBottom }: MatchupCardProps) => {
  const isAvailable = !!(top && bottom);
  return (
    <div
      style={{
        background: '#111',
        border: '1px solid #1e1e1e',
        borderRadius: 10,
        overflow: 'hidden',
      }}
    >
      <div style={{ padding: 6, display: 'flex', flexDirection: 'column', gap: 4 }}>
        <TeamPill
          name={top}
          seed={topSeed}
          isWinner={winner === top && top !== null}
          isLoser={winner !== null && winner !== top && top !== null}
          isAvailable={isAvailable}
          onClick={onPickTop}
        />
        <div style={{ height: 1, background: '#1a1a1a', margin: '0 6px' }} />
        <TeamPill
          name={bottom}
          seed={bottomSeed}
          isWinner={winner === bottom && bottom !== null}
          isLoser={winner !== null && winner !== bottom && bottom !== null}
          isAvailable={isAvailable}
          onClick={onPickBottom}
        />
      </div>
    </div>
  );
};

const RoundHeader = ({ label, accent = false }: { label: string; accent?: boolean }) => (
  <div style={{ display: 'flex', alignItems: 'center', gap: 10, marginBottom: 10 }}>
    <div
      style={{
        width: 3,
        height: 16,
        borderRadius: 2,
        background: accent ? '#F97316' : '#333',
        flexShrink: 0,
      }}
    />
    <span
      style={{
        fontSize: 11,
        fontWeight: 800,
        letterSpacing: '0.14em',
        textTransform: 'uppercase',
        color: accent ? '#F97316' : '#555',
      }}
    >
      {label}
    </span>
    <div style={{ flex: 1, height: 1, background: '#1a1a1a' }} />
  </div>
);

const getSeedFor = (teamName: string | null, seeds: SeedAssignments): number | undefined => {
  if (!teamName) return undefined;
  const entry = Object.entries(seeds).find(([, name]) => name === teamName);
  return entry ? Number(entry[0]) : undefined;
};

export const Bracket = ({ seeds, picks, onPicksChange, onReset }: BracketProps) => {
  const champion = picks.championship;
  const championTeam = getTeam(champion);

  const handleFirstRound = (i: number, winner: string) => onPicksChange(pickFirstRound(picks, i, winner));
  const handleQuarterfinal = (i: number, winner: string) => onPicksChange(pickQuarterfinal(picks, i, winner));
  const handleSemifinal = (i: number, winner: string) => onPicksChange(pickSemifinal(picks, i, winner));
  const handleChampionship = (winner: string) => onPicksChange(pickChampionship(picks, winner));

  return (
    <div
      style={{
        fontFamily: "'Barlow Condensed', 'Arial Narrow', Arial, sans-serif",
        padding: '16px',
        maxWidth: 480,
        margin: '0 auto',
      }}
    >
      {/* Header */}
      <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: 20 }}>
        <div>
          <h2 style={{ color: '#fff', fontSize: 22, fontWeight: 800, margin: 0, textTransform: 'uppercase', letterSpacing: '-0.02em' }}>
            CFP Bracket
          </h2>
          <p style={{ color: '#555', fontSize: 12, margin: '2px 0 0' }}>Tap a team to advance them</p>
        </div>
        <button
          onClick={onReset}
          style={{
            background: 'none',
            border: '1px solid #2a2a2a',
            color: '#555',
            borderRadius: 6,
            padding: '7px 14px',
            fontSize: 11,
            fontWeight: 700,
            letterSpacing: '0.08em',
            textTransform: 'uppercase',
            cursor: 'pointer',
            fontFamily: 'inherit',
            WebkitTapHighlightColor: 'transparent',
          }}
        >
          Reset
        </button>
      </div>

      {/* Champion Banner */}
      {champion && (
        <div
          style={{
            background: championTeam ? championTeam.primary : '#F97316',
            borderRadius: 12,
            padding: '16px 20px',
            marginBottom: 24,
            display: 'flex',
            alignItems: 'center',
            gap: 14,
            boxShadow: `0 0 32px ${championTeam?.primary ?? '#F97316'}55`,
          }}
        >
          <span style={{ fontSize: 28 }}>🏆</span>
          <div>
            <div style={{ fontSize: 10, fontWeight: 800, letterSpacing: '0.15em', textTransform: 'uppercase', color: 'rgba(255,255,255,0.55)', marginBottom: 2 }}>
              Your Champion
            </div>
            <div style={{ fontSize: 22, fontWeight: 800, color: '#fff', letterSpacing: '-0.01em' }}>
              {champion}
            </div>
          </div>
        </div>
      )}

      {/* FIRST ROUND */}
      <div style={{ marginBottom: 28 }}>
        <RoundHeader label="First Round" />
        <div style={{ display: 'flex', flexDirection: 'column', gap: 8 }}>
          {FIRST_ROUND_MATCHUPS.map(([topSeed, bottomSeed], i) => (
            <MatchupCard
              key={i}
              top={seeds[topSeed] ?? null}
              topSeed={topSeed}
              bottom={seeds[bottomSeed] ?? null}
              bottomSeed={bottomSeed}
              winner={picks.firstRound[i]}
              onPickTop={() => seeds[topSeed] && handleFirstRound(i, seeds[topSeed])}
              onPickBottom={() => seeds[bottomSeed] && handleFirstRound(i, seeds[bottomSeed])}
            />
          ))}
        </div>
      </div>

      {/* QUARTERFINAL */}
      <div style={{ marginBottom: 28 }}>
        <RoundHeader label="Quarterfinal" />
        <div style={{ display: 'flex', flexDirection: 'column', gap: 8 }}>
          {QUARTERFINAL_BYES.map((byeSeed, i) => {
            const byeTeam = seeds[byeSeed] ?? null;
            const frWinner = picks.firstRound[i];
            return (
              <MatchupCard
                key={i}
                top={byeTeam}
                topSeed={byeSeed}
                bottom={frWinner}
                bottomSeed={frWinner ? getSeedFor(frWinner, seeds) : undefined}
                winner={picks.quarterfinal[i]}
                onPickTop={() => byeTeam && handleQuarterfinal(i, byeTeam)}
                onPickBottom={() => frWinner && handleQuarterfinal(i, frWinner)}
              />
            );
          })}
        </div>
      </div>

      {/* SEMIFINAL */}
      <div style={{ marginBottom: 28 }}>
        <RoundHeader label="Semifinal" />
        <div style={{ display: 'flex', flexDirection: 'column', gap: 8 }}>
          {SEMIFINAL_MATCHUPS.map(([a, b], i) => {
            const topTeam = picks.quarterfinal[a];
            const bottomTeam = picks.quarterfinal[b];
            return (
              <MatchupCard
                key={i}
                top={topTeam}
                topSeed={topTeam ? getSeedFor(topTeam, seeds) : undefined}
                bottom={bottomTeam}
                bottomSeed={bottomTeam ? getSeedFor(bottomTeam, seeds) : undefined}
                winner={picks.semifinal[i]}
                onPickTop={() => topTeam && handleSemifinal(i, topTeam)}
                onPickBottom={() => bottomTeam && handleSemifinal(i, bottomTeam)}
              />
            );
          })}
        </div>
      </div>

      {/* CHAMPIONSHIP */}
      <div style={{ marginBottom: 28 }}>
        <RoundHeader label="National Championship" accent />
        <MatchupCard
          top={picks.semifinal[0]}
          topSeed={picks.semifinal[0] ? getSeedFor(picks.semifinal[0], seeds) : undefined}
          bottom={picks.semifinal[1]}
          bottomSeed={picks.semifinal[1] ? getSeedFor(picks.semifinal[1], seeds) : undefined}
          winner={picks.championship}
          onPickTop={() => picks.semifinal[0] && handleChampionship(picks.semifinal[0])}
          onPickBottom={() => picks.semifinal[1] && handleChampionship(picks.semifinal[1])}
        />
      </div>

      {/* Legend */}
      <div style={{ color: '#333', fontSize: 11, textAlign: 'center', letterSpacing: '0.04em' }}>
        Tap to pick · Tap again to swap · Progress saves automatically
      </div>
    </div>
  );
};
