## MODIFIED Requirements

### Requirement: Botón "Registrar Parada" en proceso activo

Cuando un proceso está activo (tiene `fechaInicio` y NO tiene `fechaFinal`), DEBE mostrar un botón "Registrar Parada". El botón se habilita solo si la cantidad ingresada en el input es mayor a `cantidadRegistrada` y menor a la cantidad total del proceso, sin exceder el máximo permitido por el proceso anterior.

#### Scenario: Botón visible en proceso activo con cantidad parcial
- **WHEN** un proceso está activo y el input muestra 70 < 100
- **THEN** el botón "Registrar Parada" está visible y habilitado

#### Scenario: Botón oculto si cantidad igual a total
- **WHEN** un proceso está activo y el input muestra 100 === 100
- **THEN** el botón "Registrar Parada" NO está visible
- **AND** el botón "Finalizar" está habilitado

#### Scenario: Botón oculto si input igual a cantidadRegistrada
- **WHEN** un proceso está activo y el input es igual a `cantidadRegistrada`
- **THEN** el botón "Registrar Parada" no está visible
