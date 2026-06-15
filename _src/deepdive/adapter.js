// Deep-dive content for Adapter (GoF, structural) — GOLD depth.
// Fields: remember, framing, why, roles, apply, litmus, smell, bad, good,
// refactorLabel, fixNote, pitfalls, examples, seeAlso, interview, sources.
// Base comes from the map node. satori gotchas: code flush-left (indent stripped);
// no "<"/">" (lone ">"/"=>" ok); generics via ⟨⟩; never the literal word "constructor".

module.exports = {
  remember: `Wrap a class so its interface matches what the client expects — translate, don't rewrite.`,

  framing: `Adapter wraps an existing class in the interface a client expects, translating calls so incompatible code works together unchanged. The Adapter implements the Target interface the client codes against and delegates to the Adaptee's mismatched API — the travel-plug pattern: convert one socket shape into another, nothing more.`,

  why: `When you must reuse a class whose interface doesn't match — a third-party SDK, a legacy API — you often can't change the source, and editing every call site is worse. An adapter isolates the conversion in one place: the client depends only on your Target interface, and the Adaptee stays untouched. The cost is an extra layer that can mask a deeper model mismatch.`,

  roles: [
    [`Target`, `The interface the client codes against (request()).`],
    [`Adaptee`, `The existing class with a useful but mismatched API.`],
    [`Adapter`, `Implements Target, delegates to the Adaptee's methods.`],
  ],

  apply: [
    `Define the Target interface your client actually wants.`,
    `Wrap the Adaptee in an Adapter that implements Target.`,
    `Translate names, parameters, and types inside the adapter — keep it thin.`,
    `Depend on Target everywhere; the Adaptee stays behind the port.`,
  ],

  litmus: `Do you have a useful class with the wrong interface that you can't (or shouldn't) change? If you need it to fit a contract it doesn't match, wrap it in an adapter.`,

  smell: `The app is wired directly to a third-party SDK's shape:`,
  refactorLabel: `↓ WRAP IT BEHIND YOUR OWN PORT`,
  bad: [
    [`// app code speaks Stripe's API everywhere`, 'c'],
    [`stripe.charges.create({ amount, source })`, ''],
    [`// swap to PayPal later → edit every call site`, 'c'],
  ],
  good: [
    [`interface PaymentGateway { charge(cents): Promise }`, 'kw'],
    [`class StripeAdapter implements PaymentGateway {`, 'kw'],
    [`  #sdk = new Stripe(key)`, ''],
    [`  charge(cents) {`, ''],
    [`    return this.#sdk.charges.create({ amount: cents })`, 'c'],
    [`  }`, ''],
    [`}`, 'kw'],
  ],
  fixNote: `The app now depends on PaymentGateway, your interface; StripeAdapter translates to the SDK. Swapping to PayPal is a new adapter — no call site changes. Keep adapters thin: translate only, no business logic.`,

  pitfalls: [
    `Don't adapt when you can change the source — fixing the interface directly is cleaner.`,
    `Stacking adapters over adapters signals a missing abstraction, not a translation problem.`,
    `Keep adapters thin: business logic belongs in the Adaptee or the domain, not the translator.`,
  ],

  examples: [
    `Wrapping axios / fetch or a payment SDK (Stripe, PayPal) behind your own port (hexagonal architecture).`,
    `Arrays.asList(arr) adapting a raw array to List; InputStreamReader adapting bytes to a char Reader.`,
    `ORM drivers and logger bridges presenting one interface over many backends.`,
  ],

  seeAlso: [
    [`facade`, `also fronts other code — but invents a new simpler interface over many classes, not one`],
    [`decorator`, `same wrapping shape — but keeps the interface and adds behavior instead of converting it`],
    [`proxy`, `wraps one object too — but controls access rather than changing the interface`],
    [`bridge`, `looks similar but is planned up front to vary two sides, not retrofitted to fix a mismatch`],
  ],

  interview: [
    [`Adapter vs Decorator?`, `Both wrap an object, but Adapter changes the interface to a different one; Decorator keeps the same interface and layers on behavior.`],
    [`Object vs class adapter?`, `Object adapter composes the Adaptee (adapts its subclasses too); class adapter subclasses it and implements Target — fine in Java, impossible in JS. Prefer the object form.`],
    [`Adapter vs Facade?`, `Adapter makes one existing class fit an expected interface; Facade invents a new, simpler interface over a whole subsystem.`],
    [`Where do you meet it daily?`, `Wrapping third-party SDKs and legacy APIs behind your own port, so the app depends on your interface, not theirs.`],
  ],

  sources: [
    `GoF — "Design Patterns" (1994): Adapter (structural)`,
    `Freeman & Robson — "Head First Design Patterns" (2nd ed., 2020): Adapter & Facade`,
  ],
};
