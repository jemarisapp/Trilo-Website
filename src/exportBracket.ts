import { getTeam } from './components/teams';

// ─── Canvas constants ──────────────────────────────────────────────────────────
const W = 1920;
const H = 1080;

// Box geometry
const BW = 248;   // team box width
const BH = 60;    // team box height
const BR = 7;     // border radius
const MGAP = 8;   // gap between top/bottom team in one matchup

// Column left-edge X positions (box starts here)
const COL_FR    = 52;
const COL_QF    = 406;
const COL_SF    = 760;
const COL_CHAMP = 1114;

// Connector stub length (how far a line extends right before bending)
const STUB = 28;

// First round vertical layout
const FR_TOP_Y     = 108;           // top of first matchup's top box
const MATCHUP_H    = BH * 2 + MGAP; // 128 px
const MATCHUP_STEP = MATCHUP_H + 136; // 264 px between matchup starts

// ─── Layout helpers ────────────────────────────────────────────────────────────

/** Top-left Y of the i-th FR matchup box pair */
function frTopY(i: number) { return FR_TOP_Y + i * MATCHUP_STEP; }

/** Y of the CENTER LINE between the two team boxes in a matchup */
function frCenterY(i: number) { return frTopY(i) + BH + MGAP / 2; }

/** QF matchups sit at the same vertical center as their FR feeder game */
const qfCenterY = frCenterY;

/** SF center = midpoint of the two QF games it draws from */
function sfCenterY(half: 0 | 1) {
  return (qfCenterY(half * 2) + qfCenterY(half * 2 + 1)) / 2;
}

/** Championship center = midpoint of the two SF games */
function champCenterY() {
  return (sfCenterY(0) + sfCenterY(1)) / 2;
}

// ─── Drawing helpers ───────────────────────────────────────────────────────────

function roundRect(
  ctx: CanvasRenderingContext2D,
  x: number, y: number, w: number, h: number, r: number
) {
  ctx.beginPath();
  ctx.moveTo(x + r, y);
  ctx.lineTo(x + w - r, y);
  ctx.arcTo(x + w, y, x + w, y + r, r);
  ctx.lineTo(x + w, y + h - r);
  ctx.arcTo(x + w, y + h, x + w - r, y + h, r);
  ctx.lineTo(x + r, y + h);
  ctx.arcTo(x, y + h, x, y + h - r, r);
  ctx.lineTo(x, y + r);
  ctx.arcTo(x, y, x + r, y, r);
  ctx.closePath();
}

function darken(hex: string, f = 0.28): string {
  const r = parseInt(hex.slice(1, 3), 16);
  const g = parseInt(hex.slice(3, 5), 16);
  const b = parseInt(hex.slice(5, 7), 16);
  return `rgb(${Math.round(r * f)},${Math.round(g * f)},${Math.round(b * f)})`;
}

/** Draw one team box */
function drawTeamBox(
  ctx: CanvasRenderingContext2D,
  x: number,
  y: number,
  seed: number | null,
  name: string | null,
  isWinner: boolean,
  matchupDecided: boolean,
  width = BW
) {
  const team = name ? getTeam(name) : null;

  // ── Fill ────────────────────────────────────────────────────────────────
  if (!name) {
    ctx.fillStyle = '#12121c';
    roundRect(ctx, x, y, width, BH, BR);
    ctx.fill();
    ctx.strokeStyle = '#252535';
    ctx.lineWidth = 1;
    roundRect(ctx, x, y, width, BH, BR);
    ctx.stroke();
    // "TBD" text
    ctx.fillStyle = '#2e2e45';
    ctx.font = '14px "Barlow Condensed", Arial, sans-serif';
    ctx.textAlign = 'center';
    ctx.textBaseline = 'middle';
    ctx.fillText('TBD', x + width / 2, y + BH / 2);
    return;
  }

  const primaryColor = team?.primary ?? '#333';

  if (isWinner) {
    // Full-color, glowing
    ctx.fillStyle = primaryColor;
    roundRect(ctx, x, y, width, BH, BR);
    ctx.fill();
    // Orange winner outline
    ctx.strokeStyle = 'rgba(255,180,50,0.9)';
    ctx.lineWidth = 2.5;
    roundRect(ctx, x, y, width, BH, BR);
    ctx.stroke();
  } else if (matchupDecided) {
    // Loser — heavy dim
    ctx.fillStyle = darken(primaryColor, 0.22);
    roundRect(ctx, x, y, width, BH, BR);
    ctx.fill();
    ctx.strokeStyle = 'rgba(255,255,255,0.05)';
    ctx.lineWidth = 1;
    roundRect(ctx, x, y, width, BH, BR);
    ctx.stroke();
  } else {
    // Undecided — full color but slightly transparent
    ctx.fillStyle = primaryColor;
    roundRect(ctx, x, y, width, BH, BR);
    ctx.fill();
    ctx.strokeStyle = 'rgba(255,255,255,0.15)';
    ctx.lineWidth = 1;
    roundRect(ctx, x, y, width, BH, BR);
    ctx.stroke();
  }

  // ── Seed badge ──────────────────────────────────────────────────────────
  if (seed !== null) {
    const badgeW = 36;
    const badgeX = x + 7;
    const badgeY = y + 8;
    ctx.fillStyle = matchupDecided && !isWinner
      ? 'rgba(0,0,0,0.2)'
      : 'rgba(0,0,0,0.38)';
    roundRect(ctx, badgeX, badgeY, badgeW, BH - 16, 4);
    ctx.fill();

    ctx.fillStyle = matchupDecided && !isWinner ? 'rgba(255,255,255,0.3)' : 'rgba(255,255,255,0.9)';
    ctx.font = `bold 16px "Barlow Condensed", Arial Narrow, Arial, sans-serif`;
    ctx.textAlign = 'center';
    ctx.textBaseline = 'middle';
    ctx.fillText(String(seed), badgeX + badgeW / 2, y + BH / 2);
  }

  // ── Team name ───────────────────────────────────────────────────────────
  const nameX = x + (seed !== null ? 54 : 14);
  const nameMaxW = width - nameX + x - 10;
  const textColor = matchupDecided && !isWinner ? 'rgba(255,255,255,0.28)' : '#fff';
  ctx.fillStyle = textColor;
  ctx.textAlign = 'left';
  ctx.textBaseline = 'middle';

  const nameUpper = name.toUpperCase();
  // Scale font to fit
  let fs = 24;
  ctx.font = `800 ${fs}px "Barlow Condensed", Arial Narrow, Arial, sans-serif`;
  while (ctx.measureText(nameUpper).width > nameMaxW && fs > 10) {
    fs -= 1;
    ctx.font = `800 ${fs}px "Barlow Condensed", Arial Narrow, Arial, sans-serif`;
  }
  ctx.fillText(nameUpper, nameX, y + BH / 2);
}

