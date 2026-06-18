## Context

El componente `Reportes` usa `afterNextRender()` para inicializar los charts de Chart.js una vez que los datos llegan del backend. Sin embargo, `afterNextRender()` requiere contexto de inyección de Angular (constructor, field initializer, o `runInInjectionContext`). Las llamadas HTTP completan asincrónicamente, por lo que el callback `next` de `subscribe()` ya no tiene contexto de inyección, lanzando el error `NG0203`.

Además, las 4 suscripciones HTTP no tienen manejador `error`, por lo que:
- Los errores 500 del backend se tragan silenciosamente (ni siquiera se loguean)
- La señal `datosCargados` nunca se marca como `true`
- El usuario ve una pantalla en blanco sin saber qué pasó

## Goals / Non-Goals

**Goals:**
- Eliminar el error NG0203 al inicializar charts
- Los charts deben renderizarse correctamente cuando los datos llegan
- Agregar manejo de errores visible para el usuario cuando el backend falla

**Non-Goals:**
- No se cambia la estructura del componente
- No se modifican templates ni estilos
- No se agregan nuevas dependencias
- No se cambia el comportamiento del servicio de reportes

## Decisions

### 1. Reemplazar `afterNextRender()` por `setTimeout(fn, 0)`

| Opción | Descripción | Veredicto |
|--------|-------------|-----------|
| `afterNextRender()` | Requiere contexto de inyección | ❌ No usable desde async callbacks |
| `setTimeout(fn, 0)` | Programa callback en la siguiente macrotask | ✅ Simple y funciona siempre |
| `afterRender()` con flag | Se registra en constructor, usa flag para disparar | ✅ Angular-idiomático pero más complejo |
| `NgZone.onMicrotaskEmpty` | Se suscribe al evento de zona | ⚠️ Dependencia de NgZone, overkill |

Se elige `setTimeout` por su simplicidad y porque es el patrón más común para Chart.js en Angular cuando se necesita inicializar charts después de que el DOM se actualiza.

### 2. Agregar handler `error` en las 4 suscripciones

Se sigue el mismo patrón que el resto de componentes del proyecto:
```typescript
error: (err) => console.error('Error al cargar reporte:', err),
```

### 3. Señal de error para feedback visual

Se agrega una señal `errorAlCargar: Record<TabId, string | null>` para almacenar mensajes de error por pestaña. El template se actualizará para mostrar estos mensajes cuando corresponda.

## Risks / Trade-offs

- **[Riesgo mínimo] setTimeout vs afterRender**: `setTimeout` no está integrado con el ciclo de detección de cambios de Angular. → **Mitigación**: La creación del chart es una operación imperativa (manipulación del canvas via Chart.js), no depende del cambio de detección. Angular no necesita saber que el chart se creó.
- **[Trade-off] Manejo de errores**: Solo se loguea en consola y se muestra un mensaje al usuario. No hay reintentos automáticos ni lógica de fallback. → Suficiente para la iteración actual.