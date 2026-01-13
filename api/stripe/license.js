/**
 * Vercel Serverless Function: Get License Key
 * GET /api/stripe/license?session_id=xxx
 */

import Stripe from 'stripe';

const stripe = new Stripe(process.env.STRIPE_SECRET_KEY, {
  apiVersion: '2024-11-20.acacia',
});

export default async function handler(req, res) {
  // Only allow GET
  if (req.method !== 'GET') {
    return res.status(405).json({ error: 'Method not allowed' });
  }

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
}
