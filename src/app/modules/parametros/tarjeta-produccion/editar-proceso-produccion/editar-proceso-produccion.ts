import { CommonModule } from '@angular/common';
import { ChangeDetectionStrategy, Component, computed, effect, inject, input, output } from '@angular/core';
import { FormBuilder, FormControl, FormGroup, ReactiveFormsModule, Validators } from '@angular/forms';
import { OperarioModel } from '../../../../models/operario.model';
import { ProcesoModel } from '../../../../models/proceso.model';
import { ProcesoXTarjetaModel } from '../../../../models/procesoXTarjeta.model';

type ProcesoFormularioGroup = FormGroup<{
  procesoId: FormControl<number | null>;
  tiempo: FormControl<number | null>;
  operariosIds: FormControl<number[] | null>;
}>;

@Component({
  selector: 'app-editar-proceso-produccion',
  standalone: true,
  imports: [CommonModule, ReactiveFormsModule],
  changeDetection: ChangeDetectionStrategy.OnPush,
  templateUrl: './editar-proceso-produccion.html',
  styleUrl: './editar-proceso-produccion.css',
})
export class EditarProcesoProduccion {
  private readonly fb = inject(FormBuilder);

  readonly abierto = input(true);
  readonly tarjetaCodigo = input('');
  readonly tarjetaId = input<number | null>(null);
  readonly procesos = input<ProcesoModel[]>([]);
  readonly asignaciones = input<ProcesoXTarjetaModel[]>([]);
  readonly operarios = input<OperarioModel[]>([]);
  readonly cargando = input(false);

  readonly cerrar = output<void>();
  readonly guardar = output<ProcesoXTarjetaModel[]>();

  readonly titulo = computed(() => 'Asignar Tiempos de Procesos');

  readonly modalForm = this.fb.group({
    procesos: this.fb.array<ProcesoFormularioGroup>([]),
  });

  constructor() {
    effect(() => {
      this.reconstruirFormulario(this.procesos(), this.asignaciones());
    });
  }

  get controlesProcesos(): ProcesoFormularioGroup[] {
    return this.modalForm.controls.procesos.controls;
  }

  get tieneProcesos(): boolean {
    return this.controlesProcesos.length > 0;
  }

  cerrarModal(): void {
    this.cerrar.emit();
  }

  guardarAsignacion(): void {
    if (this.modalForm.invalid) {
      this.modalForm.markAllAsTouched();
      return;
    }

    const asignaciones = this.controlesProcesos.map((control, index) => {
      const proceso = this.procesos()[index];
      const valores = control.getRawValue();
      const asignacionExistente = this.asignaciones()[index];

      return {
        id: asignacionExistente?.id,
        procesoId: valores.procesoId ?? proceso?.id,
        operariosIds: valores.operariosIds ?? undefined,
        tiempo: valores.tiempo ?? undefined,
        orden: index + 1,
        tarjetaDeProduccionId: this.tarjetaId() ?? undefined,
      } satisfies ProcesoXTarjetaModel;
    });

    this.guardar.emit(asignaciones);
  }

  trackPorProceso(index: number): number {
    return this.procesos()[index]?.id ?? index;
  }

  obtenerNombreProceso(proceso: ProcesoModel | undefined): string {
    if (!proceso) {
      return 'Proceso no disponible';
    }

    return [proceso.codigo, proceso.nombre].filter(Boolean).join(' - ') || 'Proceso sin nombre';
  }

  obtenerNombreOperario(operario: OperarioModel): string {
    return [operario.nombre, operario.apellido].filter(Boolean).join(' ').trim() || 'Operario sin nombre';
  }

  estaSeleccionado(procesoControl: ProcesoFormularioGroup, operarioId: number | undefined): boolean {
    if (operarioId === undefined) return false;
    const ids: number[] = procesoControl.controls.operariosIds.value ?? [];
    return ids.includes(operarioId);
  }

  toggleOperario(procesoControl: ProcesoFormularioGroup, operarioId: number | undefined): void {
    if (operarioId === undefined) return;
    const control = procesoControl.controls.operariosIds;
    const ids: number[] = [...(control.value ?? [])];
    const idx = ids.indexOf(operarioId);
    if (idx === -1) {
      ids.push(operarioId);
    } else {
      ids.splice(idx, 1);
    }
    control.setValue(ids);
    control.markAsTouched();
  }

  private reconstruirFormulario(procesos: ProcesoModel[], asignaciones: ProcesoXTarjetaModel[]): void {
    const procesosFormArray = this.modalForm.controls.procesos;
    procesosFormArray.clear();

    procesos.forEach((proceso, index) => {
      procesosFormArray.push(this.crearProcesoFormulario(proceso, asignaciones[index]));
    });
  }

  private crearProcesoFormulario(proceso: ProcesoModel, asignacion?: ProcesoXTarjetaModel): ProcesoFormularioGroup {

    let operariosAsignados: number[] = [];
    if (asignacion?.operariosIds) {
      operariosAsignados = asignacion.operariosIds;
    } else if (asignacion?.operarioXProcesoXTarjetas) {
      operariosAsignados = asignacion.operarioXProcesoXTarjetas
        .map(o => o.operarioId)
        .filter((id): id is number => id !== undefined);
    }

    return this.fb.group({
      procesoId: new FormControl<number | null>(proceso.id ?? null, { validators: [Validators.required] }),
      tiempo: new FormControl<number | null>(asignacion?.tiempo ?? null, { validators: [Validators.required, Validators.min(1)] }),
      operariosIds: new FormControl<number[]>(operariosAsignados, { validators: [Validators.required] }),
    });
  }



}
