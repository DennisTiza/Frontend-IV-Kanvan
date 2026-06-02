## 1. Agregar logging de diagnóstico en KanbanCardComponent

- [x] 1.1 En `ngOnInit()`, agregar `console.log` que indique que el temporizador se inició, mostrando el ID del proceso activo
- [x] 1.2 En `actualizarTiempo()`, agregar `console.log` al inicio que muestre `procesoActivo.tiempo`, `procesoActivo.fechaInicio`, y los valores calculados (`inicio`, `ahora`, `estimadoMs`, `transcurrido`, `restante`, `progreso`)
- [x] 1.3 En `actualizarTiempo()`, agregar `console.log` en la guarda de retorno temprano (cuando falta `fechaInicio` o `tiempo`) indicando qué condición falló
- [x] 1.4 Verificar que los logs solo aparecen para tarjetas con proceso activo (sin ruido en columnas "Por hacer" o "Finalizadas") — confirmado por revisión de código
- [ ] 1.5 Probar en navegador: iniciar un proceso y observar la consola para determinar si el problema es de datos o de ciclo de vida
