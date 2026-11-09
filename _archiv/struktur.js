// Leistungsstruktur 09.11.2026: Markenrelaunch, Produkteinführung, Auslandsmärkte; Listung/Website/Rollout raus; Mittelstand nach oben; Branchenseiten.
const fs = require('fs');
const W = {};
const get = f => W[f] ?? fs.readFileSync(f, 'utf8').replace(/\r\n/g, '\n');
function r(f, re, b, cnt = 1) {
  const s = get(f), m = s.match(new RegExp(re.source, 'g')) || [];
  if (m.length !== cnt) throw new Error(`${f}: ${m.length}x statt ${cnt}x ${re}`);
  W[f] = s.replace(new RegExp(re.source, cnt > 1 ? 'g' : ''), b);
}
const esc = s => s.replace(/[.*+?^${}()|[\]\\]/g, '\\$&');
const t = (f, a, b, cnt = 1) => r(f, new RegExp(esc(a)), b, cnt);

// i18n: Footer-Leistungen und Brotkrumen
const I = 'src/_data/i18n.json';
r(I, /\{\s*"url": "\/leistungen\/listungsgespraech-handel\/",[^}]*\},\s*\{\s*"url": "\/leistungen\/website-b2b\/",[^}]*\},/, '{\n          "url": "/leistungen/markenrelaunch/",\n          "label": "Markenrelaunch"\n        },');
r(I, /\{\s*"url": "\/leistungen\/rollout\/",[^}]*\},/, '{\n          "url": "/werbeagentur-automotive/",\n          "label": "Automotive"\n        },\n        {\n          "url": "/werbeagentur-maschinenbau/",\n          "label": "Maschinenbau"\n        },');
r(I, /\{\s*"url": "\/en\/services\/retail-listing\/",[^}]*\},\s*\{\s*"url": "\/en\/services\/b2b-website\/",[^}]*\},/, '{\n          "url": "/en/services/brand-relaunch/",\n          "label": "Brand relaunch"\n        },');
r(I, /\{\s*"url": "\/en\/services\/brand-rollout\/",[^}]*\},/, '{\n          "url": "/en/automotive-advertising-agency/",\n          "label": "Automotive"\n        },\n        {\n          "url": "/en/mechanical-engineering-advertising-agency/",\n          "label": "Mechanical engineering"\n        },');
t(I, '"werbeagentur-fuer-den-mittelstand": "Mittelstand",', '"werbeagentur-fuer-den-mittelstand": "Mittelstand",\n      "werbeagentur-automotive": "Automotive",\n      "werbeagentur-maschinenbau": "Maschinenbau",');
t(I, '"mid-sized-companies": "Mid-sized companies",', '"mid-sized-companies": "Mid-sized companies",\n      "automotive-advertising-agency": "Automotive",\n      "mechanical-engineering-advertising-agency": "Mechanical engineering",');

// Leistungsübersicht
const L = 'src/leistungen/index.njk', LE = 'src/en/services/index.njk';
t(L, 'description: "Listungsgespräch, Website, Produkteinführung, Auslandsmärkte, Rollout: Anlässe, zu denen Industrie und Markenartikler Lünstroth holen."', 'description: "Markenrelaunch nach Übernahme oder Generationswechsel, Produkteinführung, Auslandsmärkte: die Anlässe, zu denen Industrie und Markenartikler Lünstroth holen."');
t(L, 'label: "Leistungen der Werbeagentur: sechs Anlässe"', 'label: "Leistungen der Werbeagentur: drei Anlässe"');
t(L, 'sub: "Listungsgespräch, Produkteinführung, Auslandsmarkt, neuer Auftritt:', 'sub: "Markenrelaunch, Produkteinführung, Auslandsmarkt:');
r(LE, /description: "Retail listing, website, product launch, international markets, rollout: occasions for which companies bring in L.nstroth\."/, 'description: "Brand relaunch after an acquisition or generational change, product launch, international markets: the occasions for which industry and branded goods companies bring in Lünstroth."');
t(LE, 'label: "Advertising agency services: six occasions"', 'label: "Advertising agency services: three occasions"');
t(LE, 'sub: "Retail listing, product launch, a new market, new brand presence:', 'sub: "Brand relaunch, product launch, a new market:');

