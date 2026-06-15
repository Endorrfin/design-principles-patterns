// Deep-dive content for Polymorphism (GRASP). ONE FILE PER CONCEPT.
// Base content comes from the map node; this adds depth.
// Code lines are [text, kind]; kind: 'kw' | 'c' | ''. No "<", ">" or "=>".

module.exports = {
  remember: `When behaviour varies by type, let the type decide — not an if or switch.`,
  framing: `When related alternatives differ by type, give them a common operation and one implementation per type. Clients call the operation; the runtime dispatches to the right variant. The conditional disappears into the type system.`,
  why: `Type-checking conditionals (switch on a kind field) repeat everywhere the behaviour is used and must be edited for every new type — fragile and easy to miss one. Polymorphic dispatch centralises each variant and makes adding a type an additive change (OCP).`,
  litmus: `Do you switch on a type tag or use instanceof in more than one place? Each such ladder is a candidate to replace with a polymorphic operation.`,
  smell: `A switch on a kind field — every new shape forces an edit here and everywhere it is used:`,
  refactorLabel: `↓ DISPATCH ON THE TYPE`,
  bad: [
    [`function area(s: Shape) {`, 'kw'],
    [`  switch (s.kind) {              // edit for every new type`, 'c'],
    [`    case 'circle': return Math.PI * s.r * s.r`, ''],
    [`    case 'square': return s.side * s.side`, ''],
    [`  }`, ''],
    [`}`, 'kw'],
  ],
  good: [
    [`interface Shape { area(): number }`, 'kw'],
    [`class Circle implements Shape {`, 'kw'],
    [`  area() { return Math.PI * this.r * this.r }`, ''],
    [`}`, 'kw'],
    [`// client calls shape.area() — runtime picks the variant`, 'c'],
  ],
  fixNote: `Each shape (Circle, Square, ...) owns its formula; the client never checks types. A new shape is a new class — no existing code changes (Open/Closed).`,
  seeAlso: [
    ['ocp', `polymorphic variants are what you extend without editing callers`],
    ['strategy', `a GoF pattern that applies polymorphism to swap algorithms`],
    ['state', `applies polymorphism to swap behaviour as state changes`],
    ['lsp', `variants must be substitutable for the interface, or dispatch breaks`],
  ],
  interview: [
    [`Polymorphism (GRASP) vs Strategy (GoF)?`, `GRASP Polymorphism is the principle (replace type checks with subtype dispatch). Strategy and State are patterns that apply it to swap algorithms or states.`],
    [`Is every conditional bad?`, `No — only repeated branching on a type or kind. Branching on values, validation, or a one-off check is fine. Polymorphism pays off when the same type-switch recurs and grows.`],
    [`Downside of polymorphism?`, `More classes and indirection; logic spreads across types, so one variant is easy to read but the whole set is harder to survey. Overusing it for stable, single behaviour is needless.`],
  ],
  sources: [
    `Craig Larman — "Applying UML and Patterns" (3rd ed., 2004): Polymorphism`,
    `GoF — "Design Patterns" (1994): Strategy and State`,
  ],
};
