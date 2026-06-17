/**
 * Vercel Serverless Function: Signed-in user's Trilo licenses
 * GET /api/licenses/me
 */
import { createClient } from '@supabase/supabase-js';
import { getDiscordSession } from '../_helpers.js';

const supabase = createClient(
  process.env.SUPABASE_URL,
  process.env.SUPABASE_SERVICE_ROLE_KEY
);

function byLicenseId(rows) {
  return rows.reduce((acc, row) => {
    const key = String(row.license_id);
    if (!acc[key]) acc[key] = [];
    acc[key].push(row);
    return acc;
  }, {});
}

export default async function handler(req, res) {
  if (req.method !== 'GET') {
    return res.status(405).json({ error: 'Method not allowed' });
  }

  if (!process.env.SUPABASE_URL || !process.env.SUPABASE_SERVICE_ROLE_KEY) {
    return res.status(500).json({ error: 'Supabase is not configured' });
  }

  let session;
  try {
    session = getDiscordSession(req);
  } catch (error) {
    console.error('License session verification error:', error);
    return res.status(500).json({ error: 'Session verification is not configured' });
  }

  if (!session) {
    return res.status(401).json({ error: 'Sign in with Discord to view licenses.' });
  }

  const { data: licenses, error: licensesError } = await supabase
    .from('licenses')
    .select('id, license_key, owner_discord_user_id, status, created_at, updated_at')
    .eq('owner_discord_user_id', session.sub)
    .order('created_at', { ascending: false });

  if (licensesError) {
    console.error('Supabase licenses lookup error:', licensesError);
    return res.status(500).json({ error: 'Failed to load licenses' });
  }

  const licenseIds = (licenses || []).map((license) => license.id);

  if (licenseIds.length === 0) {
    return res.json({ licenses: [] });
  }

  const [{ data: subscriptions, error: subscriptionsError }, { data: activations, error: activationsError }] =
    await Promise.all([
      supabase
        .from('subscriptions')
        .select(
          'id, license_id, stripe_customer_id, stripe_subscription_id, stripe_product_id, status, billing_interval, plan_type, current_period_start, current_period_end, subscription_end_date, created_at, updated_at'
        )
        .in('license_id', licenseIds),
      supabase
        .from('license_activations')
        .select(
          'id, license_id, server_id, activation_slot, activated_by_discord_user_id, status, created_at, updated_at, deactivated_at'
        )
        .in('license_id', licenseIds)
        .order('created_at', { ascending: false }),
    ]);

  if (subscriptionsError) {
    console.error('Supabase subscriptions lookup error:', subscriptionsError);
    return res.status(500).json({ error: 'Failed to load subscriptions' });
  }

  if (activationsError) {
    console.error('Supabase activations lookup error:', activationsError);
    return res.status(500).json({ error: 'Failed to load license activations' });
  }

  const subscriptionsByLicense = byLicenseId(subscriptions || []);
  const activationsByLicense = byLicenseId(activations || []);

  res.json({
    licenses: licenses.map((license) => ({
      ...license,
      subscriptions: subscriptionsByLicense[String(license.id)] || [],
      activations: activationsByLicense[String(license.id)] || [],
    })),
  });
}
