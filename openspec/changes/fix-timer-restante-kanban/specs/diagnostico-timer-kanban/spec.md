## ADDED Requirements

### Requirement: Inspeccionar valores del timer en tarjeta en ejecución

El sistema DEBE loguear en consola del navegador los valores internos del timer cada vez que `actualizarTiempo()` se ejecuta en una tarjeta kanban con proceso activo, para permitir diagnosticar por qué el tiempo restante no se calcula correctamente.

#### Scenario: Logging en actualizarTiempo con proceso activo

- **WHEN** `actualizarTiempo()` se ejecuta y existe un `procesoActivo` con `fechaInicio` y `tiempo` definidos
- **THEN** se debe loguear en consola: `procesoActivo.tiempo`, `procesoActivo.fechaInicio`, `inicio` (timestamp), `ahora` (timestamp), `estimadoMs`, `transcurrido`, `restante`, `progreso`

#### Scenario: Logging cuando no hay proceso activo o faltan datos

- **WHEN** `actualizarTiempo()` se ejecuta pero `procesoActivo` es `undefined`, no tiene `fechaInicio`, o no tiene `tiempo`
- **THEN** se debe loguear en consola que la función retornó temprano, indicando qué condición falló

#### Scenario: Logging en inicio del temporizador

- **WHEN** `ngOnInit()` detecta un proceso activo e inicia el temporizador
- **THEN** se debe loguear en consola que el temporizador se inició, con el ID del proceso activo

#### Scenario: No hay logs en tarjetas sin proceso activo

- **WHEN** una tarjeta kanban se renderiza y `obtenerProcesoActivo()` retorna `undefined`
- **THEN** no se debe loguear nada relacionado al timer (sin ruido en consola para tarjetas en "Por hacer" o "Finalizadas")
