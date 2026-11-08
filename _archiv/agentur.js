// Agentur-Seite (DE/EN) auf Statement-Bühne umstellen; Bewegung "sketch": erst Umriss wie eine Vorzeichnung, dann gefüllt.
const fs = require('fs');
const W = {};
const get = (f) => W[f] ?? fs.readFileSync(f, 'utf8');
function repRe(f, re, b) { const s = get(f), m = s.match(new RegExp(re.source, re.flags + 'g')) || []; if (m.length !== 1) throw new Error(`${f}: ${m.length}× für ${re}`); W[f] = s.replace(re, b); }
const P = [
  ['src/agentur/index.njk', 'Denken vor Gestalten', 'Werbeagentur Lünstroth: Marke, Design und Kommunikation seit 1994', 'Agentur der Lünstroth GmbH'],
  ['src/en/agency.njk', 'Thinking first', 'Lünstroth advertising agency: brand, design and communication since 1994', 'Lünstroth GmbH agency']
];
for (const [f, text, h1] of P) {
  repRe(f, /\{% from "hero-type\.njk" import heroType %\}\s*\n\{\{ heroType\(\s*\n\s*"[^"]*",\s*\n\s*\[[^\]]*\],\s*\n\s*("[^"]*")\s*\n\) \}\}/,
    (m0, sub) => `{%- set hero = {\n  text: "${text}",\n  effect: "sketch",\n  label: "${h1}",\n  sub: ${sub},\n  labelIsH1: true\n} %}\n{% include "hero-statement.njk" %}`);
}
const css = 'src/css/main.css';
W[css] = get(css).replace(/\n@keyframes stmt-fade \{ to \{ opacity: 1; \} \}/, `
/* sketch  "Denken vor Gestalten": jede Letter erscheint zuerst als feine Umrisslinie (Vorzeichnung) und füllt sich danach */
.stmt--sketch .stmt-l { color: transparent; -webkit-text-stroke: 1px rgba(var(--ink-rgb), .9); opacity: 0;
  animation: stmt-sketch-in .5s var(--ease) forwards, stmt-sketch-fill .9s var(--ease) forwards;
  animation-delay: calc(var(--i) * 55ms + .2s), calc(var(--n) * 55ms + .55s + var(--i) * 25ms); }
@keyframes stmt-sketch-in { to { opacity: 1; } }
@keyframes stmt-sketch-fill { to { color: var(--ink); -webkit-text-stroke-color: transparent; } }

@keyframes stmt-fade { to { opacity: 1; } }`);
if (!/stmt--sketch/.test(W[css])) throw new Error('CSS nicht eingefügt');
for (const [f, s] of Object.entries(W)) fs.writeFileSync(f, s, 'utf8');
console.log('OK');
