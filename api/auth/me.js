/**
 * Vercel Serverless Function: Current Discord Session
 * GET /api/auth/me
 */
import { getDiscordSession } from '../_helpers.js';

export default async function handler(req, res) {
  if (req.method !== 'GET') {
    return res.status(405).json({ error: 'Method not allowed' });
  }

  try {
    const session = getDiscordSession(req);
    if (!session) {
      return res.status(401).json({ error: 'Not authenticated' });
    }

    res.json({
      user: {
        id: session.sub,
        username: session.username,
        discriminator: session.discriminator,
        avatar: session.avatar,
        email: session.email || undefined,
      },
    });
  } catch (error) {
    console.error('Session lookup error:', error);
    res.status(500).json({ error: 'Failed to read session' });
  }
}
