// Ganzseitige Screenshots von _site über einen lokalen Server, mit dem installierten Chrome (puppeteer-core aus %TEMP%\shotstool).
// Aufruf: node shots.js <breite> <url> [<url> …]   – scrollt die Seite einmal durch, damit Einblendungen ausgelöst sind.
const http = require('http'), fs = require('fs'), os = require('os'), path = require('path');
const puppeteer = require(path.join(os.tmpdir(), 'shotstool', 'node_modules', 'puppeteer-core'));
const root = path.resolve('_site'), out = path.resolve('_archiv/shots');
fs.mkdirSync(out, { recursive: true });
const types = { '.html': 'text/html; charset=utf-8', '.css': 'text/css', '.js': 'text/javascript', '.svg': 'image/svg+xml', '.jpg': 'image/jpeg', '.jpeg': 'image/jpeg', '.png': 'image/png', '.webp': 'image/webp', '.woff2': 'font/woff2', '.mp4': 'video/mp4' };
const srv = http.createServer((q, r) => {
  let p = path.join(root, decodeURIComponent(q.url.split('?')[0]));
  if (p.endsWith(path.sep) || !path.extname(p)) p = path.join(p, 'index.html');
  fs.readFile(p, (e, d) => { r.writeHead(e ? 404 : 200, { 'Content-Type': types[path.extname(p)] || 'application/octet-stream' }); r.end(e ? 'x' : d); });
});
srv.listen(8099, async () => {
  const [w, ...urls] = process.argv.slice(2);
  const width = +w, height = width < 600 ? 844 : 900;
  const browser = await puppeteer.launch({ executablePath: 'C:/Program Files/Google/Chrome/Application/chrome.exe', headless: true, args: ['--hide-scrollbars'] });
  const page = await browser.newPage();
  await page.setViewport({ width, height, deviceScaleFactor: 1, isMobile: width < 600, hasTouch: width < 600 });
  for (const u of urls) {
    const name = (u.replace(/\//g, '_').replace(/^_|_$/g, '') || 'start') + `-${w}.png`;
    try {
      await page.goto('http://localhost:8099' + u, { waitUntil: 'networkidle0', timeout: 60000 });
      await page.evaluate(async () => { for (let y = 0; y < document.body.scrollHeight; y += 400) { window.scrollTo(0, y); await new Promise(r => setTimeout(r, 60)); } window.scrollTo(0, 0); await new Promise(r => setTimeout(r, 400)); });
      await page.addStyleTag({ content: '.reveal{opacity:1!important;transform:none!important;animation:none!important}' });
      await page.screenshot({ path: path.join(out, name), fullPage: true });
      console.log('OK', name);
    } catch (e) { console.log('FEHLER', u, e.message.slice(0, 120)); }
  }
  await browser.close(); srv.close();
});
