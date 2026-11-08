// Startseite nach Richtung A: farbige Bühne (Albatros), neuer Abschnitt "Antworten auf den Wandel" mit Fall-Raster.
// Bestehende Texte bleiben vollständig erhalten. Bricht ohne Schreiben ab, wenn eine Stelle nicht genau einmal passt.
const fs = require('fs');
const W = {};
function rep(f, a, b) {
  const s = W[f] ?? fs.readFileSync(f, 'utf8');
  const n = s.split(a).length - 1;
  if (n !== 1) throw new Error(`${f}: ${n}× für "${a.slice(0, 60)}"`);
  W[f] = s.replace(a, b);
}
const tile = (lang, href, img, alt, name, line, span) => `    <a href="${href}" class="wandel-tile wandel-tile--${span} reveal">
      <div class="wandel-img">{% respImage "${img}", "${alt}", "(min-width: 860px) ${span === 7 ? 58 : span === 5 ? 42 : 33}vw, 100vw" %}</div>
      <div class="wandel-cap"><span class="wandel-name">${name}</span><span class="wandel-line">${line}</span></div>
    </a>`;
const section = (lang) => {
  const de = lang === 'de', p = de ? '' : '/en';
  return `
<!-- ANTWORTEN AUF DEN WANDEL -->
<section class="container wandel" aria-labelledby="wandel-h">
  <div class="wandel-head">
    <h2 id="wandel-h" class="display-lg reveal">${de ? 'Antworten auf den Wandel.' : 'Answers to change.'}</h2>
    <p class="body-lg reveal reveal-delay-1">${de ? 'Übernahme, Generationswechsel, Export, neuer Wettbewerb: dreizehn Mandate, in denen sich ein Markt verändert hat – und jeweils die Antwort darauf.' : 'Acquisition, generational change, export, new competition: thirteen mandates in which a market changed – and the answer each time.'}</p>
  </div>
  <div class="wandel-grid">
${tile(lang, p + '/case-studies/arminia-bielefeld/', 'img/branding-arminia-bielefeld.jpg', de ? 'Vereinsfahne von DSC Arminia Bielefeld' : 'Club flag of DSC Arminia Bielefeld', 'DSC Arminia Bielefeld', de ? 'Ein Gefühl, das sich einem Sponsor vorlegen lässt' : 'A feeling that can be put in front of a sponsor', 7)}
${tile(lang, p + '/case-studies/piasten/', 'img/hero-piasten.jpg', de ? 'Flüssige Schokoladenmasse in der Produktion' : 'Liquid chocolate mass in production', 'Piasten', de ? 'Marken, die ohne Werbung im Regal bestehen' : 'Brands that hold their own on the shelf without advertising', 5)}
${tile(lang, p + '/case-studies/gneuss/', 'img/gneuss-hero.jpg', de ? 'Extrusionstechnik von Gneuss' : 'Gneuss extrusion technology', 'Gneuss', de ? 'Generationswechsel beim Weltmarktführer' : 'Generational change at a world market leader', 4)}
${tile(lang, p + '/case-studies/hella/', 'img/hella-hero.jpg', de ? 'Fahrzeug auf einer Straße aus der Vogelperspektive' : 'Vehicle on a road seen from above', 'Hella', de ? 'Eine Marke für Werkstatt, Handel und Endkunde' : 'One brand for workshop, trade and end customer', 4)}
${tile(lang, p + '/case-studies/kuehlmann/', 'img/hero-kuehlmann.jpg', de ? 'Angerichteter Feinkostsalat' : 'Plated delicatessen salad', 'Kühlmann · Delikato', de ? 'Eine Handelsmarke, die nicht nach Handelsmarke aussieht' : 'A retailer brand that does not look like one', 4)}
  </div>
</section>
`;
};
// Deutsch
rep('src/index.njk', '{% respImage "img/hero-endkontrolle.jpg", "Hände prüfen ein gebogenes Metallteil auf dem Prüftisch und markieren es mit einem Stift.", "100vw", {eager: true} %}',
  '{% respImage "img/albatros-hero.jpg", "Sicherheitsschuhe der Marke Albatros im spritzenden Wasser", "100vw", {eager: true} %}');
rep('src/index.njk', '</header>\n\n<!-- 01', '</header>\n' + section('de') + '\n<!-- 01');
// Englisch
rep('src/en/index.njk', '{% respImage "img/hero-endkontrolle.jpg", "Hands inspecting a bent metal part on the inspection table and marking it with a pen.", "100vw", {eager: true} %}',
  '{% respImage "img/albatros-hero.jpg", "Albatros safety shoes in splashing water", "100vw", {eager: true} %}');
