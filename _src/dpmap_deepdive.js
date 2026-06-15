// Deep-dive PDF renderer for a non-GoF concept. satori -> resvg, no browser.
// 5 pages (1080x1350) from the map card (dpmap_data.js) + per-concept depth
// (deepdive/<id>.js). One content file per concept -> safe for parallel sessions.
//
//   NODE_PATH=<tools>/node_modules FONTS_DIR=<tools>/node_modules node dpmap_deepdive.js srp
//
// Output: ../<sub-folder>/<id>_slides_en/p1..p5.png  (then img2pdf -> the .pdf)

const fs = require('fs');
const path = require('path');
const satori = require('satori').default;
const { html } = require('satori-html');
const { Resvg } = require('@resvg/resvg-js');
const { GROUPS, SUBS, NODES, SUBFOLDER } = require('./dpmap_data.js');

const FONTS = process.env.FONTS_DIR || path.join(__dirname, 'node_modules');
const FF = p => fs.readFileSync(path.join(FONTS, '@expo-google-fonts', p));
const fonts = [
  { name: 'Inter', data: FF('inter/400Regular/Inter_400Regular.ttf'), weight: 400, style: 'normal' },
  { name: 'Inter', data: FF('inter/500Medium/Inter_500Medium.ttf'), weight: 500, style: 'normal' },
  { name: 'Inter', data: FF('inter/600SemiBold/Inter_600SemiBold.ttf'), weight: 600, style: 'normal' },
  { name: 'SG', data: FF('space-grotesk/700Bold/SpaceGrotesk_700Bold.ttf'), weight: 700, style: 'normal' },
  { name: 'JBM', data: FF('jetbrains-mono/500Medium/JetBrainsMono_500Medium.ttf'), weight: 500, style: 'normal' },
];

const C = { bg: '#0A0A0C', panel: '#141417', panel2: '#0F0F12', line: '#26262C',
  text: '#F4EFE9', mut: '#A39C92', dim: '#6E685F' };
const GREEN = '#7FD18B', RED = '#F0888A', AMBER = '#FFB266';

const id = process.argv[2];
const n = NODES.find(x => x.id === id);
if (!n) { console.error('unknown id:', id); process.exit(1); }
let dd;
try { dd = require(path.join(__dirname, 'deepdive', `${id}.js`)); }
catch (e) { console.error(`no content file: _src/deepdive/${id}.js  (create it, see deepdive/srp.js)`); process.exit(1); }
const GRP = {}; GROUPS.forEach(g => GRP[g.id] = g);
const SUB = {}; SUBS.forEach(s => SUB[s.id] = s);
const sub = SUB[n.sub], group = GRP[n.group], acc = sub.accent;
// CHANGED: hero kind word is data-driven — architectural concepts read as "Pattern",
// principles stay "Principle"; per-concept override via dd.kindWord. Default preserves
// existing principle/grasp/srp output.
const kindWord = dd.kindWord || (group.id === 'architectural' ? 'Pattern' : 'Principle');
// CHANGED: page-3 refactor-arrow label is per-concept; original SRP label kept as fallback
// so principle files that don't set it render exactly as before.
const refactorLabel = dd.refactorLabel || '↓ REFACTOR BY ACTOR';
const byId = i => NODES.find(x => x.id === i);
const TOTAL = 5;

const sectionTitle = t => `<div style="display:flex;align-items:center;">
  <div style="display:flex;width:30px;height:5px;border-radius:2px;background:${acc};margin-right:14px;"></div>
  <div style="display:flex;font-family:SG;font-weight:700;font-size:34px;color:${C.text};">${t}</div></div>`;
const label = t => `<div style="display:flex;font-size:13px;letter-spacing:2px;color:${C.dim};">${t}</div>`;
const codeBlock = lines => {
  const col = k => k === 'kw' ? AMBER : k === 'c' ? '#6E685F' : '#E6E6E6';
  return `<div style="display:flex;flex-direction:column;background:#0C0C0E;border:1px solid ${C.line};border-radius:13px;padding:19px 22px;">
    ${lines.map(([t, k]) => `<div style="display:flex;font-family:JBM;font-size:21px;line-height:1.6;color:${col(k)};">${t}</div>`).join('')}</div>`;
};
const listCol = (lab, items, mark, color) => `<div style="display:flex;flex-direction:column;flex:1;">
  ${label(lab)}<div style="display:flex;flex-direction:column;margin-top:11px;">
  ${items.map(t => `<div style="display:flex;align-items:flex-start;margin:6px 0;">
    <div style="display:flex;color:${color};font-weight:700;font-size:21px;width:24px;flex:0 0 auto;">${mark}</div>
    <div style="display:flex;font-size:21px;color:${C.mut};line-height:1.45;flex:1;">${t}</div></div>`).join('')}</div></div>`;

