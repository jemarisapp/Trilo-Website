/**
 * Vercel Serverless Function: Create Stripe Customer Portal Session
 * POST /api/stripe/portal
 */

import Stripe from 'stripe';

const stripe = new Stripe(process.env.STRIPE_SECRET_KEY, {
  apiVersion: '2024-11-20.acacia',
});

export default async function handler(req, res) {
  // Only allow POST
  if (req.method !== 'POST') {
    return res.status(405).json({ error: 'Method not allowed' });
  }

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

    const siteUrl = process.env.VITE_SITE_URL || 'https://trilo.gg';

    const session = await stripe.billingPortal.sessions.create({
      customer: customerId,
      return_url: `${siteUrl}/pricing`,
    });

    res.json({ url: session.url });
  } catch (error) {
    console.error('Portal session creation error:', error);
    res.status(500).json({
      error: 'Failed to create portal session',
      message: error.message
    });
  }
}
