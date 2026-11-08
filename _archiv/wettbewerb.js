// Keine Abwertung des Wettbewerbs: vergleichende Sätze positiv bzw. ohne Bezug auf andere Agenturen formulieren.
const fs = require('fs');
const W = {};
const get = (f) => W[f] ?? fs.readFileSync(f, 'utf8');
function rep(f, a, b) { const s = get(f), n = s.split(a).length - 1; if (n !== 1) throw new Error(`${f}: ${n}× für "${a.slice(0, 60)}"`); W[f] = s.replace(a, b); }
rep('src/vorgehensweise-der-agentur/index.njk', 'Die meisten Agenturen kommen aus einer von zwei Richtungen: aus der Gestaltung oder aus der Betriebswirtschaft. Die einen setzen um, was bestellt ist. Die anderen bestätigen, was der Kunde ohnehin denkt. Beides ist bequem – und beides hört zu früh auf.',
  'Agenturen kommen meist aus der Gestaltung oder aus der Betriebswirtschaft – und leisten dort genau das, was Kunden von ihnen erwarten. Lünstroth bringt eine dritte Perspektive hinzu.');
rep('src/en/approach.njk', 'Most agencies come from one of two directions: design or business administration. The first deliver what was ordered. The second confirm what the client already thinks. Both are comfortable – and both stop too early.',
  'Agencies usually come from design or business administration – and deliver exactly what clients expect of them there. Lünstroth adds a third perspective.');
rep('src/agentur/index.njk', 'Der eigentliche Unterschied zu den meisten Werbeagenturen liegt in einer einzelnen Fähigkeit:', 'Der Kern der Arbeit liegt in einer einzelnen Fähigkeit:');
rep('src/en/agency.njk', 'The real difference from most advertising agencies lies in a single ability:', 'The core of the work lies in a single ability:');
rep('src/agentur/index.njk', 'grenzt Lünstroth von den meisten Werbeagenturen ab, die auf dieser Ebene gar nicht erst ansetzen.', 'steht im Zentrum jedes Mandats.');
rep('src/en/agency.njk', 'sets Lünstroth apart from most advertising agencies, which never start at this level.', 'is at the centre of every mandate.');
rep('src/case-studies/cobiax.njk', 'Die meisten Gestaltungsagenturen beginnen mit der Frage: Wie soll das aussehen? Lünstroth beginnt mit einer anderen Frage:', 'Am Anfang steht nicht die Frage, wie es aussehen soll, sondern:');
rep('src/en/case-studies/cobiax.njk', 'Most design agencies start with the question: what should it look like? Lünstroth starts with a different question:', 'The starting point is not what it should look like, but:');
rep('src/case-studies/cobiax.njk', ' Das unterscheidet die Arbeitsweise von klassischen Grafikstudios, die über ein neues Logo oft schon dann nachdenken, wenn niemand danach gefragt hat.', '');
rep('src/en/case-studies/cobiax.njk', ' That distinguishes this way of working from classic graphic studios, which often start thinking about a new logo before anyone has asked for one.', '');
for (const [f, s] of Object.entries(W)) fs.writeFileSync(f, s, 'utf8');
console.log('OK', Object.keys(W).length, 'Dateien');
