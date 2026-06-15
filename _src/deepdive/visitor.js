// Deep-dive content for Visitor (GoF, behavioral) — GOLD depth.
// Fields: remember, framing, why, roles, apply, litmus, smell, bad, good,
// refactorLabel, fixNote, pitfalls, examples, seeAlso, interview, sources.
// Base comes from the map node. satori gotchas: code flush-left (indent stripped);
// no "<"/">" (lone ">"/"=>" ok); generics via ⟨⟩; never the literal word "constructor".

module.exports = {
  remember: `Pull operations out of the elements into a visitor — add new operations without touching the element classes.`,

  framing: `Visitor moves an operation out of an object structure into a separate visitor object with one method per element type. Each element exposes accept(visitor) and calls back the matching visit method — two dispatches (on element type, then operation) that together are double dispatch. A new operation is a new visitor; the elements never change.`,

  why: `When many unrelated operations (type-check, pretty-print, evaluate) must run over a stable structure of node types, putting each as a method on every node smears it across classes and bloats them. Visitor gathers one operation's logic in one place and lets you add operations without editing the elements. The trade-off is the expression problem: adding a new element type now forces a new method in every visitor.`,

  roles: [
    [`Visitor`, `Declares visitConcreteA() / visitConcreteB() — one method per element type.`],
    [`Element.accept(v)`, `The hook each element exposes; calls back v.visitX(this) — the second dispatch.`],
    [`ConcreteVisitor`, `Implements one operation across all element types in one cohesive place.`],
  ],

  apply: [
    `Confirm the element types are stable but the operations keep growing.`,
    `Give each element an accept(v) that calls the matching v.visitType(this).`,
    `Put each operation in its own ConcreteVisitor with a method per type.`,
    `Walk the structure (Iterator / Composite) and accept a visitor at each node.`,
  ],

  litmus: `Is the set of element types stable while operations keep multiplying? If you'd otherwise add the same method to every node class, lift it into a visitor.`,

  smell: `Every node class carries a method for each operation — operations smeared across types:`,
  refactorLabel: `↓ LIFT THE OPERATION INTO A VISITOR`,
  bad: [
    [`class NumNode {`, 'kw'],
    [`  eval()      { return this.v }`, ''],
    [`  print()     { return String(this.v) }`, ''],
    [`  typeCheck() { /* ... */ }   // add op → edit every node`, 'c'],
    [`}`, 'kw'],
  ],
  good: [
    [`interface Visitor { visitNum(n): number; visitAdd(a): number }`, 'kw'],
    [`class Num {`, 'kw'],
    [`  v = 0`, ''],
    [`  accept(x: Visitor) { return x.visitNum(this) }   // dispatch`, 'c'],
    [`}`, 'kw'],
    [`class Eval implements Visitor {   // one op, all types`, 'kw'],
    [`  visitNum(n) { return n.v }`, ''],
    [`  visitAdd(a) { return a.l + a.r }`, ''],
    [`}`, 'kw'],
  ],
  fixNote: `Each node now just exposes accept(); Eval gathers the whole operation in one class. Add a Print or TypeCheck visitor without touching a single node — but a new node type means a new visit method in every visitor.`,

  pitfalls: [
    `The expression problem: easy to add operations, painful to add element types — every visitor must gain a method. Pattern matching flips the trade-off.`,
    `Encapsulation leak: visitors usually need element internals, so accessors get exposed the element wouldn't otherwise publish.`,
    `A cyclic Element-to-Visitor dependency and double-dispatch boilerplate; brittle while element types still churn.`,
  ],

  examples: [
    `Compiler / AST tooling: TS compiler and Babel visitors run checks, transforms, codegen; ESLint rules keyed by node type.`,
    `.NET Roslyn CSharpSyntaxVisitor / SyntaxWalker; document exporters visiting nodes to emit HTML / PDF.`,
    `Any type-check / pretty-print / evaluate pass over a stable tree.`,
  ],

  seeAlso: [
    [`composite`, `Visitor usually runs over a Composite tree of elements`],
    [`iterator`, `walks the structure; Visitor performs a type-specific operation at each node`],
    [`interpreter`, `an AST is a natural Visitor target — add operations without bloating nodes`],
    [`strategy`, `differs by dispatching on element type, not just plugging one algorithm`],
  ],

  interview: [
    [`What is double dispatch?`, `Two virtual calls: element.accept(v) resolves the element's type, then v.visitX(this) resolves the operation. The method that runs depends on both types at once.`],
    [`What's the expression problem here?`, `Visitor makes new operations cheap but new element types expensive — every visitor must gain a method. Pattern matching flips that trade-off.`],
    [`Why not just an if/instanceof chain?`, `It works for a few types, but scatters each operation's type checks and forgets new types. Visitor centralizes an operation and (with a base) forces coverage.`],
    [`Main downsides?`, `Boilerplate, a cyclic Element-to-Visitor dependency, broken element encapsulation, and brittleness when element types change.`],
  ],

  sources: [
    `GoF — "Design Patterns" (1994): Visitor (behavioral)`,
    `Wadler — "The Expression Problem" (1998): the operations-vs-types trade-off Visitor makes`,
  ],
};
