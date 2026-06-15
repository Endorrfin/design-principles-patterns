// Deep-dive content for MVP. ONE FILE PER CONCEPT (file name = node id) so that
// parallel sessions never touch the same file. Fields documented in CLAUDE.md.
// Code lines are [text, kind]; kind: 'kw' | 'c' | ''. No "<"/">" in code.
// "constructor" is dropped by satori-html unless split into two spans (CT below).

const CT = `<span style="display:flex;">construct</span><span style="display:flex;">or</span>`;

module.exports = {
  refactorLabel: `↓ MOVE LOGIC TO THE PRESENTER`,
  remember: `The view is dumb on purpose — it exposes hooks, the presenter pulls the strings.`,
  framing: `MVP cuts the view down to an interface of "show this / read that". Every decision moves into a presenter that talks to the view only through that interface — so the logic becomes plain objects you can test without a screen.`,
  why: `UI is the hardest thing to unit-test. Making the view a passive interface and moving each decision into the presenter turns screen logic into ordinary objects you can drive with a fake view.`,
  litmus: `Could you exercise this screen in a unit test with a fake view and assert what the presenter called? If logic is welded to widgets, it isn't MVP yet.`,
  smell: `A component where the widget itself decides, validates, and calls the API:`,
  bad: [
    [`class LoginComponent {`, 'kw'],
    [`onSubmit() {`, ''],
    [`if (!this.emailEl.value) this.errorEl.show()  // view decides`, ''],
    [`else this.api.login(this.emailEl.value)       // view calls API`, ''],
    [`}`, ''],
    [`}  // logic welded to widgets: untestable without a DOM`, 'c'],
  ],
  good: [
    [`interface LoginView { showError(m: string): void }`, 'kw'],
    [`class LoginPresenter {`, 'kw'],
    [`${CT}(private view: LoginView) {}`, ''],
    [`submit(email: string) {`, ''],
    [`if (!email) return this.view.showError('required')`, ''],
    [`}`, ''],
    [`}  // plain logic; view is a passive interface`, 'c'],
  ],
  fixNote: `The presenter never touches a widget — only the LoginView interface. A unit test passes a fake view and asserts showError was called; in production the real component implements the interface. This is MVP's "Passive View" flavor.`,
  seeAlso: [
    ['mvc', `MVP tightens MVC: the view goes fully passive and the presenter replaces the controller 1:1`],
    ['mvvm', `swap the manual presenter-to-view calls for declarative data binding`],
    ['dip', `the presenter depends on a LoginView abstraction, not a concrete widget`],
    ['dependency-injection', `the view is handed to the presenter from outside — exactly how you inject a fake in tests`],
  ],
  interview: [
    ['How does MVP differ from MVC?', `In MVP the view is fully passive with a 1:1 link to its presenter, which holds all UI logic. In MVC the controller handles input and the view may observe the model directly.`],
    ['Why is MVP called testable?', `The presenter talks to the view only through an interface, so a unit test substitutes a fake view and asserts the calls — no rendering engine needed.`],
    [`What is MVP's main downside?`, `The presenter tends to absorb everything and grow large, and every view needs an interface — more boilerplate than binding-based MVVM.`],
  ],
  sources: [
    `Martin Fowler — "GUI Architectures": Passive View & Supervising Controller`,
    `Mike Potel — "MVP: Model-View-Presenter" (Taligent/IBM, 1996)`,
    `Classic Android, WinForms, GWT — MVP for testable UI`,
  ],
};
