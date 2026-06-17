## Why

Actualmente `puedeFinalizar()` compara el input contra `getMaxPermitido()` en lugar de `proceso.cantidad`. Esto causa que un proceso se pueda "finalizar" con 30 unidades si el proceso anterior solo ha entregado 30, cuando el proceso debería completarse recién al llegar a su propia cantidad total (ej: 100). Además, el input permite escribir cualquier valor sin validación, pudiendo superar lo producido por el proceso anterior sin advertencia.

## What Changes

- **Corregir `puedeFinalizar()`**: cambiar la condición de `input === getMaxPermitido` a `input === proceso.cantidad`. Un proceso solo se completa cuando alcanza su propia cantidad total, no cuando alcanza el límite impuesto por el proceso anterior.
- **Agregar validación en `onInputChange()`**: si el usuario escribe un valor mayor a `getMaxPermitido`, mostrar un modal de advertencia y NO actualizar el valor del input.
- **Agregar modal de advertencia**: componente modal simple que muestra "No se puede colocar una cantidad mayor a la del proceso anterior".

## Capabilities

### New Capabilities
Ninguna.

### Modified Capabilities
- `kanban-proceso-accion`: Modificar el requisito de Finalizar para que solo se habilite cuando `input === cantidad` del proceso. Agregar requisito de validación de límite contra el proceso anterior con modal de advertencia.

## Impact

- `src/app/modules/parametros/tarjeta-produccion/kanban-board/detalle-tarjeta/detalle-tarjeta.ts`: Modificar `puedeFinalizar()` y `onInputChange()`
- `src/app/modules/parametros/tarjeta-produccion/kanban-board/detalle-tarjeta/detalle-tarjeta.html`: Agregar modal de advertencia
- `src/app/modules/parametros/tarjeta-produccion/kanban-board/detalle-tarjeta/detalle-tarjeta.css`: Estilos del modal de advertencia
