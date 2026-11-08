// Prüft im Browser einzelne Elemente: Sichtbarkeit, Größe, Ladezustand, Filter. Aufruf: node probe.js <url> <css-selector>
const http = require('http'), fs = require('fs'), os = require('os'), path = require('path');
const puppeteer = require(path.join(os.tmpdir(), 'shotstool', 'node_modules', 'puppeteer-core'));
const root = path.resolve('_site');
const types = { '.html': 'text/html; charset=utf-8', '.css': 'text/css', '.js': 'text/javascript', '.svg': 'image/svg+xml', '.jpg': 'image/jpeg', '.png': 'image/png', '.webp': 'image/webp', '.woff2': 'font/woff2' };
const srv = http.createServer((q, r) => { let p = path.join(root, decodeURIComponent(q.url.split('?')[0])); if (p.endsWith(path.sep) || !path.extname(p)) p = path.join(p, 'index.html'); fs.readFile(p, (e, d) => { r.writeHead(e ? 404 : 200, { 'Content-Type': types[path.extname(p)] || 'application/octet-stream' }); r.end(e ? 'x' : d); }); });
srv.listen(8099, async () => {
  const [u, sel] = process.argv.slice(2);
  const b = await puppeteer.launch({ executablePath: 'C:/Program Files/Google/Chrome/Application/chrome.exe', headless: true });
  const pg = await b.newPage(); await pg.setViewport({ width: 1440, height: 900 });
  await pg.goto('http://localhost:8099' + u, { waitUntil: 'networkidle0' });
  const el = await pg.$(sel); if (el) { await el.scrollIntoView(); await new Promise(r => setTimeout(r, 1500)); }
  const info = await pg.evaluate((sel) => [...document.querySelectorAll(sel)].slice(0, 4).map(e => { const cs = getComputedStyle(e), r = e.getBoundingClientRect(); return { tag: e.tagName, src: e.currentSrc || '', ok: e.complete, nw: e.naturalWidth, w: Math.round(r.width), h: Math.round(r.height), op: cs.opacity, filter: cs.filter, vis: cs.visibility, parentOp: getComputedStyle(e.closest('.logo-wall') || e).opacity }; }), sel);
  console.log(JSON.stringify(info, null, 1));
  await pg.screenshot({ path: path.resolve('_archiv/shots/probe.png') });
  await b.close(); srv.close();
});