const stepList = items => `<div style="display:flex;flex-direction:column;margin-top:11px;">${items.map((t, i) => `<div style="display:flex;align-items:flex-start;margin:5px 0;"><div style="display:flex;color:${acc};font-weight:700;font-size:20px;width:30px;flex:0 0 auto;">${i + 1}.</div><div style="display:flex;font-size:21px;color:${C.mut};line-height:1.45;flex:1;">${t}</div></div>`).join('')}</div>`;
const markList = (items, mark, color) => `<div style="display:flex;flex-direction:column;margin-top:11px;">${items.map(t => `<div style="display:flex;align-items:flex-start;margin:5px 0;"><div style="display:flex;color:${color};font-weight:700;font-size:21px;width:24px;flex:0 0 auto;">${mark}</div><div style="display:flex;font-size:21px;color:${C.mut};line-height:1.45;flex:1;">${t}</div></div>`).join('')}</div>`;

function shell(pageNo, body) {
  return `<div style="display:flex;flex-direction:column;width:1080px;height:1350px;background:${C.bg};padding:48px 58px 40px;font-family:Inter;">
    <div style="display:flex;align-items:center;">
      <div style="display:flex;width:9px;height:9px;border-radius:5px;background:${acc};margin-right:11px;"></div>
      <div style="display:flex;font-size:15px;font-weight:600;letter-spacing:3px;color:${C.dim};">DEEP DIVE — ${group.name.toUpperCase()} › ${sub.name.toUpperCase()}</div>
      <div style="display:flex;margin-left:auto;font-family:JBM;font-size:15px;color:${C.dim};">${pageNo} / ${TOTAL}</div>
    </div>
    <div style="display:flex;height:1px;background:${C.line};margin-top:13px;"></div>
    <div style="display:flex;flex-direction:column;flex:1;gap:26px;margin-top:28px;">${body}</div>
    <div style="display:flex;align-items:center;padding-top:13px;border-top:1px solid ${C.line};">
      <div style="display:flex;font-size:14px;color:${C.dim};">Design Principles & Patterns · ${n.name} deep-dive</div>
      <div style="display:flex;align-items:center;margin-left:auto;">
        <div style="display:flex;flex-direction:column;width:22px;height:14px;border-radius:2px;overflow:hidden;margin-right:8px;"><div style="display:flex;flex:1;background:#0057B7;"></div><div style="display:flex;flex:1;background:#FFD700;"></div></div>
        <div style="display:flex;font-size:14px;color:${C.dim};">Vasyl Krupka · Ukraine</div>
      </div>
    </div></div>`;
}

