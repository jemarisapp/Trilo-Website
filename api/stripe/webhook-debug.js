/**
 * Debug endpoint to check webhook signature headers
 * POST /api/stripe/webhook-debug
 */

export const config = {
  api: {
    bodyParser: false,
  },
};

async function getRawBody(req) {
  return new Promise((resolve, reject) => {
    const chunks = [];
    req.on('data', (chunk) => chunks.push(chunk));
    req.on('end', () => resolve(Buffer.concat(chunks)));
    req.on('error', reject);
  });
}

export default async function handler(req, res) {
  if (req.method !== 'POST') {
    return res.status(405).json({ error: 'Method not allowed' });
  }

  const rawBody = await getRawBody(req);
  const sig = req.headers['stripe-signature'];
  const hasSecret = !!process.env.STRIPE_WEBHOOK_SECRET;
  const secretPrefix = process.env.STRIPE_WEBHOOK_SECRET?.substring(0, 10) || 'NOT_SET';

  res.json({
    hasSignature: !!sig,
    signaturePrefix: sig?.substring(0, 20) || 'NO_SIGNATURE',
    hasSecret: hasSecret,
    secretPrefix: secretPrefix,
    bodyLength: rawBody.length,
    bodyType: typeof rawBody,
    headers: {
      'content-type': req.headers['content-type'],
      'stripe-signature': sig?.substring(0, 50) || 'NO_SIGNATURE'
    }
  });
}
