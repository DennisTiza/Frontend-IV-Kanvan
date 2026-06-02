## Context

El Kanban actual filtra tarjetas en columnas usando exclusivamente `tarjeta.estado`. El backend solo cambia `estado` a `"en_proceso"` cuando se inicia el proceso con `orden === 1`. Para procesos subsecuentes, `tarjeta.estado` queda en `"por_hacer"` aunque haya un proceso activo.

Además, `obtenerProximoProceso()` y `esProximoPendiente()` buscan el primer proceso sin `fechaInicio` sin verificar si existe un proceso activo, causando que aparezca un botón "Iniciar" para el siguiente proceso cuando no debería.

## Goals / Non-Goals

**Goals:**
- Una tarjeta con un proceso en curso (fechaInicio sin fechaFinal) DEBE aparecer en la columna "En ejecución", independientemente de `tarjeta.estado`
- Una tarjeta sin procesos activos y sin procesos pendientes DEBE aparecer en "Finalizadas"
- Una tarjeta sin procesos activos y con procesos pendientes DEBE aparecer en "Por hacer"
- El botón "Iniciar proceso" solo debe aparecer cuando NO haya ningún proceso activo en la tarjeta
- El botón del siguiente proceso debe mostrarse como "Bloqueado" si existe un proceso activo

**Non-Goals:**
- No se cambia el backend
- No se agregan nuevas capacidades

## Decisions

### Decisión 1: Derivar columna desde procesos, no desde tarjeta.estado

En lugar de filtrar por `tarjeta.estado`, se derivará la columna visual según:

```
function columnaTarjeta(t):
  if t.estado === 'finalizada'                  → finalizada
  if t.procesoXTarjetas?.some(p => p.fechaInicio && !p.fechaFinal)  → en ejecución
  if t.estado === 'por_hacer'                   → por hacer
  return por_hacer (fallback)
```

Esto hace que cualquier tarjeta con un proceso activo se muestre en "En ejecución" aunque el backend no haya cambiado `tarjeta.estado`.

**Alternativa**: Cambiar el backend para que `/iniciar` siempre ponga `estado = en_proceso` y `/finalizar` lo maneje.
**Razón**: El backend no se toca en este cambio. Además, derivar desde procesos es más robusto — siempre refleja la realidad.

### Decisión 2: "Próximo pendiente" solo si no hay activo

La lógica para determinar si hay un próximo proceso a iniciar:

```
function hayProcesoActivo(t):
  return t.procesoXTarjetas?.some(p => p.fechaInicio && !p.fechaFinal)

function obtenerProximoProceso(t):
  if hayProcesoActivo(t) → return undefined
  return t.procesoXTarjetas?.find(p => !p.fechaInicio)
```

Esto se aplica tanto en `KanbanCardComponent` (para mostrar datos en la card) como en `DetalleTarjetaComponent` (para los botones).

## Risks / Trade-offs

| Riesgo | Mitigación |
|--------|------------|
| Una tarjeta podría terminar en "Por hacer" + "En ejecución" simultáneamente si hay proceso activo pero estado es por_hacer | Las columnas se definen por proceso activo primero. Si hay activo → en ejecución, sin importar estado |
| Confusión si `tarjeta.estado` es `finalizada` pero hay procesos sin fechaFinal | El backend garantiza que `finalizada` solo se asigna cuando todos los procesos tienen fechaFinal. Si ocurriera, el derived state lo mostraría en ejecución (más seguro) |
