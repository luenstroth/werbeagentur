// Nimmt die ersten Sekunden einer Seite als Bildfolge auf (für ein kurzes Vorschauvideo der Animation).
// Aufruf: node film.js <url> <breite> <name>
const http = require('http'), fs = require('fs'), os = require('os'), path = require('path');
const puppeteer = require(path.join(os.tmpdir(), 'shotstool', 'node_modules', 'puppeteer-core'));
const root = path.resolve('_site');
const types = { '.html': 'text/html; charset=utf-8', '.css': 'text/css', '.js': 'text/javascript', '.svg': 'image/svg+xml', '.jpg': 'image/jpeg', '.png': 'image/png', '.webp': 'image/webp', '.woff2': 'font/woff2' };
const srv = http.createServer((q, r) => { let p = path.join(root, decodeURIComponent(q.url.split('?')[0])); if (p.endsWith(path.sep) || !path.extname(p)) p = path.join(p, 'index.html'); fs.readFile(p, (e, d) => { r.writeHead(e ? 404 : 200, { 'Content-Type': types[path.extname(p)] || 'application/octet-stream' }); r.end(e ? 'x' : d); }); });
srv.listen(8099, async () => {
  const [u, w, name] = process.argv.slice(2);
  const out = path.resolve('_archiv/shots/film-' + name); fs.rmSync(out, { recursive: true, force: true }); fs.mkdirSync(out, { recursive: true });
  const b = await puppeteer.launch({ executablePath: 'C:/Program Files/Google/Chrome/Application/chrome.exe', headless: true });
  const pg = await b.newPage(); await pg.setViewport({ width: +w, height: +w < 600 ? 844 : 810 });
  await pg.goto('http://localhost:8099' + u, { waitUntil: 'domcontentloaded' });
  const t0 = Date.now(); let k = 0;
  while (Date.now() - t0 < 3600) { await pg.screenshot({ path: path.join(out, String(k++).padStart(3, '0') + '.jpg'), type: 'jpeg', quality: 80 }); }
  // danach langsam scrollen, um den Ausstieg zu zeigen
  for (let y = 0; y <= 700; y += 25) { await pg.evaluate((y) => window.scrollTo(0, y), y); await new Promise(r => setTimeout(r, 30)); await pg.screenshot({ path: path.join(out, String(k++).padStart(3, '0') + '.jpg'), type: 'jpeg', quality: 80 }); }
  console.log('Bilder:', k, 'in', ((Date.now() - t0) / 1000).toFixed(1), 's');
  await b.close(); srv.close();
});
