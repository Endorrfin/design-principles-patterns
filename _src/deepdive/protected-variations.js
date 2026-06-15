// Deep-dive content for Protected Variations (GRASP) — GOLD standard.
// Fields: remember, framing, why, roles, apply, litmus, smell, bad, good,
// refactorLabel, fixNote, pitfalls, examples, seeAlso, interview, sources.
// Base comes from the map node. satori: code flush-left; no "<"; no "constructor".

module.exports = {
  remember: `Find what will change, and hide it behind something that will not.`,

  framing: `Protected Variations is the principle the others serve: find the points where change is likely — a vendor, a data format, a platform, a volatile module — and wrap each behind a stable interface. Clients depend only on that contract, so when the implementation behind it changes, nothing on the other side has to. Larman calls it the root principle that Low Coupling, Polymorphism, and Indirection all work toward.`,

  why: `Almost all expensive change is change that leaks across a boundary — a swapped payment provider forcing edits in unrelated code. A stable interface acts as a firewall: the variation is contained at the seam and clients stay untouched. The discipline is to protect predicted variation, not imagined variation — guarding every "what if" is speculative generality, which costs more than it saves.`,

  roles: [
    [`Variation point`, `A spot where change is predicted or instability is likely — vendor, format, protocol, platform.`],
    [`Stable interface`, `The contract clients depend on; it stays put while implementations move behind it.`],
    [`Implementations`, `The interchangeable concretes hidden behind the interface and swapped without client edits.`],
  ],

  apply: [
    `Identify what is likely to change or is already unstable.`,
    `Define a stable interface that expresses what clients need, not how it's done.`,
    `Put each implementation behind that interface.`,
    `Depend only on the interface — and resist wrapping changes you can't actually foresee (YAGNI).`,
  ],

  litmus: `Is this a known or likely change (vendor, format, protocol)? If yes, wrap it. Is it speculative? Then YAGNI — protect predicted variation, not imagined variation.`,

  smell: `Business code calls Stripe directly — switching or adding a provider means editing every call site:`,
  refactorLabel: `↓ WRAP THE VARIATION`,
  bad: [
    [`class Checkout {`, 'kw'],
    [`  pay(cents: number) {`, ''],
    [`    new Stripe(key).charge(cents)  // wired to one vendor everywhere`, 'c'],
    [`  }`, ''],
    [`}`, 'kw'],
  ],
  good: [
    [`interface PaymentGateway { pay(cents: number): Promise }`, 'kw'],
    [`class StripeGateway implements PaymentGateway {`, 'kw'],
    [`  pay(c: number) { return stripe.charge(c) }`, ''],
    [`}`, 'kw'],
    [`class Checkout {`, 'kw'],
    [`  private gw!: PaymentGateway   // the stable seam, injected`, 'c'],
    [`}`, 'kw'],
  ],
  fixNote: `Stripe, PayPal, or a mock all sit behind PaymentGateway; clients depend only on the contract. Guess the seam right and change is a new class — guess wrong and the abstraction is wasted cost.`,

  pitfalls: [
    `Speculative generality — protecting against imagined change you never end up needing.`,
    `Guessing the seam wrong, so the "stable" interface leaks and churns anyway.`,
    `Abstracting a single, never-changing implementation — cost with no protection earned.`,
  ],

  examples: [
    `A PaymentGateway interface with Stripe / PayPal implementations behind it.`,
    `A Repository hiding the database; an ILogger / IClock hiding infrastructure.`,
    `Adapters around third-party SDKs so a vendor swap touches one class.`,
  ],

  seeAlso: [
    ['ocp', `the same idea from SOLID — open to new variants, closed to client edits`],
    ['dip', `depend on the stable abstraction, not the volatile implementation`],
    ['indirection', `a common mechanism for building the protective seam`],
    ['polymorphism', `implementations behind the interface are selected polymorphically`],
  ],

  interview: [
    [`Protected Variations vs OCP?`, `The same idea from two lineages: OCP (SOLID) and Protected Variations (GRASP) both isolate variation behind a stable abstraction. PV is the more general root principle.`],
    [`How is PV different from speculative generality?`, `PV protects predicted, evidenced variation; speculative generality guards against imagined change. The discipline is YAGNI — wrap a seam only when the change is likely.`],
    [`Why is PV called a "root" principle?`, `Larman frames Low Coupling, Polymorphism, and Indirection as ways to achieve it. Many patterns (Adapter, Strategy, Facade) are concrete Protected-Variations mechanisms.`],
    [`How do you decide where to apply it?`, `Protect variation you can predict with evidence — a roadmap item, a flaky vendor, a format that's changed before. If you can't point to a concrete reason it will change, leave it concrete; YAGNI beats guessing.`],
  ],

  sources: [
    `Craig Larman — "Applying UML and Patterns" (3rd ed., 2004): Protected Variations`,
    `David Parnas — "On the Criteria To Be Used in Decomposing Systems into Modules" (1972): information hiding`,
  ],
};
