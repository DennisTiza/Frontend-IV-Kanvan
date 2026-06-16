## MODIFIED Requirements

### Requirement: Historial de paradas muestra código de parada

El historial de paradas DEBE mostrar el código o descripción del código de parada asociado a cada parada.

#### Scenario: Parada con código devuelve descripción
- **WHEN** la parada tiene un `codigoDeParada` con `descripcion` poblada
- **THEN** se muestra `codigoDeParada.descripcion`

#### Scenario: Parada con código sin descripción
- **WHEN** la parada tiene un `codigoDeParada` con `codigo` pero sin `descripcion`
- **THEN** se muestra `codigoDeParada.codigo`

#### Scenario: Parada sin código asociado
- **WHEN** la parada no tiene objeto `codigoDeParada` anidado
- **THEN** se muestra "Sin código"
