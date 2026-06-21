// Tree / mind-map prototype: root -> group -> sub-group -> leaf.
// Groups and sub-groups are collapsible; opens collapsed (leaves hidden).
// Pan + zoom, SVG connectors, click a leaf -> shared detail panel.

const TREE_STYLE = `
.treewrap{display:flex;height:calc(100vh - 57px)}
.canvas{position:relative;flex:1;min-width:0;overflow:hidden;touch-action:none;cursor:grab;background-color:var(--bg);
  background-image:radial-gradient(rgba(255,255,255,.045) 1px,transparent 1px);background-size:26px 26px}
.canvas.grabbing{cursor:grabbing}
.viewport{position:absolute;top:0;left:0;transform-origin:0 0;will-change:transform}
#edges{position:absolute;top:0;left:0;overflow:visible;pointer-events:none}
#nodes{position:absolute;top:0;left:0}
.node{position:absolute;display:flex;align-items:center;border-radius:10px;cursor:pointer;
  user-select:none;font-size:13px;box-sizing:border-box;overflow:hidden}
.node .lbl2{flex:1;line-height:1.16;padding:0 10px}
.node .chev{padding-right:10px;font-size:11px;color:var(--tx3);flex:0 0 auto}
.node .fc{color:var(--tx3);font-size:11px;flex:0 0 auto;padding-right:6px}
.node.root{background:var(--accent);color:#140A03;font-weight:600;justify-content:center;text-align:center}
.node.root .lbl2{flex:0 1 auto;padding:0 12px;text-align:center}
.node.groupnode{background:var(--s2);border:1.5px solid var(--line2);font-weight:600}
.node.subnode{background:rgba(255,255,255,.03);border:1px dashed var(--line2);font-weight:600}
.node.subnode .lbl2{font-size:11px;text-transform:uppercase;letter-spacing:.04em}
.node.leaf{background:var(--surface);border:1px solid var(--line);border-left:3px solid var(--line2);
  color:var(--tx);font-size:12.5px}
.node.leaf:hover{background:var(--s2);border-color:var(--line2)}
.node.active{outline:2px solid var(--accent);outline-offset:1px}
.zoombar{position:absolute;right:14px;bottom:14px;display:flex;gap:6px}
.zbtn{width:34px;height:34px;background:var(--surface);border:1px solid var(--line);border-radius:9px;
  color:var(--tx);cursor:pointer;font-size:17px;line-height:1;display:flex;align-items:center;justify-content:center}
.zbtn:hover{border-color:var(--line2);background:var(--s2)}
.hint{position:absolute;left:14px;bottom:14px;font-size:11px;color:var(--tx3);pointer-events:none}
.treewrap .detail{position:static;width:360px;max-height:none;height:100%;border-radius:0;
  border:none;border-left:1px solid var(--line);overflow:auto}
.placeholder{color:var(--tx3);font-size:14px;line-height:1.6}
.placeholder b{color:var(--tx2);font-weight:600}
@media (max-width:880px){
  .treewrap{flex-direction:column;height:auto}
  .canvas{height:62vh}
  .treewrap .detail{width:auto;border-left:none;border-top:1px solid var(--line)}
  .zbtn{width:42px;height:42px;font-size:19px}
}
`;
document.head.insertAdjacentHTML('beforeend', '<style>' + TREE_STYLE + '</style>');

const app = document.getElementById('app');
app.innerHTML = `
  <header class="bar">
    <div class="brand"><span class="logo">◆</span>
      <div><h1>Design Principles &amp; Patterns</h1>
        <div class="sub">Mind-map · click a group or sub-group to expand · click a concept for details</div></div>
    </div>
    <div class="tools"><span class="count">${NODES.length} concepts</span></div>
  </header>
  <div class="treewrap">
    <div class="canvas" id="canvas">
      <div class="viewport" id="viewport">
        <svg id="edges" xmlns="http://www.w3.org/2000/svg"></svg>
        <div id="nodes"></div>
      </div>
      <div class="hint">drag to pan · scroll to zoom</div>
      <div class="zoombar">
        <button class="zbtn" id="zin" aria-label="Zoom in">+</button>
        <button class="zbtn" id="zout" aria-label="Zoom out">−</button>
        <button class="zbtn" id="zfit" aria-label="Fit to view">⤢</button>
      </div>
    </div>
    <aside class="detail" id="detail" aria-live="polite">
      <div class="placeholder"><b>Pick a concept.</b><br>Groups are open; click a sub-group
        (e.g. <b>Creational</b> or <b>SOLID</b>) to reveal its patterns, then click one for the full card.</div>
    </aside>
  </div>`;

