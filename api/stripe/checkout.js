/**
 * Vercel Serverless Function: Create Stripe Checkout Session
 * POST /api/stripe/checkout
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

  const { plan, priceId, discordUserId, discordUsername, discordEmail } = req.body;

  const plans = {
    monthly: {
      priceId: process.env.STRIPE_PRICE_ID_MONTHLY || process.env.VITE_STRIPE_PRICE_ID_MONTHLY,
      mode: 'subscription',
    },
    annual: {
      priceId: process.env.STRIPE_PRICE_ID_ANNUAL || process.env.VITE_STRIPE_PRICE_ID_ANNUAL,
      mode: 'subscription',
    },
  };

  const selectedPlan = plans[plan] || null;
  const resolvedPriceId = selectedPlan?.priceId || priceId;
  const checkoutMode = selectedPlan?.mode || 'subscription';

  console.log('Received plan:', plan);
  console.log('Resolved checkout mode:', checkoutMode);
  console.log('Discord user:', discordUserId, discordUsername);

  if (plan && !selectedPlan) {
    return res.status(400).json({ error: 'Unsupported plan.' });
  }

  if (!resolvedPriceId) {
    return res.status(400).json({ error: 'Missing Stripe price configuration for this plan.' });
  }

  if (!process.env.STRIPE_SECRET_KEY) {
    console.error('STRIPE_SECRET_KEY is not defined!');
    return res.status(500).json({ error: 'Stripe configuration error' });
  }

  try {
    // 1. Check if we already have a customer for this Discord user
    let customerId;
    if (discordUserId) {
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
            discord_username: discordUsername || 'Unknown',
          },
        });
        customerId = newCustomer.id;
        console.log('Created new Stripe customer:', customerId);
      }
    }

    const siteUrl = process.env.VITE_SITE_URL || 'https://trilo.gg';

    const sessionConfig = {
      mode: checkoutMode,
      payment_method_types: ['card'],
      line_items: [
        {
          price: resolvedPriceId,
          quantity: 1,
        },
      ],
      success_url: `${siteUrl}/success?session_id={CHECKOUT_SESSION_ID}`,
      cancel_url: `${siteUrl}/pricing`,
      allow_promotion_codes: true,
      metadata: {
        plan: plan || 'legacy',
      },
    };

    // Add customer if we have one
    if (customerId) {
      sessionConfig.customer = customerId;
    }

    // Add Discord user info if provided
    if (discordUserId) {
      sessionConfig.client_reference_id = discordUserId;
      sessionConfig.metadata.discord_user_id = discordUserId;
      sessionConfig.metadata.discord_username = discordUsername || 'Unknown';
    }

    // Pre-fill email if provided and no customer
    if (discordEmail && !customerId) {
      sessionConfig.customer_email = discordEmail;
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
}
