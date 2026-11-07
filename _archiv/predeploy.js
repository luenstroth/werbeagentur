// Prüfung vor dem Livegang: externe Quellen, tote interne Links, robots, Datenschutz-Stichworte, Header in .htaccess.
const fs = require('fs'), path = require('path');
const S = '_site', files = [];
(function walk(d) { for (const f of fs.readdirSync(d)) { const p = path.join(d, f); fs.statSync(p).isDirectory() ? walk(p) : f.endsWith('.html') && files.push(p); } })(S);
const ext = {}, dead = new Set();
for (const p of files) {
  const h = fs.readFileSync(p, 'utf8');
  for (const m of h.matchAll(/(?:src|href)="(https?:\/\/[^"]+)"/g)) {
    const host = new URL(m[1]).host; if (/luenstroth/.test(host)) continue;
    const tag = h.slice(Math.max(0, m.index - 40), m.index); const kind = /<(script|link|img|iframe|source|video)/.exec(tag)?.[1] || 'a';
    if (kind !== 'a') ext[host + ' (' + kind + ')'] = (ext[host + ' (' + kind + ')'] || 0) + 1;
  }
  for (const m of h.matchAll(/(?:src|href)="(\/[^"#?]*)/g)) {
    let u = decodeURI(m[1]); let t = path.join(S, u); if (u.endsWith('/')) t = path.join(t, 'index.html');
    if (!fs.existsSync(t)) dead.add(u + '  <- ' + p.replace(S, ''));
  }
}
console.log('Externe Einbindungen (Skripte/Fonts/Bilder/iframes):', Object.keys(ext).length ? ext : 'keine');
console.log('Tote interne Links/Dateien:', dead.size); [...dead].slice(0, 15).forEach(x => console.log('  ' + x));
console.log('--- robots.txt'); console.log(fs.readFileSync(path.join(S, 'robots.txt'), 'utf8'));
const ds = fs.readFileSync(path.join(S, 'datenschutz/index.html'), 'utf8').replace(/<[^>]+>/g, ' ');
for (const w of ['Hosting', 'Server-Log', 'Logfile', 'Cookie', 'Kontaktformular', 'E-Mail', 'Google', 'Analytics', 'Font', 'Video', 'Betroffenenrechte', 'Beschwerde', 'Friedrichstra', 'Verantwortlich', 'SSL', 'TLS', 'all-inkl', 'webgo'])
  console.log('Datenschutz enthält "' + w + '":', new RegExp(w, 'i').test(ds));
const ht = fs.readFileSync(path.join(S, '.htaccess'), 'utf8');
for (const w of ['HTTPS', 'www', 'Strict-Transport-Security', 'X-Content-Type-Options', 'Referrer-Policy', 'Content-Security-Policy', 'mod_deflate', 'Expires', 'Cache-Control'])
  console.log('.htaccess enthält "' + w + '":', ht.includes(w));
const forms = files.filter(p => /<form/i.test(fs.readFileSync(p, 'utf8'))); console.log('Seiten mit Formular:', forms.map(p => p.replace(S, '')));
const noindex = files.filter(p => /name="robots" content="noindex/.test(fs.readFileSync(p, 'utf8'))).map(p => p.replace(S, '')); console.log('noindex:', noindex);
