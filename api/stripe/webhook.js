/**
 * Vercel Serverless Function: Stripe Webhook Handler
 * POST /api/stripe/webhook
 */

import Stripe from 'stripe';
import { createClient } from '@supabase/supabase-js';
import { generateLicenseKey, sendDiscordDM } from '../_helpers.js';

const stripe = new Stripe(process.env.STRIPE_SECRET_KEY, {
  apiVersion: '2024-11-20.acacia',
});

const supabase = createClient(
  process.env.SUPABASE_URL,
  process.env.SUPABASE_SERVICE_ROLE_KEY
);

// Disable body parsing - we need the raw body for signature verification
export const config = {
  api: {
    bodyParser: false,
  },
};

// Helper to get raw body as string (Stripe needs string, not Buffer)
async function getRawBody(req) {
  return new Promise((resolve, reject) => {
    const chunks = [];
    req.on('data', (chunk) => chunks.push(chunk));
    req.on('end', () => resolve(Buffer.concat(chunks).toString('utf8')));
    req.on('error', reject);
  });
}

export default async function handler(req, res) {
  // Only allow POST
  if (req.method !== 'POST') {
    return res.status(405).json({ error: 'Method not allowed' });
  }

  const sig = req.headers['stripe-signature'];
  const endpointSecret = process.env.STRIPE_WEBHOOK_SECRET;

  if (!sig || !endpointSecret) {
    console.error('Missing signature or webhook secret');
    return res.status(400).send('Webhook Error: Missing signature or secret');
  }

  let event;

  try {
    const rawBody = await getRawBody(req);
    event = stripe.webhooks.constructEvent(rawBody, sig, endpointSecret);
  } catch (err) {
    console.error(`Webhook Signature Verification Failed: ${err.message}`);
    return res.status(400).send(`Webhook Error: ${err.message}`);
  }

  // Handle the event
  console.log(`Received Webhook Event: ${event.type}`);

  try {
    if (event.type === 'checkout.session.completed') {
      const session = event.data.object;
      if (session.mode === 'subscription') {
        await handleCheckoutFulfillment(session);
      }
    } else if (event.type === 'customer.subscription.updated') {
      await handleSubscriptionUpdated(event.data.object);
    } else if (event.type === 'customer.subscription.deleted') {
      await handleSubscriptionDeleted(event.data.object);
    }
  } catch (err) {
    console.error(`Error handling ${event.type}:`, err);
    // Do not return 500, or Stripe will retry indefinitely.
  }

  res.status(200).send();
}

async function handleCheckoutFulfillment(session) {
  const customerId = session.customer;
  const subscriptionId = session.subscription || null;
  const discordUserId = session.metadata?.discord_user_id || session.client_reference_id;
  const plan = session.metadata?.plan || 'monthly';

  console.log(`Processing ${plan} checkout for Customer: ${customerId}, User: ${discordUserId}`);

  let billingInterval = 'month';
  let subscriptionStatus = 'active';
  let currentPeriodStart = null;
  let currentPeriodEnd = null;
  let stripeProductId = null;

  const subscription = await stripe.subscriptions.retrieve(subscriptionId, {
    expand: ['items.data.price'],
  });

  const price = subscription.items.data[0]?.price;
  billingInterval = price?.recurring?.interval || billingInterval;
  subscriptionStatus = subscription.status;
  currentPeriodStart = subscription.current_period_start
    ? new Date(subscription.current_period_start * 1000)
    : null;
  currentPeriodEnd = subscription.current_period_end
    ? new Date(subscription.current_period_end * 1000)
    : null;
  stripeProductId = typeof price?.product === 'string' ? price.product : price?.product?.id || null;

  // 1. Generate License Key
  const licenseKey = generateLicenseKey();
  console.log(`Generated License Key: ${licenseKey}`);

  // 2. Update Stripe Customer Metadata
  await stripe.customers.update(customerId, {
    metadata: {
      license_key: licenseKey,
      discord_user_id: discordUserId || '',
      trilo_plan: plan
    }
  });

  // 3. Insert into Supabase (Pending Activation)
  const licenseId = await upsertLicense({
    licenseKey,
    discordUserId,
    status: subscriptionStatus === 'active' || subscriptionStatus === 'trialing'
      ? 'pending_activation'
      : 'inactive',
  });

  await upsertSubscription({
    licenseId,
    customerId,
    subscriptionId,
    stripeProductId,
    status: subscriptionStatus,
    billingInterval,
    currentPeriodStart,
    currentPeriodEnd,
  });

  console.log('License key stored in Supabase normalized tables.');

  // 4. Send DM to User
  if (discordUserId) {
    const dmMessage = `
**Your Trilo license is ready!**

**License Key:** \`${licenseKey}\`

**How to Activate:**
1. Go to your Discord server
2. Run command: \`/admin activate ${licenseKey}\`

Your license activates one Discord server.

Need help? Contact @trillsapp.
    `;
    await sendDiscordDM(discordUserId, dmMessage);
  }
}

