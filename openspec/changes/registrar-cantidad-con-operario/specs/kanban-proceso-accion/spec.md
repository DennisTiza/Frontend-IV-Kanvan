## MODIFIED Requirements

### Requirement: Botón "Registrar Parada" con operario

El modal DEBE mostrar el botón "Registrar Parada" solo cuando el input es mayor a `cantidadRegistrada` y menor a `cantidad`, Y se ha seleccionado un operario. El body del POST ahora incluye `operarioId`.

#### Scenario: Registrar Parada con operario
- **WHEN** el operario ingresa input=40 (registrada=0, total=100) y selecciona un operario
- **THEN** el botón "Registrar Parada" está habilitado
- **AND** al hacer clic, se expande el formulario de parada
- **AND** al guardar, se envía `POST /proceso-x-tarjeta/{id}/registrar-parada` con `{ cantidadReportada: 40, codigoDeParadaId: 3, operarioId: 1 }`

#### Scenario: Registrar Parada deshabilitado sin operario
- **WHEN** el operario ingresa input=40 pero no selecciona operario
- **THEN** el botón "Registrar Parada" está deshabilitado
- **AND** se muestra visualmente deshabilitado (opacity reducida)

#### Scenario: Parada sin operarios asignados
- **WHEN** el proceso activo no tiene operarios asignados
- **THEN** el botón "Registrar Parada" está deshabilitado
- **AND** el selector muestra "Sin operarios asignados"

### Requirement: Botón "Finalizar proceso" con operario condicional

El modal DEBE mostrar el botón "Finalizar" cuando `input === cantidad`. Si hay cantidad a reportar (delta > 0), requiere operario seleccionado. Si no hay cantidad a reportar (solo finalizar), no requiere operario.

#### Scenario: Finalizar con cantidad requiere operario
- **WHEN** input=100 (registrada=0, total=100) y hay un operario seleccionado
- **THEN** el botón "Finalizar" está habilitado
- **AND** al hacer clic, se envía `POST /proceso-x-tarjeta/{id}/finalizar` con `{ cantidadReportada: 100, operarioId: 1 }`

#### Scenario: Finalizar con cantidad deshabilitado sin operario
- **WHEN** input=100 (registrada=0, total=100) pero no hay operario seleccionado
- **THEN** el botón "Finalizar" está deshabilitado

#### Scenario: Finalizar sin cantidad no requiere operario
- **WHEN** input=100 (registrada=100, total=100) — delta=0
- **THEN** el botón "Finalizar" está habilitado
- **AND** al hacer clic, se envía `POST /proceso-x-tarjeta/{id}/finalizar` con body `{}`
- **AND** no se muestra el selector de operarios

### Requirement: Respuesta de paradas incluye operario

El sistema DEBE actualizar el modelo `ParadaModel` para reflejar que el endpoint `GET /proceso-x-tarjeta/{id}/paradas` ahora devuelve `operarioId` y la relación `operario`.

#### Scenario: Vista de paradas muestra operario
- **WHEN** el operario expande el histórico de paradas de un proceso
- **THEN** cada parada muestra: hora, código de parada, cantidad, y nombre del operario que la registró
- **AND** el modelo `ParadaModel` incluye `operarioId` y `operario`

#### Scenario: Histórico de paradas con nueva estructura
- **WHEN** el endpoint `GET /proceso-x-tarjeta/{id}/paradas` responde
- **THEN** cada item incluye `operarioId: 1` y `operario: { id: 1, nombre, apellido }`

### Requirement: Nuevo endpoint registros-cantidad

El sistema DEBE agregar un método en `ProcesoXtarjetaService` para consultar el nuevo endpoint `GET /proceso-x-tarjeta/{id}/registros-cantidad`.

#### Scenario: Consultar registros de cantidad
- **WHEN** se llama a `ObtenerRegistrosCantidad(id)`
- **THEN** retorna un `Observable<RegistroDeCantidadModel[]>` con el historial completo de reportes por operario
- **AND** cada registro incluye: id, procesoXTarjetaId, operarioId, cantidad, tipo, codigoDeParadaId, fecha, operario, codigoDeParada
