// Deep-dive content for Interpreter (GoF, behavioral) — GOLD depth.
// Fields: remember, framing, why, roles, apply, litmus, smell, bad, good,
// refactorLabel, fixNote, pitfalls, examples, seeAlso, interview, sources.
// Base comes from the map node. satori gotchas: code flush-left (indent stripped);
// no "<"/">" (lone ">"/"=>" ok); generics via ⟨⟩; never the literal word "constructor".

module.exports = {
  remember: `One class per grammar rule; a sentence becomes a tree you evaluate by walking it.`,

  framing: `Interpreter models a small language as a class hierarchy — one Expression class per grammar rule — so a sentence parses into a tree of these objects (an AST that is itself a Composite). Each node knows how to interpret(context), recursing into its children, so evaluating the root walks the whole tree.`,

  why: `For a small, stable grammar that recurs — a filter expression, a business rule, a search query — hand-coding ad-hoc parsing scatters the logic and resists change. Mapping each rule to a class makes the grammar explicit and easy to extend: a new rule is a new class. The catch is scale — complex grammars explode into too many classes, and tree-walking is slow.`,

  roles: [
    [`AbstractExpression`, `Declares interpret(context) for every node in the grammar.`],
    [`TerminalExpression`, `A leaf — a literal or variable, the atoms of the grammar.`],
    [`NonterminalExpression`, `A composite rule (And, Or, Plus) holding sub-expressions.`],
  ],

  apply: [
    `Confirm the grammar is small and stable enough to hand-model.`,
    `Give every rule an Expression class with one interpret(ctx) method.`,
    `Make terminals leaves and nonterminals hold child expressions (a Composite).`,
    `Parse text into the tree separately; then interpret the root to evaluate.`,
  ],

  litmus: `Is this a small, stable grammar you evaluate often — and would one class per rule stay manageable? If the grammar is large or speed matters, reach for a parser generator instead.`,

  smell: `A growing if/else hand-evaluates every rule kind in one tangled function:`,
  refactorLabel: `↓ ONE CLASS PER GRAMMAR RULE`,
  bad: [
    [`// one function hand-evaluates every rule kind`, 'c'],
    [`if (e.op === 'var') return ctx[e.name]`, ''],
    [`if (e.op === 'and') return ev(e.l) && ev(e.r)`, ''],
    [`// a new rule edits this function again`, 'c'],
  ],
  good: [
    [`interface Expr { interpret(c): boolean }`, 'kw'],
    [`const Var = (n): Expr => ({ interpret: c => c[n] })`, ''],
    [`const And = (l: Expr, r: Expr): Expr => ({`, 'kw'],
    [`  interpret: c => l.interpret(c) && r.interpret(c)`, ''],
    [`})`, 'kw'],
    [`// "adult AND admin" → And(Var('adult'), Var('admin'))`, 'c'],
    [`tree.interpret(ctx)   // walks the AST`, 'c'],
  ],
  fixNote: `Each rule is now a small, local interpret() — a new rule is a new class, not another branch. The AST is a Composite; add operations (print, type-check) with a Visitor instead of bloating the nodes.`,

  pitfalls: [
    `Class-per-rule explodes: past a small, stable grammar it becomes unmanageable — use a parser generator (ANTLR, PEG).`,
    `Parsing is a separate job: Interpreter defines and evaluates the AST; building it from text is the parser's responsibility.`,
    `Tree-walking is slow — compile or cache hot expressions if performance matters.`,
  ],

  examples: [
    `Regular-expression matchers — a pattern compiled to an evaluable tree (the classic interpreter).`,
    `Rules / specification engines: business rules as composable boolean expressions.`,
    `SQL WHERE clauses and template / DSL engines (Liquid, SpEL) evaluating expression nodes.`,
  ],

  seeAlso: [
    [`composite`, `the AST is a Composite — terminals are leaves, rules are nodes with children`],
    [`visitor`, `adds new operations over the tree without changing the node classes`],
    [`iterator`, `traverses the expression tree node by node`],
    [`strategy`, `a lighter alternative for pluggable rules when a full grammar is overkill`],
  ],

  interview: [
    [`When is Interpreter appropriate?`, `Small, stable, well-understood grammars where a class-per-rule tree stays maintainable and speed isn't critical.`],
    [`Interpreter vs a parser generator?`, `Interpreter hand-models and evaluates a tiny grammar; ANTLR / PEG generate efficient parsers for real languages.`],
    [`How does it relate to Composite and Visitor?`, `The AST is a Composite; Visitor adds new operations over the nodes without changing them.`],
    [`A real-world example?`, `Regular-expression matchers and rules / specification engines are interpreters of a small grammar.`],
  ],

  sources: [
    `GoF — "Design Patterns" (1994): Interpreter (behavioral)`,
    `Martin Fowler — "Domain-Specific Languages" (2010): semantic model & tree-walking interpreters`,
  ],
};
