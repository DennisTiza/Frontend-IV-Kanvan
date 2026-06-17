## Why

Two bugs in the process detail modal prevent correct workflow: (1) the "Iniciar" button remains visible after a process has already started, and (2) registering a parada triggers a double API call causing a 422 Unprocessable Entity error.

## What Changes

- **Hide "Iniciar/Reanudar" when process is active**: `puedeIniciarReanudar` currently only checks completion and access. It does not check whether the process is already running (`fechaInicio && !fechaFinal`). A running process should show "⏸ Registrar Parada" and "Finalizar" instead, never "Iniciar" or "Reanudar".
- **Fix double API call in registrarParada**: `registrarParada` in `detalle-tarjeta.ts` both calls the service directly AND emits a `procesoAccion` event that causes the parent to call the same service again (without required data). Remove the direct service call and let the event emission handle it — consistent with how `iniciarProceso` and `finalizarProceso` work.

## Capabilities

### New Capabilities
*(None — this is a bug fix)*

### Modified Capabilities
*(None — requirements are unchanged, only implementation is corrected)*

## Impact

- `src/app/modules/parametros/tarjeta-produccion/kanban-board/detalle-tarjeta/detalle-tarjeta.ts`:
  - `puedeIniciarReanudar()` — add active process guard
  - `registrarParada()` — remove direct service call, keep only event emission
