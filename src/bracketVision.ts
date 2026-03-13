import { SeedAssignments } from './components/bracket.types';
import { TEAM_NAMES } from './components/teams';

/**
 * Sends a bracket image to GPT-4o-mini vision API and returns parsed seed assignments.
 * Requires a valid OpenAI API key (set VITE_OPENAI_API_KEY in .env).
 */
export async function parseBracketImage(
  file: File,
  apiKey: string
): Promise<SeedAssignments> {
  const base64 = await fileToBase64(file);
  const mimeType = file.type || 'image/jpeg';

  const prompt = `You are analyzing a College Football Playoff (CFP) bracket image. Your job is to identify which team is assigned to each seed number (1 through 12).

The CFP 12-team bracket structure:
- Seeds 1, 2, 3, 4 receive first-round byes
- Seeds 5-12 play in the first round
- First round matchups: Seed 12 vs 5, Seed 9 vs 8, Seed 11 vs 6, Seed 10 vs 7

Look carefully at the bracket image and identify the team name next to each seed number. Match each team name you find to the closest name from this official list:
${TEAM_NAMES.join(', ')}

Return ONLY a valid JSON object mapping seed number (as a string "1" through "12") to the exact matching team name from the list above. If you cannot identify a team for a seed, omit that key.

Example response format:
{
  "1": "Oregon",
  "2": "Georgia",
  "3": "Boise State",
  "4": "Arizona State",
  "5": "Clemson",
  "6": "Notre Dame",
  "7": "Penn State",
  "8": "Indiana",
  "9": "SMU",
  "10": "Alabama",
  "11": "Texas",
  "12": "Ohio State"
}

Return only the JSON object. No explanation, no markdown, no code block.`;

  const response = await fetch('https://api.openai.com/v1/chat/completions', {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
      Authorization: `Bearer ${apiKey}`,
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
                url: `data:${mimeType};base64,${base64}`,
                detail: 'high',
              },
            },
            {
              type: 'text',
              text: prompt,
            },
          ],
        },
      ],
      max_tokens: 600,
      temperature: 0,
    }),
  });

  if (!response.ok) {
    let message = `OpenAI API error (${response.status})`;
    try {
      const err = await response.json();
      if (err?.error?.message) message = err.error.message;
    } catch {
      // ignore parse error
    }
    throw new Error(message);
  }

  const data = await response.json();
  const content: string = data.choices?.[0]?.message?.content ?? '';

  // Strip markdown code fences if present
  const jsonMatch = content.match(/\{[\s\S]*\}/);
  if (!jsonMatch) {
    throw new Error('Could not find JSON in API response. Try a clearer image.');
  }

  let raw: Record<string, unknown>;
  try {
    raw = JSON.parse(jsonMatch[0]);
  } catch {
    throw new Error('API returned malformed JSON. Try a clearer image.');
  }

  const seeds: SeedAssignments = {};
  for (let i = 1; i <= 12; i++) {
    const val = raw[String(i)];
    if (val && typeof val === 'string' && val.trim()) {
      seeds[i] = val.trim();
    }
  }

  if (Object.keys(seeds).length === 0) {
    throw new Error('No seeds could be detected. Make sure the image clearly shows the bracket with team names and seed numbers.');
  }

  return seeds;
}

function fileToBase64(file: File): Promise<string> {
  return new Promise((resolve, reject) => {
    const reader = new FileReader();
    reader.onload = () => {
      const result = reader.result as string;
      // Strip the data URL prefix (e.g. "data:image/jpeg;base64,")
      resolve(result.split(',')[1]);
    };
    reader.onerror = () => reject(new Error('Failed to read image file.'));
    reader.readAsDataURL(file);
  });
}
