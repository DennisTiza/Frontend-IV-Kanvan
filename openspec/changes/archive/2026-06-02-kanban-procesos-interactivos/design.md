## Context

El tablero Kanban actual (`KanbanBoardComponent`) carga tarjetas con `ListarTarjetas()` — un GET simple que no incluye relaciones. Las cards muestran info estática pero:

- El operario mostrado siempre es `procesoXTarjetas[0]` sin considerar orden ni estado
- El timer en `en ejecución` usa `tarjeta.cantidad` (unidades) como si fueran minutos
- No hay forma de iniciar/finalizar procesos desde la UI

El backend ya implementó:
- Campo `orden` en `ProcesoXTarjeta` (se copia desde `ProductoXProceso.orden` al crear la tarjeta)
- GET con `?filter={"include":[...]}` que devuelve `procesoXTarjetas` ordenados por `orden ASC` con `operario` y `proceso` anidados
- `POST /proceso-x-tarjeta/{id}/iniciar` — inicia un proceso (valida que el anterior esté completo, pone `fechaInicio`, cambia tarjeta a `en_proceso`)
- `POST /proceso-x-tarjeta/{id}/finalizar` — finaliza un proceso (pone `fechaFinal`, cambia tarjeta a `finalizada` si era el último)

## Goals / Non-Goals

**Goals:**
- Las cards en `por_hacer` muestran tiempo estimado total, tiempo del próximo proceso, y operario correcto
- Las cards en `por_hacer` son clickeables y abren un detalle de procesos
- Las cards en `en ejecución` muestran timer correcto basado en `proceso.tiempo` y nombre del proceso activo
- El detalle de tarjeta permite iniciar/finalizar procesos con botones contextuales
- Los botones se bloquean según la máquina de estados (no se puede iniciar un proceso si hay otro en curso, no se puede finalizar lo que no se inició)
- El tablero se refresca automáticamente tras cada acción

**Non-Goals:**
- No se implementa autenticación de operarios (todos ven todo, como hoy)
- No se manejan errores con `codigoDeErrorId` (el endpoint lo soporta pero la UI inicial no lo expone)
- No se implementa pausa/reintento de procesos

## Decisions

### Decisión 1: Un solo GET con include vs múltiples llamadas

Se usará el filter de LoopBack en `GET /tarjeta-de-produccion` con include anidado para traer todo en una llamada:

```
GET /tarjeta-de-produccion?filter={
  "include":[{
    "relation":"procesoXTarjetas",
    "scope":{
      "include":["operario","proceso"],
      "order":["orden ASC"]
    }
  }]
}
```

**Alternativa considerada**: Hacer GET simple + GET `/proceso-x-tarjeta/por-tarjeta/{id}` por cada tarjeta.
**Razón**: Una sola llamada evita N+1, la data llega ya estructurada y ordenada, y el backend ya soporta el filter.

Se agregará un método `ListarTarjetasConProcesos()` en `TarjetaProduccionService` que reemplace al `ListarTarjetas()` en el contexto del Kanban.

### Decisión 2: Modal de detalle vs ruta separada

Se implementará un componente modal (`DetalleTarjetaComponent`) que se abre al hacer clic en cualquier card.

**Alternativa considerada**: Ruta tipo `/parametros/tarjeta-produccion/detalle/{id}`.
**Razón**: El modal es más rápido de implementar, mantiene el contexto del tablero visible, y sigue el patrón existente (`EditarProcesoProduccion` ya usa modal). Además evita tener que definir y registrar una nueva ruta.

El modal recibirá la tarjeta completa (con procesos ya incluidos) y manejará las acciones de iniciar/finalizar.

### Decisión 3: Determinación del proceso "siguiente" y "activo"

Como el backend ya devuelve `procesoXTarjetas` ordenados por `orden ASC`, la lógica es puramente de filtrado en el frontend:

```
estado del proceso:
  ┌─ sin fechaInicio          → "pendiente" (se puede iniciar)
  ├─ con fechaInicio          → "en_curso"  (activo)
  │  sin fechaFinal          
  ├─ con fechaInicio          → "completado"
  │  con fechaFinal           
  └─ con fechaFinal           → "completado"
     con codigoDeErrorId      (se ignora por ahora)

Para la card:
  - "próximo proceso pendiente" = procesoXTarjetas.find(p => !p.fechaInicio)
  - "proceso activo"           = procesoXTarjetas.find(p => p.fechaInicio && !p.fechaFinal)
  - "operario a mostrar"       = próximoProceso?.operario ?? activo?.operario
```

### Decisión 4: Timer basado en `proceso.tiempo`

El timer actual usa `tarjeta.cantidad * 60 * 1000` lo cual es incorrecto. Se cambiará a usar el `tiempo` del proceso activo:

```
const procesoActivo = this.obtenerProcesoActivo();
const estimadoMs = (procesoActivo?.tiempo ?? 0) * 60 * 1000;
```

Si no hay proceso activo, el timer no se muestra.

### Decisión 5: Refresco del tablero post-acción

Después de iniciar o finalizar un proceso, se llamará a `cargarTarjetas()` en el `KanbanBoardComponent` para refrescar todas las columnas. El modal de detalle se cerrará y la card reflejará el nuevo estado.

Se emitirá un evento desde el modal hacia el board para gatillar el refresco.

## Risks / Trade-offs

| Riesgo | Mitigación |
|--------|------------|
| El GET con filter include puede ser más lento si hay muchas tarjetas | El filter se aplica solo en el Kanban, no en listados grandes. Si es necesario, el backend podría cachear |
| Al cerrar el modal sin acciones, el usuario pierde contexto visual de qué card estaba viendo | El modal no navega, solo se superpone. Al cerrar, el tablero está exactamente como se dejó |
| El estado "en_proceso" del backend (`estado` de tarjeta) usa snake_case (`en_proceso`) mientras el frontend usa espacios (`en ejecución`) | Normalizar en el frontend: mapear `en_proceso` del backend a `en ejecución` en la UI, o usar constantes compartidas |
