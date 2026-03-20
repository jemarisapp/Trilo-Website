/**
 * Vercel Serverless Function: OpenAI Vision Proxy
 * POST /api/openai
 *
 * Accepts a base64-encoded image and a prompt, forwards the request to
 * OpenAI's chat completions API using the server-side OPENAI_API_KEY, and
 * returns the model's text response. The API key is never exposed to the
 * browser.
 */

export default async function handler(req, res) {
  if (req.method !== 'POST') {
    return res.status(405).json({ error: 'Method not allowed' });
  }

  const { imageBase64, mimeType, prompt } = req.body ?? {};

  if (!imageBase64 || !mimeType || !prompt) {
    return res.status(400).json({ error: 'Missing required fields: imageBase64, mimeType, prompt' });
  }

  if (!process.env.OPENAI_API_KEY) {
    return res.status(500).json({ error: 'OpenAI not configured on server' });
  }

  let openAiResponse;
  try {
    openAiResponse = await fetch('https://api.openai.com/v1/chat/completions', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        Authorization: `Bearer ${process.env.OPENAI_API_KEY}`,
      },
      body: JSON.stringify({
        model: 'gpt-4o-mini',
        messages: [
          {
            role: 'user',
            content: [
              {
                type: 'image_url',
                image_url: {
                  url: `data:${mimeType};base64,${imageBase64}`,
                  detail: 'high',
                },
              },
              { type: 'text', text: prompt },
            ],
          },
        ],
        max_tokens: 600,
        temperature: 0,
      }),
    });
  } catch {
    return res.status(502).json({ error: 'Failed to reach OpenAI' });
  }

  if (!openAiResponse.ok) {
    return res.status(502).json({ error: `OpenAI API error (${openAiResponse.status})` });
  }

  const data = await openAiResponse.json();
  const content = data.choices?.[0]?.message?.content ?? '';

  return res.status(200).json({ content });
}
