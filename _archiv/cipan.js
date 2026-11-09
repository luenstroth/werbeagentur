const fs=require('fs');
for(const[f,cap]of[['src/case-studies/piasten.njk','Pyramidenverpackung"},\n      {f:"food/pyramide-innenaufbau.webp", c:"Character de Cipan - Innenaufbau"}'],['src/en/case-studies/piasten.njk','pyramid packaging"},\n      {f:"food/pyramide-innenaufbau.webp", c:"Character de Cipan - inner structure"}']]){
let s=fs.readFileSync(f,'utf8').replace(/\r\n/g,'\n');const re=/(Pyramidenverpackung|pyramid packaging)"\},\n\s*\{f:"food\/pyramide-innenaufbau\.webp", c:"[^"]*"\}/;if(!re.test(s))throw new Error(f);
s=s.replace(re,'$1"}');const g='<div class="grid-3 reveal reveal-delay-1" style="background:none;gap:clamp(1.5rem,2.5vw,2.5rem);">\n    {%- for p in [\n      {f:"food/graf-zeppelin.webp"';if(!s.includes(g))throw new Error(f+' grid');s=s.replace(g,g.replace('grid-3','grid-2'));fs.writeFileSync(f,s,'utf8');}
console.log('OK');
