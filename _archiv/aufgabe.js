// Leistungen-Hero: "Termin" -> "Aufgabe". Bricht ohne Schreiben ab, wenn etwas nicht genau einmal passt.
const fs = require('fs');
const W = [];
function rep(f, re, by) {
  const s = (W.find(w => w[0] === f) || [])[1] ?? fs.readFileSync(f, 'utf8');
  const n = (s.match(new RegExp(re.source, re.flags + 'g')) || []).length;
  if (n !== 1) throw new Error(`${f}: ${n} Treffer für ${re}`);
  const out = s.replace(re, by); const i = W.findIndex(w => w[0] === f); i >= 0 ? (W[i][1] = out) : W.push([f, out]);
}
const de = 'src/leistungen/index.njk', en = 'src/en/services/index.njk';
rep(de, /\["Gerufen", "wird", "man", "zu", "einem", "Termin"\]/,
  '["Gerufen", "werden", "wir", "für", "eine", "Aufgabe,", "nicht", "für", "ein", "Gewerk"]');
rep(de, /"Nicht für [^\n]*Anlässe\."/,
  '"Eine Listung steht an, eine Messe, ein Launch oder ein neuer Auftritt, der überall ankommen muss. Gestaltung, Text und Film gehören zu jeder dieser Aufgaben."');
rep(en, /\["You", "get", "called", "for", "a", "deadline"\]/,
  '["We", "get", "called", "in", "for", "a", "task,", "not", "a", "discipline"]');
rep(en, /"Not for [^\n]*occasions\."/,
  '"A retail listing is coming up, a trade fair, a launch, or a new brand presence that has to arrive everywhere. Design, copy and film are part of every one of these tasks."');
for (const [f, s] of W) fs.writeFileSync(f, s, 'utf8');
console.log('OK', W.length, 'Dateien');
