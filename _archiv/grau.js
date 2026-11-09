const fs=require('fs');const W={};const get=f=>W[f]??fs.readFileSync(f,'utf8');
function r(f,a,b,cnt=1){const s=get(f),n=s.split(a).length-1;if(n!==cnt)throw new Error(f+': '+n+'x '+a);W[f]=s.split(a).join(b);}
const C='src/css/main.css';
r(C,'--accent-rgb:   127,196,208;  /* helles Petrol: Akzent für Text und Linien auf Dunkel */','--accent-rgb:   201,195,186;  /* warmes Hellgrau: Akzent für Text und Linien auf Dunkel (keine Buntfarbe, 09.11.2026) */');
r(C,'--accent:       #7FC4D0;','--accent:       #C9C3BA;');
r(C,'--accent-deep:  #0D4F5C;   /* Petrol der Marke: Flächen, Buttons */','--accent-deep:  #F5F2EE;   /* helle Fläche für Buttons, Schrift darauf dunkel */');
r(C,'--accent-light: #A9D6DE;','--accent-light: #E4DFD8;');
r(C,'.btn-primary:hover { background: var(--accent-deep); color: #fff; }','.btn-primary:hover { background: var(--accent-deep); color: var(--shade); }');
r(C,'color: #fff; background: var(--accent-deep); border: 1px solid var(--accent-deep);','color: var(--shade); background: var(--accent-deep); border: 1px solid var(--accent-deep);');
r(C,'.btn-fill:hover { background: var(--ink); border-color: var(--ink); color: var(--shade); }','.btn-fill:hover { background: var(--accent); border-color: var(--accent); color: var(--shade); }');
r(C,'color: var(--accent-deep); background: #fff;','color: var(--shade); background: #fff;');
r(C,'border-bottom: 1px solid rgba(13,79,92,.3);','border-bottom: 1px solid rgba(var(--accent-rgb),.3);');
r(C,'::selection { background: var(--accent-deep); color: #fff; }','::selection { background: var(--accent); color: var(--shade); }');
W[C]=get(C)+'\n/* Ohne Buntfarbe: Links im Fließtext über Gewicht statt Farbe erkennbar */\n.body-lg a, .card-desc a, .faq-item a, main p a { font-weight: 600; }\n';
const H='src/_includes/chart-cobiax-zielgruppe.njk';
r(H,'fill="#0D4F5C"','fill="#3A3632"',3);r(H,'fill="#1B7A8C"','fill="#6B645D"');
for(const[f,s]of Object.entries(W))fs.writeFileSync(f,s,'utf8');console.log('OK');
