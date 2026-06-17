/**
 * Vercel Serverless Function: Clear Discord Session
 * POST /api/auth/logout
 */
import { clearDiscordSessionCookie } from '../_helpers.js';

export default async function handler(req, res) {
  if (req.method !== 'POST') {
    return res.status(405).json({ error: 'Method not allowed' });
  }

  clearDiscordSessionCookie(res);
  res.json({ success: true });
}
