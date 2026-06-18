## Why

El componente de reportes lanza el error `NG0203: afterNextRender() can only be used within an injection context` porque `afterNextRender()` se invoca desde el callback `next` de un `subscribe()`, que corre asincrónicamente — fuera del contexto de inyección de Angular. Esto impide que los charts se rendericen y el usuario ve pantallas en blanco sin ningún tipo de feedback.

## What Changes

- Reemplazar `afterNextRender()` por `setTimeout()` en el método `programarInicializarChart()` para inicializar los charts desde callbacks asincrónicos
- Agregar `error` handlers a las 4 suscripciones HTTP del componente de reportes para manejar fallos del backend y evitar que los errores se traguen silenciosamente
- No se cambia la API ni la estructura del componente — solo lógica interna de inicialización y manejo de errores

## Capabilities

### New Capabilities

Ninguna. No se introducen nuevas capacidades.

### Modified Capabilities

- `production-reports`: Se modifica el mecanismo de inicialización de charts (de `afterNextRender` a `setTimeout`) y se agrega manejo de errores en suscripciones HTTP.

## Impact

- **Archivo modificado**: `src/app/modules/reportes/reportes.ts`
- **Sin cambios en**: servicios, rutas, menú, template, estilos
- **Sin nuevas dependencias