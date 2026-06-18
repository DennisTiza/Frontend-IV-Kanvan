## MODIFIED Requirements

### Requirement: Ver reporte de total producido por día
El sistema DEBE mostrar un gráfico de barras con la producción total por día (fecha, totalProducido) al activar la pestaña "Total por Día". El usuario DEBE poder alternar a una vista de tabla con los mismos datos. Si el backend no responde, el sistema DEBE mostrar un mensaje de error.

#### Scenario: Cargar reporte de total por día exitosamente
- **WHEN** el usuario activa la pestaña "Total por Día" por primera vez y el backend responde correctamente
- **THEN** el sistema llama a GET /reportes/total-por-dia y muestra un gráfico de barras con eje X = fecha y eje Y = total producido

#### Scenario: Error al cargar total por día
- **WHEN** el usuario activa la pestaña "Total por Día" y el backend responde con error
- **THEN** el sistema muestra un mensaje de error indicando que no se pudieron cargar los datos

### Requirement: Ver reporte de producción por operario
El sistema DEBE mostrar un gráfico de barras agrupadas con la producción total por operario y proceso. El usuario DEBE poder alternar a vista de tabla. Si el backend no responde, el sistema DEBE mostrar un mensaje de error.

#### Scenario: Error al cargar reporte por operario
- **WHEN** el usuario activa la pestaña "Por Operario" y el backend responde con error
- **THEN** el sistema muestra un mensaje de error indicando que no se pudieron cargar los datos

### Requirement: Ver reporte de comparación de tiempos
El sistema DEBE mostrar un gráfico de barras agrupadas comparando tiempo estándar vs tiempo real por proceso. Los tiempos DEBEN mostrarse en formato HH:MM:SS. Si el backend no responde, el sistema DEBE mostrar un mensaje de error.

#### Scenario: Error al cargar reporte de tiempos
- **WHEN** el usuario activa la pestaña "Tiempos" y el backend responde con error
- **THEN** el sistema muestra un mensaje de error indicando que no se pudieron cargar los datos

### Requirement: Ver reporte de paradas
El sistema DEBE mostrar un gráfico de barras con las paradas registradas, mostrando frecuencia y cantidad perdida. El usuario DEBE poder alternar a vista de tabla. Si el backend no responde, el sistema DEBE mostrar un mensaje de error.

#### Scenario: Error al cargar reporte de paradas
- **WHEN** el usuario activa la pestaña "Paradas" y el backend responde con error
- **THEN** el sistema muestra un mensaje de error indicando que no se pudieron cargar los datos