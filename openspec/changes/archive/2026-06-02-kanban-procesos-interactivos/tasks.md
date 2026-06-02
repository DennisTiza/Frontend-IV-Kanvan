## 1. Service Layer

- [x] 1.1 Agregar método `ListarTarjetasConProcesos()` en `TarjetaProduccionService` que haga GET con filter include anidado para traer `procesoXTarjetas` ordenados por `orden ASC` con `operario` y `proceso`
- [x] 1.2 Agregar método `IniciarProceso(id: number)` en `ProcesoXtarjetaService` que llame a `POST /proceso-x-tarjeta/{id}/iniciar`
- [x] 1.3 Agregar método `FinalizarProceso(id: number)` en `ProcesoXtarjetaService` que llame a `POST /proceso-x-tarjeta/{id}/finalizar`

## 2. KanbanBoardComponent — Fetching con procesos

- [x] 2.1 Cambiar `cargarTarjetas()` para que use `ListarTarjetasConProcesos()` en lugar de `ListarTarjetas()`
- [x] 2.2 Agregar signal `tarjetaSeleccionada` para manejar apertura/cierre del modal de detalle
- [x] 2.3 Agregar método `abrirDetalle(tarjeta)` que setea la tarjeta seleccionada
- [x] 2.4 Agregar método `cerrarDetalle()` que limpia la tarjeta seleccionada
- [x] 2.5 Agregar método `manejarAccionProceso()` que llama al servicio y refresca el tablero
- [x] 2.6 Agregar en el template el componente `<app-detalle-tarjeta>` condicional
- [x] 2.7 Mapear estado `en_proceso` del backend a `en ejecución` del frontend al filtrar columnas

## 3. KanbanCardComponent — Vista por_hacer

- [x] 3.1 Agregar método `obtenerProximoProceso()` que retorna el primer `ProcesoXTarjeta` sin `fechaInicio`
- [x] 3.2 Agregar método `obtenerTiempoTotal()` que suma `tiempo` de todos los procesos
- [x] 3.3 Modificar `obtenerNombreOperario()` para que use el próximo proceso pendiente, no `[0]` fijo
- [x] 3.4 Modificar template `por_hacer` para mostrar tiempo total y próximo proceso con operario
- [x] 3.5 Hacer la card clickeable emitiendo evento `tarjetaClick` con la tarjeta hacia el board
- [x] 3.6 Agregar estilos CSS para los nuevos elementos de información en `por_hacer`

## 4. KanbanCardComponent — Vista en ejecución (fix timer)

- [x] 4.1 Agregar método `obtenerProcesoActivo()` que retorna el proceso con `fechaInicio` y sin `fechaFinal`
- [x] 4.2 Modificar `iniciarTemporizador()` / `actualizarTiempo()` para usar `procesoActivo.tiempo` en lugar de `tarjeta.cantidad`
- [x] 4.3 Modificar `obtenerProcesoActual()` para que use `obtenerProcesoActivo()` en lugar de `[0]`
- [x] 4.4 Hacer la card clickeable emitiendo evento `tarjetaClick`
- [x] 4.5 Mostrar el nombre del proceso activo en el template (ya existe pero apunta al proceso incorrecto)

## 5. DetalleTarjetaComponent — Nuevo modal de procesos

- [x] 5.1 Crear `detalle-tarjeta.ts`, `detalle-tarjeta.html`, `detalle-tarjeta.css` en `kanban-board/detalle-tarjeta/`
- [x] 5.2 Componente recibe `tarjeta` como input y emite `cerrar` y `procesoAccion` como outputs
- [x] 5.3 Template: lista todos los procesos ordenados con nombre, tiempo, operario, estado visual
- [x] 5.4 Template: botón "Iniciar proceso" solo para el primer proceso sin `fechaInicio`
- [x] 5.5 Template: botón "Finalizar proceso" solo para el proceso con `fechaInicio` sin `fechaFinal`
- [x] 5.6 Template: botón deshabilitado "Completado" para procesos con `fechaFinal`
- [x] 5.7 Template: botón deshabilitado "Bloqueado" para procesos pendientes que no son el próximo
- [x] 5.8 Template: indicador visual de estado con colores (gris pendiente, amarillo en curso, verde completado)
- [x] 5.9 Implementar `iniciarProceso(procesoId)` que emite evento con acción "iniciar"
- [x] 5.10 Implementar `finalizarProceso(procesoId)` que emite evento con acción "finalizar"
- [x] 5.11 Estilos CSS para el modal, lista de procesos, botones contextuales y estados

## 6. Integración Tablero ↔ Modal

- [x] 6.1 Importar y registrar `DetalleTarjetaComponent` en `KanbanBoardComponent`
- [x] 6.2 Vincular evento `tarjetaClick` de las cards con `abrirDetalle()` del board
- [x] 6.3 Vincular evento `cerrar` del modal con `cerrarDetalle()` del board
- [x] 6.4 Vincular evento `procesoAccion` del modal para ejecutar la acción (iniciar/finalizar) y refrescar
- [x] 6.5 Verificar flujo completo: iniciar proceso → card pasa a en ejecución → finalizar → card vuelve a por_hacer o finalizada
