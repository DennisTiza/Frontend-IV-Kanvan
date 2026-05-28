## Why

El menú actual tiene dos entradas duplicadas para funcionalidad de producción: "Tarjeta de Producción" (Kanban board) y "Tablero de Producción" (tabla de listado). Esto confunde a los usuarios y duplica código. Se unifica todo bajo "Tarjeta de Producción" usando el Kanban board como única interfaz, eliminando componentes obsoletos.

## What Changes

- **BREAKING**: La ruta `/parametros/tarjeta-produccion/listar-tarjeta-produccion` ahora renderiza el KanbanBoardComponent en lugar del componente tabla (`ListarTarjetaProduccion`).
- Eliminar la entrada "Tablero de Producción" del menú lateral (configuración ID 5).
- Eliminar el componente `listar-tarjeta-produccion` (tabla) y todas sus dependencias.
- Eliminar el componente `tablero-operario` y toda su funcionalidad.
- Cambiar el título del Kanban board de "Tablero Kanban" a "Tarjeta de Producción".
- Todas las redirecciones existentes (volver, cancelar, ver resumen) siguen funcionando porque la ruta permanece igual.

## Capabilities

### New Capabilities

- `kanban-board`: Gestión visual de tarjetas de producción mediante tablero Kanban con columnas Por hacer, En ejecución, Finalizadas.

### Modified Capabilities

- `tarjeta-produccion-listar`: El listado de tarjetas de producción cambia de una vista de tabla a un tablero Kanban. La ruta se mantiene igual pero el componente cambia.

## Impact

- Archivos a modificar: `configuracion.menu.ts`, `app.routes.ts`, `kanban-board.html`
- Archivos a eliminar: 6 archivos de los componentes `listar-tarjeta-produccion` y `tablero-operario`
- 3 archivos existentes con redirecciones a `listar-tarjeta-produccion` NO requieren cambios (la ruta no cambia)
