## Why

El backend devuelve la relación del código de parada como `codigoDeParada` (nombre de la relación en LoopBack), pero el frontend la espera como `codigo` en `ParadaModel`. Esto causa que `parada.codigo` sea siempre `undefined` y todas las paradas se muestren como "Sin código".

## What Changes

- Renombrar propiedad `codigo` a `codigoDeParada` en `ParadaModel`
- Actualizar template `detalle-tarjeta.html` para usar `parada.codigoDeParada` en lugar de `parada.codigo`

## Capabilities

### New Capabilities
- *(none — bug fix)*

### Modified Capabilities
- *(none — solo cambios de implementación, no de comportamiento)*

## Impact

- `src/app/models/parada.model.ts`: renombrar propiedad `codigo` → `codigoDeParada`
- `src/app/modules/parametros/tarjeta-produccion/kanban-board/detalle-tarjeta/detalle-tarjeta.html`: actualizar `parada.codigo` → `parada.codigoDeParada`
