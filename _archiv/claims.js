// Neue Hero-Statements (max. drei Wörter), DE/EN. Fallstudien: Statement groß, bisherige H1 bleibt als kleinere Zeile (SEO).
// Bricht ohne Schreiben ab, wenn eine Stelle nicht genau einmal passt.
const fs = require('fs');
const W = {};
const get = (f) => W[f] ?? fs.readFileSync(f, 'utf8');
function one(f, re, by) {
  const s = get(f), m = s.match(new RegExp(re.source, re.flags.replace('g', '') + 'g')) || [];
  if (m.length !== 1) throw new Error(`${f}: ${m.length}× für ${re}`);
  W[f] = s.replace(re, by);
}
const dot = '<span class=\\"type-dot\\">.</span>';
const claim = (f, text) => one(f, /^(\s*claim: )".*",?\s*$/m, (m0, p) => `${p}"${text}${dot}",`);
const words = (f, oldArr, arr) => one(f, new RegExp(oldArr.replace(/[.*+?^${}()|[\]\\]/g, '\\$&')), JSON.stringify(arr).replace(/","/g, '", "'));

// Seiten mit Foto-Hero (claim-Feld)
const C = {
  'src/kontakt/index.njk': 'Reden wir', 'src/en/contact.njk': "Let's talk",
  'src/vorgehensweise-der-agentur/index.njk': 'Erst verstehen', 'src/en/approach.njk': 'Understand first',
  'src/werbeagentur-fuer-den-mittelstand/index.njk': 'Mittelstand verstanden', 'src/en/mid-sized-companies.njk': 'Mid-sized, understood',
  'src/leistungen/listungsgespraech-handel.njk': 'Gelistet', 'src/en/services/retail-listing.njk': 'Listed',
  'src/leistungen/website-b2b.njk': 'Neu erzählt', 'src/en/services/b2b-website.njk': 'Retold',
  'src/leistungen/produkteinfuehrung.njk': 'Marktreif', 'src/en/services/product-launch.njk': 'Market-ready',
  'src/leistungen/messeauftritt.njk': 'Standfest', 'src/en/services/trade-fair.njk': 'Stand out',
  'src/leistungen/auslandsmaerkte.njk': 'Grenzenlos verständlich', 'src/en/services/international-markets.njk': 'Understood everywhere',
  'src/leistungen/rollout.njk': 'Überall gleich', 'src/en/services/brand-rollout.njk': 'Everywhere, consistently'
};
for (const [f, t] of Object.entries(C)) claim(f, t);

// Seiten mit Wort-Hero
words('src/agentur/index.njk', '["Der", "Großteil", "der", "Arbeit", "hat", "nichts", "mit", "Gestaltung", "zu", "tun"]', ['Denken', 'vor', 'Gestalten']);
words('src/en/agency.njk', '["Most", "of", "the", "work", "has", "nothing", "to", "do", "with", "design"]', ['Thinking', 'first']);
words('src/case-studies/index.njk', '["Niemand", "ruft", "wegen", "eines", "Logos", "an"]', ['Dreizehn', 'Antworten']);
words('src/en/case-studies/index.njk', '["Nobody", "calls", "about", "a", "logo"]', ['Thirteen', 'answers']);

// 404
one('src/404.njk', /Diese Seite gibt es nicht(<span class="type-dot">)/, 'Nicht gefunden$1');
one('src/en/404.njk', /This page does not exist(<span class="type-dot">)/, 'Not found$1');

// Fallstudien: Statement groß, H1 als kleinere Zeile darunter
const CS = {
  'albatros': ['Funktion zuerst', 'Function first'], 'arminia-bielefeld': ['Gefühl mit Form', 'Feeling, shaped'],
  'cobiax': ['Größer gedacht', 'Thinking wider'], 'eva-mann': ['Unvergesslich', 'Unforgettable'],
  'gneuss': ['Endlich sichtbar', 'Finally visible'], 'hella': ['Eine Marke', 'One brand'],
  'kuehlmann': ['Ohne Discount-Look', 'No discount look'], 'meco': ['Neu vermessen', 'Redefined'],
  'meisterhaft-zdb': ['Geschützt', 'Protected'], 'piasten': ['Selbsterklärend', 'Self-explanatory'],
  'stadtwerke-bielefeld': ['Klare Wahl', 'Clear choice'], 'volksbank-phd': ['Vertrauen bleibt', 'Trust remains'],
  'werner-works': ['Freie Bahn', 'Clear road ahead']
};
for (const [slug, [de, en]] of Object.entries(CS)) {
  for (const [f, t] of [[`src/case-studies/${slug}.njk`, de], [`src/en/case-studies/${slug}.njk`, en]]) {
    one(f, /<h1 class="display-lg reveal reveal-delay-1" style="[^"]*">([^<]*)<\/h1>/,
      (m0, h) => `<p class="case-claim reveal reveal-delay-1">${t}<span class="type-dot">.</span></p>\n    <h1 class="case-h1 reveal reveal-delay-1">${h}</h1>`);
  }
}
const css = 'src/css/main.css';
W[css] = get(css) + `
/* ── Fallstudien-Hero: kurzes Statement groß, die beschreibende H1 (Suchbegriffe) darunter kleiner ── */
.case-claim { font-family: 'Cormorant Garamond', Georgia, serif; font-weight: 500; font-size: clamp(3rem, 7vw, 6.5rem); line-height: .95; letter-spacing: -.01em; color: #fff; margin: 0 0 1.25rem; }
.case-claim .type-dot { color: #7FB8C2; }
.case-h1 { font-family: inherit; font-size: clamp(1.05rem, 1.6vw, 1.35rem); font-weight: 500; line-height: 1.4; color: rgba(255,255,255,.88); max-width: 46ch; margin: 0; }
`;
for (const [f, s] of Object.entries(W)) fs.writeFileSync(f, s, 'utf8');
console.log('OK', Object.keys(W).length, 'Dateien');
