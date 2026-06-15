// Deep-dive content for Singleton (GoF, creational) — GOLD standard depth.
// Fields: remember, framing, why, roles, apply, litmus, smell, bad, good,
// refactorLabel, fixNote, pitfalls, examples, seeAlso, interview, sources.
// Base comes from the map node. satori gotchas: code flush-left (indent stripped);
// no "<"/">" (lone ">"/"=>" ok); generics via ⟨⟩; never the literal word "constructor".

module.exports = {
  remember: `One instance per process, reached through one well-known door — but that door is hidden global state.`,

  framing: `Singleton fixes how many of a thing exist at exactly one and publishes a single global access point to reach it. The intent is control, not convenience: the class itself owns its one instance and the path to get it, instead of letting callers new their own copies. Modern caveat — the same one-instance guarantee usually belongs in a DI container's singleton scope, not a hand-rolled global.`,

  why: `A second, accidental instance breaks every assumption built on "there is only one" — two caches, two config copies, two pools drifting out of sync. But the global access point is the catch: any module can reach the singleton without declaring it, so dependencies go invisible, tests can't substitute a fake, and init-order bugs hide in plain sight. You buy one guaranteed identity and pay in hidden coupling.`,

  roles: [
    [`Private ctor`, `Blocks new from outside, so no other code can mint a second instance — every creation path funnels inward.`],
    [`Static field`, `One cached slot that holds the sole instance for the whole process.`],
    [`getInstance()`, `The single global door — lazily builds on the first call, then returns the cached one.`],
  ],

  apply: [
    `Confirm you truly need one instance, not just convenient global access.`,
    `Make creation unreachable from outside (a private ctor or a module-private factory).`,
    `Cache the instance in one static slot; build it lazily on first request.`,
    `Expose one accessor — or better, register it singleton-scoped in your DI container.`,
  ],

  litmus: `Would a second instance be a bug, not just waste? If two copies merely cost memory, you want caching. Singleton is for when duplicate identity breaks correctness.`,

  smell: `Every caller news its own Config, so "shared" settings quietly diverge:`,
  refactorLabel: `↓ FUNNEL CREATION THROUGH ONE DOOR`,
  bad: [
    [`// every caller can build its own Config`, 'c'],
    [`class Config { env = loadEnv() }`, 'kw'],
    [`const a = new Config(), b = new Config()`, ''],
    [`// a !== b — two configs drift out of sync`, 'c'],
  ],
  good: [
    [`class Config {`, 'kw'],
    [`  static #i: Config   // the one cached object`, 'c'],
    [`  static get(): Config {   // single global door`, 'c'],
    [`    return (Config.#i ??= new Config())`, ''],
    [`  }`, 'kw'],
    [`}`, 'kw'],
    [`// Node idiom: export const config = new Config()`, 'c'],
  ],
  fixNote: `Creation now funnels through Config.get(), which caches the one instance; lock the ctor to private so new can't escape the class. In Node a cached module export gives the same guarantee — and a DI singleton scope gives it without the hidden global.`,

  pitfalls: [
    `Using Singleton as a socket for global variables — convenient reach now, hidden coupling and untestable code later.`,
    `Assuming "one per process": worker_threads, serverless warm starts, and duplicate bundled copies each mint their own — it is one-per-realm, not truly global.`,
    `Naive lazy getInstance() is not thread-safe outside single-threaded Node; under real threads you need eager init, a lock, the holder idiom, or an enum.`,
  ],

  examples: [
    `A NestJS @Injectable() provider in default singleton scope — one instance the container owns and can inject (and swap in tests).`,
    `java.lang.Runtime.getRuntime() and Spring's default singleton-scoped beans.`,
    `A Node module that exports new Logger() — the module cache makes it a de-facto singleton.`,
  ],

  seeAlso: [
    [`dependency-injection`, `the modern replacement — same one-instance guarantee, but injectable and mockable`],
    [`factory-method`, `getInstance() is a static creator that hides which concrete instance you get`],
    [`abstract-factory`, `a concrete factory is often itself kept as a single shared instance (GoF)`],
    [`facade`, `a single front-door object is frequently kept as one Singleton`],
  ],

  interview: [
    [`Why is Singleton often called an anti-pattern?`, `It is hidden global state: tight coupling, hard to test, and an unclear lifecycle. Most cases are better served by a DI singleton-scoped service.`],
    [`Is getInstance() thread-safe by default?`, `No — naive lazy creation isn't. Use eager init, double-checked locking, the holder idiom, or an enum (Effective Java).`],
    [`Singleton vs a static class?`, `A Singleton is a real object: it can implement interfaces, be subclassed, mocked, and passed around. A static utility class can't.`],
    [`What bites in serverless?`, `Instance state survives across warm invocations, so it can leak or surprise between requests — keep singletons stateless or scope per request.`],
  ],

  sources: [
    `GoF — "Design Patterns: Elements of Reusable OO Software" (1994): Singleton (creational)`,
    `Joshua Bloch — "Effective Java" (3rd ed., 2018): Item 3 — enforce the singleton property; prefer dependency injection`,
  ],
};
