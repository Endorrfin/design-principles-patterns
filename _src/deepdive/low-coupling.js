// Deep-dive content for Low Coupling (GRASP). ONE FILE PER CONCEPT.
// Base content comes from the map node; this adds depth.
// Code lines are [text, kind]; kind: 'kw' | 'c' | ''. No "<", ">" or "=>".

module.exports = {
  remember: `Depend on as little as possible, as weakly as possible.`,
  framing: `Coupling is how strongly one class relies on others — by concrete type, by reaching into internals, by long parameter chains. Low Coupling is an evaluative principle: among design options, prefer the one that adds the fewest, weakest dependencies.`,
  why: `Tightly coupled code ripples: one change forces edits across many classes, blocks reuse, and makes units hard to test in isolation. Weak coupling localises change and lets you swap or mock collaborators.`,
  litmus: `If this collaborator changed, how many places break? Could you unit-test the class without standing up its dependencies? Many breaks, or "no", signals coupling that is too high.`,
  smell: `The service hard-wires a concrete repository and news it up — bound to SQL, impossible to mock:`,
  refactorLabel: `↓ DEPEND ON AN ABSTRACTION`,
  bad: [
    [`class OrderService {`, 'kw'],
    [`  private repo = new SqlOrderRepo()  // hidden concrete dep`, 'c'],
    [`  place(o: Order) { this.repo.save(o) }`, ''],
    [`}`, 'kw'],
  ],
  good: [
    [`interface OrderRepo { save(o: Order): void }`, 'kw'],
    [`class OrderService {`, 'kw'],
    [`  private repo!: OrderRepo    // injected abstraction`, 'c'],
    [`  place(o: Order) { this.repo.save(o) }`, ''],
    [`}`, 'kw'],
  ],
  fixNote: `The service depends on a small interface it owns, injected from outside. SQL, in-memory, or a mock all satisfy it — change and tests stay local.`,
  seeAlso: [
    ['dip', `Low Coupling is the goal; DIP (depend on abstractions) is one technique to reach it`],
    ['high-cohesion', `the constant counter-force — balance the two, do not maximise either`],
    ['lod', `Law of Demeter is a concrete rule that limits coupling to immediate neighbours`],
    ['indirection', `a middleman lowers coupling — but adds parts, so apply it sparingly`],
  ],
  interview: [
    [`Low Coupling vs DIP?`, `Low Coupling is the why (few, weak dependencies); DIP is one how (depend on abstractions, invert ownership of the interface). DIP serves Low Coupling.`],
    [`Is zero coupling the goal?`, `No — zero coupling means objects that never collaborate. Some coupling is necessary; the aim is few and weak, not none. Over-decoupling adds indirection and ceremony.`],
    [`Low Coupling vs High Cohesion — conflict?`, `They tension each other: merging everything kills cohesion, over-splitting raises coupling. Good design balances both rather than maximising one.`],
  ],
  sources: [
    `Craig Larman — "Applying UML and Patterns" (3rd ed., 2004): Low Coupling`,
    `Stevens, Myers & Constantine — "Structured Design" (1974): origin of coupling and cohesion`,
  ],
};
