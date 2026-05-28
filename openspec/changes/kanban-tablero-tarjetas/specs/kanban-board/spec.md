## ADDED Requirements

### Requirement: Tablero Kanban con tres columnas de estado

El sistema DEBE mostrar un tablero Kanban en la ruta `/parametros/tarjeta-produccion/kanban` con tres columnas: "Por hacer", "En ejecución" y "Finalizadas". Cada columna DEBE tener un encabezado con icono, título, y badge circular con el conteo de tarjetas. Al pie de cada columna DEBE haber un botón "Ver todas (X)".

#### Scenario: Usuario navega al tablero Kanban
- **WHEN** el usuario navega a `/parametros/tarjeta-produccion/kanban`
- **THEN** el sistema carga todas las tarjetas de producción
- **AND** las distribuye en tres columnas según su estado (`pendiente`, `en-proceso`, `finalizada`)
- **AND** cada columna muestra un badge con el número de tarjetas en esa columna

#### Scenario: Columna "Por hacer" muestra tarjetas pendientes
- **WHEN** existen tarjetas con estado `pendiente`
- **THEN** aparecen en la columna "Por hacer" con icono de documento gris, badge gris

#### Scenario: Columna "En ejecución" muestra tarjetas en proceso
- **WHEN** existen tarjetas con estado `en-proceso`
- **THEN** aparecen en la columna "En ejecución" con icono de play naranja, badge naranja

#### Scenario: Columna "Finalizadas" muestra tarjetas completadas
- **WHEN** existen tarjetas con estado `finalizada`
- **THEN** aparecen en la columna "Finalizadas" con icono de check verde, badge verde

#### Scenario: Botón "Ver todas (X)" al pie de cada columna
- **WHEN** la columna tiene N tarjetas
- **THEN** el botón al pie dice "Ver todas (N)"
- **AND** el botón ocupa el ancho completo de la columna

#### Scenario: Diseño responsivo apila columnas
- **WHEN** el ancho de pantalla es menor a 768px
- **THEN** las tres columnas se apilan verticalmente

### Requirement: Tarjetas Kanban con anatomía variable según estado

El sistema DEBE mostrar tarjetas visuales (cards) dentro de cada columna con contenido diferenciado según el estado de la tarjeta. Todas las cards DEBEN mostrar: código, nombre del producto, cantidad, operario asignado y badge de estado.

#### Scenario: Card "Por hacer" muestra datos base
- **WHEN** la tarjeta está en estado `pendiente`
- **THEN** la card muestra: código (negrita, superior izquierda), nombre del producto, cantidad con icono de caja, operario asignado con icono de usuario, badge "Pendiente" gris en esquina superior derecha

#### Scenario: Card "En ejecución" muestra datos base + seguimiento operativo
- **WHEN** la tarjeta está en estado `en-proceso`
- **THEN** la card muestra datos base más: proceso actual con icono de engranaje, tiempo restante en formato HH:MM:SS, barra de progreso, tiempo estimado, progreso porcentual, botón "Ver detalles"

#### Scenario: Temporizador en tarjetas "En ejecución"
- **WHEN** la tarjeta está en ejecución
- **THEN** el temporizador muestra el tiempo restante calculado desde `fechaInicio` + tiempo estimado
- **AND** se actualiza cada segundo en formato HH:MM:SS
- **AND** cambia a color naranja cuando quedan menos de 10 minutos

#### Scenario: Barra de progreso en tarjetas "En ejecución"
- **WHEN** la tarjeta tiene fechaInicio y tiempo estimado
- **THEN** la barra de progreso muestra el avance como (tiempoTranscurrido / tiempoEstimado) * 100%
- **AND** las métricas inferiores muestran "Tiempo estimado: XX:XX:XX" a la izquierda y "Progreso: XX%" a la derecha

#### Scenario: Card "Finalizada" muestra datos base + cierre
- **WHEN** la tarjeta está en estado `finalizada`
- **THEN** la card muestra datos base más: indicador "Completada" con icono de verificación verde, fecha y hora de cierre con icono de calendario, botón "Ver resumen"

#### Scenario: Botón "Ver detalles" en tarjetas "En ejecución"
- **WHEN** el usuario hace clic en "Ver detalles"
- **THEN** el sistema navega a `/parametros/tarjeta-produccion/editar-procesos/{id}`

#### Scenario: Botón "Ver resumen" en tarjetas "Finalizadas"
- **WHEN** el usuario hace clic en "Ver resumen"
- **THEN** el sistema navega a una vista de detalle de la tarjeta finalizada
