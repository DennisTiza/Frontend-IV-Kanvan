## Why

La vista actual de Tarjetas de Producción usa una tabla tradicional que no permite visualizar rápidamente el estado del flujo de trabajo. Se necesita un tablero Kanban visual con columnas por estado (Por hacer, En ejecución, Finalizadas) que brinde a operarios y administradores una visión clara del progreso, tiempos restantes y asignaciones.

## What Changes

- **Nuevo**: Componente KanbanBoard con tres columnas (Por hacer, En ejecución, Finalizadas)
- **Nuevo**: Componente KanbanCard con anatomía diferenciada según estado de la tarjeta
- **Nuevo**: Temporizador/contador en tiempo real para tarjetas "En ejecución" con barra de progreso
- **Nuevo**: Barra de progreso visual con indicador porcentual en tarjetas en ejecución
- **Nuevo**: Badges de conteo por columna con estilo circular
- **Nuevo**: Botones "Ver todas (X)" al pie de cada columna
- **Nuevo**: Botones "Ver detalles" y "Ver resumen" en tarjetas según estado
- **Modificado**: Consulta de tarjetas para agrupar por estado (pendiente, en-proceso, finalizada)
- **Responsive**: Columnas se apilan verticalmente en pantallas pequeñas
- **Servicio**: Nuevos métodos en TarjetaProduccionService para obtener tarjetas filtradas por estado

## Capabilities

### New Capabilities
- `kanban-board`: Tablero Kanban con tres columnas de estado, cards con anatomía variable, contadores, temporizador, barra de progreso y diseño responsivo

### Modified Capabilities
- *(ninguna — es una vista completamente nueva, separada del listado existente)*

## Impact

- **Nuevo componente**: `KanbanBoardComponent` en `modules/parametros/tarjeta-produccion/kanban-board/`
- **Nuevo componente**: `KanbanCardComponent` como subcomponente de tablero
- **Servicios**: Extender `TarjetaProduccionService` con `ListarTarjetasPorEstado()`
- **Rutas**: Nueva ruta `/parametros/tarjeta-produccion/kanban`
- **Menú**: Posible nuevo ítem "Kanban" en el menú lateral
- **CSS**: Nueva hoja de estilos para layout Kanban, cards, progress-bar, temporizador
