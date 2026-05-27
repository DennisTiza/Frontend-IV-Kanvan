## 1. Redirección dinámica post-login

- [x] 1.1 Crear función auxiliar `ObtenerPrimerMenu` en `SeguridadService` que lea los items del menú desde localStorage y devuelva la ruta del primero, o `/inicio` si está vacío
- [x] 1.2 Modificar `inicio.ts:52` para que después de `AlmacenarDatosUsuarioValidado` navegue al primer menú usando la nueva función
- [x] 1.3 Modificar `validar-sesion-inactiva.guard.ts:26` para que redirija al primer menú en vez de `/seguridad/usuario`
- [x] 1.4 Modificar `app.routes.ts` para que el wildcard `**` redirija a un componente o use un guard que determine la ruta según el menú del usuario
- [x] 1.5 Verificar que todos los flujos funcionan para cada rol (gerente → usuarios, admin → productos, operario → tarjeta producción)

## 2. Agregar "Tarjeta De Producción" al menú lateral

- [x] 2.1 Agregar entrada en `configuracion.menu.ts` para menú ID 2 con título "Tarjeta De Producción", ruta `/parametros/tarjeta-produccion/listar-tarjeta-produccion` y acción `Listar`
- [x] 2.2 Agregar ruta en `app.routes.ts` para `/parametros/tarjeta-produccion/listar-tarjeta-produccion` con `ValidarSesionActivaGuard`
- [x] 2.3 Verificar que operario y admin ven el ítem en el menú lateral, y gerente no lo ve

## 3. Componente de listado de tarjetas de producción

- [x] 3.1 Crear estructura de directorios `modules/parametros/tarjeta-produccion/listar-tarjeta-produccion/`
- [x] 3.2 Crear modelo `TarjetaProduccionModel` con campos mínimos (id, codigo, fecha, estado, etc.)
- [x] 3.3 Crear servicio `tarjeta-produccion.service.ts` con método `ListarTarjetas()` que consuma el endpoint del backend
- [x] 3.4 Crear componente `ListarTarjetaProduccion` con tabla HTML que muestre las tarjetas
- [x] 3.5 Implementar lógica de permisos en el componente para mostrar/ocultar botones según el rol (admin: crear/editar/eliminar; operario: solo editar)
- [x] 3.6 Agregar configuración de ruta backend en `configuracion.rutas.backend.ts` si es necesario
