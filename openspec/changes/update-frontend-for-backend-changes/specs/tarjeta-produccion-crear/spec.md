## ADDED Requirements

### Requirement: Formulario de creación de tarjeta de producción con selector de producto

El sistema DEBE mostrar un formulario de creación de tarjeta de producción en la ruta `/parametros/tarjeta-produccion/crear-tarjeta`. El formulario DEBE incluir un selector de producto cargado desde `GET /producto`.

#### Scenario: Administrador accede al formulario de creación
- **WHEN** el usuario navega a `/parametros/tarjeta-produccion/crear-tarjeta`
- **THEN** el sistema muestra un formulario con campos: código, producto (selector), cantidad, fechaInicio, fechaFinal, estado
- **AND** el selector de producto se carga desde `GET /producto`
- **AND** el campo estado tiene valor por defecto "activa"

#### Scenario: Administrador completa y envía el formulario
- **WHEN** el usuario completa todos los campos requeridos
- **AND** hace clic en "Guardar"
- **THEN** el sistema envía `POST /tarjeta-de-produccion` con `{ productoId, codigo, cantidad, fechaInicio, fechaFinal, estado }`
- **AND** en caso de éxito, redirige a `/parametros/tarjeta-produccion/editar-procesos/{id}`

#### Scenario: Error al crear la tarjeta
- **WHEN** el usuario envía el formulario
- **AND** el backend retorna un error
- **THEN** el sistema muestra un mensaje de error
- **AND** el usuario permanece en el formulario de creación
