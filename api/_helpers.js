/**
 * Shared helper functions for Vercel API routes
 */
import crypto from 'node:crypto';

const DISCORD_SESSION_COOKIE = 'trilo_discord_session';
const SESSION_MAX_AGE_SECONDS = 60 * 60 * 24 * 30;

function base64UrlEncode(value) {
  return Buffer.from(value).toString('base64url');
}

function base64UrlJson(value) {
  return base64UrlEncode(JSON.stringify(value));
}

function getSessionSecret() {
  const secret = process.env.DISCORD_SESSION_SECRET;
  if (!secret || secret.length < 32) {
    throw new Error('DISCORD_SESSION_SECRET must be set to at least 32 characters.');
  }
  return secret;
}

function signPayload(payload) {
  return crypto
    .createHmac('sha256', getSessionSecret())
    .update(payload)
    .digest('base64url');
}

function timingSafeEqualString(a, b) {
  const aBuffer = Buffer.from(a);
  const bBuffer = Buffer.from(b);
  return aBuffer.length === bBuffer.length && crypto.timingSafeEqual(aBuffer, bBuffer);
}

function parseCookies(req) {
  const header = req.headers.cookie || '';
  return Object.fromEntries(
    header
      .split(';')
      .map((cookie) => cookie.trim())
      .filter(Boolean)
      .map((cookie) => {
        const index = cookie.indexOf('=');
        if (index === -1) return [cookie, ''];
        return [cookie.slice(0, index), decodeURIComponent(cookie.slice(index + 1))];
      })
  );
}

function shouldUseSecureCookie() {
  const siteUrl = process.env.VITE_SITE_URL || '';
  return process.env.NODE_ENV === 'production' || siteUrl.startsWith('https://');
}

export function createDiscordSessionToken(user) {
  const now = Math.floor(Date.now() / 1000);
  const payload = base64UrlJson({
    sub: String(user.id),
    username: user.username || '',
    discriminator: user.discriminator || '',
    avatar: user.avatar || '',
    email: user.email || '',
    iat: now,
    exp: now + SESSION_MAX_AGE_SECONDS,
  });
  const signature = signPayload(payload);
  return `${payload}.${signature}`;
}

export function verifyDiscordSessionToken(token) {
  if (!token || typeof token !== 'string') return null;

  const [payload, signature] = token.split('.');
  if (!payload || !signature) return null;

  const expectedSignature = signPayload(payload);
  if (!timingSafeEqualString(signature, expectedSignature)) return null;

  try {
    const session = JSON.parse(Buffer.from(payload, 'base64url').toString('utf8'));
    if (!session.sub || !session.exp || session.exp < Math.floor(Date.now() / 1000)) {
      return null;
    }
    return session;
  } catch {
    return null;
  }
}

export function getDiscordSession(req) {
  const cookies = parseCookies(req);
  return verifyDiscordSessionToken(cookies[DISCORD_SESSION_COOKIE]);
}

export function setDiscordSessionCookie(res, user) {
  const token = createDiscordSessionToken(user);
  const secure = shouldUseSecureCookie() ? '; Secure' : '';
  res.setHeader(
    'Set-Cookie',
    `${DISCORD_SESSION_COOKIE}=${encodeURIComponent(token)}; HttpOnly; Path=/; Max-Age=${SESSION_MAX_AGE_SECONDS}; SameSite=Lax${secure}`
  );
}

export function clearDiscordSessionCookie(res) {
  const secure = shouldUseSecureCookie() ? '; Secure' : '';
  res.setHeader(
    'Set-Cookie',
    `${DISCORD_SESSION_COOKIE}=; HttpOnly; Path=/; Max-Age=0; SameSite=Lax${secure}`
  );
}

// Generate License Key
export function generateLicenseKey() {
  const chars = 'ABCDEFGHIJKLMNOPQRSTUVWXYZ0123456789';
  const blocks = [];
  for (let i = 0; i < 3; i++) {
    let block = '';
    for (let j = 0; j < 4; j++) {
      block += chars.charAt(Math.floor(Math.random() * chars.length));
    }
    blocks.push(block);
  }
  return `TRILO-${blocks.join('-')}`;
}

// Send Discord DM
export async function sendDiscordDM(userId, message) {
  const token = process.env.DISCORD_TOKEN;
  if (!token) {
    console.error('Missing DISCORD_TOKEN, cannot send DM.');
    return;
  }

  try {
    // 1. Create DM Channel
    const channelRes = await fetch('https://discord.com/api/users/@me/channels', {
      method: 'POST',
      headers: {
        'Authorization': `Bot ${token}`,
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({ recipient_id: userId }),
    });

    const channelData = await channelRes.json();
    if (!channelData.id) {
      console.error('Failed to open DM channel:', channelData);
      return;
    }

    // 2. Send Message
    const msgRes = await fetch(`https://discord.com/api/channels/${channelData.id}/messages`, {
      method: 'POST',
      headers: {
        'Authorization': `Bot ${token}`,
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        embeds: [
          {
            title: "🎉 Thank you for subscribing to Trilo!",
            description: message,
            color: 0xFF8C42, // Trilo orange
            footer: { text: "Trilo • The Dynasty League Assistant" }
          }
        ]
      }),
    });

    if (!msgRes.ok) {
      console.error('Failed to send DM:', await msgRes.text());
    } else {
      console.log(`DM sent to user ${userId}`);
    }

  } catch (error) {
    console.error('Discord API Error:', error);
  }
}
