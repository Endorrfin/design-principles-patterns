// Deep-dive content for YAGNI — GOLD STANDARD depth (one file per concept).
// Fields: remember, framing, why, roles, apply, litmus, smell, bad, good,
// refactorLabel, fixNote, pitfalls, examples, seeAlso, interview, sources.
// satori gotchas: code flush-left (indent stripped); no "<"/">" (lone ">"/"=>" ok);
// generics via ⟨⟩; never the literal word "constructor".

module.exports = {
  remember: `Build it when the requirement is real, not when you imagine you might need it.`,

  framing: `YAGNI targets speculative generality — the config switches, plugin points and abstractions added for a future that may never come. It is a statement about timing, not quality: build what today's requirement needs, well, and defer the rest until a real requirement pulls it into existence. It is not licence to skip known near-term needs or basic engineering hygiene.`,

  why: `Speculative features are paid for twice — once to build, then forever to carry in tests, docs and cognitive load — and most guessed-at futures either never arrive or arrive shaped differently than imagined. Worse, the speculative abstraction is usually wrong, so when the real need lands you refactor around a bad guess. Deferring keeps the codebase small, fast to change, and honest about what it actually does.`,

  roles: [
    [`Real requirement`, `A need that exists now — a story, a bug, a committed deliverable. The only legitimate trigger for writing code.`],
    [`Speculative need`, `A "we might want…" future with no current driver. YAGNI says defer it — record it, don't build it.`],
    [`Refactor moment`, `When a speculative need becomes real (the second variant arrives). That is when you introduce the abstraction — now informed by facts.`],
  ],

  apply: [
    `For each abstraction or option, ask: what current requirement forces this? No answer means don't build it.`,
    `Implement the concrete thing today's story needs, cleanly.`,
    `Write deferred ideas down in a backlog instead of coding them.`,
    `When a real second case appears, refactor toward the abstraction (the rule of three).`,
  ],

  litmus: `Is there a real, current requirement for this code path? If the only justification is "we might need it later", defer it.`,
  refactorLabel: `↓ DEFER UNTIL THE NEED IS REAL`,
  smell: `A pluggable channel system built for a single, hypothetical future:`,
  bad: [
    ['class Notifier {', 'kw'],
    ["  channels = []                  // 'pluggable' for an imagined future", 'c'],
    ['  send(msg) { for (const c of this.channels) c.deliver(msg) }', ''],
    ['}', ''],
    ['// only email exists; the abstraction earns nothing yet', 'c'],
  ],
  good: [
    ['class Notifier {', 'kw'],
    ['  send(msg) { sendEmail(msg) }   // the one channel we actually have', ''],
    ['}', ''],
    ['// add the seam when the SECOND channel really arrives', 'c'],
  ],
  fixNote: `Start concrete. When the second channel appears, refactor toward the abstraction (the rule of three) — now driven by a real requirement, not a guess.`,

  pitfalls: [
    `Using YAGNI to skip genuinely-known near-term needs or basic hygiene (logging, error handling) — that is negligence, not YAGNI.`,
    `Building a framework for one use case "to save time later".`,
    `Adding config flags and extension points nobody asked for, then maintaining them forever.`,
  ],

  examples: [
    `Shipping one notification channel (email) instead of a pluggable channel system on day one.`,
    `A concrete function now, promoted to a Strategy only when a second algorithm appears.`,
    `Skipping a generic multi-tenant layer until a second tenant is actually contracted.`,
  ],

  seeAlso: [
    ['kiss', 'deferring speculative work is the main way to keep code simple'],
    ['ocp', 'introduce the extension seam when the second variant actually exists'],
    ['dry', "don't abstract for reuse that doesn't exist yet"],
    ['coi', "prefer the smallest composition that meets today's need"],
  ],

  interview: [
    ['YAGNI vs OCP — contradiction?', 'They balance. YAGNI says do not pre-abstract; OCP says be open at the axis that varies. Resolve with the rule of three: refactor to OCP when the variation actually appears.'],
    ['Where does YAGNI not apply?', 'To genuinely known near-term needs and basic hygiene — logging, error handling, sane boundaries. YAGNI targets speculation, not professionalism.'],
    ['What cost is YAGNI fighting?', 'Carrying cost: every speculative feature is code to maintain, test, document and reason about — paid every day until it is deleted.'],
    ['How do YAGNI, KISS and DRY relate?', 'They pull together: YAGNI removes speculative scope, KISS keeps what remains simple, DRY keeps its knowledge in one place. YAGNI is about when to build; the others about how.'],
  ],

  sources: [
    'Kent Beck — "Extreme Programming Explained" (1999): YAGNI as an XP practice',
    'Martin Fowler — "Yagni" (2015): the cost of building presumptive features',
  ],
};
