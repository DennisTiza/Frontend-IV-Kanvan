## Context

Aplicación Angular 17+ standalone con componentes OnPush, señales para estado local, y servicios con `inject(HttpClient)`. El backend expone 4 endpoints GET para reportes de producción (`/reportes/total-por-dia`, `/reportes/por-operario`, `/reportes/tiempos`, `/reportes/paradas`) que no requieren autenticación. Actualmente no existe ningún módulo de reportes ni librería de gráficos.

El sistema de menú construye dinámicamente las opciones del menú lateral basado en los permisos (`PermisoModel`) que devuelve el login. Cada entrada de menú se configura en `ConfiguracionMenu.listaMenus` con un `id`, `titulo`, `ruta` y `accion`.

## Goals / Non-Goals

**Goals:**
- Agregar un nuevo menú "Reportes" visible para gerentes con permiso `Listar`
- Crear una vista con 4 pestañas que cargan datos de los endpoints de reportes
- Cada reporte debe mostrar un gráfico como vista principal
- El usuario puede alternar a una vista de tabla con los datos exactos
- Seguir el patrón existente del proyecto (standalone, señales, OnPush)

**Non-Goals:**
- No se modifican endpoints del backend
- No se implementa autenticación ni autorización adicional (se usa el sistema existente de menú)
- No se implementa exportación de datos (PDF, Excel) en esta iteración
- No se implementan filtros por fecha/rango

## Decisions

### 1. Ruta: `/parametros/reportes`

Sigue el patrón existente donde todo lo relacionado a producción está bajo `parametros/` (ej: `parametros/tarjeta-produccion/kanban`).

### 2. Estructura de componentes

```
modules/reportes/
├── reportes.ts              ← Contenedor con pestañas
├── reportes.html
├── reportes.css
```

Un solo componente. Cada pestaña se renderiza con `@switch` en la plantilla. Se prefirió no crear 4 subcomponentes porque cada reporte comparte la misma estructura (chart + tabla) y la lógica de Chart.js se maneja centralizadamente en hooks del ciclo de vida.

### 3. Librería de gráficos: Chart.js (vanilla, sin wrapper Angular)

Se usará `chart.js` directamente sin `ng2-charts`. Razones:
- `ng2-charts` agrega otra capa de abstracción que no aporta valor significativo
- El proyecto no usa wrappers similares en otras partes
- Chart.js vanilla es más directo de controlar (crear/destruir instancias)
- Menos dependencias anidadas

### 4. Carga de datos: lazy por pestaña

Cada pestaña carga su endpoint solo cuando se activa por primera vez. Los datos se cachean en una señal para evitar llamadas repetidas al cambiar de pestaña.

```
Tab "Total x Día" seleccionada
  → ¿datos cargados? → No → GET /reportes/total-por-dia → almacenar en señal
  → ¿datos cargados? → Sí → usar datos cacheados
```

### 5. Alternancia gráfico/tabla

Cada pestaña tiene una señal booleana `mostrarTabla` que alterna la vista. Por defecto se muestra el gráfico.

### 6. Formato de tiempo

Función utilitaria `segundosAHHMMSS(segundos: number): string` que convierte segundos a formato `HH:MM:SS`. Útil para los reportes de tiempos y paradas.

### 7. Modelos de datos

Se crearán interfaces específicas para cada respuesta del backend dentro del archivo del servicio (no modelos separados, dado que son simples DTOs de lectura):

```typescript
interface TotalPorDiaDto { fecha: string; totalProducido: number }
interface PorOperarioDto { operario: string; proceso: string; totalProducido: number }
interface TiemposDto { tarjetaCodigo: string; proceso: string; tiempoEstandar: number; tiempoReal: number; diferencia: number; porcentaje: number }
interface ParadasDto { codigo: string; descripcion: string; veces: number; cantidadPerdida: number }
```

### 8. Inicialización de Chart.js

Se usará `afterNextRender` (nueva API Angular 17+) o `ngAfterViewInit` para inicializar los charts cuando el canvas esté disponible. Las instancias de Chart se destruyen al cambiar de pestaña o al destruir el componente para evitar memory leaks.

## Risks / Trade-offs

- **[Riesgo] Chart.js sin wrapper**: Mayor control pero más código boilerplate para crear/destruir instancias. → **Mitigación**: Encapsular la lógica de Chart.js en métodos privados dentro del componente.
- **[Riesgo] Charts en tabs ocultas**: El canvas no tiene dimensiones cuando está oculto (`display: none`). → **Mitigación**: Inicializar el chart solo cuando la tab está activa, no al montar el componente.
- **[Trade-off] Sin filtros**: Los reportes muestran todos los datos sin filtrar. Si el volumen de datos crece, puede volverse lento. → Se abordará en una iteración futura.
- **[Trade-off] Single component vs child components**: Un solo componente es más simple pero menos modular. Si en el futuro cada reporte necesita lógica muy diferente, se pueden extraer a componentes hijos.