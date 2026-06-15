// Deep-dive content for Controller (GRASP). ONE FILE PER CONCEPT.
// Base content comes from the map node; this adds depth.
// Code lines are [text, kind]; kind: 'kw' | 'c' | ''. No "<", ">" or "=>".

module.exports = {
  remember: `The first object to receive a system event should not be the UI.`,
  framing: `A Controller is the first non-UI object that handles a system operation. It represents the overall system, a use case (session), or a root domain object, and routes the request inward — keeping input handling out of widgets.`,
  why: `Without it, domain logic leaks into UI event handlers, can't be reused across delivery mechanisms (web, CLI, tests), and the UI couples to the domain. A thin controller is the seam between delivery and domain.`,
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
  ],
  sources: [
    `Craig Larman — "Applying UML and Patterns" (3rd ed., 2004): Controller`,
    `Martin Fowler — "Patterns of Enterprise Application Architecture" (2002): Input Controller`,
  ],
};
