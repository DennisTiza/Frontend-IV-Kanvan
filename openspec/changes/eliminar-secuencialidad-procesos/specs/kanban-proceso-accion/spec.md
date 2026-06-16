## MODIFIED Requirements

### Requirement: Botón "Iniciar proceso" para el próximo pendiente

El modal DEBE mostrar un botón "Iniciar proceso" para **cada** proceso pendiente (sin `fechaInicio` y con `cantidadRegistrada < cantidad`). Ya no se limita al "próximo" proceso según orden. Al hacer clic, DEBE llamar a `POST /proceso-x-tarjeta/{id}/iniciar`.

#### Scenario: Botón Iniciar visible para todo proceso pendiente
- **WHEN** la tarjeta tiene múltiples procesos pendientes sin `fechaInicio`
- **THEN** cada uno de ellos tiene su propio botón "Iniciar" habilitado

#### Scenario: Botón Iniciar inicia el proceso
- **WHEN** el usuario hace clic en "Iniciar proceso"
- **THEN** se llama al endpoint `POST /proceso-x-tarjeta/{id}/iniciar`
- **AND** el modal se cierra
- **AND** el tablero Kanban se refresca

#### Scenario: Botón deshabilitado si el proceso ya está completo
- **WHEN** un proceso tiene `cantidadRegistrada >= cantidad`
- **THEN** el botón Iniciar está deshabilitado

### Requirement: Botones deshabilitados para procesos no accionables

Los procesos que no tengan botones de acción habilitados DEBEN mostrar su botón deshabilitado con estilo visual y texto descriptivo. El estado "Bloqueado" ya no existe.

#### Scenario: Procesos completados muestran botón deshabilitado
- **WHEN** un proceso ya tiene `fechaFinal`
- **THEN** su botón se muestra deshabilitado con texto "Completado"

#### Scenario: Proceso sin acciones porque el input no cumple condiciones
- **WHEN** un proceso está activo pero el input del operario no alcanza para Registrar Parada ni Finalizar
- **THEN** no se muestra ningún botón de acción (el proceso sigue en curso)
