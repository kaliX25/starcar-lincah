// Server API lokal: memuat handler gaya Vercel di /api sehingga perilakunya sama dengan produksi.
const http = require('http');
const fs = require('fs');
const path = require('path');

const dir = path.join(__dirname, '..', 'api');
const routes = {};
for (const f of fs.readdirSync(dir)) {
  if (f.endsWith('.js') && !f.startsWith('_')) routes['/api/' + f.slice(0, -3)] = require(path.join(dir, f));
}
const PORT = process.env.API_PORT || 3001;

http.createServer((req, res) => {
  const url = new URL(req.url, 'http://localhost');
  res.setHeader('Access-Control-Allow-Origin', '*');
  res.setHeader('Access-Control-Allow-Headers', 'content-type');
  res.setHeader('Access-Control-Allow-Methods', 'GET,POST,OPTIONS');
  if (req.method === 'OPTIONS') { res.statusCode = 204; return res.end(); }
  const handler = routes[url.pathname];
  if (!handler) { res.statusCode = 404; return res.end('not found'); }
  let raw = '';
  req.on('data', (c) => { raw += c; if (raw.length > 1e5) req.destroy(); });
  req.on('end', async () => {
    try { req.body = raw ? JSON.parse(raw) : {}; } catch { req.body = {}; }
    req.query = Object.fromEntries(url.searchParams);
    res.status = (c) => { res.statusCode = c; return res; };
    res.json = (o) => { res.setHeader('content-type', 'application/json'); res.end(JSON.stringify(o)); };
    try { await handler(req, res); } catch (e) { res.statusCode = 500; res.end(JSON.stringify({ error: String(e.message) })); }
  });
}).listen(PORT, () => console.log(`API lokal di http://localhost:${PORT} (Claude: ${process.env.ANTHROPIC_API_KEY ? 'aktif' : 'mode offline, set ANTHROPIC_API_KEY'})`));
