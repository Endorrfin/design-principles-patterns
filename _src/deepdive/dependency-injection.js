// Deep-dive content for Dependency Injection. ONE FILE PER CONCEPT (file name =
// node id) so parallel sessions never touch the same file. Fields per CLAUDE.md.
// Code lines are [text, kind]; kind: 'kw' | 'c' | ''. No "<"/">" in code.
// "constructor" is dropped by satori-html unless split into two spans (CT below);
// prose avoids the bare word entirely.

const CT = `<span style="display:flex;">construct</span><span style="display:flex;">or</span>`;

module.exports = {
  kindWord: `Pattern`,
  refactorLabel: `↓ INVERT THE WIRING`,
  remember: `Don't let an object new its own collaborators — have them handed in.`,
  framing: `Instead of creating its collaborators, an object declares what it needs and lets an outside wirer supply them. That one inversion is what makes code swappable and testable.`,
  why: `An object that news its dependencies is welded to concrete types — you can't substitute a fake in tests or a different impl in production. Supplying them from outside breaks that weld and centralizes wiring.`,
  litmus: `Scan the class for new on a collaborator, or a global/singleton lookup. If it builds or fetches its own dependencies, they aren't injected.`,
  smell: `A service that builds its own dependency — now welded to SqlOrderRepo:`,
  bad: [
    [`class OrderService {`, 'kw'],
    [`private repo = new SqlOrderRepo(db)   // self-wired`, ''],
    [`place(o: Order) { this.repo.save(o) }`, ''],
    [`}`, ''],
    [`// welded to SqlOrderRepo; tests need a real database`, 'c'],
  ],
  good: [
    [`@Injectable()`, 'kw'],
    [`class OrderService {`, 'kw'],
    [`${CT}(private repo: OrderRepo) {}   // injected from outside`, ''],
    [`}`, ''],
    [`// wired once in the module:`, 'c'],
    [`providers: [{ provide: OrderRepo, useClass: SqlOrderRepo }]`, ''],
  ],
  fixNote: `OrderService now declares OrderRepo and Nest supplies it. Tests pass a fake repo; production wires SqlOrderRepo in the module. DI is the technique — the container just automates the wiring you could do by hand at the composition root.`,
  seeAlso: [
    ['dip', `DI is how you realize Dependency Inversion at runtime — depend on abstractions, inject the concretes`],
    ['repository', `inject the repository interface so storage stays swappable and fakeable`],
    ['singleton', `a DI container gives single, shared instances without the Singleton anti-pattern`],
    ['strategy', `injecting which implementation to use is Strategy chosen by configuration`],
  ],
  interview: [
    ['Is DI the same as a DI container?', `No. DI is the technique — pass dependencies in from outside. A container (Nest, Spring) is optional tooling that automates the wiring; you can do DI by hand with plain new at the composition root.`],
    ['Which injection style do you prefer, and why?', `For required dependencies, inject them at creation: the object is never half-built and its needs are explicit. Setters suit optional ones; field injection hides dependencies and hurts testability.`],
    ['Does DI remove the new keyword?', `No — something must still create objects. DI pushes those new calls to the composition root (the container or main wiring), so the rest of the code depends on abstractions and stays testable.`],
  ],
  sources: [
    `Martin Fowler — "Inversion of Control Containers and the Dependency Injection pattern" (2004)`,
    `Mark Seemann — "Dependency Injection Principles, Practices, and Patterns" (2019)`,
    `NestJS, Angular, Spring — DI containers in modern frameworks`,
  ],
};
