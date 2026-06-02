## Why

El tablero Kanban tiene dos bugs en la transición de procesos que rompen el flujo de trabajo:

1. **La card no migra a "En ejecución"** al iniciar un proceso (excepto orden=1). El backend solo cambia `tarjeta.estado` a `en_proceso` para el primer proceso. Para procesos posteriores, la card se queda en `por_hacer` aunque tenga un proceso activo.

2. **El botón "Iniciar proceso" aparece en el siguiente proceso** aunque haya uno en curso. `obtenerProximoProceso()` y `esProximoPendiente()` ignoran si existe un proceso activo — muestran el siguiente pendiente como "iniciable" cuando debería estar bloqueado hasta que el actual termine.

## What Changes

- Derivat el estado visual de la tarjeta desde sus procesos en lugar de confiar solo en `tarjeta.estado`: si hay un proceso con `fechaInicio` y sin `fechaFinal`, la tarjeta DEBE aparecer en la columna "En ejecución" independientemente del valor de `tarjeta.estado`
- Corregir `obtenerProximoProceso()` en `KanbanCardComponent` para que retorne `undefined` si ya existe un proceso activo
- Corregir `esProximoPendiente()` en `DetalleTarjetaComponent` con la misma lógica — no debe haber "próximo pendiente" mientras haya un proceso en curso
- Asegurar que el botón del siguiente proceso se muestre como "Bloqueado" (no "Iniciar") cuando hay un proceso activo
- Asegurar que al abrir el modal desde una card `por_hacer` que tiene un proceso activo, se muestre el estado correcto y el botón de "Finalizar" para el proceso en curso

## Capabilities

### New Capabilities
Ninguna

### Modified Capabilities
- `kanban-proceso-vista`: La determinación del estado visual de la tarjeta ahora se deriva de sus procesos (proceso activo → en ejecución), no solo de `tarjeta.estado`
- `kanban-proceso-accion`: La lógica de "próximo proceso pendiente" ahora considera si existe un proceso activo. No se puede iniciar un proceso mientras otro esté en curso, aunque el backend ya lo valide

## Impact

- `src/app/.../kanban-board/kanban-board.ts`: Lógica de filtrado de columnas — derivar estado desde procesos
- `src/app/.../kanban-board/kanban-card/kanban-card.ts`: `obtenerProximoProceso()` debe retornar `undefined` si hay proceso activo
- `src/app/.../kanban-board/detalle-tarjeta/detalle-tarjeta.ts`: `esProximoPendiente()` misma corrección
