## MODIFIED Requirements

### Requirement: Modal muestra lista de procesos con su estado

El modal DEBE mostrar cada proceso con: nombre del proceso, tiempo estimado, operario asignado, barra de progreso de cantidad, y un indicador visual de su estado (pendiente, en curso, en pausa, completado).

#### Scenario: Modal muestra procesos ordenados
- **WHEN** se abre el modal de una tarjeta con 3 procesos
- **THEN** los procesos se muestran en orden ascendente (1, 2, 3)
- **AND** cada proceso muestra nombre, tiempo, operario, barra de cantidad y estado

#### Scenario: Indicador visual de estado
- **WHEN** un proceso no tiene `fechaInicio`
- **THEN** se muestra como "Pendiente" (color gris, barra 0%)
- **WHEN** un proceso tiene `fechaInicio` pero no `fechaFinal` y `cantidadRegistrada === 0`
- **THEN** se muestra como "En curso" (color amarillo)
- **WHEN** un proceso tiene `fechaInicio`, no tiene `fechaFinal` y `cantidadRegistrada > 0`
- **THEN** se muestra como "En curso" con indicador visual de que tiene avance (barra > 0%)
- **WHEN** un proceso tiene `fechaInicio`, no tiene `fechaFinal` y tiene paradas registradas
- **THEN** se muestra como "En curso" con indicador ⚠️ y sección expandible de paradas
- **WHEN** un proceso tiene `fechaInicio` y `fechaFinal`
- **THEN** se muestra como "Completado" (color verde, barra 100%)

### Requirement: Botón "Iniciar/Reanudar proceso" condicional

El modal DEBE mostrar un botón "▶ Iniciar" o "▶ Reanudar" según el estado del proceso. 

- "▶ Iniciar": Cuando el proceso no tiene `fechaInicio` y `cantidadRegistrada === 0`
- "▶ Reanudar": Cuando el proceso tiene `fechaInicio`, no tiene `fechaFinal`, y `cantidadRegistrada > 0`
- Ambos casos llaman al mismo `POST /proceso-x-tarjeta/{id}/iniciar`
- Se deshabilita cuando `cantidadRegistrada === cantidad` (proceso completo)

El botón DEBE habilitarse solo si:
- El proceso es orden 1 (primer proceso)
- O el proceso anterior tiene `cantidadRegistrada > 0`
- O el proceso actual ya fue iniciado antes (tiene `fechaInicio`)
- O el proceso anterior no existe

Si está deshabilitado por secuencialidad, DEBE mostrar un tooltip: "Completa o registra avance en el proceso anterior".

#### Scenario: Botón Iniciar para primer proceso pendiente
- **WHEN** el primer proceso (orden 1) no tiene `fechaInicio`
- **THEN** el botón muestra "▶ Iniciar" habilitado

#### Scenario: Botón Reanudar para proceso con parada
- **WHEN** un proceso tiene `fechaInicio`, sin `fechaFinal`, y `cantidadRegistrada: 40`
- **THEN** el botón muestra "▶ Reanudar" habilitado

#### Scenario: Botón deshabilitado cuando proceso completo
- **WHEN** un proceso tiene `cantidadRegistrada === cantidad`
- **THEN** el botón Iniciar/Reanudar está deshabilitado

#### Scenario: Botón bloqueado por secuencialidad
- **WHEN** proceso orden 2 y proceso orden 1 tiene `cantidadRegistrada: 0`
- **THEN** el botón muestra "🔒 Bloqueado" con tooltip

#### Scenario: Botón habilitado por avance del anterior
- **WHEN** proceso orden 2 y proceso orden 1 tiene `cantidadRegistrada: 70`
- **THEN** el botón muestra "▶ Iniciar" habilitado

#### Scenario: Iniciar/Reanudar refresca el tablero
- **WHEN** el operario hace clic en "▶ Iniciar" o "▶ Reanudar"
- **THEN** se llama a `POST /proceso-x-tarjeta/{id}/iniciar`
- **AND** el modal se cierra
- **AND** el tablero Kanban se refresca

### Requirement: Botón "Finalizar proceso" con cantidad condicional

El modal DEBE mostrar un botón "Finalizar proceso" solo cuando `cantidadRegistrada === cantidad`. Al hacer clic, DEBE llamar a `POST /proceso-x-tarjeta/{id}/finalizar` con body `{ cantidadReportada: cantidad - cantidadRegistrada }`.

#### Scenario: Botón Finalizar visible cuando cantidad completa
- **WHEN** un proceso activo tiene input de cantidad = total (ej: 100/100)
- **THEN** el botón "Finalizar" está habilitado
- **AND** "Registrar Parada" está deshabilitado

#### Scenario: Botón Finalizar envía cantidadReportada
- **WHEN** el operario hace clic en "Finalizar" con cantidad = total
- **THEN** se llama a `POST /proceso-x-tarjeta/{id}/finalizar` con `{ cantidadReportada: delta }`

#### Scenario: Finalizar proceso y refrescar tablero
- **WHEN** se completa la llamada a finalizar
- **THEN** el modal se cierra
- **AND** el tablero Kanban se refresca
- **AND** si todos los procesos están completos, la tarjeta pasa a "Finalizadas"

### Requirement: Botones deshabilitados para procesos no accionables

Los procesos que no tengan botones habilitados DEBEN mostrar su botón deshabilitado con estilo visual y texto descriptivo.

#### Scenario: Procesos completados muestran botón deshabilitado
- **WHEN** un proceso ya tiene `fechaFinal`
- **THEN** su botón se muestra deshabilitado con texto "Completado"

#### Scenario: Procesos bloqueados muestran tooltip
- **WHEN** un proceso está pendiente pero no cumple condiciones de secuencialidad
- **THEN** su botón se muestra deshabilitado con texto "Bloqueado"
- **AND** al hacer hover muestra tooltip "Completa o registra avance en el proceso anterior"

## ADDED Requirements

### Requirement: Refresco del tablero post-acción incluye nuevas acciones

Después de cualquier acción (iniciar, reanudar, registrar parada, finalizar), el tablero Kanban DEBE recargar todas las tarjetas para reflejar el nuevo estado. La clasificación en columnas ahora considera `cantidadRegistrada`:

- "En ejecución": tarjetas donde al menos un proceso tiene `fechaInicio` sin `fechaFinal`
- "Finalizadas": tarjetas donde todos los procesos tienen `cantidadRegistrada === cantidad`
- "Por hacer": todo lo demás

#### Scenario: Tablero refresca después de registrar parada
- **WHEN** se completa la llamada a `registrar-parada`
- **THEN** `cargarTarjetas()` se ejecuta
- **AND** la tarjeta permanece en "En ejecución"

#### Scenario: Tarjeta pasa a Finalizadas por cantidad
- **WHEN** todos los procesos tienen `cantidadRegistrada === cantidad`
- **THEN** el tablero muestra la tarjeta en columna "Finalizadas"
- **AND** ya no es necesario que todos tengan `fechaFinal`
