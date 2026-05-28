## MODIFIED Requirements

### Requirement: Menú "Tarjeta De Producción" visible en el sidebar

El sistema DEBE mostrar el ítem "Tarjeta De Producción" en el menú lateral para los roles que tengan permiso `Listar` en el menú ID 2.

#### Scenario: Administrador ve Tarjeta De Producción en el menú
- **WHEN** el usuario tiene rol Administrador (rolId=1)
- **AND** tiene `Listar=1` para menú ID 2
- **THEN** el menú lateral muestra el ítem "Tarjeta De Producción"

#### Scenario: Usuario con permiso Listar ve Tarjeta De Producción en el menú
- **WHEN** el usuario tiene `Listar=1` para menú ID 2
- **THEN** el menú lateral muestra el ítem "Tarjeta De Producción"

#### Scenario: Rol sin permiso Listar no ve el menú
- **WHEN** el usuario no tiene `Listar=1` para menú ID 2
- **THEN** el menú lateral NO muestra el ítem "Tarjeta De Producción"

### Requirement: Listado de tarjetas de producción con acciones funcionales

El sistema DEBE mostrar un listado de tarjetas de producción en la ruta `/parametros/tarjeta-produccion/listar-tarjeta-produccion`. El botón "Crear Tarjeta" DEBE redirigir a `/parametros/tarjeta-produccion/crear-tarjeta`. El botón "Editar" DEBE redirigir a `/parametros/tarjeta-produccion/editar-procesos/{id}`. El botón "Eliminar" DEBE eliminar la tarjeta con confirmación.

#### Scenario: Administrador ve el listado con todos los botones de acción funcionales
- **WHEN** el usuario tiene rol Administrador
- **AND** navega al listado de tarjetas de producción
- **THEN** el sistema muestra la tabla con tarjetas de producción
- **AND** el botón "Crear Tarjeta" redirige a `/parametros/tarjeta-produccion/crear-tarjeta`
- **AND** el botón "Editar" redirige a `/parametros/tarjeta-produccion/editar-procesos/{id}`
- **AND** el botón "Eliminar" elimina la tarjeta previa confirmación

#### Scenario: Usuario sin permiso Crear no ve botón Crear
- **WHEN** el usuario no tiene permiso `Guardar` para menú ID 2
- **THEN** el sistema NO muestra el botón "Crear Tarjeta"

#### Scenario: Usuario sin permiso Editar no ve botón Editar
- **WHEN** el usuario no tiene permiso `Editar` para menú ID 2
- **THEN** el sistema NO muestra el botón "Editar" en la tabla

#### Scenario: Usuario sin permiso Eliminar no ve botón Eliminar
- **WHEN** el usuario no tiene permiso `Eliminar` para menú ID 2
- **THEN** el sistema NO muestra el botón "Eliminar" en la tabla
