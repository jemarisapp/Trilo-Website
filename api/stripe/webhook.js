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

  if (event.type === 'checkout.session.completed') {
    const session = event.data.object;

    // We only care about subscriptions
    if (session.mode === 'subscription') {
      try {
        await handleSubscriptionFulfillment(session);
      } catch (err) {
        console.error('Error handling subscription fulfillment:', err);
        // Do not return 500, or Stripe will retry indefinitely
      }
    }
  }

  res.status(200).send();
}

async function handleSubscriptionFulfillment(session) {
  const customerId = session.customer;
  const subscriptionId = session.subscription;
  const discordUserId = session.metadata?.discord_user_id || session.client_reference_id;

  console.log(`Processing subscription for Customer: ${customerId}, User: ${discordUserId}`);

  // 1. Generate License Key
  const licenseKey = generateLicenseKey();
  console.log(`Generated License Key: ${licenseKey}`);

  // 2. Update Stripe Customer Metadata
  await stripe.customers.update(customerId, {
    metadata: {
      license_key: licenseKey,
      discord_user_id: discordUserId || ''
    }
  });

  // 3. Insert into Supabase (Pending Activation)
  const now = new Date();
  const endDate = new Date();
  endDate.setDate(endDate.getDate() + 30); // Default to monthly

  const { error: dbError } = await supabase
    .from('server_subscriptions')
    .insert([
      {
        guild_id: `PENDING_${licenseKey}`,
        license_key: licenseKey,
        owner_user_id: discordUserId,
        subscription_status: 'active',
        plan_type: 'trilo',
        stripe_customer_id: customerId,
        stripe_subscription_id: subscriptionId,
        created_at: now.toISOString(),
        updated_at: now.toISOString(),
        activation_slot: 0
      }
    ]);

  if (dbError) {
    console.error('Supabase Insert Error:', dbError);
  } else {
    console.log('License key stored in Supabase.');
  }

  // 4. Send DM to User
  if (discordUserId) {
    const dmMessage = `
**Your Trilo license is ready!**

**License Key:** \`${licenseKey}\`

**How to Activate:**
1. Go to your Discord server
2. Run command: \`/admin activate ${licenseKey}\`

Your license works on up to 3 Discord servers!

Need help? Contact @trillsapp.
    `;
    await sendDiscordDM(discordUserId, dmMessage);
  }
}
