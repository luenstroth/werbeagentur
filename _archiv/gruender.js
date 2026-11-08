// Gründer tritt auf der Werbeagentur-Website in den Hintergrund: kein Porträt, keine persönlichen Titel, Impressum minimal.
const fs = require('fs');
const W = {};
const get = (f) => W[f] ?? fs.readFileSync(f, 'utf8');
function repRe(f, re, b) { const s = get(f), m = s.match(new RegExp(re.source, re.flags + 'g')) || []; if (m.length !== 1) throw new Error(`${f}: ${m.length}× für ${re}`); W[f] = s.replace(re, b); }
// Agentur DE
repRe('src/agentur/index.njk', /<h2 class="display-md reveal reveal-delay-1" style="margin-bottom:1\.5rem;">Fachliche Verankerung über die Agentur hinaus<\/h2>\s*<div class="case-img[^]*?<\/div>\s*<p class="body-lg reveal reveal-delay-2" style="margin-bottom:1\.5rem;">Gegründet hat Peter Lünstroth die Agentur <span class="stat">1994<\/span>, zunächst als strategische Marketingberatung\./,
  '<h2 class="display-md reveal reveal-delay-1" style="margin-bottom:1.5rem;">Herkunft</h2>\n  <p class="body-lg reveal reveal-delay-2" style="margin-bottom:1.5rem;">Gegründet wurde die Agentur <span class="stat">1994</span>, zunächst als strategische Marketingberatung.');
repRe('src/agentur/index.njk', /\s*<p class="body-lg reveal reveal-delay-2" style="margin-bottom:2\.5rem;">Peter Lünstroth ist Referent am Bundespatentgericht[^<]*<\/p>/, '');
repRe('src/agentur/index.njk', /04 — Verankerung<\/p>/, '04 — Herkunft</p>');
// Agentur EN
const en = 'src/en/agency.njk';
repRe(en, /<div class="case-img[^"]*"[^>]*>\s*<img src="\/img\/Peter-Luenstroth-CEO\.webp"[^>]*>\s*<\/div>\s*/, '');
repRe(en, /Peter Lünstroth founded the agency in <span class="stat">1994<\/span>/, 'The agency was founded in <span class="stat">1994</span>');
repRe(en, /\s*<p class="body-lg reveal reveal-delay-2" style="margin-bottom:2\.5rem;">Peter Lünstroth lectures at the German Federal Patent Court[^<]*<\/p>/, '');
repRe(en, /<h2 class="display-md reveal reveal-delay-1" style="margin-bottom:1\.5rem;">[^<]*<\/h2>(\s*<p class="body-lg reveal reveal-delay-2" style="margin-bottom:1\.5rem;">The agency was founded)/, '<h2 class="display-md reveal reveal-delay-1" style="margin-bottom:1.5rem;">Origins</h2>$1');
// Impressum: persönliche Notiz entfernen (gesetzlich nicht nötig)
repRe('src/impressum/index.njk', /\s*<span class="imp-note">Studium der Rechtswissenschaften, Philosophie und Ethnologie\. Gründer und Inhaber der Lünstroth GmbH\.<\/span>/, '');
for (const [f, s] of Object.entries(W)) fs.writeFileSync(f, s, 'utf8');
fs.mkdirSync('_archiv/bilder-ungenutzt', { recursive: true });
fs.renameSync('src/img/Peter-Luenstroth-CEO.webp', '_archiv/bilder-ungenutzt/Peter-Luenstroth-CEO.webp');
console.log('OK', Object.keys(W).length, 'Dateien');
