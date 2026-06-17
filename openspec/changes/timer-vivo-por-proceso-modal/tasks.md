## 1. DetalleTarjetaComponent — Lógica del timer

- [x] 1.1 Agregar `implements OnDestroy` y señal `tick`, variable `timerInterval`
- [x] 1.2 En `ngOnInit()`: llamar a `iniciarTimer()`
- [x] 1.3 Agregar `ngOnDestroy()`: limpiar intervalo
- [x] 1.4 Agregar método `getTiempoRestanteDisplay(proceso)` que calcula HH:MM:SS usando `tick()`

## 2. DetalleTarjetaComponent — Template

- [x] 2.1 Agregar display del countdown (`⏱ HH:MM:SS`) en el bloque de información del proceso, visible solo si `esActivo` y `proceso.tiempo`

## 3. Verificación

- [x] 3.1 Ejecutar `ng build` y verificar que no hay errores de compilación
