// Ersetzt verkäuferische Anrede (you/your, Sie) auf Startseite und englischen Seiten.
const fs = require('fs');
const R = [
  ['src/index.njk', 'Welche Herausforderung bringt Sie zu uns?', 'Welche Aufgabe steht an?'],
  ['src/en/index.njk', 'What challenge brings you to us?', 'What task is coming up?'],
  ['src/en/index.njk', 'If you look interchangeable, you negotiate on price.', 'Whoever looks interchangeable ends up negotiating on price.'],
  ['src/en/index.njk', 'Convince only the second, and you never make it onto the shelf.', 'Convince only the second, and the product never makes it onto the shelf.'],
  ['src/en/index.njk', 'thinking your way into the logic', 'getting inside the logic'],
  ['src/en/agency.njk', 'thinking your way into the logic', 'getting inside the logic'],
  ['src/en/case-studies/arminia-bielefeld.njk', 'A direction you can read before you read it.', 'A direction that reads before a word is read.'],
  ['src/en/case-studies/arminia-bielefeld.njk', 'you cannot explain to a sponsor what they are buying into', 'there is no way to explain to a sponsor what they are buying into'],
  ['src/en/case-studies/arminia-bielefeld.njk', 'a form you can put in front of a board', 'a form that can be put in front of a board'],
  ['src/en/case-studies/cobiax.njk', 'an economic asset you do not give up without good reason', 'an economic asset not to be given up without good reason'],
  ['src/en/case-studies/meisterhaft-zdb.njk', 'the one you cannot register.', 'the one that cannot be registered.'],
  ['src/en/case-studies/werner-works.njk', 'When the company name holds you back:', 'When the company name holds a business back:'],
  ['src/en/services/brand-rollout.njk', 'Recognition is a value you take with you', 'Recognition is a value worth taking along'],
  ['src/en/services/retail-listing.njk', 'Convince only the second, and you never make it onto the shelf.', 'Convince only the second, and the product never makes it onto the shelf.'],
  ['src/en/services/retail-listing.njk', 'and lets you use the latitude up to that point', 'and makes full use of the latitude up to that point'],
  ['src/en/services/trade-fair.njk', 'and you get a beautiful stand and little follow-up business', 'and the result is a beautiful stand with little follow-up business'],
  ['src/en/404.njk', 'These will take you further:', 'These pages lead on:']
];
const files = {};
for (const [f, a, b] of R) {
  const s = files[f] ?? fs.readFileSync(f, 'utf8');
  const n = s.split(a).length - 1;
  if (n !== 1) throw new Error(`${f}: ${n} Treffer für "${a}"`);
  files[f] = s.replace(a, b);
}
for (const [f, s] of Object.entries(files)) fs.writeFileSync(f, s, 'utf8');
console.log('OK', R.length, 'Ersetzungen in', Object.keys(files).length, 'Dateien');
