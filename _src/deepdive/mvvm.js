// Deep-dive content for MVVM. ONE FILE PER CONCEPT (file name = node id) so that
// parallel sessions never touch the same file. Fields documented in CLAUDE.md.
// Code lines are [text, kind]; kind: 'kw' | 'c' | ''. No "<"/">" in code.

module.exports = {
  refactorLabel: `↓ BIND INSTEAD OF PUSH`,
  remember: `The view-model never names the view. Bindings carry state out and events back.`,
  framing: `MVVM replaces hand-written view updates with a binding layer. The ViewModel exposes observable state and commands and holds no reference to the view; the framework keeps them in sync. In Angular, your component is the ViewModel and signals are its bindable state.`,
  why: `When the framework already syncs state to the DOM (signals, refs, WPF bindings), a presenter that manually pushes updates is wasted code. MVVM leans on binding: you write state and commands, the framework renders.`,
  litmus: `Does your view-model reference the view, the DOM, or ElementRef? If yes, it's a presenter, not a view-model. A view-model exposes only bindable state and commands.`,
  smell: `A component that reaches into the DOM to push updates by hand:`,
  bad: [
    [`class CounterComponent {`, 'kw'],
    [`count = 0`, ''],
    [`inc() {`, ''],
    [`this.count++`, ''],
    [`this.el.nativeElement.textContent = this.count  // manual sync`, ''],
    [`}`, ''],
    [`}  // view logic tied to the DOM`, 'c'],
  ],
  good: [
    [`@Component({ template: '{{ count() }}' })`, 'kw'],
    [`class CounterComponent {`, 'kw'],
    [`count = signal(0)                 // bindable state`, ''],
    [`inc = () => this.count.update(n => n + 1)  // command`, ''],
    [`}`, ''],
    [`// template binds to count(); no manual DOM writes`, 'c'],
  ],
  fixNote: `The component is now a pure ViewModel: state is a signal, the command updates it, the template binds to count(). It never touches the DOM, so you can unit-test it as a plain object. Two-way (ngModel / model()) closes the loop from view back to view-model.`,
  seeAlso: [
    ['mvc', `MVVM is the binding-era descendant of MVC/MVP for reactive UIs`],
    ['observer', `binding is Observer under the hood — the view subscribes to view-model state`],
    ['mvp', `MVVM drops the presenter-to-view calls; the binding layer does the syncing`],
    ['soc', `state and commands vs rendering — concerns split along the binding boundary`],
  ],
  interview: [
    ['Why does MVVM fit Angular and Vue so well?', `Their reactive primitives (signals/refs plus templates) provide the ViewModel-to-View sync the pattern needs; two-way directives (ngModel, v-model) close the loop back without glue code.`],
    ['What must a ViewModel never do?', `Reference the view or the DOM. It exposes bindable state and commands only; the binding layer connects them. A view reference turns it into a presenter.`],
    ['Where does MVVM go wrong in practice?', `Logic leaks into templates (heavy expressions, side effects) and binding "magic" makes change-detection bugs hard to trace. Keep templates declarative and logic in the view-model.`],
  ],
  sources: [
    `John Gossman — MVVM, introduced for WPF/Silverlight (2005)`,
    `Martin Fowler — "Presentation Model" (the pattern MVVM specializes)`,
    `Angular signals & Vue reactivity — MVVM in modern front-ends`,
  ],
};
