// Deep-dive content for Controller (GRASP) — GOLD standard.
// Fields: remember, framing, why, roles, apply, litmus, smell, bad, good,
// refactorLabel, fixNote, pitfalls, examples, seeAlso, interview, sources.
// Base comes from the map node. satori: code flush-left; no "<"; no "constructor".

module.exports = {
  remember: `The first object to receive a system event should not be the UI.`,

  framing: `Controller decides who first handles a system operation — a request arriving from outside the software. The answer is a non-UI object: one representing the whole system (a facade controller), a specific use case or session, or a root domain object. The UI widget captures the event, then immediately hands it to this controller, which coordinates the domain.`,

  why: `Routing input through a dedicated controller keeps domain logic out of buttons and HTTP handlers, so the same use case can be driven by web, CLI, tests, or a queue. It gives one place to manage a use case's flow and transaction boundary, and it stops the UI from coupling directly to domain internals.`,

  roles: [
    [`Controller`, `The first non-UI object to receive a system operation. Represents the system, a use case, or a root — and only coordinates.`],
    [`UI`, `Captures the raw event (click, request) and delegates inward without running business rules itself.`],
    [`Domain`, `The services and entities the controller drives to actually fulfil the operation.`],
  ],

  apply: [
    `Spot the system operation — the event crossing into your software.`,
    `Pick a non-UI handler: a use-case controller for big systems, a facade controller for small ones.`,
    `Let the UI call only that controller — no domain logic in the widget.`,
    `Keep the controller thin: it routes and coordinates; rules live in services and entities.`,
  ],

  litmus: `If you deleted the UI, would this logic still be needed? If yes, it belongs behind a controller, not inside the click handler.`,

  smell: `A UI widget runs domain logic directly — untestable without the UI, tied to one delivery:`,
  refactorLabel: `↓ DELEGATE INTO THE DOMAIN`,
  bad: [
    [`class CheckoutButton {`, 'kw'],
    [`  onClick(dto: PlaceDto) {        // a UI widget`, 'c'],
    [`    const order = new Order(dto)  // domain work in the UI`, 'c'],
    [`    this.db.save(order)`, ''],
    [`  }`, ''],
    [`}`, 'kw'],
  ],
  good: [
    [`@Controller('orders')`, ''],
    [`class OrdersController {     // not the UI — delegates inward`, 'kw'],
    [`  @Inject(OrderService) private orders!: OrderService`, ''],
    [`  place(dto: PlaceDto) { return this.orders.place(dto) }`, ''],
    [`}`, 'kw'],
  ],
  fixNote: `The controller only routes; OrderService holds the use case — now reused by web, CLI, and tests while the UI stays thin.`,

  pitfalls: [
    `The "god controller" that accumulates business logic instead of delegating — split it by use case.`,
    `One bloated facade controller for a large system, when per-use-case controllers would stay cohesive.`,
    `Leaking domain work back into the UI because the controller felt like "extra indirection".`,
  ],

  examples: [
    `A NestJS @Controller mapping a route to a service call — HTTP boundary, no business rules.`,
    `An application / use-case handler (PlaceOrderHandler) coordinating one scenario end to end.`,
    `MVC's Controller and MVP's Presenter — concrete realizations of this principle.`,
  ],

  seeAlso: [
    ['mvc', `GRASP names the principle; MVC's Controller is one concrete realization`],
    ['pure-fabrication', `a use-case controller is usually a fabricated, non-domain class`],
    ['low-coupling', `keeps the UI from depending directly on domain internals`],
    ['indirection', `the controller is a middleman between delivery and domain`],
  ],

  interview: [
    [`GRASP Controller vs MVC Controller?`, `Same idea, different scope: GRASP states the principle (a non-UI object handles system events); MVC's Controller is one realization of it.`],
    [`Facade controller vs use-case controller?`, `A facade (system) controller handles all events of a subsystem — simple but bloats. A use-case (session) controller handles one scenario — better cohesion for large systems.`],
    [`How do you avoid a "god controller"?`, `Keep it thin: only receive and delegate. Domain rules live in services and entities; if the controller starts deciding, push that logic inward.`],
    [`Should controllers contain business logic?`, `No — a controller coordinates: it receives the operation, calls the right domain services, and returns a result. Rules belong in entities and services so they stay reusable and testable without the delivery layer.`],
  ],

  sources: [
    `Craig Larman — "Applying UML and Patterns" (3rd ed., 2004): Controller`,
    `Martin Fowler — "Patterns of Enterprise Application Architecture" (2002): Input Controller`,
  ],
};