const COL = [0, 250, 470, 700];     // x by depth: root, group, sub-group, leaf
const NW  = [200, 184, 170, 182];   // node width by depth
const NH = 40, ROWH = 48;

const canvas = document.getElementById('canvas');
const viewport = document.getElementById('viewport');
const svg = document.getElementById('edges');
const nodesEl = document.getElementById('nodes');

const openGroups = new Set(GROUPS.map(g => g.id));   // groups open
const openSubs = new Set();                          // sub-groups collapsed -> leaves hidden
let bounds = { w: 0, h: 0 };

function layout(){
  const P = {}; let row = 0; const gRows = [];
  for (const g of GROUPS){
    if (!openGroups.has(g.id)){ P['g:' + g.id] = { d: 1, r: row++ }; gRows.push(P['g:' + g.id].r); continue; }
    const subRows = [];
    for (const s of subsOfGroup(g.id)){
      if (openSubs.has(s.id)){
        const start = row;
        for (const lf of nodesOfSub(s.id)){ P[lf.id] = { d: 3, r: row++ }; }
        const sr = (start + row - 1) / 2; P['s:' + s.id] = { d: 2, r: sr }; subRows.push(sr);
      } else { P['s:' + s.id] = { d: 2, r: row++ }; subRows.push(P['s:' + s.id].r); }
    }
    P['g:' + g.id] = { d: 1, r: (subRows[0] + subRows[subRows.length - 1]) / 2 };
    gRows.push(P['g:' + g.id].r);
  }
  P['root'] = { d: 0, r: (gRows[0] + gRows[gRows.length - 1]) / 2 };
  let maxR = 0; for (const k in P) maxR = Math.max(maxR, COL[P[k].d] + NW[P[k].d]);
  bounds = { w: maxR + 24, h: row * ROWH + 24 };
  return P;
}

const cx = p => COL[p.d];
const cyc = p => p.r * ROWH + NH / 2;
function edge(x0, y0, x1, y1, color){
  const dx = Math.max(40, (x1 - x0) / 2);
  return `<path d="M${x0},${y0} C${x0 + dx},${y0} ${x1 - dx},${y1} ${x1},${y1}" fill="none" stroke="${color}" stroke-width="1.5" opacity="0.45"/>`;
}
const node = (p, cls, inner, extra = '', attrs = '') =>
  `<div class="node ${cls}" ${attrs} style="left:${cx(p)}px;top:${p.r * ROWH}px;width:${NW[p.d]}px;height:${NH}px;${extra}">${inner}</div>`;

