// Dunkles Farbschema: Token tauschen, Überlagerungen auf festes Dunkel, Akzent für Text auf Dunkel.
// Bricht ohne Schreiben ab, wenn eine Ersetzung nicht genau so oft greift wie erwartet.
const fs = require('fs');
const f = 'src/css/main.css';
let s = fs.readFileSync(f, 'utf8');
function rep(a, b, n = 1) {
  const c = s.split(a).length - 1;
  if (c !== n) throw new Error(`${c}× statt ${n}× für: ${a.slice(0, 70)}`);
  s = s.split(a).join(b);
}
// 1. Token
rep('--paper-rgb:  245,242,238;   /* warmes Papier-Weiß, Hintergrund */', '--paper-rgb:  31,29,27;      /* Anthrazit, Hintergrund (dunkles Schema seit 08.11.2026) */\n  --shade-rgb:  17,15,14;      /* festes Dunkel für Bild-Überlagerungen, unabhängig vom Schema */');
rep('--ink-rgb:    17,15,14;      /* fast-schwarz, Haupttext */', '--ink-rgb:    245,242,238;   /* Papierweiß, Haupttext */');
rep('--accent-rgb:   13,79,92;     /* Petrol-Akzent, Durchsetzungskraft */', '--accent-rgb:   127,196,208;  /* helles Petrol: Akzent für Text und Linien auf Dunkel */');
rep('--paper:      #f5f2ee;', '--paper:      #1f1d1b;');
rep('--paper-2:    #ece8e3;', '--paper-2:    #2a2826;');
rep('--paper-3:    #e4dfd9;', '--paper-3:    #353230;');
rep('--ink:        #110f0e;', '--ink:        #f5f2ee;\n  --shade:      #110f0e;   /* festes Dunkel: Fußzeile, Bildbühnen */\n  --light:      #f5f2ee;   /* helle Fläche für Logo-Musterkarten */');
rep('--ink-2:      #2d2925;', '--ink-2:      #d9d4cd;');
rep('--accent:       #0D4F5C;', '--accent:       #7FC4D0;\n  --accent-deep:  #0D4F5C;   /* Petrol der Marke: Flächen, Buttons */');
rep('--accent-light: #1B7A8C;', '--accent-light: #A9D6DE;');
// 2. Überlagerungen und dunkle Flächen bleiben dunkel
s = s.replace(/(background:[^;]*?)rgba\(var\(--ink-rgb\)/g, (m, p) => m); // Platzhalter, eigentlicher Tausch unten zeilenweise
const lines = s.split('\n');
let swapped = 0;
for (let i = 0; i < lines.length; i++) {
  const L = lines[i];
  const isOverlay = /linear-gradient/.test(L) && /rgba\(var\(--ink-rgb\),\.(2|3|4|5|6|7|8|9)/.test(L);
  if (isOverlay) { lines[i] = L.replace(/--ink-rgb/g, '--shade-rgb'); swapped++; }
}
s = lines.join('\n');
if (swapped < 4) throw new Error('nur ' + swapped + ' Überlagerungen umgestellt');
for (const sel of ['.hero--foto { background: var(--ink);', '.hero-video { background: var(--ink); }', 'background: var(--ink); color: rgba(var(--white-rgb),.85);']) rep(sel, sel.replace('var(--ink)', 'var(--shade)'));
rep('overflow: hidden; background: var(--ink);', 'overflow: hidden; background: var(--shade);');
// 3. Buttons: Petrol-Fläche mit weißer Schrift
rep('.btn-primary:hover { background: var(--accent); color: #fff; }', '.btn-primary:hover { background: var(--accent-deep); color: #fff; }');
rep('color: #fff; background: var(--accent); border: 1px solid var(--accent);', 'color: #fff; background: var(--accent-deep); border: 1px solid var(--accent-deep);');
rep('.btn-fill:hover { background: var(--ink); border-color: var(--ink); }', '.btn-fill:hover { background: var(--ink); border-color: var(--ink); color: var(--shade); }');
rep('.nav-toggle span { width: 22px; height: 1.5px; background: var(--ink); }', '.nav-toggle span { width: 22px; height: 1.5px; background: var(--ink); }');
// 4. Logos: Musterkarten hell, Logowand als helle Silhouetten
s += `
/* ── Dunkles Schema: Logos ──
   Logo-Vergleiche (vorher/nachher) stehen auf heller Musterkarte, damit Originalfarben stimmen.
   Die Logowand zeigt Logos einheitlich als helle Silhouetten. */
.case-img--logo, .case-img--square { background: var(--light) !important; }
.logo-tile img { filter: brightness(0) invert(.92); opacity: .78; transition: opacity .3s var(--ease); }
.logo-tile:hover img { opacity: 1; }
::selection { background: var(--accent-deep); color: #fff; }
`;
fs.writeFileSync(f, s, 'utf8');
console.log('OK, Überlagerungen umgestellt:', swapped);