// Reihenfolge und Bühnen der verbleibenden Anlässe
for (const f of ['src/leistungen/produkteinfuehrung.njk', 'src/en/services/product-launch.njk']) r(f, /anlassOrder: \d+/, 'anlassOrder: 2');
for (const f of ['src/leistungen/auslandsmaerkte.njk', 'src/en/services/international-markets.njk']) r(f, /anlassOrder: \d+/, 'anlassOrder: 3');
t('src/leistungen/auslandsmaerkte.njk', 'text: "Grenzenlos verständlich"', 'text: "Richtig gelesen"');
r('src/en/services/international-markets.njk', /text: "[^"]*",(\s*effect: "cross")/, 'text: "Read as intended",$1');

// Startseite und llms: Anlässe
t('src/index.njk', 'Verpackung, B2B-Website, Produkteinführung, Auslandsmärkte, Rollout.', 'Markenrelaunch, Produkteinführung, Auslandsmärkte.');
t('src/en/index.njk', 'packaging, B2B website, product launch, international markets, rollout.', 'brand relaunch, product launch, international markets.');
for (const f of ['src/llms.njk', 'src/llms-full.njk'])
  t(f, 'Anlässe sind zum Beispiel: Verpackung fürs Listungsgespräch, B2B-Website, Produkteinführung, Material für Auslandsmärkte, Rollout eines neuen Auftritts.', 'Anlässe sind: Markenrelaunch nach Übernahme, Fusion oder Generationswechsel; Produkteinführung; Auslandsmärkte. Branchenschwerpunkte: Automotive und Maschinenbau.');

// Mittelstand: Inhalt nach oben ausrichten
const M = 'src/werbeagentur-fuer-den-mittelstand/index.njk', ME = 'src/en/mid-sized-companies.njk';
t(M, 'Werbeagentur für den Mittelstand – mit Branchenkenntnis', 'Werbeagentur für den Mittelstand: inhabergeführt, international, oft Weltmarktführer', 2);
t(M, 'Übernahme, Generationswechsel, Export: Wie Mittelständler aus Maschinenbau, Automotive und Bau ihre Marke neu aufstellen. Sechs reale Beispiele.', 'Für inhabergeführte Unternehmen, die international arbeiten und in ihrer Nische oft Weltmarktführer sind: Übernahme, Generationswechsel, Export. Sechs reale Beispiele.', 2);
r(M, /text: "Mittelstand verstanden",\n  effect: "settle",\n  label: "Werbeagentur für den Mittelstand",/, 'text: "Weltmarktführer",\n  effect: "settle",\n  label: "Werbeagentur für den Mittelstand",\n  sub: "Inhabergeführt, international, in der eigenen Nische oft an der Spitze – und nach außen bescheidener, als es die eigene Bedeutung rechtfertigt.",');
r(M, /(Märkte-Know-how\.<\/p>\n<\/section>\n)/, `$1
<section class="container" style="padding-block:1rem 3rem;max-width:760px;">
  <h2 class="display-md reveal" style="margin-bottom:1.5rem;">Mittelstand im deutschen Sinn</h2>
  <p class="body-lg reveal" style="margin-bottom:1.5rem;">Gemeint ist nicht die Größenklasse einer Statistik, sondern ein Unternehmenstyp: inhabergeführt oder in Familienhand, international tätig, oft mit dreistelligen Millionenumsätzen – und in der eigenen Nische nicht selten Weltmarktführer. Entscheidungen fallen dort kurz und auf Ebene der Geschäftsführung oder der Inhaberfamilie.</p>
  <p class="body-lg reveal reveal-delay-1" style="margin-bottom:1.5rem;">Genau dort setzt die Agentur an: bei Anlässen, die die Geschäftsführung selbst entscheidet – einem <a href="/leistungen/markenrelaunch/">Markenrelaunch</a> nach Übernahme oder Generationswechsel, einer <a href="/leistungen/produkteinfuehrung/">Produkteinführung</a>, dem Schritt in <a href="/leistungen/auslandsmaerkte/">neue Märkte</a>. Schwerpunkte liegen in <a href="/werbeagentur-automotive/">Automotive</a> und <a href="/werbeagentur-maschinenbau/">Maschinenbau</a>.</p>
</section>
`);
t(M, 'Corporate Design, Website, Verpackung, Vertriebsunterlagen, Video.', 'Corporate Design, Website, Vertriebsunterlagen, Video.');
r(ME, /Advertising agency for mid-sized companies – with industry knowledge/, 'Advertising agency for the German Mittelstand: owner-managed, international, often world market leaders', 2);
r(ME, /description: "[^"]*"/, 'description: "For owner-managed companies that work internationally and are often world market leaders in their niche: acquisition, generational change, export. Six real examples."');
r(ME, /text: "Mid-sized, understood",\n  effect: "settle",\n  label: "Advertising agency for mid-sized companies",/, 'text: "World market leaders",\n  effect: "settle",\n  label: "Advertising agency for mid-sized companies",\n  sub: "Owner-managed, international, often at the top of their own niche – and more modest in public than their importance would justify.",');
r(ME, /(Market know-how\.<\/p>\n<\/section>\n)/, `$1
<section class="container" style="padding-block:1rem 3rem;max-width:760px;">
  <h2 class="display-md reveal" style="margin-bottom:1.5rem;">Mittelstand in the German sense</h2>
  <p class="body-lg reveal" style="margin-bottom:1.5rem;">What is meant is not a size class in a statistic but a type of company: owner-managed or family-owned, active internationally, often with revenues in the hundreds of millions – and not infrequently world market leader in its own niche. Decisions there are made quickly and at the level of management or the owning family.</p>
  <p class="body-lg reveal reveal-delay-1" style="margin-bottom:1.5rem;">That is exactly where the agency comes in: with occasions that management decides itself – a <a href="/en/services/brand-relaunch/">brand relaunch</a> after an acquisition or generational change, a <a href="/en/services/product-launch/">product launch</a>, the step into <a href="/en/services/international-markets/">new markets</a>. The focus is on <a href="/en/automotive-advertising-agency/">automotive</a> and <a href="/en/mechanical-engineering-advertising-agency/">mechanical engineering</a>.</p>
</section>
`);
t(ME, 'corporate design, website, packaging, sales collateral, video.', 'corporate design, website, sales collateral, video.');

