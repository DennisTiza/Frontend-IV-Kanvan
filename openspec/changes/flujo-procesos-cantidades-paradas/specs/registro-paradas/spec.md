## ADDED Requirements

### Requirement: Botón "Registrar Parada" en proceso activo

Cuando un proceso está activo (tiene `fechaInicio` y NO tiene `fechaFinal`), DEBE mostrar un botón "Registrar Parada". El botón se habilita solo si la cantidad ingresada en el input es menor que la cantidad total del proceso.

#### Scenario: Botón visible en proceso activo con cantidad parcial
- **WHEN** un proceso está activo y el input muestra 70 < 100
- **THEN** el botón "Registrar Parada" está visible y habilitado

#### Scenario: Botón deshabilitado si cantidad igual a total
- **WHEN** un proceso está activo y el input muestra 100 === 100
- **THEN** el botón "Registrar Parada" está deshabilitado
- **AND** el botón "Finalizar" está habilitado

### Requirement: Formulario inline de parada con código

Al hacer clic en "Registrar Parada", el proceso DEBE expandirse inline (sin modal anidado) mostrando:
- Texto "Unidades procesadas: [cantidad] unidades"
- Selector de código de parada (cargado desde `GET /codigo-de-parada`)
- Botones "Cancelar" y "Guardar"
- La cantidad DEBE tomar el valor actual del input del proceso

#### Scenario: Expandir formulario de parada
- **WHEN** el operario hace clic en "Registrar Parada" con cantidad 70
- **THEN** se expande el formulario inline
- **AND** el campo unidades muestra "70"
- **AND** el selector de código está vacío (sin selección)

#### Scenario: Guardar parada con código
- **WHEN** el operario selecciona "Mantenimiento" y hace clic en "Guardar"
- **THEN** se llama a `POST /proceso-x-tarjeta/{id}/registrar-parada` con `{ cantidadReportada: 30, codigoDeParadaId: 2 }`
- **AND** el modal se cierra
- **AND** el tablero se refresca
- **AND** la tarjeta sigue en "En ejecución"

#### Scenario: Cancelar formulario de parada
- **WHEN** el operario hace clic en "Cancelar"
- **THEN** el formulario se colapsa
- **AND** no se llama a ningún endpoint

### Requirement: Selector de códigos de parada

El selector de código de parada DEBE cargar la lista de códigos desde `GET /codigo-de-parada` y mostrar el campo `descripcion` como texto visible y el `id` como valor. DEBE tener una opción por defecto "Seleccionar código de parada..." con valor vacío.

#### Scenario: Carga códigos de parada
- **WHEN** se abre el formulario de parada
- **THEN** el selector contiene las opciones del endpoint
- **AND** la primera opción es "Seleccionar código de parada..."

#### Scenario: Selección de código
- **WHEN** el operario selecciona "Mantenimiento" del selector
- **THEN** el `codigoDeParadaId` se establece en el id correspondiente

### Requirement: Histórico de paradas visible por proceso

Cada proceso DEBE mostrar un botón o indicador para ver el histórico de paradas registradas. Al hacer clic, DEBE expandirse una lista con las paradas del proceso obtenidas de `GET /proceso-x-tarjeta/{id}/paradas`, mostrando: hora, código de parada, cantidad reportada.

#### Scenario: Ver histórico de paradas
- **WHEN** el operario hace clic en el indicador de paradas de un proceso
- **THEN** se expande la lista con todas las paradas del proceso
- **AND** cada parada muestra hora, código y cantidad

#### Scenario: Proceso sin paradas no muestra indicador
- **WHEN** un proceso no tiene paradas registradas
- **THEN** no se muestra el indicador ni el botón de histórico

### Requirement: Indicador visual de paradas en KanbanCard

La KanbanCard DEBE mostrar un indicador ⚠️ junto al nombre del proceso que tiene paradas registradas. El indicador DEBE ser visible tanto en la columna "En ejecución" como en "Por hacer" si el proceso tiene paradas previas.

#### Scenario: KanbanCard muestra ⚠️ en proceso con paradas
- **WHEN** un proceso tiene `cantidadRegistrada > 0` y no tiene `fechaFinal`
- **AND** tiene al menos una parada registrada
- **THEN** la card muestra ⚠️ junto al nombre del proceso
