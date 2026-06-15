// Deep-dive content for Prototype (GoF, creational) — GOLD standard depth.
// Fields: remember, framing, why, roles, apply, litmus, smell, bad, good,
// refactorLabel, fixNote, pitfalls, examples, seeAlso, interview, sources.
// Base comes from the map node. satori gotchas: code flush-left (indent stripped);
// no "<"/">" (lone ">"/"=>" ok); generics via ⟨⟩; never the literal word "constructor".

module.exports = {
  remember: `Make new objects by cloning a configured exemplar instead of building each one from scratch.`,

  framing: `Prototype creates objects by copying an existing instance — the prototype — rather than calling new and re-running expensive setup. The prototype acts as a live template: configure it once, then clone() to stamp out new instances, tweaking each copy as needed. New "types" become new prototype instances registered at runtime, not new classes.`,

  why: `When construction is costly — heavy parsing, DB or IO setup — or an object's exact configuration is only known at runtime, cloning a ready instance skips the expensive initialisation and adds variants without a class explosion. The catch is copy depth: a shallow clone shares nested references, so mutating the copy can silently corrupt the original.`,

  roles: [
    [`Prototype`, `Declares clone() — the contract that returns a copy of itself.`],
    [`ConcretePrototype`, `Implements the copy, choosing shallow vs deep per field.`],
    [`Client`, `Holds a prototype (or a registry of them) and clones instead of newing.`],
  ],

  apply: [
    `Find creation that is expensive, or whose configuration is fixed only at runtime.`,
    `Give the object a clone() that returns an independent copy.`,
    `Decide per field: copy nested mutable state deeply; share only truly immutable parts.`,
    `Keep a registry of ready prototypes and clone the one you need.`,
  ],

  litmus: `Is new here expensive or its configuration runtime-decided, and would a copy of an existing instance do? If yes — and you can copy it safely — clone instead of build.`,

  smell: `Rebuilding a heavy object from scratch every time re-runs costly setup:`,
  refactorLabel: `↓ CLONE A PREPARED EXEMPLAR`,
  bad: [
    [`const d = new Doc()`, ''],
    [`d.loadTemplate()   // slow parse re-run on every Doc`, 'c'],
  ],
  good: [
    [`class Doc {`, 'kw'],
    [`  body = ''; tags = ['draft']`, ''],
    [`  clone(): Doc {   // copy self, deep where nested`, 'c'],
    [`    const c = new Doc()`, ''],
    [`    c.body = this.body; c.tags = [...this.tags]`, ''],
    [`    return c`, ''],
    [`  }`, ''],
    [`}`, 'kw'],
  ],
  fixNote: `clone() copies a ready Doc, so the slow setup runs once on the prototype, not on every instance. Copy nested state deeply (spread / structuredClone); share only immutable parts, or copies will alias the original.`,

  pitfalls: [
    `Shallow-clone aliasing: a copy that shares nested arrays or objects with the original — mutating one corrupts the other.`,
    `Cloning deep graphs with cycles, or handles (sockets, file descriptors) that can't be meaningfully copied.`,
    `Using Prototype where new is already cheap — clone machinery adds complexity for no gain.`,
  ],

  examples: [
    `structuredClone() and spread copies of configured objects in JS.`,
    `Editor "duplicate" (shape, slide, layer) that copies a fully-styled object.`,
    `Object.create(proto) and JS's own prototype chain; game entity templates cloned per spawn.`,
  ],

  seeAlso: [
    [`factory-method`, `an alternative creator — override new by subclass vs clone a registered instance`],
    [`abstract-factory`, `a factory can produce its family by cloning stored prototypes`],
    [`flyweight`, `opposite intent — share one instance instead of copying many`],
    [`composite`, `deep-cloning a Composite tree is a classic Prototype use`],
  ],

  interview: [
    [`Shallow vs deep clone — what's the trap?`, `A shallow copy shares nested references, so mutating the clone mutates the original. Deep-copy mutable nested state (spread, structuredClone) to keep copies independent.`],
    [`Prototype vs Factory Method?`, `Both create without naming a concrete class at the call site — Factory Method by overriding in a subclass, Prototype by cloning a registered instance. Prototype adds or removes "types" at runtime.`],
    [`When is Prototype the right call?`, `When new is expensive, or an object's configuration is decided at runtime and you'd rather copy a prepared exemplar than rebuild it.`],
    [`How does JavaScript relate to Prototype?`, `JS is prototype-based at the language level: objects delegate to a prototype, and Object.create(proto) makes a new object from an exemplar — the pattern, built in.`],
  ],

  sources: [
    `GoF — "Design Patterns" (1994): Prototype (creational)`,
    `Joshua Bloch — "Effective Java" (3rd ed., 2018): Item 13 — override clone judiciously (copy ctors / factories often beat it)`,
  ],
};
