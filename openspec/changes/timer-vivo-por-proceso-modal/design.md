## Context

El `DetalleTarjetaComponent` actualmente muestra información de tiempo estática por cada proceso (`proceso.tiempo` estimado + tiempo consumido real). La `KanbanCardComponent` tiene un timer vivo (countdown HH:MM:SS) pero solo para el último proceso activo. En el modal hay espacio y contexto para mostrar un countdown vivo por cada proceso activo, permitiendo al operario monitorear el tiempo restante de todos los procesos en paralelo.

```
Estado actual en el modal:
  45 min | real: 4m 30s

Estado deseado:
  45 min | ⏱ 00:40:30 | real: 4m 30s
```

## Goals / Non-Goals

**Goals:**
- Mostrar un countdown vivo (HH:MM:SS) del tiempo restante para cada proceso activo en el modal
- El countdown se actualiza cada segundo vía `setInterval`
- Se mantiene la información existente (tiempo estimado, tiempo consumido)
- Al cerrar el modal, el intervalo se limpia

**Non-Goals:**
- No se cambia el timer de la KanbanCard (sigue mostrando solo el último proceso activo)
- No se cambia `getTiempoConsumidoDisplay()` (se mantiene como está)
- No se cambia la lógica de columnas, botones, o cantidades
- No se agregan nuevas dependencias externas

## Decisions

### D1: Señal `tick` + `setInterval` para el countdown

**Decisión**: Agregar una señal `tick = signal(0)` que se incrementa cada segundo mediante `setInterval`. Un método `getTiempoRestanteDisplay(proceso)` calcula el tiempo restante en formato HH:MM:SS usando el valor actual de `tick()` + los datos del proceso. El template llama a este método en el bloque de cada proceso activo.

```
// detalle-tarjeta.ts
readonly tick = signal(0);
private timerInterval: ReturnType<typeof setInterval> | null = null;

ngOnInit(): void {
  this.codigoDeParadaService.ObtenerCodigosDeParada().subscribe(...);
  this.initProcesoInputs();
  this.iniciarTimer();
}

ngOnDestroy(): void {
  this.limpiarTimer();
}

private iniciarTimer(): void {
  this.timerInterval = setInterval(() => {
    this.tick.update(t => t + 1);
  }, 1000);
}

private limpiarTimer(): void {
  if (this.timerInterval) {
    clearInterval(this.timerInterval);
    this.timerInterval = null;
  }
}

getTiempoRestanteDisplay(proceso: ProcesoXTarjetaModel): string {
  if (!proceso.fechaInicio || proceso.fechaFinal || !proceso.tiempo) {
    return '';
  }
  void this.tick(); // subscribe to signal
  const inicio = new Date(proceso.fechaInicio).getTime();
  const ahora = Date.now();
  const sesion = (ahora - inicio) / 1000;
  const consumidoTotal = (proceso.tiempoConsumido ?? 0) + sesion;
  const restanteSeg = Math.max(0, (proceso.tiempo * 60) - consumidoTotal);
  const h = Math.floor(restanteSeg / 3600);
  const m = Math.floor((restanteSeg % 3600) / 60);
  const s = Math.floor(restanteSeg % 60);
  return `${String(h).padStart(2, '0')}:${String(m).padStart(2, '0')}:${String(s).padStart(2, '0')}`;
}
```

```html
@if (esActivo && proceso.tiempo) {
  <span class="proceso-info-item">
    ⏱ {{ getTiempoRestanteDisplay(proceso) }}
  </span>
}
```

**Alternativa considerada**: Mapa de señales por proceso (`Map<number, Signal<string>>`). Se descartó porque un solo `tick` + método que lo lee es más simple y evita crear N señales.

**Alternativa considerada**: Computed properties. No funcionan porque el valor del tick cambia cada segundo y el computed se recalcularía igualmente.

### D2: Implementar `OnDestroy`

**Decisión**: El componente implementa `OnDestroy` para limpiar el intervalo. Aunque Angular destruye el componente al cerrar el modal, es buena práctica limpiar explícitamente.

**Alternativa considerada**: Usar `takeUntilDestroyed()`. Se descartó porque requiere Angular 16+ de forma más explícita y `OnDestroy` es el patrón ya usado en `KanbanCardComponent`.

## Risks / Trade-offs

| Riesgo | Mitigación |
|--------|------------|
| Consumo de CPU por setInterval en el modal | Un solo intervalo de 1s es insignificante |
| El countdown se muestra aunque el proceso no tenga `tiempo` estimado | Se condiciona a `proceso.tiempo` existente |
| Al cerrar el modal el intervalo sigue corriendo | Se limpia en `ngOnDestroy` |
| Múltiples procesos activos recalcular el timer en cada tick | El cálculo es O(1) por proceso, sin impacto medible |
