## MODIFIED Requirements

### Requirement: Modal muestra lista de procesos con su estado

El modal DEBE mostrar cada proceso con: nombre del proceso, tiempo estimado, tiempo consumido acumulado, operario asignado, y un indicador visual de su estado (pendiente, en curso, pausado, completado).

#### Scenario: Modal muestra procesos ordenados
- **WHEN** se abre el modal de una tarjeta con 3 procesos
- **THEN** los procesos se muestran en orden ascendente (1, 2, 3)
- **AND** cada proceso muestra nombre, tiempo, tiempo consumido, operario y estado

#### Scenario: Indicador visual de estado — Pausado
- **WHEN** un proceso no tiene `fechaInicio`, no tiene `fechaFinal`, y tiene `cantidadRegistrada > 0`
- **THEN** se muestra como "Pausado" (color azul)

#### Scenario: Indicador visual de estado — En curso
- **WHEN** un proceso tiene `fechaInicio` pero no `fechaFinal`
- **THEN** se muestra como "En curso" (color amarillo)

#### Scenario: Indicador visual de estado — Completado
- **WHEN** un proceso tiene `fechaInicio` y `fechaFinal`
- **THEN** se muestra como "Completado" (color verde)

#### Scenario: Indicador visual de estado — Pendiente
- **WHEN** un proceso no tiene `fechaInicio`, no tiene `fechaFinal`, y `cantidadRegistrada = 0`
- **THEN** se muestra como "Pendiente" (color gris)

### Requirement: Botón "Iniciar / Reanudar proceso"

El modal DEBE mostrar un botón "▶ Iniciar" para el primer proceso pendiente (sin `fechaInicio`, `cantidadRegistrada = 0`), o "▶ Reanudar" para un proceso pausado (sin `fechaInicio`, `cantidadRegistrada > 0`). El botón NO DEBE mostrarse para procesos activos (con `fechaInicio` y sin `fechaFinal`). Al hacer clic, DEBE llamar a `POST /proceso-x-tarjeta/{id}/iniciar`.

#### Scenario: Botón "Iniciar" visible para próximo proceso pendiente
- **WHEN** la tarjeta tiene procesos sin `fechaInicio` y con `cantidadRegistrada = 0`
- **THEN** el primer proceso pendiente tiene botón "▶ Iniciar" habilitado

#### Scenario: Botón "Reanudar" visible para proceso pausado
- **WHEN** un proceso tiene `fechaInicio = null`, `fechaFinal = null`, y `cantidadRegistrada > 0`
- **THEN** el proceso tiene botón "▶ Reanudar" habilitado

#### Scenario: Botón oculto para proceso activo
- **WHEN** un proceso tiene `fechaInicio` seteado y no tiene `fechaFinal`
- **THEN** el botón Iniciar/Reanudar NO se muestra

#### Scenario: Botón invisible para proceso bloqueado por proceso anterior
- **WHEN** el proceso anterior tiene `cantidadRegistrada = 0` y el proceso actual está pendiente
- **THEN** el botón no se muestra y se ve "Bloqueado" con tooltip

#### Scenario: Iniciar procesos inicia/reanuda y refresca
- **WHEN** el usuario hace clic en "Iniciar" o "Reanudar"
- **THEN** se llama al endpoint `POST /proceso-x-tarjeta/{id}/iniciar`
- **AND** el modal se cierra
- **AND** el tablero Kanban se refresca

### Requirement: Botón "Registrar Parada" para procesos activos

El modal DEBE mostrar un botón "⏸ Registrar Parada" para el proceso actualmente activo (con `fechaInicio` y sin `fechaFinal`) cuando el valor ingresado sea mayor a `cantidadRegistrada` y menor al máximo permitido. Al hacer clic, DEBE abrir un formulario para seleccionar el código de parada.

#### Scenario: Botón Registrar Parada visible para proceso activo
- **WHEN** hay un proceso con `fechaInicio` y sin `fechaFinal` y con cantidad procesada > 0 y < maxPermitido
- **THEN** ese proceso tiene botón "⏸ Registrar Parada" habilitado

