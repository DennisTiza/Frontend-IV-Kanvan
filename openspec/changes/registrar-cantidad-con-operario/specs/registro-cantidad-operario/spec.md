## Requirements

### Requirement: Selector de operario en input de cantidad

El sistema DEBE mostrar un selector `<select>` de operarios dentro de la fila de input de cantidad, debajo del campo numérico, únicamente cuando el valor del input sea mayor a `cantidadRegistrada`. El select DEBE listar los operarios disponibles desde `proceso.operarioXProcesoXTarjetas`.

#### Scenario: Selector visible cuando hay cantidad a reportar
- **WHEN** el proceso está activo y el operario ingresa una cantidad mayor a `cantidadRegistrada` (ej: registrada=0, input=40)
- **THEN** el selector de operarios se muestra debajo del input numérico
- **AND** el selector contiene la lista de operarios del proceso

#### Scenario: Selector oculto cuando no hay delta
- **WHEN** el input es igual a `cantidadRegistrada` (ej: registrada=40, input=40)
- **THEN** el selector de operarios NO se muestra

#### Scenario: Selector oculto cuando proceso no está activo
- **WHEN** el proceso no tiene `fechaInicio` o tiene `fechaFinal`
- **THEN** el selector de operarios NO se muestra

#### Scenario: Selector vacío muestra placeholder
- **WHEN** el selector se muestra por primera vez
- **THEN** el valor seleccionado es `null`
- **AND** se muestra el texto "Seleccionar operario..." como placeholder (no seleccionable)
- **AND** no hay ninguna opción pre-seleccionada

### Requirement: Selector obligatorio

El sistema DEBE requerir que el operario seleccione un operario antes de poder ejecutar cualquier acción que reporte cantidad (parada o finalización).

#### Scenario: Botón Registrar Parada deshabilitado sin operario
- **WHEN** hay delta a reportar pero no hay operario seleccionado
- **THEN** el botón "Registrar Parada" está deshabilitado

#### Scenario: Botón Finalizar deshabilitado sin operario
- **WHEN** input === cantidad pero no hay operario seleccionado
- **THEN** el botón "Finalizar" está deshabilitado

#### Scenario: Finalizar sin cantidad no requiere operario
- **WHEN** no hay input de cantidad (cantidadRegistrada === cantidad, delta=0)
- **THEN** el botón "Finalizar" está habilitado sin requerir operario
- **AND** el selector de operarios no se muestra

#### Scenario: Operario asignado al proceso no disponible
- **WHEN** el proceso no tiene operarios asignados (`operarioXProcesoXTarjetas` vacío)
- **THEN** el select se muestra deshabilitado con texto "Sin operarios asignados"
- **AND** los botones de parada y finalización se deshabilitan

### Requirement: Envío de operarioId en acciones

El sistema DEBE enviar `operarioId` en el body de las peticiones POST cuando se reporta cantidad.

#### Scenario: RegistrarParada envía operarioId
- **WHEN** el operario hace clic en "Guardar" en el formulario de parada
- **THEN** se llama a `POST /proceso-x-tarjeta/{id}/registrar-parada` con body `{ cantidadReportada, codigoDeParadaId, operarioId }`

#### Scenario: Finalizar con cantidad envía operarioId
- **WHEN** el operario hace clic en "Finalizar" con cantidad === total
- **THEN** se llama a `POST /proceso-x-tarjeta/{id}/finalizar` con body `{ cantidadReportada, operarioId }`

#### Scenario: Finalizar sin cantidad no envía operarioId
- **WHEN** el operario hace clic en "Finalizar" sin cantidad a reportar
- **THEN** se llama a `POST /proceso-x-tarjeta/{id}/finalizar` con body `{}` (sin operarioId)
