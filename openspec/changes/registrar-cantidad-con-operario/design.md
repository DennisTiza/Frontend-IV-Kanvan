## Context

El kanban board actual permite reportar cantidad y registrar paradas/finalizar procesos, pero no captura qué operario realizó el reporte. Los operarios asignados a cada proceso ya están disponibles en `proceso.operarioXProcesoXTarjetas` (cargados mediante include en `ListarTarjetasConProcesos()`). El backend agregó el campo `operarioId` a los endpoints de parada y finalización, y creó una nueva entidad `RegistroDeCantidad`.

**Stack actual**: Angular 21.1 standalone, Signals, OnPush change detection.

## Goals / Non-Goals

**Goals:**
- Selector de operario en la fila de input de cantidad (Opción A), visible solo cuando hay delta a reportar (`input > cantidadRegistrada`)
- Selector vacío por defecto, obligatorio
- `operarioId` en body de `POST /registrar-parada` y `POST /finalizar` (cuando hay cantidadReportada)
- Actualizar `ParadaModel` con `operarioId` y `operario`
- Crear `RegistroDeCantidadModel` para nuevo endpoint
- Nuevo método `ObtenerRegistrosCantidad()` en servicio

**Non-Goals:**
- No se modifican los endpoints del backend (ya implementados)
- No se agrega el historial de registros de cantidad en la UI (solo el servicio, para uso futuro)
- No se modifica el flujo de "finalizar sin cantidad" (no requiere operario)

## Decisions

### D1: Selector de operario integrado en la fila de input

**Decisión**: El `<select>` de operarios se coloca dentro de la fila `proceso-input-row`, debajo del input de cantidad. Aparece solo cuando `input > cantidadRegistrada` (hay algo que reportar).

```
┌──────────────────────────────────────────────┐
│  Procesado:  [  40  ]  de 100 uds  (+40)     │
│  Operario:   [Seleccionar operario...    ▼]   │
└──────────────────────────────────────────────┘
```

**Alternativa considerada**: Select solo en el form expandido de parada. Se descartó porque el operario aplica también a finalización, y queremos un solo punto de captura.

### D2: Selector vacío por defecto y obligatorio

**Decisión**: 
- Valor inicial: `null` (placeholder "Seleccionar operario...")
- El botón "Registrar Parada" se deshabilita si no hay operario seleccionado
- El botón "Finalizar" se deshabilita si no hay operario seleccionado (cuando hay delta)
- El placeholder no es una opción válida (attribute `disabled`)

**Alternativa considerada**: Auto-seleccionar el primer operario. Se descartó porque puede llevar a reportes incorrectos si el operario no revisa.

### D3: operarioId fluye desde el selector hasta el servicio

```
detalle-tarjeta.ts                    kanban-board.ts
┌─────────────────────┐               ┌──────────────────────┐
│  input cantidad     │               │  manejarAccionProceso│
│  select operario ───┤procesoAccion  │                      │
│  [Seleccionar... ▼] │──────────────▶│  finalizar:          │
│                     │{ ...,         │    { cantidad,       │
│  [Parada/Finalizar] │ operarioId }  │      operarioId }    │
└─────────────────────┘               │  parada:             │
                                      │    { cantidad,       │
                                      │      codParada,      │
                                      │      operarioId }    │
                                      └──────────────────────┘
                                               │
                                               ▼
                                      proceso-xtarjeta.service.ts
                                      ┌──────────────────────────┐
                                      │ FinalizarProceso(id,     │
                                      │   {cantidad, operarioId})│
                                      │                          │
                                      │ RegistrarParada(id,      │
                                      │   {cant, codPar, opId})  │
                                      └──────────────────────────┘
```

### D4: Estado del selector vía señal independiente

**Decisión**: Nueva señal `operarioSeleccionado = signal<Map<number, number | null>>(new Map())` que mapea `procesoId → operarioId`. Se resetea al cambiar el input o al colapsar el proceso.

**Alternativa considerada**: Una sola señal `operarioSeleccionado: Signal<number | null>`. Se descartó porque cada proceso necesita su propio estado.

### D5: ParadaModel actualizado

```
ParadaModel (actualizado)
┌──────────────────────────┐
│ id                       │
│ procesoXTarjetaId        │
│ codigoDeParadaId         │
│ cantidadReportada        │
│ operarioId          ← NUEVO
│ fecha                    │
│ codigoDeParada           │
│ operario            ← NUEVO (OperarioModel)
└──────────────────────────┘
```

### D6: RegistroDeCantidadModel — nuevo modelo

```
RegistroDeCantidadModel {
    id?: number;
    procesoXTarjetaId?: number;
    operarioId?: number;
    cantidad?: number;
    tipo?: 'produccion' | 'parada';
    codigoDeParadaId?: number | null;
    fecha?: string;
    operario?: OperarioModel;
    codigoDeParada?: CodigoDeParadaModel | null;
}
```

### D7: Firmas de servicios actualizadas

```
ProcesoXtarjetaService

  // Anterior: body opcional sin operarioId
  // Nuevo: body opcional con operarioId
  FinalizarProceso(id: number, body?: { cantidadReportada?: number, operarioId?: number })

  // Anterior: body sin operarioId
  // Nuevo: body con operarioId requerido
  RegistrarParada(id: number, body: { cantidadReportada: number, codigoDeParadaId: number, operarioId: number })

  // Nuevo
  ObtenerRegistrosCantidad(id: number): Observable<RegistroDeCantidadModel[]>
```

### D8: Evento procesoAccion actualizado

```
// Anterior
{ tipo: 'iniciar' | 'finalizar' | 'registrar-parada',
  procesoId: number,
  cantidadReportada?: number,
  codigoDeParadaId?: number }

// Nuevo
{ tipo: 'iniciar' | 'finalizar' | 'registrar-parada',
  procesoId: number,
  cantidadReportada?: number,
  codigoDeParadaId?: number,
  operarioId?: number }                    ← NUEVO
```

## Risks / Trade-offs

| Risk | Mitigation |
|---|---|
| **Operario no seleccionado**: El operario cambia el input pero olvida seleccionar operario y presiona Parada/Finalizar. | Botones deshabilitados si no hay operario seleccionado (y hay delta). No se puede enviar sin operario. |
| **Operarios no cargados**: La relación `operarioXProcesoXTarjetas` llega vacía. | El select se muestra deshabilitado con texto "Sin operarios asignados" y los botones de acción se deshabilitan. |
| **Múltiples procesos abiertos**: El operario cambia varios inputs y los selectores se entremezclan. | Cada proceso tiene su propio `Map<procesoId, operarioId>` independiente. El estado es por proceso. |
| **RegistroDeCantidadModel duplica a ParadaModel**: Ambos modelos tienen campos similares. | ParadaModel cubre la respuesta de `GET /paradas` (formato legado). RegistroDeCantidadModel cubre el nuevo endpoint. Se mantienen separados porque el backend los expone como endpoints distintos con estructuras diferentes. |

## Open Questions

1. ~~¿Dónde colocar el select de operarios?~~ **RESUELTO**: En la fila de input de cantidad (Opción A).
2. ~~¿Valor por defecto del selector?~~ **RESUELTO**: Vacío, obligatorio elegir.
3. ~~¿El operario logueado se mapea automáticamente?~~ **RESUELTO**: No, se elige explícitamente del listado de operarios asignados al proceso.
