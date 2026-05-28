## Context

Actualmente existen dos formas de ver tarjetas de producción: un Kanban board en "Tarjeta de Producción" (menú ID 2) y una vista de tabla en "Tablero de Producción" (menú ID 5), más un componente `tablero-operario` duplicado. Esto genera confusión en los usuarios y mantenimiento duplicado. Se unifica todo bajo el Kanban board.

## Goals / Non-Goals

**Goals:**
- Unificar el punto de entrada "Tarjeta de Producción" para que use el Kanban board
- Eliminar los componentes `listar-tarjeta-produccion` y `tablero-operario`
- Eliminar la entrada "Tablero de Producción" del menú lateral
- Mantener todas las rutas y redirecciones existentes funcionales

**Non-Goals:**
- No se modifican los componentes de crear/editar tarjetas ni editar procesos
- No se cambia la lógica de negocio del Kanban board
- No se modifican permisos ni roles

## Decisions

1. **Reutilizar la ruta existente** en lugar de crear una nueva. La ruta `/parametros/tarjeta-produccion/listar-tarjeta-produccion` ya existe y tiene redirecciones desde crear-tarjeta, editar-procesos y kanban-card. Cambiar el component en la ruta evita modificar 3 archivos adicionales.

2. **Eliminar vs mantener `listar-tarjeta-produccion`**: Se elimina completamente porque el Kanban board cubre todas las necesidades de visualización. No hay funcionalidad exclusiva de la tabla que se pierda.

3. **Eliminar `tablero-operario`**: Ya no hay una entrada de menú separada que lo referencie, y el Kanban board está disponible para todos los roles con permiso.

## Risks / Trade-offs

- **Redirecciones existentes**: Bajo riesgo. Las redirecciones apuntan a la ruta, no al componente, por lo que no se ven afectadas.
- **Pérdida de funcionalidad de tabla**: La tabla permitía ver todas las tarjetas en formato列表. El Kanban board organiza por columnas de estado, lo que puede ser menos denso. Aceptado como trade-off a favor de la experiencia visual.
