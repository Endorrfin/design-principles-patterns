// Deep-dive content for MVC. ONE FILE PER CONCEPT (file name = node id) so that
// parallel sessions never touch the same file. Fields documented in CLAUDE.md.
// Base content (name/intent/structure/use/avoid/pros/cons) comes from the map
// node; this adds depth. Code lines are [text, kind]; kind: 'kw' | 'c' | ''.
// Code must NOT contain "<" or ">" (satori-html would read them as tags).

module.exports = {
  refactorLabel: `↓ SPLIT THE THREE ROLES`,
  remember: `Input goes to the Controller, state lives in the Model, the View only renders.`,
  framing: `Three roles, one cycle: the Controller turns input into Model changes, the Model holds state and rules, the View renders that state. Keep the arrows one-directional and the loop stays clean.`,
  why: `When input handling, state, and rendering live in one place, every UI tweak risks the business rules — and every rule change risks the screen. MVC names a seam between them so changes and teams stop colliding.`,
  litmus: `Point at a line: is it deciding what the data is (Model), how it looks (View), or what to do with input (Controller)? If one method does two of those, split it.`,
  smell: `A route handler that validates, persists, and renders — all three roles fused:`,
  bad: [
    [`app.post('/orders', (req, res) => {`, ''],
    [`const total = req.body.qty * req.body.price  // rules`, ''],
    [`db.orders.insert({ total })                  // persistence`, ''],
    [`res.send(renderPage(total))                  // view`, ''],
    [`})`, ''],
    [`// one handler owns rules + persistence + rendering`, 'c'],
  ],
  good: [
    [`@Controller('orders')`, 'kw'],
    [`class OrdersController {`, 'kw'],
    [`post(@Body() dto: NewOrder) {`, ''],
    [`return this.orders.place(dto)   // Service = Model rules`, ''],
    [`}`, ''],
    [`}  // controller: input only; the view renders the result`, 'c'],
  ],
  fixNote: `The controller now only translates HTTP into a domain call and hands state back. Rules live in the service (Model); rendering is the View's job. When a controller starts growing logic, push it down — fat controllers are the classic MVC smell.`,
  seeAlso: [
    ['controller', `GRASP names the same role — the first object that handles a system event`],
    ['soc', `MVC is Separation of Concerns applied to the UI layer`],
    ['mvp', `tighten the loop: the presenter drives a fully passive view`],
    ['mvvm', `replace manual view updates with data binding to a view-model`],
  ],
  interview: [
    ['Where do business rules belong in MVC?', `In the Model, never the Controller. The controller only routes input to the model and selects a view; logic creeping into controllers is the textbook MVC anti-pattern.`],
    ['Can the View read the Model directly?', `In classic (Smalltalk) MVC, yes — the view observes the model and re-renders. Server-side web MVC usually hands a view-model from the controller to the template instead.`],
    ['MVC vs MVP vs MVVM?', `Same goal, different view binding: MVC's controller mediates input, MVP's presenter drives a passive view 1:1, MVVM binds the view to a view-model (often two-way).`],
  ],
  sources: [
    `Trygve Reenskaug — original MVC notes, Xerox PARC (1978-79)`,
    `Martin Fowler — "GUI Architectures" (2006): MVC and its descendants`,
    `Rails, Spring MVC, NestJS — server-side MVC in practice`,
  ],
};
