## ADDED Requirements

### Requirement: Menú "Tarjeta De Producción" visible en el sidebar

El sistema DEBE mostrar el ítem "Tarjeta De Producción" en el menú lateral para los roles que tengan permiso `Listar` en el menú ID 2.

#### Scenario: Administrador ve Tarjeta De Producción en el menú
- **WHEN** el usuario tiene rol Administrador (rolId=1)
- **AND** tiene `Listar=1` para menú ID 2
- **THEN** el menú lateral muestra el ítem "Tarjeta De Producción"

#### Scenario: Operario ve Tarjeta De Producción en el menú
- **WHEN** el usuario tiene rol Operario (rolId=2)
- **AND** tiene `Listar=1` para menú ID 2
- **THEN** el menú lateral muestra el ítem "Tarjeta De Producción"

#### Scenario: Rol sin permiso Listar no ve el menú
- **WHEN** el usuario no tiene `Listar=1` para menú ID 2
- **THEN** el menú lateral NO muestra el ítem "Tarjeta De Producción"

### Requirement: Listado de tarjetas de producción

El sistema DEBE mostrar un listado de tarjetas de producción en la ruta `/parametros/tarjeta-produccion/listar-tarjeta-produccion`.

#### Scenario: Administrador ve el listado con todos los botones de acción
- **WHEN** el usuario tiene rol Administrador
- **AND** navega al listado de tarjetas de producción
- **THEN** el sistema muestra la tabla con tarjetas de producción
- **AND** el sistema muestra botones de Crear, Editar y Eliminar

#### Scenario: Operario ve el listado con botones limitados
- **WHEN** el usuario tiene rol Operario
- **AND** navega al listado de tarjetas de producción
- **THEN** el sistema muestra la tabla con tarjetas de producción
- **AND** el sistema muestra botón de Editar
- **AND** el sistema NO muestra botón de Crear
- **AND** el sistema NO muestra botón de Eliminar
