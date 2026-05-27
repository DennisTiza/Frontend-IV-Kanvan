## Why

Al iniciar sesión, todos los usuarios (operario, administrador, gerente) son redirigidos a la pantalla de Usuarios (`/seguridad/crear-usuario`) porque la ruta post-login está hardcodeada. El gerente tiene permiso para verla, pero el operario y el administrador no deberían tener acceso a esa pantalla. Cada rol debe llegar a su primer menú permitido. Además, el operario no tiene ninguna pantalla visible como destino porque el menú "Tarjeta De Producción" (menú ID 2) no está mapeado en el frontend.

## What Changes

1. **Redirección post-login dinámica**: En lugar de navegar a `/seguridad/crear-usuario` fijo, leer el primer ítem del menú construido según los permisos del rol y navegar allí.
2. **Wildcard route (`**`)**: Cambiar la redirección del wildcard para que use la misma lógica dinámica en vez de apuntar siempre a usuarios.
3. **Guard `ValidarSesionInactiva`**: Reemplazar la redirección hardcodeada a `/seguridad/usuario` por la navegación al primer ítem del menú.
4. **Agregar "Tarjeta De Producción" al menú lateral**: Mapear el menú ID 2 (`Tarjeta De Produccion`) en `configuracion.menu.ts` con una ruta nueva y acción `Listar` para que operarios puedan verlo.
5. **Crear componente listar-tarjeta-produccion**: Vista básica de listado para que el operario tenga una pantalla de destino por defecto.
6. **Permisos diferenciados**: El operario ve el menú (Listar=1) pero solo tiene botones habilitados según sus permisos (Listar, Editar). El administrador tiene acceso completo.

## Capabilities

### New Capabilities

- `tarjeta-produccion-listar`: Listado de tarjetas de producción con permisos según el rol. El operario puede ver y editar; el administrador tiene control total.
- `redireccion-dinamica-post-login`: Sistema de navegación post-login que redirige al primer menú disponible del usuario según sus permisos almacenados.

### Modified Capabilities

<!-- No existing capabilities to modify -->

## Impact

- **Archivos a modificar**:
  - `src/app/public/inicio/inicio.ts` — cambiar redirección post-login
  - `src/app/app.routes.ts` — cambiar wildcard route
  - `src/app/guard/validar-sesion-inactiva.guard.ts` — cambiar redirección
  - `src/app/config/configuracion.menu.ts` — agregar menú Tarjeta Producción
- **Archivos nuevos**:
  - `src/app/modules/parametros/tarjeta-produccion/listar-tarjeta-produccion/listar-tarjeta-produccion.ts`
  - `src/app/modules/parametros/tarjeta-produccion/listar-tarjeta-produccion/listar-tarjeta-produccion.html`
  - `src/app/modules/parametros/tarjeta-produccion/listar-tarjeta-produccion/listar-tarjeta-produccion.css`
- **Backend**: Se espera que exista un endpoint para listar tarjetas de producción. Si no existe, se necesitará crear.
- **Base de datos**: Ya existe la configuración de menús y permisos. No requiere cambios en el esquema existente.
