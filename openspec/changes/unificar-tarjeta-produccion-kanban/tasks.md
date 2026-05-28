## 1. Modificar archivos de configuración

- [x] 1.1 Eliminar entrada "Tablero de Producción" (ID 5) de `configuracion.menu.ts`
- [x] 1.2 Cambiar `component: ListarTarjetaProduccion` a `component: KanbanBoardComponent` en la ruta `listar-tarjeta-produccion` de `app.routes.ts`
- [x] 1.3 Eliminar imports de `ListarTarjetaProduccion` y `TableroOperario` en `app.routes.ts`
- [x] 1.4 Eliminar la ruta `tablero-operario` en `app.routes.ts`

## 2. Actualizar componente Kanban board

- [x] 2.1 Cambiar título de "Tablero Kanban" a "Tarjeta de Producción" en `kanban-board.html`
- [x] 2.2 Cambiar descripción de "Visualiza el flujo de trabajo de las tarjetas de producción." a "Visualiza y gestiona las tarjetas de producción." en `kanban-board.html`

## 3. Eliminar componentes obsoletos

- [x] 3.1 Eliminar archivos del componente `listar-tarjeta-produccion` (`.ts`, `.html`, `.css`)
- [x] 3.2 Eliminar archivos del componente `tablero-operario` (`.ts`, `.html`, `.css`)

## 4. Verificar integridad

- [x] 4.1 Verificar que las redirecciones existentes (crear-tarjeta, editar-procesos, kanban-card) sigan funcionando
- [x] 4.2 Verificar que la compilación no tenga errores
- [x] 4.3 Ocultar Tablero de Producción y Kanban del menú lateral para operarios
