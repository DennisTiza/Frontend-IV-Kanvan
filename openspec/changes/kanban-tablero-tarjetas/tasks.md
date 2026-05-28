## 1. Servicio: método para obtener tarjetas del Kanban

- [x] 1.1 Agregar método `ListarTarjetasKanban()` en `TarjetaProduccionService` que consuma `GET /tarjeta-de-produccion` y devuelva todas las tarjetas (el filtrado por estado se hace en cliente)

## 2. Componente KanbanCard

- [x] 2.1 Crear componente standalone `KanbanCardComponent` en `modules/parametros/tarjeta-produccion/kanban-board/kanban-card/` con `@Input() tarjeta: TarjetaProduccionModel`
- [x] 2.2 Implementar template base común: código en negrita, nombre del producto, cantidad con icono, operario con icono, badge de estado superior derecho
- [x] 2.3 Implementar sección condicional para estado `en-proceso`: proceso actual, temporizador HH:MM:SS, barra de progreso, métricas inferiores (tiempo estimado y progreso %), botón "Ver detalles"
- [x] 2.4 Implementar sección condicional para estado `finalizada`: indicador "Completada" con check verde, fecha/hora de cierre con icono calendario, botón "Ver resumen"
- [x] 2.5 Implementar lógica del temporizador: calcular tiempo restante desde `fechaInicio` + `tiempo`, actualizar cada segundo con `setInterval`, limpiar en `ngOnDestroy`
- [x] 2.6 Implementar barra de progreso: calcular avance como `(transcurrido / estimado) * 100`, ancho del div de relleno en porcentaje
- [x] 2.7 Agregar estilos CSS para la card: border-radius, sombra sutil, espaciado interno, colores según estado, iconos SVG inline
- [x] 2.8 Configurar `ChangeDetectionStrategy.OnPush`

## 3. Componente KanbanBoard

- [x] 3.1 Crear componente standalone `KanbanBoardComponent` en `modules/parametros/tarjeta-produccion/kanban-board/`
- [x] 3.2 Implementar layout con tres columnas usando CSS Grid: "Por hacer", "En ejecución", "Finalizadas"
- [x] 3.3 En `ngOnInit`, llamar a `TarjetaProduccionService.ListarTarjetasKanban()` y agrupar las tarjetas en señales por estado (`pendiente`, `en-proceso`, `finalizada`)
- [x] 3.4 Implementar encabezados de columna con icono (SVG inline), título y badge circular con conteo
- [x] 3.5 Implementar botón "Ver todas (X)" al pie de cada columna (ancho completo, minimalista)
- [x] 3.6 Integrar `KanbanCardComponent` dentro de cada columna
- [x] 3.7 Agregar estilos CSS para el layout Kanban: grid de 3 columnas, sombras, transiciones, responsivo (apilar en mobile)
- [x] 3.8 Configurar `ChangeDetectionStrategy.OnPush`

## 4. Ruta y menú

- [x] 4.1 Agregar ruta `/parametros/tarjeta-produccion/kanban` → `KanbanBoardComponent` en `app.routes.ts`
- [x] 4.2 Agregar ítem de menú "Kanban" en `configuracion.menu.ts` con ID 6 y acción `Listar`
