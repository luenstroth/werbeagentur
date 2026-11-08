// Statement-Bühnen auf die übrigen Foto-Hero-Seiten übertragen, je Seite eine eigene Bewegung.
const fs = require('fs');
const W = {};
const get = (f) => W[f] ?? fs.readFileSync(f, 'utf8');
function rep(f, a, b) { const s = get(f), n = s.split(a).length - 1; if (n !== 1) throw new Error(`${f}: ${n}× für "${a.slice(0, 50)}"`); W[f] = s.replace(a, b); }
function repRe(f, re, b) { const s = get(f), m = s.match(new RegExp(re.source, re.flags + 'g')) || []; if (m.length !== 1) throw new Error(`${f}: ${m.length}× für ${re}`); W[f] = s.replace(re, b); }
const pages = [
  ['src/kontakt/index.njk', 'Reden wir', 'speak'], ['src/en/contact.njk', "Let's talk", 'speak'],
  ['src/werbeagentur-fuer-den-mittelstand/index.njk', 'Mittelstand verstanden', 'settle'], ['src/en/mid-sized-companies.njk', 'Mid-sized, understood', 'settle'],
  ['src/leistungen/listungsgespraech-handel.njk', 'Gelistet', 'shelve'], ['src/en/services/retail-listing.njk', 'Listed', 'shelve'],
  ['src/leistungen/website-b2b.njk', 'Neu erzählt', 'write'], ['src/en/services/b2b-website.njk', 'Retold', 'write'],
  ['src/leistungen/produkteinfuehrung.njk', 'Marktreif', 'rise'], ['src/en/services/product-launch.njk', 'Market-ready', 'rise'],
  ['src/leistungen/auslandsmaerkte.njk', 'Grenzenlos verständlich', 'cross'], ['src/en/services/international-markets.njk', 'Understood everywhere', 'cross']
];
for (const [f, text, effect] of pages) {
  repRe(f, /\{%- set hero = \{\s*\n\s*img: "[^"]*",\s*\n\s*alt: "[^"]*",\s*\n/, `{%- set hero = {\n  text: "${text.replace(/"/g, '\\"')}",\n  effect: "${effect}",\n`);
  repRe(f, /\n\s*claim: "[^\n]*",\s*\n/, '\n');
  rep(f, '{% include "hero-foto.njk" %}', '{% include "hero-statement.njk" %}');
}
const css = 'src/css/main.css';
W[css] = get(css).replace(/\n@keyframes stmt-fade \{ to \{ opacity: 1; \} \}/, `
/* speak  "Reden wir": Buchstaben setzen im Sprechtakt ein, Wort für Wort mit kurzer Pause */
.stmt--speak .stmt-l { opacity: 0; transform: translateY(.12em); animation: stmt-speak .55s var(--ease) forwards; animation-delay: calc(var(--i) * 55ms + .3s); }
.stmt--speak .stmt-w + .stmt-w .stmt-l { animation-delay: calc(var(--i) * 55ms + .62s); }
@keyframes stmt-speak { to { opacity: 1; transform: none; } }

/* settle  "Mittelstand verstanden": Buchstaben setzen mit Gewicht auf und stehen fest */
.stmt--settle .stmt-l { opacity: 0; transform: translateY(-.35em); animation: stmt-settle .9s cubic-bezier(.3,1.35,.45,1) forwards; animation-delay: calc(var(--i) * 32ms + .25s); }
@keyframes stmt-settle { 30% { opacity: 1; } to { opacity: 1; transform: none; } }

/* shelve  "Gelistet": Buchstaben rücken von rechts nacheinander in die Reihe, wie Ware ins Regal */
.stmt--shelve .stmt-l { opacity: 0; transform: translateX(1.4em); animation: stmt-shelve .8s cubic-bezier(.2,.9,.25,1) forwards; animation-delay: calc(var(--i) * 70ms + .25s); }
@keyframes stmt-shelve { 25% { opacity: 1; } to { opacity: 1; transform: none; } }

/* write  "Neu erzählt": jede Letter wird von links nach rechts freigelegt, wie eine Zeile, die geschrieben wird */
.stmt--write .stmt-l { clip-path: inset(-.2em 100% -.3em 0); animation: stmt-write .45s cubic-bezier(.6,0,.3,1) forwards; animation-delay: calc(var(--i) * 75ms + .3s); }
@keyframes stmt-write { to { clip-path: inset(-.2em -.1em -.3em 0); } }

/* rise  "Marktreif": Buchstaben wachsen aus der Grundlinie heraus */
.stmt--rise .stmt-l { clip-path: inset(100% -.1em -.3em -.1em); transform: translateY(.45em); animation: stmt-rise 1s var(--ease) forwards; animation-delay: calc(var(--i) * 45ms + .25s); }
@keyframes stmt-rise { to { clip-path: inset(-.3em -.1em -.3em -.1em); transform: none; } }

/* cross  "Grenzenlos verständlich": der Satz kommt von jenseits des Rands und schließt die Laufweite */
.stmt--cross .stmt-l { opacity: 0; transform: translateX(calc(40vw + var(--i) * .18em)); animation: stmt-cross 1.4s cubic-bezier(.16,1,.3,1) forwards; animation-delay: calc(var(--i) * 18ms + .2s); }
@keyframes stmt-cross { 20% { opacity: 1; } to { opacity: 1; transform: none; } }

@keyframes stmt-fade { to { opacity: 1; } }`);
if (!/stmt--cross/.test(W[css])) throw new Error('CSS nicht eingefügt');
for (const [f, s] of Object.entries(W)) fs.writeFileSync(f, s, 'utf8');
console.log('OK', Object.keys(W).length, 'Dateien');
