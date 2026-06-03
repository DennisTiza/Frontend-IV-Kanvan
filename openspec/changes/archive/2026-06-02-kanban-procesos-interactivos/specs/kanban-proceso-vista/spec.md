## ADDED Requirements

### Requirement: Card en por_hacer muestra tiempo estimado total

La card en estado `por_hacer` DEBE mostrar el tiempo estimado total, calculado como la suma de los campos `tiempo` de todos los `ProcesoXTarjeta` asociados a la tarjeta. El formato DEBE ser "X min" o "Xh Ym" si supera los 60 minutos.

#### Scenario: Card por_hacer con múltiples procesos muestra suma correcta
- **WHEN** la tarjeta tiene 3 procesos con tiempos 30, 45 y 20 minutos
- **THEN** la card muestra "Tiempo total: 95 min"

#### Scenario: Card por_hacer con un solo proceso
- **WHEN** la tarjeta tiene 1 proceso con tiempo 30 minutos
- **THEN** la card muestra "Tiempo total: 30 min"

### Requirement: Card en por_hacer muestra tiempo del próximo proceso

La card en estado `por_hacer` DEBE mostrar el tiempo del próximo proceso pendiente (el primer `ProcesoXTarjeta` sin `fechaInicio`, ordenado por `orden ASC`). El formato DEBE ser "Próximo: Corte (30 min)".

#### Scenario: Card por_hacer muestra próximo proceso
- **WHEN** la tarjeta tiene procesos ordenados y el primero es "Corte" con 30 min
- **THEN** la card muestra "Próximo: Corte (30 min)"

#### Scenario: Card por_hacer cambia próximo proceso al finalizar el anterior
- **WHEN** se finaliza el proceso "Corte"
- **THEN** la card ahora muestra "Próximo: Doblado (45 min)"

### Requirement: Card en por_hacer muestra operario del próximo proceso pendiente

La card en estado `por_hacer` DEBE mostrar el nombre completo del operario asignado al próximo proceso pendiente (primer `ProcesoXTarjeta` sin `fechaFinal`, ordenado por `orden ASC`). No DEBE usar el índice `[0]` fijo del array.

#### Scenario: Card por_hacer muestra operario correcto
- **WHEN** el próximo proceso pendiente tiene operario "Juan Pérez"
- **THEN** la card muestra "Operario: Juan Pérez"

#### Scenario: Card por_hacer cambia operario al finalizar proceso
- **WHEN** se finaliza el proceso de Juan y el siguiente proceso tiene operario "María López"
- **THEN** la card ahora muestra "Operario: María López"

### Requirement: Card en en ejecución muestra timer basado en proceso.tiempo

La card en estado `en ejecución` DEBE usar el campo `tiempo` del proceso activo (el `ProcesoXTarjeta` que tiene `fechaInicio` y NO tiene `fechaFinal`) para calcular el tiempo restante. NO DEBE usar `tarjeta.cantidad`.

#### Scenario: Timer muestra tiempo restante correcto
- **WHEN** el proceso activo tiene `tiempo = 30` y se inició hace 5 minutos
- **THEN** el timer muestra "00:25:00" (o aproximado)

#### Scenario: Timer usa progreso del proceso activo
- **WHEN** el proceso activo tiene `tiempo = 60` y se inició hace 30 minutos
- **THEN** la barra de progreso muestra 50%

### Requirement: Card en en ejecución muestra nombre del proceso activo

La card en estado `en ejecución` DEBE mostrar el nombre del proceso que está actualmente en curso (el que tiene `fechaInicio` sin `fechaFinal`). NO DEBE mostrar siempre el primero del array.

#### Scenario: Muestra nombre correcto del proceso activo
- **WHEN** la tarjeta tiene 3 procesos y el segundo ("Doblado") está en ejecución
- **THEN** la card muestra "Proceso: Doblado"

### Requirement: ProcesoXTarjeta ordenado por orden ASC

El componente DEBE asumir que el array `procesoXTarjetas` ya viene ordenado por `orden ASC` desde el backend. No DEBE reordenar en el frontend.

#### Scenario: Array ya viene ordenado
- **WHEN** el backend devuelve `procesoXTarjetas` con orden 1, 2, 3
- **THEN** el frontend usa el array en ese orden sin reordenar
