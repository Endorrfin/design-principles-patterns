// Deep-dive content for High Cohesion (GRASP) — GOLD standard.
// Fields: remember, framing, why, roles, apply, litmus, smell, bad, good,
// refactorLabel, fixNote, pitfalls, examples, seeAlso, interview, sources.
// Base comes from the map node. satori: code flush-left; no "<"; no "constructor".

module.exports = {
  remember: `Each class should hold one job's worth of strongly related work.`,

  framing: `Cohesion measures how single-minded a class is — how strongly its methods and fields pull toward one purpose. High cohesion means everything in the class belongs together and serves the same goal; low cohesion is a grab-bag where unrelated duties share a class only by accident of history. It is the constant partner of Low Coupling.`,

  why: `Highly cohesive classes are easy to name, understand, test, and reuse, and they change for fewer reasons. Low cohesion spreads one concept across many classes and pulls unrelated dependencies into each, which raises coupling. Most "this class is hard to name" or "I touch it for everything" pain is really a cohesion problem.`,

  roles: [
    [`Cohesion`, `How closely a class's responsibilities relate — ideally all serving one clear purpose.`],
    [`Goal`, `Focused, single-purpose classes you can name in one phrase and reason about in isolation.`],
    [`Means`, `Extract unrelated duties into their own classes; group together only what truly belongs.`],
  ],

  apply: [
    `Try to describe the class's job in one sentence with no "and".`,
    `If you need an "and", or methods touch unrelated fields, you have multiple responsibilities.`,
    `Extract each cluster of related methods plus its data into its own focused class.`,
    `Balance against coupling — do not split until classes turn anemic and chatty.`,
  ],

  litmus: `Can you describe the class's job in one sentence without using "and"? Do most methods use most of its fields? Several "and"s, or fields touched by only one method, signal low cohesion.`,

  smell: `Order computes tax, renders a PDF, and sends email — three unrelated concerns in one class:`,
  refactorLabel: `↓ SPLIT BY CONCERN`,
  bad: [
    [`class Order {`, 'kw'],
    [`  total() { /* domain */ }`, ''],
    [`  renderPdf() { /* presentation */ }   // unrelated`, 'c'],
    [`  sendEmail() { /* messaging */ }      // unrelated`, 'c'],
    [`}`, 'kw'],
  ],
  good: [
    [`class Order { total() { /* domain only */ } }`, 'kw'],
    [`class PayslipPdf { render(o: Order) {} }   // presentation`, 'kw'],
    [`class Mailer { send(o: Order) {} }         // messaging`, 'kw'],
    [`// each class now has one focused responsibility`, 'c'],
  ],
  fixNote: `Each class now has one reason to exist. They still compose when needed, but a change to PDF layout no longer risks the tax logic.`,

  pitfalls: [
    `Over-splitting into one-method classes — cohesion collapses into coordination overhead and higher coupling.`,
    `"Manager", "Helper", and "Util" buckets that accrete unrelated functions over time.`,
    `Mixing layers in one class (domain plus persistence plus presentation) — three reasons to change.`,
  ],

  examples: [
    `Order (domain) · OrderRepository (persistence) · InvoicePdf (rendering) instead of one Order doing all three.`,
    `A React component split into view plus a custom hook for data logic.`,
    `Small value objects (Money, Email) whose every method serves the one concept.`,
  ],

  seeAlso: [
    ['srp', `the SOLID phrasing of cohesion — "one reason to change"`],
    ['low-coupling', `its constant counter-force — balance, do not maximise either`],
    ['information-expert', `placing behaviour with its data usually raises cohesion`],
    ['soc', `Separation of Concerns is cohesion at architectural scale`],
  ],

  interview: [
    [`High Cohesion vs SRP?`, `Nearly the same lens: SRP says "one reason to change", High Cohesion asks "how related are the duties". SRP is the SOLID framing of cohesion.`],
    [`How do you measure cohesion?`, `Informally: name the class without "and", check whether methods share its fields. Formal metrics like LCOM exist, but the one-sentence test catches most cases.`],
    [`Can cohesion be too high?`, `Splitting until every class has one trivial method gives anemic, scattered design and raises coupling. Cohesion is balanced against coupling, not pushed to an extreme.`],
    [`What's a quick smell of low cohesion?`, `A class you can't name without "and", a "Manager / Util" catch-all, or methods that each use a different subset of fields. These signal duties that belong in separate classes.`],
  ],

  sources: [
    `Craig Larman — "Applying UML and Patterns" (3rd ed., 2004): High Cohesion`,
    `Stevens, Myers & Constantine — "Structured Design" (1974): the cohesion scale`,
  ],
};
