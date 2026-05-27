## Context

Actualmente el flujo post-login está hardcodeado en 3 lugares para redirigir siempre a `/seguridad/crear-usuario` (pantalla de Usuarios). El menú lateral se construye dinámicamente según permisos, pero la navegación inicial no consulta esa información. Además, el menú "Tarjeta De Producción" (ID 2 en BD) no está mapeado en `configuracion.menu.ts`, por lo que ningún usuario puede verlo en el sidebar aunque tenga permisos.

```
Estado actual:
  Login → [hardcode] → /seguridad/crear-usuario (Usuarios)
                        ↑ gerente ok, admin/operario no deberían

  configuracion.menu.ts:
    ID 1 → Usuarios     → /seguridad/crear-usuario
    ID 3 → Productos    → /parametros/producto/crear-producto
    ID 4 → Procesos     → /parametros/proceso/crear-proceso
    ID 2 → ❌ No existe → Tarjeta Producción invisible
```

## Goals / Non-Goals

**Goals:**
- Redirigir a cada usuario al primer ítem de su menú construido según permisos
- Agregar "Tarjeta De Producción" al menú lateral con visibilidad controlada por permiso `Listar`
- Crear un componente de listado de tarjetas de producción (vista mínima para operarios)
- Reflejar permisos diferenciados en los botones de acción del listado (operario: listar/editar; admin: todo)

**Non-Goals:**
- No se implementarán crear/eliminar tarjetas de producción (quedan para cambios futuros)
- No se modificará el backend ni la base de datos (se asume que el endpoint de listado ya existe)
- No se reestructurará el sistema de rutas de Angular (solo se ajustan las redirecciones)

## Decisions

1. **Navegación dinámica post-login** — En vez de redirigir a una ruta fija, se leerán los items del menú desde `localStorage` (donde ya los guarda `AlmacenarItemsMenu`) y se navegará a `items[0].ruta`. Si no hay items, se redirige a `/inicio`. Esto aplica a los 3 puntos:
   - `inicio.ts` después de `AlmacenarDatosUsuarioValidado`
   - Guard `ValidarSesionInactiva` cuando ya hay sesión activa
   - Wildcard route `**` en `app.routes.ts` → se redirige a un componente que hace la misma lógica, o se usa un guard.

2. **Acción "Listar" como puerta de visibilidad** — Para "Tarjeta De Producción" se usará `accion: "Listar"` en lugar de `accion: "Guardar"` porque el operario no tiene permiso de guardar pero sí de listar. Esto permite que el operario vea el menú en el sidebar.

3. **Componente de listado unificado** — Un solo componente `ListarTarjetaProduccion` que muestra la tabla y determina qué botones mostrar según los permisos del usuario (leyendo el permiso desde `localStorage` o desde el `UsuarioValidadoModel.menu`).

4. **Permisos en el listado** — El componente leerá los permisos del menú ID 2 desde la sesión para habilitar/deshabilitar botones:
   - `Listar`: Siempre true (si no, no vería el menú)
   - `Guardar`: Solo admin → ocultar botón "Crear"
   - `Editar`: Ambos → mostrar botón "Editar"
   - `Eliminar`: Solo admin → ocultar botón "Eliminar"

## Risks / Trade-offs

- **[Riesgo]** Dependencia de `localStorage` para la redirección → **Mitigación**: Los items del menú ya se persisten en localStorage en el flujo normal; si no existen es porque no hay sesión, y se redirige a `/inicio`.
- **[Riesgo]** El endpoint de listado de tarjetas de producción puede no existir en el backend → **Mitigación**: Verificar disponibilidad del endpoint; si no existe, crear una vista mockeada o placeholder.
- **[Trade-off]** Usar `Listar` como puerta de visibilidad funciona para este caso pero no escala si se necesitan reglas más complejas → **Mitigación**: Si surgen casos complejos, se puede agregar un campo `visibleSi` en el config del menú. Por ahora `Listar` es suficiente.
