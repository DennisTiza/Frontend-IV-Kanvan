## Context

El Kanban actual impone secuencialidad entre procesos: el proceso N solo puede iniciarse si el proceso N-1 tiene `cantidadRegistrada > 0`. La lógica reside en tres funciones del frontend:

| Ubicación | Función | Efecto |
|-----------|---------|--------|
| `detalle-tarjeta.ts` | `puedeAcceder()` | Bloquea botón Iniciar si anterior no tiene avance |
| `detalle-tarjeta.ts` | `getMaxPermitido()` | Limita input máximo al avance del anterior |
| `kanban-card.ts` | `obtenerSiguienteDisponible()` | Muestra "→ disponible" solo si hay proceso accesible |

El flujo real es en serie (unitario): cada unidad pasa individualmente al siguiente proceso. Todos los procesos deberían poder arrancar simultáneamente.

## Goals / Non-Goals

**Goals:**
- Todo proceso sin `fechaFinal` puede iniciarse/reanudarse sin depender del estado de otros procesos
- El botón "Bloqueado" y tooltip asociado desaparecen
- El indicador "→ <proceso> disponible" en la KanbanCard desaparece

**Non-Goals:**
- NO se cambia `getMaxPermitido()` — el input del proceso N sigue limitado por `cantidadRegistrada` del proceso N-1 (una unidad no puede procesarse si el proceso anterior no la ha producido)
- NO se cambia la lógica de columnas del tablero
- NO se cambia la lógica del timer
- NO se cambian las paradas ni finalización
- NO se cambia el backend

## Decisions

### D1: `puedeAcceder()` retorna siempre `true`

**Decisión**: Simplificar `puedeAcceder()` para que siempre retorne `true`, eliminando el chequeo de `cantidadRegistrada` del proceso anterior.

```
// Antes
puedeAcceder(proceso):
  si proceso no tiene cantidadRegistrada ni fechaInicio:
    idx = indexOf(proceso)
    si idx <= 0 → true
    return proceso[idx-1].cantidadRegistrada > 0
  return true

// Después
puedeAcceder(): true  // siempre accesible
```

**Alternativa considerada**: Eliminar `puedeAcceder()` por completo y remover sus llamadas. Se descartó por consistencia — el método aún sirve como punto de extensión si en el futuro se necesitan otros tipos de control de acceso.

### D2: `mostrarTooltipBloqueado()` retorna siempre `''`

**Decisión**: El tooltip "Completa o registra avance en el proceso anterior" ya no aplica. La función retorna string vacío siempre.

### D3: Eliminar sección "Bloqueado" del HTML

**Decisión**: Remover el bloque condicional en `detalle-tarjeta.html` que muestra el botón "Bloqueado" con tooltip (líneas 119-126).

```
// HTML antes
@if (!puedeIniRea && !puedeParada && !puedeFin && !esCompletado && !puedeAcceder(proceso)) {
  <div class="tooltip-wrapper">
    <button class="btn-accion btn-bloqueado" disabled>Bloqueado</button>
    <span class="tooltip-text">{{ tooltip }}</span>
  </div>
}

// HTML después: eliminado
```

### D4: Eliminar `obtenerSiguienteDisponible()` e indicador en KanbanCard

**Decisión**: Remover el método `obtenerSiguienteDisponible()` de `kanban-card.ts` y el bloque condicional que muestra "→ <proceso> disponible" en `kanban-card.html` (líneas 51-56). Todos los procesos están siempre disponibles.

### D5: `getMaxPermitido()` se mantiene sin cambios

**Decisión**: Aunque se elimina la secuencialidad de inicio, el límite de cantidad máxima por proceso sigue siendo necesario. El proceso N no puede reportar más unidades de las que el proceso N-1 ha registrado, porque en un flujo en serie no puedes procesar una unidad que aún no ha salido del proceso anterior.

## Risks / Trade-offs

| Riesgo | Mitigación |
|--------|------------|
| Operarios inician procesos que no tienen materia prima disponible | El límite de `getMaxPermitido()` evita que se reporten más unidades de las producidas aguas arriba. El operario puede iniciar el proceso pero no reportar avance sin insumo. |
| Confusión al ver todos los procesos con botón "Iniciar" | Es el comportamiento esperado para flujo en serie. Cada operario arranca su proceso cuando está listo. |
| El tooltip "Completa o registra avance..." se pierde | Ya no es necesario porque ningún proceso queda bloqueado por secuencialidad. |
