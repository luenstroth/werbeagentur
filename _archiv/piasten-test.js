const fs=require('fs');const W={};const get=f=>W[f]??fs.readFileSync(f,'utf8').replace(/\r\n/g,'\n');
function r(f,re,b){const s=get(f),m=s.match(new RegExp(re.source,'g'))||[];if(m.length!==1)throw new Error(f+': '+m.length+'x '+re);W[f]=s.replace(re,b);}
for(const[f,h,li]of[['src/case-studies/piasten.njk','Entwicklungen, die nicht ins Sortiment kamen','Marke und Verpackung für Produkt-Neuentwicklungen bis zur Testphase'],['src/en/case-studies/piasten.njk','Developments that did not make it into the range','Brand and packaging for new product developments through to the test phase']]){
 r(f,new RegExp('<section class="container" style="padding-block:1rem 4rem;max-width:1100px;">\\n  <h2[^>]*>'+h+'</h2>[^]*?</section>\\n\\n'),'');
 r(f,new RegExp(',\\n\\s*"'+li+'"'),'');}
r('src/leistungen/listungsgespraech-handel.njk',/Zwei Neuentwicklungen fielen im Abverkaufstest durch . vor den Investitionen in Werkzeuge und Listung\./,'Die Verpackung ist das einzige Medium, über das die Marke den Endverbraucher erreicht.');
r('src/en/services/retail-listing.njk',/Two new developments failed the sales test . before any investment in tooling and listings\./,'The packaging is the only medium through which the brand reaches the end consumer.');
for(const[f,s]of Object.entries(W))fs.writeFileSync(f,s,'utf8');console.log('OK',Object.keys(W).length);
