// Fügt Fragen und Antworten auf Agentur- und Arbeitsweise-Seite ein (DE/EN). Bricht ohne Schreiben ab bei Fehlern.
const fs = require('fs');
const AGENTUR_DE = [
  { q: 'Wer arbeitet an unserem Projekt?', a: 'Ausschließlich Seniors – wie bei der Markenberatung <a href="https://luenstroth.com/de/">Lünstroth</a>. Keine tiefen Hierarchien, sondern Profis auf drei Ebenen, jede mit einer zweiten Senior-Person als Vertretung. Wer im ersten Gespräch sitzt, arbeitet auch am Projekt.' },
  { q: 'Haben Sie Erfahrung mit Unternehmen unserer Größe?', a: 'Seit 1994 arbeiten wir für Industrie, Handel und Markenartikler – für internationale Zulieferer wie Hella, Weltmarktführer wie Gneuss, für Banken, Versorger und einen Bundesligaverein. Komplexität heißt bei unseren Kunden: mehrere Marken, mehrere Länder, mehrere Entscheider. Die <a href="/case-studies/">Case Studies</a> zeigen, wie das jeweils gelöst wurde.' },
  { q: 'Warum keine große Netzwerkagentur?', a: 'Weil bei uns die Leute, die das Konzept verantworten, auch mit Ihrer Geschäftsführung sprechen – ohne Übergabe an ein Team, das Sie nie kennengelernt haben. International arbeiten wir auf Deutsch und Englisch und stimmen uns direkt mit Ihren Ländergesellschaften ab.' },
  { q: 'Arbeiten Sie mit Rahmenvertrag?', a: 'Ja. Wir arbeiten projektweise oder auf Basis eines Rahmenvertrags. Die Anforderungen Ihres Einkaufs stimmen wir vor Projektbeginn ab.' },
  { q: 'Wie ist die Haftung abgesichert?', a: 'Über eine Berufshaftpflichtversicherung bei der ERGO Versicherung AG, ERGO-Platz 1, 40477 Düsseldorf.' }
];
const AGENTUR_EN = [
  { q: 'Who works on our project?', a: 'Seniors only – as at the <a href="https://luenstroth.com/en/">Lünstroth</a> brand consultancy. No deep hierarchies, but professionals on three levels, each with a second senior person as backup. Whoever sits in the first meeting also works on the project.' },
  { q: 'Do you have experience with companies of our size?', a: 'Since 1994 we have worked for industry, retail and branded goods – for international suppliers such as Hella, world market leaders such as Gneuss, for banks, utilities and a Bundesliga football club. For our clients, complexity means several brands, several countries, several decision-makers. The <a href="/en/case-studies/">case studies</a> show how each was solved.' },
  { q: 'Why not a large network agency?', a: 'Because with us the people responsible for the concept are the ones who talk to your management – with no hand-over to a team you have never met. Internationally we work in German and English and coordinate directly with your national subsidiaries.' },
  { q: 'Do you work under framework agreements?', a: 'Yes. We work on a project basis or under a framework agreement. We agree the requirements of your purchasing department before the project starts.' },
  { q: 'How is liability covered?', a: 'By professional liability insurance with ERGO Versicherung AG, ERGO-Platz 1, 40477 Düsseldorf, Germany.' }
];
const WEG_DE = [
  { q: 'Wie arbeiten Sie mit unserer Marketingabteilung, unseren Ländergesellschaften und bestehenden Agenturen zusammen?', a: 'Das Konzept ist die einzige verbindliche Quelle. Es legt fest, was gesagt wird und warum – so genau, dass Ihr Team, Ihre Ländergesellschaften und andere Dienstleister danach umsetzen können. Wir müssen nicht alles selbst machen; wir sorgen dafür, dass alles zusammenpasst.' },
  { q: 'Wie kommen Technik, Vertrieb und Geschäftsführung zu einer gemeinsamen Entscheidung?', a: 'Wir beginnen beim Moment, in dem Ihr Kunde entscheidet, und arbeiten von dort zurück. Bewertet wird nicht, ob ein Entwurf gefällt, sondern ob er an dieser Stelle geglaubt wird. Das gibt allen Beteiligten denselben Maßstab – und verhindert den Kompromiss, der niemanden überzeugt.' },
  { q: 'Woran messen wir den Erfolg?', a: 'Die Kennzahlen legen Sie fest – sie hängen an Ihren Zielen, nicht an unseren. Wir machen Vorschläge, welche Größen zum jeweiligen Anlass passen, etwa für eine Listung, einen Messeauftritt oder einen Website-Relaunch.' },
  { q: 'Setzen Sie KI ein – und was passiert mit unseren Daten?', a: 'Ja, als Werkzeug. Die Verarbeitung erfolgt intern und nach DSGVO. Kundenmaterial wird nicht zum Training von KI-Modellen verwendet. Einzelheiten auf der Seite <a href="/ki-einsatz/">KI-Einsatz</a>.' },
  { q: 'Wem gehören die Rechte an den Ergebnissen?', a: 'Ihnen. Sämtliche Rechte an den erarbeiteten Ergebnissen gehen vollständig auf Sie über – auch dort, wo KI unterstützend eingesetzt wurde.' }
];
const WEG_EN = [
  { q: 'How do you work with our marketing department, national subsidiaries and existing agencies?', a: 'The concept is the single binding source. It sets out what is said and why – precisely enough for your team, your subsidiaries and other service providers to implement it. We do not have to do everything ourselves; we make sure everything fits together.' },
  { q: 'How do engineering, sales and management reach a shared decision?', a: 'We start at the moment your customer decides and work back from there. The test is not whether a draft is liked but whether it is believed at that point. That gives everyone involved the same yardstick – and prevents the compromise that convinces no one.' },
  { q: 'How do we measure success?', a: 'You define the KPIs – they follow your goals, not ours. We suggest which measures suit the occasion, for example a retail listing, a trade fair or a website relaunch.' },
  { q: 'Do you use AI – and what happens to our data?', a: 'Yes, as a tool. Processing takes place internally and in line with the GDPR. Client material is not used to train AI models. Details on the <a href="/en/use-of-ai/">use of AI</a> page.' },
  { q: 'Who owns the rights to the results?', a: 'You do. All rights to the results pass to you in full – including where AI was used in support.' }
];
const block = (d) => `{% set faq = ${JSON.stringify(d)} %}{% include "faq.njk" %}\n`;
const W = [];
function append(f, d) { const s = fs.readFileSync(f, 'utf8'); if (s.includes('faq.njk')) throw new Error(f + ' hat schon FAQ'); W.push([f, s.replace(/\s*$/, '\n\n') + block(d)]); }
function before(f, marker, d) {
  const s = fs.readFileSync(f, 'utf8'); const n = s.split(marker).length - 1;
  if (n !== 1) throw new Error(f + ': Marker ' + n + 'x'); if (s.includes('faq.njk')) throw new Error(f + ' hat schon FAQ');
  W.push([f, s.replace(marker, block(d) + '\n' + marker)]);
}
append('src/agentur/index.njk', AGENTUR_DE);
append('src/en/agency.njk', AGENTUR_EN);
const M = '<section class="container measure" style="padding-block:1rem 7rem;">';
before('src/vorgehensweise-der-agentur/index.njk', M, WEG_DE);
before('src/en/approach.njk', M, WEG_EN);
const css = 'src/css/main.css', c = fs.readFileSync(css, 'utf8');
if (!c.includes('.faq-item')) W.push([css, c + `
/* Fragen und Antworten */
.faq-item{border-top:1px solid var(--line, rgba(0,0,0,.15))}
.faq-item:last-of-type{border-bottom:1px solid var(--line, rgba(0,0,0,.15))}
.faq-item summary{cursor:pointer;list-style:none;padding:1.1rem 2rem 1.1rem 0;position:relative;font-weight:600;line-height:1.4}
.faq-item summary::-webkit-details-marker{display:none}
.faq-item summary::after{content:"+";position:absolute;right:.25rem;top:1rem;font-weight:400;font-size:1.25rem;color:var(--accent)}
.faq-item[open] summary::after{content:"–"}
.faq-answer{padding:0 0 1.25rem;line-height:1.75}
.faq-answer a{color:inherit;text-decoration:underline;text-underline-offset:3px}
`]);
for (const [f, s] of W) fs.writeFileSync(f, s, 'utf8');
console.log('OK', W.length, 'Dateien');
