import { NextApiRequest, NextApiResponse } from 'next';
import Stripe from 'stripe';

// Initialize Stripe with secret key
const stripe = new Stripe(process.env.STRIPE_SECRET_KEY!, {
  apiVersion: '2024-12-18.acacia',
});

/**
 * API endpoint to retrieve license key from checkout session
 * Called by success page after payment completion
 */
export default async function handler(req: NextApiRequest, res: NextApiResponse) {
  // Only allow GET requests
  if (req.method !== 'GET') {
    return res.status(405).json({ error: 'Method not allowed' });
  }

  const { session_id } = req.query;

  // Validate session ID
  if (!session_id || typeof session_id !== 'string') {
    return res.status(400).json({ error: 'Missing session_id parameter' });
  }

  try {
    // Retrieve checkout session from Stripe
    const session = await stripe.checkout.sessions.retrieve(session_id);

    // Check if payment was successful
    if (session.payment_status !== 'paid') {
      return res.status(400).json({
        error: 'Payment not completed',
        payment_status: session.payment_status
      });
    }

    // Get customer ID to look up license key
    const customerId = session.customer as string;

    if (!customerId) {
      return res.status(400).json({ error: 'Customer ID not found in session' });
    }

    // Note: License key is stored in the database by the webhook handler
    // For now, we'll return the customer ID and instruct the user to check Discord
    // In a future enhancement, we could query the database directly from here

    return res.status(200).json({
      success: true,
      customerId,
      message: 'License key has been generated. Check your email or Discord for details.'
    });
  } catch (error: any) {
    console.error('License retrieval error:', error);
    return res.status(500).json({
      error: 'Failed to retrieve license information',
      message: error.message || 'Unknown error',
    });
  }
}
