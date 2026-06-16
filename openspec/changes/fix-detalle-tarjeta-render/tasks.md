## 1. Fix NG0600 — Remove signal write from template expression

- [x] 1.1 Add `initProcesoInputs()` private method in `detalle-tarjeta.ts` that pre-fills `procesoInputs` map with all `proceso.id → cantidadRegistrada` values
- [x] 1.2 Call `initProcesoInputs()` inside `ngOnInit()` after codigos de parada fetch
- [x] 1.3 Refactor `getInputValue(procesoId, defaultVal?)` to pure read-only `getInputValue(procesoId): number` that returns `procesoInputs().get(procesoId) ?? 0` (no `set` call)
- [x] 1.4 Update template `detalle-tarjeta.html` to use `@let inputValue = getInputValue(procesoId)` instead of `getInputValue(procesoId, cantidadReg)`

## 2. Fix division by zero in progress bar

- [x] 2.1 Add `if (total <= 0) return 0` guard at top of `getBarraPorcentaje()` in `detalle-tarjeta.ts`
- [x] 2.2 Apply same fix to `getBarraPorcentaje()` in `kanban-card.ts`

## 3. Fix falsy ID guard

- [x] 3.1 Change `@if (proceso.id)` to `@if (proceso.id != null)` in `detalle-tarjeta.html:17`
- [x] 3.2 Change `if (procesoId)` to `if (procesoId != null)` in `iniciarProceso()` in `detalle-tarjeta.ts` (already done from previous iteration, verify)

## 4. Fix KanbanCard process filtering

- [x] 4.1 Change `obtenerProcesosConAvance()` in `kanban-card.ts` to return `this.tarjeta.procesoXTarjetas ?? []` instead of filtered subset (already done from previous iteration, verify)

## 5. Verify build and runtime

- [x] 5.1 Run `npx tsc --noEmit` to verify TypeScript compilation
- [x] 5.2 Run `npx ng build` to verify Angular build
- [ ] 5.3 Open browser console and confirm no NG0600 error when clicking a "Por hacer" card *(user to verify)*
- [ ] 5.4 Verify all 3 processes render in modal with correct buttons (Iniciar/Bloqueado) *(user to verify)*
- [ ] 5.5 Verify progress bars show 0% for fresh processes with no activity *(user to verify)*
- [ ] 5.6 Verify KanbanCard shows process bars for all processes on new cards *(user to verify)*
