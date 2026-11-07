// Titel Startseite mit Bielefeld, zu lange Beschreibungen kürzen. Bricht ohne Schreiben ab bei Fehlern.
const fs = require('fs'), path = require('path');
const D = {
  'en/index.njk': 'Indispensable, not interchangeable: Lünstroth gives industrial companies and brand manufacturers arguments against price pressure – for every decision-maker.',
  'en/contact.njk': 'Start a project with the Lünstroth Advertising Agency: packaging, website, product launch, trade fair, rollout. Bielefeld, Germany – working internationally.',
  'en/services/index.njk': 'Retail listing, website, product launch, trade fair, international markets, rollout: six occasions for which companies bring in Lünstroth.',
  'en/services/b2b-website.njk': 'The business has changed, the website still tells the old story. Website relaunch for industry and mid-sized companies – for engineers, buyers and AI.',
  'en/services/brand-rollout.njk': 'New name, new logo – decided. Now it has to arrive on signs, vehicles, website, forms and presentations. Corporate design rollout for mid-sized companies.',
  'en/services/international-markets.njk': 'Packaging, video and sales material for several countries: more than translation – different prices, labelling rules and trademark law.',
  'en/services/product-launch.njk': 'A new product has to convince engineers, buyers, retail and end customers – each for a different reason. Launch communication for industry and brands.',
  'en/services/retail-listing.njk': 'First the buyer decides on the listing, then the shopper decides in seconds at the shelf. Packaging and sell-in material for brands and retailer brands.',
  'en/services/trade-fair.njk': 'Invitation, stand, conversation, follow-up: trade fair communication that does not end at the aisle. For industry, branded goods and fashion.',
  'leistungen/index.njk': 'Listungsgespräch, Website, Produkteinführung, Messe, Auslandsmärkte, Rollout: sechs Anlässe, zu denen Industrie und Markenartikler Lünstroth holen.',
  'leistungen/listungsgespraech-handel.njk': 'Erst entscheidet der Einkäufer über die Listung, dann der Kunde in Sekunden am Regal. Verpackung und Sell-in-Unterlagen für Hersteller und Handelsmarken.',
  'leistungen/messeauftritt.njk': 'Einladung, Stand, Gespräch, Nachfassen: Messekommunikation, die nicht am Gang endet. Für Industrie, Markenartikel und Mode, mit Video aus einer Hand.',
  'leistungen/produkteinfuehrung.njk': 'Ein neues Produkt muss Ingenieur, Einkauf, Handel und Endkunden überzeugen – jeden aus einem anderen Grund. Launch-Kommunikation für Industrie und Marken.',
  'leistungen/rollout.njk': 'Neuer Name, neues Logo – entschieden. Jetzt muss es auf Schild, Fahrzeug, Website, Formular und Präsentation ankommen. Corporate-Design-Rollout im Mittelstand.',
  'en/case-studies/cobiax.njk': 'The old claim addressed only structural engineers. New brand direction, the claim “wider scopes” and a logo relaunch for the international construction market.',
  'en/case-studies/meisterhaft-zdb.njk': '“Meisterhaft” (masterly) describes the service exactly and is hardly protectable as a word mark. How it became a registrable quality seal for construction.'
};
const W = [];
for (const [f, d] of Object.entries(D)) {
  if (d.length > 160) throw new Error(f + ': ' + d.length + ' Zeichen');
  const p = path.join('src', f), s = fs.readFileSync(p, 'utf8');
  const m = s.match(/^description: .*$/gm) || [];
  if (m.length !== 1) throw new Error(f + ': ' + m.length + ' description-Zeilen');
  W.push([p, s.replace(m[0], 'description: ' + JSON.stringify(d))]);
}
// Startseite: nur der <title> bekommt den Ort; H1 bleibt
const pi = path.join('src', 'index.njk'); let s = fs.readFileSync(pi, 'utf8');
const t = s.match(/^title: .*$/gm) || []; if (t.length !== 1) throw new Error('index title');
const usesTitleInBody = /\{\{\s*title\s*\}\}/.test(s.split(/\n---/)[1] || '');
s = s.replace(t[0], 'title: "Werbeagentur Bielefeld: Industrie, Handel, Markenartikler"');
W.push([pi, s]);
for (const [p, c] of W) fs.writeFileSync(p, c, 'utf8');
console.log('OK', W.length, 'Dateien; H1 nutzt {{ title }}:', usesTitleInBody);
