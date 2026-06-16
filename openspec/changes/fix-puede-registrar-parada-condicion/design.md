## Context

`puedeRegistrarParada()` actualmente requiere `input < maxPermitido`. Cuando el operario reporta exactamente lo que el proceso anterior ha registrado (ej: input=20, maxPermitido=20), la condición `20 < 20` es falsa y ningún botón se habilita, aunque el valor sea válido y el proceso no esté completo.

```
Estado actual:
  input  = 20
  maxPermitido = 20  (min(P1.registrada=20, P2.cantidad=100))
  cantidad = 100

  puedeRegistrarParada: 20 > 0 && 20 < 20   → false  ← bug
  puedeFinalizar:        20 === 100           → false

  → ningún botón visible
```

## Goals / Non-Goals

**Goals:**
- `puedeRegistrarParada()` retorna `true` cuando `input === maxPermitido` (y `input > cantidadRegistrada`)
- El operario puede registrar una parada con todo el lote disponible del proceso anterior

**Non-Goals:**
- No se cambia `puedeFinalizar()`
- No se cambia `getMaxPermitido()`
- No se cambia lógica de inicio, columnas, o timer

## Decisions

### D1: Cambiar `<` por `<=` en comparación con `maxPermitido`

**Decisión**: En `puedeRegistrarParada()`, cambiar `input < maxPermitido` a `input <= maxPermitido`.

```
// Antes
return input > (proceso.cantidadRegistrada ?? 0) && input < maxPermitido;

// Después
return input > (proceso.cantidadRegistrada ?? 0) && input <= maxPermitido;
```

**Alternativa considerada**: Cambiar la condición a `input < cantidad` (ignorando maxPermitido). Se descartó porque rompe la validación del flujo serial — un proceso no debería reportar más de lo que el anterior ha producido.

## Riesgos / Trade-offs

| Riesgo | Mitigación |
|--------|------------|
| Cuando `input === cantidad === maxPermitido`, ambos botones (Parada y Finalizar) se muestran | El operario naturalmente hace clic en Finalizar. Es un caso poco común (input = total sin haber hecho parada antes). |
