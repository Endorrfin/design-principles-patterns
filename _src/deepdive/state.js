// Deep-dive content for State (GoF, behavioral) — GOLD depth.
// Fields: remember, framing, why, roles, apply, litmus, smell, bad, good,
// refactorLabel, fixNote, pitfalls, examples, seeAlso, interview, sources.
// Base comes from the map node. satori gotchas: code flush-left (indent stripped);
// no "<"/">" (lone ">"/"=>" ok); generics via ⟨⟩; never the literal word "constructor".

module.exports = {
  remember: `One object, many modes — each state is a class that owns its behavior and picks the next state.`,

  framing: `State gives an object one class per mode: the Context holds a current State and delegates every request to it, so the same call behaves differently as the state changes — the object appears to change class. Crucially, the states drive their own transitions, swapping the Context to the next mode.`,

  why: `A single object whose behavior depends on a status field grows sprawling switch ladders repeated across methods, easy to get inconsistent. State localizes each mode's behavior in its own named, testable class and makes transitions explicit object swaps rather than flag flips. The cost is more classes — overkill for two or three trivial modes.`,

  roles: [
    [`Context`, `Holds the current ConcreteState and delegates each request to it.`],
    [`State`, `The interface declaring the behavior shared by every state.`],
    [`ConcreteState`, `Implements one mode's behavior; may trigger the next transition.`],
  ],

  apply: [
    `Identify the modes and the events that move between them.`,
    `Define a State interface for the behavior that varies by mode.`,
    `Put each mode's logic in its own ConcreteState; delegate from the Context.`,
    `Decide who owns transitions — the state (local) or the Context (central).`,
  ],

  litmus: `Are big conditionals on a status field sprawling across methods, with behavior that depends on mode? If modes keep growing, give each its own state class.`,

  smell: `One method branches on a status string in every operation:`,
  refactorLabel: `↓ ONE CLASS PER STATE`,
  bad: [
    [`class Order {`, 'kw'],
    [`  ship() {`, ''],
    [`    if (this.status === 'paid') doShip()`, ''],
    [`    else if (this.status === 'new') throw 'unpaid'`, ''],
    [`  }   // every method repeats this ladder`, 'c'],
    [`}`, 'kw'],
  ],
  good: [
    [`interface State { ship(o: Order): void }`, 'kw'],
    [`class Paid implements State {`, 'kw'],
    [`  ship(o: Order) { doShip(); o.setState(new Shipped()) }`, 'c'],
    [`}`, 'kw'],
    [`class Order {`, 'kw'],
    [`  state: State = new New()`, ''],
    [`  ship() { this.state.ship(this) }   // delegates`, 'c'],
    [`}`, 'kw'],
  ],
  fixNote: `Each mode's behavior lives in its own class, and Paid.ship() performs the transition to Shipped. Order just delegates to its current state — the switch ladders vanish. For a stateless mode, share one instance as a flyweight.`,

  pitfalls: [
    `Who owns transitions: state-owned couples states to each other; context-owned centralizes the map but fattens the Context — choose deliberately.`,
    `State explosion: modes times sub-modes multiply classes fast — a transition table or statechart tames it.`,
    `Logic is distributed across classes, which can hurt the at-a-glance view of the whole machine; two or three trivial modes don't justify it.`,
  ],

  examples: [
    `Order / payment lifecycles, document workflows, a media player's play / pause / stop.`,
    `TCP connection states (LISTEN → ESTABLISHED → CLOSED) and CI pipeline stages.`,
    `Statechart libraries (XState) and React useReducer computing next state from current + action.`,
  ],

  seeAlso: [
    [`strategy`, `identical UML — but a Strategy is client-set and stays put, State swaps itself`],
    [`command`, `a transition can be reified as a Command, enabling undo of state changes`],
    [`memento`, `snapshot the Context's state to roll a state machine back`],
    [`flyweight`, `share stateless state objects as one immutable instance per mode`],
  ],

  interview: [
    [`State vs Strategy?`, `Same structure; State objects swap themselves as conditions change, a Strategy is chosen once by the client and doesn't self-transition.`],
    [`Who triggers transitions?`, `Either the ConcreteState (state-owned) or the Context (context-owned) — a deliberate trade between coupling and centralization.`],
    [`Why not just a switch?`, `For a few modes a switch is fine; State pays off when conditionals sprawl across methods and modes keep growing.`],
    [`Can states be shared?`, `Yes — if a state keeps no per-context data, reuse one immutable instance as a flyweight singleton.`],
  ],

  sources: [
    `GoF — "Design Patterns" (1994): State (behavioral)`,
    `Freeman & Robson — "Head First Design Patterns" (2nd ed., 2020): State`,
  ],
};
