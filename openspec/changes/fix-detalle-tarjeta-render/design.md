## Context

The DetalleTarjeta modal crashes immediately on open with `NG0600: Writing to signals is not allowed while Angular renders the template`. This prevents the entire process detail view from rendering. Two additional bugs (division by zero in progress bar, falsy ID filtering) compound the issue.

**Root cause**: `getInputValue()` in `detalle-tarjeta.ts` is called from an `@let` expression in the template (`detalle-tarjeta.html:23`). Inside `getInputValue`, it calls `this.procesoInputs.set(map)` to lazily initialize the input map. Angular 21 forbids signal writes (`set`) during template rendering — this triggers the NG0600 error, which collapses the entire `@for` block silently.

## Goals / Non-Goals

**Goals:**
- Fix NG0600 crash so the detail modal renders all processes with correct buttons
- Fix progress bar width when `cantidad = 0` (division by zero → NaN → 100%)
- Fix falsy ID guard that excludes `id = 0`
- Fix KanbanCard process visibility for new cards (no activity yet)

**Non-Goals:**
- No new features or UI changes
- No behavioral changes to how actions (iniciar, parada, finalizar) work
- No backend changes

## Decisions

### 1. Separate signal initialization from reads (NG0600 fix)

**Problem**: `getInputValue` serves dual purpose — reads from `procesoInputs` map AND writes to it (lazy init). The write happens during template rendering via `@let`.

**Solution**: Split into two phases:

```
ngOnInit(): initProcesoInputs()
  └─ Pre-fill map with all proceso.id → cantidadRegistrada
  └─ Safe: ngOnInit runs during component init, NOT render

getInputValue(id): number (PURE READ)
  └─ Returns procesoInputs().get(id) ?? 0
  └─ No writes, safe to call from @let or anywhere
```

**Alternatives considered**:
- Using `effect()` to auto-init on `tarjeta()` change — over-engineered for init-only logic
- Keeping lazy init but moving to `computed()` — still writes during render
- Passing `cantidadRegistrada` directly in template instead of `@let` — makes template noisier, still need getInputValue for user-changed values

### 2. Guard division by zero in `getBarraPorcentaje`

**Problem**: `0 / 0 = NaN` → `Math.min(100, NaN) = NaN` → CSS `width: NaN%` is invalid → browser defaults to `auto` → bar fills 100% parent.

**Fix**: Return 0 when `total <= 0` before division.

```typescript
getBarraPorcentaje(proceso): number {
    const total = proceso.cantidad ?? 1;
    const registrada = proceso.cantidadRegistrada ?? 0;
    if (total <= 0) return 0;                    // ← guard
    return Math.min(100, Math.round((registrada / total) * 100));
}
```

### 3. Use null-safe guards for process IDs

**Problem**: `@if (proceso.id)` treats `0`, `""`, `undefined`, `null` all as falsy. SQL Server identity starts at 1, but defensively allowing 0 is safer.

**Fix**: All `proceso.id` checks: `@if (proceso.id != null)` in template, `if (procesoId != null)` in TS.

### 4. Remove process filtering in KanbanCard

**Problem**: `obtenerProcesosConAvance()` filters to only processes with `cantidadRegistrada > 0` or active (`fechaInicio`). New cards in "Por hacer" show zero process bars.

**Fix**: Return all processes unconditionally.

```typescript
obtenerProcesosConAvance(): ProcesoXTarjetaModel[] {
    return this.tarjeta.procesoXTarjetas ?? [];
}
```

## Risks / Trade-offs

- **NG0600 fix is fragile** — The pattern of writing signals during template evaluation is fundamentally wrong in Angular Signal components. The refactor makes `getInputValue` a pure read, eliminating the class of bug entirely.
- **Existing `procesoInputs` signal is cleared on component destroy** — When modal closes, signal resets. `ngOnInit` re-initializes fresh on next open. This is correct behavior.
- **`obtenerProcesosConAvance` change** — Showing all processes unconditionally on the card might look busy for cards with many processes, but is significantly better than showing nothing.
