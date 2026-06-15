// Study prototype: a guided learning path (collapsible group -> sub-group ->
// concept outline) + a flashcard self-test, from the same data. Read as raw
// text by dpmap_build.js. Depends on injected GROUPS/SUBS/NODES + dpmap_ui.js.

const STUDY_STYLE = `
.modebar{display:flex;gap:8px;align-items:center}
.seg{display:inline-flex;background:var(--surface);border:1px solid var(--line);border-radius:10px;overflow:hidden}
.seg button{background:none;border:none;color:var(--tx2);font-size:13px;padding:8px 15px;cursor:pointer}
.seg button.on{background:var(--s2);color:var(--tx)}
.studywrap{max-width:1080px;margin:0 auto;padding:18px}
.pathgrid{display:flex;gap:18px;align-items:flex-start}
.pathside{width:320px;flex:0 0 auto;display:flex;flex-direction:column;gap:10px}
.ptools{display:flex;gap:8px;align-items:center}
.ptools .search{flex:1;width:auto}
.pbtn{background:var(--surface);border:1px solid var(--line);border-radius:9px;color:var(--tx2);font-size:12px;padding:8px 11px;cursor:pointer;white-space:nowrap}
.pbtn:hover{border-color:var(--line2);color:var(--tx)}
.pathlist{flex:1 1 auto;max-height:calc(100vh - 172px);overflow:auto;
  border:1px solid var(--line);border-radius:13px;background:#121212;padding:6px}
.pl-empty{color:var(--tx3);font-size:13px;padding:16px 10px}
.pl-group{margin:2px 0}
.pl-ghead{display:flex;align-items:center;gap:9px;padding:10px;border-radius:8px;cursor:pointer;
  font-family:'Space Grotesk','Inter',sans-serif;font-weight:600;font-size:14px;color:var(--tx);user-select:none}
.pl-ghead:hover{background:var(--s2)}
.pl-ghead .gdot{width:10px;height:10px;border-radius:50%;flex:0 0 auto}
.pl-ghead .gc{margin-left:auto;color:var(--tx3);font-size:11px;font-weight:400}
.pl-ghead .chev{color:var(--tx3);font-size:11px;flex:0 0 auto}
.pl-shead{display:flex;align-items:center;gap:8px;padding:6px 10px 6px 22px;border-radius:8px;cursor:pointer;
  font-size:11px;text-transform:uppercase;letter-spacing:.05em;font-weight:600;color:var(--tx2);user-select:none}
.pl-shead:hover{background:var(--s2);color:var(--tx)}
.pl-shead .tick{width:15px;height:3px;border-radius:2px;flex:0 0 auto}
.pl-shead .sc{margin-left:auto;color:var(--tx3);font-weight:400}
.pl-shead .chev{color:var(--tx3);font-size:10px;flex:0 0 auto}
.prow{display:flex;align-items:center;gap:9px;padding:6px 10px 6px 36px;border-radius:8px;cursor:pointer;font-size:13px;color:var(--tx2)}
.prow:hover{background:var(--s2);color:var(--tx)}
.prow.on{background:var(--s2);color:var(--tx);outline:1px solid var(--line2)}
.prow .num{font-size:11px;color:var(--tx3);width:22px;flex:0 0 auto}
.pathmain{flex:1;min-width:0}
.whyband{border:1px solid var(--line);border-left-width:3px;border-radius:10px;background:#121212;padding:11px 14px;margin-bottom:14px}
.whyband .wl{font-size:11px;text-transform:uppercase;letter-spacing:.06em;color:var(--tx3);margin-bottom:3px}
.whyband .wt{font-size:13px;color:var(--tx2);line-height:1.5}
.pnav{display:flex;align-items:center;gap:10px;margin-bottom:14px}
.pnav button{background:var(--surface);border:1px solid var(--line);border-radius:9px;color:var(--tx);font-size:13px;padding:8px 14px;cursor:pointer}
.pnav button:hover{border-color:var(--line2)}
.pnav button:disabled{opacity:.4;cursor:default}
.pnav .prog{margin-left:auto;font-size:12px;color:var(--tx3)}
.pathmain .detail{position:static;width:auto;max-height:none}
.fc-wrap{max-width:620px;margin:6px auto}
.fc-top{display:flex;align-items:center;gap:10px;margin-bottom:14px}
.fc-scope{background:var(--surface);border:1px solid var(--line);border-radius:9px;color:var(--tx);font-size:13px;padding:8px 10px}
.fc-prog{margin-left:auto;font-size:12px;color:var(--tx3)}
.card-big{border:1px solid var(--line);border-radius:14px;background:#141414;padding:22px;min-height:286px;display:flex;flex-direction:column}
.fc-kicker{font-size:11px;text-transform:uppercase;letter-spacing:.07em;color:var(--tx3);margin-bottom:12px}
.fc-intent{font-size:17px;line-height:1.5;color:var(--tx)}
.fc-tag{font-size:13px;color:var(--tx2);margin-top:10px}
.fc-reveal{margin-top:auto;display:flex;gap:8px;padding-top:18px}
.btn{background:var(--surface);border:1px solid var(--line);border-radius:9px;color:var(--tx);font-size:13px;padding:9px 16px;cursor:pointer}
.btn:hover{border-color:var(--line2)}
.btn.primary{background:var(--accent);color:#140A03;border-color:var(--accent);font-weight:600}
.btn.good{border-color:#2F855A;color:#86EFAC}
.btn.again{border-color:#9B2C2C;color:#FCA5A5}
.ans .nm{font-size:21px;font-weight:600;color:var(--tx)}
.ans .meta{font-size:12px;color:var(--tx3);margin:3px 0 13px}
.ans .roles div{font-size:13px;color:var(--tx2);line-height:1.55;margin:2px 0}
.ans .roles b{font-weight:600}
.ans .kqa{margin-top:13px;border-left:2px solid var(--accent);padding-left:11px}
.ans .kqa .q{font-size:13px;font-weight:600;color:var(--tx)}
.ans .kqa .a{font-size:13px;color:var(--tx2);line-height:1.5;margin-top:3px}
.fc-done{align-items:center;justify-content:center;text-align:center}
.fc-done .big{font-size:34px;font-weight:600;color:var(--tx)}
.fc-done .sub{color:var(--tx2);margin:8px 0 18px}
@media (max-width:820px){ .pathgrid{flex-direction:column} .pathlist{width:auto;max-height:none} }
`;
document.head.insertAdjacentHTML('beforeend', '<style>' + STUDY_STYLE + '</style>');

