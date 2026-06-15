// Deep-dive content for Polymorphism (GRASP) — GOLD standard.
// Fields: remember, framing, why, roles, apply, litmus, smell, bad, good,
// refactorLabel, fixNote, pitfalls, examples, seeAlso, interview, sources.
// Base comes from the map node. satori: code flush-left; no "<"; no "constructor".

module.exports = {
  remember: `When behaviour varies by type, let the type decide — not an if or switch.`,

  framing: `When behaviour depends on type, you have two options: branch on a type tag everywhere it matters, or define one operation and let each type implement it. GRASP Polymorphism says choose the second — assign the varying behaviour to the types themselves through a shared interface, so the runtime dispatches to the right variant and the conditionals vanish.`,

  why: `Type-switch ladders are duplicated at every call site and must be edited for each new type — easy to miss one, and the compiler won't warn you. Moving each variant behind a common operation centralises it, makes adding a type an additive change (Open/Closed), and lets clients work against the abstraction without knowing the concrete type at all.`,

  roles: [
    [`Interface`, `The common operation every variant implements — the single seam clients call.`],
    [`Variants`, `The type-specific implementations, one per case that used to be a switch branch.`],
    [`Client`, `Calls the operation against the interface, with no knowledge of which concrete type runs.`],
  ],

  apply: [
    `Find the repeated switch / if ladder on a type or kind field.`,
    `Define a common operation that captures what varies (e.g. area(), price()).`,
    `Give each type its own implementation of that operation.`,
    `Replace the conditionals with a single polymorphic call.`,
  ],

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

  pitfalls: [
    `Polymorphism for behaviour that never varies — needless classes and indirection.`,
    `Variants that aren't substitutable (break LSP) — the dispatch then lies to its callers.`,
    `Scattering one decision across many files when a simple, local conditional was clearer.`,
  ],

  examples: [
    `shape.area() across Circle / Square / Triangle instead of switch(shape.kind).`,
    `GoF Strategy and State — swapping algorithms or state-specific behaviour by type.`,
    `A renderer / serializer with one implementation per format, selected by the object's class.`,
  ],

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
    [`How does polymorphism enable Open/Closed?`, `New behaviour arrives as a new class implementing the existing interface — callers don't change. The type-switch alternative forces an edit in every branch for each new case, which is exactly what OCP tells you to avoid.`],
  ],

  sources: [
    `Craig Larman — "Applying UML and Patterns" (3rd ed., 2004): Polymorphism`,
    `GoF — "Design Patterns" (1994): Strategy and State`,
  ],
};
