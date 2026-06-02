## Context

El componente `KanbanCardComponent` (en `kanban-card.ts`) tiene un timer que se inicia en `ngOnInit` cuando detecta un proceso activo via `obtenerProcesoActivo()`. El método `actualizarTiempo()` calcula el tiempo restante cada 1s mediante `setInterval`. Se desconoce si el problema es de datos (campos ausentes en la respuesta API) o de ciclo de vida (el componente no arranca el timer). Se agrega logging estructurado para inspeccionar el flujo completo.

## Goals / Non-Goals

**Goals:**
- Agregar `console.log` en `actualizarTiempo()` que muestre los valores de entrada (`procesoActivo.tiempo`, `procesoActivo.fechaInicio`) y los valores calculados (`estimadoMs`, `transcurrido`, `restante`, `progreso`)
- Identificar si el problema es de datos, de ciclo de vida del componente, o de cambio de detección con OnPush

**Non-Goals:**
- No se modifica lógica de negocio, UI, ni comportamiento
- No se arregla el timer — solo se diagnostica

## Decisions

| Decisión | Opciones | Elección | Razón |
|----------|----------|----------|-------|
| Formato del log | Objeto JSON vs texto plano | Múltiples `console.log` con etiquetas claras | Más fácil de leer en consola del navegador. Cada valor se etiqueta individualmente. |
| Flags de depuración | Variable global vs siempre loguear | Siempre loguear sin flag | Cambio temporal y mínimo. El log solo se ejecuta 1 vez por segundo mientras hay proceso activo. Se eliminará al finalizar el diagnóstico. |
| Método a loguear | `actualizarTiempo()` vs `ngOnInit()` | Ambos | `ngOnInit` confirma si el timer arranca. `actualizarTiempo` muestra los datos reales del cálculo. |

## Risks / Trade-offs

- **Riesgo menor**: Los `console.log` cada 1 segundo pueden ensuciar la consola. → Se limitan a 2 outputs (ngOnInit y actualizarTiempo), y se eliminarán tras el diagnóstico.
- **Sin riesgo de producción**: No hay cambio en lógica de negocio, solo logging de depuración.