const app = document.getElementById('app');
app.innerHTML = `
  <header class="bar">
    <div class="brand"><span class="logo">◆</span>
      <div><h1>Design Principles &amp; Patterns</h1>
        <div class="sub">Study mode — walk the hierarchy, then test yourself</div></div>
    </div>
    <div class="modebar"><div class="seg">
      <button id="m-path" class="on">Learning path</button>
      <button id="m-cards">Flashcards</button>
    </div></div>
  </header>
  <div class="studywrap" id="view"></div>`;

// Linear order through the taxonomy: group -> sub-group -> concept.
const ORDER = [];
GROUPS.forEach(g => subsOfGroup(g.id).forEach(s => nodesOfSub(s.id).forEach(n => ORDER.push(n.id))));
const collapsed = new Set();   // ids of collapsed groups / sub-groups
let pi = 0;
let pquery = '';
const pmatches = n => !pquery || (n.name + ' ' + (n.full || '') + ' ' + n.tag + ' ' + n.intent).toLowerCase().includes(pquery);

function renderPath(){
  document.getElementById('view').innerHTML = `
    <div class="pathgrid">
      <div class="pathside">
        <div class="ptools">
          <input id="psearch" class="search" type="search" placeholder="Search concepts…" aria-label="Search concepts" autocomplete="off">
          <button id="pall" class="pbtn"></button>
        </div>
        <div class="pathlist" id="plist"></div>
      </div>
      <div class="pathmain">
        <div class="whyband" id="why"></div>
        <div class="pnav">
          <button id="prev">‹ Prev</button><button id="next">Next ›</button>
          <span class="prog" id="prog"></span>
        </div>
        <div class="detail" id="detail" aria-live="polite"></div>
      </div>
    </div>`;
  const ps = document.getElementById('psearch');
  ps.value = pquery;
  ps.oninput = () => { pquery = ps.value.trim().toLowerCase(); renderOutline(); };
  document.getElementById('pall').onclick = toggleAll;
  renderOutline();
  goPath(pi);
}

