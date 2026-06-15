// Shared UI layer for both prototypes (read as raw text by dpmap_build.js).
// Injected globals: GROUPS, SUBS, NODES. Provides STYLE + helpers + detail panel.

const STYLE = `
*{box-sizing:border-box}
html,body{margin:0;background:var(--bg);color:var(--tx);
  font-family:'Inter',system-ui,-apple-system,'Segoe UI',Roboto,'DejaVu Sans',sans-serif;
  -webkit-font-smoothing:antialiased}
:root{--bg:#0A0A0A;--surface:#161616;--s2:#1E1E1E;--line:#2A2A2A;--line2:#383838;
  --tx:#F5F5F5;--tx2:#9CA3AF;--tx3:#6B7280;--accent:#FF7A00;--accent2:#FFA94D}
h1,h2,h3{font-family:'Space Grotesk','Inter',system-ui,sans-serif;font-weight:600;margin:0}
a{color:var(--accent2)}
.sr-only{position:absolute;width:1px;height:1px;overflow:hidden;clip:rect(0 0 0 0);white-space:nowrap}
::-webkit-scrollbar{width:10px;height:10px}
::-webkit-scrollbar-thumb{background:#2A2A2A;border-radius:6px}
::-webkit-scrollbar-thumb:hover{background:#383838}
::-webkit-scrollbar-track{background:transparent}

.bar{position:sticky;top:0;z-index:20;display:flex;justify-content:space-between;align-items:center;
  gap:16px;padding:11px 18px;background:rgba(10,10,10,.88);backdrop-filter:blur(8px);border-bottom:1px solid var(--line)}
.brand{display:flex;align-items:center;gap:11px}
.logo{width:30px;height:30px;border-radius:8px;background:var(--accent);color:#120A04;
  display:flex;align-items:center;justify-content:center;font-weight:700;font-size:16px;flex:0 0 auto}
.brand h1{font-size:18px;letter-spacing:.2px}
.brand .sub{font-size:12px;color:var(--tx2);margin-top:1px}
.tools{display:flex;align-items:center;gap:12px}
.search{background:var(--surface);border:1px solid var(--line);border-radius:9px;color:var(--tx);
  font-size:13px;padding:8px 12px;width:230px;outline:none}
.search:focus{border-color:var(--accent)}
.search::placeholder{color:var(--tx3)}
.count{font-size:12px;color:var(--tx3);white-space:nowrap}

.families{display:flex;flex-wrap:wrap;gap:8px;align-items:center;padding:12px 18px;border-bottom:1px solid var(--line)}
.fam{display:inline-flex;align-items:center;gap:7px;background:var(--surface);border:1px solid var(--line);
  border-radius:999px;padding:6px 13px;font-size:12.5px;color:var(--tx2);cursor:pointer;transition:all .12s}
.fam:hover{border-color:var(--line2);color:var(--tx)}
.fam.active{color:var(--tx);background:var(--s2)}
.fam .dot{width:8px;height:8px;border-radius:50%;flex:0 0 auto}
.fam .c{font-size:11px;color:var(--tx3)}
.exall{margin-left:auto;font-size:12px;color:var(--tx2);background:none;border:none;cursor:pointer;padding:6px 4px}
.exall:hover{color:var(--tx)}

.content{display:flex;gap:18px;padding:18px;max-width:1240px;margin:0 auto;align-items:flex-start}
.grid{flex:1;min-width:0;display:flex;flex-direction:column;gap:14px}
.section{border:1px solid var(--line);border-radius:13px;background:#121212;overflow:hidden}
.section h3{font-size:13px;color:var(--tx);font-weight:600;margin:0;padding:13px 15px;display:flex;
  align-items:center;gap:9px;cursor:pointer;user-select:none}
.section h3:hover{background:var(--s2)}
.section h3 .gdot{width:10px;height:10px;border-radius:50%;flex:0 0 auto}
.section h3 .scount{color:var(--tx3);font-weight:400;font-size:12px}
.section h3 .chev{margin-left:auto;color:var(--tx3);font-size:11px;transition:transform .12s}
.section .body{padding:4px 15px 15px}
.subsection{margin-top:22px;padding-top:15px;border-top:1px solid var(--line)}
.subsection:first-child{margin-top:6px;padding-top:0;border-top:none}
.subhead{font-size:12.5px;color:var(--tx);text-transform:uppercase;letter-spacing:.09em;font-weight:600;
  margin:0 0 12px;display:flex;align-items:center;gap:10px;cursor:pointer;user-select:none}
.subhead:hover{color:var(--accent2)}
.subhead .tick{width:22px;height:4px;border-radius:2px;flex:0 0 auto}
.subhead .sn{color:var(--tx3);font-weight:400;letter-spacing:0}
.subhead .chev{margin-left:6px;color:var(--tx3);font-size:10px}
.cardgrid{display:grid;grid-template-columns:repeat(auto-fill,minmax(168px,1fr));gap:10px}
.card{background:var(--surface);border:1px solid var(--line);border-left:3px solid var(--line2);
  border-radius:10px;padding:10px 12px;cursor:pointer;transition:all .12s}
.card:hover{background:var(--s2);border-color:var(--line2);transform:translateY(-1px)}
.card.active{outline:2px solid var(--accent);outline-offset:1px;background:var(--s2)}
.card .nm{font-weight:600;font-size:14px;color:var(--tx);line-height:1.2}
.card .tg{font-size:12px;color:var(--tx2);margin-top:4px;line-height:1.35}

.detail{width:362px;flex:0 0 auto;background:var(--surface);border:1px solid var(--line);border-radius:13px;
  padding:17px 18px;position:sticky;top:74px;max-height:calc(100vh - 92px);overflow:auto}
.detail .pill{display:inline-block;font-size:11px;font-weight:600;padding:3px 10px;border-radius:999px;margin-bottom:9px}
.detail .subpill{font-size:11px;color:var(--tx3);margin-left:8px}
.detail h2{font-size:21px;line-height:1.1}
.detail .full{font-size:13px;color:var(--tx2);margin-top:3px}
.detail .tag{font-size:13px;color:var(--tx2);margin-top:5px}
.d-intent{font-size:14px;line-height:1.55;color:var(--tx);margin:12px 0 4px}
.blk{margin:14px 0}
.lbl{font-size:11px;text-transform:uppercase;letter-spacing:.07em;color:var(--tx3);margin-bottom:7px}
.row{display:flex;gap:8px;font-size:13px;line-height:1.5;margin:4px 0;color:var(--tx2)}
.row .role{font-weight:600;flex:0 0 auto}
.row .mk{font-weight:700;flex:0 0 13px;text-align:center}
.cols{display:grid;grid-template-columns:1fr 1fr;gap:8px 16px}
.code{background:#0C0C0C;border:1px solid var(--line);border-radius:9px;padding:11px 13px;margin:0;
  font-family:'JetBrains Mono',ui-monospace,'DejaVu Sans Mono',monospace;font-size:12px;line-height:1.55;
  color:#E5E7EB;overflow-x:auto;white-space:pre}
.codewrap{position:relative}
.copy{position:absolute;top:7px;right:8px;font-size:11px;color:var(--tx2);background:var(--s2);
  border:1px solid var(--line);border-radius:6px;padding:3px 8px;cursor:pointer}
.copy:hover{border-color:var(--line2);color:var(--tx)}
.qa{border-left:2px solid var(--accent);padding:2px 0 2px 12px;margin:15px 0}
.qa .q{font-size:13px;font-weight:600;color:var(--tx)}
.qa .a{font-size:13px;color:var(--tx2);line-height:1.5;margin-top:4px}
.chips{display:flex;flex-wrap:wrap;gap:6px}
.chip{display:inline-flex;align-items:center;gap:7px;background:var(--s2);border:1px solid var(--line);
  border-radius:999px;padding:5px 11px;font-size:12px;color:var(--tx);cursor:pointer}
.chip:hover{border-color:var(--line2)}
.chip .dot{width:7px;height:7px;border-radius:50%}
.dd-row{margin-top:16px;padding-top:14px;border-top:1px solid var(--line)}
.dd{display:inline-flex;align-items:center;gap:7px;font-size:13px;color:var(--accent2);text-decoration:none;
  border:1px solid var(--line2);border-radius:9px;padding:8px 13px}
.dd:hover{border-color:var(--accent)}
.dd-none{font-size:12px;color:var(--tx3)}

@media (max-width:880px){
  .content{flex-direction:column}
  .detail{position:static;width:auto;max-height:none;align-self:stretch}
  .search{width:150px}
}
`;

