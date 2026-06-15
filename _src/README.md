# _src — interactive map kit

Self-contained generator for `dpmap_hybrid.html` and `dpmap_tree.html`
(emitted into the material folder root). Generating needs no dependencies.

## Files
- `dpmap_data.js`   single source of truth — 3 groups, 9 sub-groups, 40 concepts.
- `dpmap_ui.js`     shared dark-theme styles + the detail panel.
- `dpmap_hybrid.js` layout A: search + filter + collapsible cards + sticky detail.
- `dpmap_tree.js`   layout B: collapsible mind-map (pan / zoom).
- `dpmap_build.js`  inlines data + scripts into the two standalone HTML files.
- `_check.js`       jsdom regression check (needs `npm i jsdom`).

## Commands
```bash
node dpmap_build.js     # rebuild both HTML into the material folder
node _check.js          # validate (npm i jsdom, or set NODE_PATH, first)
```

## Hierarchy
```
Principles           SOLID · Simplicity & clarity · Coupling & OO design
GoF Design Patterns  Creational · Structural · Behavioral
Architectural        Presentation · Data & persistence · Composition
```

## Deep-dive links
GoF → `./GoF Design Patterns/<Creational|Structural|Behavioral>/gof_*.pdf`
(local, self-contained). Principle and architectural deep-dives are pending
per-concept: their `pdf` is `null` and the button shows "coming soon". To add
one, place the file in the matching sub-group folder and set the node's `pdf`
in `dpmap_data.js`, then rebuild.

## Notes
- Edit content ONLY in `dpmap_data.js`; never hand-edit the generated HTML.
- Pure-Node build (fs only). jsdom is required just for `_check.js`.
- All links stay inside this folder (no `../` escapes) — the folder is portable.
