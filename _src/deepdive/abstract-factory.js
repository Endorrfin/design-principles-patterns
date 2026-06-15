// Deep-dive content for Abstract Factory (GoF, creational) — GOLD standard depth.
// Fields: remember, framing, why, roles, apply, litmus, smell, bad, good,
// refactorLabel, fixNote, pitfalls, examples, seeAlso, interview, sources.
// Base comes from the map node. satori gotchas: code flush-left (indent stripped);
// no "<"/">" (lone ">"/"=>" ok); generics via ⟨⟩; never the literal word "constructor".

module.exports = {
  remember: `One factory interface that creates a whole family of related products — swap the family by swapping the factory.`,

  framing: `Abstract Factory raises Factory Method from one product to a set. The factory interface declares a create-method per product (button, checkbox, menu), and each concrete factory returns one mutually-consistent family — all Mac, or all Windows. Clients receive products through the abstract interface and never see, or mix, concrete classes from two families.`,

  why: `When a product set must stay internally consistent — a whole UI theme, a database's connection + command + reader — letting clients new pieces individually risks mixing a Mac button with a Windows checkbox. A single factory that vends the entire family guarantees compatibility and confines every concrete class to one place, so switching themes is one wiring change. The cost: the line-up is fixed — adding a new product kind touches the interface and every factory.`,

  roles: [
    [`AbstractFactory`, `Declares one creation method per product in the family, all returning interfaces.`],
    [`ConcreteFactory`, `Implements them to build one consistent family (MacButton + MacCheckbox).`],
    [`Products`, `The related interfaces (Button, Checkbox) clients use; the concretes stay hidden.`],
  ],

  apply: [
    `Identify products that must vary together as a set (a theme, a platform, a driver).`,
    `Declare an AbstractFactory with one create-method per product, returning interfaces.`,
    `Implement one ConcreteFactory per family, building only that family's concretes.`,
    `Inject the chosen factory at the edge; clients build everything through it.`,
  ],

  litmus: `Do several objects have to come from the same family to be compatible? If swapping one detail forces swapping a matching set, hide the set behind one factory.`,

  smell: `The client news platform widgets directly, so families can get mixed:`,
  refactorLabel: `↓ VEND THE WHOLE FAMILY FROM ONE FACTORY`,
  bad: [
    [`function buildUI(os) {`, 'kw'],
    [`  const btn = os === 'mac'`, ''],
    [`    ? new MacButton() : new WinButton()`, ''],
    [`  const cb = new WinCheckbox()   // oops: mixed family`, 'c'],
    [`}`, 'kw'],
  ],
  good: [
    [`interface UIFactory {`, 'kw'],
    [`  button(): Button; checkbox(): Checkbox`, ''],
    [`}`, 'kw'],
    [`class MacFactory implements UIFactory {`, 'kw'],
    [`  button(){ return new MacButton() }`, ''],
    [`  checkbox(){ return new MacCheckbox() }`, ''],
    [`}`, 'kw'],
  ],
  fixNote: `buildUI now takes a UIFactory and calls button() / checkbox() — one ConcreteFactory keeps the family consistent. Switching to Windows is one injected object, not scattered news.`,

  pitfalls: [
    `Open for new families, closed against new product kinds: adding a third product changes the interface and every factory.`,
    `Over-applying when products don't actually co-vary — you get factory ceremony around unrelated objects.`,
    `Letting a concrete product leak to the client (an instanceof MacButton) — it re-couples what the factory hid.`,
  ],

  examples: [
    `Cross-platform UI toolkits: a Mac vs Windows vs Linux widget family behind one factory.`,
    `A data-access factory producing a matching Connection + Command + DataReader per database.`,
    `Look-and-feel / theming systems that swap an entire component set at once.`,
  ],

  seeAlso: [
    [`factory-method`, `the per-product building block Abstract Factory is usually composed from`],
    [`builder`, `both isolate construction — Builder assembles one complex object step by step`],
    [`prototype`, `a factory can build its family by cloning prototype instances instead of newing`],
    [`singleton`, `a concrete factory is typically kept as a single shared instance`],
  ],

  interview: [
    [`Abstract Factory vs Factory Method?`, `Factory Method makes one product via subclassing; Abstract Factory makes a family of related products via composition — and is often implemented with several factory methods.`],
    [`When does Abstract Factory hurt?`, `When the line-up changes: adding a new product kind edits the interface and every concrete factory. It is open for families, closed against new products.`],
    [`How do you keep families consistent?`, `Each ConcreteFactory builds only its own family and clients receive interfaces, so a Mac button and a Windows checkbox can never be combined.`],
    [`Abstract Factory vs Builder?`, `Abstract Factory returns ready families immediately (what); Builder constructs one complex object step by step (how).`],
  ],

  sources: [
    `GoF — "Design Patterns" (1994): Abstract Factory (creational)`,
    `GoF (1994), Related Patterns: Abstract Factory is often built with Factory Method or Prototype; a concrete factory is commonly a Singleton`,
  ],
};
