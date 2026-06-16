## ADDED Requirements

### Requirement: Modal de detalle muestra countdown en vivo por proceso activo

El modal de detalle de tarjeta DEBE mostrar un countdown en vivo (HH:MM:SS) del tiempo restante para cada proceso activo (con `fechaInicio` y sin `fechaFinal`). El countdown DEBE actualizarse cada segundo. No DEBE mostrarse para procesos completados o pendientes.

#### Scenario: Proceso activo muestra countdown
- **WHEN** un proceso tiene `fechaInicio`, sin `fechaFinal`, y `tiempo=30`
- **AND** se abrió el modal de detalle
- **THEN** se muestra "⏱ HH:MM:SS" junto al tiempo estimado
- **AND** el valor decrece cada segundo

#### Scenario: Proceso sin fechaInicio no muestra countdown
- **WHEN** un proceso no tiene `fechaInicio`
- **THEN** no se muestra ningún countdown para ese proceso

#### Scenario: Proceso completado no muestra countdown
- **WHEN** un proceso tiene `fechaFinal`
- **THEN** no se muestra ningún countdown para ese proceso

#### Scenario: Múltiples procesos activos muestran sus countdowns
- **WHEN** dos procesos están activos simultáneamente
- **THEN** cada uno muestra su propio countdown independiente

#### Scenario: Countdown llega a 00:00:00
- **WHEN** el tiempo restante del proceso llega a 0
- **THEN** el countdown muestra "00:00:00"
- **AND** no muestra valores negativos
