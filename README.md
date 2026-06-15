# Design Principles & Patterns — Interactive Map

An interactive, self-contained map of **49 software design concepts** — the **SOLID**
principles, the **23 Gang-of-Four** patterns, **GRASP**, and **architectural** patterns
(MVC/MVP/MVVM, Repository, Unit of Work, Dependency Injection) — built for fast,
senior-level immersion.

**Live demo:** https://endorrfin.github.io/design-principles-patterns/
*(adjust to your username/repo name)*

## Three views (tabs)

- **Study** — a learning path you read like a book: a collapsible *group → sub-group →
  concept* outline, search, expand/collapse-all, and a flashcard self-test.
- **Cards** — searchable, filterable, collapsible card dashboard.
- **Mind-map** — pan/zoom tree (*group → sub-group → pattern*).

Click any concept for a structured panel — intent · structure · use/avoid · pros/cons ·
code sketch · interview Q · see-also — plus an **“Open deep-dive”** button.

## Deep-dive PDFs

Each concept has a multi-page deep-dive (1080×1350): essence · how it works ·
smell → fix · trade-offs & pitfalls · interview & sources. Stored by sub-group under
`Principles/`, `GoF_Design_Patterns/`, `Architectural/`.

## Run / rebuild

It’s a **static site** — just open `index.html` (no server needed). To regenerate from
source:

```bash
cd _src
node dpmap_build.js   # rebuild the three maps + index.html
node _check.js        # validate (needs jsdom)
```

All content lives in `_src/dpmap_data.js` (single source of truth). The full build,
deep-dive and contribution workflow is documented in `CLAUDE.md`.

## Credits

**Vasyl Krupka · Ukraine 🇺🇦**
Sources: Gang of Four (1994) · Robert C. Martin, *SOLID* · Craig Larman, *GRASP*.
