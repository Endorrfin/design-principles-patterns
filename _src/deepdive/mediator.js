// Deep-dive content for Mediator (GoF, behavioral) — GOLD depth.
// Fields: remember, framing, why, roles, apply, litmus, smell, bad, good,
// refactorLabel, fixNote, pitfalls, examples, seeAlso, interview, sources.
// Base comes from the map node. satori gotchas: code flush-left (indent stripped);
// no "<"/">" (lone ">"/"=>" ok); generics via ⟨⟩; never the literal word "constructor".

module.exports = {
  remember: `Colleagues stop calling each other — they call one hub that coordinates them.`,

  framing: `Mediator turns a tangled mesh of objects talking directly into a star: every colleague reports to one mediator, and the mediator decides who reacts. Components know only the hub, never each other, so many-to-many references collapse into many-to-one.`,

  why: `When components reference and call each other directly, every new interaction adds edges to a graph that is hard to follow and impossible to reuse a piece of. Centralizing the interaction in one mediator decouples the colleagues — each depends only on the hub — and puts the choreography in one testable place you can change without rewiring the parts. The risk: the hub accretes logic until it becomes a god object.`,

  roles: [
    [`Mediator`, `The interface colleagues call — notify(sender, event).`],
    [`ConcreteMediator`, `Coordinates the colleagues and holds their references.`],
    [`Colleague`, `A component that knows only its mediator, not its peers.`],
  ],

  apply: [
    `Identify components wired directly to each other in tangled ways.`,
    `Define a Mediator interface with a notify(sender, event) entry point.`,
    `Have each colleague report events to the mediator instead of calling peers.`,
    `Put the routing — who reacts to what — in the ConcreteMediator alone.`,
  ],

  litmus: `Are objects interacting in complex, tangled ways that are hard to follow or reuse? If the interaction graph itself is the problem, move the wiring into a hub.`,

  smell: `Each widget calls the others directly — an N-to-N tangle:`,
  refactorLabel: `↓ ROUTE EVERYTHING THROUGH A HUB`,
  bad: [
    [`// Checkbox calls every peer directly`, 'c'],
    [`okButton.enable()       // knows the button`, ''],
    [`statusLabel.refresh()   // and the label`, ''],
    [`priceTotal.update()     // the N-to-N tangle grows`, 'c'],
  ],
  good: [
    [`class Dialog {   // the mediator / hub`, 'kw'],
    [`  notify(sender, e) {`, ''],
    [`    if (e === 'toggle') this.ok.enable()`, ''],
    [`  }   // all routing lives here`, 'c'],
    [`}`, 'kw'],
    [`class Checkbox {`, 'kw'],
    [`  toggle() { this.hub.notify(this, 'toggle') }`, ''],
    [`}`, 'kw'],
  ],
  fixNote: `Colleagues now emit events to the mediator and never reference each other; the interaction rules live in Dialog alone, where you can test and change them. Watch that the hub doesn't swell into a god object.`,

  pitfalls: [
    `God-object risk: all coordination piles into the mediator until it knows too much — keep routing thin.`,
    `It trades pairwise coupling between colleagues for everyone's coupling to one hub — a single point of failure for the interaction.`,
    `Don't reach for it when two or three objects interact simply — a direct reference is clearer than the indirection.`,
  ],

  examples: [
    `Chat rooms and air-traffic control (GoF's own): participants talk to the hub, never peer-to-peer.`,
    `MediatR (.NET in-process CQRS) and Redux / NgRx stores: components dispatch to one hub that owns transitions.`,
    `DOM event delegation: one parent listener routes events from many children.`,
  ],

  seeAlso: [
    [`observer`, `the broadcast channel a mediator often uses; Mediator centralizes routing, Observer just notifies`],
    [`facade`, `also fronts a subsystem — but one-way, and it doesn't coordinate peers`],
    [`command`, `colleagues' messages are often reified as Commands the hub dispatches`],
    [`indirection`, `the GRASP principle Mediator embodies — an intermediary that decouples peers`],
  ],

  interview: [
    [`Mediator vs Observer?`, `Mediator centralizes who-talks-to-whom in one coordinator; Observer is decentralized one-to-many broadcast. They are often combined.`],
    [`Mediator vs Facade?`, `Facade is a one-way simplified entry to a subsystem. Mediator manages multi-directional interaction between peers.`],
    [`The main downside?`, `The mediator can become a god object — all interaction logic centralizes there and grows hard to maintain.`],
    [`How does it reduce coupling?`, `It turns N-to-N references between colleagues into N-to-1: each knows only the mediator, not its peers.`],
  ],

  sources: [
    `GoF — "Design Patterns" (1994): Mediator (behavioral)`,
    `Freeman & Robson — "Head First Design Patterns" (2nd ed., 2020): Mediator (leftover patterns)`,
  ],
};
