// Messe als Leistung entfernen: Seiten ins Archiv, 301 auf die Leistungsübersicht, alle Erwähnungen als Leistung bereinigen.
// Eva Mann (historische Messekommunikation) bleibt als Tatsache stehen. Bricht ohne Schreiben ab bei Fehlern.
const fs = require('fs'), path = require('path');
const W = {};
const get = (f) => W[f] ?? fs.readFileSync(f, 'utf8');
function rep(f, a, b) { const s = get(f), n = s.split(a).length - 1; if (n !== 1) throw new Error(`${f}: ${n}× für "${a.slice(0, 60)}"`); W[f] = s.replace(a, b); }
function repRe(f, re, b) { const s = get(f), n = (s.match(new RegExp(re.source, re.flags + 'g')) || []).length; if (n !== 1) throw new Error(`${f}: ${n}× für ${re}`); W[f] = s.replace(re, b); }

// Fußzeile (i18n): Eintrag entfernen
const i18n = JSON.parse(get('src/_data/i18n.json'));
let removed = 0;
for (const l of Object.keys(i18n)) {
  const sv = i18n[l]?.footer?.services; if (!Array.isArray(sv)) continue;
  const before = sv.length; i18n[l].footer.services = sv.filter(x => !/messeauftritt|trade-fair/.test(x.url)); removed += before - i18n[l].footer.services.length;
}
if (removed !== 2) throw new Error('Fußzeile: ' + removed + ' Einträge entfernt');
W['src/_data/i18n.json'] = JSON.stringify(i18n, null, 2) + '\n';

// Beschreibungen und Texte
repRe('src/index.njk', /Produkteinführung, Messe, Rollout\./, 'Produkteinführung, Auslandsmärkte, Rollout.');
repRe('src/en/index.njk', /product launch, trade fair, rollout\./, 'product launch, international markets, rollout.');
repRe('src/kontakt/index.njk', /^description: "(.*?)Produkteinführung, Messe, Rollout\./m, 'description: "$1Produkteinführung, Auslandsmärkte, Rollout.');
repRe('src/kontakt/index.njk', /("description": ".*?)Produkteinführung, Messe, Rollout\./, '$1Produkteinführung, Auslandsmärkte, Rollout.');
repRe('src/en/contact.njk', /product launch, trade fair, rollout\./, 'product launch, international markets, rollout.');
repRe('src/leistungen/index.njk', /Listungsgespräch, Website, Produkteinführung, Messe, Auslandsmärkte, Rollout: sechs Anlässe/, 'Listungsgespräch, Website, Produkteinführung, Auslandsmärkte, Rollout: Anlässe');
repRe('src/leistungen/index.njk', /"Listungsgespräch, Messe, Produkteinführung, neuer Auftritt:/, '"Listungsgespräch, Produkteinführung, Auslandsmarkt, neuer Auftritt:');
repRe('src/en/services/index.njk', /Retail listing, website, product launch, trade fair, international markets, rollout: six occasions/, 'Retail listing, website, product launch, international markets, rollout: occasions');
repRe('src/en/services/index.njk', /"Retail listing, trade fair, product launch, new brand presence:/, '"Retail listing, product launch, a new market, new brand presence:');
rep('src/leistungen/website-b2b.njk', 'im selben Auftritt wie Lookbook, Fachanzeige und Messe.', 'im selben Auftritt wie Lookbook und Fachanzeige.');
rep('src/en/services/b2b-website.njk', 'in the same presence as lookbook, trade advertisement and trade fair.', 'in the same presence as lookbook and trade advertisement.');
rep('src/vorgehensweise-der-agentur/index.njk', 'eine Kampagne, eine Website, ein neuer Messestand.', 'eine Kampagne, eine Website, eine neue Broschüre.');
rep('src/en/approach.njk', 'a campaign, a website, a new trade fair stand.', 'a campaign, a website, a new brochure.');
rep('src/_includes/schema-corporate-design-process.njk', 'Digital, Print, Messe, Fahrzeuge, Verpackung.', 'Digital, Print, Gebäude, Fahrzeuge, Verpackung.');
for (const f of ['src/llms.njk', 'src/llms-full.njk']) repRe(f, /Sechs Anlässe: Verpackung fürs Listungsgespräch, B2B-Website, Produkteinführung, Messe, Material für Auslandsmärkte, Rollout eines neuen Auftritts\./, 'Anlässe sind zum Beispiel: Verpackung fürs Listungsgespräch, B2B-Website, Produkteinführung, Material für Auslandsmärkte, Rollout eines neuen Auftritts.');

// Weiterleitungen
const ht = 'src/.htaccess';
W[ht] = get(ht).replace(/\s*$/, '') + `

# Messe als Leistung entfernt (08.11.2026) – auf die Leistungsübersicht
RewriteRule ^leistungen/messeauftritt/?$ /leistungen/ [R=301,L]
RewriteRule ^en/services/trade-fair/?$ /en/services/ [R=301,L]
`;
// Header-Muster prüfen: Weiterleitungsregeln müssen vor den Header-Blöcken stehen? Apache wertet RewriteRules unabhängig davon aus – unkritisch.

// Schreiben, dann Seiten ins Archiv verschieben
for (const [f, s] of Object.entries(W)) fs.writeFileSync(f, s, 'utf8');
fs.mkdirSync('_archiv/leistungen-alt/en', { recursive: true });
fs.renameSync('src/leistungen/messeauftritt.njk', '_archiv/leistungen-alt/messeauftritt.njk');
fs.renameSync('src/en/services/trade-fair.njk', '_archiv/leistungen-alt/en/trade-fair.njk');
console.log('OK', Object.keys(W).length, 'Dateien geändert, 2 Seiten archiviert');
