// Prüft: Rekonstruktion + derselbe Fehler (Buchstabe A -> B) == beschädigte Datei?
// Aufruf: node vergleich.js <rekonstruktion> <beschaedigt> <A> <B>
const fs = require('fs');
const [rek, kaputt, a, b] = process.argv.slice(2);
const norm = s => s.replace(/^﻿/, '').replace(/\r\n/g, '\n').replace(/\s+$/, '');
const r = norm(fs.readFileSync(rek, 'utf8')).split(a).join(b);
const k = norm(fs.readFileSync(kaputt, 'utf8'));
if (r === k) { console.log('IDENTISCH'); process.exit(0); }
let i = 0; while (i < r.length && r[i] === k[i]) i++;
console.log('ABWEICHUNG bei Zeichen ' + i);
console.log('  Rekon.: ' + JSON.stringify(r.slice(Math.max(0, i - 60), i + 60)));
console.log('  Datei : ' + JSON.stringify(k.slice(Math.max(0, i - 60), i + 60)));
