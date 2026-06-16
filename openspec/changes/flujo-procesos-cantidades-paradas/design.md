## Context

El kanban board actual maneja procesos de forma binaria: iniciado/no iniciado, finalizado/no finalizado. La secuencialidad es estricta (proceso N requiere fechaFinal del proceso N-1). No hay concepto de cantidad, avance parcial, ni paradas.

El backend ya implementó los cambios necesarios en modelos y controladores. El frontend debe consumir los nuevos endpoints y reflejar el flujo cuantitativo.

**Stack actual**: Angular 21.1 standalone, Signals, Tailwind CSS 4.3, OnPush change detection.

## Goals / Non-Goals

**Goals:**
- Modelar `cantidad`, `cantidadRealizada`, `cantidadRegistrada` en `ProcesoXTarjetaModel`
- Modelo `ParadaModel` para el histórico de paradas
- Input de cantidad por proceso en el modal de detalle
- Botón "Registrar Parada" inline con selector de código (sin modal anidado)
- Botón "Iniciar/Reanudar" con lógica condicional por cantidad
- Botón "Finalizar" habilitado solo cuando cantidad = total
- Secuencialidad basada en `cantidadRegistrada > 0` del proceso anterior
- Barras de progreso de cantidad en KanbanCard y DetalleTarjeta
- Timer solo para el proceso activo; si hay múltiples activos, timer del último iniciado
- Clasificación de columnas basada en cantidadRegistrada

**Non-Goals:**
- No se modifican los endpoints del backend (ya implementados)
- No se agregan nuevas columnas al kanban ("En pausa")
- No se implementa arrastrar y soltar (drag & drop)
- No se cambia el timer base (sigue siendo client-side)

## Decisions

### D1: Input de cantidad unificado con lógica de botones

**Decisión**: Un solo campo input numérico por proceso. El valor default es `cantidadRegistrada`. Al cambiar el valor:

```
input > cantidadRegistrada && input < cantidad → "Registrar Parada" habilitado
input === cantidad                          → "Finalizar" habilitado
input === cantidadRegistrada               → ambos deshabilitados
```

**Alternativa considerada**: Botón separado "Reportar avance" + botón "Registrar Parada". Se descartó por duplicidad de UI y porque el usuario prefirió simplicidad.

**Cálculo de delta**: El frontend calcula `delta = input - cantidadRegistrada` y lo envía como `cantidadReportada` en el body. El operario solo ve el número acumulado.

### D2: Formulario de parada inline, no modal anidado

**Decisión**: Al hacer clic en "Registrar Parada", el proceso se expande inline dentro del DetalleTarjeta mostrando el selector de código y botones Guardar/Cancelar. No se abre un segundo modal.

**Alternativa considerada**: Modal anidado (overlay sobre overlay). Se descartó por mala experiencia de usuario y complejidad técnica.

**Estados del proceso en DetalleTarjeta:**
```
IDLE → EXPANDING_PARADA → SUBMITTING → (refresh)
     → VIEWING_PARADAS  → (expandible histórico)
```

### D3: Timer solo para el proceso activo; reseteo en reanudación

**Decisión**: El timer se muestra solo para el proceso que está activo (▶). Cuando hay múltiples procesos activos, el timer corresponde al de mayor `fechaInicio` (último reanudado). El timer se resetea naturalmente porque `POST /iniciar` asigna nuevo `fechaInicio`.

**Alternativa considerada**: Timer para todos los procesos activos. Se descartó por saturación visual en la card.

### D4: Barra de cantidad como progreso primario en KanbanCard

**Decisión**: La KanbanCard muestra una barra de progreso por cada proceso con `cantidadRegistrada > 0` o que sea el siguiente a iniciar. Cada barra ocupa una línea compacta con formato:
```
<Proceso> ████████░░░░  <cantidadRegistrada>/<cantidad>  <indicador>
```

Donde `<indicador>` es ⚠️ (tiene paradas) o ▶ (activo) o vacío.

**Alternativa considerada**: Barra única general de la tarjeta. Se descartó porque oculta qué procesos tienen avance y cuáles no.

