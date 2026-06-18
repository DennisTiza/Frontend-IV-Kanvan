## ADDED Requirements

### Requirement: Navegación entre reportes
El sistema DEBE mostrar 4 pestañas de reportes: "Total por Día", "Por Operario", "Tiempos", "Paradas". El usuario DEBE poder cambiar entre pestañas y ver el reporte correspondiente.

#### Scenario: Cambiar de pestaña de reporte
- **WHEN** el usuario hace clic en la pestaña "Por Operario"
- **THEN** el sistema oculta el reporte actual y muestra el reporte de producción por operario

### Requirement: Ver reporte de total producido por día
El sistema DEBE mostrar un gráfico de barras con la producción total por día (fecha, totalProducido) al activar la pestaña "Total por Día". El usuario DEBE poder alternar a una vista de tabla con los mismos datos.

#### Scenario: Cargar reporte de total por día
- **WHEN** el usuario activa la pestaña "Total por Día" por primera vez
- **THEN** el sistema llama a GET /reportes/total-por-dia y muestra un gráfico de barras con eje X = fecha y eje Y = total producido

#### Scenario: Alternar a vista de tabla en total por día
- **WHEN** el usuario hace clic en "Ver datos" estando en la pestaña "Total por Día"
- **THEN** el sistema oculta el gráfico y muestra una tabla con columnas "Fecha" y "Total Producido"

### Requirement: Ver reporte de producción por operario
El sistema DEBE mostrar un gráfico de barras agrupadas con la producción total por operario y proceso. El usuario DEBE poder alternar a vista de tabla.

#### Scenario: Cargar reporte por operario
- **WHEN** el usuario activa la pestaña "Por Operario" por primera vez
- **THEN** el sistema llama a GET /reportes/por-operario y muestra un gráfico de barras con operario en eje X y total producido en eje Y, agrupado por proceso

#### Scenario: Alternar a vista de tabla por operario
- **WHEN** el usuario hace clic en "Ver datos" estando en la pestaña "Por Operario"
- **THEN** el sistema oculta el gráfico y muestra una tabla con columnas "Operario", "Proceso" y "Total Producido"

### Requirement: Ver reporte de comparación de tiempos
El sistema DEBE mostrar un gráfico de barras agrupadas comparando tiempo estándar vs tiempo real por proceso. Los tiempos DEBEN mostrarse en formato HH:MM:SS.

#### Scenario: Cargar reporte de tiempos
- **WHEN** el usuario activa la pestaña "Tiempos" por primera vez
- **THEN** el sistema llama a GET /reportes/tiempos y muestra un gráfico de barras agrupadas comparando tiempo estándar vs tiempo real por proceso

#### Scenario: Ver tiempos en formato legible
- **WHEN** el sistema muestra la tabla de tiempos
- **THEN** las columnas "tiempoEstandar", "tiempoReal" y "diferencia" DEBEN mostrarse en formato HH:MM:SS (ej: 01:00:00 para 3600 segundos)

### Requirement: Ver reporte de paradas
El sistema DEBE mostrar un gráfico de barras con las paradas registradas, mostrando frecuencia y cantidad perdida. El usuario DEBE poder alternar a vista de tabla.

#### Scenario: Cargar reporte de paradas
- **WHEN** el usuario activa la pestaña "Paradas" por primera vez
- **THEN** el sistema llama a GET /reportes/paradas y muestra un gráfico de barras con código de parada en eje X y cantidad perdida en eje Y

#### Scenario: Alternar a vista de tabla de paradas
- **WHEN** el usuario hace clic en "Ver datos" estando en la pestaña "Paradas"
- **THEN** el sistema oculta el gráfico y muestra una tabla con columnas "Código", "Descripción", "Veces" y "Cantidad Perdida"

### Requirement: Acceso basado en permisos del menú
El sistema DEBE ocultar el menú "Reportes" si el usuario autenticado no tiene `Listar: true` para `menuId: 10`.

#### Scenario: Gerente ve el menú Reportes
- **WHEN** un usuario con rolId=3 (Gerente) inicia sesión y el backend devuelve `menuId: 10` con `Listar: true`
- **THEN** el sistema DEBE construir el menú lateral incluyendo la opción "Reportes"

#### Scenario: Usuario sin permiso no ve Reportes
- **WHEN** un usuario inicia sesión y el backend no incluye `menuId: 10` con `Listar: true` en sus permisos
- **THEN** el sistema NO DEBE mostrar la opción "Reportes" en el menú lateral