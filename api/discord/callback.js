/**
 * Vercel Serverless Function: Discord OAuth Callback
 * GET /api/discord/callback
 */

export default async function handler(req, res) {
  // Only allow GET
  if (req.method !== 'GET') {
    return res.status(405).json({ error: 'Method not allowed' });
  }

  const { code } = req.query;

  if (!code) {
    return res.status(400).json({ error: 'Missing authorization code' });
  }

  try {
    const siteUrl = process.env.VITE_SITE_URL || 'https://trilo.gg';
    const redirectUri = `${siteUrl}/auth/callback`;

    console.log('Exchanging Discord code with redirect_uri:', redirectUri);

    // Exchange code for access token
    const tokenResponse = await fetch('https://discord.com/api/oauth2/token', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/x-www-form-urlencoded',
      },
      body: new URLSearchParams({
        client_id: process.env.DISCORD_CLIENT_ID,
        client_secret: process.env.DISCORD_CLIENT_SECRET,
        grant_type: 'authorization_code',
        code: code,
        redirect_uri: redirectUri,
      }),
    });

    const tokenData = await tokenResponse.json();

    if (!tokenData.access_token) {
      console.error('Discord token exchange failed:', tokenData);
      throw new Error(tokenData.error_description || tokenData.error || 'Failed to get access token');
    }

    // Get user info
    const userResponse = await fetch('https://discord.com/api/users/@me', {
      headers: {
        Authorization: `Bearer ${tokenData.access_token}`,
      },
    });

    const userData = await userResponse.json();

    res.json({
      success: true,
      user: {
        id: userData.id,
        username: userData.username,
        discriminator: userData.discriminator,
        avatar: userData.avatar,
        email: userData.email,
      },
    });
  } catch (error) {
    console.error('Discord OAuth error:', error);
    res.status(500).json({
      error: 'Failed to authenticate with Discord',
      message: error.message || 'Unknown error',
    });
  }
}
