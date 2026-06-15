// Deep-dive content linter / progress tracker.
//   node dd_lint.js
// Checks every _src/deepdive/<id>.js against the GOLD standard (deepdive/srp.js)
// and reports which files are complete and which still need the deeper fields.
// Use it before/after re-authoring so all 26 non-GoF deep-dives stay consistent.

const fs = require('fs');
const path = require('path');
const dir = path.join(__dirname, 'deepdive');

const BASE = ['remember', 'framing', 'why', 'litmus', 'smell', 'bad', 'good', 'fixNote', 'seeAlso', 'interview', 'sources'];
const DEEP = ['roles', 'apply', 'pitfalls', 'examples'];   // gold-standard depth (the new fields)
const has = (dd, k) => dd[k] !== undefined && dd[k] !== '' && !(Array.isArray(dd[k]) && dd[k].length === 0);

const files = fs.existsSync(dir) ? fs.readdirSync(dir).filter(f => f.endsWith('.js')).sort() : [];
let gold = 0, shallow = 0, broken = 0;

for (const f of files) {
  const id = f.replace(/\.js$/, '');
  let dd;
  try { dd = require(path.join(dir, f)); }
  catch (e) { console.log(`  ✗ ${id.padEnd(22)} ERROR: ${e.message}`); broken++; continue; }
  const missBase = BASE.filter(k => !has(dd, k));
  const missDeep = DEEP.filter(k => !has(dd, k));
  const nInt = Array.isArray(dd.interview) ? dd.interview.length : 0;
  if (!missBase.length && !missDeep.length && nInt >= 3) {
    console.log(`  ✓ ${id.padEnd(22)} GOLD (interview ${nInt})`);
    gold++;
  } else {
    shallow++;
    const notes = [];
    if (missDeep.length) notes.push(`add: ${missDeep.join(', ')}`);
    if (missBase.length) notes.push(`missing: ${missBase.join(', ')}`);
    if (nInt < 3) notes.push(`interview ${nInt} (<3)`);
    console.log(`  ✗ ${id.padEnd(22)} ${notes.join(' · ')}`);
  }
}

console.log(`\n${files.length} content files — ${gold} at gold standard, ${shallow} need deepening` +
  (broken ? `, ${broken} broken` : '') + '.');
process.exit(shallow || broken ? 1 : 0);
