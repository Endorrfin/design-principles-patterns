// Deep-dive content for SoC. ONE FILE PER CONCEPT (file name = node id) so that
// parallel sessions never touch the same file. Fields documented in CLAUDE.md.
// Base content (name/intent/structure/use/avoid/pros/cons) comes from the map
// node; this adds depth. Code lines are [text, kind]; kind: 'kw' | 'c' | ''.
// Code must NOT contain "<" or ">" (satori-html would read them as tags).

module.exports = {
  remember: `Give each distinct concern its own module so it can change on its own.`,
  framing: `A "concern" is one dimension of the problem — presentation, domain rules, persistence, a cross-cutting log. SoC is SRP scaled up from a class to modules and layers.`,
  why: `When concerns mix — SQL in the controller, business rules in the view — every change touches everything, and nothing can be tested or replaced in isolation.`,
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
  ],
  sources: [
    'Edsger W. Dijkstra — "On the role of scientific thought" (1974): the term separation of concerns',
    'Robert C. Martin — "Clean Architecture" (2017): drawing boundaries between concerns',
  ],
};
