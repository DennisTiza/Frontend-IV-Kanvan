## MODIFIED Requirements

### Requirement: Listado de tarjetas de producción

El sistema DEBE mostrar el Kanban board de tarjetas de producción en la ruta `/parametros/tarjeta-produccion/listar-tarjeta-produccion`.

#### Scenario: Administrador ve el Kanban board con todas las columnas
- **WHEN** el usuario tiene rol Administrador
- **AND** navega al listado de tarjetas de producción
- **THEN** el sistema muestra el Kanban board con las columnas "Por hacer", "En ejecución" y "Finalizadas"
- **AND** las tarjetas se distribuyen según su estado actual

#### Scenario: Operario ve el Kanban board
- **WHEN** el usuario tiene rol Operario
- **AND** navega al listado de tarjetas de producción
- **THEN** el sistema muestra el Kanban board con las mismas columnas

## REMOVED Requirements

### Requirement: Listado de tarjetas de producción (vista tabla)
**Reason**: Reemplazado por el Kanban board como única interfaz de visualización.
**Migration**: La ruta `/parametros/tarjeta-produccion/listar-tarjeta-produccion` ahora renderiza el Kanban board.
