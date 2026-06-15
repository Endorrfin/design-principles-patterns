// Deep-dive content for ISP. ONE FILE PER CONCEPT (file name = node id) so that
// parallel sessions never touch the same file. Fields documented in CLAUDE.md.
// Base content (name/intent/structure/use/avoid/pros/cons) comes from the map
// node; this adds depth. Code lines are [text, kind]; kind: 'kw' | 'c' | ''.
// Code must NOT contain "<" or ">" (satori-html would read them as tags).

module.exports = {
  remember: `No client should be forced to depend on methods it never calls.`,
  framing: `Interfaces belong to the client that uses them, not the class that implements them. Split a fat interface by who calls what — role interfaces, one per usage pattern.`,
  why: `A fat interface couples every client to every method. Change one method and unrelated clients recompile, re-stub in tests, and risk breakage — though they never used it.`,
  litmus: `Does any implementer leave methods empty or throwing "not supported"? Does any client use only a slice? Either way the interface wants splitting.`,
  refactorLabel: `↓ SPLIT INTO ROLE INTERFACES`,
  smell: `One device interface forces a simple printer to fake what it can't do:`,
  bad: [
    ['interface Machine { print(): void; scan(): void; fax(): void }', 'kw'],
    ['class SimplePrinter implements Machine {', ''],
    ['  print() { /* ok */ }', ''],
    ["  scan() { throw new Error('not supported') }   // forced", 'c'],
    ["  fax()  { throw new Error('not supported') }   // forced", 'c'],
    ['}', ''],
  ],
  good: [
    ['interface Printer { print(): void }', 'kw'],
    ['interface Scanner { scan(): void }', 'kw'],
    ['class SimplePrinter implements Printer { print() {} }', ''],
    ['class AllInOne implements Printer, Scanner { print(){} scan(){} }', ''],
  ],
  fixNote: `Each client now depends only on the role it needs. A multifunction device composes several role interfaces; a simple one implements just Printer.`,
  seeAlso: [
    ['srp', 'the same cohesion idea, applied to interfaces from the client side'],
    ['dip', 'small client-owned interfaces are the abstractions to depend on'],
    ['lsp', 'narrow contracts are easier to satisfy without surprises'],
    ['high-cohesion', 'GRASP’s framing of keeping a type’s members related'],
  ],
  interview: [
    ['ISP vs SRP — what’s the difference?', 'SRP is about a class having one reason to change; ISP is about clients not depending on more of an interface than they use. Same instinct, different target.'],
    ['Can you over-apply ISP?', 'Yes — shattering into one-method interfaces destroys cohesion and floods the codebase with types. Split by client role, not per method.'],
    ['Where does ISP show up in TypeScript daily?', 'Accepting the narrowest structural type a function needs (e.g. { id: string } instead of the full entity) is ISP in practice.'],
  ],
  sources: [
    'Robert C. Martin — "The Interface Segregation Principle" (C++ Report, 1996)',
    'Robert C. Martin — "Agile Software Development, Principles, Patterns, and Practices" (2003)',
  ],
};
