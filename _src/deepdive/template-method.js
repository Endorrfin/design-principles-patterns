// Deep-dive content for Template Method (GoF, behavioral) — GOLD depth.
// Fields: remember, framing, why, roles, apply, litmus, smell, bad, good,
// refactorLabel, fixNote, pitfalls, examples, seeAlso, interview, sources.
// Base comes from the map node. satori gotchas: code flush-left (indent stripped);
// no "<"/">" (lone ">"/"=>" ok); generics via ⟨⟩; never the literal word "constructor".

module.exports = {
  remember: `The base method fixes the algorithm's skeleton and order; subclasses fill only the varying steps.`,

  framing: `Template Method freezes an algorithm's skeleton in a base method that calls a few overridable steps in a fixed order. Subclasses supply the varying parts — required abstract steps and optional hooks — but can never reorder or skip the skeleton. It is the Hollywood Principle: don't call us, the base calls your steps.`,

  why: `When several variants share the same overall flow but differ in a step or two, copying the whole flow into each duplicates the invariant and lets versions drift. Template Method writes the order once in the base and defers only the gaps, killing the duplication and keeping you in control of where extension is allowed. The cost is inheritance coupling — subclasses bind to the base, only one variation axis works well, and base changes are fragile.`,

  roles: [
    [`AbstractClass`, `Holds the template method — the fixed skeleton calling primitive and hook steps.`],
    [`primitiveOperation()`, `An abstract step each subclass must supply; the base only declares it.`],
    [`ConcreteClass`, `Overrides the deferred steps (and optional hooks), never the skeleton.`],
  ],

  apply: [
    `Write the invariant flow once in a base templateMethod(), in a fixed order.`,
    `Declare the varying parts as abstract steps (required) or hooks (optional defaults).`,
    `Subclass to fill the steps; never let a subclass reorder or skip the skeleton.`,
    `If two steps vary independently, prefer Strategy — Template Method is one-axis.`,
  ],

  litmus: `Do several variants share one fixed flow but differ in a step or two? If the order is invariant and only steps change, template the skeleton and defer the steps.`,

  smell: `Two reports duplicate the whole render flow just to change one step:`,
  refactorLabel: `↓ HOIST THE SKELETON, DEFER THE STEPS`,
  bad: [
    [`class InvoiceReport {`, 'kw'],
    [`  render() { return head() + rows() + foot() }`, ''],
    [`}`, 'kw'],
    [`class TaxReport {`, 'kw'],
    [`  render() { return head() + taxRows() + foot() }  // dup`, 'c'],
    [`}`, 'kw'],
  ],
  good: [
    [`abstract class Report {`, 'kw'],
    [`  render(): string {        // template, fixed order`, 'c'],
    [`    return this.head() + this.body() + this.foot()`, ''],
    [`  }`, 'kw'],
    [`  protected head() { return '' }   // hook (optional)`, 'c'],
    [`  protected abstract body(): string   // step (required)`, 'c'],
    [`}`, 'kw'],
    [`class Invoice extends Report { body() { return rows() } }`, ''],
  ],
  fixNote: `The render order lives once in Report.render(); subclasses override only body() (and optionally head() / foot()). Add a WebReport by subclassing — the skeleton never changes. If steps must vary on several axes, switch to Strategy.`,

  pitfalls: [
    `Inheritance coupling: subclasses bind to the base's internals, so a base change can break every subclass (fragile base class).`,
    `One axis only: two independently-varying steps explode into a subclass matrix — Strategy composes far better.`,
    `Abstract vs hook: an abstract step is mandatory, a hook has a safe default — pick deliberately, and overridden steps must honor the base's contract (Liskov).`,
  ],

  examples: [
    `Framework lifecycles: JUnit setUp → test → tearDown; HttpServlet.service() dispatching to doGet / doPost.`,
    `java.util.AbstractList (get / size abstract; iterator / equals templated on them).`,
    `A build pipeline, or a sort with a pluggable comparator step.`,
  ],

  seeAlso: [
    [`strategy`, `the composition alternative — varies a whole algorithm at runtime, no inheritance`],
    [`factory-method`, `a Template Method specialized for creation (the deferred step is "create")`],
    [`coi`, `"favor composition over inheritance" — why Strategy often beats Template Method`],
    [`lsp`, `overridden steps must honor the base's contract or the templated algorithm misbehaves`],
  ],

  interview: [
    [`Template Method vs Strategy?`, `Same goal — vary part of an algorithm. Template uses inheritance and a fixed base skeleton; Strategy composes the varying part as an object, swappable at runtime.`],
    [`What's the Hollywood Principle?`, `"Don't call us, we'll call you" — the base class drives the flow and calls down into your overridden steps; you don't call the skeleton.`],
    [`Abstract step vs hook?`, `An abstract step is mandatory — the subclass must implement it. A hook has a default (often empty) and override is optional.`],
    [`Main drawback?`, `Inheritance coupling: subclasses are tied to the base, only one variation axis works well, and base changes are fragile.`],
  ],

  sources: [
    `GoF — "Design Patterns" (1994): Template Method (behavioral)`,
    `Freeman & Robson — "Head First Design Patterns" (2nd ed., 2020): Template Method`,
  ],
};
