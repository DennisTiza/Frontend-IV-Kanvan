## Why

El módulo de producción registra tarjetas, procesos, operarios y paradas, pero no hay una vista consolidada que permita al gerente visualizar el rendimiento de la fábrica. Actualmente la única forma de obtener estos datos es revisando el tablero Kanban pieza por pieza. Se necesita un módulo de reportes gerenciales que agregue los datos y los presente de forma visual (gráficos + tablas) para la toma de decisiones.

## What Changes

- Nuevo menú "Reportes" (`menuId: 10`) visible para el rol Gerente (`rolId: 3`) con permiso `Listar`
- Nueva ruta `/parametros/reportes` con un componente de reportes
- Nuevo servicio `ReportesService` con 4 métodos GET hacia los endpoints del backend
- Componente con 4 pestañas (tabs): Total por Día, Por Operario, Tiempos, Paradas
- Cada pestaña muestra un gráfico como vista principal y una tabla de datos como vista secundaria (toggle)
- Dependencia nueva: `chart.js` (librería de gráficos)
- Formato de tiempos en `HH:MM:SS` para los reportes de tiempos

## Capabilities

### New Capabilities
- `production-reports`: Visualización de 4 reportes de producción (total por día, por operario, comparación de tiempos, paradas) con gráficos y tablas de datos.

### Modified Capabilities

Ninguna. No se modifican capacidades existentes.

## Impact

- **Nueva dependencia npm**: `chart.js`
- **Nuevo archivo**: `src/app/services/reportes.service.ts`
- **Nueva carpeta**: `src/app/modules/reportes/` con componentes para cada reporte
- **Modificaciones**:
  - `src/app/config/configuracion.menu.ts` — agregar entrada para menú Reportes
  - `src/app/app.routes.ts` — agregar ruta `/parametros/reportes`
- **Sin cambios en el backend** — los 4 endpoints ya existen y no requieren autenticación