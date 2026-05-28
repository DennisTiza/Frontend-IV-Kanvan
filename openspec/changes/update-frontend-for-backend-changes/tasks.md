## 1. Actualizar modelos del frontend

- [x] 1.1 Actualizar `TarjetaProduccionModel`: cambiar campo `fecha` por `fechaInicio`, agregar `fechaFinal`
- [x] 1.2 Actualizar `ProductoXProcesoModel`: eliminar campos `cantidad` y `tiempo`
- [x] 1.3 Crear `ProcesosXTarjetaModel` con campos: `id`, `procesoId`, `tarjetaDeProduccionId`, `usuarioId`, `cantidad`, `tiempo`, más las relaciones anidadas `proceso` (ProcesoModel) y `usuario` (UsuarioModel) para la respuesta del API

## 2. Actualizar y crear servicios

- [x] 2.1 Extender `TarjetaProduccionService`: agregar métodos `CrearTarjeta(datos)` (POST), `BuscarTarjeta(id)` (GET), `EliminarTarjeta(id)` (DELETE), `ListarTarjetasActivasConProcesos()` (GET con filtro activa e includes)
- [x] 2.2 Crear `ProcesosXTarjetaService` con métodos: `ListarPorTarjeta(id)` (GET con includes de proceso y usuario), `ActualizarProcesoXTarjeta(id, datos)` (PATCH)

## 3. Crear componente de creación de tarjeta

- [x] 3.1 Crear componente standalone `CrearTarjetaProduccion` en `modules/parametros/tarjeta-produccion/crear-tarjeta/`
- [x] 3.2 Implementar formulario reactivo con campos: codigo, productoId (selector), cantidad, fechaInicio, fechaFinal, estado
- [x] 3.3 Cargar lista de productos desde `ProductoService` para el selector
- [x] 3.4 Implementar envío POST al backend y redirección a editar-procesos/{id} en éxito
- [x] 3.5 Agregar estilos CSS para el formulario

## 4. Crear componente de edición de procesos por tarjeta

- [x] 4.1 Crear componente standalone `EditarProcesosTarjeta` en `modules/parametros/tarjeta-produccion/editar-procesos/`
- [x] 4.2 Implementar carga de procesos via `ProcesosXTarjetaService.ListarPorTarjeta(id)`
- [x] 4.3 Cargar lista de usuarios desde `SeguridadService.obtenerUsuarios()`
- [x] 4.4 Mostrar tabla con filas editables: proceso (solo lectura), usuario (select), cantidad (input), tiempo (input)
- [x] 4.5 Implementar botón "Actualizar" por fila que envía PATCH al backend
- [x] 4.6 Agregar estilos CSS para la tabla de edición

## 5. Crear componente de tablero para operarios

- [x] 5.1 Crear componente standalone `TableroOperario` en `modules/parametros/tarjeta-produccion/tablero-operario/`
- [x] 5.2 Implementar carga de tarjetas activas con procesos via `TarjetaProduccionService.ListarTarjetasActivasConProcesos()`
- [x] 5.3 Mostrar tablero con tarjetas agrupadas: código, nombre del producto y lista de procesos con nombre, usuario asignado, cantidad, tiempo
- [x] 5.4 Agregar estilos CSS para el tablero

## 6. Agregar rutas

- [x] 6.1 Agregar ruta `/parametros/tarjeta-produccion/crear-tarjeta` → `CrearTarjetaProduccion`
- [x] 6.2 Agregar ruta `/parametros/tarjeta-produccion/editar-procesos/:id` → `EditarProcesosTarjeta`
- [x] 6.3 Agregar ruta `/parametros/tarjeta-produccion/tablero-operario` → `TableroOperario`

## 7. Actualizar componente de listado de tarjetas existente

- [x] 7.1 Conectar botón "Crear Tarjeta" para navegar a `/parametros/tarjeta-produccion/crear-tarjeta`
- [x] 7.2 Conectar botón "Editar" para navegar a `/parametros/tarjeta-produccion/editar-procesos/{id}`
- [x] 7.3 Implementar botón "Eliminar" con confirmación y llamada DELETE al servicio
- [x] 7.4 Importar `RouterModule` y usar `Router` en el componente

## 8. Eliminar referencias a "Operario"

- [x] 8.1 Actualizar etiquetas y textos en `crear-usuario` component: cambiar "operario" role CSS class y referencias en templates
- [x] 8.2 Verificar que no haya referencias residuales a "Operario" en ningún componente o servicio
