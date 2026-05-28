## Why

El backend actualizó los modelos TarjetaDeProduccion, ProcesoXTarjeta, ProductoXProceso y Usuario (eliminando el modelo Operario). El frontend debe sincronizarse con estos cambios para: permitir la creación de tarjetas con selección de producto, asignar usuarios a procesos de tarjeta, mostrar un tablero de tarjetas activas para operarios, y reemplazar toda referencia a "Operario" por "Usuario".

## What Changes

- **BREAKING**: Eliminar toda referencia a "Operario" — reemplazar por "Usuario" en modelos, servicios, componentes y lógica de roles
- **Nuevo**: Formulario de creación de Tarjeta de Producción con selector de producto
- **Nuevo**: Pantalla de edición de procesos por tarjeta (asignar usuario, cantidad, tiempo)
- **Nuevo**: Tablero de visualización para operarios con tarjetas activas y sus procesos
- **Modificado**: Servicio TarjetaProduccionService con métodos create, getById, update, delete
- **Nuevo**: Servicio ProcesosXTarjetaService con CRUD y endpoints de relación
- **Modificado**: Modelo TarjetaProduccionModel con campos fechaInicio, fechaFinal
- **Modificado**: Modelo ProductoXProcesoModel eliminar cantidad, tiempo (solo orden, productoId, procesoId)
- **Nuevo**: Modelo ProcesosXTarjetaModel con campos usuarioId, cantidad, tiempo
- **Nuevo**: Rutas para creación de tarjeta, edición de procesos y tablero operario

## Capabilities

### New Capabilities
- `tarjeta-produccion-crear`: Formulario de creación de tarjeta con selector de producto y redirección a edición de procesos
- `tarjeta-produccion-editar-procesos`: Pantalla para asignar usuario, cantidad y tiempo a cada proceso de una tarjeta
- `tarjeta-produccion-tablero-operario`: Tablero de tarjetas activas con procesos visibles para operarios

### Modified Capabilities
- `tarjeta-produccion-listar`: Actualizar listado para incluir acciones de crear funcionales y redirección a edición de procesos
- *(redireccion-dinamica-post-login)*: Sin cambios

## Impact

- **Modelos**: TarjetaProduccionModel, ProductoXProcesoModel actualizados; nuevo ProcesosXTarjetaModel
- **Servicios**: TarjetaProduccionService extendido; nuevo ProcesosXTarjetaService
- **Componentes**: ListarTarjetaProduccion actualizado; nuevos componentes crear-tarjeta-produccion, editar-procesos-tarjeta, tablero-operario
- **Rutas**: Nuevas rutas agregadas en app.routes.ts
- **Menú**: Posible nuevo item de menú para el tablero operario
- **CSS**: Nuevos estilos para formularios de creación y tablero operario
