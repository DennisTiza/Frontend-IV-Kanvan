## Why

El flujo de producción es en serie (unitario), no por lotes. Cada unidad procesada pasa inmediatamente al siguiente proceso. Sin embargo, el Kanban actual impone una secuencialidad artificial: el proceso N solo puede iniciarse cuando el proceso N-1 tiene `cantidadRegistrada > 0`. Esto obliga a los operarios a esperar, cuando en la práctica todos los procesos deberían poder arrancar simultáneamente porque cada uno opera sobre unidades diferentes.

## What Changes

- **Eliminar bloqueo secuencial** (`puedeAcceder`): todos los procesos pueden iniciarse sin esperar a que el anterior tenga avance
- **Eliminar botón "Bloqueado"**: desaparece el estado de proceso bloqueado y su tooltip asociado
- **Eliminar indicador "→ disponible"** en la KanbanCard: ya no es necesario porque todos los procesos están siempre disponibles
- **Mantener límite de cantidad** (`getMaxPermitido`): el input de proceso N sigue limitado por `cantidadRegistrada` del proceso N-1 (una unidad no puede procesarse si no ha salido del proceso anterior)

## Capabilities

### New Capabilities
Ninguna. No se introducen nuevas capacidades, solo se modifican las existentes.

### Modified Capabilities
- `kanban-proceso-accion`: Eliminar los requisitos de secuencialidad entre procesos. El botón Iniciar/Reanudar ya no depende del estado del proceso anterior. Eliminar el concepto de "Bloqueado" y su tooltip.

## Impact

- `src/app/modules/parametros/tarjeta-produccion/kanban-board/detalle-tarjeta/detalle-tarjeta.ts`: Modificar `puedeAcceder()`, `puedeIniciarReanudar()`, `mostrarTooltipBloqueado()`
- `src/app/modules/parametros/tarjeta-produccion/kanban-board/detalle-tarjeta/detalle-tarjeta.html`: Eliminar sección de botón "Bloqueado"
- `src/app/modules/parametros/tarjeta-produccion/kanban-board/kanban-card/kanban-card.ts`: Eliminar `obtenerSiguienteDisponible()`
- `src/app/modules/parametros/tarjeta-produccion/kanban-board/kanban-card/kanban-card.html`: Eliminar indicador "→ disponible"
- `openspec/specs/kanban-proceso-accion/spec.md`: Modificar requisitos de secuencialidad