#### Scenario: Botón Registrar Parada abre formulario
- **WHEN** el usuario hace clic en "⏸ Registrar Parada"
- **THEN** se despliega un formulario con selector de código de parada
- **AND** el botón "▶ Reanudar" NO se muestra mientras el formulario está abierto

### Requirement: Botón "Finalizar proceso" para proceso activo o pausado

El modal DEBE mostrar un botón "Finalizar" para el proceso actualmente en ejecución (con `fechaInicio` sin `fechaFinal`) o en pausa (sin `fechaInicio` pero con `cantidadRegistrada > 0`), cuando la cantidad ingresada sea igual al máximo permitido.

#### Scenario: Botón Finalizar visible para proceso activo completado
- **WHEN** hay un proceso activo con cantidad ingresada = máximo permitido
- **THEN** ese proceso tiene botón "Finalizar" habilitado

#### Scenario: Botón Finalizar visible para proceso pausado completado
- **WHEN** hay un proceso pausado con cantidad ingresada = máximo permitido
- **THEN** ese proceso tiene botón "Finalizar" habilitado

#### Scenario: Botón Finalizar finaliza proceso y refresca
- **WHEN** el usuario hace clic en "Finalizar"
- **THEN** se llama al endpoint `POST /proceso-x-tarjeta/{id}/finalizar` con `cantidadReportada`
- **AND** el modal se cierra
- **AND** el tablero Kanban se refresca

### Requirement: Timer countdown multi-sesión

La card Kanban DEBE mostrar un countdown del tiempo restante estimado que acumule tiempo consumido a través de múltiples sesiones (inicio → parada → reanudar → ... → finalizar). El timer DEBE usar la fórmula `restante = (tiempo * 60 * 1000) - (tiempoConsumido + sesionActiva) * 1000`.

#### Scenario: Timer corre durante sesión activa
- **WHEN** un proceso tiene `fechaInicio` y el countdown está activo
- **THEN** el timer descuenta en vivo usando `tiempoConsumido + (ahora - fechaInicio) / 1000`

#### Scenario: Timer se detiene durante parada
- **WHEN** el proceso tiene `fechaInicio = null` (después de una parada)
- **THEN** el timer se detiene y no se muestra en la card

#### Scenario: Timer continúa desde donde se pausó al reanudar
- **WHEN** un proceso se reanuda después de una parada
- **THEN** el countdown muestra el mismo tiempo restante que tenía antes de la parada (no se reinicia)

#### Scenario: Timer no se muestra para proceso finalizado
- **WHEN** `fechaFinal` está seteado
- **THEN** la card no muestra el timer

## ADDED Requirements

### Requirement: Restricción cruzada de cantidad entre procesos

El valor máximo del input de cantidad para un proceso N DEBE ser `min(cantidadRegistrada del proceso N-1, cantidad del proceso N)`. Para el primer proceso, DEBE ser su propia `cantidad`.

#### Scenario: Input máximo limitado por proceso anterior
- **WHEN** el proceso N-1 tiene `cantidadRegistrada = 50` y el proceso N tiene `cantidad = 100`
- **THEN** el input del proceso N tiene `max = 50`

#### Scenario: Primer proceso no tiene restricción
- **WHEN** es el primer proceso de la tarjeta
- **THEN** su input `max = cantidad`

### Requirement: Mostrar unidades restantes

El modal DEBE mostrar junto al progreso `X/Y (Z restantes)` donde `restantes = cantidad - cantidadRegistrada`.

#### Scenario: Progreso muestra restantes
- **WHEN** un proceso tiene `cantidad = 100` y `cantidadRegistrada = 30`
- **THEN** se muestra `30/100 (70 restantes)`

### Requirement: Separación visual entre botones de acción

Los botones de acción en el modal DEBEN tener espaciado uniforme entre sí.

#### Scenario: Botones espaciados
- **WHEN** el modal muestra múltiples botones de acción
- **THEN** hay al menos 8px de separación entre cada botón
