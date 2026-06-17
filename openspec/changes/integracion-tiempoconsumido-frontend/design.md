## Context

El modelo `ProcesoXTarjeta` ahora tiene `tiempo` (minutos, estimado original) y `tiempoConsumido` (segundos, acumulado en backend en cada parada/finalización). El frontend necesita adaptarse para:

1. Usar `tiempoConsumido` en el countdown multi-sesión
2. Reconocer el estado "pausado" (fechaInicio=null, registrada>0)
3. Mostrar tiempo real trabajado en card y detalle
4. Separar botones de acción visualmente

## Goals / Non-Goals

**Goals:**
- Timer countdown preciso a través de múltiples sesiones (inicio → parada → reanudar)
- Botón "Reanudar" visible solo para procesos pausados
- Display de tiempo consumido acumulado en card y modal
- Botones de acción con espaciado uniforme
- Input de cantidad respetando `max` según proceso anterior

**Non-Goals:**
- No se modifican endpoints del backend (ya implementados)
- No se cambia el modelo de datos en backend
- No se agregan nuevas dependencias externas

## Decisions

### Decisión 1: Cálculo del countdown multi-sesión

El timer en `KanbanCardComponent.actualizarTiempo()` cambia de:

```
// Antes: solo sesión actual
restante = (tiempo * 60 * 1000) - (ahora - fechaInicio)

// Ahora: acumulado multi-sesión (segundos)
sesion = (ahora - fechaInicio) / 1000
consumidoTotal = (tiempoConsumido ?? 0) + sesion
restante = max(0, (tiempo * 60) - consumidoTotal) * 1000
```

- `tiempoConsumido` = segundos acumulados por backend en paradas/finalizaciones
- `(ahora - fechaInicio) / 1000` = segundos de la sesión actual en vivo

**Alternativa considerada:** Dejar que el backend calcule el tiempo actualizado en cada request. Rechazada porque el timer necesita actualización cada segundo y no podemos hacer polling.

### Decisión 2: Guardia de botón Reanudar

`puedeIniciarReanudar()` cambia su segunda guardia de:

```
// Antes (mi cambio anterior — incorrecto con backend nuevo)
if (fechaInicio && !fechaFinal && registrada === 0) return false

// Ahora (correcto con backend limpiando fechaInicio)
if (fechaInicio && !fechaFinal) return false  // bloquea TODOS los activos
```

Razón: el backend ahora limpia `fechaInicio` en cada parada, así que un proceso activo SIEMPRE tiene `fechaInicio`. Si está activo, no debe mostrar Reanudar. Si está pausado, `fechaInicio` es null y pasa la guardia.

### Decisión 3: Display de tiempo consumido

El tiempo consumido se muestra en dos lugares:

- **Card Kanban**: Reemplazar el countdown actual con un display que muestre `consumidoTotal` formateado como `mm:ss` o `hh:mm:ss`. La barra de progreso temporal usa `consumidoTotal / (tiempo * 60)`.

- **Modal detalle**: Agregar junto al tiempo estimado el tiempo consumido real, ej: `estimado: 60 min | real: 35 min 20 s`.

### Decisión 4: Botones espaciados

Agregar `gap: 8px` a `.proceso-accion` en `detalle-tarjeta.css`. También considerar `flex-wrap: wrap` para evitar overflow en pantallas pequeñas.

### Decisión 5: Nuevo campo en modelo TypeScript

Agregar `tiempoConsumido?: number` al modelo `ProcesoXTarjetaModel`. Es opcional (`?`) para compatibilidad con datos existentes que no tengan el campo.

## Risks / Trade-offs

- [**Precisión**] El cálculo del countdown asume que `tiempo` (estimado) y `tiempoConsumido` (real) están en unidades consistentes. Si backend cambiara la unidad de `tiempoConsumido`, el countdown se rompe. → Mitigación: ambos están documentados en el modelo, revisar en code review.

- [**Datos existentes**] Las tarjetas creadas antes del cambio de backend no tienen `tiempoConsumido`. El frontend trata `null` como `0`, así que el timer simplemente no muestra tiempo consumido previo. → Mitigación: aceptable, las nuevas tarjetas tendrán el campo.

- [**Auto-finalizar**] Si el backend auto-pone `fechaFinal` al registrar una parada que completa la cantidad, el frontend debe refrescar los datos después de cada parada para reflejar el cambio. El flujo actual ya refresca después de cada acción.

## Open Questions

- ¿Se debe mostrar el tiempo consumido en la card Kanban además del countdown, o reemplazar el countdown? Pendiente de decisión de UI.
