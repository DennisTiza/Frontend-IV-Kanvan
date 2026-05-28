## ADDED Requirements

### Requirement: Pantalla de edición de procesos de una tarjeta

El sistema DEBE mostrar una pantalla para editar los procesos asociados a una tarjeta en la ruta `/parametros/tarjeta-produccion/editar-procesos/:id`. Los procesos se obtienen desde `GET /tarjeta-de-produccion/{id}/proceso-x-tarjetas?filter[include][]=proceso&filter[include][]=usuario`.

#### Scenario: Administrador accede a editar procesos de una tarjeta
- **WHEN** el usuario navega a `/parametros/tarjeta-produccion/editar-procesos/{id}`
- **THEN** el sistema carga los procesos de la tarjeta desde el endpoint con includes de proceso y usuario
- **AND** el sistema muestra una tabla con filas por cada proceso
- **AND** cada fila contiene: nombre del proceso (solo lectura), selector de usuario, cantidad (input numérico), tiempo (input numérico)

#### Scenario: Selector de usuario se carga desde GET /usuario
- **WHEN** la pantalla se inicializa
- **THEN** el sistema carga la lista de usuarios desde `SeguridadService.obtenerUsuarios()`
- **AND** el dropdown de cada fila muestra los usuarios disponibles para seleccionar

#### Scenario: Administrador asigna usuario a un proceso
- **WHEN** el usuario selecciona un usuario del dropdown en una fila
- **AND** hace clic en "Actualizar"
- **THEN** el sistema envía `PATCH /proceso-x-tarjeta/{id}` con `{ usuarioId, cantidad, tiempo }`
- **AND** muestra una confirmación de éxito

#### Scenario: Administrador actualiza cantidad y tiempo
- **WHEN** el usuario modifica los campos cantidad y tiempo
- **AND** hace clic en "Actualizar"
- **THEN** el sistema envía `PATCH /proceso-x-tarjeta/{id}` con los valores actualizados
- **AND** muestra una confirmación de éxito
