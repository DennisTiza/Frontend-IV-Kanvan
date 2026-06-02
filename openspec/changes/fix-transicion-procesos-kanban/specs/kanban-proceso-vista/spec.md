## MODIFIED Requirements

### Requirement: Card en por_hacer muestra tiempo del próximo proceso

La card en estado `por_hacer` DEBE mostrar el tiempo del próximo proceso pendiente (el primer `ProcesoXTarjeta` sin `fechaInicio`, ordenado por `orden ASC`), SOLO si no existe un proceso activo (con `fechaInicio` sin `fechaFinal`). Si existe un proceso activo, NO DEBE mostrarse el próximo proceso. El formato DEBE ser "Próximo: Corte (30 min)".

#### Scenario: Card por_hacer muestra próximo proceso
- **WHEN** la tarjeta tiene procesos ordenados, el primero es "Corte" con 30 min, y NO hay proceso activo
- **THEN** la card muestra "Próximo: Corte (30 min)"

#### Scenario: Card por_hacer NO muestra próximo si hay activo
- **WHEN** la tarjeta tiene un proceso en curso (fechaInicio sin fechaFinal)
- **THEN** la card NO muestra la línea de "Próximo"

### Requirement: Card en por_hacer muestra operario del próximo proceso pendiente

La card en estado `por_hacer` DEBE mostrar el nombre completo del operario asignado al próximo proceso pendiente (primer `ProcesoXTarjeta` sin `fechaFinal`, ordenado por `orden ASC`), SOLO si no existe un proceso activo. Si existe un proceso activo, DEBE mostrar el operario del proceso activo. No DEBE usar el índice `[0]` fijo del array.

#### Scenario: Card por_hacer muestra operario del próximo
- **WHEN** no hay proceso activo y el próximo proceso pendiente tiene operario "Juan Pérez"
- **THEN** la card muestra "Operario: Juan Pérez"

#### Scenario: Card por_hacer muestra operario del activo cuando hay proceso en curso
- **WHEN** hay un proceso activo con operario "María López"
- **THEN** la card muestra "Operario: María López"

## ADDED Requirements

### Requirement: Columna de tarjeta derivada desde procesos

El tablero Kanban DEBE determinar la columna de cada tarjeta basándose en el estado de sus procesos, no solo en `tarjeta.estado`. Si existe un proceso con `fechaInicio` y sin `fechaFinal`, la tarjeta DEBE aparecer en "En ejecución" independientemente del valor de `tarjeta.estado`.

#### Scenario: Card con proceso activo aparece en En ejecución
- **WHEN** la tarjeta tiene `tarjeta.estado = 'por_hacer'` pero un proceso está activo
- **THEN** la card aparece en la columna "En ejecución"

#### Scenario: Card sin procesos activos ni pendientes aparece en Finalizadas
- **WHEN** todos los procesos tienen `fechaFinal` o no hay procesos
- **THEN** la card aparece en "Finalizadas"

#### Scenario: Card sin procesos activos y con pendientes aparece en Por hacer
- **WHEN** hay procesos pendientes (sin `fechaInicio`) y ninguno activo
- **THEN** la card aparece en "Por hacer"