const pages = [
  // 1 — Essence
  shell(1, `
    <div style="display:flex;flex-direction:column;">
      <div style="display:flex;font-family:JBM;font-size:19px;letter-spacing:8px;color:${acc};">${n.name}</div>
      <div style="display:flex;font-family:SG;font-weight:700;font-size:66px;line-height:1.04;color:${C.text};margin-top:12px;">${n.full || n.name}</div>
      <div style="display:flex;font-family:SG;font-weight:700;font-size:66px;line-height:1.04;color:${acc};">${kindWord}</div>
      <div style="display:flex;font-size:24px;color:${C.mut};margin-top:15px;">${n.tag}</div>
    </div>
    <div style="display:flex;flex-direction:column;background:${C.panel};border:1px solid ${C.line};border-left:4px solid ${acc};border-radius:14px;padding:24px 26px;">
      ${label('DEFINITION')}
      <div style="display:flex;font-size:28px;line-height:1.42;color:${C.text};margin-top:11px;">${n.intent}</div>
    </div>
    <div style="display:flex;font-size:23px;line-height:1.52;color:${C.mut};">${dd.framing}</div>
    <div style="display:flex;flex-direction:column;">
      ${label('WHY IT MATTERS')}
      <div style="display:flex;font-size:23px;line-height:1.52;color:${C.text};margin-top:9px;">${dd.why}</div>
    </div>`),

  // 2 — Anatomy & apply
  shell(2, `
    <div style="display:flex;flex-direction:column;">
      ${sectionTitle('How it works')}
      <div style="display:flex;flex-direction:column;margin-top:18px;">
        ${(dd.roles || n.structure).map(([r, d]) => `<div style="display:flex;align-items:flex-start;background:${C.panel};border:1px solid ${C.line};border-radius:14px;padding:17px 22px;margin-bottom:12px;">
          <div style="display:flex;font-family:SG;font-weight:700;font-size:23px;color:${acc};width:220px;flex:0 0 auto;">${r}</div>
          <div style="display:flex;font-size:19px;color:${C.mut};line-height:1.42;flex:1;">${d}</div></div>`).join('')}
      </div>
    </div>
    ${dd.apply ? `<div style="display:flex;flex-direction:column;">
      ${label('HOW TO APPLY')}
      ${stepList(dd.apply)}
    </div>` : ''}
    <div style="display:flex;flex-direction:column;background:${C.panel2};border:1px solid ${C.line};border-left:4px solid ${acc};border-radius:14px;padding:19px 24px;">
      ${label('LITMUS TEST')}
      <div style="display:flex;font-size:22px;line-height:1.45;color:${C.text};margin-top:9px;">${dd.litmus}</div>
    </div>`),

  // 3 — Smell -> Fix
  shell(3, `
    <div style="display:flex;flex-direction:column;">
      ${sectionTitle('Smell → fix')}
      <div style="display:flex;font-size:21px;color:${C.mut};margin-top:18px;">${dd.smell}</div>
      <div style="display:flex;margin-top:13px;">${codeBlock(dd.bad)}</div>
      <div style="display:flex;align-items:center;justify-content:center;margin:15px 0;">
        <div style="display:flex;font-family:JBM;font-size:15px;letter-spacing:3px;color:${acc};">${refactorLabel}</div>
      </div>
      <div style="display:flex;">${codeBlock(dd.good)}</div>
      <div style="display:flex;font-size:19px;color:${C.mut};line-height:1.45;margin-top:15px;">${dd.fixNote}</div>
    </div>
    <div style="display:flex;gap:30px;">
      ${listCol('USE WHEN', n.use, '✓', GREEN)}
      ${listCol('AVOID WHEN', n.avoid, '▲', AMBER)}
    </div>`),

  // 4 — Trade-offs, pitfalls & relations
  shell(4, `
    <div style="display:flex;flex-direction:column;">
      ${sectionTitle('Trade-offs & pitfalls')}
      <div style="display:flex;gap:30px;margin-top:20px;">
        ${listCol('PROS', n.pros, '+', GREEN)}
        ${listCol('CONS', n.cons, '–', RED)}
      </div>
      ${dd.pitfalls ? `<div style="display:flex;flex-direction:column;margin-top:22px;">
        ${label('COMMON PITFALLS')}
        ${markList(dd.pitfalls, '▲', AMBER)}
      </div>` : ''}
    </div>
    ${dd.examples ? `<div style="display:flex;flex-direction:column;">
      ${label('WHERE YOU SEE IT')}
      ${markList(dd.examples, '▸', acc)}
    </div>` : ''}
    <div style="display:flex;flex-direction:column;">
      ${label('SEE ALSO')}
      <div style="display:flex;flex-direction:column;margin-top:13px;">
        ${dd.seeAlso.map(([rid, why]) => { const m = byId(rid); return `<div style="display:flex;align-items:flex-start;margin:9px 0;">
          <div style="display:flex;font-weight:600;font-size:22px;color:${(SUB[m.sub] || {}).accent || acc};width:250px;flex:0 0 auto;">${m.name}</div>
          <div style="display:flex;font-size:21px;color:${C.mut};line-height:1.42;flex:1;">${why}</div></div>`; }).join('')}
      </div>
    </div>`),

  // 5 — Interview, remember & sources
  shell(5, `
    <div style="display:flex;flex-direction:column;">
      ${sectionTitle('Interview & sources')}
      <div style="display:flex;flex-direction:column;margin-top:20px;">
        ${dd.interview.map(([q, a]) => `<div style="display:flex;flex-direction:column;border-left:3px solid ${acc};padding-left:16px;margin-bottom:20px;">
          <div style="display:flex;font-size:23px;font-weight:600;color:${C.text};">${q}</div>
          <div style="display:flex;font-size:21px;color:${C.mut};line-height:1.45;margin-top:6px;">${a}</div></div>`).join('')}
      </div>
    </div>
    <div style="display:flex;flex-direction:column;">
      <div style="display:flex;flex-direction:column;background:${C.panel};border:1px solid ${C.line};border-left:4px solid ${acc};border-radius:14px;padding:22px 24px;">
        ${label('REMEMBER')}
        <div style="display:flex;font-size:26px;line-height:1.45;color:${C.text};margin-top:11px;">${dd.remember}</div>
      </div>
      <div style="display:flex;flex-direction:column;margin-top:24px;">
        ${label('SOURCES')}
        <div style="display:flex;flex-direction:column;margin-top:10px;">
          ${dd.sources.map(s => `<div style="display:flex;font-size:18px;color:${C.mut};line-height:1.5;margin:3px 0;">${s}</div>`).join('')}
        </div>
      </div>
    </div>`),
];

async function render(markup, out) {
  const svg = await satori(html(markup), { width: 1080, height: 1350, fonts });
  fs.writeFileSync(out, new Resvg(svg, { fitTo: { mode: 'zoom', value: 2 } }).render().asPng());
}

(async () => {
  const folder = SUBFOLDER[n.sub];
  if (!folder) { console.error('no folder mapping for sub:', n.sub); process.exit(1); }
  const dir = path.join(__dirname, '..', folder, `${id}_slides_en`);
  fs.mkdirSync(dir, { recursive: true });
  for (let i = 0; i < pages.length; i++) await render(pages[i], path.join(dir, `p${i + 1}.png`));
  console.log(`Rendered ${pages.length} pages -> ${folder}/${id}_slides_en/`);
})();
