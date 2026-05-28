## ADDED Requirements

### Requirement: Tablero de tarjetas activas para operarios

El sistema DEBE mostrar un tablero de tarjetas de producción activas con sus procesos en la ruta `/parametros/tarjeta-produccion/tablero-operario`. Los datos se obtienen desde `GET /tarjeta-de-produccion?filter[where][estado]=activa&filter[include][relation]=procesoXTarjetas&filter[include][procesoXTarjetas][include][]=proceso&filter[include][procesoXTarjetas][include][]=usuario`.

#### Scenario: Operario accede al tablero de tarjetas activas
- **WHEN** el usuario navega a `/parametros/tarjeta-produccion/tablero-operario`
- **THEN** el sistema carga las tarjetas activas con todos sus procesos incluidos
- **AND** el sistema muestra una lista/tablero de tarjetas
- **AND** cada tarjeta muestra: código, nombre del producto, lista de procesos

#### Scenario: Cada proceso muestra nombre, usuario asignado, cantidad y tiempo
- **WHEN** el tablero muestra una tarjeta
- **THEN** cada proceso dentro de la tarjeta muestra: nombre del proceso (de relación `proceso`), nombre del usuario asignado (de relación `usuario`), cantidad, tiempo

#### Scenario: Operario identifica su tarea por el nombre de usuario
- **WHEN** el operario ve el tablero
- **THEN** puede identificar visualmente qué procesos le corresponden por el nombre del usuario mostrado en cada fila
