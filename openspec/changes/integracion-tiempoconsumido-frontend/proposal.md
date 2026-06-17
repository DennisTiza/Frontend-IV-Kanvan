## Why

El backend separó `tiempo` (estimado en minutos) de `tiempoConsumido` (real acumulado en segundos). El frontend sigue tratando `tiempo` como si fuera el acumulado real, rompiendo el countdown del timer después de una parada/reanudar. Además, el botón "Reanudar" se muestra incorrectamente en procesos activos y los botones de acción no tienen espaciado.

## What Changes

- Agregar campo `tiempoConsumido` al modelo TypeScript `ProcesoXTarjetaModel`
- Actualizar `actualizarTiempo()` en `KanbanCardComponent` para usar `tiempoConsumido` en el cálculo del countdown multi-sesión
- Corregir `puedeIniciarReanudar()` en `DetalleTarjetaComponent` para bloquear procesos activos (aprovechando que el backend limpia `fechaInicio` en parada)
- Agregar `gap` en `.proceso-accion` para separar botones
- Mostrar `tiempoConsumido` formateado como tiempo real trabajado en la card y detalle

## Capabilities

### New Capabilities
- `tiempo-consumido-display`: Mostrar tiempo real consumido (acumulado multi-sesión) en la card del Kanban y en el detalle de procesos

### Modified Capabilities
- `kanban-proceso-accion`: El timer countdown ahora usa `tiempoConsumido` para continuar desde donde se pausó al reanudar. El botón Reanudar se muestra solo para procesos pausados (fechaInicio=null, registrada>0), no para activos

## Impact

- `src/app/models/procesoXTarjeta.model.ts` — nuevo campo `tiempoConsumido`
- `src/app/modules/.../kanban-card/kanban-card.ts` — lógica del timer
- `src/app/modules/.../detalle-tarjeta/detalle-tarjeta.ts` — guardia de botón Reanudar
- `src/app/modules/.../detalle-tarjeta/detalle-tarjeta.css` — espaciado de botones
- `src/app/modules/.../detalle-tarjeta/detalle-tarjeta.html` — display opcional de tiempo consumido
- `src/app/modules/.../kanban-card/kanban-card.html` — display opcional de tiempo consumido
