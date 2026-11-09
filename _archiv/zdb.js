// ZDB: Kunde ist der Zentralverband des Deutschen Baugewerbes; der Begriff "Meisterhaft" wurde von Lünstroth entwickelt.
const fs = require('fs');
const W = {};
const get = f => W[f] ?? fs.readFileSync(f, 'utf8').replace(/\r\n/g, '\n');
function r(f, re, b, cnt = 1) { const s = get(f), m = s.match(new RegExp(re.source, 'g')) || []; if (m.length !== cnt) throw new Error(`${f}: ${m.length}x statt ${cnt}x ${re}`); W[f] = s.replace(new RegExp(re.source, cnt > 1 ? 'g' : ''), b); }
const D = 'src/case-studies/meisterhaft-zdb.njk', E = 'src/en/case-studies/meisterhaft-zdb.njk';
// Name überall korrigieren
for (const [f, n] of [[D, 1], [E, 1], ['src/index.njk', 1], ['src/en/index.njk', 1]]) r(f, /Zentralverband Deutsches Baugewerbe"/, 'Zentralverband des Deutschen Baugewerbes"', n + (f === D || f === E ? 0 : 0));
r(D, /title: "(G.tesiegel als Marke sch.tzen . )Case Meisterhaft \(ZDB\)"/, 'title: "$1Case Zentralverband des Deutschen Baugewerbes"');
r(E, /title: "(Protecting a quality seal as a trademark . )Meisterhaft \(ZDB\) case study"/, 'title: "$1case study for the German Construction Industry Federation (ZDB)"');
// Einstieg: Begriff von Lünstroth entwickelt
r(D, /Der Zentralverband Deutsches Baugewerbe \(ZDB\) vertritt 35\.000 mittelst.ndische, inhabergef.hrte Bauunternehmen\. F.r sein Qualifizierungssystem sollte ein Begriff das Zeichen tragen, der die Sache selbst beim Namen nennt: .Meisterhaft. . handwerkliche Qualifikation auf h.chstem Niveau\./,
  'Der Zentralverband des Deutschen Baugewerbes (ZDB) vertritt 35.000 mittelständische, inhabergeführte Bauunternehmen. Für sein Qualifizierungssystem brauchte der Verband ein Zeichen, das die Sache selbst beim Namen nennt. Lünstroth entwickelte dafür den Begriff „Meisterhaft“ – handwerkliche Qualifikation auf höchstem Niveau.');
r(E, /The German Construction Industry Federation \(Zentralverband Deutsches Baugewerbe, ZDB\) represents 35,000 mid-sized, owner-managed construction companies\. For its qualification system, the mark was to carry a term that calls the thing by its name: .Meisterhaft. \(masterly\) . craft qualification at the highest level\./,
  'The German Construction Industry Federation (Zentralverband des Deutschen Baugewerbes, ZDB) represents 35,000 mid-sized, owner-managed construction companies. For its qualification system, the federation needed a mark that calls the thing by its name. Lünstroth developed the term "Meisterhaft" (masterly) for it – craft qualification at the highest level.');
// Karte in der Übersicht
r('src/case-studies/index.njk', /(.)Unser Begriff beschreibt genau, was wir leisten . aber ist er .berhaupt als Marke sch.tzf.hig\?(.)/, '$1Wir brauchen ein Gütesiegel, das sagt, was es verspricht – und trotzdem geschützt ist.$2');
r('src/case-studies/index.njk', /<h2 class="case-card-title">Meisterhaft \(ZDB\)<\/h2>/, '<h2 class="case-card-title">Zentralverband des Deutschen Baugewerbes</h2>');
r('src/en/case-studies/index.njk', /(q:".)Our term describes exactly what we do . but can it be protected as a trademark at all\?(.")/, '$1We need a quality seal that says what it promises – and is still protected.$2');
r('src/en/case-studies/index.njk', /n:"Meisterhaft \(ZDB\)"/, 'n:"German Construction Industry Federation (ZDB)"');
// Agentur-Seite
r('src/agentur/index.njk', /Bei (<a href="\/case-studies\/meisterhaft-zdb\/" style="color:var\(--accent\);">Meisterhaft<\/a>) bedeutete das, aus einem markenrechtlich/, 'Beim Gütesiegel $1 für den Zentralverband des Deutschen Baugewerbes bedeutete das, aus einem selbst entwickelten, markenrechtlich');
r('src/en/agency.njk', /For (<a href="\/en\/case-studies\/meisterhaft-zdb\/" style="color:var\(--accent\);">Meisterhaft<\/a>), that meant turning a term that was purely descriptive/, 'For the $1 quality seal of the German Construction Industry Federation, that meant turning a term of its own development that was purely descriptive');
for (const [f, s] of Object.entries(W)) fs.writeFileSync(f, s, 'utf8');
console.log('OK', Object.keys(W).length);
