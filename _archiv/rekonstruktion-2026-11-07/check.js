const fs = require('fs'), path = require('path');
const R = path.join(__dirname, '..'), root = path.join(R, '_site');
const pages = [];
(function walk(d) { for (const e of fs.readdirSync(d, { withFileTypes: true })) {
  const f = path.join(d, e.name); if (e.isDirectory()) walk(f); else if (f.endsWith('.html')) pages.push(f);
} })(root);
const exists = u => { const f = path.join(root, decodeURIComponent(u.split(/[?#]/)[0]));
  return fs.existsSync(f) && (fs.statSync(f).isFile() || fs.existsSync(path.join(f, 'index.html'))); };
const tot = {}; let n = 0;
for (const pg of pages) for (const m of fs.readFileSync(pg, 'utf8').matchAll(/(?:href|src)="(\/[^"]*)"/g)) {
  n++; if (!exists(m[1])) (tot[m[1]] ||= new Set()).add('/' + path.relative(root, pg).replace(/\\/g, '/')); }
console.log(`LINKS: ${pages.length} Seiten, ${n} interne Links, ${Object.keys(tot).length} tote Ziele`);
for (const b in tot) console.log('  ' + b + ' <- ' + [...tot[b]].slice(0, 3).join(', '));
const rules = fs.readFileSync(path.join(R, 'src/.htaccess'), 'utf8').split(/\r?\n/).map(l => l.trim())
  .filter(l => l.startsWith('RewriteRule')).map(l => { const [, p, z, fl = ''] = l.split(/\s+/); return { re: new RegExp(p), z, fl }; })
  .filter(r => !/\^\(\.\*\)\$/.test(r.re.source));
const ziel = u => { const r = rules.find(r => r.re.test(u)); return r && u.replace(r.re, r.z); };
let ok = 0; const prob = [];
for (const z of fs.readFileSync(path.join(R, 'redirect-map.csv'), 'utf8').split(/\r?\n/).slice(1).filter(Boolean)) {
  const [alt, akt, neu] = z.split(';'); const p = alt.replace(/^\//, ''); const r = rules.find(r => r.re.test(p));
  if (akt === 'bleibt') { exists(alt) ? ok++ : prob.push('bleibt, fehlt: ' + alt); continue; }
  if (!r) { prob.push('keine Regel: ' + alt); continue; }
  if (akt === '410') { /G/.test(r.fl) ? ok++ : prob.push('kein 410: ' + alt); continue; }
  const t = p.replace(r.re, r.z);
  if (t !== neu) prob.push(`abweichend: ${alt} -> ${t} (CSV ${neu})`);
  else if (!/^https?:/.test(t) && !exists(t)) prob.push('Ziel fehlt: ' + t); else ok++;
}
for (const u of ['positionierung/', 'positionierung/vom-ende-her-denken/', 'positionierung/glaubwuerdigkeit/', 'positionierung/konzept-vor-ausfuehrung/', 'positionierung/platzierung-im-markt/',
  'en/positioning/', 'en/positioning/credibility/', 'en/positioning/placement-in-the-market/',
  'leistungen/webdesign/', 'leistungen/video/', 'leistungen/markenentwicklung-naming/']) {
  const t = ziel(u); if (!t || (!/^https?:/.test(t) && !exists(t))) prob.push('ohne Ziel: /' + u); else { ok++; console.log('  /' + u + ' -> ' + t); }
}
console.log(`REDIRECTS: ${ok} ok, ${prob.length} Probleme`); prob.forEach(p => console.log('  ' + p));
