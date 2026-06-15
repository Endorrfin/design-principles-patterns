// Deep-dive content for CoI. ONE FILE PER CONCEPT (file name = node id) so that
// parallel sessions never touch the same file. Fields documented in CLAUDE.md.
// Base content (name/intent/structure/use/avoid/pros/cons) comes from the map
// node; this adds depth. Code lines are [text, kind]; kind: 'kw' | 'c' | ''.
// Code must NOT contain "<" or ">" (satori-html would read them as tags).

module.exports = {
  remember: `Reuse behavior by holding objects (has-a), not by extending them (is-a) — unless it is a true is-a.`,
  framing: `Inheritance fixes behavior at compile time and exposes the parent's internals to the child. Composition wires small collaborators at runtime and talks to them through narrow interfaces.`,
  why: `Behavior that varies on several axes turns inheritance into a combinatorial explosion of subclasses, and the fragile base class means a parent edit can silently break descendants.`,
  litmus: `Are you subclassing to reuse code, or to model a true is-a with a shared contract? Reuse-only is a signal to compose instead.`,
  refactorLabel: `↓ INJECT BEHAVIOR AS A COLLABORATOR`,
  smell: `Every combination of abilities needs its own subclass:`,
  bad: [
    ['class Player {}', 'kw'],
    ['class FlyingPlayer extends Player {}', ''],
    ['class SwimmingPlayer extends Player {}', ''],
    ['class FlyingSwimmingPlayer extends Player {}   // explosion', 'c'],
  ],
  good: [
    ['function makePlayer(move) { return { act() { move.go() } } }  // has-a', 'kw'],
    ['makePlayer(new FlyMove())', ''],
    ['makePlayer(new SwimMove())   // mix abilities at runtime, no subclass', 'c'],
  ],
  fixNote: `Abilities become injected strategies. New combinations are wiring, not new classes — and the player no longer depends on any base class internals.`,
  seeAlso: [
    ['strategy', 'the pattern that realizes composition of behavior'],
    ['decorator', 'compose responsibilities by wrapping instead of subclassing'],
    ['lsp', 'use inheritance only where substitutability truly holds'],
    ['dip', 'depend on the collaborator’s interface; inject the concrete one'],
  ],
  interview: [
    ['Why "favor" composition rather than always compose?', 'Inheritance still fits a genuine is-a with a shared, stable contract. Composition wins when behavior varies or you would subclass purely to reuse code.'],
    ['What is the fragile base class problem?', 'Subclasses depend on the parent’s implementation details, so a safe-looking change in the base can break descendants in non-obvious ways.'],
    ['How does this connect to the GoF?', 'They state it directly: "favor object composition over class inheritance." Most patterns lean on composition for exactly this flexibility.'],
  ],
  sources: [
    'Gamma, Helm, Johnson, Vlissides — "Design Patterns" (1994): favor object composition over class inheritance',
    'Joshua Bloch — "Effective Java": item "favor composition over inheritance"',
  ],
};
