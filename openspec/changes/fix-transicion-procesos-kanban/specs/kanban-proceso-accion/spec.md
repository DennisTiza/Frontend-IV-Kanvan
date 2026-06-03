## MODIFIED Requirements

### Requirement: Botón "Iniciar proceso" para el próximo pendiente

El modal DEBE mostrar un botón "Iniciar proceso" solo para el primer proceso pendiente, y SOLO si no existe un proceso activo en la tarjeta (ningún proceso con `fechaInicio` sin `fechaFinal`). Si existe un proceso activo, ningún proceso DEBE mostrar botón "Iniciar". Al hacer clic, DEBE llamar a `POST /proceso-x-tarjeta/{id}/iniciar`.

#### Scenario: Botón Iniciar visible cuando no hay activo
- **WHEN** la tarjeta tiene procesos pendientes y NO hay proceso activo
- **THEN** el primer proceso pendiente tiene botón "Iniciar proceso" habilitado

#### Scenario: Botón Iniciar NO visible cuando hay proceso activo
- **WHEN** la tarjeta tiene un proceso activo (fechaInicio sin fechaFinal)
- **THEN** ningún proceso muestra botón "Iniciar proceso"
- **AND** el proceso activo muestra "Finalizar proceso"
- **AND** los procesos pendientes muestran "Bloqueado"

### Requirement: Botones deshabilitados para procesos no accionables

Los procesos que no sean accionables DEBEN mostrar su botón deshabilitado (con estilo visual "bloqueado") y sin posibilidad de clic. Un proceso pendiente NO es accionable si existe otro proceso activo en la misma tarjeta.

#### Scenario: Procesos completados muestran botón deshabilitado
- **WHEN** un proceso ya tiene `fechaFinal`
- **THEN** su botón se muestra deshabilitado con texto "Completado"

#### Scenario: Procesos futuros bloqueados por proceso activo
- **WHEN** existe un proceso activo en la tarjeta
- **THEN** los procesos pendientes muestran botón deshabilitado con texto "Bloqueado"

#### Scenario: Procesos futuros bloqueados por orden
- **WHEN** no hay proceso activo pero hay un proceso anterior pendiente
- **THEN** los procesos posteriores muestran botón deshabilitado con texto "Bloqueado"