/** Draw a full matchup (two stacked boxes) */
function drawMatchup(
  ctx: CanvasRenderingContext2D,
  colX: number,
  matchupCenterY: number,
  topSeed: number | null,
  topName: string | null,
  botSeed: number | null,
  botName: string | null,
  winner: string | null,
  width = BW
) {
  const topY = matchupCenterY - BH - MGAP / 2;
  const botY = matchupCenterY + MGAP / 2;
  const decided = winner !== null;
  drawTeamBox(ctx, colX, topY, topSeed, topName, winner === topName, decided, width);
  drawTeamBox(ctx, colX, botY, botSeed, botName, winner === botName, decided, width);
}

// ─── Connector line helpers ────────────────────────────────────────────────────

function setConnectorStyle(ctx: CanvasRenderingContext2D, isActive = false) {
  ctx.strokeStyle = isActive ? 'rgba(255,180,50,0.55)' : 'rgba(255,255,255,0.14)';
  ctx.lineWidth = isActive ? 2.5 : 2;
  ctx.lineJoin = 'round';
}

/**
 * Draw the "L fork" from a matchup pair into the next round.
 * fromCol: right edge of source matchup boxes
 * topCY, botCY: center-Y of the two source matchups
 * toCol: left edge of the target matchup box
 * targetCY: center-Y of the target matchup
 * active: whether a winner has been picked (golden lines)
 */
function drawForkConnector(
  ctx: CanvasRenderingContext2D,
  fromCol: number,   // right edge of source boxes
  topCY: number,
  botCY: number,
  toCol: number,     // left edge of target matchup
  targetCY: number,
  active = false
) {
  const spineX = fromCol + STUB;
  setConnectorStyle(ctx, active);
  ctx.beginPath();
  // Horizontal stub from top source
  ctx.moveTo(fromCol, topCY);
  ctx.lineTo(spineX, topCY);
  // Vertical spine
  ctx.lineTo(spineX, botCY);
  // Horizontal stub from bottom source (goes back to spineX — already there)
  ctx.moveTo(fromCol, botCY);
  ctx.lineTo(spineX, botCY);
  ctx.stroke();

  // Horizontal from spine midpoint to next column
  setConnectorStyle(ctx, active);
  ctx.beginPath();
  ctx.moveTo(spineX, targetCY);
  ctx.lineTo(toCol, targetCY);
  ctx.stroke();
}

/**
 * Draw a direct horizontal connector (same Y level, e.g. FR → QF where the
 * FR winner feeds straight across into the QF bottom slot).
 */
function drawHorizontalConnector(
  ctx: CanvasRenderingContext2D,
  fromCol: number,
  centerY: number,
  toCol: number,
  active = false
) {
  setConnectorStyle(ctx, active);
  ctx.beginPath();
  ctx.moveTo(fromCol, centerY);
  ctx.lineTo(toCol, centerY);
  ctx.stroke();
}

/**
 * The internal matchup connector: the two team boxes in one matchup have
 * stubs going right, a short vertical spine, and a horizontal line to the right.
 */