### D5: Clasificación de columnas basada en cantidadRegistrada

**Decisión**: 

| Columna | Condición |
|---|---|
| En ejecución | Algún proceso tiene `fechaInicio` sin `fechaFinal` |
| Finalizadas | Todos los procesos tienen `cantidadRegistrada === cantidad` |
| Por hacer | Todo lo demás |

Una tarjeta con paradas (proceso activo con `cantidadRegistrada > 0` pero sin `fechaFinal`) sigue en "En ejecución" — no se mueve a una columna aparte.

### D6: Arquitectura de componentes con Signals

El estado del input de cantidad se maneja con una señal `WritableSignal<number>` por proceso dentro de DetalleTarjetaComponent. Los botones se habilitan/deshabilitan con `computed()` basado en el valor del input vs `cantidad` y `cantidadRegistrada`.

```
DetalleTarjetaComponent
├── procesoInputs: Map<number, Signal<number>>  ← cantidad por proceso
├── procesoEstados: computed → habilita botones
├── procesoExpandido: Signal<number | null>     ← qué proceso tiene form expandido
└── paradasVisibles: Signal<number | null>      ← qué proceso muestra histórico
```

### D7: Nuevos servicios de API

```
ProcesoXtarjetaService
├── IniciarProceso(id)            → POST /proceso-x-tarjeta/{id}/iniciar    (sin cambios)
├── FinalizarProceso(id, body?)   → POST /proceso-x-tarjeta/{id}/finalizar  (body opcional con cantidadReportada)
├── RegistrarParada(id, body)     → POST /proceso-x-tarjeta/{id}/registrar-parada  (nuevo)
└── ObtenerParadas(id)            → GET  /proceso-x-tarjeta/{id}/paradas           (nuevo)
```

### D8: Modelo ParadaModel

```
ParadaModel {
    id?: number;
    procesoXTarjetaId?: number;
    codigoDeParadaId?: number;
    cantidadReportada?: number;
    fecha?: string;
    codigo?: CodigoDeParadaModel;  // eager-loaded
}
```

## Risks / Trade-offs

| Risk | Mitigation |
|---|---|
| **Input sin botón presionado**: El operario cambia el input pero cierra el modal sin presionar ningún botón. El cambio se pierde. | El input se resetea a `cantidadRegistrada` al abrir el modal. No hay estado persistente sin acción explícita. |
| **Múltiples procesos activos → timer ambiguo en card**: Si Corte y Ensamble están activos, ¿qué timer se muestra? | Se muestra el del último iniciado (mayor `fechaInicio`), con etiqueta del nombre del proceso. |
| **POST /iniciar sin fechaInicio previo vs reanudar**: El mismo endpoint se llama para iniciar y reanudar. El frontend no diferencia. | El backend asigna nuevo `fechaInicio` en ambos casos. El frontend solo cambia el texto del botón. |
| **POST /finalizar sin cantidadReportada**: El endpoint acepta body opcional. Si no se envía body, solo asigna fechaFinal (compatibilidad). | El frontend SIEMPRE envía `{ cantidadReportada }` cuando el input === cantidad. No se usa el modo sin body. |
| **Códigos de parada no cargados**: Si `GET /codigo-de-parada` falla, el selector de parada está vacío. | El selector muestra "Sin códigos disponibles" deshabilitado si la carga falla o está vacía. |
| **Rendimiento con muchas tarjetas**: Cada card muestra múltiples barras de progreso. | Se usa OnPush + Signals. Las barras solo se recalculan cuando cambia el array de procesos (tras refresh). |

## Open Questions

1. ~~¿`POST /finalizar` acepta `{ cantidadReportada }`?~~ **RESUELTO**: Sí, body opcional. El backend suma a `cantidadRegistrada` y asigna `fechaFinal`.
2. ¿Hay un límite de procesos por tarjeta que pueda afectar el layout de la KanbanCard? (diseño responsive)
3. ¿Se necesita mostrar el histórico de paradas en la KanbanCard o solo en el modal de detalle? (según specs: solo en modal)
