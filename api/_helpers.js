/**
 * Shared helper functions for Vercel API routes
 */

// Generate License Key
export function generateLicenseKey() {
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

// Send Discord DM
export async function sendDiscordDM(userId, message) {
  const token = process.env.DISCORD_TOKEN;
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
            color: 0xFF8C42, // Trilo orange
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
