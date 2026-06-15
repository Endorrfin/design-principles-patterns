// Deep-dive content for DIP. ONE FILE PER CONCEPT (file name = node id) so that
// parallel sessions never touch the same file. Fields documented in CLAUDE.md.
// Base content (name/intent/structure/use/avoid/pros/cons) comes from the map
// node; this adds depth. Code lines are [text, kind]; kind: 'kw' | 'c' | ''.
// Code must NOT contain "<" or ">" (satori-html would read them as tags).

module.exports = {
  remember: `High-level policy and low-level detail both depend on an abstraction the policy owns.`,
  framing: `"Inversion" flips the usual import direction: instead of the domain importing the database, the domain defines a port and the database implements it. Source dependencies point toward policy.`,
  why: `When business logic imports concrete infrastructure, you can't test it without that infrastructure and can't swap the detail without editing the core. Inverting the dependency frees and protects the domain.`,
  litmus: `Does your domain layer import anything from the database, HTTP, or framework? If yes, the dependency runs the wrong way.`,
  refactorLabel: `↓ INVERT VIA A DOMAIN-OWNED PORT`,
  smell: `The service reaches straight for a concrete Postgres client:`,
  bad: [
    ["import { PostgresClient } from './pg'", 'c'],
    ['class OrderService {', 'kw'],
    ['  private db = new PostgresClient()   // domain bound to infra', 'c'],
    ["  save(o) { this.db.insert('orders', o) }", ''],
    ['}', ''],
  ],
  good: [
    ['interface OrderRepo { save(o: Order): Promise }', 'kw'],
    ['function makeOrderService(repo: OrderRepo) {   // depends on the port', ''],
    ['  return { place(o) { return repo.save(o) } }', ''],
    ['}', ''],
    ['class SqlOrderRepo implements OrderRepo { save(o){ /* ... */ } }', 'c'],
  ],
  fixNote: `The service depends only on OrderRepo, a port owned by the domain. The concrete SqlOrderRepo implements it and is supplied from outside (DI).`,
  seeAlso: [
    ['dependency-injection', 'the mechanism that supplies the concrete implementation at runtime'],
    ['repository', 'a common port DIP defines over persistence'],
    ['ocp', 'depending on abstractions is what makes modules extension-friendly'],
    ['soc', 'DIP keeps the domain concern free of infrastructure concerns'],
  ],
  interview: [
    ['DIP vs Dependency Injection — same thing?', 'No. DIP is the principle (depend on abstractions, invert the import direction). DI — supplying dependencies from outside via a container or factory — is one mechanism that delivers it.'],
    ['What does the abstraction belong to?', 'The high-level/domain layer owns the interface; the low-level module implements it. That ownership is what makes it "inversion".'],
    ['When is DIP overkill?', 'For trivial code with a single stable implementation an interface is just ceremony. Invert where you need testability or substitution.'],
  ],
  sources: [
    'Robert C. Martin — "The Dependency Inversion Principle" (C++ Report, 1996)',
    'Robert C. Martin — "Clean Architecture" (2017): the dependency rule',
  ],
};
