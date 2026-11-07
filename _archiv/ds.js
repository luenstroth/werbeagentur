// Datenschutz: netcup als Hoster, Server-Logdateien, Entwurfshinweis entfernen. Startseiten-Beschreibung DE/EN.
const fs = require('fs');
const W = [];
function rep(f, re, by) {
  const s = (W.find(w => w[0] === f) || [])[1] ?? fs.readFileSync(f, 'utf8');
  const n = (s.match(new RegExp(re.source, re.flags + 'g')) || []).length;
  if (n !== 1) throw new Error(`${f}: ${n} Treffer für ${re}`);
  const out = s.replace(re, by); const i = W.findIndex(w => w[0] === f); i >= 0 ? (W[i][1] = out) : W.push([f, out]);
}
const P = '<p style="margin-bottom:1.5rem;line-height:1.8;font-size:.9375rem;color:rgba(var(--ink-rgb),.7);">';
const H = (t) => `<h2 class="display-md reveal" style="margin:2rem 0 1rem;font-size:1.5rem;">${t}</h2>`;

rep('src/datenschutz/index.njk', /Diese Website wird bei einem externen Hosting-Anbieter betrieben\.[^<]*<\/p>/,
  `Diese Website wird bei der netcup GmbH, Daimlerstraße 25, 76185 Karlsruhe, betrieben. Personenbezogene Daten, die auf dieser Website erfasst werden, werden auf den Servern von netcup in Deutschland verarbeitet. Mit netcup besteht ein Vertrag zur Auftragsverarbeitung gemäß Art. 28 DSGVO.</p>
  ${H('Server-Logdateien')}
  ${P}Beim Aufruf dieser Website speichert der Server automatisch Informationen, die Ihr Browser übermittelt: IP-Adresse, Datum und Uhrzeit des Zugriffs, aufgerufene Seite, übertragene Datenmenge, Referrer-URL sowie Browsertyp und Betriebssystem. Diese Daten werden nicht mit anderen Datenquellen zusammengeführt. Die Verarbeitung dient der technischen Bereitstellung und der Sicherheit der Website (Art. 6 Abs. 1 lit. f DSGVO). Die Logdateien werden gelöscht, sobald sie für diese Zwecke nicht mehr erforderlich sind.</p>`);
rep('src/datenschutz/index.njk', /Stand dieser Erklärung: 2026\.[^<]*/, 'Stand dieser Erklärung: November 2026.');

rep('src/en/privacy.njk', /This website is operated by an external hosting provider\.[^<]*<\/p>/,
  `This website is hosted by netcup GmbH, Daimlerstraße 25, 76185 Karlsruhe, Germany. Personal data collected on this website is processed on netcup's servers in Germany. A data processing agreement under Art. 28 GDPR is in place with netcup.</p>
  ${H('Server log files')}
  ${P}When you visit this website, the server automatically stores information transmitted by your browser: IP address, date and time of access, page requested, amount of data transferred, referrer URL, browser type and operating system. This data is not combined with other data sources. Processing serves the technical provision and security of the website (Art. 6(1)(f) GDPR). Log files are deleted as soon as they are no longer required for these purposes.</p>`);
const en = fs.readFileSync('src/en/privacy.njk', 'utf8');
const stand = en.match(/(As of|Last updated|Status of this|Version)[^<]*/);
if (stand) rep('src/en/privacy.njk', new RegExp(stand[0].replace(/[.*+?^${}()|[\]\\]/g, '\\$&')), 'Last updated: November 2026.');
else console.log('EN: keine Stand-Zeile gefunden');

rep('src/index.njk', /^description: .*$/m, 'description: "Werbeagentur in Bielefeld für Industrie, Handel und Markenartikler: Verpackung, B2B-Website, Produkteinführung, Messe, Rollout. Senior-Teams, deutsch und englisch."');
rep('src/en/index.njk', /^description: .*$/m, 'description: "Advertising agency for industry, retail and branded goods: packaging, B2B website, product launch, trade fair, rollout. Senior teams, German and English."');

for (const [f, s] of W) fs.writeFileSync(f, s, 'utf8');
console.log('OK', W.length, 'Dateien', stand ? '(EN-Stand: ' + stand[0].slice(0, 80) + ')' : '');
