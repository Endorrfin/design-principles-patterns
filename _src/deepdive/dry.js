// Deep-dive content for DRY. ONE FILE PER CONCEPT (file name = node id) so that
// parallel sessions never touch the same file. Fields documented in CLAUDE.md.
// Base content (name/intent/structure/use/avoid/pros/cons) comes from the map
// node; this adds depth. Code lines are [text, kind]; kind: 'kw' | 'c' | ''.
// Code must NOT contain "<" or ">" (satori-html would read them as tags).

module.exports = {
  remember: `Every piece of knowledge has one authoritative home in the system.`,
  framing: `DRY is about knowledge, not text. Two blocks that merely look alike are fine; two copies of the same decision — the rule that must change together — are the duplication that bites.`,
  why: `When one rule lives in several places, a change updates some copies and misses others, and they silently drift. One source means one edit and no divergence bugs.`,
  litmus: `If this rule changed, how many places would I edit? More than one means the knowledge is duplicated. Then ask: must the copies change together, or do they only match today?`,
  refactorLabel: `↓ EXTRACT THE SINGLE SOURCE OF TRUTH`,
  smell: `The 20% VAT rule is hard-coded in three modules:`,
  bad: [
    ['const price = net + net * 0.2        // checkout', 'c'],
    ['const due   = subtotal + subtotal * 0.2  // invoice', 'c'],
    ['const tax   = amount * 0.2           // report', 'c'],
    ['// change the rate and you must find every copy', ''],
  ],
  good: [
    ['const VAT_RATE = 0.2                  // one source of knowledge', 'kw'],
    ['function withVat(net) { return net + net * VAT_RATE }', ''],
    ['// checkout, invoice and report all call withVat()', 'c'],
  ],
  fixNote: `The rate lives in one constant behind one function. When VAT changes, exactly one line changes — and no caller can drift out of sync.`,
  seeAlso: [
    ['soc', 'put each kind of knowledge in the module that owns that concern'],
    ['srp', 'a single owner per responsibility naturally avoids duplicated rules'],
    ['kiss', 'one source is simpler to reason about and to change'],
    ['ocp', 'centralized knowledge is easier to extend without scattering edits'],
  ],
  interview: [
    ['When is duplication better than DRY?', 'When the similarity is coincidental. Coupling two unrelated rules because they look alike — "the wrong abstraction" — is worse than a little repetition.'],
    ['How do you tell true from false duplication?', 'Ask whether the copies must change together for the same reason. If yes, it is knowledge duplication; if they only happen to match, leave them apart.'],
    ['Does DRY apply beyond code?', 'Yes — schema, config, docs and build steps too. Generate derived artifacts from one definition instead of maintaining parallel copies.'],
  ],
  sources: [
    'Andrew Hunt, David Thomas — "The Pragmatic Programmer" (1999): the original DRY definition',
    'Sandi Metz — "The Wrong Abstraction" (2016): prefer duplication over the wrong abstraction',
  ],
};
