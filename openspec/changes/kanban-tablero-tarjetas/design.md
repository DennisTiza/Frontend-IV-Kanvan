## Context

El frontend ya tiene componentes para Tarjeta de Producción: listado tipo tabla (`ListarTarjetaProduccion`), formulario de creación (`CrearTarjetaProduccion`), edición de procesos (`EditarProcesosTarjeta`), y un tablero simple (`TableroOperario`). Todos usan Angular 21 standalone con signals, ChangeDetectionStrategy.OnPush y CSS propio. El backend provee endpoints para filtrar tarjetas por estado y obtener procesos asociados.

Se necesita una vista Kanban visual con tres columnas (Por hacer, En ejecución, Finalizadas) con cards diferenciadas por estado, contadores, temporizador y barra de progreso.

## Goals / Non-Goals

**Goals:**
- Crear un `KanbanBoardComponent` standalone con layout de 3 columnas responsivo
- Crear un `KanbanCardComponent` standalone con anatomía variable según estado
- Implementar contador de tarjetas por columna con badge circular
- Implementar temporizador con formato HH:MM:SS para tarjetas "En ejecución"
- Implementar barra de progreso visual con indicador porcentual
- Botones "Ver todas (X)" al pie de cada columna
- Botones "Ver detalles" y "Ver resumen" en tarjetas
- Nueva ruta `/parametros/tarjeta-produccion/kanban`
- Agregar método `ListarTarjetasKanban()` al servicio que obtenga tarjetas agrupadas o filtrables por estado
- Diseño responsivo: columnas se apilan verticalmente en mobile

**Non-Goals:**
- No se modifica el listado tipo tabla existente ni el tablero operario
- No se implementa drag & drop (solo visualización)
- No se modifican los modelos de datos existentes
- Sin cambios en autenticación, guards o menú dinámico

## Decisions

### 1. KanbanBoard como componente contenedor, KanbanCard como subcomponente
**Decisión**: `KanbanBoardComponent` es el contenedor principal que obtiene los datos y los distribuye en tres columnas. `KanbanCardComponent` recibe la tarjeta via @Input y renderiza el contenido según `estado`.
**Alternativa**: Un solo componente con todo inline. Se descarta por separación de responsabilidades y reutilización.

### 2. Obtención de datos: un solo endpoint con filtro por estado
**Decisión**: El servicio expone `ListarTarjetasKanban()` que consulta `GET /tarjeta-de-produccion` y el componente filtra en cliente por estado (`pendiente`, `en-proceso`, `finalizada`).
**Alternativa**: Tres llamadas separadas (una por columna). Se descarta porque es más eficiente una sola llamada y el filtrado en cliente es trivial.

### 3. Temporizador con setInterval + signal
**Decisión**: Para el contador regresivo, cada tarjeta "En ejecución" calcula el tiempo restante basado en `fechaInicio` + `tiempo` estimado, usando `setInterval` dentro del componente KanbanCard. Se limpia el intervalo en `ngOnDestroy`.
**Alternativa**: Un servicio centralizado con temporizador global. Se descarta porque cada tarjeta tiene su propio tiempo independiente.

### 4. Barra de progreso como elemento CSS puro
**Decisión**: La barra de progreso se implementa con un div contenedor y un div de relleno, usando `width: X%` calculado como `(tiempoTranscurrido / tiempoEstimado) * 100`.
**Alternativa**: Librería externa de progreso. Se descarta para mantener el proyecto ligero.

### 5. Variables CSS para colores del tema
**Decisión**: Los colores del Kanban (naranja para "En ejecución", verde para "Finalizadas", gris para "Por hacer") se definen como variables CSS en el componente para mantener consistencia con el sistema de diseño existente (rojo primario `#b70619`).

## Risks / Trade-offs

- **Temporizador en tiempo real**: Si hay muchas tarjetas "En ejecución", múltiples intervalos pueden afectar rendimiento. **Mitigación**: Solo las tarjetas visibles tienen intervalos activos; se limpiarán al destruir el componente.
- **Cálculo de progreso**: Depende de que `fechaInicio` y `tiempo` estén correctamente poblados. **Mitigación**: Si faltan datos, se muestra un valor por defecto o "--".
- **Responsive**: El layout de 3 columnas debe colapsar a 1 columna en mobile. **Mitigación**: Usar CSS Grid con `auto-fill` y media queries.
