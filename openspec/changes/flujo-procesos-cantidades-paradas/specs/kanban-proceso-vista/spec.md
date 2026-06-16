## MODIFIED Requirements

### Requirement: Card en por_hacer muestra procesos con barra de cantidad

La card en estado `por_hacer` DEBE mostrar todos los procesos de la tarjeta en formato compacto, cada uno con su barra de progreso de cantidad (inicialmente 0%). DEBE mostrar también el tiempo total estimado y el operario del primer proceso.

#### Scenario: Card por_hacer muestra procesos con barra 0%
- **WHEN** la tarjeta tiene 3 procesos con cantidad 100 cada uno
- **THEN** la card muestra 3 barras de progreso, cada una en 0%
- **AND** texto "Tiempo total: 95 min"
- **AND** operario del primer proceso

### Requirement: Card en en ejecución muestra barras de cantidad y timer del activo

La card en estado `en ejecución` DEBE mostrar:
- Una barra de progreso de cantidad por cada proceso que tenga avance (`cantidadRegistrada > 0`) o esté activo
- Indicador ⚠️ si el proceso tiene paradas registradas
- Indicador ▶ si el proceso está activo (corriendo)
- El timer (cuenta regresiva) solo para el proceso activo actual
- Texto "→ <proceso> disponible" si el siguiente proceso puede iniciarse

#### Scenario: Card con proceso activo muestra timer y barra
- **WHEN** Ensamble está activo con 35/100 y timer corriendo
- **THEN** la card muestra "Ensamble 35/100 ▶"
- **AND** muestra el timer "⏱ 00:45:23 — Ensamble"

#### Scenario: Card con proceso pausado y otro activo
- **WHEN** Corte tiene parada 70/100 ⚠️ y Ensamble está activo 35/100 ▶
- **THEN** la card muestra ambas barras
- **AND** el timer corresponde a Ensamble

#### Scenario: Card muestra proceso disponible
- **WHEN** Corte tiene 70/100 y Ensamble no ha iniciado
- **THEN** la card muestra "→ Ensamble disponible"

### Requirement: Timer en card usa fechaInicio del proceso activo

La card en estado `en ejecución` DEBE usar `fechaInicio` del proceso activo que tiene el timer corriendo. El cálculo es `fechaInicio + tiempo - ahora`. Si hay múltiples activos, usa el de mayor `fechaInicio` (último iniciado).

#### Scenario: Timer usa fechaInicio del activo
- **WHEN** el proceso activo se reanudó (nuevo `fechaInicio`)
- **THEN** el timer se calcula desde el nuevo `fechaInicio`

### Requirement: Card completada muestra resumen

La card en estado `finalizada` DEBE mostrar todas las barras de procesos al 100%, la fecha de cierre, y un botón "Ver resumen".

#### Scenario: Card finalizada con todos los procesos completos
- **WHEN** la tarjeta está finalizada con 3 procesos
- **THEN** cada proceso muestra barra al 100%
- **AND** se muestra la fecha del último proceso completado