function render(){
  const P = layout();
  svg.setAttribute('width', bounds.w); svg.setAttribute('height', bounds.h);
  const rp = P['root'];

  let e = '';
  for (const g of GROUPS){
    const gp = P['g:' + g.id];
    e += edge(cx(rp) + NW[0], cyc(rp), cx(gp), cyc(gp), g.accent);
    if (!openGroups.has(g.id)) continue;
    for (const s of subsOfGroup(g.id)){
      const sp = P['s:' + s.id];
      e += edge(cx(gp) + NW[1], cyc(gp), cx(sp), cyc(sp), s.accent);
      if (!openSubs.has(s.id)) continue;
      for (const lf of nodesOfSub(s.id)){ const lp = P[lf.id]; e += edge(cx(sp) + NW[2], cyc(sp), cx(lp), cyc(lp), s.accent); }
    }
  }
  svg.innerHTML = e;

  let h = node(rp, 'root', `<span class="lbl2">Design Principles &amp; Patterns</span>`);
  for (const g of GROUPS){
    const gp = P['g:' + g.id], gOpen = openGroups.has(g.id), gn = NODES.filter(n => n.group === g.id).length;
    h += node(gp, 'groupnode',
      `<span class="lbl2" style="color:${g.accent}">${esc(g.name)}</span><span class="fc">${gn}</span><span class="chev">${gOpen ? '▾' : '▸'}</span>`,
      `border-color:${g.accent}`, `data-grp="${g.id}"`);
    if (!gOpen) continue;
    for (const s of subsOfGroup(g.id)){
      const sp = P['s:' + s.id], sOpen = openSubs.has(s.id), sn = nodesOfSub(s.id).length;
      h += node(sp, 'subnode',
        `<span class="lbl2" style="color:${s.accent}">${esc(s.name)}</span><span class="fc">${sn}</span><span class="chev">${sOpen ? '▾' : '▸'}</span>`,
        `border-color:${s.accent}88`, `data-sub="${s.id}"`);
      if (!sOpen) continue;
      for (const lf of nodesOfSub(s.id)){
        h += node(P[lf.id], 'leaf', `<span class="lbl2">${esc(lf.name)}</span>`, `border-left-color:${s.accent}`, `data-id="${lf.id}"`);
      }
    }
  }
  nodesEl.innerHTML = h;

  nodesEl.querySelectorAll('.node').forEach(el => el.addEventListener('pointerdown', ev => ev.stopPropagation()));
  nodesEl.querySelectorAll('.groupnode').forEach(el => el.onclick = () => {
    const id = el.dataset.grp; openGroups.has(id) ? openGroups.delete(id) : openGroups.add(id); render();
  });
  nodesEl.querySelectorAll('.subnode').forEach(el => el.onclick = () => {
    const id = el.dataset.sub; openSubs.has(id) ? openSubs.delete(id) : openSubs.add(id); render();
  });
  nodesEl.querySelectorAll('.leaf').forEach(el => el.onclick = () => selectNode(el.dataset.id));
  if (current){ const a = nodesEl.querySelector(`.leaf[data-id="${current}"]`); if (a) a.classList.add('active'); }
}

// ---- pan + zoom ----
let view = { x: 36, y: 16, s: 1 };
const clamp = (v, a, b) => Math.max(a, Math.min(b, v));
const apply = () => viewport.style.transform = `translate(${view.x}px,${view.y}px) scale(${view.s})`;

let drag = null;
canvas.addEventListener('pointerdown', e => { drag = { x: e.clientX, y: e.clientY, vx: view.x, vy: view.y }; canvas.classList.add('grabbing'); });
window.addEventListener('pointermove', e => { if (!drag) return; view.x = drag.vx + (e.clientX - drag.x); view.y = drag.vy + (e.clientY - drag.y); apply(); });
window.addEventListener('pointerup', () => { drag = null; canvas.classList.remove('grabbing'); });
canvas.addEventListener('wheel', e => {
  e.preventDefault();
  const r = canvas.getBoundingClientRect(), mx = e.clientX - r.left, my = e.clientY - r.top;
  const ns = clamp(view.s * (e.deltaY < 0 ? 1.12 : 1 / 1.12), 0.35, 2.2);
  const wx = (mx - view.x) / view.s, wy = (my - view.y) / view.s;
  view.s = ns; view.x = mx - wx * ns; view.y = my - wy * ns; apply();
}, { passive: false });

function fit(){
  const r = canvas.getBoundingClientRect();
  const s = clamp(Math.min((r.width - 64) / bounds.w, (r.height - 64) / bounds.h), 0.4, 1.2);
  view.s = s;
  view.x = Math.max(24, (r.width - bounds.w * s) / 2);
  view.y = Math.max(16, (r.height - bounds.h * s) / 2);
  apply();
}
document.getElementById('zin').onclick = () => { view.s = clamp(view.s * 1.15, 0.35, 2.2); apply(); };
document.getElementById('zout').onclick = () => { view.s = clamp(view.s / 1.15, 0.35, 2.2); apply(); };
document.getElementById('zfit').onclick = fit;

// reveal a node selected via See-also chips (open its group + sub-group)
onSelect = (n) => {
  let changed = false;
  if (!openGroups.has(n.group)){ openGroups.add(n.group); changed = true; }
  if (!openSubs.has(n.sub)){ openSubs.add(n.sub); changed = true; }
  if (changed) render();
};

render();
fit();
applyHash();   // open a concept if the URL has a #hash
