const fs=require('fs');const W={};const get=f=>W[f]??fs.readFileSync(f,'utf8').replace(/\r\n/g,'\n');
function r(f,a,b){const s=get(f),n=s.split(a).length-1;if(n!==1)throw new Error(f+': '+n+'x '+a.slice(0,50));W[f]=s.replace(a,b);}
const d='src/case-studies/piasten.njk',e='src/en/case-studies/piasten.njk';
r(d,'für den deutschen Markt und für Exportmärkte, ein erheblicher Teil davon als Private Label für Handelspartner. Die meisten dieser Marken','für den deutschen Markt und für Exportmärkte. Die meisten seiner Marken');
r(d,'\n      "Private-Label-Verpackungen für Handelspartner",','');
r(d,'für Marken und Private Labels eines Süßwarenherstellers','für die Marken eines Süßwarenherstellers');
r(e,'for the German market and for export markets, a considerable share of it as private labels for retail partners. Most of these brands','for the German market and for export markets. Most of its brands');
r(e,'\n      "Private label packaging for retail partners",','');
r(e,'for the brands and private labels of a confectionery manufacturer','for the brands of a confectionery manufacturer');
for(const[f,s]of Object.entries(W))fs.writeFileSync(f,s,'utf8');console.log('OK');
