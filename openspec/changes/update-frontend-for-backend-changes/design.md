## Context

Aplicación Angular 21 standalone (sin NgModules), con componentes standalone, signals, ChangeDetectionStrategy.OnPush y RxJS 7.8. El backend LoopBack actualizó sus modelos: eliminó el modelo Operario (reemplazado por Usuario con relación hasMany a ProcesoXTarjeta), agregó productoId a TarjetaDeProduccion, trasladó cantidad/tiempo de ProductoXProceso a ProcesoXTarjeta, y agregó endpoints para relaciones (proceso-x-tarjetas/{id}/usuario, usuarios/{id}/proceso-x-tarjetas, tarjeta-de-produccion/{id}/producto).

Actualmente el frontend solo lista tarjetas (sin crear/editar/eliminar funcional). No existe modelo ni servicio para ProcesoXTarjeta. El menú lateral se construye dinámicamente desde permisos.

## Goals / Non-Goals

**Goals:**
- Sincronizar modelos del frontend con los cambios del backend (TarjetaProduccionModel, ProductoXProcesoModel, nuevo ProcesosXTarjetaModel)
- Implementar formulario de creación de tarjeta con selector de producto
- Implementar pantalla de edición de procesos por tarjeta (asignar usuario, cantidad, tiempo)
- Implementar tablero de tarjetas activas para operarios
- Eliminar toda referencia a "Operario" en el frontend
- Extender TarjetaProduccionService con métodos CRUD completos
- Crear ProcesosXTarjetaService con endpoints de relación

**Non-Goals:**
- No se modificará la lógica de autenticación ni guards
- No se implementará lazy loading (se mantiene el modelo actual de rutas eager)
- No se agregará un interceptor HTTP (los tokens se siguen manejando via localStorage + BehaviorSubject)
- No se modificará el sistema de menú dinámico ni permisos

## Decisions

### 1. Modelos separados vs compartidos entre crear/editar/listar
**Decisión**: Mantener el patrón actual de modelos TypeScript class en `models/`. Se crea `procesos-x-tarjeta.model.ts` y se actualizan `tarjeta-produccion.model.ts` y `productoXProceso.model.ts`.
**Alternativa**: Usar interfaces en lugar de clases. Se descarta porque el proyecto existente usa clases.
**Alternativa**: Modelos inline en cada componente. Se descarta porque hay componentes que comparten estos modelos.

### 2. Servicio ProcesosXTarjetaService como servicio separado
**Decisión**: Nuevo servicio `ProcesosXTarjetaService` en `services/parametros/` siguiendo el patrón de `ProductoXProcesoService`.
**Alternativa**: Incluir métodos en TarjetaProduccionService. Se descarta porque el endpoint base es diferente (`/proceso-x-tarjeta` vs `/tarjeta-produccion`) y el principio de responsabilidad única es más claro con servicios separados.

### 3. Componentes standalone para nuevas pantallas
**Decisión**: Todos los nuevos componentes serán standalone con `ChangeDetectionStrategy.OnPush`, siguiendo el patrón de los componentes existentes (CrearProceso, ListarTarjetaProduccion).
**Justificación**: Consistencia con el resto del proyecto y mejor rendimiento.

### 4. Navegación entre crear → editar procesos
**Decisión**: Después de crear exitosamente una tarjeta via POST, redirigir a la ruta de edición de procesos (`/parametros/tarjeta-produccion/editar-procesos/{id}`). La pantalla de edición obtiene los procesos con el endpoint incluido.
**Alternativa**: Modal inline en la misma página. Se descarta porque la edición de procesos tiene suficiente complejidad (cargar usuarios, múltiples procesos) como para merecer su propia pantalla.

### 5. Tablero operario como ruta separada
**Decisión**: Ruta independiente `/parametros/tarjeta-produccion/tablero-operario` con su propio componente.
**Justificación**: Los operarios necesitan ver todas las tarjetas activas en un formato de tablero/lista, no una tabla. Además, se puede agregar un item de menú separado con permiso específico si es necesario.

### 6. Load de usuarios en el componente editor de procesos
**Decisión**: El componente `EditarProcesosTarjeta` cargará la lista de usuarios desde `SeguridadService.obtenerUsuarios()` al inicializar.
**Alternativa**: Pasar usuarios como @Input. Se descarta porque el componente gestiona su propia carga de datos.

### 7. Actualización de ProductoXProcesoModel
**Decisión**: Eliminar los campos `cantidad` y `tiempo` del modelo `ProductoXProcesoModel` del frontend, reflejando el cambio del backend donde ahora solo tiene `id`, `orden`, `productoId`, `procesoId`.
**Justificación**: Si el frontend envía campos que el backend ya no espera, puede causar errores de validación o datos inconsistentes.

## Risks / Trade-offs

- **Riesgo**: El endpoint `GET /tarjeta-de-produccion/{id}/proceso-x-tarjetas?filter[include][]=proceso&filter[include][]=usuario` puede devolver datos anidados complejos. **Mitigación**: Definir una interfaz `ProcesosXTarjetaResponse` que modele la respuesta incluyendo las relaciones `proceso` y `usuario`.
- **Riesgo**: El tablero operario carga todas las tarjetas activas con sus procesos. Si hay muchas tarjetas, el rendimiento puede degradarse. **Mitigación**: Por ahora no se implementa paginación (el proyecto usa paginación de 20 registros); si es necesario, se agregará filtro adicional.
- **Trade-off**: Mantener las rutas eager (no lazy loading) significa que todos los componentes se cargan al inicio. Es aceptable para el tamaño actual del proyecto.
