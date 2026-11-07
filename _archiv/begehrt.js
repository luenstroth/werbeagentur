// Leistungen-Hero "Begehrt statt verglichen", B2B-Website ohne "verkauft", Verpackung "zweimal überzeugen".
const fs = require('fs');
const W = [];
function rep(f, re, by) {
  const s = (W.find(w => w[0] === f) || [])[1] ?? fs.readFileSync(f, 'utf8');
  const n = (s.match(new RegExp(re.source, re.flags + 'g')) || []).length;
  if (n !== 1) throw new Error(`${f}: ${n} Treffer für ${re}`);
  const out = s.replace(re, by); const i = W.findIndex(w => w[0] === f); i >= 0 ? (W[i][1] = out) : W.push([f, out]);
}
// Leistungen-Übersicht
rep('src/leistungen/index.njk', /\["Gerufen", "werden", "wir", "für", "eine", "Aufgabe,", "nicht", "für", "ein", "Gewerk"\]/, '["Begehrt", "statt", "verglichen"]');
rep('src/leistungen/index.njk', /"Eine Listung steht an, [^\n]*Aufgaben\."/,
  '"Listungsgespräch, Messe, Produkteinführung, neuer Auftritt: In jedem dieser Momente entscheidet sich, ob Ihr Angebot eines von vielen ist – oder das, auf das niemand verzichten will. Wir gestalten diese Momente so, dass es das Zweite wird."');
rep('src/en/services/index.njk', /\["We", "get", "called", "in", "for", "a", "task,", "not", "a", "discipline"\]/, '["Desired,", "not", "compared"]');
rep('src/en/services/index.njk', /"A retail listing is coming up, [^\n]*tasks\."/,
  '"Retail listing, trade fair, product launch, new brand presence: each of these moments decides whether your offer is one of many – or the one nobody wants to do without. We shape these moments so that it becomes the latter."');
// B2B-Website
const de = 'src/leistungen/website-b2b.njk', en = 'src/en/services/b2b-website.njk';
rep(de, /^title: .*$/m, 'title: "B2B-Website-Relaunch: wenn die Website das alte Unternehmen zeigt"');
rep(de, /^anlassName: .*$/m, 'anlassName: "Die Website erzählt noch das alte Unternehmen"');
rep(de, /claim: "Die Website verkauft<br>nicht mehr<span/, 'claim: "Die Website erzählt<br>noch das alte Unternehmen<span');
rep(en, /^title: .*$/m, 'title: "B2B website relaunch: when the website shows yesterday\'s company"');
rep(en, /^anlassName: .*$/m, 'anlassName: "The website still tells the old story"');
rep(en, /claim: "The website<br>no longer sells<span/, 'claim: "The website still<br>tells the old story<span');
// Verpackung
rep('src/leistungen/listungsgespraech-handel.njk', /Die Verpackung muss also zweimal verkaufen:/, 'Die Verpackung muss also zweimal überzeugen:');
rep('src/en/services/retail-listing.njk', /So the packaging has to sell twice:/, 'So the packaging has to convince twice:');
for (const [f, s] of W) fs.writeFileSync(f, s, 'utf8');
console.log('OK', W.length, 'Dateien');
