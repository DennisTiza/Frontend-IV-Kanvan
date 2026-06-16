## 1. Modelos

- [x] 1.1 Actualizar `ParadaModel`: agregar campos `operarioId?: number` y `operario?: OperarioModel`
- [x] 1.2 Crear `RegistroDeCantidadModel` en `src/app/models/registro-de-cantidad.model.ts` con: id, procesoXTarjetaId, operarioId, cantidad, tipo, codigoDeParadaId, fecha, operario, codigoDeParada

## 2. Servicios

- [x] 2.1 Actualizar firma de `FinalizarProceso(id, body?)` en `ProcesoXtarjetaService`: body ahora acepta `{ cantidadReportada?, operarioId? }`
- [x] 2.2 Actualizar firma de `RegistrarParada(id, body)` en `ProcesoXtarjetaService`: body ahora requiere `operarioId: number`
- [x] 2.3 Agregar método `ObtenerRegistrosCantidad(id: number): Observable<RegistroDeCantidadModel[]>` en `ProcesoXtarjetaService`

## 3. DetalleTarjetaComponent — Selector de operario

- [x] 3.1 Nueva señal `operarioSeleccionado: signal<Map<number, number | null>>(new Map())`
- [x] 3.2 Agregar `<select>` de operarios debajo de la fila de input, visible solo cuando `input > cantidadRegistrada`
- [x] 3.3 Poblar el select desde `proceso.operarioXProcesoXTarjetas` (cada opción muestra nombre + apellido)
- [x] 3.4 Placeholder "Seleccionar operario..." como opción disabled por defecto
- [x] 3.5 Método `onOperarioChange(procesoId, event)` para actualizar la señal
- [x] 3.6 Si `operarioXProcesoXTarjetas` está vacío, mostrar select deshabilitado con texto "Sin operarios asignados"

## 4. DetalleTarjetaComponent — Validación de operario en botones

- [x] 4.1 `puedeRegistrarParada()`: agregar condición `&& operarioSeleccionado().get(procesoId) != null`
- [x] 4.2 `puedeFinalizar()`: si hay delta, agregar condición `&& operarioSeleccionado().get(procesoId) != null`
- [x] 4.3 Si no hay operarios asignados al proceso, deshabilitar ambos botones (parada y finalizar)

## 5. DetalleTarjetaComponent — Emitir operarioId en evento

- [x] 5.1 `finalizarProceso()`: incluir `operarioId` en el emit (solo cuando hay delta)
- [x] 5.2 `registrarParada()`: incluir `operarioId` en el emit (requerido)

## 6. KanbanBoardComponent — Enviar operarioId en llamadas

- [x] 6.1 `manejarAccionProceso()`: extraer `operarioId` del evento
- [x] 6.2 `finalizar`: pasar `operarioId` en body cuando existe
- [x] 6.3 `registrar-parada`: pasar `operarioId` en body (requerido)

## 7. Histórico de paradas — Mostrar operario

- [x] 7.1 Actualizar template de parada-item en `detalle-tarjeta.html` para mostrar `parada.operario?.nombre`
- [x] 7.2 Estilos CSS para el nuevo campo de operario en el item de parada

## 8. Estilos CSS

- [x] 8.1 Estilos para el selector de operarios (`.operario-select`, `.operario-select-container`)
- [x] 8.2 Estilos para el item de parada con operario (`.parada-item-operario`)
