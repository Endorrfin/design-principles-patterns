// Deep-dive content for Observer (GoF, behavioral) — GOLD depth.
// Fields: remember, framing, why, roles, apply, litmus, smell, bad, good,
// refactorLabel, fixNote, pitfalls, examples, seeAlso, interview, sources.
// Base comes from the map node. satori gotchas: code flush-left (indent stripped);
// no "<"/">" (lone ">"/"=>" ok); generics via ⟨⟩; never the literal word "constructor".

module.exports = {
  remember: `One subject's change is broadcast to many observers automatically — coupled only through a thin interface.`,

  framing: `Observer wires a one-to-many dependency: a subject keeps a list of observers and, when its state changes, notifies them all. Subject and observers are coupled only through a thin update() interface, so the subject broadcasts without knowing who is listening, and listeners come and go at runtime.`,

  why: `When a change in one object must update an unknown number of others, hard-wiring the calls couples the subject to every dependent and breaks each time the set changes. Observer inverts that: the subject talks to an interface and fans out one notify() to all registered observers, so you add listeners without touching it (OCP). The classic cost is the lapsed-listener leak — observers that forget to unsubscribe — plus hard-to-trace update cascades.`,

  roles: [
    [`Subject`, `Keeps the observer list — attach / detach / notify.`],
    [`Observer`, `The update() interface every dependent implements.`],
    [`ConcreteObserver`, `Holds a reference, reacts, and syncs to the subject's state.`],
  ],

  apply: [
    `Give the subject attach / detach and a notify() that loops its observers.`,
    `Have observers implement one update() (push the data, or let them pull it).`,
    `Subscribe at setup and, crucially, detach on teardown to avoid leaks.`,
    `Guard each callback so one throwing observer can't starve the rest.`,
  ],

  litmus: `Does a change in one object need to update an unknown, changing set of others? If you don't know how many dependents up front, broadcast through an observer list.`,

  smell: `The subject calls each dependent by name — welded to all of them:`,
  refactorLabel: `↓ BROADCAST TO A LIST OF OBSERVERS`,
  bad: [
    [`class Cart {`, 'kw'],
    [`  addItem(x) {`, ''],
    [`    badge.refresh()     // hard-wired dependents`, 'c'],
    [`    analytics.track(x)  // add one → edit Cart`, 'c'],
    [`  }`, ''],
    [`}`, 'kw'],
  ],
  good: [
    [`type Observer = (c: Cart) => void`, 'kw'],
    [`class Cart {`, 'kw'],
    [`  #obs = new Set⟨Observer⟩()`, ''],
    [`  subscribe(o: Observer) { this.#obs.add(o) }`, ''],
    [`  addItem(x) { this.total += x.price; this.#notify() }`, ''],
    [`  #notify() { this.#obs.forEach(o => o(this)) }`, 'c'],
    [`}`, 'kw'],
  ],
  fixNote: `Cart now notifies a list it never had to name; badge and analytics subscribe and can be added or removed without editing Cart. Pair every subscribe with an unsubscribe on teardown, or you leak the observers.`,

  pitfalls: [
    `Lapsed-listener leak: observers that never unsubscribe keep the subject (and themselves) alive — always pair subscribe with teardown.`,
    `Don't rely on notification order; assuming one makes behavior fragile and registration-dependent.`,
    `A blind notify can trigger wide cascades or re-entrancy; an unguarded loop lets one throwing observer skip the rest — isolate each callback.`,
  ],

  examples: [
    `Node EventEmitter (.on / .emit) and DOM addEventListener; RxJS Observables and Subjects.`,
    `Fine-grained reactive signals (SolidJS, Vue, Angular) auto-tracking deps and batching updates.`,
    `Model-view sync in MVVM and reactive UI.`,
  ],

  seeAlso: [
    [`mediator`, `centralizes routing through a hub; Observer is decentralized one-to-many broadcast`],
    [`command`, `an observer's reaction is often a Command the subject fires`],
    [`mvvm`, `the View observes the ViewModel — Observer is the binding mechanism`],
    [`low-coupling`, `Observer is a textbook low-coupling technique — talk through an interface`],
  ],

  interview: [
    [`Observer vs Pub/Sub?`, `Observer's subject holds direct references to its observers; Pub/Sub routes through a broker / channel so publisher and subscriber never know each other.`],
    [`Push or pull?`, `Push sends the changed data in the notification; pull lets observers query what they need. Push is simpler, pull is more flexible.`],
    [`Most common bug?`, `The lapsed-listener leak — observers that never unsubscribe keep the subject (and themselves) alive. Always pair subscribe with teardown.`],
    [`What if an observer throws?`, `In a naive loop it aborts the rest. Wrap each callback, or deliver via a queue, so one failure can't starve other observers.`],
  ],

  sources: [
    `GoF — "Design Patterns" (1994): Observer (behavioral)`,
    `Freeman & Robson — "Head First Design Patterns" (2nd ed., 2020): Observer`,
  ],
};
