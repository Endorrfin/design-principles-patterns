// Deep-dive content for Command (GoF, behavioral) — GOLD depth.
// Fields: remember, framing, why, roles, apply, litmus, smell, bad, good,
// refactorLabel, fixNote, pitfalls, examples, seeAlso, interview, sources.
// Base comes from the map node. satori gotchas: code flush-left (indent stripped);
// no "<"/">" (lone ">"/"=>" ok); generics via ⟨⟩; never the literal word "constructor".

module.exports = {
  remember: `Turn a request into an object with execute() / undo() — now you can pass, queue, log, and reverse it.`,

  framing: `Command reifies a request: the verb "do X" becomes a first-class object carrying execute(), and often undo(). An Invoker triggers it without knowing the Receiver that does the real work, so the action can be stored, queued, logged, and replayed like any other value.`,

  why: `When a button calls a service method directly, the trigger is welded to the work and the action cannot outlive the call — no undo, no queue, no audit log. Reifying the request decouples invoker from receiver and makes the action storable: a history stack gives undo, a queue gives async jobs, a log gives replay. The cost is a small class (or closure) per action.`,

  roles: [
    [`Command`, `Declares execute() and often undo(); binds its receiver and arguments.`],
    [`Invoker`, `Holds and triggers commands — knows nothing of the receiver.`],
    [`Receiver`, `Knows how to do the real work the command calls.`],
  ],

  apply: [
    `Wrap the action in an object with execute() (add undo() if you need reversal).`,
    `Bind the receiver and arguments when you build the command, not when you run it.`,
    `Have the Invoker trigger commands and push executed ones onto a history.`,
    `For undo, store enough state (or a Memento) to reverse; pop and call undo().`,
  ],

  litmus: `Does the action need to outlive the call — to be undone, queued, logged, or composed? If you just need to call a function now, a plain callback is enough.`,

  smell: `The editor calls document work directly, so there is no way to undo it:`,
  refactorLabel: `↓ REIFY THE ACTION AS A COMMAND`,
  bad: [
    [`button.onClick = () => {`, 'kw'],
    [`  doc.append(text)   // happens now, irreversibly`, 'c'],
    [`}`, 'kw'],
    [`// no history, no undo, no queue`, 'c'],
  ],
  good: [
    [`interface Command { execute(): void; undo(): void }`, 'kw'],
    [`const addText = (doc, s): Command => ({`, 'kw'],
    [`  execute: () => doc.append(s),`, ''],
    [`  undo:    () => doc.trim(s.length),`, ''],
    [`})`, 'kw'],
    [`const history: Command[] = []`, ''],
    [`function run(c: Command) { c.execute(); history.push(c) }`, 'c'],
    [`function undo() { history.pop()?.undo() }`, 'c'],
  ],
  fixNote: `The action is now a value: run() executes and records it, undo() reverses the last one. The same command objects can be queued for a worker or logged for replay — the invoker never learns what they do.`,

  pitfalls: [
    `Undo needs reversal state: store enough (or a Memento) — recomputing the previous value is not always possible.`,
    `Queued or logged commands may run twice — design execute() to be idempotent or replay-safe.`,
    `Fat-invoker smell: if the invoker reaches into a command's internals, the decoupling is lost. Closures rarely serialize, so queued commands need plain data.`,
  ],

  examples: [
    `Undo/redo stacks in editors; Redux actions; CQRS write commands routed to one handler.`,
    `Job / task queues (BullMQ, Sidekiq) — a serialized job is a command run later by a worker.`,
    `GUI menu items and buttons firing command objects; database WAL / event sourcing for replay.`,
  ],

  seeAlso: [
    [`memento`, `captures the state a command needs to undo itself`],
    [`chain`, `transports commands; a request can be routed to the handler that runs one`],
    [`strategy`, `both wrap behavior in an object — Command reifies a request, Strategy swaps an algorithm`],
    [`prototype`, `clone a command to record an independent entry in a history or log`],
  ],

  interview: [
    [`Command vs Strategy?`, `Both wrap behavior in an object; Command reifies a request you can queue or undo, Strategy swaps an interchangeable algorithm.`],
    [`How does undo work?`, `Each command stores what it needs to reverse (or a Memento); a history stack pops and calls undo().`],
    [`Is a job queue Command?`, `Yes — a serialized job is a ConcreteCommand executed later by a worker (the invoker).`],
    [`Command vs CQRS command?`, `Same spirit: a command object captures write intent; CQRS routes it to a single handler.`],
  ],

  sources: [
    `GoF — "Design Patterns" (1994): Command (behavioral)`,
    `Freeman & Robson — "Head First Design Patterns" (2nd ed., 2020): Command`,
  ],
};
