## Why

The DetalleTarjeta modal crashes with `NG0600: Writing to signals is not allowed while Angular renders the template` when opening any production card, making process details completely inaccessible. The progress bar also renders at full width due to division by zero, causing visual confusion.

## What Changes

- **Fix NG0600 crash**: `getInputValue` in `detalle-tarjeta.ts` calls `signal.set()` inside an `@let` template expression (Angular template rendering phase), which Angular 21 explicitly forbids. Move signal initialization to a safe lifecycle hook (`ngOnInit`) and keep `getInputValue` as a pure read-only function.
- **Fix division by zero**: `getBarraPorcentaje` computes `0/0 = NaN` when `cantidad = 0`, producing invalid CSS `width: NaN%` that defaults to 100% width. Return 0 immediately when `total <= 0`.
- **Fix falsy ID filtering**: `@if (proceso.id)` filters out processes with `id = 0`. Use `@if (proceso.id != null)` to accept all valid numeric IDs including 0.
- **Fix KanbanCard filtering**: `obtenerProcesosConAvance` filters out processes with no activity, hiding processes on new cards.
- **Fix iniciarProceso falsy guard**: `if (procesoId)` blocks valid `id = 0`. Use `if (procesoId != null)`.

No new capabilities or requirement changes — this is a pure implementation bug fix. Existing specs (`kanban-proceso-vista`, `kanban-proceso-accion`) describe the correct behavior that this fix restores.

## Capabilities

### New Capabilities
*(None — this is a bug fix with no new capabilities)*

### Modified Capabilities
*(None — requirements are unchanged, only implementation is corrected)*

## Impact

- `src/app/modules/parametros/tarjeta-produccion/kanban-board/detalle-tarjeta/detalle-tarjeta.ts` — remove signal write side effect, fix division by zero
- `src/app/modules/parametros/tarjeta-produccion/kanban-board/detalle-tarjeta/detalle-tarjeta.html` — fix `@if` guard
- `src/app/modules/parametros/tarjeta-produccion/kanban-board/kanban-card/kanban-card.ts` — show all processes in card, fix division by zero
