// Deep-dive content for DRY — GOLD STANDARD depth (one file per concept).
// Fields: remember, framing, why, roles, apply, litmus, smell, bad, good,
// refactorLabel, fixNote, pitfalls, examples, seeAlso, interview, sources.
// satori gotchas: code flush-left (indent stripped); no "<"/">" (lone ">"/"=>" ok);
// generics via ⟨⟩; never the literal word "constructor".

module.exports = {
  remember: `Every piece of knowledge has one authoritative home in the system.`,

  framing: `DRY is about knowledge, not characters. The real target is a single decision — a business rule, a formula, a schema — that must change in one place. Two snippets that merely look alike but encode different decisions are not duplication; copying the one rule that has to stay consistent is. The test is whether the copies must change together.`,

  why: `When one rule lives in several places, an update fixes some copies and forgets others, and they drift until a bug exposes the inconsistency. A single source means one edit, no divergence, and a clear place to add a test. But the cure has a dark side: deduplicating things that only resemble each other couples them, so DRY is a judgment call, not a reflex.`,

  roles: [
    [`Knowledge`, `A single fact or decision the system encodes — a tax rate, a validation rule, a status enum. The unit DRY actually cares about.`],
    [`Single source`, `The one module that owns that knowledge. Everyone else derives from it (imports the constant, calls the function) rather than restating it.`],
    [`Derivation`, `Anything generated from the source instead of hand-copied — types from a schema, clients from an API spec, docs from code.`],
  ],

  apply: [
    `When you copy-paste, pause: is this the same decision, or just similar-looking code?`,
    `If it is one decision, name it once — a constant, function, type or module — and point callers at it.`,
    `Prefer generating derived artifacts (types, clients) from a single definition over parallel copies.`,
    `If two copies start needing to differ, that is a signal they were never the same knowledge — let them split.`,
  ],

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

  pitfalls: [
    `False DRY: merging two rules that only look alike, then bending the shared code with flags when they diverge.`,
    `Hoisting code into a shared "utils" or base class for reuse, coupling unrelated callers through it.`,
    `Treating DRY as absolute — a little duplication is cheaper than the wrong abstraction (Metz).`,
  ],

  examples: [
    `One source of truth for a status enum, shared by API, DB and UI instead of three literal lists.`,
    `Generating TypeScript types from the OpenAPI or DB schema rather than hand-writing them twice.`,
    `A single validation schema (e.g. Zod) reused on client and server instead of duplicated checks.`,
  ],

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
    ['How does the rule of three apply to DRY?', 'Don’t abstract on the first repetition. By the third real occurrence you can see the true shared shape, so the abstraction fits instead of being guessed from two samples.'],
  ],

  sources: [
    'Andrew Hunt, David Thomas — "The Pragmatic Programmer" (1999): the original DRY definition',
    'Sandi Metz — "The Wrong Abstraction" (2016): prefer duplication over the wrong abstraction',
  ],
};
