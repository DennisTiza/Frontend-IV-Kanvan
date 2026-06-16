## ADDED Requirements

### Requirement: Validación de límite contra proceso anterior

El input de cantidad DEBE validar que el valor ingresado no supere la cantidad registrada del proceso anterior (`getMaxPermitido`). Si el usuario ingresa un valor mayor, DEBE mostrar un modal de advertencia y NO DEBE actualizar el valor del input.

#### Scenario: Usuario ingresa valor dentro del límite
- **WHEN** el usuario escribe un valor <= `getMaxPermitido`
- **THEN** el valor se actualiza normalmente en el input
- **AND** no se muestra ningún modal de advertencia

#### Scenario: Usuario ingresa valor que excede el límite
- **WHEN** el usuario escribe un valor > `getMaxPermitido` (ej: 50 cuando el proceso anterior tiene 30)
- **THEN** se muestra un modal con el mensaje "No se puede colocar una cantidad mayor a la del proceso anterior"
- **AND** el valor del input NO se actualiza, mantiene el valor anterior

#### Scenario: Usuario cierra el modal de advertencia
- **WHEN** el modal de advertencia está visible
- **THEN** el usuario puede cerrarlo haciendo clic en "Aceptar" o en el overlay
- **AND** el input mantiene su valor anterior

## MODIFIED Requirements

### Requirement: Botón "Finalizar proceso" con cantidad condicional

El modal DEBE mostrar un botón "Finalizar proceso" solo cuando el input de cantidad === `cantidad` total del proceso. Al hacer clic, DEBE llamar a `POST /proceso-x-tarjeta/{id}/finalizar` con body `{ cantidadReportada: cantidad - cantidadRegistrada }`.

#### Scenario: Botón Finalizar visible cuando cantidad completa
- **WHEN** un proceso activo tiene input de cantidad = su propia cantidad total (ej: 100/100)
- **THEN** el botón "Finalizar" está habilitado
- **AND** "Registrar Parada" está deshabilitado

#### Scenario: Botón Finalizar NO visible cuando cantidad es menor al total
- **WHEN** un proceso activo tiene input de cantidad = 30 pero su cantidad total es 100
- **THEN** el botón "Finalizar" NO está habilitado (el proceso aún no está completo)
- **AND** "Registrar Parada" está habilitado si el input > cantidadRegistrada

#### Scenario: Botón Finalizar envía cantidadReportada
- **WHEN** el operario hace clic en "Finalizar" con cantidad = total
- **THEN** se llama a `POST /proceso-x-tarjeta/{id}/finalizar` con `{ cantidadReportada: delta }`

#### Scenario: Finalizar proceso y refrescar tablero
- **WHEN** se completa la llamada a finalizar
- **THEN** el modal se cierra
- **AND** el tablero Kanban se refresca
- **AND** si todos los procesos están completos, la tarjeta pasa a "Finalizadas"