const en = W['src/en/index.njk'];
const m = en.match(/<\/header>\s*\n\s*\n?<!-- 01/);
if (!m) throw new Error('EN: Übergang Header/01 nicht gefunden');
W['src/en/index.njk'] = en.replace(m[0], '</header>\n' + section('en') + '\n<!-- 01');
// CSS
const css = 'src/css/main.css';
rep(css, '.hero--foto .btn-fill:hover { background: #fff; border-color: #fff; color: var(--ink); }', '.hero--foto .btn-fill:hover { background: #fff; border-color: #fff; color: var(--shade); }');
W[css] += `
/* ── Startseite: Antworten auf den Wandel ──
   Bilder aus der Welt der Kunden; die Bildunterschrift trägt die Einsicht.
   Bewegung mit Zweck: Das Bild öffnet sich beim Hineinscrollen wie ein Vorhang
   (der Fall "öffnet sich"), beim Zeigen tritt die Einsicht hervor. */
.wandel { padding-block: clamp(5rem, 9vw, 8rem) 1rem; }
.wandel-head { display: grid; grid-template-columns: repeat(12, minmax(0, 1fr)); gap: 1.5rem; align-items: end; margin-bottom: clamp(2rem, 4vw, 3.5rem); }
.wandel-head h2 { grid-column: span 6; margin: 0; }
.wandel-head p { grid-column: 8 / span 5; margin: 0; color: rgba(var(--ink-rgb), .78); }
.wandel-grid { display: grid; grid-template-columns: repeat(12, minmax(0, 1fr)); gap: clamp(1rem, 2vw, 1.5rem); }
.wandel-tile { display: block; color: var(--ink); text-decoration: none; }
.wandel-tile--7 { grid-column: span 7; } .wandel-tile--5 { grid-column: span 5; } .wandel-tile--4 { grid-column: span 4; }
.wandel-img { position: relative; overflow: hidden; background: var(--paper-2); }
.wandel-tile--7 .wandel-img, .wandel-tile--5 .wandel-img { aspect-ratio: 4 / 3; }
.wandel-tile--4 .wandel-img { aspect-ratio: 5 / 4; }
.wandel-img img { width: 100%; height: 100%; object-fit: cover; display: block; transition: transform 1.2s var(--ease); }
.wandel-tile:hover .wandel-img img, .wandel-tile:focus-visible .wandel-img img { transform: scale(1.045); }
.wandel-cap { display: flex; flex-direction: column; gap: .2rem; padding-top: 1rem; position: relative; }
.wandel-cap::before { content: ""; position: absolute; top: 0; left: 0; height: 2px; width: 2.5rem; background: var(--accent); transition: width .8s var(--ease); }
.wandel-tile:hover .wandel-cap::before, .wandel-tile:focus-visible .wandel-cap::before { width: 100%; }
.wandel-name { font-weight: 500; font-size: .9375rem; padding-top: .5rem; }
.wandel-line { font-size: .9375rem; color: rgba(var(--ink-rgb), .64); transition: color .4s var(--ease); }
.wandel-tile:hover .wandel-line, .wandel-tile:focus-visible .wandel-line { color: var(--ink); }
.wandel-tile:focus-visible { outline: 2px solid var(--accent); outline-offset: 6px; }
@supports (animation-timeline: view()) {
  .wandel-img { animation: wandel-open linear both; animation-timeline: view(); animation-range: entry 0% entry 70%; }
  @keyframes wandel-open { from { clip-path: inset(18% 0 0 0); } to { clip-path: inset(0 0 0 0); } }
}
@media (max-width: 860px) {
  .wandel-head h2, .wandel-head p { grid-column: 1 / -1; }
  .wandel-tile--7, .wandel-tile--5 { grid-column: 1 / -1; }
  .wandel-tile--4 { grid-column: span 6; }
}
@media (max-width: 560px) { .wandel-tile--4 { grid-column: 1 / -1; } }
@media (prefers-reduced-motion: reduce) {
  .wandel-img { animation: none; clip-path: none; }
  .wandel-img img, .wandel-cap::before { transition: none; }
}
`;
for (const [f, s] of Object.entries(W)) fs.writeFileSync(f, s, 'utf8');
console.log('OK', Object.keys(W).join(', '));
