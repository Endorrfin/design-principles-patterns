// Deep-dive content for LSP. ONE FILE PER CONCEPT (file name = node id) so that
// parallel sessions never touch the same file. Fields documented in CLAUDE.md.
// Base content (name/intent/structure/use/avoid/pros/cons) comes from the map
// node; this adds depth. Code lines are [text, kind]; kind: 'kw' | 'c' | ''.
// Code must NOT contain "<" or ">" (satori-html would read them as tags).

module.exports = {
  remember: `If S is a subtype of T, code written for T must keep working when handed an S.`,
  framing: `Substitutability is about behavior, not just shape. A subtype may accept more and promise more, but must never demand more from callers or deliver less than the base contract.`,
  why: `When a subtype breaks the base contract, polymorphic callers fail in ways the type checker can't see — forcing defensive instanceof checks and killing the value of inheritance.`,
  litmus: `Substitute the subtype everywhere the base type is used. If any caller now needs a special case or breaks, it isn't a true "is-a".`,
  refactorLabel: `↓ MODEL THE DIFFERENCE, DON’T INHERIT IT`,
  smell: `Square passes the Rectangle type check but breaks its behavioral contract:`,
  bad: [
    ['class Rectangle { setW(w){ this.w=w } setH(h){ this.h=h } }', 'kw'],
    ['class Square extends Rectangle {', ''],
    ['  setW(w){ this.w=w; this.h=w }   // setter also mutates height', 'c'],
    ['}', ''],
    ['// r.setW(5); r.setH(4): caller expects area 20, gets 16', 'c'],
  ],
  good: [
    ['interface Shape { area(): number }', 'kw'],
    ['class Rectangle implements Shape { area(){ return this.w*this.h } }', ''],
    ['class Square implements Shape { area(){ return this.s*this.s } }', ''],
    ["// no inheritance claim; neither weakens the other's contract", 'c'],
  ],
  fixNote: `Square is not a behavioral Rectangle, so don't make it one. Give both a shared Shape contract and model their differences explicitly.`,
  seeAlso: [
    ['ocp', 'substitutable subtypes are what make safe extension possible'],
    ['coi', 'when is-a fails the contract, prefer has-a composition'],
    ['isp', 'narrow contracts are easier to honor fully'],
    ['dip', 'callers depend on the abstraction LSP keeps trustworthy'],
  ],
  interview: [
    ['State LSP precisely.', 'A subtype must not strengthen preconditions or weaken postconditions, and must preserve the base type’s invariants and history constraint.'],
    ['Why is Square/Rectangle the classic case?', 'Both are valid data shapes, but Square’s coupled setter weakens a postcondition callers rely on — a behavioral violation the compiler cannot catch.'],
    ['How do variance rules relate?', 'To stay substitutable, method parameters should be contravariant (accept at least as much) and return types covariant (return no less specific).'],
  ],
  sources: [
    'Barbara Liskov, Jeannette Wing — "A Behavioral Notion of Subtyping" (ACM TOPLAS, 1994)',
    'Barbara Liskov — "Data Abstraction and Hierarchy" (OOPSLA keynote, 1987)',
  ],
};
