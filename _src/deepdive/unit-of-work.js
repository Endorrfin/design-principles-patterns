// Deep-dive content for Unit of Work. ONE FILE PER CONCEPT (file name = node id)
// so parallel sessions never touch the same file. Fields documented in CLAUDE.md.
// Code lines are [text, kind]; kind: 'kw' | 'c' | ''. No "<"/">" in code.

module.exports = {
  kindWord: `Pattern`,
  refactorLabel: `↓ COMMIT AS ONE UNIT`,
  remember: `Collect every change, then commit once — all of it lands, or none of it does.`,
  framing: `A Unit of Work watches what you create, change, and delete during one business transaction, then flushes them together in a single commit — so a partial write can't leave the database half-updated.`,
  why: `Business operations touch many rows. Saving them one-by-one risks a crash mid-way and inconsistent state, plus a round-trip per write. One unit makes the whole operation atomic and cheaper.`,
  litmus: `If this operation failed halfway, could the database be left inconsistent? If yes, those writes belong inside one Unit of Work.`,
  smell: `Two writes, two commits — a crash between them corrupts state:`,
  bad: [
    [`await orders.insert(order)    // commit 1`, ''],
    [`await stock.decrement(item)   // commit 2 — may never run`, ''],
    [`// crash between them: order saved, stock untouched`, 'c'],
  ],
  good: [
    [`await dataSource.transaction(async (em) => {`, 'kw'],
    [`em.save(order)    // tracked, not yet flushed`, ''],
    [`em.save(stock)    // tracked`, ''],
    [`})  // one commit: all changes land, or none do`, ''],
    [`// TypeORM EntityManager is the Unit of Work`, 'c'],
  ],
  fixNote: `Both changes are tracked and flushed in one transaction: if either fails, the whole unit rolls back. In TypeORM this is the EntityManager inside dataSource.transaction; in EF it's DbContext.SaveChanges, in Hibernate the Session.`,
  seeAlso: [
    ['repository', `repositories register their new/dirty/removed objects; the Unit of Work commits them together`],
    ['command', `a unit is a transactional command — do-all or undo-all, like an executable change-set`],
    ['dip', `the domain enlists changes through an abstraction; the transaction technology stays at the edge`],
    ['memento', `rollback restores prior state — the same "snapshot and revert" idea at transaction scale`],
  ],
  interview: [
    ['Where have you already used Unit of Work?', `Every ORM session implements it: TypeORM transaction/EntityManager, EF DbContext, Hibernate Session all track changes and flush them in one commit.`],
    ['Repository vs Unit of Work?', `A repository accesses one aggregate type; a Unit of Work spans many and owns the transaction boundary — the commit that makes all the repository changes atomic.`],
    ['What does a long Unit of Work cost?', `Held locks and contention: the longer the unit stays open, the more it blocks other writers and risks deadlocks. Keep units short — one per business transaction.`],
  ],
  sources: [
    `Martin Fowler — "Patterns of Enterprise Application Architecture" (2002): Unit of Work`,
    `TypeORM transactions, EF Core DbContext, Hibernate Session — Unit of Work in practice`,
    `Eric Evans — DDD: the aggregate is the consistency / transaction boundary`,
  ],
};