function renderOutline(){
  let html = '', idx = 0;
  for (const g of GROUPS){
    const gNodes = NODES.filter(x => x.group === g.id);
    if (pquery && !gNodes.some(pmatches)){ idx += gNodes.length; continue; }
    const gOpen = pquery ? true : !collapsed.has(g.id);
    html += `<div class="pl-group"><div class="pl-ghead" data-g="${g.id}">
      <span class="gdot" style="background:${g.accent}"></span>${esc(g.name)}
      <span class="gc">${gNodes.length}</span><span class="chev">${gOpen ? '▾' : '▸'}</span></div>`;
    if (gOpen){
      for (const s of subsOfGroup(g.id)){
        const sNodes = nodesOfSub(s.id);
        if (pquery && !sNodes.some(pmatches)){ idx += sNodes.length; continue; }
        const sOpen = pquery ? true : !collapsed.has(s.id);
        html += `<div class="pl-shead" data-s="${s.id}"><span class="tick" style="background:${s.accent}"></span>${esc(s.name)}
          <span class="sc">${sNodes.length}</span><span class="chev">${sOpen ? '▾' : '▸'}</span></div>`;
        if (sOpen) for (const node of sNodes){ if (!pquery || pmatches(node)) html += `<div class="prow" data-i="${idx}"><span class="num">${idx + 1}</span>${esc(node.name)}</div>`; idx++; }
        else idx += sNodes.length;
      }
    } else idx += gNodes.length;
    html += `</div>`;
  }
  const list = document.getElementById('plist');
  list.innerHTML = html || `<div class="pl-empty">No matches.</div>`;
  list.querySelectorAll('.pl-ghead').forEach(el => el.onclick = () => toggle(el.dataset.g));
  list.querySelectorAll('.pl-shead').forEach(el => el.onclick = () => toggle(el.dataset.s));
  list.querySelectorAll('.prow').forEach(el => el.onclick = () => goPath(+el.dataset.i));
  const pall = document.getElementById('pall');
  if (pall){ const ids = [...GROUPS.map(g => g.id), ...SUBS.map(s => s.id)]; pall.textContent = ids.some(i => !collapsed.has(i)) ? 'Collapse all' : 'Expand all'; }
  markActive();
}

function toggle(id){ collapsed.has(id) ? collapsed.delete(id) : collapsed.add(id); renderOutline(); }
function toggleAll(){
  const ids = [...GROUPS.map(g => g.id), ...SUBS.map(s => s.id)];
  if (ids.some(i => !collapsed.has(i))) ids.forEach(i => collapsed.add(i));
  else collapsed.clear();
  renderOutline();
}

function markActive(){
  document.querySelectorAll('.prow').forEach(el => el.classList.toggle('on', +el.dataset.i === pi));
  const on = document.querySelector('.prow.on'); if (on && on.scrollIntoView) on.scrollIntoView({ block: 'nearest' });
}

function goPath(i){
  pi = Math.max(0, Math.min(ORDER.length - 1, i));
  const n = byId(ORDER[pi]), s = SUB[n.sub], g = GRP[n.group];
  let changed = false;
  if (collapsed.has(g.id)){ collapsed.delete(g.id); changed = true; }
  if (collapsed.has(n.sub)){ collapsed.delete(n.sub); changed = true; }
  if (changed) renderOutline();
  selectNode(ORDER[pi]);
  const why = document.getElementById('why');
  why.style.borderLeftColor = s.accent;
  why.innerHTML = `<div class="wl">${esc(g.name)} › ${esc(s.name)}</div><div class="wt">${esc(s.blurb)}</div>`;
  document.getElementById('prog').textContent = `${pi + 1} / ${ORDER.length}`;
  document.getElementById('prev').disabled = pi === 0;
  document.getElementById('next').disabled = pi === ORDER.length - 1;
  document.getElementById('prev').onclick = () => goPath(pi - 1);
  document.getElementById('next').onclick = () => goPath(pi + 1);
  markActive();
}

