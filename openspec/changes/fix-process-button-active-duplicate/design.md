## Context

Two runtime bugs discovered after the NG0600 fix:

1. **Iniciar button visible after process started**: `puedeIniciarReanudar()` on `detalle-tarjeta.ts:76` only checks if the process is completed (`cantidadRegistrada >= cantidad`) and if it's accessible. It never checks if the process is already **active** (`fechaInicio && !fechaFinal`). Result: after clicking "▶ Iniciar" and reloading, the button remains visible instead of showing "⏸ Registrar Parada" and "Finalizar".

2. **Double API call on registrarParada (422 error)**: `registrarParada()` on `detalle-tarjeta.ts:147` has an architectural inconsistency — it calls `this.procesoXTarjetaService.RegistrarParada(...)` **directly** AND then in its `next()` callback emits a `procesoAccion` event that triggers the **parent** (`kanban-board.ts`) to call `RegistrarParada(...)` **again** — this time without `cantidadReportada` or `codigoDeParadaId`, causing the 422.

```
Current registrarParada flow:

  registrarParada()
    ├─ Service.RegistrarParada(id, {cantidad, codigoId})  ← call #1 ✓
    └─ next():
         └─ emit({tipo: 'registrar-parada', procesoId: id})  ← event to parent
              └─ manejarAccionProceso():
                   └─ Service.RegistrarParada(id, {undefined!, undefined!})  ← call #2 ✗ 422
```

Contrast with `iniciarProceso()` and `finalizarProceso()` which only emit events and let the parent handle every API call.

## Goals / Non-Goals

**Goals:**
- Hide "Iniciar/Reanudar" button when process is already active (has `fechaInicio` without `fechaFinal`)
- Eliminate the double API call by making `registrarParada` consistent with other action handlers
- Fix the 422 error when registering paradas

**Non-Goals:**
- No changes to the parent `kanban-board.ts` — its `manejarAccionProceso` already handles `registrar-parada` correctly
- No UX changes beyond bug fixes (modal will close on parada, same as finalizar)

## Decisions

### 1. Active process guard in `puedeIniciarReanudar`

Add `esActivo` check as the first condition:

```
puedeIniciarReanudar(proceso):
  if (fechaFinal) return false         ← already completed
  if (activo) return false              ← already running → NEW
  if (total > 0 && registrada >= total) return false  ← fully registered
  if (!puedeAcceder) return false       ← blocked by previous
  return true                           ← can start/resume
```

The order matters: check `fechaFinal` first (terminal), then `activo` (already running), then completion, then access. Only if none of these match, the process can be started.

### 2. Make `registrarParada` emit-only

Align with the pattern used by `iniciarProceso` and `finalizarProceso`:

```
registrarParada(proceso):
  id ← proceso?.id
  if (!id || !codigoSeleccionado) return
  cantidadReportada ← input - cantidadRegistrada
  emit({ tipo: 'registrar-parada', procesoId: id,
         cantidadReportada, codigoDeParadaId })
```

Remove: direct `RegistrarParada` call, `guardando` signal, `procesoExpandido` and `codigoSeleccionado` resets. The parent's `next()` already closes the modal and reloads data.

## Risks / Trade-offs

- **Modal closes on parada** — after this fix, registering a parada will close the modal and reload the board (consistent with iniciar and finalizar). The user loses the inline expansion UX but gains consistency and reliability.
- **`guardando` signal becomes unused** — it was only used by `registrarParada`. No other code references it. It can remain in the component without harm, or be cleaned up.
