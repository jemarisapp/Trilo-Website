/**
 * Test endpoint to verify webhook is reachable
 * GET /api/test-webhook
 */

export default async function handler(req, res) {
  const checks = {
    stripe_secret: !!process.env.STRIPE_SECRET_KEY,
    webhook_secret: !!process.env.STRIPE_WEBHOOK_SECRET,
    supabase_url: !!process.env.SUPABASE_URL,
    supabase_key: !!process.env.SUPABASE_SERVICE_ROLE_KEY,
    discord_token: !!process.env.DISCORD_TOKEN,
  };

  const allGood = Object.values(checks).every(v => v === true);

  res.json({
    status: allGood ? 'OK' : 'MISSING_ENV_VARS',
    checks,
    timestamp: new Date().toISOString(),
  });
}
