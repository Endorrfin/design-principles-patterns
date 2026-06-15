// Deep-dive content for Repository. ONE FILE PER CONCEPT (file name = node id) so
// that parallel sessions never touch the same file. Fields documented in CLAUDE.md.
// Code lines are [text, kind]; kind: 'kw' | 'c' | ''. No ASCII "<"/">" in code —
// generics use the look-alikes U+27E8/U+27E9 (rendered, never parsed as tags).

module.exports = {
  kindWord: `Pattern`,
  refactorLabel: `↓ HIDE STORAGE BEHIND A PORT`,
  remember: `Talk to storage in domain words — "find the order", not "SELECT * FROM orders".`,
  framing: `A Repository is an in-memory illusion of a collection of aggregates. The domain calls find / add / remove in its own language; the mapping to SQL or an ORM hides behind the port.`,
  why: `If domain code writes queries, persistence leaks everywhere and you can't test logic without a database. A repository concentrates that knowledge behind one interface you can swap or fake.`,
  litmus: `Can you run your domain logic against an in-memory fake with zero SQL? If business code contains query strings, the repository boundary is leaking.`,
  smell: `A domain service hand-writing SQL and mapping rows itself:`,
  bad: [
    [`class CheckoutService {`, 'kw'],
    [`pay(id: string) {`, ''],
    [`const row = db.query('select * from orders where id=?', id)`, ''],
    [`const order = mapRow(row)   // mapping inside the domain`, ''],
    [`}`, ''],
    [`}  // SQL + business rules tangled together`, 'c'],
  ],
  good: [
    [`interface OrderRepo {`, 'kw'],
    [`byId(id: string): Promise⟨Order⟩`, ''],
    [`save(o: Order): Promise⟨void⟩`, ''],
    [`}`, ''],
    [`// SqlOrderRepo implements it via TypeORM, behind the port`, 'c'],
    [`// domain talks to OrderRepo only: swappable + fakeable`, 'c'],
  ],
  fixNote: `The domain depends only on OrderRepo. Tests inject an in-memory fake; production wires SqlOrderRepo (TypeORM) behind the same port. Resist a generic find-everything repo — expose intention-revealing methods like openOrdersFor(customer).`,
  seeAlso: [
    ['unit-of-work', `repositories enlist their new/dirty/removed objects; the Unit of Work commits them in one transaction`],
    ['dip', `the domain owns the OrderRepo interface; the SQL implementation depends inward on it`],
    ['dependency-injection', `the concrete repo is injected, which is what makes storage swappable and fakeable`],
    ['facade', `a repository is a domain-facing facade over the ORM / data mapper`],
  ],
  interview: [
    ['Repository vs DAO?', `A DAO is table/row-oriented and close to the database; a Repository is aggregate/domain-oriented and speaks the ubiquitous language. One repository per aggregate root, not one per table.`],
    ['Is a generic Repository⟨T⟩ a good idea?', `Usually a smell: it leaks CRUD and invites ad-hoc queries everywhere. Prefer explicit, intention-revealing methods per aggregate; add a generic base only for genuinely shared behavior.`],
    ['Where does query logic live?', `Inside the repository implementation, never the domain. The interface stays in domain terms; the impl translates to SQL/ORM and is the single place to tune queries.`],
  ],
  sources: [
    `Eric Evans — "Domain-Driven Design" (2003): Repositories for aggregate access`,
    `Martin Fowler — "Patterns of Enterprise Application Architecture" (2002): Repository`,
    `TypeORM, EF Core, Hibernate — repository & data-mapper implementations`,
  ],
};
