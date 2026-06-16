## Context

El cambio anterior (`eliminar-secuencialidad-procesos`) eliminó la restricción de inicio entre procesos, pero mantuvo `getMaxPermitido()` para limitar el input del proceso N al `cantidadRegistrada` del proceso N-1. Actualmente existen dos problemas:

1. **`puedeFinalizar()`** compara `input === getMaxPermitido`. Si el proceso anterior tiene 30 y el actual también 30, `puedeFinalizar` retorna `true` — pero el proceso debería completarse solo al llegar a su propia `cantidad` (ej: 100).
2. **`onInputChange()`** no valida contra `getMaxPermitido`. El usuario puede escribir cualquier valor, incluso superando lo producido por el proceso anterior.

## Goals / Non-Goals

**Goals:**
- `puedeFinalizar()` solo retorna `true` cuando `input === proceso.cantidad` (la cantidad total del proceso)
- El input valida que el valor ingresado no exceda `getMaxPermitido`
- Si el usuario excede el límite, se muestra un modal de advertencia y el valor no se actualiza

**Non-Goals:**
- No se cambia `getMaxPermitido()` (sigue limitando al avance del proceso anterior)
- No se cambia la lógica de columnas, timer, paradas, o inicio de procesos
- No se cambia el backend

## Decisions

### D1: `puedeFinalizar()` compara contra `proceso.cantidad`

**Decisión**: Cambiar la última línea de `puedeFinalizar()` de `return input === this.getMaxPermitido(proceso)` a `return input === (proceso.cantidad ?? 0)`.

```
// Antes
puedeFinalizar(proceso):
  if fechaFinal → false
  if !fechaInicio → false
  return input === getMaxPermitido(proceso)

// Después
puedeFinalizar(proceso):
  if fechaFinal → false
  if !fechaInicio → false
  return input === (proceso.cantidad ?? 0)
```

**Alternativa**: Dejar `getMaxPermitido` como condición pero solo cuando `getMaxPermitido === proceso.cantidad`. Se descartó porque es más confuso y menos directo.

### D2: Validación en `onInputChange()` con modal de advertencia

**Decisión**: En `onInputChange()`, si el valor ingresado excede `getMaxPermitido`:
- No actualizar el `Map` de `procesoInputs` (el valor visual del input se mantiene en el anterior)
- Activar una señal `mostrarModalLimite` para mostrar el modal de advertencia

```
onInputChange(procesoId, event):
  value = parseInt(event.target.value)
  proceso = buscarProcesoPorId(procesoId)
  maxPermitido = getMaxPermitido(proceso)
  
  if value > maxPermitido:
    mostrarModalLimite.set(true)
    event.target.value = getInputValue(procesoId)  // restaura el valor anterior en el DOM
    return
  
  // actualizar normal
  map.set(procesoId, value)
  procesoInputs.set(map)
```

**Alternativa considerada**: Usar el HTML `[max]` attribute y validación nativa. Se descartó porque `[max]` no impide escribir valores mayores en el input (solo afecta validación de formulario HTML5) y no da feedback visual claro.

### D3: Modal de advertencia inline en el mismo componente

**Decisión**: El modal de advertencia será un bloque condicional dentro del mismo `detalle-tarjeta.html`, controlado por una señal `mostrarModalLimite`. No se crea un componente separado.

```
detalle-tarjeta.ts:
  readonly mostrarModalLimite = signal(false);

detalle-tarjeta.html:
  @if (mostrarModalLimite()) {
    <div class="modal-overlay" (click)="mostrarModalLimite.set(false)">
      <div class="modal-advertencia" (click)="$event.stopPropagation()">
        <p>No se puede colocar una cantidad mayor a la del proceso anterior.</p>
        <button (click)="mostrarModalLimite.set(false)">Aceptar</button>
      </div>
    </div>
  }
```

**Alternativa considerada**: Modal genérico reutilizable. Se descartó porque es un caso único y no justifica la abstracción.

## Risks / Trade-offs

| Riesgo | Mitigación |
|--------|------------|
| El usuario escribe un valor inválido y el input se resetea sin explicación clara | El modal explica explícitamente por qué no se permite el valor |
| Múltiples procesos con el modal abierto simultáneamente | `mostrarModalLimite` es un solo boolean, no hay riesgo de múltiples modales |
| El modal podría confundirse con el modal principal de detalle | El overlay del modal de advertencia se renderiza dentro del modal de detalle, con z-index superior |
