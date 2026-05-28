## ADDED Requirements

### Requirement: Kanban board con columnas de estado

El sistema DEBE mostrar un tablero Kanban con tarjetas de producción organizadas en columnas según su estado.

#### Scenario: Administrador ve el Kanban board con todas las columnas
- **WHEN** el usuario tiene rol Administrador
- **AND** navega a la ruta `/parametros/tarjeta-produccion/listar-tarjeta-produccion`
- **THEN** el sistema muestra el Kanban board con las columnas "Por hacer", "En ejecución" y "Finalizadas"
- **AND** las tarjetas se distribuyen según su estado actual

#### Scenario: Operario ve el Kanban board
- **WHEN** el usuario tiene rol Operario
- **AND** navega a la ruta `/parametros/tarjeta-produccion/listar-tarjeta-produccion`
- **THEN** el sistema muestra el Kanban board con las mismas columnas

### Requirement: Título "Tarjeta de Producción" en el Kanban board

El sistema DEBE mostrar el título "Tarjeta de Producción" en el encabezado del Kanban board.

#### Scenario: Título correcto en el Kanban
- **WHEN** el usuario navega al Kanban board
- **THEN** el encabezado muestra "Tarjeta de Producción"
- **AND** la descripción dice "Visualiza y gestiona las tarjetas de producción."
