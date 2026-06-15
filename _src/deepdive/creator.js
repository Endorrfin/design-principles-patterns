// Deep-dive content for Creator (GRASP). ONE FILE PER CONCEPT.
// Base content comes from the map node; this adds depth.
// Code lines are [text, kind]; kind: 'kw' | 'c' | ''. No "<", ">" or "=>".

module.exports = {
  remember: `Whoever owns or closely uses an object should be the one to create it.`,
  framing: `GRASP gives concrete criteria for who calls new: pick the class that aggregates, contains, records, or closely uses the created object — it already has the data to initialise it.`,
  why: `Creating an object where it naturally belongs avoids inventing a separate creator class and keeps coupling low: the creator already references the created type, so no new dependency is introduced.`,
  litmus: `Does this class contain, aggregate, or closely use the new object? If yes, it is the natural creator. If construction is complex or conditional, delegate to a Factory or Builder instead.`,
  smell: `A service builds the Line that only Cart ever holds — needless coupling to Cart's internals:`,
  refactorLabel: `↓ LET THE OWNER CREATE IT`,
  bad: [
    [`class Cart { lines: Line[] = [] }`, 'kw'],
    [`class CartService {`, 'kw'],
    [`  addItem(cart: Cart, p: Product) {  // outsider builds it`, 'c'],
    [`    cart.lines.push(new Line(p))`, ''],
    [`  }`, ''],
    [`}`, 'kw'],
  ],
  good: [
    [`class Cart {`, 'kw'],
    [`  lines: Line[] = []`, ''],
    [`  add(p: Product) {   // Cart owns Lines, so it creates them`, 'c'],
    [`    this.lines.push(new Line(p))`, ''],
    [`  }`, ''],
    [`}`, 'kw'],
  ],
  fixNote: `Cart already aggregates Lines, so it owns their creation. No service or factory is needed until construction grows complex — then delegate to a Builder or Factory.`,
  seeAlso: [
    ['factory-method', `Creator says who instantiates; Factory Method is how, when creation needs subtype variation`],
    ['builder', `delegate here when construction is complex or multi-step`],
    ['information-expert', `sibling heuristic — Expert places behaviour, Creator places construction`],
    ['low-coupling', `creating where ownership lives adds no new dependency`],
  ],
  interview: [
    [`Creator (GRASP) vs Factory Method (GoF)?`, `Creator is a principle for deciding who instantiates; Factory Method is a pattern that defers instantiation to subclasses. Creator often tells you where a factory belongs.`],
    [`What are the Creator criteria?`, `B should create A if B aggregates, contains, records, or closely uses A — or holds A's initialising data. The strongest signal is aggregation or containment.`],
    [`When should I ignore Creator?`, `When construction is complex, conditional, or drags in many dependencies — then a Factory or Builder gives better cohesion than the container.`],
  ],
  sources: [
    `Craig Larman — "Applying UML and Patterns" (3rd ed., 2004): Creator`,
    `GoF — "Design Patterns" (1994): Factory Method and Builder for delegated creation`,
  ],
};
