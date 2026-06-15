// Deep-dive content for Indirection (GRASP). ONE FILE PER CONCEPT.
// Base content comes from the map node; this adds depth.
// Code lines are [text, kind]; kind: 'kw' | 'c' | ''. No "<", ">" or "=>".

module.exports = {
  remember: `Put a middleman between two things that should not know each other.`,
  framing: `Indirection introduces a mediating object so two components never reference each other directly. The intermediary (adapter, mediator, controller, facade) carries the relationship, so each side depends on it, not on its peer.`,
  why: `Direct references between volatile or numerous components create tight, tangled coupling. A middleman gives one seam to reroute, intercept, adapt, or swap — at the cost of one more hop to trace.`,
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
  ],
  sources: [
    `Craig Larman — "Applying UML and Patterns" (3rd ed., 2004): Indirection`,
    `GoF — "Design Patterns" (1994): Mediator, Facade, Adapter`,
  ],
};