const GRP = {}; GROUPS.forEach(g => GRP[g.id] = g);
const SUB = {}; SUBS.forEach(s => SUB[s.id] = s);
const byId = id => NODES.find(n => n.id === id);
const subsOfGroup = gid => SUBS.filter(s => s.group === gid);
const nodesOfSub = sid => NODES.filter(n => n.sub === sid);
const accentOf = n => SUB[n.sub].accent;
function esc(s){ return String(s).replace(/[&<>"]/g, c => ({'&':'&amp;','<':'&lt;','>':'&gt;','"':'&quot;'}[c])); }

let onSelect = null;
let current = null;

function detailHTML(n){
  const g = GRP[n.group], s = SUB[n.sub], ac = s.accent, tint = ac + '22';
  const mkRow = (mark, col, t) =>
    `<div class="row"><span class="mk" style="color:${col}">${mark}</span><span>${esc(t)}</span></div>`;
  const list = (label, items, mark, col) => (items && items.length)
    ? `<div class="blk"><div class="lbl">${label}</div>${items.map(t => mkRow(mark, col, t)).join('')}</div>` : '';
  const rel = n.rel.map(id => { const m = byId(id); return m
    ? `<button class="chip" data-go="${m.id}"><span class="dot" style="background:${accentOf(m)}"></span>${esc(m.name)}</button>` : ''
  }).join('');
  return `
    <div class="d-head">
      <span class="pill" style="background:${tint};color:${ac}">${esc(g.name)}</span><span class="subpill">${esc(s.name)}</span>
      <h2>${esc(n.name)}</h2>
      ${n.full ? `<div class="full">${esc(n.full)}</div>` : ''}
      <div class="tag">${esc(n.tag)}</div>
    </div>
    <p class="d-intent">${esc(n.intent)}</p>
    <div class="blk"><div class="lbl">Structure</div>
      ${n.structure.map(x => `<div class="row"><span class="role" style="color:${ac}">${esc(x[0])}</span><span>${esc(x[1])}</span></div>`).join('')}
    </div>
    <div class="cols">
      ${list('Use when', n.use, '✓', '#4ADE80')}
      ${list('Avoid when', n.avoid, '▲', '#FB923C')}
    </div>
    <div class="cols">
      ${list('Pros', n.pros, '+', '#4ADE80')}
      ${list('Cons', n.cons, '–', '#F87171')}
    </div>
    <div class="blk"><div class="lbl">Code sketch</div><div class="codewrap"><button class="copy" type="button">Copy</button><pre class="code">${esc(n.code)}</pre></div></div>
    <div class="qa" style="border-color:${ac}">
      <div class="q">${esc(n.q)}</div><div class="a">${esc(n.a)}</div>
    </div>
    <div class="blk"><div class="lbl">See also</div><div class="chips">${rel}</div></div>
    <div class="dd-row">
      ${n.pdf ? `<a class="dd" href="${encodeURI(n.pdf)}" target="_blank" rel="noopener">Open deep-dive ↗</a>`
              : `<span class="dd-none">Deep-dive poster coming soon</span>`}
    </div>`;
}

function selectNode(id){
  const n = byId(id); if (!n) return;
  current = id;
  const d = document.getElementById('detail');
  if (!d) return;
  d.innerHTML = detailHTML(n);
  d.scrollTop = 0;
  d.querySelectorAll('[data-go]').forEach(b => b.onclick = () => selectNode(b.dataset.go));
  const cb = d.querySelector('.copy');
  if (cb) cb.onclick = () => {
    if (navigator.clipboard) navigator.clipboard.writeText(n.code)
      .then(() => { cb.textContent = 'Copied'; setTimeout(() => cb.textContent = 'Copy', 1200); }).catch(() => {});
  };
  if (decodeURIComponent(location.hash.slice(1)) !== id) {
    try { history.replaceState(null, '', '#' + id); } catch (e) { try { location.hash = id; } catch (e2) {} }
  }
  document.querySelectorAll('[data-id]').forEach(el => {
    const on = el.dataset.id === id;
    el.classList.toggle('active', on);
    if (on) el.setAttribute('aria-current', 'true'); else el.removeAttribute('aria-current');
  });
  if (typeof onSelect === 'function') onSelect(n);
}

// Shareable deep-links: e.g. dpmap_hybrid.html#strategy opens that concept.
function applyHash(){
  const id = decodeURIComponent(location.hash.slice(1));
  if (id && byId(id)){ selectNode(id); return true; }
  return false;
}
window.addEventListener('hashchange', () => {
  const id = decodeURIComponent(location.hash.slice(1));
  if (id && byId(id) && id !== current) selectNode(id);
});

document.head.insertAdjacentHTML('beforeend', '<style>' + STYLE + '</style>');
