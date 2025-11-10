import http from 'http';
import fs from 'fs';
import path from 'path';
import url from 'url';
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const PORT = process.env.PREVIEW_PORT ? Number(process.env.PREVIEW_PORT) : 5500;
const PUBLIC_DIR = path.resolve(__dirname, '../public');
const OUTPUT_DIR = path.resolve(__dirname, '../output');

function send(res, status, body, headers = {}) {
  res.writeHead(status, { 'Content-Type': 'text/plain', ...headers });
  res.end(body);
}

function serveStatic(req, res) {
  const parsed = url.parse(req.url);
  let pathname = parsed.pathname || '/';
  if (pathname === '/') pathname = '/index.html';
  const filePath = path.normalize(path.join(PUBLIC_DIR, pathname));
  if (!filePath.startsWith(PUBLIC_DIR)) {
    return send(res, 403, 'Forbidden');
  }
  fs.readFile(filePath, (err, data) => {
    if (err) return send(res, 404, 'Not Found');
    const ext = path.extname(filePath).toLowerCase();
    const type = ext === '.html' ? 'text/html' : ext === '.js' ? 'application/javascript' : ext === '.css' ? 'text/css' : 'application/octet-stream';
    res.writeHead(200, { 'Content-Type': type });
    res.end(data);
  });
}

function serveConfig(res, chartType = 'xychart') {
  const configPath = path.join(OUTPUT_DIR, `generated.${chartType}.json`);
  if (!fs.existsSync(configPath)) {
    return send(res, 404, JSON.stringify({ error: 'No generated config found. Run npm run generate:xy' }), { 'Content-Type': 'application/json' });
  }
  const data = fs.readFileSync(configPath, 'utf8');
  res.writeHead(200, { 'Content-Type': 'application/json' });
  res.end(data);
}

const server = http.createServer((req, res) => {
  const parsed = url.parse(req.url, true);
  if (parsed.pathname === '/config') {
    const chartType = parsed.query.chart || 'xychart';
    return serveConfig(res, chartType);
  }
  return serveStatic(req, res);
});

server.listen(PORT, () => {
  console.log(`Preview server running at http://localhost:${PORT}/`);
});