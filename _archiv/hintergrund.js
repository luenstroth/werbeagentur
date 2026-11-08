// Arbeitsweise (DE/EN): neuer Abschnitt 03 "Hintergrund" (wissenschaftliches Fundament), bisherige 03–07 werden 04–08.
const fs = require('fs');
const S = {
  'src/vorgehensweise-der-agentur/index.njk': `<!-- 03 — HINTERGRUND -->
<section class="container measure section-block">
  <p class="label reveal" style="margin-bottom:1rem;">03 — Hintergrund</p>
  <h2 class="display-md reveal reveal-delay-1" style="margin-bottom:1.25rem;">Bis zum Ende gedacht</h2>
  <p class="body-lg reveal reveal-delay-2" style="margin-bottom:1.5rem;">Die meisten Agenturen kommen aus einer von zwei Richtungen: aus der Gestaltung oder aus der Betriebswirtschaft. Die einen setzen um, was bestellt ist. Die anderen bestätigen, was der Kunde ohnehin denkt. Beides ist bequem – und beides hört zu früh auf.</p>
  <p class="body-lg reveal reveal-delay-2" style="margin-bottom:1.5rem;">Die Agentur ist aus einer anderen Richtung entstanden. Ihr Gründer kommt aus Rechtswissenschaft, Philosophie, Ethnologie und Politologie und ist Referent am Bundespatentgericht. Daraus folgt eine Arbeitsweise, die eine Frage wissenschaftlich fundiert und aus einer breiteren kulturellen Perspektive durchdenkt – bis zum Ende: Was bedeutet ein Zeichen in einer anderen Kultur? Was hält rechtlich? Was glaubt ein Mensch, und warum? Dieselbe Herangehensweise prägt die Markenberatung <a href="https://luenstroth.com/de/">Lünstroth</a>.</p>
  <p class="body-lg reveal reveal-delay-2" style="margin-bottom:1.5rem;">Die Leitungen der einzelnen Disziplinen haben ihr Fach darüber hinaus mit Auszeichnung studiert. So kommen in jedem Mandat fachliche Exzellenz und breite Perspektive zusammen.</p>
</section>

`,
  'src/en/approach.njk': `<!-- 03 — BACKGROUND -->
<section class="container measure section-block">
  <p class="label reveal" style="margin-bottom:1rem;">03 — Background</p>
  <h2 class="display-md reveal reveal-delay-1" style="margin-bottom:1.25rem;">Thought through to the end</h2>
  <p class="body-lg reveal reveal-delay-2" style="margin-bottom:1.5rem;">Most agencies come from one of two directions: design or business administration. The first deliver what was ordered. The second confirm what the client already thinks. Both are comfortable – and both stop too early.</p>
  <p class="body-lg reveal reveal-delay-2" style="margin-bottom:1.5rem;">This agency grew from a different direction. Its founder comes from law, philosophy, ethnology and political science and lectures at the German Federal Patent Court. The result is a way of working that thinks a question through on a scientific basis and from a broader cultural perspective – to the end: What does a sign mean in another culture? What holds up legally? What do people believe, and why? The same approach shapes the <a href="https://luenstroth.com/en/">Lünstroth</a> brand consultancy.</p>
  <p class="body-lg reveal reveal-delay-2" style="margin-bottom:1.5rem;">The heads of the individual disciplines have, in addition, studied their field with distinction. Every mandate thus combines professional excellence with a broad perspective.</p>
</section>

`
};
const W = {};
for (const [f, block] of Object.entries(S)) {
  let s = fs.readFileSync(f, 'utf8');
  // bisherige 03..07 hochzählen (Kommentar und Label), von hinten nach vorn
  for (let n = 7; n >= 3; n--) {
    const re = new RegExp(`(<!-- |>)0${n} — `, 'g');
    const c = (s.match(re) || []).length;
    if (c !== 2) throw new Error(`${f}: 0${n} ${c}× statt 2×`);
    s = s.replace(re, `$10${n + 1} — `);
  }
  const at = s.indexOf('<!-- 04 — ');
  if (at < 0) throw new Error(f + ': Einfügestelle fehlt');
  W[f] = s.slice(0, at) + block + s.slice(at);
}
for (const [f, s] of Object.entries(W)) fs.writeFileSync(f, s, 'utf8');
console.log('OK');
