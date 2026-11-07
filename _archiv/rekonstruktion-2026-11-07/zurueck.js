// Rekonstruktionen zurückspielen + „Absatzmittler“ ersetzen (Fassung 6, Sprachregel).
// Jede Ersetzung muss genau einmal greifen, sonst Abbruch ohne Schreiben.
const fs = require('fs'), path = require('path');
const R = path.join(__dirname, '..');
const jobs = [
  ['_rekon/case-studies-index.njk', 'src/case-studies/index.njk', [['bei allen Absatzmittlern', 'bei allen Händlern']]],
  ['_rekon/mittelstand.njk', 'src/werbeagentur-fuer-den-mittelstand/index.njk', [['bei allen Absatzmittlern', 'bei allen Händlern']]],
  ['_rekon/vorgehensweise.njk', 'src/vorgehensweise-der-agentur/index.njk', [['wie Hersteller, Absatzmittler und Endkunden', 'wie Hersteller, Handel und Endkunden']]]
];
const fertig = [];
for (const [von, nach, ers] of jobs) {
  let s = fs.readFileSync(path.join(R, von), 'utf8');
  for (const [a, b] of ers) {
    const n = s.split(a).length - 1;
    if (n !== 1) { console.log(`ABBRUCH: "${a}" ${n}× in ${von}`); process.exit(1); }
    s = s.replace(a, b);
  }
  fertig.push([nach, s]);
}
for (const [nach, s] of fertig) { fs.writeFileSync(path.join(R, nach), s); console.log('geschrieben:', nach); }
