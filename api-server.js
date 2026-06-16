/**
 * Simple Express server for Stripe API routes
 * Run this alongside the Vite dev server
 *
 * Usage: node api-server.js
 */

import express from 'express';
import cors from 'cors';
import Stripe from 'stripe';
import dotenv from 'dotenv';
import { createClient } from '@supabase/supabase-js';
import crypto from 'crypto';

// Load environment variables from .env.local
dotenv.config({ path: '.env.local' });

const app = express();
const PORT = 3001;

// Initialize Stripe
const stripe = new Stripe(process.env.STRIPE_SECRET_KEY, {
  apiVersion: '2024-11-20.acacia',
});

// Initialize Supabase
// We need the SERVICE_ROLE_KEY to bypass RLS for admin inserts (pending subscriptions)
// Fallback to ANON_KEY if not found, but it might fail depending on RLS.
const supabaseUrl = process.env.SUPABASE_URL;
const supabaseKey = process.env.SUPABASE_SERVICE_ROLE_KEY || process.env.SUPABASE_ANON_KEY;
const supabase = createClient(supabaseUrl, supabaseKey);

// Middleware
app.use(cors());

// Use JSON parser with raw body capture for webhook verification
app.use(express.json({
  verify: (req, res, buf) => {
    req.rawBody = buf;
  }
}));

