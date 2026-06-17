## Why

Cuando el input de cantidad iguala a la cantidad total del proceso (ej: 100/100), el botón "Registrar Parada" sigue visible junto al botón "Finalizar". No debería aparecer porque el proceso está completo — solo debería mostrarse "Finalizar".

## What Changes

- Agregar condición `&& input < (proceso.cantidad ?? 0)` en `puedeRegistrarParada()`
- El botón "Registrar Parada" se oculta cuando input === cantidad total

## Capabilities

### New Capabilities
- *(none)*

### Modified Capabilities
- `registro-paradas`: se refuerza que el botón no aparece cuando cantidad está completa

## Impact

- `src/app/modules/parametros/tarjeta-produccion/kanban-board/detalle-tarjeta/detalle-tarjeta.ts`: línea 100, agregar `&& input < cantidad`
