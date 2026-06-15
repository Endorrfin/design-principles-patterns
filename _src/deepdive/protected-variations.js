// Deep-dive content for Protected Variations (GRASP). ONE FILE PER CONCEPT.
// Base content comes from the map node; this adds depth.
// Code lines are [text, kind]; kind: 'kw' | 'c' | ''. No "<", ">" or "=>".

module.exports = {
  remember: `Find what will change, and hide it behind something that will not.`,
  framing: `Protected Variations is the unifying GRASP principle: locate points of predicted variation or instability, and wrap each behind a stable interface so change on one side never propagates to clients on the other.`,
  why: `Most coupling pain comes from change leaking across a boundary — a new vendor, format, or platform forcing edits in unrelated code. A stable contract is a firewall: variation is contained at the seam, clients stay untouched.`,
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
  ],
  sources: [
    `Craig Larman — "Applying UML and Patterns" (3rd ed., 2004): Protected Variations`,
    `David Parnas — "On the Criteria To Be Used in Decomposing Systems into Modules" (1972): information hiding`,
  ],
};
