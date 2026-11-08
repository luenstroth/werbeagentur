// Typografische Statement-Bühne ohne Foto, Buchstaben einzeln animiert. Erst an Arbeitsweise und Rollout (DE/EN).
// Bricht ohne Schreiben ab, wenn eine Stelle nicht genau einmal passt.
const fs = require('fs');
const W = {};
const get = (f) => W[f] ?? fs.readFileSync(f, 'utf8');
function rep(f, a, b) { const s = get(f), n = s.split(a).length - 1; if (n !== 1) throw new Error(`${f}: ${n}× für "${a.slice(0, 50)}"`); W[f] = s.replace(a, b); }
function repRe(f, re, b) { const s = get(f), m = s.match(new RegExp(re.source, re.flags + 'g')) || []; if (m.length !== 1) throw new Error(`${f}: ${m.length}× für ${re}`); W[f] = s.replace(re, b); }

// 1. Filter: Text -> Wörter -> Buchstaben mit laufendem Index und deterministischen Streuwerten
repRe('.eleventy.js', /(\n[ \t]*)eleventyConfig\.addFilter\("plaintext"/, `$1// Statement in Buchstaben zerlegen (für .stmt-Animationen). Streuwerte sind deterministisch, damit jeder Build gleich aussieht.
  eleventyConfig.addFilter("statementLetters", (text = "") => {
    let i = 0;
    const words = String(text).trim().split(/\\s+/).map((w) => [...w].map((c) => {
      const k = i++;
      return { c, i: k, dy: (((k * 37) % 11) - 5) * 0.14, dx: (((k * 23) % 7) - 3) * 0.05, rot: (((k * 53) % 9) - 4) * 3 };
    }));
    return { words, n: i, mid: (i - 1) / 2 };
  });$1eleventyConfig.addFilter("plaintext"`);

// 2. Include
W['src/_includes/hero-statement.njk'] = `{#- Typografische Bühne ohne Foto: das Statement ist das Bild.
    Aufruf: {% set hero = { text: "Erst verstehen", effect: "focus" | "align", label: "…", sub: "…", labelIsH1: true|false } %}{% include "hero-statement.njk" %}
    focus  Buchstaben stellen sich von der Mitte nach außen scharf (wie ein Objektiv)
    align  Buchstaben kommen aus leicht versetzten Lagen auf eine gemeinsame Grundlinie
    Für Screenreader steht der ganze Satz im aria-label; die einzelnen Buchstaben sind ausgeblendet. -#}
{%- set L = hero.text | statementLetters -%}
<header class="hero hero--statement stmt-wrap">
  <div class="container hero-inner">
    {%- set tag = "p" if hero.labelIsH1 else "h1" -%}
    {%- if hero.labelIsH1 %}<h1 class="label stmt-label">{{ hero.label }}</h1>{% else %}<p class="label stmt-label">{{ hero.label }}</p>{% endif %}
    <{{ tag }} class="stmt stmt--{{ hero.effect }}" aria-label="{{ hero.text }}." style="--n:{{ L.n }};--m:{{ L.mid }};">
      {%- for w in L.words %}<span class="stmt-w" aria-hidden="true">{% for l in w %}<span class="stmt-l" style="--i:{{ l.i }};--dy:{{ l.dy }}em;--dx:{{ l.dx }}em;--rot:{{ l.rot }}deg;">{{ l.c }}</span>{% endfor %}</span>{% if not loop.last %} {% endif %}{% endfor %}<span class="stmt-dot" aria-hidden="true">.</span>
    </{{ tag }}>
    {%- if hero.sub %}
    <p class="type-sub stmt-sub">{{ hero.sub }}</p>
    {%- endif %}
  </div>
</header>
`;

// 3. Seiten umstellen
const pages = [
  ['src/vorgehensweise-der-agentur/index.njk', 'Erst verstehen', 'focus'],
  ['src/en/approach.njk', 'Understand first', 'focus'],
  ['src/leistungen/rollout.njk', 'Überall gleich', 'align'],
  ['src/en/services/brand-rollout.njk', 'Everywhere, consistently', 'align']
];
for (const [f, text, effect] of pages) {
  repRe(f, /\{%- set hero = \{\s*\n\s*img: "[^"]*",\s*\n\s*alt: "[^"]*",\s*\n/, `{%- set hero = {\n  text: "${text}",\n  effect: "${effect}",\n`);
  repRe(f, /\n\s*claim: "[^\n]*",\s*\n/, '\n');
  rep(f, '{% include "hero-foto.njk" %}', '{% include "hero-statement.njk" %}');
}

// 4. CSS
const css = 'src/css/main.css';
W[css] = get(css) + `
/* ── Statement-Bühne (ohne Foto) ──
   Das Statement trägt die Seite. Bewegung nur, wo sie die Aussage spielt:
   focus = "Erst verstehen": Unschärfe löst sich von der Mitte nach außen.
   align = "Überall gleich": versetzte Buchstaben finden auf eine Grundlinie.
   Beim Wegscrollen hebt sich der Satz leicht ab und tritt zurück (scroll-gesteuert, ohne JavaScript). */
.hero--statement { min-height: min(82vh, 860px); display: flex; align-items: flex-end; background: var(--paper); padding-block: calc(var(--nav-h) + 4rem) clamp(3.5rem, 8vh, 6rem); overflow: hidden; }
.hero--statement .hero-inner { width: 100%; }
.stmt-label { margin-bottom: 2rem; color: rgba(var(--ink-rgb), .62); opacity: 0; animation: stmt-fade .9s var(--ease) .1s forwards; }
.stmt { font-family: 'Cormorant Garamond', Georgia, serif; font-weight: 500; font-size: clamp(3.6rem, 12.5vw, 12rem); line-height: .9; letter-spacing: -.02em; color: var(--ink); margin: 0; max-width: 14ch; }
.stmt-w { display: inline-block; white-space: nowrap; }
.stmt-l { display: inline-block; will-change: transform, filter, opacity; }
.stmt-dot { display: inline-block; color: var(--accent); transform: scale(0); animation: stmt-dot .7s cubic-bezier(.34,1.56,.64,1) forwards; animation-delay: calc(var(--n) * 45ms + .55s); }
.stmt-sub { max-width: 46ch; margin-top: 2.25rem; color: rgba(var(--ink-rgb), .82); opacity: 0; animation: stmt-fade 1s var(--ease) forwards; animation-delay: calc(var(--n, 12) * 45ms + .8s); }

/* focus: von der Mitte nach außen scharf, Laufweite zieht sich zusammen */
.stmt--focus .stmt-l { opacity: 0; filter: blur(14px); transform: scale(1.12); animation: stmt-focus 1.25s var(--ease) forwards;
  animation-delay: calc(max(var(--i) - var(--m), var(--m) - var(--i)) * 70ms + .25s); }
@keyframes stmt-focus { 60% { opacity: 1; } to { opacity: 1; filter: blur(0); transform: none; } }

/* align: aus leicht versetzten Lagen auf die Grundlinie, mit minimalem Nachfedern */
.stmt--align .stmt-l { opacity: 0; transform: translate(var(--dx), var(--dy)) rotate(var(--rot)); animation: stmt-align 1.1s cubic-bezier(.22,1.2,.36,1) forwards;
  animation-delay: calc(var(--i) * 38ms + .25s); }
@keyframes stmt-align { 35% { opacity: 1; } to { opacity: 1; transform: none; } }

@keyframes stmt-fade { to { opacity: 1; } }
@keyframes stmt-dot { to { transform: scale(1); } }

/* Wegscrollen: Satz hebt sich ab und tritt zurück */
@supports (animation-timeline: view()) {
  .stmt-wrap .hero-inner { animation: stmt-exit linear both; animation-timeline: view(); animation-range: exit 0% exit 100%; }
  @keyframes stmt-exit { to { transform: translateY(-14vh); opacity: .12; } }
}
@media (max-width: 560px) { .stmt { font-size: clamp(3.2rem, 17vw, 5rem); } }
@media (prefers-reduced-motion: reduce) {
  .stmt-l, .stmt-dot, .stmt-label, .stmt-sub { animation: none !important; opacity: 1 !important; filter: none !important; transform: none !important; }
  .stmt-wrap .hero-inner { animation: none !important; }
}
`;
for (const [f, s] of Object.entries(W)) fs.writeFileSync(f, s, 'utf8');
console.log('OK', Object.keys(W).join(', '));
