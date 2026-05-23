const fetch = require('node-fetch');

const allowedOrigin = process.env.FRONTEND_URL || '*';

function setCors(res) {
  res.setHeader('Access-Control-Allow-Origin', allowedOrigin);
  res.setHeader('Access-Control-Allow-Methods', 'GET, OPTIONS');
  res.setHeader('Access-Control-Allow-Headers', 'Content-Type, Authorization');
}

module.exports = async function handler(req, res) {
  setCors(res);

  if (req.method === 'OPTIONS') return res.status(200).end();
  if (req.method !== 'GET') return res.status(405).json({ error: 'Method not allowed' });

  const { url } = req.query;
  if (!url) return res.status(400).json({ error: 'Missing url parameter' });

  try {
    console.log('[download] Fetching URL:', url);
    const response = await fetch(url);
    if (!response.ok) throw new Error(`Failed to fetch image: ${response.status}`);

    const contentType = response.headers.get('content-type') || 'image/jpeg';
    const buffer = await response.buffer();

    console.log('[download] success, contentType:', contentType);
    res.setHeader('Content-Type', contentType);
    res.setHeader('Content-Disposition', 'attachment; filename="ai-image.jpg"');
    return res.status(200).send(buffer);
  } catch (err) {
    console.error('[download] error=', err.message);
    return res.status(500).json({ error: err.message });
  }
};
