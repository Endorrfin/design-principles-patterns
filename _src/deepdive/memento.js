// Deep-dive content for Memento (GoF, behavioral) — GOLD depth.
// Fields: remember, framing, why, roles, apply, litmus, smell, bad, good,
// refactorLabel, fixNote, pitfalls, examples, seeAlso, interview, sources.
// Base comes from the map node. satori gotchas: code flush-left (indent stripped);
// no "<"/">" (lone ">"/"=>" ok); generics via ⟨⟩; never the literal word "constructor".

module.exports = {
  remember: `Snapshot an object's private state into an opaque token, restore from it later — encapsulation intact.`,

  framing: `Memento externalizes a snapshot of an object's internal state so it can be rewound later, without exposing those internals. The Originator creates and restores mementos; the Caretaker just holds them as opaque tokens it can't read. The trick is two interfaces — wide for the originator, narrow for everyone else.`,

  why: `Undo and rollback need a past state, but exposing the object's fields to save them breaks encapsulation and couples the history-keeper to the internals. A memento lets the originator pack its own state into a token only it can unpack, so the caretaker stacks snapshots without ever seeing inside. The cost is memory — full snapshots of large state add up.`,

  roles: [
    [`Originator`, `Creates a memento of its state and restores itself from one.`],
    [`Memento`, `The snapshot — wide interface for the originator, narrow (opaque) for the caretaker.`],
    [`Caretaker`, `Keeps mementos (the history); never reads or mutates their contents.`],
  ],

  apply: [
    `Give the originator save() returning a memento and restore(m) to roll back.`,
    `Pack the state deeply enough that later edits can't reach into the snapshot.`,
    `Let a caretaker stack mementos for undo; it treats them as opaque tokens.`,
    `Bound the history (cap, diff, or copy-on-write) so memory doesn't grow forever.`,
  ],

  litmus: `Do you need to restore a past state without exposing the object's internals? If a snapshot must be saved but its contents stay private, that's a Memento.`,

  smell: `To undo, the caretaker reaches into the editor's private fields:`,
  refactorLabel: `↓ LET THE OBJECT SNAPSHOT ITSELF`,
  bad: [
    [`// history reads the editor's internals`, 'c'],
    [`snap = { text: editor.text, sel: editor.sel }`, ''],
    [`// editor.text/sel must be public → leaks state`, 'c'],
    [`editor.text = snap.text   // anyone can corrupt it`, 'c'],
  ],
  good: [
    [`class Editor {`, 'kw'],
    [`  #text = ''`, ''],
    [`  type(s: string) { this.#text += s }`, ''],
    [`  save() { return { text: this.#text } }   // opaque token`, 'c'],
    [`  restore(m) { this.#text = m.text }`, ''],
    [`}`, 'kw'],
    [`const history = []`, ''],
    [`history.push(editor.save())   // caretaker just stacks it`, 'c'],
  ],
  fixNote: `The editor packs and unpacks its own state; the history just stacks the tokens it gets back, never reading inside. Deep-copy mutable state so a later edit can't reach into a saved snapshot, and cap the history to bound memory.`,

  pitfalls: [
    `Memory pressure: full snapshots of large state cost real memory — prefer diffs or copy-on-write as histories grow.`,
    `A shallow snapshot still shares mutable references, so later edits silently corrupt the past — copy deeply.`,
    `An unbounded undo stack leaks memory; cap it or age old mementos out (and the caretaker must never mutate one).`,
  ],

  examples: [
    `Editor Ctrl+Z undo/redo; Redux DevTools time-travel stepping through state snapshots.`,
    `SQL SAVEPOINT (partial rollback) and Git commits (each a restorable tree snapshot).`,
    `VM snapshots and game save slots.`,
  ],

  seeAlso: [
    [`command`, `pairs with Memento for undo stacks — Command records the action, Memento the resulting state`],
    [`prototype`, `clones a copy of state where a deep copy is an acceptable snapshot`],
    [`state`, `both deal in object state — State swaps behavior, Memento freezes a restorable copy`],
    [`iterator`, `a robust cursor can snapshot its position as a memento`],
  ],

  interview: [
    [`How does it preserve encapsulation?`, `The memento exposes a wide interface only to the originator; the caretaker holds an opaque token it can't read or change.`],
    [`Memento vs Command for undo?`, `Memento snapshots the resulting state; Command records the operation. Command supports redo and is lighter; Memento is simpler for complex state.`],
    [`Deep or shallow copy?`, `Deep enough that later mutations can't reach into the saved state — otherwise restore brings back already-corrupted data.`],
    [`How do you bound memory?`, `Cap the history, store diffs instead of full snapshots, use copy-on-write, or persist older mementos out of memory.`],
  ],

  sources: [
    `GoF — "Design Patterns" (1994): Memento (behavioral)`,
    `Freeman & Robson — "Head First Design Patterns" (2nd ed., 2020): Memento (leftover patterns)`,
  ],
};
