// Regression check for the Design Principles & Patterns interactive map.
//   node _check.js
// Loads both built prototypes in jsdom, asserts the scripts run cleanly and the
// DOM (groups, sub-groups, cards, tree nodes, edges, collapse/expand, detail) is
// built as expected. Run after dpmap_build.js.

const { JSDOM } = require('jsdom');
const fs = require('fs');
const path = require('path');
const dir = path.join(__dirname, '..');   // HTML files sit in the material folder root

function load(file){
  const errs = [];
  const vc = new (require('jsdom').VirtualConsole)();
  vc.on('jsdomError', e => errs.push(e.detail && e.detail.message || e.message));
  const dom = new JSDOM(fs.readFileSync(path.join(dir, file), 'utf8'),
    { runScripts: 'dangerously', pretendToBeVisual: true, virtualConsole: vc, url: 'https://example.org/' + file });
  return { d: dom.window.document, win: dom.window, errs };
}
let fail = 0;
const ok = (c, m) => { console.log((c ? '  ok  ' : '  FAIL') + ' ' + m); if (!c) fail++; };
const find = (d, sel, attr, val) => [...d.querySelectorAll(sel)].find(x => x.dataset[attr] === val);

// ---- Hybrid ----
const h = load('dpmap_hybrid.html');
console.log('dpmap_hybrid.html', h.errs.length ? 'ERRORS: ' + h.errs.join('; ') : '(no runtime errors)');
ok(h.errs.length === 0, 'no runtime errors');
ok(h.d.querySelectorAll('.card').length === 49, '49 cards (all expanded by default)');
ok(h.d.querySelectorAll('.section').length === 3, '3 top-level groups');
ok(h.d.querySelectorAll('.subhead').length === 10, '10 sub-groups');
h.win.selectNode('srp');
ok(h.d.querySelector('#detail .pill').textContent === 'Principles' && h.d.querySelector('#detail .subpill').textContent === 'SOLID', 'srp -> Principles / SOLID');
h.win.selectNode('singleton');
ok(h.d.querySelector('#detail .pill').textContent === 'GoF Design Patterns' && h.d.querySelector('#detail .subpill').textContent === 'Creational', 'singleton -> GoF / Creational');
find(h.d, '.section h3', 'toggle', 'gof').click();
ok(h.d.querySelectorAll('.card').length === 26, 'collapsing GoF hides its 23 cards (26 left)');
find(h.d, '.section h3', 'toggle', 'gof').click();
ok(h.d.querySelectorAll('.card').length === 49, 're-expanding GoF restores 49 cards');
find(h.d, '.subhead', 'toggle', 'solid').click();
ok(h.d.querySelectorAll('.card').length === 44, 'collapsing SOLID sub-group hides 5 cards');

// ---- Tree ----
const t = load('dpmap_tree.html');
console.log('dpmap_tree.html', t.errs.length ? 'ERRORS: ' + t.errs.join('; ') : '(no runtime errors)');
ok(t.errs.length === 0, 'no runtime errors');
ok(t.d.querySelectorAll('.node.groupnode').length === 3, '3 group nodes');
ok(t.d.querySelectorAll('.node.subnode').length === 10, '10 sub-group nodes');
ok(t.d.querySelectorAll('.node.leaf').length === 0, 'opens collapsed (0 leaves)');
ok(t.d.querySelectorAll('#edges path').length === 13, '13 connectors initially (3 + 10)');
[...t.d.querySelectorAll('.node.subnode')].forEach(el => el.click());
ok(t.d.querySelectorAll('.node.leaf').length === 49, 'expanding every sub-group -> 49 leaves');
ok(t.d.querySelectorAll('#edges path').length === 62, '62 connectors fully expanded (3 + 10 + 49)');
const pos = [...t.d.querySelectorAll('.node')].map(n => n.style.left + ',' + n.style.top);
ok(pos.length === new Set(pos).size, 'no two nodes overlap when fully expanded');

// ---- Deep-dive links (self-contained, local) ----
const { NODES } = require('./dpmap_data.js');
const linked = NODES.filter(n => n.pdf);
ok(linked.length >= 23, linked.length + ' deep-dive links wired (>= 23 GoF; rises as deep-dives are added)');
let missing = 0;
for (const n of linked){ if (!fs.existsSync(path.join(dir, n.pdf))) { console.log('   missing:', n.pdf); missing++; } }
ok(missing === 0, 'every deep-dive link resolves to a local file');
ok(linked.every(n => n.pdf.startsWith('./')), 'all links are folder-local (no ../ escapes)');

// ---- Learning layer (study) ----
const { PATH } = require('./dpmap_data.js');
const flat = PATH.flatMap(p => p.ids);
ok(flat.length === 49 && new Set(flat).size === 49, 'learning path covers all 49 concepts once');
ok(flat.every(id => NODES.find(n => n.id === id)), 'all learning-path ids exist');
const st = load('dpmap_study.html');
console.log('dpmap_study.html', st.errs.length ? 'ERRORS: ' + st.errs.join('; ') : '(no runtime errors)');
ok(st.errs.length === 0, 'no runtime errors');
ok(st.d.querySelectorAll('.prow').length === 49, 'path lists all 49 concepts');
ok(st.d.querySelectorAll('.pl-ghead').length === 3 && st.d.querySelectorAll('.pl-shead').length === 10, 'path outline: 3 groups + 10 sub-groups');
{ const pg = st.d.querySelector('.pl-ghead'); pg.click();
  ok(st.d.querySelectorAll('.prow').length < 49, 'path: collapsing a group hides its concepts');
  pg.click(); ok(st.d.querySelectorAll('.prow').length === 49, 'path: re-expanding restores 49'); }
ok(!!st.d.querySelector('#why') && !!st.d.querySelector('#detail h2'), 'path: why-banner + detail render');
st.d.getElementById('m-cards').click();
ok(!!st.d.querySelector('#reveal'), 'flashcards: card + reveal render');
st.d.getElementById('reveal').click();
ok(!!st.d.querySelector('#got'), 'flashcards: reveal shows grade buttons');

// ---- Deep-links + copy-code ----
h.win.selectNode('strategy');
ok(!!h.d.querySelector('#detail .copy'), 'detail has a copy-code button');
const deep = new JSDOM(fs.readFileSync(path.join(dir, 'dpmap_hybrid.html'), 'utf8'),
  { runScripts: 'dangerously', pretendToBeVisual: true, url: 'https://x/dpmap_hybrid.html#observer' });
ok(deep.window.document.querySelector('#detail h2') && deep.window.document.querySelector('#detail h2').textContent === 'Observer',
  'deep-link #observer opens Observer');

console.log(fail ? `\n${fail} check(s) FAILED` : '\nAll checks passed.');
process.exit(fail ? 1 : 0);