function drawMatchupConnector(
  ctx: CanvasRenderingContext2D,
  colX: number,
  matchupCenterY: number,
  toX: number | null,   // null = internal L-shape only, no horizontal extension
  active = false
) {
  const topBoxCY = matchupCenterY - BH / 2 - MGAP / 2;
  const botBoxCY = matchupCenterY + BH / 2 + MGAP / 2;
  const spineX = colX + BW + STUB;

  setConnectorStyle(ctx, active);
  ctx.beginPath();
  ctx.moveTo(colX + BW, topBoxCY);
  ctx.lineTo(spineX, topBoxCY);
  ctx.lineTo(spineX, botBoxCY);
  ctx.moveTo(colX + BW, botBoxCY);
  ctx.lineTo(spineX, botBoxCY);
  ctx.stroke();

  if (toX !== null) {
    setConnectorStyle(ctx, active);
    ctx.beginPath();
    ctx.moveTo(spineX, matchupCenterY);
    ctx.lineTo(toX, matchupCenterY);
    ctx.stroke();
  }
}

// ─── Background ────────────────────────────────────────────────────────────────

function drawBackground(ctx: CanvasRenderingContext2D) {
  // Base dark fill
  ctx.fillStyle = '#06060e';
  ctx.fillRect(0, 0, W, H);

  // Radial atmospheric glow (center-right, warm)
  const glow = ctx.createRadialGradient(W * 0.65, H * 0.5, 80, W * 0.65, H * 0.5, 680);
  glow.addColorStop(0, 'rgba(180,90,10,0.13)');
  glow.addColorStop(0.5, 'rgba(100,40,5,0.07)');
  glow.addColorStop(1, 'transparent');
  ctx.fillStyle = glow;
  ctx.fillRect(0, 0, W, H);

  // Top-left glow (title area)
  const tlGlow = ctx.createRadialGradient(200, 80, 0, 200, 80, 400);
  tlGlow.addColorStop(0, 'rgba(200,100,0,0.10)');
  tlGlow.addColorStop(1, 'transparent');
  ctx.fillStyle = tlGlow;
  ctx.fillRect(0, 0, W, H);

  // Subtle vertical grid lines
  ctx.strokeStyle = 'rgba(255,255,255,0.018)';
  ctx.lineWidth = 1;
  for (let gx = 0; gx < W; gx += 60) {
    ctx.beginPath(); ctx.moveTo(gx, 0); ctx.lineTo(gx, H); ctx.stroke();
  }
  for (let gy = 0; gy < H; gy += 60) {
    ctx.beginPath(); ctx.moveTo(0, gy); ctx.lineTo(W, gy); ctx.stroke();
  }

  // Gold confetti / leaf particles
  const particles = [
    [120,95],[305,140],[88,310],[430,70],[515,185],[200,490],
    [610,88],[720,220],[830,55],[95,650],[190,740],[350,810],
    [460,930],[550,680],[640,790],[750,860],[80,880],[1760,110],
    [1820,240],[1680,390],[1790,520],[1850,680],[1710,760],
    [1640,870],[1780,940],[920,75],[1020,50],[1110,95],[1230,70],
    [1350,110],[1480,60],[1590,130],[1650,280],[1580,430],[1510,560],
    [1420,700],[1340,820],[1250,950],[1150,990],[1050,960],
    [940,1010],[830,970],[720,1020],[620,990],[510,1040],
    [380,1010],[260,970],[155,1020],[60,990],
  ];
  particles.forEach(([px, py], i) => {
    const size = 3 + (i % 5);
    const angle = (i * 47) % 360;
    const alpha = 0.25 + (i % 4) * 0.12;
    ctx.save();
    ctx.translate(px, py);
    ctx.rotate((angle * Math.PI) / 180);
    ctx.fillStyle = `rgba(220,175,40,${alpha})`;
    ctx.fillRect(-size / 2, -size / 4, size, size / 2);
    ctx.restore();
  });
}

// ─── Trophy drawing ────────────────────────────────────────────────────────────

