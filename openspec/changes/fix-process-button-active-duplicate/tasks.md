## 1. Fix active process guard in `puedeIniciarReanudar`

- [x] 1.1 Add `if (proceso.fechaInicio && !proceso.fechaFinal) return false;` as second condition (after completion check) in `puedeIniciarReanudar()` in `detalle-tarjeta.ts`

## 2. Fix double API call in `registrarParada`

- [x] 2.1 Remove direct `this.procesoXTarjetaService.RegistrarParada(...)` call and its subscribe block from `registrarParada()` in `detalle-tarjeta.ts`
- [x] 2.2 Change the `procesoAccion.emit({ tipo: 'registrar-parada', procesoId: id })` to include `cantidadReportada` and `codigoDeParadaId`
- [x] 2.3 Remove `this.guardando.set(true/false)` calls (no longer needed, parent handles API call)
- [x] 2.4 Remove `this.procesoExpandido.set(null)` and `this.codigoSeleccionado.set(null)` from the method (modal will be closed by parent on success)

## 3. Verify build and runtime

- [x] 3.1 Run `npx tsc --noEmit` to verify TypeScript compilation
- [x] 3.2 Run `npx ng build` to verify Angular build
- [ ] 3.3 After starting a process, verify the "Iniciar" button is replaced by "Parada" and "Finalizar" *(user to verify)*
- [ ] 3.4 Register a parada with a stop code and verify no 422 error in browser console *(user to verify)*
