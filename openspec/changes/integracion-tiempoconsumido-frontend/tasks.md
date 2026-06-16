## 1. Modelo TypeScript

- [x] 1.1 Agregar campo `tiempoConsumido?: number` a `ProcesoXTarjetaModel`

## 2. Timer countdown multi-sesión

- [x] 2.1 Actualizar `actualizarTiempo()` en `KanbanCardComponent` para calcular `consumidoTotal = (tiempoConsumido ?? 0) + (ahora - fechaInicio) / 1000` y derivar el countdown restante desde ahí
- [x] 2.2 Actualizar el cálculo del porcentaje de la barra de progreso temporal para usar `consumidoTotal / (tiempo * 60)`

## 3. Corrección de guardias de botones

- [x] 3.1 Cambiar `puedeIniciarReanudar()` en `DetalleTarjetaComponent` para que la segunda guardia sea `if (proceso.fechaInicio && !proceso.fechaFinal) return false` (bloquea TODOS los activos, no solo los que tienen registrada === 0)

## 4. Display de tiempo consumido

- [x] 4.1 Mostrar tiempo consumido formateado (mm:ss / hh:mm:ss) en el modal de detalle junto al tiempo estimado
- [x] 4.2 Mostrar tiempo consumido en la card Kanban (formateado, junto al countdown existente o reemplazándolo según decisión de UI)

## 5. Espaciado de botones

- [x] 5.1 Agregar `gap: 8px` (y opcionalmente `flex-wrap: wrap`) a `.proceso-accion` en `detalle-tarjeta.css`

## 6. Verificación

- [x] 6.1 Ejecutar `tsc --noEmit` y `ng build` para verificar que no hay errores de compilación
- [ ] 6.2 Verificar flujo completo: iniciar → parada → reanudar → finalizar, confirmando que el countdown continúa desde donde se pausó (requiere backend corriendo para pruebas E2E)
