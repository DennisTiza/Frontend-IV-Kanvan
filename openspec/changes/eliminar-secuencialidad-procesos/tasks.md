## 1. DetalleTarjetaComponent — Lógica de acceso

- [x] 1.1 Modificar `puedeAcceder()` para que retorne siempre `true`, eliminando el chequeo secuencial de `cantidadRegistrada` del proceso anterior
- [x] 1.2 Modificar `puedeIniciarReanudar()` para eliminar la llamada a `!this.puedeAcceder(proceso)` (línea 83)
- [x] 1.3 Modificar `mostrarTooltipBloqueado()` para que retorne siempre `''`, el tooltip de proceso bloqueado ya no aplica

## 2. DetalleTarjetaComponent — Vista

- [x] 2.1 Eliminar el bloque condicional del botón "Bloqueado" en `detalle-tarjeta.html` (líneas 119-126), incluyendo el `tooltip-wrapper`

## 3. KanbanCardComponent — Lógica

- [x] 3.1 Eliminar el método `obtenerSiguienteDisponible()` de `kanban-card.ts`

## 4. KanbanCardComponent — Vista

- [x] 4.1 Eliminar el bloque condicional del indicador "→ <proceso> disponible" en `kanban-card.html` (líneas 51-56)

## 5. Verificación

- [x] 5.1 Ejecutar build (`ng build` o equivalente) y verificar que no hay errores de compilación
- [x] 5.2 Verificar que en el modal de detalle todos los procesos pendientes muestran botón "Iniciar" sin importar el estado del proceso anterior (confirmado por revisión de código: `puedeAcceder()` siempre retorna `true`, no hay chequeo secuencial)
- [x] 5.3 Verificar que en la KanbanCard ya no aparece el indicador "→ disponible" (confirmado por revisión de código: método `obtenerSiguienteDisponible()` y su bloque HTML eliminados)
- [x] 5.4 Verificar que `getMaxPermitido()` sigue limitando el input máximo al avance del proceso anterior (confirmado por revisión de código: función sin modificar)