// ---- flashcards ----
let scope = 'all', deck = [], known = 0, total = 0;
function buildDeck(){
  const pool = NODES.filter(n => scope === 'all' || n.group === scope).map(n => n.id);
  for (let i = pool.length - 1; i > 0; i--){ const j = Math.floor(Math.random() * (i + 1)); [pool[i], pool[j]] = [pool[j], pool[i]]; }
  deck = pool; total = pool.length; known = 0;
}
function renderCards(){
  document.getElementById('view').innerHTML = `
    <div class="fc-wrap">
      <div class="fc-top">
        <select class="fc-scope" id="scope">
          <option value="all">All concepts</option>
          ${GROUPS.map(g => `<option value="${g.id}">${esc(g.name)}</option>`).join('')}
        </select>
        <span class="fc-prog" id="fcprog"></span>
      </div>
      <div id="cardarea"></div>
    </div>`;
  const sel = document.getElementById('scope'); sel.value = scope;
  sel.onchange = () => { scope = sel.value; buildDeck(); drawCard(); };
  buildDeck(); drawCard();
}
function drawCard(){
  const area = document.getElementById('cardarea'), prog = document.getElementById('fcprog');
  if (!deck.length){
    area.innerHTML = `<div class="card-big fc-done"><div class="big">${known} / ${total}</div>
      <div class="sub">known on the first pass</div>
      <button class="btn primary" id="restart">Restart deck</button></div>`;
    prog.textContent = 'done';
    document.getElementById('restart').onclick = () => { buildDeck(); drawCard(); };
    return;
  }
  const n = byId(deck[0]);
  prog.textContent = `${deck.length} left · ${known} known`;
  area.innerHTML = `<div class="card-big" id="cardbig">
    <div class="fc-kicker">Which concept is this?</div>
    <div class="fc-intent">${esc(n.intent)}</div>
    <div class="fc-tag">“${esc(n.tag)}”</div>
    <div class="fc-reveal"><button class="btn primary" id="reveal">Reveal answer</button></div>
  </div>`;
  document.getElementById('reveal').onclick = () => reveal(n);
}
function reveal(n){
  const ac = accentOf(n), g = GRP[n.group], s = SUB[n.sub];
  const roles = n.structure.map(r => `<div><b style="color:${ac}">${esc(r[0])}</b> — ${esc(r[1])}</div>`).join('');
  document.getElementById('cardbig').innerHTML = `
    <div class="ans">
      <div class="nm">${esc(n.name)}</div>
      <div class="meta">${esc(g.name)} · ${esc(s.name)}</div>
      <div class="roles">${roles}</div>
      <div class="kqa"><div class="q">${esc(n.q)}</div><div class="a">${esc(n.a)}</div></div>
    </div>
    <div class="fc-reveal">
      <button class="btn good" id="got">Got it</button>
      <button class="btn again" id="again">Review later</button>
    </div>`;
  document.getElementById('got').onclick = () => { known++; deck.shift(); drawCard(); };
  document.getElementById('again').onclick = () => { deck.push(deck.shift()); drawCard(); };
}

// ---- mode switch ----
function setMode(m){
  document.getElementById('m-path').classList.toggle('on', m === 'path');
  document.getElementById('m-cards').classList.toggle('on', m === 'cards');
  if (m === 'path') renderPath(); else renderCards();
}
document.getElementById('m-path').onclick = () => setMode('path');
document.getElementById('m-cards').onclick = () => setMode('cards');

const hid = decodeURIComponent(location.hash.slice(1));
if (hid && byId(hid)){ const fi = ORDER.indexOf(hid); if (fi >= 0) pi = fi; }
setMode('path');
