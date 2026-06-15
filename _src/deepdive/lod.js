// Deep-dive content for LoD. ONE FILE PER CONCEPT (file name = node id) so that
// parallel sessions never touch the same file. Fields documented in CLAUDE.md.
// Base content (name/intent/structure/use/avoid/pros/cons) comes from the map
// node; this adds depth. Code lines are [text, kind]; kind: 'kw' | 'c' | ''.
// Code must NOT contain "<" or ">" (satori-html would read them as tags).

module.exports = {
  remember: `Talk only to your immediate neighbors; don't reach through them to strangers.`,
  framing: `A method may call methods on itself, its own fields, its parameters, and objects it creates — but not on objects those calls return. "Tell, don't ask."`,
  why: `A chain like a.b().c().d() hard-wires you to the shape of a whole object graph. A structural change three hops away breaks you, though you never owned that structure.`,
  litmus: `Count the dots that walk across objects. Each extra hop is another class you are coupled to and another place to get a null halfway down.`,
  refactorLabel: `↓ TELL, DON’T ASK`,
  smell: `Reaching through three objects just to read a city:`,
  bad: [
    ['const city = order.getCustomer().getAddress().getCity()', ''],
    ['ship(city)', ''],
    ['// coupled to Customer AND Address internals; either change breaks this', 'c'],
  ],
  good: [
    ['order.shipToCity()        // ask the object you hold to do the work', 'kw'],
    ['// inside Order: shipToCity() { return this.customer.shipToCity() }', 'c'],
  ],
  fixNote: `Push the behavior to the object that owns the data. Order exposes intent (shipToCity) and hides the navigation behind one trusted hop.`,
  seeAlso: [
    ['information-expert', 'GRASP: assign the work to the object holding the information'],
    ['coi', 'delegating to a held collaborator is the composition view of LoD'],
    ['soc', 'keeping navigation inside the owner separates concerns'],
    ['srp', 'the object that has the data also owns the operation on it'],
  ],
  interview: [
    ['Does LoD ban all method chaining?', 'No. Fluent and builder APIs return the same object or type and are fine. LoD targets reaching through foreign object graphs you do not own.'],
    ['What is the cost of following it too literally?', 'Delegation boilerplate — wrapper methods that just forward calls. Apply it to cut real coupling, not as a dot-counting rule.'],
    ['How does LoD relate to encapsulation?', 'It enforces it: talking only to direct collaborators stops you depending on others’ internal structure, so they stay free to change.'],
  ],
  sources: [
    'Karl Lieberherr et al. — the Law of Demeter, Northeastern University (1987)',
    'Andrew Hunt, David Thomas — "The Pragmatic Programmer" (1999): decoupling and the Law of Demeter',
  ],
};
