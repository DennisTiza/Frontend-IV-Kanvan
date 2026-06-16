## Why

Cuando el input de un proceso iguala al `maxPermitido` (lo que el proceso anterior ha registrado) pero aún no alcanza la `cantidad` total, `puedeRegistrarParada()` retorna `false` porque usa `<` en vez de `<=`. El operario no ve ningún botón de acción a pesar de haber procesado unidades válidas.

## What Changes

- Cambiar la condición en `puedeRegistrarParada()` de `input < maxPermitido` a `input <= maxPermitido`
- El botón "Registrar Parada" se habilita también cuando `input === maxPermitido` (siempre que `input > cantidadRegistrada`)

## Capabilities

### New Capabilities
- *(none)*

### Modified Capabilities
- `kanban-proceso-accion`: se modifica la condición de habilitación del botón "Registrar Parada"

## Impact

- `src/app/modules/parametros/tarjeta-produccion/kanban-board/detalle-tarjeta/detalle-tarjeta.ts`: línea 100, cambiar `<` por `<=`
