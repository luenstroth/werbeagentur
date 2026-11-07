const fs = require('fs');
for (const f of ['_site/case-studies/meco/index.html', '_site/en/case-studies/hella/index.html', '_site/index.html']) {
  const h = fs.readFileSync(f, 'utf8');
  for (const m of h.matchAll(/ld\+json">([\s\S]*?)<\/script>/g)) {
    const j = JSON.parse(m[1]);
    if (j['@type'] === 'Article' || Array.isArray(j['@type'])) console.log(f, JSON.stringify(j).slice(0, 700));
  }
}
const full = fs.readFileSync('_site/llms-full.txt', 'utf8');
console.log('llms-full:', full.length, 'Zeichen,', (full.match(/^## /gm) || []).length, 'Seiten, Script-Reste:', /function|querySelector/.test(full));
console.log('llms:', (fs.readFileSync('_site/llms.txt', 'utf8').match(/^- \[/gm) || []).length, 'Einträge');
