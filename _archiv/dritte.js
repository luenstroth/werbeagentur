// Ersetzt die verkäuferische Anrede (Sie/Ihr, you/your) in FAQ-Antworten und Leistungen-Hero durch dritte Person.
const fs = require('fs');
const R = [
  ['src/agentur/index.njk', 'auch mit Ihrer Geschäftsführung sprechen – ohne Übergabe an ein Team, das Sie nie kennengelernt haben', 'auch mit der Geschäftsführung sprechen – ohne Übergabe an ein Team, das der Kunde nie kennengelernt hat'],
  ['src/agentur/index.njk', 'stimmen uns direkt mit Ihren Ländergesellschaften ab', 'stimmen uns direkt mit den Ländergesellschaften ab'],
  ['src/agentur/index.njk', 'Die Anforderungen Ihres Einkaufs stimmen wir', 'Die Anforderungen des Einkaufs stimmen wir'],
  ['src/en/agency.njk', 'talk to your management – with no hand-over to a team you have never met', "talk to the client's management – with no hand-over to a team the client has never met"],
  ['src/en/agency.njk', 'coordinate directly with your national subsidiaries', 'coordinate directly with national subsidiaries'],
  ['src/en/agency.njk', 'the requirements of your purchasing department', 'the requirements of the purchasing department'],
  ['src/vorgehensweise-der-agentur/index.njk', 'so genau, dass Ihr Team, Ihre Ländergesellschaften und andere Dienstleister', 'so genau, dass Marketingteam, Ländergesellschaften und andere Dienstleister'],
  ['src/vorgehensweise-der-agentur/index.njk', 'beim Moment, in dem Ihr Kunde entscheidet,', 'beim Moment, in dem im Markt entschieden wird,'],
  ['src/vorgehensweise-der-agentur/index.njk', 'Die Kennzahlen legen Sie fest – sie hängen an Ihren Zielen, nicht an unseren.', 'Die Kennzahlen legt der Kunde fest – sie hängen an seinen Zielen, nicht an unseren.'],
  ['src/vorgehensweise-der-agentur/index.njk', 'Ihnen. Sämtliche Rechte an den erarbeiteten Ergebnissen gehen vollständig auf Sie über', 'Dem Kunden. Sämtliche Rechte an den erarbeiteten Ergebnissen gehen vollständig auf ihn über'],
  ['src/en/approach.njk', 'precisely enough for your team, your subsidiaries and other service providers', 'precisely enough for the marketing team, subsidiaries and other service providers'],
  ['src/en/approach.njk', 'at the moment your customer decides', 'at the moment the market decides'],
  ['src/en/approach.njk', 'You define the KPIs – they follow your goals, not ours.', "The client defines the KPIs – they follow the client's goals, not ours."],
  ['src/en/approach.njk', 'You do. All rights to the results pass to you in full', 'The client. All rights to the results pass to the client in full'],
  ['src/leistungen/index.njk', 'ob Ihr Angebot eines von vielen ist', 'ob ein Angebot eines von vielen ist'],
  ['src/en/services/index.njk', 'whether your offer is one of many', 'whether an offer is one of many']
];
const files = {};
for (const [f, a, b] of R) {
  const s = files[f] ?? fs.readFileSync(f, 'utf8');
  // FAQ-Daten stehen JSON-kodiert in der Datei: dort sind Apostrophe unverändert, Anführungszeichen escaped – beide Fassungen prüfen
  const n = s.split(a).length - 1;
  if (n !== 1) throw new Error(`${f}: ${n} Treffer für "${a.slice(0, 50)}"`);
  files[f] = s.replace(a, b);
}
for (const [f, s] of Object.entries(files)) fs.writeFileSync(f, s, 'utf8');
console.log('OK', R.length, 'Ersetzungen in', Object.keys(files).length, 'Dateien');
