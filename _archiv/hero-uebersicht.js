const fs=require('fs');
const P=[['src/case-studies/index.njk','Wirksam','impact'],['src/en/case-studies/index.njk','Effective','impact'],['src/leistungen/index.njk','Begehrt statt verglichen','desire'],['src/en/services/index.njk','Desired, not compared','desire']];
for(const[f,text,eff]of P){let s=fs.readFileSync(f,'utf8');const re=/\{% from "hero-type\.njk" import heroType %\}\s*\{\{ heroType\(\s*"([^"]*)",\s*\[[^\]]*\],\s*("[^"]*")\s*\) \}\}/;const m=s.match(re);if(!m)throw new Error(f);
s=s.replace(re,`{%- set hero = {\n  text: "${text}",\n  effect: "${eff}",\n  label: "${m[1]}",\n  sub: ${m[2]},\n  labelIsH1: true\n} %}\n{% include "hero-statement.njk" %}`);fs.writeFileSync(f,s,'utf8');}
const css='src/css/main.css';let c=fs.readFileSync(css,'utf8');if(c.includes('stmt--impact'))throw new Error('css schon da');
c=c.replace(/\n@keyframes stmt-fade \{ to \{ opacity: 1; \} \}/,`
/* impact  "Wirksam": Buchstaben setzen kurz und bestimmt auf, danach zieht eine feine Akzentlinie die Spur der Wirkung */
.stmt--impact .stmt-w { position: relative; }
.stmt--impact .stmt-l { opacity: 0; transform: translateY(-.18em) scale(1.12); filter: blur(6px); animation: stmt-impact .55s cubic-bezier(.2,1.4,.4,1) forwards; animation-delay: calc(var(--i) * 40ms + .25s); }
@keyframes stmt-impact { to { opacity: 1; transform: none; filter: none; } }
.stmt--impact .stmt-w::after { content: ""; position: absolute; left: 0; right: 0; bottom: .02em; height: .04em; background: var(--accent); transform: scaleX(0); transform-origin: left; animation: stmt-trace 1.1s var(--ease) forwards; animation-delay: calc(var(--n) * 40ms + .7s); }
@keyframes stmt-trace { to { transform: scaleX(1); } }

/* desire  "Begehrt statt verglichen": der Satz erscheint ruhig, dann tritt das Verglichene zurück und das Begehrte bleibt im Licht */
.stmt--desire .stmt-l { opacity: 0; animation: stmt-fade .7s var(--ease) forwards; animation-delay: calc(var(--i) * 28ms + .2s); }
.stmt--desire .stmt-w:nth-child(2), .stmt--desire .stmt-w:nth-child(3) { animation: stmt-recede 1.2s var(--ease) forwards; animation-delay: calc(var(--n) * 28ms + .9s); }
.stmt--desire .stmt-w:nth-child(1) { animation: stmt-glow 1.2s var(--ease) forwards; animation-delay: calc(var(--n) * 28ms + .9s); }
@keyframes stmt-recede { to { opacity: .38; } }
@keyframes stmt-glow { to { color: var(--accent-light); } }

@keyframes stmt-fade { to { opacity: 1; } }`);
if(!c.includes('stmt--impact'))throw new Error('css nicht eingefuegt');fs.writeFileSync(css,c,'utf8');console.log('OK');
