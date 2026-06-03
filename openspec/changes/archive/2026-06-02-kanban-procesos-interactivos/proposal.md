## Why

El tablero Kanban de tarjetas de producción actualmente solo muestra información estática. Los operarios no pueden interactuar con los procesos asignados — no hay forma de iniciar ni finalizar un proceso desde el tablero. El backend ya tiene los endpoints y el modelo de datos necesarios (`orden` en ProcesoXTarjeta, `POST /iniciar`, `POST /finalizar`). El frontend debe actualizarse para habilitar el ciclo de vida completo del proceso.

## What Changes

- Modificar `KanbanBoardComponent` para que al cargar tarjetas use el filter con `include` anidado que traiga `procesoXTarjetas` ordenados por `orden ASC` con `operario` y `proceso` incrustados
- Actualizar la card en estado `por_hacer` para mostrar: tiempo estimado total (suma de `tiempo` de todos los procesos), tiempo del próximo proceso, y el operario del primer proceso pendiente (no del índice `[0]` fijo)
- Hacer que la card `por_hacer` sea clickeable y abra un modal/detalle con la lista completa de procesos
- Actualizar la card `en ejecución` para que el timer use `proceso.tiempo` en lugar de `tarjeta.cantidad` (bug actual)
- Mostrar el nombre del proceso activo en la card `en ejecución`, no el primero del array
- Crear un componente/modal de detalle de tarjeta que liste todos los procesos ordenados con:
  - Botón "Iniciar proceso" solo para el próximo proceso pendiente
  - Botón "Finalizar proceso" solo para el proceso actualmente en ejecución
  - Botón "Bloqueado" (deshabilitado) para los demás procesos
  - Indicador visual de proceso completado, en curso, o pendiente
- Agregar servicios HTTP para los nuevos endpoints: `POST /proceso-x-tarjeta/{id}/iniciar` y `POST /proceso-x-tarjeta/{id}/finalizar`
- Refrescar el tablero Kanban después de cada acción para reflejar el nuevo estado

## Capabilities

### New Capabilities
- `kanban-proceso-vista`: Visualización de procesos en tarjetas Kanban — muestra tiempo estimado total, próximo proceso, operario correcto según orden, y timer basado en `proceso.tiempo`
- `kanban-proceso-accion`: Acciones de iniciar/finalizar procesos desde el tablero — modal de detalle con lista de procesos ordenados, botones contextuales (iniciar/finalizar/bloqueado), y refresco del tablero post-acción

### Modified Capabilities
- `tarjeta-produccion-listar`: El listado de tarjetas ahora debe incluir `procesoXTarjetas` con `operario` y `proceso` anidados mediante filter de LoopBack. El endpoint GET con include reemplaza la llamada simple.

## Impact

- `src/app/modules/parametros/tarjeta-produccion/kanban-board/kanban-board.ts`: Cambiar llamada a `ListarTarjetas()` por una con filter include anidado
- `src/app/modules/parametros/tarjeta-produccion/kanban-board/kanban-board.html`: Sin cambios mayores (solo pasa data)
- `src/app/modules/parametros/tarjeta-produccion/kanban-board/kanban-card/kanban-card.ts`: Múltiples cambios en lógica de operario, proceso actual, timer, click handler
- `src/app/modules/parametros/tarjeta-produccion/kanban-board/kanban-card/kanban-card.html`: Nueva sección para `por_hacer` con tiempos, y que la card sea clickeable
- `src/app/modules/parametros/tarjeta-produccion/kanban-board/kanban-card/kanban-card.css`: Estilos para nuevos elementos
- Nuevo componente: `src/app/modules/parametros/tarjeta-produccion/kanban-board/detalle-tarjeta/` (modal de detalle de procesos)
- `src/app/services/parametros/tarjeta-produccion.service.ts`: Nuevo método `ListarTarjetasConProcesos()` con filter
- `src/app/services/parametros/proceso-xtarjeta.service.ts`: Nuevos métodos `IniciarProceso(id)` y `FinalizarProceso(id, codigoError?)`