// Hella: keine Private Labels nennen
t('src/case-studies/hella.njk', '; Private Labels für Absatzkanäle, die eine eigene Marktidentität benötigen.', '.');
t('src/en/case-studies/hella.njk', '; private labels for sales channels that need their own market identity.', '.');

// Weiterleitungen
r('src/.htaccess', /(RewriteRule \^en\/case-studies\/kuehlmann\/\?\$ \/en\/case-studies\/ \[R=301,L\])/, `$1
# Leistungsstruktur 09.11.2026: Website und Rollout im Markenrelaunch, Listung entfällt
RewriteRule ^leistungen/website-b2b/?$ /leistungen/markenrelaunch/ [R=301,L]
RewriteRule ^leistungen/rollout/?$ /leistungen/markenrelaunch/ [R=301,L]
RewriteRule ^leistungen/listungsgespraech-handel/?$ /leistungen/ [R=301,L]
RewriteRule ^en/services/b2b-website/?$ /en/services/brand-relaunch/ [R=301,L]
RewriteRule ^en/services/brand-rollout/?$ /en/services/brand-relaunch/ [R=301,L]
RewriteRule ^en/services/retail-listing/?$ /en/services/ [R=301,L]`);

for (const [f, s] of Object.entries(W)) fs.writeFileSync(f, s, 'utf8');
fs.mkdirSync('_archiv/leistungen-alt', { recursive: true });
for (const [a, b] of [['src/leistungen/listungsgespraech-handel.njk', 'listungsgespraech-handel.njk'], ['src/leistungen/website-b2b.njk', 'website-b2b.njk'], ['src/leistungen/rollout.njk', 'rollout.njk'], ['src/en/services/retail-listing.njk', 'retail-listing-en.njk'], ['src/en/services/b2b-website.njk', 'b2b-website-en.njk'], ['src/en/services/brand-rollout.njk', 'brand-rollout-en.njk']])
  fs.renameSync(a, '_archiv/leistungen-alt/' + b);
console.log('OK', Object.keys(W).length, 'Dateien');
