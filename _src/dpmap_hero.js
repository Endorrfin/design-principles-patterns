// LinkedIn assets for the Design Principles & Patterns map.
// satori (flex -> SVG) + resvg (SVG -> PNG), no browser. Renders a 1080x1350
// hero plus staged reveal frames; ffmpeg stitches the frames into an MP4.
//
//   NODE_PATH=<tools>/node_modules FONTS_DIR=<tools>/node_modules node dpmap_hero.js
//
// Outputs into ../linkedin/ : dpmap_hero_en.png, frames/stage_*.png

const fs = require('fs');
const path = require('path');
const satori = require('satori').default;
const { html } = require('satori-html');
const { Resvg } = require('@resvg/resvg-js');
const { GROUPS, SUBS, NODES } = require('./dpmap_data.js');

const FONTS = process.env.FONTS_DIR || path.join(__dirname, 'node_modules');
const FF = p => fs.readFileSync(path.join(FONTS, '@expo-google-fonts', p));
const fonts = [
  { name: 'Inter', data: FF('inter/400Regular/Inter_400Regular.ttf'), weight: 400, style: 'normal' },
  { name: 'Inter', data: FF('inter/500Medium/Inter_500Medium.ttf'), weight: 500, style: 'normal' },
  { name: 'Inter', data: FF('inter/600SemiBold/Inter_600SemiBold.ttf'), weight: 600, style: 'normal' },
  { name: 'SG', data: FF('space-grotesk/500Medium/SpaceGrotesk_500Medium.ttf'), weight: 500, style: 'normal' },
  { name: 'SG', data: FF('space-grotesk/700Bold/SpaceGrotesk_700Bold.ttf'), weight: 700, style: 'normal' },
];

const C = { bg: '#0A0A0C', panel: '#141417', panel2: '#0F0F12', line: '#26262C',
  orange: '#FF7A1A', text: '#F4EFE9', mut: '#9C968D', dim: '#6E685F' };
const GA = {}; GROUPS.forEach(g => GA[g.id] = g.accent);   // derive from data (stays in sync)
const SA = {}; SUBS.forEach(s => SA[s.id] = s.accent);

const subsOf = g => SUBS.filter(s => s.group === g);
const namesOf = sid => NODES.filter(n => n.sub === sid).map(n => n.name);
const countOf = g => NODES.filter(n => n.group === g).length;

function tile(num, label) {
  return `<div style="display:flex;flex-direction:column;flex:1;background:${C.panel};border:1px solid ${C.line};border-radius:14px;padding:16px 18px;">
    <div style="display:flex;font-family:SG;font-weight:700;font-size:42px;color:${C.orange};">${num}</div>
    <div style="display:flex;font-size:17px;color:${C.mut};margin-top:2px;">${label}</div>
  </div>`;
}

function subRow(s) {
  return `<div style="display:flex;flex-direction:column;">
    <div style="display:flex;font-size:15px;font-weight:600;letter-spacing:1px;color:${SA[s.id]};">${s.name.toUpperCase()} · ${namesOf(s.id).length}</div>
    <div style="display:flex;font-size:18px;color:${C.mut};line-height:1.3;margin-top:2px;">${namesOf(s.id).join('   ·   ')}</div>
  </div>`;
}

function groupCard(g, revealed) {
  const subs = subsOf(g.id).map(subRow).join('');
  return `<div style="display:flex;flex-direction:column;background:${C.panel};border:1px solid ${C.line};border-radius:18px;padding:18px 22px;opacity:${revealed ? 1 : 0};">
    <div style="display:flex;align-items:center;">
      <div style="display:flex;width:13px;height:13px;border-radius:7px;background:${GA[g.id]};margin-right:12px;"></div>
      <div style="display:flex;font-family:SG;font-weight:700;font-size:29px;color:${C.text};">${g.name}</div>
      <div style="display:flex;margin-left:12px;font-size:17px;color:${C.dim};">${countOf(g.id)} concepts</div>
    </div>
    <div style="display:flex;flex-direction:column;gap:9px;margin-top:13px;">${subs}</div>
  </div>`;
}

function frame(stage) {
  return `<div style="display:flex;flex-direction:column;width:1080px;height:1350px;background:${C.bg};padding:58px 58px 46px;font-family:Inter;">
    <div style="display:flex;flex-direction:column;">
      <div style="display:flex;color:${C.dim};font-size:19px;font-weight:600;letter-spacing:4px;">THE COMPLETE MAP — 49 CONCEPTS</div>
      <div style="display:flex;margin-top:12px;font-family:SG;font-weight:700;font-size:66px;line-height:1.04;color:${C.text};">Design Principles</div>
      <div style="display:flex;font-family:SG;font-weight:700;font-size:66px;line-height:1.04;color:${C.orange};">& Patterns</div>
    </div>
    <div style="display:flex;gap:13px;margin-top:26px;">
      ${tile('49', 'concepts')}${tile('23', 'GoF patterns')}${tile('9', 'GRASP')}${tile('5', 'SOLID')}
    </div>
    <div style="display:flex;flex-direction:column;gap:15px;margin-top:22px;">
      ${groupCard(GROUPS[0], stage >= 1)}
      ${groupCard(GROUPS[1], stage >= 2)}
      ${groupCard(GROUPS[2], stage >= 3)}
    </div>
    <div style="display:flex;margin-top:auto;font-size:20px;color:${C.mut};">Tap any concept → intent · structure · trade-offs · code · interview Q</div>
    <div style="display:flex;justify-content:space-between;margin-top:14px;">
      <div style="display:flex;font-size:16px;color:${C.dim};">Source: GoF (1994) · R. C. Martin (SOLID) · 2026-06-15</div>
      <div style="display:flex;font-size:16px;color:${C.dim};">Vasyl Krupka · Senior Fullstack Engineer</div>
    </div>
  </div>`;
}

async function renderPNG(markup, zoom, outPath) {
  const svg = await satori(html(markup), { width: 1080, height: 1350, fonts });
  const png = new Resvg(svg, { fitTo: { mode: 'zoom', value: zoom } }).render().asPng();
  fs.writeFileSync(outPath, png);
  return outPath;
}

(async () => {
  const OUT = path.join(__dirname, '..', 'linkedin');
  const FR = path.join(OUT, 'frames');
  fs.mkdirSync(FR, { recursive: true });
  for (let s = 0; s <= 3; s++) await renderPNG(frame(s), 1, path.join(FR, `stage_${s}.png`));
  await renderPNG(frame(3), 2, path.join(OUT, 'dpmap_hero_en.png'));
  console.log('Rendered: linkedin/dpmap_hero_en.png (2x) + frames/stage_0..3.png');
})();