function drawTrophy(ctx: CanvasRenderingContext2D, x: number, cy: number, winner: string | null) {
  // Trophy body using canvas paths
  const scale = 1.6;
  const tx = x;
  const ty = cy - 120 * scale / 2;

  // Cup body
  ctx.fillStyle = winner ? '#C8A84B' : '#3a3a50';
  ctx.beginPath();
  ctx.moveTo(tx + 30 * scale, ty);
  ctx.lineTo(tx + 90 * scale, ty);
  ctx.quadraticCurveTo(tx + 100 * scale, ty + 60 * scale, tx + 70 * scale, ty + 80 * scale);
  ctx.lineTo(tx + 60 * scale, ty + 90 * scale);
  ctx.lineTo(tx + 60 * scale, ty + 100 * scale);
  ctx.lineTo(tx + 80 * scale, ty + 100 * scale);
  ctx.lineTo(tx + 80 * scale, ty + 115 * scale);
  ctx.lineTo(tx + 40 * scale, ty + 115 * scale);
  ctx.lineTo(tx + 40 * scale, ty + 100 * scale);
  ctx.lineTo(tx + 60 * scale, ty + 100 * scale);
  ctx.lineTo(tx + 60 * scale, ty + 90 * scale);
  ctx.lineTo(tx + 50 * scale, ty + 80 * scale);
  ctx.quadraticCurveTo(tx + 20 * scale, ty + 60 * scale, tx + 30 * scale, ty);
  ctx.closePath();
  ctx.fill();

  // Handles
  ctx.fillStyle = winner ? '#A88B38' : '#2e2e45';
  // Left handle
  ctx.beginPath();
  ctx.arc(tx + 22 * scale, ty + 28 * scale, 12 * scale, Math.PI * 0.5, Math.PI * 1.5);
  ctx.lineTo(tx + 30 * scale, ty + 16 * scale);
  ctx.lineTo(tx + 30 * scale, ty + 40 * scale);
  ctx.closePath();
  ctx.fill();
  // Right handle
  ctx.beginPath();
  ctx.arc(tx + 98 * scale, ty + 28 * scale, 12 * scale, Math.PI * 1.5, Math.PI * 0.5);
  ctx.lineTo(tx + 90 * scale, ty + 40 * scale);
  ctx.lineTo(tx + 90 * scale, ty + 16 * scale);
  ctx.closePath();
  ctx.fill();

  // Shine on cup
  if (winner) {
    const shine = ctx.createLinearGradient(tx + 30 * scale, ty, tx + 90 * scale, ty + 80 * scale);
    shine.addColorStop(0, 'rgba(255,255,200,0.25)');
    shine.addColorStop(0.5, 'rgba(255,255,200,0.08)');
    shine.addColorStop(1, 'rgba(255,255,200,0)');
    ctx.fillStyle = shine;
    ctx.beginPath();
    ctx.moveTo(tx + 30 * scale, ty);
    ctx.lineTo(tx + 90 * scale, ty);
    ctx.quadraticCurveTo(tx + 100 * scale, ty + 60 * scale, tx + 70 * scale, ty + 80 * scale);
    ctx.lineTo(tx + 60 * scale, ty + 90 * scale);
    ctx.lineTo(tx + 50 * scale, ty + 80 * scale);
    ctx.quadraticCurveTo(tx + 20 * scale, ty + 60 * scale, tx + 30 * scale, ty);
    ctx.fill();
  }

  // Winner label below trophy
  if (winner) {
    ctx.fillStyle = '#F9C93E';
    ctx.font = `800 26px "Barlow Condensed", Arial Narrow, Arial, sans-serif`;
    ctx.textAlign = 'center';
    ctx.textBaseline = 'top';
    ctx.fillText('CHAMPION', tx + 60 * scale, ty + 122 * scale);

    // Team name
    ctx.fillStyle = '#FFFFFF';
    ctx.font = `800 22px "Barlow Condensed", Arial Narrow, Arial, sans-serif`;
    ctx.fillText(winner.toUpperCase(), tx + 60 * scale, ty + 150 * scale);
  } else {
    ctx.fillStyle = '#3a3a55';
    ctx.font = `bold 18px "Barlow Condensed", Arial, sans-serif`;
    ctx.textAlign = 'center';
    ctx.textBaseline = 'top';
    ctx.fillText('CHAMPION', tx + 60 * scale, ty + 122 * scale);
  }
}

// ─── Round label ───────────────────────────────────────────────────────────────

function drawRoundLabel(
  ctx: CanvasRenderingContext2D,
  colX: number,
  label: string,
  width = BW
) {
  ctx.fillStyle = 'rgba(249,115,22,0.65)';
  ctx.font = `bold 12px "Barlow Condensed", Arial, sans-serif`;
  ctx.textAlign = 'left';
  ctx.textBaseline = 'middle';
  // small dot accent
  ctx.beginPath();
  ctx.arc(colX + 5, 80, 3, 0, Math.PI * 2);
  ctx.fill();
  ctx.fillStyle = 'rgba(255,255,255,0.45)';
  ctx.font = `bold 11px "Barlow Condensed", Arial, sans-serif`;
  ctx.letterSpacing = '2px';
  ctx.fillText(label.toUpperCase(), colX + 14, 80);
  ctx.letterSpacing = '0px';

  // underline
  ctx.strokeStyle = 'rgba(249,115,22,0.3)';
  ctx.lineWidth = 1;
  ctx.beginPath();
  ctx.moveTo(colX, 90);
  ctx.lineTo(colX + width, 90);
  ctx.stroke();
}

// ─── Seed lookup helper ────────────────────────────────────────────────────────

/** Given a team name, find which seed number it was assigned */
function seedOf(name: string | null, seeds: Record<number, string>): number | null {
  if (!name) return null;
  const entry = Object.entries(seeds).find(([, n]) => n === name);
  return entry ? Number(entry[0]) : null;
}

// ─── Portrait layout for mobile ───────────────────────────────────────────────

