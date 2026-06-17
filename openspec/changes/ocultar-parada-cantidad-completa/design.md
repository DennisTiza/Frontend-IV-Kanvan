## Context

`puedeRegistrarParada()` actualmente retorna `true` cuando `input > cantidadRegistrada && input <= maxPermitido`. Si el usuario escribe la cantidad total (ej: 100) y el proceso anterior lo permite (`maxPermitido >= cantidad`), ambos botones "Registrar Parada" y "Finalizar" se muestran simultáneamente.

El botón "Registrar Parada" no tiene sentido cuando el proceso está completo — el operario debería ver solo "Finalizar".

## Goals / Non-Goals

**Goals:**
- Ocultar "Registrar Parada" cuando `input === cantidad` (proceso completo)
- Solo "Finalizar" se muestra en ese estado

**Non-Goals:**
- No se cambia `puedeFinalizar()`
- No se cambia la lógica de inicio, timer, o cantidades

## Decisions

### D1: Agregar `&& input < cantidad` a `puedeRegistrarParada()`

**Decisión**: En `puedeRegistrarParada()`, agregar la condición de que el input sea estrictamente menor a la cantidad total del proceso.

```
// Antes
return input > (proceso.cantidadRegistrada ?? 0) && input <= maxPermitido;

// Después
return input > (proceso.cantidadRegistrada ?? 0) && input <= maxPermitido && input < (proceso.cantidad ?? 0);
```

**Alternativa considerada**: Comparar `maxPermitido` vs `cantidad` dentro de la función. Se descartó porque la condición directa `input < cantidad` es más clara y explícita.

## Risks / Trade-offs

| Riesgo | Mitigación |
|--------|------------|
| Ninguno — la función ya tenía una estructura similar y `input < cantidad` es una guarda simple | |
