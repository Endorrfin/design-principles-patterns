// Deep-dive content for Indirection (GRASP) — GOLD standard.
// Fields: remember, framing, why, roles, apply, litmus, smell, bad, good,
// refactorLabel, fixNote, pitfalls, examples, seeAlso, interview, sources.
// Base comes from the map node. satori: code flush-left; no "<"; no "constructor".

module.exports = {
  remember: `Put a middleman between two things that should not know each other.`,

  framing: `Indirection introduces a middle object so two components never refer to each other directly. Instead of A knowing B, both know an intermediary — an adapter, mediator, controller, or facade — that carries the relationship. The mediator absorbs the coupling, leaving each side dependent only on the seam in the middle.`,

  why: `Direct links between volatile or numerous components create a tangled web where every change ripples outward. A middleman gives you one place to reroute, intercept, adapt, log, or swap a relationship without touching either end. The cost is a level of redirection — one more hop to read and debug — so it pays only where coupling genuinely hurts.`,

  roles: [
    [`Intermediary`, `The mediating object that carries the relationship so the two parties never bind directly.`],
    [`Parties`, `The components being kept apart — each depends on the intermediary, not on the other.`],
    [`Effect`, `Lower direct coupling and a single seam to swap, adapt, or intercept the interaction.`],
  ],

  apply: [
    `Spot two components that depend on each other but shouldn't.`,
    `Introduce a middle object to own that relationship (mediator, adapter, facade).`,
    `Point both sides at the intermediary instead of at each other.`,
    `Add indirection only where coupling is real — not "just in case".`,
  ],

  litmus: `Do two components reference each other directly when they should not? Would a seam let you swap, adapt, or intercept the link? If so, insert an intermediary.`,

  smell: `Widgets call each other directly — a web of references that grows with every new widget:`,
  refactorLabel: `↓ INSERT A MIDDLEMAN`,
  bad: [
    [`class Button {`, 'kw'],
    [`  onClick() {`, ''],
    [`    this.list.refresh(); this.label.update()  // knows peers directly`, 'c'],
    [`  }`, ''],
    [`}`, 'kw'],
  ],
  good: [
    [`class Mediator {`, 'kw'],
    [`  notify(sender: object, event: string) { /* route to peers */ }`, ''],
    [`}`, 'kw'],
    [`class Button {`, 'kw'],
    [`  onClick() { this.mediator.notify(this, 'click') }  // only Mediator`, 'c'],
    [`}`, 'kw'],
  ],
  fixNote: `Components depend on the mediator, not on each other. Adding a widget touches one place — but every interaction now hops through the middle, so use it where coupling truly hurts.`,

  pitfalls: [
    `Speculative layers of indirection that add hops without removing any real coupling.`,
    `A mediator that grows into a god object as it absorbs everyone's logic.`,
    `Indirection that hurts traceability — stack traces and "go to definition" stop being useful.`,
  ],

  examples: [
    `A Mediator coordinating UI widgets so they don't reference each other.`,
    `Adapter / Facade wrapping a subsystem; an API gateway in front of services.`,
    `A Repository between domain and database; a message broker between producers and consumers.`,
  ],

  seeAlso: [
    ['mediator', `a GoF pattern that is Indirection applied to many-to-many object talk`],
    ['facade', `indirection that hides a whole subsystem behind one entry point`],
    ['protected-variations', `Indirection is a common way to build a stable, protective seam`],
    ['low-coupling', `the property Indirection buys — at the cost of more moving parts`],
  ],

  interview: [
    [`Indirection vs Protected Variations?`, `Indirection adds a middleman to decouple two parties; Protected Variations wraps a variation point behind a stable interface. Indirection is a common means to achieve PV.`],
    [`When does indirection hurt?`, `When added "just in case": each layer is one more hop to read and debug. Indirection trades traceability for flexibility — pay only where coupling is real.`],
    [`Examples in real frameworks?`, `DI containers, message buses, adapters, API gateways, repositories — all insert an intermediary so callers and providers stay decoupled.`],
    [`Is more indirection always better design?`, `No — each layer trades traceability for flexibility. Indirection is valuable exactly where two parts should evolve independently; everywhere else it's overhead that makes the code harder to follow.`],
  ],

  sources: [
    `Craig Larman — "Applying UML and Patterns" (3rd ed., 2004): Indirection`,
    `GoF — "Design Patterns" (1994): Mediator, Facade, Adapter`,
  ],
};
