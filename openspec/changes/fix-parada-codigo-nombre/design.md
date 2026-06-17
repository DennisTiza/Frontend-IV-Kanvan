## Context

El backend incluye la relación `CodigoDeParada` en `GET /proceso-x-tarjeta/{id}/paradas` bajo el nombre `codigoDeParada` (nombre generado por LoopBack para el `@belongsTo`). El frontend `ParadaModel` tenía la propiedad nombrada `codigo`, por lo que el objeto anidado nunca se asignaba y el template siempre caía al fallback `'Sin código'`.

```
Backend response:
{
  "id": 1,
  "codigoDeParadaId": 3,
  "codigoDeParada": { "id": 3, "codigo": "M01", "descripcion": "Mantenimiento" },
  ...
}

Frontend esperaba:
  codigo?: CodigoDeParadaModel    ← undefined, no coincide con "codigoDeParada"

Frontend corregido:
  codigoDeParada?: CodigoDeParadaModel  ← ahora coincide
```

## Goals / Non-Goals

**Goals:**
- Alinear el nombre de la propiedad de navegación en `ParadaModel` con la respuesta del backend
- Las paradas muestran el código/descripción correctamente en el historial

**Non-Goals:**
- No se cambia la estructura del `CodigoDeParadaModel`
- No se cambia lógica de negocio
- No se cambia el backend

## Decisions

### D1: Renombrar `codigo` → `codigoDeParada` en ParadaModel

**Decisión**: Cambiar la propiedad `codigo` a `codigoDeParada` en `ParadaModel` y actualizar la única referencia en el template.

```
// Antes
export class ParadaModel {
    codigoDeParadaId?: number;
    codigo?: CodigoDeParadaModel;
}

// Después
export class ParadaModel {
    codigoDeParadaId?: number;
    codigoDeParada?: CodigoDeParadaModel;
}
```

**Alternativa considerada**: Mapear en el servicio con `pipe(map(...))` para renombrar la propiedad. Se descartó porque es más código, más complejo, y menos directo que corregir el modelo.

**Alternativa considerada**: Cambiar el backend para que incluya como `codigo` en lugar de `codigoDeParada`. Se descartó porque el nombre de la relación en LoopBack sigue la convención del `@belongsTo` y cambiarlo podría causar inconsistencia con otras consultas.

### D2: Actualizar template

**Decisión**: Cambiar `parada.codigo?.descripcion` → `parada.codigoDeParada?.descripcion` (y similar para `codigo`).

## Risks / Trade-offs

| Riesgo | Mitigación |
|--------|------------|
| Otra parte del código use `parada.codigo` | Búsqueda con grep confirma que solo hay una referencia en el template |