async function handleSubscriptionUpdated(subscription) {
  const status = subscription.status;
  const subscriptionId = subscription.id;
  const currentPeriodStart = subscription.current_period_start
    ? new Date(subscription.current_period_start * 1000).toISOString()
    : null;
  const currentPeriodEnd = subscription.current_period_end
    ? new Date(subscription.current_period_end * 1000).toISOString()
    : null;

  const { data: subscriptionRow, error } = await supabase
    .from('subscriptions')
    .update({
      status,
      subscription_end_date: currentPeriodEnd,
      current_period_start: currentPeriodStart,
      current_period_end: currentPeriodEnd,
      updated_at: new Date().toISOString(),
    })
    .eq('stripe_subscription_id', subscriptionId)
    .select('license_id')
    .maybeSingle();

  if (error) {
    console.error('Supabase subscription update error:', error);
    return;
  }

  if (subscriptionRow?.license_id) {
    await supabase
      .from('licenses')
      .update({
        status: status === 'active' || status === 'trialing' ? 'active' : 'inactive',
        updated_at: new Date().toISOString(),
      })
      .eq('id', subscriptionRow.license_id);
  }
}

async function handleSubscriptionDeleted(subscription) {
  const { data: subscriptionRow, error } = await supabase
    .from('subscriptions')
    .update({
      status: 'inactive',
      updated_at: new Date().toISOString(),
    })
    .eq('stripe_subscription_id', subscription.id)
    .select('license_id')
    .maybeSingle();

  if (error) {
    console.error('Supabase subscription delete error:', error);
    return;
  }

  if (subscriptionRow?.license_id) {
    await supabase
      .from('licenses')
      .update({
        status: 'inactive',
        updated_at: new Date().toISOString(),
      })
      .eq('id', subscriptionRow.license_id);
  }
}

async function upsertLicense({ licenseKey, discordUserId, status }) {
  const { data, error } = await supabase
    .from('licenses')
    .upsert(
      {
        license_key: licenseKey,
        owner_discord_user_id: discordUserId || null,
        status,
        updated_at: new Date().toISOString(),
      },
      { onConflict: 'license_key' }
    )
    .select('id')
    .single();

  if (error) {
    console.error('Supabase license upsert error:', error);
    throw error;
  }

  return data.id;
}

async function upsertSubscription({
  licenseId,
  customerId,
  subscriptionId,
  stripeProductId,
  status,
  billingInterval,
  currentPeriodStart,
  currentPeriodEnd,
}) {
  if (!licenseId) {
    return;
  }

  const subscriptionRow = {
    license_id: licenseId,
    stripe_customer_id: customerId,
    stripe_subscription_id: subscriptionId,
    stripe_product_id: stripeProductId,
    status,
    billing_interval: billingInterval,
    plan_type: 'trilo',
    current_period_start: currentPeriodStart?.toISOString(),
    current_period_end: currentPeriodEnd?.toISOString(),
    subscription_end_date: currentPeriodEnd?.toISOString(),
    updated_at: new Date().toISOString(),
  };

  const { data: existing, error: lookupError } = await supabase
    .from('subscriptions')
    .select('id')
    .eq('stripe_subscription_id', subscriptionId)
    .maybeSingle();

  if (lookupError) {
    console.error('Supabase subscription lookup error:', lookupError);
    throw lookupError;
  }

  const result = existing
    ? await supabase
        .from('subscriptions')
        .update(subscriptionRow)
        .eq('id', existing.id)
    : await supabase
        .from('subscriptions')
        .insert({
          ...subscriptionRow,
          created_at: new Date().toISOString(),
        });

  if (result.error) {
    console.error('Supabase subscription write error:', result.error);
    throw result.error;
  }
}
