// Deep-dive content for Decorator (GoF, structural) — GOLD depth.
// Fields: remember, framing, why, roles, apply, litmus, smell, bad, good,
// refactorLabel, fixNote, pitfalls, examples, seeAlso, interview, sources.
// Base comes from the map node. satori gotchas: code flush-left (indent stripped);
// no "<"/">" (lone ">"/"=>" ok); generics via ⟨⟩; never the literal word "constructor".

module.exports = {
  remember: `Wrap an object in a same-typed layer that adds behavior — compose features at runtime, no subclass explosion.`,

  framing: `Decorator wraps an object in a layer that implements the same interface and adds behavior before or after delegating. Because the wrapper is type-compatible with what it wraps, you stack features in any order at runtime, transparently to clients — the composition answer to subclass explosion.`,

  why: `When optional features combine in many ways, a subclass per combination explodes (a BufferedEncryptedLoggingStream, and so on). Decorator keeps one interface and layers behavior with composition, so you start with a plain object and add one wrapper at a time, mixing features freely. The costs: many small look-alike objects, broken identity (a decorator is not == its component), and order-sensitive stacks.`,

  roles: [
    [`Component`, `The shared interface real objects and wrappers both implement.`],
    [`Decorator`, `Abstract wrapper — holds a Component reference and delegates to it.`],
    [`ConcreteDecorator`, `Adds state or behavior before / after delegating the call.`],
  ],

  apply: [
    `Define the Component interface the base object and wrappers share.`,
    `Give each decorator a Component reference and delegate the core call to it.`,
    `Add behavior before or after the delegation in each ConcreteDecorator.`,
    `Stack wrappers at runtime; make the order explicit, it matters.`,
  ],

  litmus: `Do optional features combine in many ways, and must they attach to individual objects at runtime? If subclassing every combination would explode, wrap instead.`,

  smell: `A subclass for every feature combination explodes:`,
  refactorLabel: `↓ WRAP INSTEAD OF SUBCLASS`,
  bad: [
    [`class Coffee {}`, 'kw'],
    [`class MilkCoffee extends Coffee {}`, ''],
    [`class SugarMilkCoffee extends MilkCoffee {}   // and on`, 'c'],
    [`// every feature combo needs its own subclass`, 'c'],
  ],
  good: [
    [`interface Coffee { cost(): number }`, 'kw'],
    [`const espresso = (): Coffee => ({ cost: () => 2 })`, ''],
    [`const milk = (c: Coffee): Coffee => ({`, 'kw'],
    [`  cost: () => c.cost() + 0.5   // wrap, then add`, 'c'],
    [`})`, 'kw'],
    [`milk(espresso()).cost()   // 2.5 — stacked at runtime`, 'c'],
  ],
  fixNote: `milk() wraps any Coffee and adds to cost(); stack milk(sugar(espresso())) in any order, with no new class per combo. Mind that wrapping breaks identity (a decorator is not == its component) and the stack order changes behavior.`,

  pitfalls: [
    `Order matters: retry(cache(x)) differs from cache(retry(x)) — make the stack explicit.`,
    `Wrapping breaks identity: instanceof and == against the inner object fail; unwrap when you must.`,
    `Not the TS @decorator: GoF wraps instances at runtime; TS / Angular decorators annotate at declaration.`,
  ],

  examples: [
    `java.io streams (BufferedInputStream wraps FileInputStream); Node Transform streams (gzip, cipher).`,
    `NestJS interceptors and middleware pipelines wrapping a handler with caching, logging, timeout.`,
    `Function decorators / HOFs (Python @lru_cache, React HOCs, RxJS operators).`,
  ],

  seeAlso: [
    [`proxy`, `same wrapping shape — but controls access (lazy, guard) rather than adding behavior`],
    [`adapter`, `also wraps one object — but changes the interface instead of keeping it`],
    [`composite`, `a Decorator is a Composite with a single child that adds behavior`],
    [`coi`, `"favor composition over inheritance" — the principle Decorator embodies`],
  ],

  interview: [
    [`Decorator vs Proxy?`, `Same wrapping shape, different intent — Decorator adds behavior, Proxy controls access (lazy, remote, guard).`],
    [`Decorator vs inheritance?`, `Inheritance fixes behavior at compile time; decorators compose it at runtime and dodge subclass explosion.`],
    [`Is a TS @decorator the GoF pattern?`, `No — TS / Angular decorators are declaration-time metadata, not runtime instance wrappers.`],
    [`The main downside?`, `Many small look-alike objects, broken identity checks, and order-sensitive stacks.`],
  ],

  sources: [
    `GoF — "Design Patterns" (1994): Decorator (structural)`,
    `Freeman & Robson — "Head First Design Patterns" (2nd ed., 2020): Decorator`,
  ],
};
