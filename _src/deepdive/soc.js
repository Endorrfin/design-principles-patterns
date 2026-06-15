// Deep-dive content for SoC — GOLD STANDARD depth (one file per concept).
// Fields: remember, framing, why, roles, apply, litmus, smell, bad, good,
// refactorLabel, fixNote, pitfalls, examples, seeAlso, interview, sources.
// satori gotchas: code flush-left (indent stripped); no "<"/">" (lone ">"/"=>" ok);
// generics via ⟨⟩; never the literal word "constructor".

module.exports = {
  remember: `Give each distinct concern its own module so it can change on its own.`,

  framing: `A "concern" is one dimension of a problem — presentation, domain rules, persistence, plus cross-cutting ones like logging and auth. Separation of Concerns puts each in its own module or layer so it can be understood, changed and tested on its own. It is the same instinct as SRP, scaled up from a single class to the architecture of the whole system.`,

  why: `When concerns mix — SQL in the controller, business rules in the view — every change reaches into unrelated code, nothing can be tested in isolation, and ownership blurs. Clean seams let you swap the database, redesign the UI, or change a rule without disturbing the others, and they let different people work in parallel without colliding. It is what keeps a codebase navigable as it grows.`,

  roles: [
    [`Concern`, `One dimension of the problem: presentation, domain logic, persistence, or a cross-cutting aspect like logging or auth.`],
    [`Layer / module`, `The unit that owns exactly one concern and exposes a thin contract to the next — controller, service, repository.`],
    [`Boundary`, `The interface between concerns. Dependencies cross it in one direction (toward the domain), so each side can change behind it.`],
  ],

  apply: [
    `Name the concerns in the slice you are building: HTTP, rules, storage, cross-cutting.`,
    `Give each its own module and let them talk through thin contracts.`,
    `Point dependencies toward the domain (DIP), keeping infrastructure at the edges.`,
    `Pull cross-cutting concerns (logging, auth, transactions) into middleware or decorators, not business code.`,
  ],

  litmus: `Can you change the database, the UI, or a business rule without touching the other two? If one edit ripples across all layers, the concerns aren't separated.`,
  refactorLabel: `↓ SPLIT CONCERNS INTO LAYERS`,
  smell: `One handler mixes HTTP, business rules and SQL:`,
  bad: [
    ['function handler(req, res) {', 'kw'],
    ['  let total = 0', ''],
    ['  for (const i of req.body.items) total += i.price   // domain rule', 'c'],
    ["  db.query('INSERT INTO orders ...')                 // persistence", 'c'],
    ["  res.render('receipt', { total })                   // presentation", 'c'],
    ['}', ''],
  ],
  good: [
    ['// controller → service (domain) → repository (persistence)', 'c'],
    ['class OrdersController { create(req){ this.svc.place(req.body) } }', 'kw'],
    ['class OrderService     { place(o){ /* business rules */ } }', ''],
    ['class OrderRepository  { insert(o){ /* SQL only */ } }', ''],
  ],
  fixNote: `Each layer owns one concern and talks to the next through a thin contract. Swap the database or the UI without touching domain rules.`,

  pitfalls: [
    `Over-layering a small app — ceremony and indirection with no payoff (KISS / YAGNI).`,
    `Leaky layers: ORM entities or HTTP types bleeding into the domain, re-coupling what you split.`,
    `Scattering a cross-cutting concern (logging, auth) through every layer instead of isolating it.`,
  ],

  examples: [
    `A NestJS controller → service → repository, each owning one concern.`,
    `Hexagonal / clean architecture with the domain at the center and adapters at the edges.`,
    `Frontend split: presentation components vs state/data services (Angular) or hooks (React).`,
  ],

  seeAlso: [
    ['srp', 'the same idea at class scale — SoC is its architectural scale'],
    ['mvc', 'a classic SoC split of input, output and model'],
    ['dip', 'keep layer dependencies pointing at abstractions, not details'],
    ['dry', 'one concern per module gives each rule a single home'],
  ],

  interview: [
    ['SoC vs SRP?', 'Same instinct, different scale. SRP is one reason to change for a class; SoC is one concern per module or layer for a whole system.'],
    ['How do cross-cutting concerns fit?', 'Logging, auth and transactions cut across layers; isolate them with middleware, decorators or AOP instead of scattering them through business code.'],
    ['Can you over-separate?', 'Yes — layering a tiny app adds ceremony with no payoff. Match the number of layers to the real complexity.'],
    ['SoC vs modularity vs cohesion?', 'SoC decides what to separate (by concern); cohesion describes a module that keeps one concern’s parts together; modularity is the mechanism of boundaries that enforces it. They reinforce each other.'],
  ],

  sources: [
    'Edsger W. Dijkstra — "On the role of scientific thought" (1974): the term separation of concerns',
    'Robert C. Martin — "Clean Architecture" (2017): drawing boundaries between concerns',
  ],
};
