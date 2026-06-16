## Why

Actualmente cuando un operario reporta cantidad en el kanban, no se registra qué operario de los asignados al proceso realizó el trabajo. La trazabilidad es incompleta: se sabe cuánto se produjo y dónde, pero no quién lo hizo. El backend ya implementó una nueva entidad `RegistroDeCantidad` y endpoints actualizados que requieren `operarioId` al reportar cantidad (vía parada o finalización). El frontend debe adaptarse para capturar y enviar el operario que reporta.

## What Changes

- **Selector de operario en input de cantidad**: Cada proceso activo ahora muestra un `<select>` con los operarios asignados (`operarioXProcesoXTarjetas`) cuando el operario ingresa una cantidad a reportar. El select está vacío por defecto y es obligatorio elegir.
- **operarioId en paradas**: `RegistrarParada` ahora envía `operarioId` en el body. El modelo `ParadaModel` se actualiza con `operarioId` y `operario` (relación).
- **operarioId en finalización**: `FinalizarProceso` envía `operarioId` cuando hay `cantidadReportada`. Sin cantidad reportada (finalizar sin reportar), no se envía operario.
- **Nuevo endpoint registros-cantidad**: Se agrega método `ObtenerRegistrosCantidad()` al servicio para consultar el histórico completo de reportes del nuevo endpoint `GET /proceso-x-tarjeta/{id}/registros-cantidad`.
- **Modelo `RegistroDeCantidadModel`**: Nuevo modelo para tipar la respuesta del endpoint de registros.

## Capabilities

### New Capabilities
- `registro-cantidad-operario`: Captura del operario que reporta cantidad en cada acción del proceso (parada o finalización), con historial completo de registros.

### Modified Capabilities
- `kanban-proceso-accion`: Las acciones de registrar parada y finalizar proceso ahora requieren `operarioId`. El flujo de UI cambia para incluir un selector de operario en la fila de input de cantidad.

## Impact

- **Modelos**: Nuevo `RegistroDeCantidadModel`. Actualización de `ParadaModel` con `operarioId` y `operario`.
- **Servicios**: `ProcesoXtarjetaService` actualiza firmas de `FinalizarProceso` y `RegistrarParada`. Nuevo método `ObtenerRegistrosCantidad()`.
- **Componentes**: `DetalleTarjetaComponent` añade selector de operario, señal `operarioSeleccionado`, y lógica de validación. `KanbanBoardComponent` actualiza llamadas para incluir `operarioId`.
- **Backend**: Ya implementado — frontend debe consumir los endpoints actualizados.
