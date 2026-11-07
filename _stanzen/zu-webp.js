// Freisteller-PNGs nach WebP mit Alphakanal, direkt nach src/img/food/
const sharp = require('F:/24/company/webs/agency/luenstroth-werbeagentur/node_modules/sharp');
const fs = require('fs'), path = require('path');

const SRC = 'F:/24/company/webs/agency/luenstroth-werbeagentur/_stanzen';
const DST = 'F:/24/company/webs/agency/luenstroth-werbeagentur/src/img/food';

const map = {
  'Eiersalat': 'eiersalat',
  'Fleischsalat': 'fleischsalat',
  'Geflügelsalat': 'gefluegelsalat',
  'Kartoffelsalat': 'kartoffelsalat',
  'Krabbencocktail': 'krabbencocktail',
  'Nudelsalat': 'nudelsalat',
  'Thunfischsalat': 'thunfischsalat',
  'Tzatziki': 'tzatziki',
};

(async () => {
  for (const [de, slug] of Object.entries(map)) {
    const inp = path.join(SRC, de + '-frei.png');
    if (!fs.existsSync(inp)) { console.log('FEHLT: ' + inp); continue; }
    const out = path.join(DST, 'delikato-' + slug + '-frei.webp');
    const info = await sharp(inp).webp({ quality: 88, alphaQuality: 100 }).toFile(out);
    const before = fs.statSync(inp).size;
    console.log(
      slug.padEnd(16) + info.width + 'x' + info.height +
      '  ' + Math.round(before / 1024) + ' KB PNG -> ' + Math.round(info.size / 1024) + ' KB WebP'
    );
  }
})();
