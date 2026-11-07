// Fassung 7: /positionierung/ in die Arbeitsweise überführt.
// Seiten archivieren (nicht löschen), Footer-Einträge entfernen, 301 ergänzen.
const fs = require('fs'), path = require('path');
const R = path.join(__dirname, '..');

// 1. Archivieren
for (const [von, ziel] of [['src/positionierung', '_archiv/positionierung-alt/de'], ['src/en/positioning', '_archiv/positionierung-alt/en']]) {
  const q = path.join(R, von);
  if (!fs.existsSync(q)) { console.log('nicht vorhanden:', von); continue; }
  fs.mkdirSync(path.dirname(path.join(R, ziel)), { recursive: true });
  fs.renameSync(q, path.join(R, ziel));
  console.log('archiviert:', von, '->', ziel);
}

// 2. Footer: Einträge entfernen (JSON sauber parsen und schreiben)
const ip = path.join(R, 'src/_data/i18n.json');
const i18n = JSON.parse(fs.readFileSync(ip, 'utf8'));
const vorher = i18n.de.footer.nav.length + i18n.en.footer.nav.length;
i18n.de.footer.nav = i18n.de.footer.nav.filter(x => x.url !== '/positionierung/');
i18n.en.footer.nav = i18n.en.footer.nav.filter(x => x.url !== '/en/positioning/');
fs.writeFileSync(ip, JSON.stringify(i18n, null, 2) + '\n');
console.log('Footer-Einträge entfernt:', vorher - i18n.de.footer.nav.length - i18n.en.footer.nav.length);

// 3. Weiterleitungen (für den Fall, dass die Seiten schon gecrawlt wurden)
const hp = path.join(R, 'src/.htaccess');
let h = fs.readFileSync(hp, 'utf8');
if (!h.includes('Fassung 7: Positionierung')) {
  const block = [
    '# --- Fassung 7: Positionierung -> Arbeitsweise bzw. luenstroth.com (07.11.2026) ---',
    'RewriteRule ^positionierung/platzierung-im-markt/?$ https://luenstroth.com/de/markenberatung/positionierung/ [R=301,L]',
    'RewriteRule ^positionierung(/.*)?$ /vorgehensweise-der-agentur/ [R=301,L]',
    'RewriteRule ^en/positioning/placement-in-the-market/?$ https://luenstroth.com/en/brand-consultancy/positioning/ [R=301,L]',
    'RewriteRule ^en/positioning(/.*)?$ /en/approach/ [R=301,L]',
    ''
  ].join('\n');
  h = h.replace('# --- Fassung 7: Gewerke-Seiten', block + '\n# --- Fassung 7: Gewerke-Seiten');
  fs.writeFileSync(hp, h);
  console.log('.htaccess ergänzt:', h.includes('Fassung 7: Positionierung'));
}
