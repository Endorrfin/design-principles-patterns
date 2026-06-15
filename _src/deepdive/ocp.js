// Deep-dive content for OCP. ONE FILE PER CONCEPT (file name = node id) so that
// parallel sessions never touch the same file. Fields documented in CLAUDE.md.
// Base content (name/intent/structure/use/avoid/pros/cons) comes from the map
// node; this adds depth. Code lines are [text, kind]; kind: 'kw' | 'c' | ''.
// Code must NOT contain "<" or ">" (satori-html would read them as tags).

module.exports = {
  remember: `Add new behavior by adding new code, not by editing code that already works.`,
  framing: `"Closed for modification" means a working module's source stays untouched; "open for extension" means new behavior arrives as a new implementation behind a stable abstraction.`,
  why: `Editing tested code to bolt on one more case risks regressing everything that already relied on it. A polymorphic seam lets new variants ship without reopening the old ones.`,
  litmus: `Can you add the next variant without editing an existing class or switch? If every new case means touching the same file, the seam is missing.`,
  refactorLabel: `↓ EXTRACT A POLYMORPHIC SEAM`,
  smell: `Every new shape forces another edit to the same switch:`,
  bad: [
    ['function area(shape) {', 'kw'],
    ['  switch (shape.kind) {', ''],
    ["    case 'circle': return pi * shape.r * shape.r", ''],
    ["    case 'square': return shape.s * shape.s", ''],
    ['  }', ''],
    ['}  // every new shape edits THIS function', 'c'],
  ],
  good: [
    ['interface Shape { area(): number }', 'kw'],
    ['class Circle implements Shape { area() { return pi*this.r*this.r } }', ''],
    ['class Square implements Shape { area() { return this.s*this.s } }', ''],
    ['// new shape = new class; area() callers never change', 'c'],
  ],
  fixNote: `The caller now depends on the Shape abstraction. A new shape is a new file — existing classes and their tests stay closed.`,
  seeAlso: [
    ['strategy', 'the canonical OCP mechanism — swap behavior behind an interface'],
    ['dip', 'point the dependency at the abstraction so extensions plug in'],
    ['protected-variations', 'GRASP’s name for shielding clients from a predicted change point'],
    ['lsp', 'extensions must honor the base contract, or OCP breaks at runtime'],
  ],
  interview: [
    ['Who coined OCP, and how did the meaning shift?', 'Bertrand Meyer (1988) meant inheritance-based extension; Robert Martin reframed it around polymorphic interfaces — extend by implementing an abstraction.'],
    ['Doesn’t OCP conflict with YAGNI?', 'In tension. Don’t add the seam speculatively; introduce it when the second variant actually appears (the rule of three).'],
    ['You can’t be closed against every change — so?', 'Predict the one axis of change from the domain and be open there; accept you will still edit for variations you did not foresee.'],
  ],
  sources: [
    'Bertrand Meyer — "Object-Oriented Software Construction" (1988): the original open/closed formulation',
    'Robert C. Martin — "Agile Software Development, Principles, Patterns, and Practices" (2003): the polymorphic reinterpretation',
  ],
};