// Helper: Generate License Key
function generateLicenseKey() {
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

// Helper: Send Discord DM
async function sendDiscordDM(userId, message) {
  const token = process.env.DISCORD_TOKEN; // Bot Token
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
            color: 0x5865F2, // Blurple
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

// Health check
app.get('/api/health', (req, res) => {
  res.json({
    status: 'ok',
    stripe: !!process.env.STRIPE_SECRET_KEY,
    supabase: !!supabaseUrl && !!supabaseKey,
    webhookSecret: !!process.env.STRIPE_WEBHOOK_SECRET
  });
});

// Create checkout session
app.post('/api/stripe/checkout', async (req, res) => {
  const { priceId, discordUserId, discordUsername, discordEmail } = req.body;

  console.log('Received priceId:', priceId);
  console.log('Discord user:', discordUserId, discordUsername);

  if (!priceId) {
    return res.status(400).json({ error: 'Missing required field: priceId' });
  }

  if (!process.env.STRIPE_SECRET_KEY) {
    console.error('STRIPE_SECRET_KEY is not defined!');
    return res.status(500).json({ error: 'Stripe configuration error' });
  }

  try {
    // 1. Check if we already have a customer for this Discord user
    let customerId;
    const existingCustomers = await stripe.customers.search({
      query: `metadata['discord_user_id']:'${discordUserId}'`,
      limit: 1,
    });

    if (existingCustomers.data.length > 0) {
      customerId = existingCustomers.data[0].id;
      console.log('Found existing Stripe customer:', customerId);
    } else {
      // 2. If not, create a new customer with the metadata
      const newCustomer = await stripe.customers.create({
        email: discordEmail,
        metadata: {
          discord_user_id: discordUserId,
          discord_username: discordUsername,
        },
      });
      customerId = newCustomer.id;
      console.log('Created new Stripe customer:', customerId);
    }

    const sessionConfig = {
      customer: customerId, // Use the specific customer ID
      mode: 'subscription',
      payment_method_types: ['card'],
      line_items: [
        {
          price: priceId,
          quantity: 1,
        },
      ],
      // Redirect to plain URLs on localhost:3000
      success_url: `${process.env.NEXT_PUBLIC_SITE_URL || 'http://localhost:3000'}/success?session_id={CHECKOUT_SESSION_ID}`,
      cancel_url: `${process.env.NEXT_PUBLIC_SITE_URL || 'http://localhost:3000'}/pricing`,
      allow_promotion_codes: true,
      metadata: {
        discord_user_id: discordUserId,
        discord_username: discordUsername || 'Unknown'
      },
    };

    if (discordUserId) {
      sessionConfig.client_reference_id = discordUserId;
    }

    const session = await stripe.checkout.sessions.create(sessionConfig);

    console.log('Checkout session created:', session.id);
    res.json({ url: session.url });
  } catch (error) {
    console.error('Stripe checkout error:', error);
    res.status(500).json({
      error: 'Failed to create checkout session',
      message: error.message || 'Unknown error',
    });
  }
});

// Discord OAuth callback
app.get('/api/discord/callback', async (req, res) => {
  const { code } = req.query;

  if (!code) {
    return res.status(400).json({ error: 'Missing authorization code' });
  }

  try {
    const siteUrl = process.env.NEXT_PUBLIC_SITE_URL || process.env.VITE_SITE_URL || 'http://localhost:3000';
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
});

// Get license key
app.get('/api/stripe/license', async (req, res) => {
  const { session_id } = req.query;

  if (!session_id) {
    return res.status(400).json({ error: 'Missing session_id parameter' });
  }

  try {
    const session = await stripe.checkout.sessions.retrieve(session_id);

    if (session.payment_status !== 'paid') {
      return res.status(400).json({
        error: 'Payment not completed',
        payment_status: session.payment_status
      });
    }

    const customerId = session.customer;

    if (!customerId) {
      return res.status(400).json({ error: 'Customer ID not found in session' });
    }

    // Get license key from customer metadata
    const customer = await stripe.customers.retrieve(customerId);
    const licenseKey = customer.metadata?.license_key;

    if (!licenseKey) {
      return res.status(404).json({
        error: 'License key not found',
        message: 'The license key is being generated. Please refresh the page in a few seconds.'
      });
    }

    return res.json({
      success: true,
      licenseKey: licenseKey,
      customerId: customerId,
    });
  } catch (error) {
    console.error('License retrieval error:', error);
    return res.status(500).json({
      error: 'Failed to retrieve license information',
      message: error.message || 'Unknown error',
    });
  }
});

// Create customer portal session
app.post('/api/stripe/portal', async (req, res) => {
  const { discordUserId } = req.body;

  if (!discordUserId) {
    return res.status(400).json({ error: 'Missing discordUserId' });
  }

  try {
    const customers = await stripe.customers.search({
      query: `metadata['discord_user_id']:'${discordUserId}'`,
      limit: 1,
    });

    let customerId;
    if (customers.data.length > 0) {
      customerId = customers.data[0].id;
    } else {
      return res.status(404).json({ error: 'No subscription found for this user.' });
    }

    const session = await stripe.billingPortal.sessions.create({
      customer: customerId,
      return_url: `${process.env.NEXT_PUBLIC_SITE_URL || 'http://localhost:3000'}/pricing`,
    });

    res.json({ url: session.url });
  } catch (error) {
    console.error('Portal session creation error:', error);
    res.status(500).json({
      error: 'Failed to create portal session',
      message: error.message
    });
  }
});

// --- STRIPE WEBHOOK HANDLER ---
app.post('/api/stripe/webhook', async (req, res) => {
  const sig = req.headers['stripe-signature'];
  const endpointSecret = process.env.STRIPE_WEBHOOK_SECRET;

  let event;

  try {
    // Verify signature using raw body
    event = stripe.webhooks.constructEvent(req.rawBody, sig, endpointSecret);
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
        // Do not return 500, or Stripe will retry indefinitely. 
        // Log it and alert admin if possible.
      }
    }
  }

  res.send();
});

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
      discord_user_id: discordUserId
    }
  });

  // 3. Insert into Supabase normalized licensing tables.
  const subscription = await stripe.subscriptions.retrieve(subscriptionId, {
    expand: ['items.data.price'],
  });
  const price = subscription.items.data[0]?.price;
  const currentPeriodStart = subscription.current_period_start
    ? new Date(subscription.current_period_start * 1000)
    : null;
  const currentPeriodEnd = subscription.current_period_end
    ? new Date(subscription.current_period_end * 1000)
    : null;
  const stripeProductId = typeof price?.product === 'string'
    ? price.product
    : price?.product?.id || null;

  const { data: licenseRow, error: licenseError } = await supabase
    .from('licenses')
    .upsert(
      {
        license_key: licenseKey,
        owner_discord_user_id: discordUserId || null,
        status: 'pending_activation',
        updated_at: new Date().toISOString(),
      },
      { onConflict: 'license_key' }
    )
    .select('id')
    .single();

  if (licenseError) {
    console.error('Supabase license insert error:', licenseError);
    throw licenseError;
  }

  const subscriptionRow = {
    license_id: licenseRow.id,
    stripe_customer_id: customerId,
    stripe_subscription_id: subscriptionId,
    stripe_product_id: stripeProductId,
    status: subscription.status,
    billing_interval: price?.recurring?.interval || 'month',
    plan_type: 'trilo',
    current_period_start: currentPeriodStart?.toISOString(),
    current_period_end: currentPeriodEnd?.toISOString(),
    subscription_end_date: currentPeriodEnd?.toISOString(),
    updated_at: new Date().toISOString(),
  };

  const { data: existingSubscription, error: lookupError } = await supabase
    .from('subscriptions')
    .select('id')
    .eq('stripe_subscription_id', subscriptionId)
    .maybeSingle();

  if (lookupError) {
    console.error('Supabase subscription lookup error:', lookupError);
    throw lookupError;
  }

  const subscriptionResult = existingSubscription
    ? await supabase
        .from('subscriptions')
        .update(subscriptionRow)
        .eq('id', existingSubscription.id)
    : await supabase
        .from('subscriptions')
        .insert({
          ...subscriptionRow,
          created_at: new Date().toISOString(),
        });

  if (subscriptionResult.error) {
    console.error('Supabase subscription write error:', subscriptionResult.error);
    throw subscriptionResult.error;
  }

  console.log('License key stored in Supabase normalized tables.');

  // 4. Send DM to User
  if (discordUserId) {
    const dmMessage = `
**Your Trilo license is ready!**

**License Key:** \`${licenseKey}\`

**How to Activate:**
1. Go to your Discord server
2. Run command: \`/admin activate ${licenseKey}\`

Need help? Contact @trillsapp.
    `;
    await sendDiscordDM(discordUserId, dmMessage);
  }
}

const server = app.listen(PORT, () => {
  console.log(`✅ API server running on http://localhost:${PORT}`);
  console.log(`🔑 Stripe configured: ${!!process.env.STRIPE_SECRET_KEY}`);
  console.log(`📡 Webhook configured: ${!!process.env.STRIPE_WEBHOOK_SECRET}`);
});

server.on('error', (err) => {
  console.error('❌ Server failed to start:', err);
});

// KEEP-ALIVE: Force the process to stay running
setInterval(() => {
  // meaningful no-op to keep event loop active
}, 10000);

process.on('SIGINT', () => {
  console.log('🛑 Shutting down server...');
  server.close(() => {
    console.log('✅ Server closed');
    process.exit(0);
  });
});
