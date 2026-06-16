// Build the two standalone interactive-map prototypes from one data model.
//   node dpmap_build.js
// Emits dpmap_hybrid.html and dpmap_tree.html into the 2026-06-15 folder.
// Single source of truth = dpmap_data.js; shared UI = dpmap_ui.js.

const fs = require('fs');
const path = require('path');
const { GROUPS, SUBS, NODES, PATH } = require('./dpmap_data.js');

const read = f => fs.readFileSync(path.join(__dirname, f), 'utf8');
const uiJS = read('dpmap_ui.js');
const hybridJS = read('dpmap_hybrid.js');
const treeJS = read('dpmap_tree.js');
const studyJS = read('dpmap_study.js');

// Inline the data; escape "<" so no string value can break out of the <script>.
const dataLiteral = (`const GROUPS=${JSON.stringify(GROUPS)};\n` +
  `const SUBS=${JSON.stringify(SUBS)};\n` +
  `const NODES=${JSON.stringify(NODES)};\n` +
  `const PATH=${JSON.stringify(PATH)};`).replace(/</g, '\\u003c');

const OUT = path.join(__dirname, '..');   // material folder root (kit lives in _src/)

function page(title, pageJS){
  return `<!doctype html>
<html lang="en">
<head>
<meta charset="utf-8">
<meta name="viewport" content="width=device-width, initial-scale=1">
<meta name="color-scheme" content="dark">
<title>${title}</title>
<!-- favicons -->
<link rel="icon" href="./favicon.svg" type="image/svg+xml">
<link rel="icon" href="./favicon.ico" sizes="any">
<link rel="apple-touch-icon" href="./apple-touch-icon.png">
<link rel="preconnect" href="https://fonts.googleapis.com">
<link rel="preconnect" href="https://fonts.gstatic.com" crossorigin>
<link href="https://fonts.googleapis.com/css2?family=Space+Grotesk:wght@500;600;700&family=Inter:wght@400;500;600&family=JetBrains+Mono:wght@400;500&display=swap" rel="stylesheet">
<style>html,body{margin:0;background:#0A0A0A;color:#F5F5F5}</style>
</head>
<body>
<h2 class="sr-only">${title}. Interactive map of software design principles and patterns. Filter or expand the families and select a concept to see its intent, structure, trade-offs, a code sketch and an interview question.</h2>
<div id="app"></div>
<script>${dataLiteral}</script>
<script>${uiJS}</script>
<script>${pageJS}</script>
</body>
</html>`;
}

const INDEX = `<!doctype html>
<html lang="en">
<head>
<meta charset="utf-8">
<meta name="viewport" content="width=device-width, initial-scale=1">
<meta name="color-scheme" content="dark">
<title>Design Principles &amp; Patterns</title>
<!-- favicons -->
<link rel="icon" href="./favicon.svg" type="image/svg+xml">
<link rel="icon" href="./favicon.ico" sizes="any">
<link rel="apple-touch-icon" href="./apple-touch-icon.png">
<link rel="preconnect" href="https://fonts.googleapis.com">
<link href="https://fonts.googleapis.com/css2?family=Space+Grotesk:wght@600&family=Inter:wght@400;500;600&display=swap" rel="stylesheet">
<style>
*{box-sizing:border-box}
html,body{margin:0;height:100%;background:#0A0A0A;color:#F5F5F5;font-family:'Inter',system-ui,sans-serif}
body{display:flex;flex-direction:column;height:100vh}
.tabbar{display:flex;align-items:center;gap:8px;padding:10px 16px;background:#0A0A0A;border-bottom:1px solid #2A2A2A;flex:0 0 auto}
.tabbar .logo{width:26px;height:26px;border-radius:7px;background:#FF7A00;color:#120A04;display:flex;align-items:center;justify-content:center;font-weight:700;font-size:14px;margin-right:4px}
.tabbar h1{font-size:15px;font-weight:600;margin:0 12px 0 0;font-family:'Space Grotesk','Inter',sans-serif}
.tab{background:transparent;border:1px solid #2A2A2A;border-radius:999px;color:#9CA3AF;font-size:13px;padding:7px 16px;cursor:pointer}
.tab:hover{border-color:#383838;color:#F5F5F5}
.tab.on{background:#1E1E1E;border-color:#FF7A00;color:#F5F5F5}
.hint{margin-left:auto;font-size:12px;color:#6B7280}
.frames{flex:1 1 auto;position:relative}
.frames iframe{position:absolute;inset:0;width:100%;height:100%;border:0;display:none;background:#0A0A0A}
.frames iframe.on{display:block}
</style>
</head>
<body>
<div class="tabbar">
  <span class="logo">◆</span><h1>Design Principles &amp; Patterns</h1>
  <button class="tab" data-v="study">Study</button>
  <button class="tab" data-v="hybrid">Cards</button>
  <button class="tab" data-v="tree">Mind-map</button>
  <span class="hint">interactive · ${NODES.length} concepts</span>
</div>
<div class="frames">
  <iframe data-v="study" src="dpmap_study.html" title="Study"></iframe>
  <iframe data-v="hybrid" src="dpmap_hybrid.html" title="Cards"></iframe>
  <iframe data-v="tree" src="dpmap_tree.html" title="Mind-map"></iframe>
</div>
<script>
var V=['study','hybrid','tree'];
var tabs=[].slice.call(document.querySelectorAll('.tab'));
var frames=[].slice.call(document.querySelectorAll('.frames iframe'));
function show(v){
  tabs.forEach(function(t){t.classList.toggle('on',t.dataset.v===v);});
  frames.forEach(function(f){f.classList.toggle('on',f.dataset.v===v);});
  try{localStorage.setItem('dpmap_tab',v);}catch(e){}
  if(location.hash.slice(1)!==v){try{history.replaceState(null,'','#'+v);}catch(e){}}
}
tabs.forEach(function(t){t.onclick=function(){show(t.dataset.v);};});
var init='study',h=location.hash.slice(1);
if(V.indexOf(h)>=0)init=h;
else{try{var s=localStorage.getItem('dpmap_tab');if(V.indexOf(s)>=0)init=s;}catch(e){}}
show(init);
</script>
</body>
</html>`;
fs.writeFileSync(path.join(OUT, 'index.html'), INDEX);
fs.writeFileSync(path.join(OUT, 'dpmap_hybrid.html'), page('Design Principles & Patterns — hybrid map', hybridJS));
fs.writeFileSync(path.join(OUT, 'dpmap_tree.html'), page('Design Principles & Patterns — mind-map', treeJS));
fs.writeFileSync(path.join(OUT, 'dpmap_study.html'), page('Design Principles & Patterns — study', studyJS));

console.log('Built:');
console.log('  index.html (tabs: Study / Cards / Mind-map)');
console.log('  dpmap_hybrid.html');
console.log('  dpmap_tree.html');
console.log('  dpmap_study.html');
console.log(`  (${GROUPS.length} groups, ${SUBS.length} sub-groups, ${NODES.length} nodes)`);
