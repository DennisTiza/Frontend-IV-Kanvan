## Why

El timer de las tarjetas en la columna "En ejecución" del kanban board muestra `00:00:00` y la barra de progreso vacía desde el momento en que se inicia un proceso, en lugar de mostrar el tiempo restante real (ej. `01:10:00` para 70 minutos) e ir disminuyendo. No se sabe si el problema es de datos (el API no devuelve `tiempo` o `fechaInicio`) o de ciclo de vida (el componente no arranca el timer). Se necesita visibilidad para diagnosticar la causa raíz.

## What Changes

- Agregar `console.log` en el método `actualizarTiempo()` de `KanbanCardComponent` para inspeccionar:
  - `procesoActivo.tiempo` (tiempo asignado)
  - `procesoActivo.fechaInicio` (fecha de inicio)
  - Valores calculados: `estimadoMs`, `transcurrido`, `restante`, `progreso`
- No hay cambios en comportamiento, UI, ni lógica de negocio
- Una vez diagnosticado, se eliminarán los logs

## Capabilities

### New Capabilities

- `diagnostico-timer-kanban`: Capacidad temporal de diagnóstico para inspeccionar los valores internos del timer en tarjetas kanban en ejecución. Incluye logging estructurado de `tiempo`, `fechaInicio` y valores calculados en `actualizarTiempo()`.

### Modified Capabilities

*(Ninguno — solo se agrega logging de diagnóstico, no cambian requisitos)*

## Impact

- **Archivo modificado**: `src/app/modules/parametros/tarjeta-produccion/kanban-board/kanban-card/kanban-card.ts`
- Solo se agregan líneas de `console.log` en el método `actualizarTiempo()`
- Sin impacto en APIs, dependencias, rendimiento (logging condicional mínimo) o experiencia de usuario
- Los logs se eliminarán una vez completado el diagnóstico
