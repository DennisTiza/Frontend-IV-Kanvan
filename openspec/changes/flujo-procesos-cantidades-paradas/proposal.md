## Why

El tablero kanban actual permite solo iniciar y finalizar procesos de forma binaria y secuencial — no refleja la realidad de la producción donde hay paradas, avances parciales, y múltiples procesos activos simultáneamente. Los operarios necesitan registrar cuánto procesaron antes de una parada, poder reanudar procesos incompletos, y avanzar al siguiente proceso aunque el anterior no esté terminado.

## What Changes

- **Cantidad por proceso**: Cada proceso en una tarjeta ahora tiene `cantidad` (total), `cantidadRealizada` (último reporte) y `cantidadRegistrada` (acumulado histórico).
- **Registro de paradas**: Nuevo endpoint y UI para registrar paradas con código y cantidad reportada. Las paradas tienen su propio modelo e historial.
- **Iniciar → Iniciar/Reanudar**: El botón de inicio ahora sirve también para reanudar procesos que tienen paradas registradas. POST /iniciar asigna nuevo `fechaInicio` en cada llamada.
- **Finalizar con cantidad**: POST /finalizar acepta `{ cantidadReportada }` opcional. Si está presente, suma a `cantidadRegistrada` y asigna `fechaFinal`. Si no, solo asigna `fechaFinal` (compatibilidad).
- **Secuencialidad condicional**: El proceso N puede iniciarse si el proceso N-1 tiene `cantidadRegistrada > 0` (no necesita estar finalizado).
- **Tarjeta completa**: Pasa a `finalizada` solo cuando todos los procesos tienen `cantidadRegistrada === cantidad`.
- **Input de cantidad en UI**: El operario ingresa cuánto ha procesado en un campo numérico, y según el valor se habilita "Registrar Parada" (si < total) o "Finalizar" (si = total). No se fuerza una parada ficticia para reportar avance.

## Capabilities

### New Capabilities
- `proceso-avance-cantidad`: Seguimiento de avance por cantidad en cada proceso del kanban. Input de cantidad, barra de progreso, cálculo de deltas.
- `registro-paradas`: Registro de paradas con código, cantidad reportada, e historial visible por proceso.

### Modified Capabilities
- `kanban-proceso-accion`: Las acciones de proceso ahora incluyen registrar parada, reanudar, y finalizar con cantidad condicional. La lógica de secuencialidad cambia de "fechaFinal del anterior" a "cantidadRegistrada > 0 del anterior".
- `kanban-proceso-vista`: La tarjeta kanban ahora muestra barras de progreso por cantidad por proceso, indicador de paradas (⚠️), y timer solo del proceso activo.

## Impact

- **Modelos**: `ProcesoXTarjetaModel` recibe 3 nuevas propiedades (`cantidad`, `cantidadRealizada`, `cantidadRegistrada`). Nuevo modelo `ParadaModel` con relación a `ProcesoXTarjeta` y `CodigoDeParada`.
- **Servicios**: `ProcesoXtarjetaService` añade `RegistrarParada()` y `ObtenerParadas()`. Llama a `CodigoDeParadaService` para cargar códigos.
- **Componentes**: `DetalleTarjetaComponent` se reestructura profundamente. `KanbanCardComponent` añade barras de cantidad. `KanbanBoardComponent` actualiza lógica de clasificación de columnas.
- **Backend**: Ya implementado — frontend debe consumir los endpoints actualizados.
