// Arbeitsweise (DE/EN): Fragen der Auftraggeber zu Absicherung, KI, Kulturen, Vergleich, Bekanntheit.
const fs = require('fs');
const DE = [
  { q: 'Ist der Auftraggeber abgesichert?', a: 'Ja. Die Agentur ist über eine Berufshaftpflichtversicherung bei der ERGO Versicherung AG abgesichert. Gearbeitet wird grundsätzlich unter Vertraulichkeitsvereinbarung; Rahmenverträge und die Anforderungen des Einkaufs werden vor Projektbeginn abgestimmt. Alle Rechte an den Ergebnissen gehen vollständig auf den Auftraggeber über.' },
  { q: 'Wie geht die Agentur mit KI um – und ist das DSGVO-konform?', a: 'KI ist Werkzeug, nicht Entscheider: Wo sie beteiligt ist, entscheidet ein Senior. Die Verarbeitung erfolgt intern und nach DSGVO, Kundenmaterial wird nicht zum Training von KI-Modellen verwendet. Einzelheiten auf der Seite <a href="/ki-einsatz/">KI-Einsatz</a>.' },
  { q: 'Welchen Zugang hat die Agentur zu den Kulturen der Auslandsmärkte?', a: 'Aus langjährigen internationalen Mandaten – etwa für Hella, Cobiax, Piasten und Warner Hudson – in Märkten mit sehr unterschiedlichen Preislagen, Kennzeichnungspflichten und Lesarten. Dazu kommt ein ethnologisches Fundament: Kulturen werden nicht übersetzt, sondern verstanden.' },
  { q: 'Wie versteht die Agentur die Logik eines fremden Marktes – und warum?', a: 'Mit der Methode der Ethnologie: zuerst klären, wie eine Kultur Zeichen, Namen und Versprechen liest, dann gestalten. Jeder Vorschlag wird vorab sprachlich, kulturell sowie marken- und werberechtlich geprüft. Deshalb muss nachträglich nichts zurückgenommen werden.' },
  { q: 'Was spricht gegenüber einer großen Netzwerkagentur für Lünstroth?', a: 'Senior-Betreuung vom ersten Gespräch bis zum Ergebnis, kurze Entscheidungswege und Erfahrung mit Konzernen wie Hella und Mann+Hummel – ohne Übergabe an ein Team, das der Auftraggeber nie kennengelernt hat.' },
  { q: 'Und gegenüber einer Agentur vor Ort?', a: 'Internationale Arbeitsfähigkeit auf Deutsch und Englisch, ein wissenschaftliches Fundament mit Marken- und Werberecht im Haus – und die Verbindung zur Markenberatung <a href="https://luenstroth.com/de/">Lünstroth</a>, wenn vor der Umsetzung eine Entscheidung fällt.' },
  { q: 'Warum habe ich von der Agentur noch nichts gehört?', a: 'Weil sie auf Empfehlung arbeitet und an keinen Wettbewerben teilnimmt. Viele Arbeiten erscheinen unter dem Namen des Kunden, nicht der Agentur. Diskretion ist Teil des Angebots.' }
];
const EN = [
  { q: 'Is the client protected?', a: 'Yes. The agency holds professional liability insurance with ERGO Versicherung AG. Work is always carried out under a non-disclosure agreement; framework agreements and the requirements of purchasing are agreed before the project starts. All rights to the results pass to the client in full.' },
  { q: 'How does the agency use AI – and is it GDPR-compliant?', a: 'AI is a tool, not a decision-maker: wherever it is involved, a senior decides. Processing takes place internally and in line with the GDPR; client material is not used to train AI models. Details on the <a href="/en/use-of-ai/">use of AI</a> page.' },
  { q: 'What access does the agency have to the cultures of foreign markets?', a: 'Through many years of international mandates – for Hella, Cobiax, Piasten and Warner Hudson, among others – in markets with very different price levels, labelling rules and readings. On top of that comes an ethnological foundation: cultures are not translated, they are understood.' },
  { q: 'How does the agency understand the logic of a foreign market – and why?', a: 'With the method of ethnology: first establish how a culture reads signs, names and promises, then design. Every proposal is checked in advance linguistically, culturally and under trademark and advertising law. That is why nothing has to be withdrawn afterwards.' },
  { q: 'What speaks for Lünstroth over a large network agency?', a: 'Senior attention from the first meeting to the result, short decision paths and experience with groups such as Hella and Mann+Hummel – with no hand-over to a team the client has never met.' },
  { q: 'And over a local agency?', a: 'The ability to work internationally in German and English, a scientific foundation with trademark and advertising law in-house – and the link to the <a href="https://luenstroth.com/en/">Lünstroth</a> brand consultancy when a decision has to be made before implementation.' },
  { q: 'Why have I never heard of the agency?', a: 'Because it works by recommendation and does not take part in pitches. Much of its work appears under the client\'s name, not the agency\'s. Discretion is part of the offer.' }
];
function apply(f, newItems, keepQ) {
  let s = fs.readFileSync(f, 'utf8');
  const m = s.match(/\{% set faq = (\[[^\n]*\]) %\}\{% include "faq\.njk" %\}/);
  if (!m) throw new Error(f + ': FAQ nicht gefunden');
  const old = JSON.parse(m[1]);
  const kept = old.filter(x => keepQ.some(k => x.q.startsWith(k)));
  if (kept.length !== keepQ.length) throw new Error(f + ': behaltene Fragen ' + kept.length);
  const all = newItems.concat(kept);
  s = s.replace(m[0], `{% set faq = ${JSON.stringify(all)} %}{% include "faq.njk" %}`);
  fs.writeFileSync(f, s, 'utf8');
  return all.length;
}
const a = apply('src/vorgehensweise-der-agentur/index.njk', DE, ['Wie arbeiten Sie mit unserer Marketingabteilung', 'Wie kommen Technik, Vertrieb', 'Woran messen wir']);
const b = apply('src/en/approach.njk', EN, ['How do you work with our marketing department', 'How do engineering, sales', 'How do we measure']);
console.log('OK', a, b);
