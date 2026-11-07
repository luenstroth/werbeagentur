// Zählt Anrede in der zweiten Person (Sie/Ihr…, you/your…) im sichtbaren Text jeder Seite.
const fs = require('fs'), path = require('path');
const S = '_site', out = [];
(function walk(d) { for (const f of fs.readdirSync(d)) { const p = path.join(d, f); fs.statSync(p).isDirectory() ? walk(p) : f.endsWith('.html') && out.push(p); } })(S);
const de = /\b(Sie|Ihnen|Ihr|Ihre|Ihren|Ihrem|Ihrer|Ihres)\b/g, en = /\b(you|your|yours|You|Your)\b/g;
const rows = [];
for (const p of out) {
  let h = fs.readFileSync(p, 'utf8').replace(/<(script|style|svg|head)[\s\S]*?<\/\1>/gi, '').replace(/<[^>]+>/g, ' ').replace(/&[a-z#0-9]+;/g, ' ').replace(/\s+/g, ' ');
  const isEn = p.includes(path.sep + 'en' + path.sep) || p.endsWith(path.join('en', 'index.html'));
  const re = isEn ? en : de; const hits = [];
  for (const m of h.matchAll(re)) {
    if (!isEn && m.index > 0 && /[.!?:]\s$/.test(h.slice(m.index - 2, m.index)) === false && m[1] === 'Sie' && /\b(wie|ob|dass|weil)\s$/.test(h.slice(m.index - 6, m.index)) === false) { /* zählen */ }
    hits.push(h.slice(Math.max(0, m.index - 50), m.index + 60).trim());
  }
  if (hits.length) rows.push([hits.length, p.replace(S, ''), hits.slice(0, 3)]);
}
rows.sort((a, b) => b[0] - a[0]);
for (const [n, p, h] of rows) { console.log(String(n).padStart(3), p); h.forEach(x => console.log('      … ' + x)); }
console.log('Summe:', rows.reduce((a, r) => a + r[0], 0), 'Stellen auf', rows.length, 'Seiten');
