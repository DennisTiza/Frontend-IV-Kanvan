## MODIFIED Requirements

### Requirement: Botón "Registrar Parada" en proceso activo

Cuando un proceso está activo (tiene `fechaInicio` y NO tiene `fechaFinal`), DEBE mostrar un botón "Registrar Parada". El botón se habilita si la cantidad ingresada en el input es mayor a `cantidadRegistrada` y menor o igual a `getMaxPermitido()`.

#### Scenario: Botón visible cuando input iguala al máximo permitido
- **WHEN** un proceso P2 tiene `cantidadRegistrada=0` y el proceso anterior P1 tiene `cantidadRegistrada=20`
- **AND** el operario ingresa 20 en el input de P2
- **THEN** el botón "Registrar Parada" está visible y habilitado

#### Scenario: Botón visible en proceso activo con cantidad parcial menor al máximo
- **WHEN** un proceso está activo y el input muestra 15, siendo `cantidadRegistrada=0` y `maxPermitido=20`
- **THEN** el botón "Registrar Parada" está visible y habilitado

#### Scenario: Botón deshabilitado si input igual a cantidadRegistrada
- **WHEN** un proceso está activo y el input es igual a `cantidadRegistrada` (sin nuevo avance)
- **THEN** el botón "Registrar Parada" está deshabilitado
