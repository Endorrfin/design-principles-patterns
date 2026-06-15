// Hybrid prototype: group/sub-group filter + search + collapsible card grid + sticky detail.
// Read as raw text by dpmap_build.js. Depends on injected data + shared dpmap_ui.js.

const app = document.getElementById('app');
app.innerHTML = `
  <header class="bar">
    <div class="brand">
      <span class="logo">◆</span>
      <div><h1>Design Principles &amp; Patterns</h1>
        <div class="sub">Interactive map · ${NODES.length} concepts · click any card</div></div>
    </div>
    <div class="tools">
      <input id="q" class="search" type="search" placeholder="Search…  ( / )" aria-label="Search concepts" autocomplete="off">
      <span class="count" id="count"></span>
    </div>
  </header>
  <nav class="families" id="families" aria-label="Filter by group"></nav>
  <div class="content">
    <main class="grid" id="grid" aria-label="Concepts"></main>
    <aside class="detail" id="detail" aria-live="polite"></aside>
  </div>`;

let filter = 'all';
let query = '';
const collapsed = new Set();          // ids of collapsed groups / sub-groups
const matches = n => !query ||
  (n.name + ' ' + (n.full || '') + ' ' + n.tag + ' ' + n.intent).toLowerCase().includes(query);
const isCollapsed = id => !query && collapsed.has(id);   // search overrides collapse

function renderFamilies(){
  const total = NODES.filter(matches).length;
  const chips = [`<button class="fam ${filter==='all'?'active':''}" data-f="all">
      <span class="dot" style="background:var(--accent)"></span>All <span class="c">${total}</span></button>`];
  for (const g of GROUPS){
    const k = NODES.filter(n => n.group === g.id && matches(n)).length;
    chips.push(`<button class="fam ${filter===g.id?'active':''}" data-f="${g.id}">
      <span class="dot" style="background:${g.accent}"></span>${esc(g.name)} <span class="c">${k}</span></button>`);
  }
  chips.push(`<button class="exall" id="exall">${collapsed.size ? 'Expand all' : 'Collapse all'}</button>`);
  const nav = document.getElementById('families');
  nav.innerHTML = chips.join('');
  nav.querySelectorAll('.fam').forEach(b => b.onclick = () => { filter = b.dataset.f; renderFamilies(); renderGrid(); });
  document.getElementById('exall').onclick = () => {
    if (collapsed.size) collapsed.clear();
    else GROUPS.forEach(g => { collapsed.add(g.id); subsOfGroup(g.id).forEach(s => collapsed.add(s.id)); });
    renderFamilies(); renderGrid();
  };
}

function cardHTML(n){
  return `<div class="card" data-id="${n.id}" tabindex="0" role="button"
    aria-label="${esc(n.full || n.name)}" title="${esc(n.full || n.name)}"
    style="border-left-color:${accentOf(n)}">
    <div class="nm">${esc(n.name)}</div><div class="tg">${esc(n.tag)}</div></div>`;
}
const chev = open => `<span class="chev">${open ? '▾' : '▸'}</span>`;

function renderGrid(){
  const groups = filter === 'all' ? GROUPS : GROUPS.filter(g => g.id === filter);
  let shown = 0, html = '';
  for (const g of groups){
    const gItems = NODES.filter(n => n.group === g.id && matches(n));
    if (!gItems.length) continue;
    shown += gItems.length;
    const gOpen = !isCollapsed(g.id);
    let body = '';
    if (gOpen){
      for (const s of subsOfGroup(g.id)){
        const si = gItems.filter(n => n.sub === s.id);
        if (!si.length) continue;
        const sOpen = !isCollapsed(s.id);
        body += `<div class="subsection">
          <div class="subhead" data-toggle="${s.id}"><span class="tick" style="background:${s.accent}"></span>${esc(s.name)} <span class="sn">${si.length}</span>${chev(sOpen)}</div>
          ${sOpen ? `<div class="cardgrid">${si.map(cardHTML).join('')}</div>` : ''}</div>`;
      }
    }
    html += `<section class="section">
      <h3 data-toggle="${g.id}"><span class="gdot" style="background:${g.accent}"></span>${esc(g.name)}
        <span class="scount">${gItems.length}</span>${chev(gOpen)}</h3>
      ${gOpen ? `<div class="body">${body}</div>` : ''}</section>`;
  }
  const grid = document.getElementById('grid');
  grid.innerHTML = html || `<div style="color:var(--tx3);padding:30px 4px">No concepts match “${esc(query)}”.</div>`;
  document.getElementById('count').textContent = `${shown} of ${NODES.length}`;
  grid.querySelectorAll('[data-toggle]').forEach(el => el.onclick = () => {
    const id = el.dataset.toggle; collapsed.has(id) ? collapsed.delete(id) : collapsed.add(id);
    renderFamilies(); renderGrid();
  });
  grid.querySelectorAll('.card').forEach(el => {
    el.onclick = () => selectNode(el.dataset.id);
    el.onkeydown = e => { if (e.key === 'Enter' || e.key === ' ') { e.preventDefault(); selectNode(el.dataset.id); } };
  });
  if (current){ const a = grid.querySelector(`.card[data-id="${current}"]`); if (a) a.classList.add('active'); }
}

const q = document.getElementById('q');
q.addEventListener('input', () => { query = q.value.trim().toLowerCase(); renderFamilies(); renderGrid(); });
document.addEventListener('keydown', e => {
  if (e.key === '/' && document.activeElement !== q) { e.preventDefault(); q.focus(); }
  else if (e.key === 'Escape' && document.activeElement === q) { q.value = ''; query = ''; renderFamilies(); renderGrid(); q.blur(); }
});

renderFamilies();
renderGrid();
if (!applyHash()) selectNode('singleton');
