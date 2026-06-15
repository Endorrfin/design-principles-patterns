// Deep-dive content for Information Expert (GRASP). ONE FILE PER CONCEPT.
// Base content (name/intent/structure/use/avoid/pros/cons) comes from the map
// node; this adds depth. Code lines are [text, kind]; kind: 'kw' | 'c' | ''.
// Code/text must NOT contain "<", ">" or "=>" (satori-html reads them as tags).

module.exports = {
  remember: `Put the behaviour where the data already lives.`,
  framing: `Before adding a method, ask which class already holds the data that method needs. That class is the information expert — the responsibility belongs there, not in a manager that reaches in and pulls the data out.`,
  why: `Placing behaviour next to its data keeps state encapsulated and cuts coupling: callers ask the expert for an answer instead of fetching its internals and computing themselves. It is the default heuristic behind "tell, don't ask".`,
  litmus: `Who holds the data needed to answer this? If a method reaches into another object's fields to do its job, the responsibility is in the wrong place — move it to the data's owner.`,
  smell: `A service reaches into Order's items to compute the total — Order's data, outside logic:`,
  refactorLabel: `↓ MOVE TO THE DATA OWNER`,
  bad: [
    [`class Order { items: Item[] = [] }`, 'kw'],
    [`class Checkout {`, 'kw'],
    [`  total(o: Order) {      // reaches into Order's data`, 'c'],
    [`    return o.items.reduce(sum, 0)   // outside logic`, ''],
    [`  }`, ''],
    [`}`, 'kw'],
  ],
  good: [
    [`class Order {`, 'kw'],
    [`  items: Item[] = []`, ''],
    [`  total() {       // Order owns the data, so it computes`, 'c'],
    [`    return this.items.reduce(sum, 0)`, ''],
    [`  }`, ''],
    [`}`, 'kw'],
  ],
  fixNote: `The total now lives with the items it sums. Callers ask order.total() instead of fetching items and looping — state stays encapsulated.`,
  seeAlso: [
    ['high-cohesion', `keeping behaviour near its data naturally raises cohesion`],
    ['low-coupling', `callers stop reaching into internals — fewer, weaker dependencies`],
    ['pure-fabrication', `the escape hatch when Expert would bloat a domain class with I/O`],
    ['creator', `sibling heuristic — Expert places behaviour, Creator places construction`],
  ],
  interview: [
    [`Information Expert vs SRP?`, `Expert decides where a responsibility goes (the data-holder); SRP limits how many reasons a class has to change. They can pull opposite ways — resolve the tension with Pure Fabrication.`],
    [`Doesn't this create god classes?`, `It can. Expert is a default, not a mandate — when it would force unrelated duties (e.g. persistence) onto an entity, fabricate a Service or Repository instead.`],
    [`How does it relate to "Tell, Don't Ask"?`, `Tell-Don't-Ask is Expert in practice: send the object a message instead of querying its data and acting on it from outside.`],
  ],
  sources: [
    `Craig Larman — "Applying UML and Patterns" (3rd ed., 2004): Information Expert`,
    `Martin Fowler — "TellDontAsk" (martinfowler.com)`,
  ],
};
