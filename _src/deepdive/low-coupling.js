// Deep-dive content for Low Coupling (GRASP) — GOLD standard.
// Fields: remember, framing, why, roles, apply, litmus, smell, bad, good,
// refactorLabel, fixNote, pitfalls, examples, seeAlso, interview, sources.
// Base comes from the map node. satori: code flush-left; no "<"; no "constructor".

module.exports = {
  remember: `Depend on as little as possible, as weakly as possible.`,

  framing: `Low Coupling is an evaluative principle, not a recipe: when several designs would work, prefer the one that creates the fewest and weakest dependencies. Coupling has many forms — depending on a concrete class, reaching through an object to its neighbours, sharing global state, knowing another's internals. The goal is to keep each class leaning on as little as possible.`,

  why: `Coupling is what makes change expensive. A tightly bound class ripples edits into everything it touches, resists reuse outside its original context, and can't be tested without dragging its collaborators along. Weakening dependencies — via interfaces, injection, and indirection — localises change and lets you swap or mock pieces freely.`,

  roles: [
    [`Coupling`, `A measure of how strongly one element depends on others — by type, by reach, by shared state.`],
    [`Goal`, `Keep dependencies few and weak so a change ripples through as little code as possible.`],
    [`Means`, `Program to interfaces, inject collaborators, and add indirection where two parts should not know each other.`],
  ],

  apply: [
    `When choosing where a method or dependency goes, list what each option would couple together.`,
    `Prefer depending on an interface or abstraction over a concrete class.`,
    `Inject collaborators instead of constructing them inside (no hidden new).`,
    `Stop at "few and weak" — do not chase zero coupling with needless layers.`,
  ],

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

  pitfalls: [
    `Over-decoupling: interfaces and indirection for a single implementation add ceremony with no payoff.`,
    `Confusing low coupling with no coupling — collaborating objects must depend on something.`,
    `Maximising it alone — pushed too far it shatters cohesion into scattered, anemic classes.`,
  ],

  examples: [
    `A service depending on an OrderRepo interface, with the SQL implementation injected at the edge.`,
    `DI containers wiring concretes so classes never new their collaborators.`,
    `Event / message buses letting producers and consumers stay unaware of each other.`,
  ],

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
    [`How do you actually measure coupling?`, `Look at fan-out (how many types a class names), whether it depends on concretes or abstractions, and whether you can unit-test it without its collaborators. Hard-to-mock dependencies are the practical red flag.`],
  ],

  sources: [
    `Craig Larman — "Applying UML and Patterns" (3rd ed., 2004): Low Coupling`,
    `Stevens, Myers & Constantine — "Structured Design" (1974): origin of coupling and cohesion`,
  ],
};
