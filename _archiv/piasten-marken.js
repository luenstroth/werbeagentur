const fs=require('fs');const W={};const get=f=>W[f]??fs.readFileSync(f,'utf8');
function repRe(f,re,b){const s=get(f),m=s.match(new RegExp(re.source,'g'))||[];if(m.length!==1)throw new Error(f+': '+m.length+'x '+re);W[f]=s.replace(re,b);}
function rep(f,a,b){const s=get(f),n=s.split(a).length-1;if(n!==1)throw new Error(f+': '+n+'x '+a.slice(0,50));W[f]=s.replace(a,b);}
const d='src/case-studies/piasten.njk',e='src/en/case-studies/piasten.njk';
rep(d,'Warner Hudson: Sortimentsmarke mit mehreren Produktlinien','Warner Hudson: eigenständige Marke mit mehreren Produktlinien');
rep(d,'Warner Hudson ist als Sortimentsmarke angelegt und wurde auf internationalen Märkten eingeführt.','Warner Hudson ist eine eigenständige Marke, produziert von Piasten, und wurde auf internationalen Märkten eingeführt.');
rep(d,'Eigenmarke von Piasten im Regal','Big Ben: Produktmarke unter der Dachmarke Piasten');
repRe(d,/alt="Big Ben . Dragee-Sortiment von Piasten"/,'alt="Big Ben – Dragee-Sortiment, Produktmarke unter der Dachmarke Piasten"');
rep(e,'Warner Hudson: a range brand with several product lines','Warner Hudson: an independent brand with several product lines');
rep(e,'Warner Hudson is set up as a range brand and was launched in international markets.','Warner Hudson is an independent brand, produced by Piasten, and was launched in international markets.');
rep(e,'A Piasten own brand on the shelf','Big Ben: a product brand under the Piasten umbrella brand');
repRe(e,/alt="Big Ben . Piasten drag.e assortment"/,'alt="Big Ben – dragée assortment, a product brand under the Piasten umbrella brand"');
rep('src/leistungen/produkteinfuehrung.njk','Eine Sortimentsmarke, auf internationalen Märkten eingeführt:','Eine eigenständige Marke, auf internationalen Märkten eingeführt:');
rep('src/en/services/product-launch.njk','A range brand launched in international markets:','An independent brand launched in international markets:');
for(const[f,s]of Object.entries(W))fs.writeFileSync(f,s,'utf8');console.log('OK',Object.keys(W).length);
