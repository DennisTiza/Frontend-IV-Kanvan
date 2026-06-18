## 1. Core Fix

- [x] 1.1 Replace `afterNextRender()` with `setTimeout(fn, 0)` in `programarInicializarChart()` to avoid NG0203 error
- [x] 1.2 Remove `afterNextRender` import from `@angular/core`
- [x] 1.3 Add `error` handler to all 4 HTTP subscriptions in `cargarDatos()` that logs the error and sets `datosCargados` to prevent repeated failed requests

## 2. Error Feedback

- [x] 2.1 Add `errorAlCargar` signal of type `Record<TabId, string | null>` initialized with all nulls
- [x] 2.2 Set error message in `errorAlCargar` when HTTP subscriptions fail
- [x] 2.3 Update template to show error message when `errorAlCargar[tabActiva]` is not null, replacing the chart/table area