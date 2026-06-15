// Deep-dive content for Pure Fabrication (GRASP). ONE FILE PER CONCEPT.
// Base content comes from the map node; this adds depth.
// Code lines are [text, kind]; kind: 'kw' | 'c' | ''. No "<", ">" or "=>".

module.exports = {
  remember: `When no domain class fits a responsibility, invent one that does.`,
  framing: `Sometimes the right home for a responsibility is no real-world concept at all. Pure Fabrication invents a class (Repository, Service, Mapper) purely to keep the domain cohesive and decoupled — a deliberate, designed-for-software abstraction.`,
  why: `Information Expert would put persistence on the entity that owns the data — but DB I/O is unrelated to domain rules, so it wrecks cohesion and couples the entity to infrastructure. A fabricated class absorbs that duty and keeps the domain clean and reusable.`,
  litmus: `Is a responsibility forcing a domain class to do unrelated work (I/O, mapping, coordination)? Would placing it on an entity hurt cohesion? Then fabricate a purpose-built class.`,
  smell: `Information Expert says Order owns its data, so persistence lands on Order — now the entity knows SQL:`,
  refactorLabel: `↓ FABRICATE A HOME FOR IT`,
  bad: [
    [`class Order {`, 'kw'],
    [`  items: Item[] = []`, ''],
    [`  save() { this.db.query('INSERT ...') }  // tied to the DB`, 'c'],
    [`}`, 'kw'],
  ],
  good: [
    [`class Order { items: Item[] = [] }   // pure domain, no I/O`, 'kw'],
    [`class OrderRepository {              // pure fabrication`, 'kw'],
    [`  save(o: Order) { this.db.query('INSERT ...') }`, ''],
    [`}`, 'kw'],
  ],
  fixNote: `Order stays a clean domain concept; OrderRepository is a cohesive, invented home for persistence. The cost is more classes — fabricate only when Expert would hurt.`,
  seeAlso: [
    ['information-expert', `the principle Pure Fabrication overrides when Expert would hurt cohesion`],
    ['repository', `the canonical fabrication — persistence lifted off the domain entity`],
    ['high-cohesion', `the property Pure Fabrication protects`],
    ['low-coupling', `keeps the domain from depending on infrastructure`],
  ],
  interview: [
    [`When does Pure Fabrication beat Information Expert?`, `When Expert would force unrelated duties (DB I/O, mapping) onto a domain class and wreck cohesion — fabricate a Service or Repository instead.`],
    [`Is a Service class always a Pure Fabrication?`, `Often yes — Service, Repository, Mapper, Controller are classic fabrications. The test: they exist for software-design reasons, not because they model a domain noun.`],
    [`Risk of overusing it?`, `A domain drained into managers and services becomes anemic — data in entities, all behaviour in fabrications. Fabricate to protect cohesion, not as a default.`],
  ],
  sources: [
    `Craig Larman — "Applying UML and Patterns" (3rd ed., 2004): Pure Fabrication`,
    `Eric Evans — "Domain-Driven Design" (2003): Services and Repositories as designed abstractions`,
  ],
};
