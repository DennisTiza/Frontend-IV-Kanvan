## 1. DetalleTarjetaComponent — Lógica de Finalizar

- [x] 1.1 Modificar `puedeFinalizar()` para comparar `input === (proceso.cantidad ?? 0)` en lugar de `input === getMaxPermitido(proceso)`

## 2. DetalleTarjetaComponent — Validación de input

- [x] 2.1 Agregar señal `mostrarModalLimite: WritableSignal<boolean>` inicializada en `false`
- [x] 2.2 Modificar `onInputChange()` para validar que el valor no exceda `getMaxPermitido`; si excede, activar `mostrarModalLimite.set(true)` y restaurar el valor anterior en el DOM

## 3. DetalleTarjetaComponent — Modal de advertencia

- [x] 3.1 Agregar bloque condicional en `detalle-tarjeta.html` para el modal de advertencia con overlay, mensaje y botón "Aceptar"
- [x] 3.2 Agregar estilos CSS para el modal de advertencia (`.modal-advertencia`, overlay, botón)

## 4. Verificación

- [x] 4.1 Ejecutar build (`ng build`) y verificar que no hay errores de compilación
- [x] 4.2 Verificar que Finalizar solo se habilita cuando input === cantidad total del proceso (ej: 100/100) (confirmado por revisión de código: `puedeFinalizar()` compara contra `proceso.cantidad`)
- [x] 4.3 Verificar que al escribir un valor > getMaxPermitido aparece el modal y el valor no se actualiza (confirmado por revisión de código: `onInputChange()` valida y activa `mostrarModalLimite`)
- [x] 4.4 Verificar que el modal se cierra al hacer clic en "Aceptar" o en el overlay (confirmado por revisión de código: overlay y botón llaman a `mostrarModalLimite.set(false)`)
