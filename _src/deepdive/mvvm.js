// Deep-dive content for MVVM — GOLD standard (one file per concept).
// satori gotchas: code flush-left (indent stripped); no "<"/">" (lone ">"/"=>" ok);
// generics via ⟨⟩; never the literal word "constructor".

module.exports = {
  remember: `The view-model never names the view. Bindings carry state out and events back.`,

  framing: `MVVM replaces hand-written view updates with a binding layer. The ViewModel exposes observable state and commands and holds no reference to the view; the framework keeps the two in sync automatically. In Angular your component is the ViewModel and signals are its bindable state — you write state and intent, the framework renders.`,

  why: `When the framework already syncs state to the DOM — Angular signals, Vue refs, WPF bindings — a presenter that manually pushes each update is wasted, error-prone code. MVVM leans entirely on binding: you declare bindable state and commands, and the engine handles the traffic between View and ViewModel in both directions.`,

  roles: [
    [`Model`, `Domain and data — unchanged from MVC and MVP.`],
    [`View`, `A declarative template bound to the view-model. No imperative DOM writes; bindings read state and route events to commands.`],
    [`ViewModel`, `Exposes bindable state (signals/observables) and commands. Holds zero reference to the view — that's what keeps it unit-testable as a plain object.`],
  ],

  apply: [
    `Model UI state as signals/observables on the component (the ViewModel).`,
    `Bind the template to that state; never write to the DOM by hand.`,
    `Expose user intent as commands (methods) the template calls.`,
    `Keep the view-model free of view/DOM references so you can test it directly.`,
  ],

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
  refactorLabel: `↓ BIND INSTEAD OF PUSH`,
  fixNote: `The component is now a pure ViewModel: state is a signal, the command updates it, the template binds to count(). It never touches the DOM, so you can unit-test it as a plain object. Two-way (ngModel / model()) closes the loop from view back to view-model.`,

  pitfalls: [
    `Logic leaking into templates — heavy expressions or side effects in bindings.`,
    `Binding "magic" hiding change-detection bugs that are hard to trace.`,
    `A view-model that grabs ElementRef or the DOM — it has quietly become a presenter.`,
  ],

  examples: [
    `Angular (signals + templates), Vue (refs + v-model), WPF/Silverlight (the origin).`,
    `Reactive forms where state, validation and view stay bound together.`,
    `Knockout.js — early browser MVVM that popularised the term on the web.`,
  ],

  seeAlso: [
    [`mvc`, `MVVM is the binding-era descendant of MVC/MVP for reactive UIs`],
    [`observer`, `binding is Observer under the hood — the view subscribes to view-model state`],
    [`mvp`, `MVVM drops the presenter-to-view calls; the binding layer does the syncing`],
    [`soc`, `state and commands vs rendering — concerns split along the binding boundary`],
  ],

  interview: [
    [`Why does MVVM fit Angular and Vue so well?`, `Their reactive primitives (signals/refs plus templates) provide the ViewModel-to-View sync the pattern needs; two-way directives (ngModel, v-model) close the loop back without glue code.`],
    [`What must a ViewModel never do?`, `Reference the view or the DOM. It exposes bindable state and commands only; the binding layer connects them. A view reference turns it into a presenter.`],
    [`MVVM vs MVP — when would you pick each?`, `Pick MVVM when the framework gives you data binding (Angular, Vue, WPF) — it removes the presenter's manual sync code. Pick MVP when there's no binding layer and you need testability by hand (classic Android, WinForms).`],
    [`Where does MVVM go wrong in practice?`, `Logic leaks into templates (heavy expressions, side effects) and binding "magic" makes change-detection bugs hard to trace. Keep templates declarative and logic in the view-model.`],
  ],

  sources: [
    `John Gossman — MVVM, introduced for WPF/Silverlight (2005)`,
    `Martin Fowler — "Presentation Model" (the pattern MVVM specialises)`,
    `Angular signals & Vue reactivity — MVVM in modern front-ends`,
  ],
};