function drawPortraitBracket(
  seeds: Record<number, string>,
  picks: {
    firstRound: (string | null)[];
    quarterfinal: (string | null)[];
    semifinal: (string | null)[];
    championship: string | null;
  }
): HTMLCanvasElement {
  const PW = 1080;
  const PH = 1100;
  const canvas = document.createElement('canvas');
  canvas.width = PW;
  canvas.height = PH;
  const ctx = canvas.getContext('2d')!;

  // Reuse landscape box geometry (BH=60, MGAP=8, MH=128)
  const PBW = 220;
  const PMH = BH * 2 + MGAP; // 128

  // 4 column centers spread evenly across PW
  const COL_CX = [135, 405, 675, 945] as const;
  const COL_BX = COL_CX.map(cx => cx - PBW / 2); // [25, 295, 565, 835]

  // SF: midpoint of each QF column pair
  const SF_CX = [
    (COL_CX[0] + COL_CX[1]) / 2,  // 270
    (COL_CX[2] + COL_CX[3]) / 2,  // 810
  ];
  const SF_BX = SF_CX.map(cx => cx - PBW / 2); // [160, 700]

  // Championship: centered
  const CHAMP_CX = PW / 2; // 540
  const CHAMP_BW = 260;
  const CHAMP_BX = CHAMP_CX - CHAMP_BW / 2; // 410

  // Row start Y (top edge of each round's top team box)
  const ROW_FR    = 120;
  const ROW_QF    = ROW_FR + PMH + 80;    // 328
  const ROW_SF    = ROW_QF + PMH + 80;    // 536
  const ROW_CHAMP = ROW_SF + PMH + 80;    // 744

  // Matchup center Y for each row
  const frCY    = ROW_FR    + BH + MGAP / 2; // 184
  const qfCY    = ROW_QF    + BH + MGAP / 2; // 392
  const sfCY    = ROW_SF    + BH + MGAP / 2; // 600
  const champCY = ROW_CHAMP + BH + MGAP / 2; // 808

  // ── Background ──────────────────────────────────────────────────────────
  ctx.fillStyle = '#06060e';
  ctx.fillRect(0, 0, PW, PH);

  const glow = ctx.createRadialGradient(PW * 0.5, PH * 0.45, 80, PW * 0.5, PH * 0.45, 700);
  glow.addColorStop(0, 'rgba(180,90,10,0.12)');
  glow.addColorStop(0.5, 'rgba(100,40,5,0.06)');
  glow.addColorStop(1, 'transparent');
  ctx.fillStyle = glow;
  ctx.fillRect(0, 0, PW, PH);

  // ── Header ──────────────────────────────────────────────────────────────
  const hdrGrad = ctx.createLinearGradient(0, 0, 0, 90);
  hdrGrad.addColorStop(0, 'rgba(15,8,0,0.98)');
  hdrGrad.addColorStop(1, 'transparent');
  ctx.fillStyle = hdrGrad;
  ctx.fillRect(0, 0, PW, 90);

  ctx.fillStyle = '#F97316';
  ctx.font = `800 38px "Barlow Condensed", Arial Narrow, Arial, sans-serif`;
  ctx.textAlign = 'center';
  ctx.textBaseline = 'middle';
  ctx.fillText('CFP BRACKET PREDICTOR', PW / 2, 42);

  ctx.fillStyle = 'rgba(249,115,22,0.4)';
  ctx.font = `bold 13px "Barlow Condensed", Arial, sans-serif`;
  ctx.fillText('TRILO.GG', PW / 2, 68);

  // ── Connector helpers ────────────────────────────────────────────────────
  function vertConnector(cx: number, fromY: number, toY: number, active: boolean) {
    setConnectorStyle(ctx, active);
    ctx.beginPath();
    ctx.moveTo(cx, fromY);
    ctx.lineTo(cx, toY);
    ctx.stroke();
  }

  // Two same-row matchups fork down into one matchup below
  function portraitFork(
    leftX: number, rightX: number, srcY: number,
    targetX: number, dstY: number, active: boolean
  ) {
    const spineY = (srcY + dstY) / 2;
    setConnectorStyle(ctx, active);
    ctx.beginPath();
    ctx.moveTo(leftX, srcY);   ctx.lineTo(leftX, spineY);
    ctx.moveTo(rightX, srcY);  ctx.lineTo(rightX, spineY);
    ctx.moveTo(leftX, spineY); ctx.lineTo(rightX, spineY);
    ctx.stroke();
    ctx.beginPath();
    ctx.moveTo(targetX, spineY);
    ctx.lineTo(targetX, dstY);
    ctx.stroke();
  }

  // ── Connectors (drawn before boxes) ─────────────────────────────────────
  for (let i = 0; i < 4; i++) {
    vertConnector(COL_CX[i], ROW_FR + PMH, ROW_QF, picks.firstRound[i] != null);
  }
  portraitFork(COL_CX[0], COL_CX[1], ROW_QF + PMH, SF_CX[0], ROW_SF, picks.semifinal[0] != null);
  portraitFork(COL_CX[2], COL_CX[3], ROW_QF + PMH, SF_CX[1], ROW_SF, picks.semifinal[1] != null);
  portraitFork(SF_CX[0], SF_CX[1], ROW_SF + PMH, CHAMP_CX, ROW_CHAMP, picks.championship != null);

  // ── Round labels ─────────────────────────────────────────────────────────
  function portraitRoundLabel(label: string, rowTopY: number) {
    const y = rowTopY - 22;
    ctx.fillStyle = 'rgba(249,115,22,0.65)';
    ctx.beginPath();
    ctx.arc(28, y, 3, 0, Math.PI * 2);
    ctx.fill();
    ctx.fillStyle = 'rgba(255,255,255,0.45)';
    ctx.font = `bold 11px "Barlow Condensed", Arial, sans-serif`;
    ctx.textAlign = 'left';
    ctx.textBaseline = 'middle';
    ctx.letterSpacing = '2px';
    ctx.fillText(label.toUpperCase(), 40, y);
    ctx.letterSpacing = '0px';
    ctx.strokeStyle = 'rgba(249,115,22,0.3)';
    ctx.lineWidth = 1;
    ctx.beginPath();
    ctx.moveTo(20, y + 10);
    ctx.lineTo(PW - 20, y + 10);
    ctx.stroke();
  }

  portraitRoundLabel('First Round', ROW_FR);
  portraitRoundLabel('Quarterfinal', ROW_QF);
  portraitRoundLabel('Semifinal', ROW_SF);
  portraitRoundLabel('National Championship', ROW_CHAMP);

  // ── First Round ──────────────────────────────────────────────────────────
  drawMatchup(ctx, COL_BX[0], frCY, 12, seeds[12]??null, 5,  seeds[5]??null,  picks.firstRound[0]??null, PBW);
  drawMatchup(ctx, COL_BX[1], frCY, 9,  seeds[9]??null,  8,  seeds[8]??null,  picks.firstRound[1]??null, PBW);
  drawMatchup(ctx, COL_BX[2], frCY, 11, seeds[11]??null, 6,  seeds[6]??null,  picks.firstRound[2]??null, PBW);
  drawMatchup(ctx, COL_BX[3], frCY, 10, seeds[10]??null, 7,  seeds[7]??null,  picks.firstRound[3]??null, PBW);

  // ── Quarterfinal ─────────────────────────────────────────────────────────
  drawMatchup(ctx, COL_BX[0], qfCY, 4, seeds[4]??null, seedOf(picks.firstRound[0], seeds), picks.firstRound[0]??null, picks.quarterfinal[0]??null, PBW);
  drawMatchup(ctx, COL_BX[1], qfCY, 1, seeds[1]??null, seedOf(picks.firstRound[1], seeds), picks.firstRound[1]??null, picks.quarterfinal[1]??null, PBW);
  drawMatchup(ctx, COL_BX[2], qfCY, 3, seeds[3]??null, seedOf(picks.firstRound[2], seeds), picks.firstRound[2]??null, picks.quarterfinal[2]??null, PBW);
  drawMatchup(ctx, COL_BX[3], qfCY, 2, seeds[2]??null, seedOf(picks.firstRound[3], seeds), picks.firstRound[3]??null, picks.quarterfinal[3]??null, PBW);

  // ── Semifinal ────────────────────────────────────────────────────────────
  drawMatchup(ctx, SF_BX[0], sfCY, seedOf(picks.quarterfinal[0], seeds), picks.quarterfinal[0]??null, seedOf(picks.quarterfinal[1], seeds), picks.quarterfinal[1]??null, picks.semifinal[0]??null, PBW);
  drawMatchup(ctx, SF_BX[1], sfCY, seedOf(picks.quarterfinal[2], seeds), picks.quarterfinal[2]??null, seedOf(picks.quarterfinal[3], seeds), picks.quarterfinal[3]??null, picks.semifinal[1]??null, PBW);

  // ── Championship ─────────────────────────────────────────────────────────
  drawMatchup(ctx, CHAMP_BX, champCY, seedOf(picks.semifinal[0], seeds), picks.semifinal[0]??null, seedOf(picks.semifinal[1], seeds), picks.semifinal[1]??null, picks.championship??null, CHAMP_BW);

  // ── Champion banner ──────────────────────────────────────────────────────
  const bannerY = ROW_CHAMP + PMH + 24;
  const bannerH = 64;
  if (picks.championship) {
    const grad = ctx.createLinearGradient(0, bannerY, 0, bannerY + bannerH);
    grad.addColorStop(0, 'rgba(200,160,40,0.25)');
    grad.addColorStop(1, 'rgba(200,160,40,0.05)');
    ctx.fillStyle = grad;
    roundRect(ctx, 60, bannerY, PW - 120, bannerH, 8);
    ctx.fill();
    ctx.strokeStyle = 'rgba(200,160,40,0.6)';
    ctx.lineWidth = 1.5;
    roundRect(ctx, 60, bannerY, PW - 120, bannerH, 8);
    ctx.stroke();

    ctx.fillStyle = '#F9C93E';
    ctx.font = `800 13px "Barlow Condensed", Arial Narrow, Arial, sans-serif`;
    ctx.textAlign = 'center';
    ctx.textBaseline = 'middle';
    ctx.letterSpacing = '3px';
    ctx.fillText('CHAMPION', PW / 2, bannerY + 20);
    ctx.letterSpacing = '0px';

    ctx.fillStyle = '#FFFFFF';
    ctx.font = `800 28px "Barlow Condensed", Arial Narrow, Arial, sans-serif`;
    ctx.fillText(picks.championship.toUpperCase(), PW / 2, bannerY + 46);
  } else {
    ctx.fillStyle = 'rgba(40,40,60,0.5)';
    roundRect(ctx, 60, bannerY, PW - 120, bannerH, 8);
    ctx.fill();
    ctx.fillStyle = 'rgba(255,255,255,0.18)';
    ctx.font = `800 18px "Barlow Condensed", Arial Narrow, Arial, sans-serif`;
    ctx.textAlign = 'center';
    ctx.textBaseline = 'middle';
    ctx.fillText('CHAMPION TBD', PW / 2, bannerY + bannerH / 2);
  }

  // ── Footer banner ────────────────────────────────────────────────────────
  const footerH = 32;
  ctx.fillStyle = '#F97316';
  ctx.fillRect(0, PH - footerH, PW, footerH);
  ctx.fillStyle = '#000000';
  ctx.font = `800 14px "Barlow Condensed", Arial Narrow, Arial, sans-serif`;
  ctx.textAlign = 'center';
  ctx.textBaseline = 'middle';
  ctx.fillText('MADE WITH TRILO · TRILO.GG', PW / 2, PH - footerH / 2);

  return canvas;
}

