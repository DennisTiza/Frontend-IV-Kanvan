## 1. Setup

- [x] 1.1 Install `chart.js` via npm
- [x] 1.2 Create directory `src/app/modules/reportes/`

## 2. Service Layer

- [x] 2.1 Create `src/app/services/reportes.service.ts` with 4 methods (`ObtenerTotalPorDia`, `ObtenerPorOperario`, `ObtenerTiempos`, `ObtenerParadas`) y las interfaces DTO correspondientes

## 3. Menu and Route Configuration

- [x] 3.1 Add entry to `ConfiguracionMenu.listaMenus` for Reportes (`id: "10"`, `titulo: "Reportes"`, `ruta: "/parametros/reportes"`, `accion: "Listar"`)
- [x] 3.2 Add route `{ path: 'parametros/reportes', component: Reportes, canActivate: [ValidarSesionActivaGuard, guardarUltimaRutaGuard] }` to `app.routes.ts`

## 4. Reportes Component

- [x] 4.1 Create `src/app/modules/reportes/reportes.ts` with standalone component, OnPush, imports (CommonModule, inject, signal, afterNextRender)
- [x] 4.2 Implement tab navigation: señal `tabActiva` con valores `'total-por-dia' | 'por-operario' | 'tiempos' | 'paradas'`, template con botones de pestaña y `@switch` para contenido
- [x] 4.3 Implement lazy data loading: señal `datosCargados: Record<string, boolean>` que dispara la llamada al servicio la primera vez que se activa cada pestaña
- [x] 4.4 Implement Chart.js integration: método privado `crearChart(canvasId, config)` que crea y retorna una instancia de Chart, y método `destruirCharts()` que destruye todas las instancias activas
- [x] 4.5 Implement chart de Total por Día (bar chart, eje X = fecha, eje Y = totalProducido)
- [x] 4.6 Implement chart de Por Operario (bar chart agrupado, eje X = operario, datasets agrupados por proceso)
- [x] 4.7 Implement chart de Tiempos (bar chart agrupado, datasets: tiempoEstandar vs tiempoReal por proceso)
- [x] 4.8 Implement chart de Paradas (bar chart, eje X = código de parada, dos datasets: veces y cantidadPerdida)
- [x] 4.9 Implement toggle gráfico/tabla: señal `mostrarTabla(tab: string)` que alterna entre `<canvas>` y `<table>` con los mismos datos
- [x] 4.10 Implement tablas de datos: estructura HTML `<table>` para cada reporte con sus columnas correspondientes y formato HH:MM:SS para los tiempos

## 5. Styles

- [x] 5.1 Add styles for tab navigation (horizontal button bar, active tab indicator)
- [x] 5.2 Add styles for data tables (bordered, striped rows, responsive)
- [x] 5.3 Add styles for chart container and toggle button