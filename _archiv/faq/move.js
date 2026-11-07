// Verschiebt den FAQ-Block auf der Agenturseite vor den letzten Abschnitt (mit Kontakt-Button).
const fs = require('fs');
for (const f of ['src/agentur/index.njk', 'src/en/agency.njk']) {
  let s = fs.readFileSync(f, 'utf8');
  const m = s.match(/\n*\{% set faq = [^\n]*\{% include "faq\.njk" %\}\n?/);
  if (!m) throw new Error(f + ': kein FAQ-Block');
  s = s.replace(m[0], '\n');
  const marker = '<section class="container measure section-block">';
  const i = s.lastIndexOf(marker);
  if (i < 0) throw new Error(f + ': kein Abschnitt');
  s = s.slice(0, i) + m[0].trim() + '\n\n' + s.slice(i);
  fs.writeFileSync(f, s.replace(/\s*$/, '\n'), 'utf8');
}
console.log('OK');
