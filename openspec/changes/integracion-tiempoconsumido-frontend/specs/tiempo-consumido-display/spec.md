## ADDED Requirements

### Requirement: Mostrar tiempo real consumido en la card Kanban

La card Kanban DEBE mostrar el tiempo real trabajado (acumulado multi-sesión) para el proceso activo o pausado. El tiempo DEBE calcularse como `tiempoConsumido + sesiónActiva` (donde `sesiónActiva = (ahora - fechaInicio) / 1000`). Cuando el proceso está pausado o finalizado, DEBE mostrar solo `tiempoConsumido`.

#### Scenario: Card muestra tiempo consumido de proceso activo
- **WHEN** un proceso tiene `fechaInicio` seteado y no tiene `fechaFinal`
- **THEN** la card muestra el tiempo consumido calculado como `(tiempoConsumido ?? 0) + (ahora - fechaInicio) / 1000`

#### Scenario: Card muestra tiempo consumido de proceso pausado
- **WHEN** un proceso tiene `fechaInicio = null` y `cantidadRegistrada > 0`
- **THEN** la card muestra el tiempo consumido fijo de `tiempoConsumido`

#### Scenario: Card no muestra timer para proceso finalizado
- **WHEN** un proceso tiene `fechaFinal` seteado
- **THEN** la card NO muestra el timer en vivo

### Requirement: Mostrar tiempo real consumido en el modal de detalle

El modal de detalle de tarjeta DEBE mostrar el tiempo consumido acumulado para cada proceso, tanto en ejecución como pausado o finalizado. El formato DEBE ser `hh:mm:ss` para tiempos > 1 hora, `mm:ss` para tiempos < 1 hora.

#### Scenario: Detalle muestra tiempo consumido en proceso activo
- **WHEN** el modal muestra un proceso con `fechaInicio` y sin `fechaFinal`
- **THEN** se muestra el tiempo consumido en vivo (consumido + sesión activa)

#### Scenario: Detalle muestra tiempo consumido en proceso pausado
- **WHEN** el modal muestra un proceso sin `fechaInicio` y sin `fechaFinal` pero con `cantidadRegistrada > 0`
- **THEN** se muestra el tiempo consumido fijo de `tiempoConsumido`

### Requirement: Barra de progreso temporal opcional

La card Kanban DEBE mostrar una barra de progreso que compare `tiempoConsumido` vs `tiempo` estimado. El progreso DEBE calcularse como `min(100, (consumidoTotal / (tiempo * 60)) * 100)`.

#### Scenario: Barra de progreso con tiempo consumido
- **WHEN** un proceso tiene `tiempo = 60` y `tiempoConsumido = 1800` (30 minutos)
- **THEN** la barra de progreso muestra 50%
