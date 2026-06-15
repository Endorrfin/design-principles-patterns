// Deep-dive content for KISS. ONE FILE PER CONCEPT (file name = node id) so that
// parallel sessions never touch the same file. Fields documented in CLAUDE.md.
// Base content (name/intent/structure/use/avoid/pros/cons) comes from the map
// node; this adds depth. Code lines are [text, kind]; kind: 'kw' | 'c' | ''.
// Code must NOT contain "<" or ">" (satori-html would read them as tags).

module.exports = {
  remember: `Reach for the simplest thing that fully solves the problem — complexity must earn its place.`,
  framing: `"Simple" means the fewest moving parts a reader must hold in their head, not the fewest characters. Clever and terse is often the opposite of simple.`,
  why: `Most of a system's cost is reading and changing it later. Needless cleverness, layers and indirection tax every future maintainer — usually for flexibility you never use.`,
  litmus: `Could a new teammate follow this in one pass? Is each abstraction paying for itself with a concrete, present need? If not, simplify.`,
  refactorLabel: `↓ CHOOSE THE OBVIOUS SOLUTION`,
  smell: `Bit-twiddling and puzzle operators make the reader stop and decode:`,
  bad: [
    ['function isEven(n) { return !(n & 1) }   // bitwise trick', 'c'],
    ['const found = !!~list.indexOf(x)         // !!~ puzzle', 'c'],
  ],
  good: [
    ['function isEven(n) { return n % 2 === 0 }  // says what it means', 'kw'],
    ['const found = list.includes(x)             // intent is obvious', ''],
  ],
  fixNote: `Same behavior, but each line states its intent. Keep the clever version only for a proven hot path, with a comment explaining why it earns its keep.`,
  seeAlso: [
    ['yagni', "don't build for needs you don't have yet — the main source of complexity"],
    ['dry', 'one clear source is simpler than scattered copies'],
    ['soc', 'separating concerns keeps each part individually simple'],
    ['coi', 'small composed parts beat deep inheritance trees'],
  ],
  interview: [
    ['Is KISS at odds with design patterns?', 'Patterns add structure and indirection. They earn their place when complexity is real; applied preemptively they violate KISS and YAGNI.'],
    ['"Simple" is subjective — how do you make it concrete?', 'Proxy it: fewer concepts to learn, fewer branches, shorter call chains, readable in one pass. Optimize for the next reader, not the compiler.'],
    ["Where's the limit of KISS?", 'Do not oversimplify past real requirements. Essential complexity must be modeled; KISS targets the accidental kind we add ourselves.'],
  ],
  sources: [
    'Often attributed to Kelly Johnson (Lockheed Skunk Works): "keep it simple, stupid"',
    'Brian Kernighan, P.J. Plauger — "The Elements of Programming Style" (1978): write clearly, debugging is harder than writing',
  ],
};
