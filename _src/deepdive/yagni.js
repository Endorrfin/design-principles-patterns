// Deep-dive content for YAGNI. ONE FILE PER CONCEPT (file name = node id) so that
// parallel sessions never touch the same file. Fields documented in CLAUDE.md.
// Base content (name/intent/structure/use/avoid/pros/cons) comes from the map
// node; this adds depth. Code lines are [text, kind]; kind: 'kw' | 'c' | ''.
// Code must NOT contain "<" or ">" (satori-html would read them as tags).

module.exports = {
  remember: `Build it when the requirement is real, not when you imagine you might need it.`,
  framing: `YAGNI targets speculative generality — config, hooks and abstractions added for futures that may never arrive. It is not licence to skip known near-term needs or basic hygiene.`,
  why: `Speculative features cost twice: to build now and to carry forever in tests, docs and bugs. Most guessed-at futures never arrive, or arrive different from the guess.`,
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
  ],
  sources: [
    'Kent Beck — "Extreme Programming Explained" (1999): YAGNI as an XP practice',
    'Martin Fowler — "Yagni" (2015): the cost of building presumptive features',
  ],
};
