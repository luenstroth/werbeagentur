// Strukturierte Daten, llms.txt, Plaintext-Filter. Bricht ohne Schreiben ab, wenn Zählungen nicht passen.
const fs = require('fs'), path = require('path');
const R = process.cwd();
const writes = [];
function rep(file, re, by, n) {
  const p = path.join(R, file); let s = writes.find(w => w[0] === p)?.[1] ?? fs.readFileSync(p, 'utf8');
  const m = s.match(new RegExp(re.source, re.flags.includes('g') ? re.flags : re.flags + 'g')) || [];
  if (m.length !== n) throw new Error(`${file}: ${m.length} Treffer statt ${n} für ${re}`);
  s = s.replace(re, by);
  const i = writes.findIndex(w => w[0] === p); if (i >= 0) writes[i][1] = s; else writes.push([p, s]);
}

// A. Plaintext-Filter
rep('.eleventy.js', /(\n[ \t]*)eleventyConfig\.addFilter\("sprachpaar"/, `$1eleventyConfig.addFilter("plaintext", (html = "") => String(html)
    .replace(/<(script|style|svg|noscript)[\\s\\S]*?<\\/\\1>/gi, "")
    .replace(/<\\/(p|h[1-6]|li|div|section|figcaption|blockquote|tr|header)>/gi, "\\n")
    .replace(/<br\\s*\\/?>/gi, "\\n").replace(/<[^>]+>/g, "")
    .replace(/&nbsp;/g, " ").replace(/&amp;/g, "&").replace(/&quot;/g, '"').replace(/&#39;/g, "'").replace(/&lt;/g, "<").replace(/&gt;/g, ">")
    .replace(/[ \\t]+/g, " ").replace(/ *\\n */g, "\\n").replace(/\\n{3,}/g, "\\n\\n").trim());$1eleventyConfig.addFilter("sprachpaar"`, 1);

// B. base.njk: Article aus Front Matter; Organisation zusätzlich als ProfessionalService
const article = `  {% if tags and ("caseStudy" in tags or "caseStudyEn" in tags) %}
  <script type="application/ld+json">{{ {"@context": "https://schema.org", "@type": "Article", "headline": title, "description": description, "inLanguage": lang, "url": "https://luenstroth-werbeagentur.de" + page.url, "mainEntityOfPage": "https://luenstroth-werbeagentur.de" + page.url, "image": "https://luenstroth-werbeagentur.de/" + heroImage, "dateModified": page.date.toISOString(), "author": {"@id": "https://luenstroth-werbeagentur.de/#organisation"}, "publisher": {"@id": "https://luenstroth-werbeagentur.de/#organisation"}, "about": {"@type": "Organization", "name": client}} | dump | safe }}</script>
  {% endif %}
`;
rep('src/_layouts/base.njk', /( *)\{% if pageSchema %\}/, article + '$1{% if pageSchema %}', 1);
rep('src/_layouts/base.njk', /"@type": "Organization",(\r?\n\s*)"@id": "https:\/\/luenstroth-werbeagentur\.de\/#organisation",/,
  '"@type": ["Organization", "ProfessionalService"],$1"@id": "https://luenstroth-werbeagentur.de/#organisation",$1"image": "https://luenstroth-werbeagentur.de/img/hero-endkontrolle.jpg",', 1);

// C. Case Studies: pageSchema raus, client rein
let cs = 0;
for (const d of ['src/case-studies', 'src/en/case-studies']) for (const f of fs.readdirSync(path.join(R, d))) {
  if (!f.endsWith('.njk') || f === 'index.njk') continue;
  const rel = d + '/' + f; const s = fs.readFileSync(path.join(R, rel), 'utf8');
  const m = s.match(/\npageSchema: \|\r?\n[\s\S]*?"about":\s*\{\s*"@type":\s*"Organization",\s*"name":\s*"([^"]+)"[\s\S]*?(?=\r?\n---)/);
  if (!m) throw new Error('kein pageSchema/about in ' + rel);
  writes.push([path.join(R, rel), s.replace(m[0], '\nclient: ' + JSON.stringify(m[1]))]); cs++;
}
if (cs !== 26) throw new Error(cs + ' Case Studies statt 26');

// D. llms.txt / llms-full.txt
const liste = (cond) => `{%- for p in collections.all | sort(false, true, "url") %}{% if not p.data.noSitemap and p.url and p.url.endsWith("/") and ${cond} %}
- [{{ p.data.title }}](https://luenstroth-werbeagentur.de{{ p.url }}): {{ p.data.description }}
{%- endif %}{% endfor %}`;
const kopf = `# Lünstroth Werbeagentur

> Werbeagentur der Lünstroth GmbH in Bielefeld, seit 1994. Für Industrie, Handel und Markenartikler, national und international. Sechs Anlässe: Verpackung fürs Listungsgespräch, B2B-Website, Produkteinführung, Messe, Material für Auslandsmärkte, Rollout eines neuen Auftritts. Deutsch und Englisch. Markenstrategie, Naming, Positionierung und Markenarchitektur übernimmt die Schwestermarke Lünstroth (https://luenstroth.com).

Kontakt: Friedrichstraße 18, 33615 Bielefeld, Deutschland · +49 521 448122710 · kontakt@luenstroth-werbeagentur.de
`;
writes.push([path.join(R, 'src/llms.njk'), `---
permalink: /llms.txt
eleventyExcludeFromCollections: true
---
${kopf}Volltext aller Seiten: https://luenstroth-werbeagentur.de/llms-full.txt

## Deutsch
${liste('not p.url.startsWith("/en/")')}

## English
${liste('p.url.startsWith("/en/")')}
`]);
writes.push([path.join(R, 'src/llms-full.njk'), `---
permalink: /llms-full.txt
eleventyExcludeFromCollections: true
---
${kopf}
{%- for p in collections.all | sort(false, true, "url") %}{% if not p.data.noSitemap and p.url and p.url.endsWith("/") %}

---

## {{ p.data.title }}
URL: https://luenstroth-werbeagentur.de{{ p.url }}

{{ p.content | plaintext | safe }}
{%- endif %}{% endfor %}
`]);

for (const [p, s] of writes) fs.writeFileSync(p, s, 'utf8');
console.log('OK:', writes.length, 'Dateien geschrieben,', cs, 'Case Studies');
