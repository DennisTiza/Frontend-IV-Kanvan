## Why

El modal de detalle de tarjeta muestra información estática de tiempo por proceso (estimado + consumido), pero no muestra un countdown vivo del tiempo restante. En la KanbanCard se ve un timer regresivo para el último proceso activo; en el modal, con más espacio y contexto, debería verse ese mismo countdown para cada proceso activo, permitiendo al operario monitorear el tiempo restante de todos los procesos simultáneamente.

## What Changes

- Agregar countdown vivo (HH:MM:SS) del tiempo restante para cada proceso activo en el modal de detalle
- El timer se actualiza cada segundo vía `setInterval`
- Se mantiene el tiempo consumido (`real: Xm Ys`) como información complementaria
- Se agrega `OnDestroy` al componente para limpiar el intervalo al cerrar el modal

## Capabilities

### New Capabilities
- *(none)*

### Modified Capabilities
- `kanban-proceso-vista`: el modal de detalle ahora muestra tiempo restante en vivo por proceso activo

## Impact

- `src/app/modules/parametros/tarjeta-produccion/kanban-board/detalle-tarjeta/detalle-tarjeta.ts`: agregar `OnDestroy`, `setInterval` con señal de tick, método `getTiempoRestanteDisplay()`
- `src/app/modules/parametros/tarjeta-produccion/kanban-board/detalle-tarjeta/detalle-tarjeta.html`: agregar display del countdown junto al tiempo estimado/consumido
