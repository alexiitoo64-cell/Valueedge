export default async function handler(req, res) {
  res.setHeader('Access-Control-Allow-Origin', '*');
  res.setHeader('Access-Control-Allow-Methods', 'GET');

  const { sport, apiKey } = req.query;
  if (!sport || !apiKey) {
    return res.status(400).json({ error: 'Missing params' });
  }

  const url = `https://api.the-odds-api.com/v4/sports/${sport}/odds/?apiKey=${apiKey}&regions=eu&markets=h2h,totals,spreads&oddsFormat=decimal&bookmakers=bet365`;

  try {
    const response = await fetch(url);
    const remaining = response.headers.get('x-requests-remaining');
    const data = await response.json();

    if (!response.ok) {
      return res.status(response.status).json({ error: data.message || 'API error' });
    }

    res.setHeader('x-requests-remaining', remaining || '?');
    return res.status(200).json(data);
  } catch (e) {
    return res.status(500).json({ error: e.message });
  }
}
