## ADDED Requirements

### Requirement: Card clickeable abre modal de detalle

Toda card en el tablero Kanban DEBE ser clickeable. Al hacer clic, DEBE abrir un modal con la lista completa de procesos de la tarjeta ordenados por `orden ASC`.

#### Scenario: Clic en card por_hacer abre modal
- **WHEN** el usuario hace clic en una card en estado `por_hacer`
- **THEN** se abre un modal mostrando todos los procesos de la tarjeta

#### Scenario: Clic en card en ejecución abre modal
- **WHEN** el usuario hace clic en una card en estado `en ejecución`
- **THEN** se abre un modal mostrando todos los procesos de la tarjeta

### Requirement: Modal muestra lista de procesos con su estado

El modal DEBE mostrar cada proceso con: nombre del proceso, tiempo estimado, operario asignado, y un indicador visual de su estado (pendiente, en curso, completado).

#### Scenario: Modal muestra procesos ordenados
- **WHEN** se abre el modal de una tarjeta con 3 procesos
- **THEN** los procesos se muestran en orden ascendente (1, 2, 3)
- **AND** cada proceso muestra nombre, tiempo, operario y estado

#### Scenario: Indicador visual de estado
- **WHEN** un proceso no tiene `fechaInicio`
- **THEN** se muestra como "Pendiente" (color gris)
- **WHEN** un proceso tiene `fechaInicio` pero no `fechaFinal`
- **THEN** se muestra como "En curso" (color amarillo)
- **WHEN** un proceso tiene `fechaInicio` y `fechaFinal`
- **THEN** se muestra como "Completado" (color verde)

### Requirement: Botón "Iniciar proceso" para el próximo pendiente

El modal DEBE mostrar un botón "Iniciar proceso" solo para el primer proceso pendiente (sin `fechaInicio`, con el `orden` más bajo). Al hacer clic, DEBE llamar a `POST /proceso-x-tarjeta/{id}/iniciar`.

#### Scenario: Botón Iniciar visible para próximo proceso
- **WHEN** la tarjeta tiene procesos pendientes
- **THEN** el primer proceso pendiente tiene botón "Iniciar proceso" habilitado

#### Scenario: Botón Iniciar inicia el proceso
- **WHEN** el usuario hace clic en "Iniciar proceso"
- **THEN** se llama al endpoint `POST /proceso-x-tarjeta/{id}/iniciar`
- **AND** el modal se cierra
- **AND** el tablero Kanban se refresca
- **AND** la card ahora aparece en la columna "En ejecución"

### Requirement: Botón "Finalizar proceso" para el proceso en curso

El modal DEBE mostrar un botón "Finalizar proceso" solo para el proceso actualmente en ejecución (con `fechaInicio` sin `fechaFinal`). Al hacer clic, DEBE llamar a `POST /proceso-x-tarjeta/{id}/finalizar`.

#### Scenario: Botón Finalizar visible para proceso en curso
- **WHEN** hay un proceso con `fechaInicio` y sin `fechaFinal`
- **THEN** ese proceso tiene botón "Finalizar proceso" habilitado

#### Scenario: Botón Finalizar finaliza proceso y refresca
- **WHEN** el usuario hace clic en "Finalizar proceso"
- **THEN** se llama al endpoint `POST /proceso-x-tarjeta/{id}/finalizar`
- **AND** el modal se cierra
- **AND** el tablero Kanban se refresca

#### Scenario: Al finalizar el último proceso la card pasa a finalizada
- **WHEN** se finaliza el último proceso de la tarjeta
- **THEN** el tablero Kanban muestra la card en la columna "Finalizadas"

#### Scenario: Al finalizar un proceso no último la card vuelve a por_hacer
- **WHEN** se finaliza un proceso y quedan más procesos pendientes
- **THEN** el tablero Kanban muestra la card en la columna "Por hacer"
- **AND** el operario mostrado ahora es el del siguiente proceso

### Requirement: Botones deshabilitados para procesos no accionables

Los procesos que no sean el próximo pendiente ni el actual en curso DEBEN mostrar su botón deshabilitado (con estilo visual "bloqueado") y sin posibilidad de clic.

#### Scenario: Procesos completados muestran botón deshabilitado
- **WHEN** un proceso ya tiene `fechaFinal`
- **THEN** su botón se muestra deshabilitado con texto "Completado"

#### Scenario: Procesos futuros muestran botón deshabilitado
- **WHEN** un proceso está pendiente pero no es el próximo (hay un proceso anterior sin iniciar)
- **THEN** su botón se muestra deshabilitado con texto "Bloqueado"

### Requirement: Refresco del tablero post-acción

Después de cualquier acción de iniciar o finalizar un proceso, el tablero Kanban DEBE recargar todas las tarjetas para reflejar el nuevo estado.

#### Scenario: Tablero se refresca después de iniciar
- **WHEN** se completa la llamada a `iniciar`
- **THEN** `cargarTarjetas()` se ejecuta
- **AND** la card se mueve a la columna correspondiente

#### Scenario: Tablero se refresca después de finalizar
- **WHEN** se completa la llamada a `finalizar`
- **THEN** `cargarTarjetas()` se ejecuta
- **AND** la card se mueve a la columna correspondiente