// ─── Main export function ──────────────────────────────────────────────────────

export function exportBracket(
  seeds: Record<number, string>,
  picks: {
    firstRound: (string | null)[];
    quarterfinal: (string | null)[];
    semifinal: (string | null)[];
    championship: string | null;
  }
) {
  // ── Mobile: use portrait layout ───────────────────────────────────────────
  if (window.innerWidth < 768) {
    const portraitCanvas = drawPortraitBracket(seeds, picks);
    const dataUrl = portraitCanvas.toDataURL('image/jpeg', 0.93);
    const win = window.open('', '_blank');
    if (win) {
      win.document.write(`<!DOCTYPE html>
<html>
<head>
  <title>CFP Bracket</title>
  <meta name="viewport" content="width=device-width, initial-scale=1">
  <style>
    * { margin: 0; padding: 0; box-sizing: border-box; }
    body { background: #000; display: flex; align-items: center; justify-content: center; min-height: 100dvh; }
    img { max-width: 100%; max-height: 100dvh; object-fit: contain; display: block; }
  </style>
</head>
<body>
  <img src="${dataUrl}" alt="CFP Bracket" />
</body>
</html>`);
      win.document.close();
    }
    return;
  }

  const canvas = document.createElement('canvas');
  canvas.width = W;
  canvas.height = H;
  const ctx = canvas.getContext('2d')!;

  // ── Background ────────────────────────────────────────────────────────────
  drawBackground(ctx);

  // ── Header bar ────────────────────────────────────────────────────────────
  const hdrGrad = ctx.createLinearGradient(0, 0, 0, 78);
  hdrGrad.addColorStop(0, 'rgba(15,8,0,0.98)');
  hdrGrad.addColorStop(1, 'rgba(10,5,0,0.0)');
  ctx.fillStyle = hdrGrad;
  ctx.fillRect(0, 0, W, 78);

  // Title
  ctx.fillStyle = '#F97316';
  ctx.font = `800 46px "Barlow Condensed", Arial Narrow, Arial, sans-serif`;
  ctx.textAlign = 'left';
  ctx.textBaseline = 'middle';
  ctx.fillText('CFP BRACKET PREDICTOR', COL_FR, 44);

  // Watermark
  ctx.fillStyle = 'rgba(249,115,22,0.4)';
  ctx.font = `bold 14px "Barlow Condensed", Arial, sans-serif`;
  ctx.textAlign = 'right';
  ctx.fillText('TRILO.GG', W - 28, 44);

  // If champion picked, show in header
  if (picks.championship) {
    ctx.fillStyle = 'rgba(255,255,255,0.85)';
    ctx.font = `800 28px "Barlow Condensed", Arial Narrow, Arial, sans-serif`;
    ctx.textAlign = 'right';
    ctx.fillText(`🏆  ${picks.championship.toUpperCase()}  IS YOUR CHAMPION`, W - 28, 44);
  }

  // ── Round labels ──────────────────────────────────────────────────────────
  drawRoundLabel(ctx, COL_FR, 'First Round');
  drawRoundLabel(ctx, COL_QF, 'Quarterfinal');
  drawRoundLabel(ctx, COL_SF, 'Semifinal');
  drawRoundLabel(ctx, COL_CHAMP, 'National Championship');

  // ── Connectors (drawn before boxes so boxes sit on top) ───────────────────

  for (let i = 0; i < 4; i++) {
    const frC = frCenterY(i);
    const qfC = qfCenterY(i);
    const frHasWinner = picks.firstRound[i] != null;

    // FR internal matchup connector → right stub to QF
    drawMatchupConnector(ctx, COL_FR, frC, COL_QF, frHasWinner);

    const qfHasWinner = picks.quarterfinal[i] != null;
    // QF internal L-shape only — drawForkConnector handles QF→SF
    drawMatchupConnector(ctx, COL_QF, qfC, null, qfHasWinner);
  }

  // QF[0]+QF[1] → SF[0]
  drawForkConnector(
    ctx,
    COL_QF + BW, qfCenterY(0), qfCenterY(1),
    COL_SF, sfCenterY(0),
    picks.semifinal[0] != null
  );
  // QF[2]+QF[3] → SF[1]
  drawForkConnector(
    ctx,
    COL_QF + BW, qfCenterY(2), qfCenterY(3),
    COL_SF, sfCenterY(1),
    picks.semifinal[1] != null
  );

  // SF[0]+SF[1] → Championship
  drawForkConnector(
    ctx,
    COL_SF + BW, sfCenterY(0), sfCenterY(1),
    COL_CHAMP, champCenterY(),
    picks.championship != null
  );

  // ── First Round matchups ──────────────────────────────────────────────────
  // FR[0]: 12 vs 5
  drawMatchup(ctx, COL_FR, frCenterY(0),
    12, seeds[12] ?? null, 5, seeds[5] ?? null, picks.firstRound[0] ?? null);
  // FR[1]: 9 vs 8
  drawMatchup(ctx, COL_FR, frCenterY(1),
    9, seeds[9] ?? null, 8, seeds[8] ?? null, picks.firstRound[1] ?? null);
  // FR[2]: 11 vs 6
  drawMatchup(ctx, COL_FR, frCenterY(2),
    11, seeds[11] ?? null, 6, seeds[6] ?? null, picks.firstRound[2] ?? null);
  // FR[3]: 10 vs 7
  drawMatchup(ctx, COL_FR, frCenterY(3),
    10, seeds[10] ?? null, 7, seeds[7] ?? null, picks.firstRound[3] ?? null);

  // ── Quarterfinal matchups ─────────────────────────────────────────────────
  // QF[0]: seed 4 (bye) vs FR[0] winner
  drawMatchup(ctx, COL_QF, qfCenterY(0),
    4, seeds[4] ?? null, seedOf(picks.firstRound[0], seeds), picks.firstRound[0] ?? null, picks.quarterfinal[0] ?? null);
  // QF[1]: seed 1 (bye) vs FR[1] winner
  drawMatchup(ctx, COL_QF, qfCenterY(1),
    1, seeds[1] ?? null, seedOf(picks.firstRound[1], seeds), picks.firstRound[1] ?? null, picks.quarterfinal[1] ?? null);
  // QF[2]: seed 3 (bye) vs FR[2] winner
  drawMatchup(ctx, COL_QF, qfCenterY(2),
    3, seeds[3] ?? null, seedOf(picks.firstRound[2], seeds), picks.firstRound[2] ?? null, picks.quarterfinal[2] ?? null);
  // QF[3]: seed 2 (bye) vs FR[3] winner
  drawMatchup(ctx, COL_QF, qfCenterY(3),
    2, seeds[2] ?? null, seedOf(picks.firstRound[3], seeds), picks.firstRound[3] ?? null, picks.quarterfinal[3] ?? null);

  // ── Semifinal matchups ────────────────────────────────────────────────────
  drawMatchup(ctx, COL_SF, sfCenterY(0),
    seedOf(picks.quarterfinal[0], seeds), picks.quarterfinal[0] ?? null,
    seedOf(picks.quarterfinal[1], seeds), picks.quarterfinal[1] ?? null,
    picks.semifinal[0] ?? null);
  drawMatchup(ctx, COL_SF, sfCenterY(1),
    seedOf(picks.quarterfinal[2], seeds), picks.quarterfinal[2] ?? null,
    seedOf(picks.quarterfinal[3], seeds), picks.quarterfinal[3] ?? null,
    picks.semifinal[1] ?? null);

  // ── Championship matchup ──────────────────────────────────────────────────
  const champW = BW + 24;
  drawMatchup(ctx, COL_CHAMP, champCenterY(),
    seedOf(picks.semifinal[0], seeds), picks.semifinal[0] ?? null,
    seedOf(picks.semifinal[1], seeds), picks.semifinal[1] ?? null,
    picks.championship ?? null,
    champW);

  // ── Trophy ────────────────────────────────────────────────────────────────
  const trophyX = COL_CHAMP + champW + 60;
  drawTrophy(ctx, trophyX, champCenterY(), picks.championship ?? null);

  // ── Footer banner ─────────────────────────────────────────────────────────
  const footerH = 32;
  ctx.fillStyle = '#F97316';
  ctx.fillRect(0, H - footerH, W, footerH);
  ctx.fillStyle = '#000000';
  ctx.font = `800 14px "Barlow Condensed", Arial Narrow, Arial, sans-serif`;
  ctx.textAlign = 'center';
  ctx.textBaseline = 'middle';
  ctx.fillText('MADE WITH TRILO · TRILO.GG', W / 2, H - footerH / 2);

  // ── Open in new tab ───────────────────────────────────────────────────────
  const dataUrl = canvas.toDataURL('image/jpeg', 0.93);
  const win = window.open('', '_blank');
  if (win) {
    win.document.write(`<!DOCTYPE html>
<html>
<head>
  <title>CFP Bracket</title>
  <meta name="viewport" content="width=device-width, initial-scale=1">
  <style>
    * { margin: 0; padding: 0; box-sizing: border-box; }
    body { background: #000; display: flex; align-items: center; justify-content: center; min-height: 100dvh; }
    img { max-width: 100%; max-height: 100dvh; object-fit: contain; display: block; }
  </style>
</head>
<body>
  <img src="${dataUrl}" alt="CFP Bracket" />
</body>
</html>`);
    win.document.close();
  }
}
