// Deep-dive content for Builder (GoF, creational) — GOLD standard depth.
// Fields: remember, framing, why, roles, apply, litmus, smell, bad, good,
// refactorLabel, fixNote, pitfalls, examples, seeAlso, interview, sources.
// Base comes from the map node. satori gotchas: code flush-left (indent stripped);
// no "<"/">" (lone ">"/"=>" ok); generics via ⟨⟩; never the literal word "constructor".

module.exports = {
  remember: `Separate how a complex object is assembled from what it ends up being — build it step by step, then validate and emit.`,

  framing: `Builder splits construction into a sequence of small steps held by a Builder object, with an optional Director that orders them, so the same process can yield different representations. It targets the telescoping-ctor problem: instead of one call with a dozen positional args, you name each part, validate, then call build() to get a finished, often immutable result.`,

  why: `A long positional argument list is unreadable and easy to get wrong — which boolean was "cacheable"? — and partially-built objects invite invalid states. A Builder makes each part explicit and optional, validates before build(), and can return an immutable product, so the half-built state lives in the builder and never in the object you hand out.`,

  roles: [
    [`Builder`, `Holds step methods (one per part) and accumulates the configuration.`],
    [`Director`, `Optional — encodes a recipe that calls the steps in a fixed order.`],
    [`Product`, `The assembled, validated result that build() returns.`],
  ],

  apply: [
    `Spot an init with many optional / positional params, or objects that can exist half-built and invalid.`,
    `Add a Builder whose step methods each set one part and return this for chaining.`,
    `Validate inside build() and return the finished (ideally immutable) Product.`,
    `Optionally add a Director to capture a reusable construction recipe.`,
  ],

  litmus: `Are you passing many optional params, or can the object exist half-built and invalid? If naming the parts and validating once at build() would help, use a Builder.`,

  smell: `A telescoping ctor — positional args nobody can read at the call site:`,
  refactorLabel: `↓ NAME THE PARTS, VALIDATE AT build()`,
  bad: [
    [`new Query('users', ['id'], 'age > 18',`, ''],
    [`          null, 10, true, false)   // which flag?`, 'c'],
    [`// optional params pile up; invalid combos slip through`, 'c'],
  ],
  good: [
    [`const q = new QueryBuilder()`, 'kw'],
    [`  .select('id').from('users')`, ''],
    [`  .where('age > 18').limit(10)`, ''],
    [`  .build()   // validates, returns an immutable Query`, 'c'],
  ],
  fixNote: `Each step names one part and returns this for chaining; build() validates and emits an immutable Query. No half-built object ever escapes, and the call site reads top to bottom.`,

  pitfalls: [
    `Reaching for a Builder on a 2-3 field object — it is boilerplate that a plain object literal or named params beat.`,
    `Forgetting to validate in build(), so the builder just relocates the same invalid-state problem.`,
    `A mutable "product" that keeps its setters after build() — leak the builder, not a half-open object.`,
  ],

  examples: [
    `Query builders (Knex, TypeORM createQueryBuilder) assembling SQL step by step.`,
    `HTTP / request builders and test-data builders (the fluent fixture / "Object Mother").`,
    `StringBuilder and fluent config objects where parts accrue before a final build.`,
  ],

  seeAlso: [
    [`abstract-factory`, `returns ready families immediately; Builder assembles one object over several steps`],
    [`factory-method`, `simple delegated creation; Builder is for multi-step, validated assembly`],
    [`prototype`, `clone a prepared instance when building from scratch is the costly part`],
    [`composite`, `Builders are a natural fit for assembling a Composite tree node by node`],
  ],

  interview: [
    [`Builder vs Abstract Factory?`, `Builder constructs one complex object step by step and cares how it is assembled; Abstract Factory returns families of products immediately and cares what they are.`],
    [`What problem does Builder actually solve?`, `Telescoping ctors and invalid half-built state: it names optional parts, validates once at build(), and can hand back an immutable result.`],
    [`Is the Director required?`, `No. The fluent-builder form most TS/JS code uses drops the Director; you add one only to reuse a fixed construction recipe.`],
    [`When is Builder overkill?`, `For small objects with few fields — an object literal or default params is clearer. Builder earns its keep with many optional parts or validation.`],
  ],

  sources: [
    `GoF — "Design Patterns" (1994): Builder (creational)`,
    `Joshua Bloch — "Effective Java" (3rd ed., 2018): Item 2 — use a builder when faced with many optional parameters`,
  ],
};
