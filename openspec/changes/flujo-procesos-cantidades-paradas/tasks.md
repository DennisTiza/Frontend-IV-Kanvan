## 1. Modelos

- [x] 1.1 Agregar propiedades `cantidad`, `cantidadRealizada` y `cantidadRegistrada` a `ProcesoXTarjetaModel`
- [x] 1.2 Crear `ParadaModel` en `src/app/models/parada.model.ts` con id, procesoXTarjetaId, codigoDeParadaId, cantidadReportada, fecha, codigo (relación)

## 2. Servicios

- [x] 2.1 Agregar método `RegistrarParada(id, body)` a `ProcesoXtarjetaService` → `POST /proceso-x-tarjeta/{id}/registrar-parada`
- [x] 2.2 Agregar método `ObtenerParadas(id): Observable<ParadaModel[]>` → `GET /proceso-x-tarjeta/{id}/paradas`
- [x] 2.3 Actualizar `FinalizarProceso` para aceptar body opcional `{ cantidadReportada: number }`
- [x] 2.4 Cargar códigos de parada en DetalleTarjeta via `CodigoDeParadaService` en `ngOnInit`

## 3. DetalleTarjetaComponent — Input de cantidad y lógica de botones

- [x] 3.1 Señal `procesoInputs: Signal<Map<number, number>>` reactiva al input del operario
- [x] 3.2 Campo input numérico con min=cantidadRegistrada, max=cantidad, default=cantidadRegistrada
- [x] 3.3 Lógica condicional: input > registrada && < total → Parada; input === total → Finalizar
- [x] 3.4 Cálculo de delta `input - cantidadRegistrada` en getDelta()
- [x] 3.5 Botón "▶ Iniciar" / "▶ Reanudar" según estado del proceso
- [x] 3.6 Iniciar/Reanudar deshabilitado si cantidadRegistrada >= cantidad

## 4. DetalleTarjetaComponent — Secuencialidad condicional

- [x] 4.1 puedeAcceder(): proceso N habilitado si N-1 tiene cantidadRegistrada > 0, O es orden 1, O ya fue iniciado
- [x] 4.2 Tooltip "Completa o registra avance en el proceso anterior" en botón bloqueado

## 5. DetalleTarjetaComponent — Formulario de parada inline

- [x] 5.1 Estado `procesoExpandido: Signal<number | null>` para control expansión
- [x] 5.2 Expandible inline con selector de códigos, delta a reportar, y botones Cancelar/Guardar
- [x] 5.3 Al guardar: llama a RegistrarParada, emite evento, cierra, refresca
- [x] 5.4 Al cancelar: colapsa sin llamar a ningún endpoint

## 6. DetalleTarjetaComponent — Histórico de paradas

- [x] 6.1 Indicador ⚠️ en badge del proceso si tiene paradas (cantidadRegistrada > 0 sin fechaFinal)
- [x] 6.2 Expandible de histórico con hora, código, cantidad al hacer clic en "Ver paradas"
- [x] 6.3 ObtenerParadas(id) llamado al expandir el histórico

## 7. DetalleTarjetaComponent — Barra de progreso de cantidad

- [x] 7.1 Barra de progreso visual con getBarraPorcentaje() usando cantidadRegistrada/cantidad
- [x] 7.2 Texto "X/Y" al lado de la barra

## 8. KanbanCardComponent — Barras de cantidad y multi-proceso

- [x] 8.1 Barras de cantidad por cada proceso con avance o activo (obtenerProcesosConAvance)
- [x] 8.2 Indicador ⚠️ junto al proceso si tiene paradas (activo + cantidadRegistrada > 0)
- [x] 8.3 Indicador ▶ junto al proceso activo (fechaInicio sin fechaFinal)
- [x] 8.4 Timer solo del proceso con mayor fechaInicio (último reanudado)
- [x] 8.5 Texto "→ <proceso> disponible" si el siguiente proceso puede iniciarse

## 9. KanbanBoardComponent — Clasificación actualizada

- [x] 9.1 cargarTarjetas() actualizada: ejecución = fechaInicio sin fechaFinal; finalizadas = todos cantidadRegistrada >= cantidad
- [x] 9.2 Tarjetas con paradas se mantienen en "En ejecución"

## 10. Estilos CSS

- [x] 10.1 Barra de progreso de cantidad en DetalleTarjeta (progreso-cantidad, progreso-barra-*)
- [x] 10.2 Barras de cantidad compactas en KanbanCard (proceso-bar-row, proceso-bar-*)
- [x] 10.3 Formulario inline de parada (parada-form, parada-select, parada-form-actions)
- [x] 10.4 Histórico de paradas expandible (paradas-historial, parada-item, parada-total)
- [x] 10.5 Tooltip de botón bloqueado (tooltip-wrapper, tooltip-text)
