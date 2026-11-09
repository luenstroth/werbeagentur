const fs=require('fs');const W={};const get=f=>W[f]??fs.readFileSync(f,'utf8').replace(/\r\n/g,'\n');
function r(f,re,b,cnt=1){const s=get(f),m=s.match(new RegExp(re.source,'g'))||[];if(m.length!==cnt)throw new Error(f+': '+m.length+'x '+re);W[f]=s.replace(new RegExp(re.source,cnt>1?'g':''),b);}
for(const[f,p]of[['src/index.njk',''],['src/en/index.njk','/en']]){
 r(f,new RegExp(`\\n    <a href="${p}/case-studies/kuehlmann/" class="wandel-tile[^]*?</a>`),'');
 r(f,/<a href="([^"]*\/case-studies\/gneuss\/)" class="wandel-tile wandel-tile--4 reveal">(\s*<div class="wandel-img">\{% respImage "[^"]*", "[^"]*", )"\(min-width: 860px\) 33vw, 100vw"/,'<a href="$1" class="wandel-tile wandel-tile--5 reveal">$2"(min-width: 860px) 42vw, 100vw"');
 r(f,/<a href="([^"]*\/case-studies\/hella\/)" class="wandel-tile wandel-tile--4 reveal">(\s*<div class="wandel-img">\{% respImage "[^"]*", "[^"]*", )"\(min-width: 860px\) 33vw, 100vw"/,'<a href="$1" class="wandel-tile wandel-tile--7 reveal">$2"(min-width: 860px) 58vw, 100vw"');
 r(f,new RegExp(`<a href="${p}/case-studies/kuehlmann/">Kühlmann</a> · `),'');
 r(f,/\n\s*\{f:"Kuehlmann\.svg"[^\n]*/,'');}
r('src/index.njk',/Dreizehn/,'Zwölf',2);r('src/index.njk',/dreizehn Mandate/,'zwölf Mandate');r('src/index.njk',/dreizehn unterschiedliche/,'zwölf unterschiedliche');
r('src/en/index.njk',/Thirteen/,'Twelve');r('src/en/index.njk',/thirteen/,'twelve',3);
r('src/case-studies/index.njk',/\n    <a href="\/case-studies\/kuehlmann\/" class="case-card[^]*?<\/a>\n/,'');
r('src/case-studies/index.njk',/13 /,'12 ',2);r('src/case-studies/index.njk',/Dreizehn echte Fragen, dreizehn/,'Zwölf echte Fragen, zwölf');
r('src/en/case-studies/index.njk',/\n\s*\{u:"kuehlmann"[^\n]*/,'');
r('src/en/case-studies/index.njk',/13 /,'12 ',2);r('src/en/case-studies/index.njk',/Thirteen real questions, thirteen/,'Twelve real questions, twelve');
for(const[f,p,h0,h1]of[['src/leistungen/listungsgespraech-handel.njk','','Drei Sortimente, drei verschiedene Ausgangslagen','Zwei Sortimente, zwei verschiedene Ausgangslagen'],['src/en/services/retail-listing.njk','/en','Three ranges, three different starting points','Two ranges, two different starting points']]){
 r(f,new RegExp(`\\n    <a href="${p}/case-studies/kuehlmann/" class="card[^]*?</a>`),'');
 r(f,new RegExp(h0+'</h2>\\n  <div class="grid-3"'),h1+'</h2>\n  <div class="grid-2"');
 r(f,/<div class="card-num">B<\/div>(\s*<h3 class="card-title">Piasten)/,'<div class="card-num">A</div>$1');
 r(f,/<div class="card-num">C<\/div>(\s*<h3 class="card-title">Albatros)/,'<div class="card-num">B</div>$1');}
r('src/vorgehensweise-der-agentur/index.njk',/Bei der Salatlinie Delikato steht der Fettgehalt sortenweise auf der Packung . auch dort, wo die Zahl weniger schmeichelhaft ausfällt\./,'Gehört eine Kennzahl zum Versprechen, steht sie überall – auch dort, wo sie weniger schmeichelhaft ausfällt.');
r('src/en/approach.njk',/On the Delikato salad range, the fat content is printed on the pack variety by variety . even where the figure is less flattering\./,'Where a figure is part of the promise, it appears everywhere – even where it is less flattering.');
r('src/.htaccess',/(RewriteRule \^leistungen\/messeauftritt\/\?\$ \/leistungen\/ \[R=301,L\])/,'$1\n# Case Study Kühlmann entfernt (09.11.2026)\nRewriteRule ^case-studies/kuehlmann/?$ /case-studies/ [R=301,L]\nRewriteRule ^en/case-studies/kuehlmann/?$ /en/case-studies/ [R=301,L]');
for(const[f,s]of Object.entries(W))fs.writeFileSync(f,s,'utf8');
fs.mkdirSync('_archiv/case-studies-alt',{recursive:true});
fs.renameSync('src/case-studies/kuehlmann.njk','_archiv/case-studies-alt/kuehlmann.njk');fs.renameSync('src/en/case-studies/kuehlmann.njk','_archiv/case-studies-alt/kuehlmann-en.njk');
console.log('OK',Object.keys(W).length);
