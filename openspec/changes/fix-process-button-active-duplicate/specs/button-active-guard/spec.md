## ADDED Requirements

### Requirement: Iniciar button hidden when process is active
The "▶ Iniciar" / "▶ Reanudar" button SHALL NOT be visible when a process has `fechaInicio` set and `fechaFinal` is not set (process is currently running).

#### Scenario: Process already started
- **WHEN** a process has `fechaInicio` set and `fechaFinal` is null/undefined
- **THEN** the "▶ Iniciar" and "▶ Reanudar" buttons SHALL be hidden
- **THEN** the "⏸ Registrar Parada" button SHALL be visible
- **THEN** the "Finalizar" button SHALL be visible (if input equals cantidad)

### Requirement: registrarParada emits event with full data
The `registrarParada` method SHALL send the API request through the parent component via `procesoAccion` output, including `cantidadReportada` and `codigoDeParadaId` in the event payload. It SHALL NOT call the service directly.

#### Scenario: Register a parada
- **WHEN** user selects a stop code and clicks "Guardar" in the parada form
- **THEN** `procesoAccion` emits with `{ tipo: 'registrar-parada', procesoId, cantidadReportada, codigoDeParadaId }`
- **THEN** no direct `RegistrarParada` service call is made from the component
- **THEN** the parent handles the API call and refreshes data
- **THEN** no 422 error occurs
