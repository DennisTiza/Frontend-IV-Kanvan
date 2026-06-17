import { CommonModule } from '@angular/common';
import { ChangeDetectionStrategy, Component, ElementRef, computed, effect, inject, input, output, signal } from '@angular/core';
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
  private readonly elRef = inject(ElementRef);

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

  /** Texto de búsqueda por proceso (índice → query) */
  readonly busquedaOperarios = signal<Record<number, string>>({});

  /** Controla si el dropdown de búsqueda está abierto (índice → boolean) */
  readonly dropdownAbierto = signal<Record<number, boolean>>({});

  /** Controla la dirección del dropdown: true = hacia arriba */
  readonly dropdownArriba = signal<Record<number, boolean>>({});

  readonly modalForm = this.fb.group({
    procesos: this.fb.array<ProcesoFormularioGroup>([]),
  });

  constructor() {
    // El effect rastrea ambas señales juntas; solo reconstruye cuando hay procesos.
    effect(() => {
      const procesos = this.procesos();
      const asignaciones = this.asignaciones();
      if (procesos.length > 0) {
        this.reconstruirFormulario(procesos, asignaciones);
      }
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

  toggleOperario(procesoControl: ProcesoFormularioGroup, operarioId: number | undefined, procesoIndex: number): void {
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

  /** Devuelve los operarios filtrados por la búsqueda del proceso i */
  operariosFiltrados(procesoIndex: number): OperarioModel[] {
    const query = (this.busquedaOperarios()[procesoIndex] ?? '').toLowerCase().trim();
    if (!query) return this.operarios();
    return this.operarios().filter(op => {
      const nombre = (op.nombre ?? '').toLowerCase();
      const apellido = (op.apellido ?? '').toLowerCase();
      return nombre.includes(query) || apellido.includes(query);
    });
  }

  /** Devuelve los operarios ya seleccionados para el proceso i */
  operariosSeleccionados(procesoControl: ProcesoFormularioGroup): OperarioModel[] {
    const ids: number[] = procesoControl.controls.operariosIds.value ?? [];
    return this.operarios().filter(op => op.id !== undefined && ids.includes(op.id));
  }

  setBusqueda(procesoIndex: number, query: string): void {
    this.busquedaOperarios.update(prev => ({ ...prev, [procesoIndex]: query }));
  }

  abrirDropdown(procesoIndex: number): void {
    // Detectar si hay espacio suficiente debajo del input; si no, abrir hacia arriba
    const inputId = `buscar-operario-${procesoIndex}`;
    const inputEl: HTMLElement | null = this.elRef.nativeElement.querySelector(`#${inputId}`);
    let abrirArriba = false;
    if (inputEl) {
      const rect = inputEl.getBoundingClientRect();
      const espacioAbajo = window.innerHeight - rect.bottom;
      abrirArriba = espacioAbajo < 220; // 220px ≈ alto máximo del dropdown
    }
    this.dropdownArriba.update(prev => ({ ...prev, [procesoIndex]: abrirArriba }));
    this.dropdownAbierto.update(prev => ({ ...prev, [procesoIndex]: true }));
  }

  cerrarDropdown(procesoIndex: number): void {
    // Pequeño delay para permitir que el click en la opción se registre primero
    setTimeout(() => {
      this.dropdownAbierto.update(prev => ({ ...prev, [procesoIndex]: false }));
    }, 150);
  }

  esDropdownAbierto(procesoIndex: number): boolean {
    return this.dropdownAbierto()[procesoIndex] ?? false;
  }

  esDropdownArriba(procesoIndex: number): boolean {
    return this.dropdownArriba()[procesoIndex] ?? false;
  }

  private reconstruirFormulario(procesos: ProcesoModel[], asignaciones: ProcesoXTarjetaModel[]): void {
    const procesosFormArray = this.modalForm.controls.procesos;
    procesosFormArray.clear();
    // Resetear estados de búsqueda
    this.busquedaOperarios.set({});
    this.dropdownAbierto.set({});
    this.dropdownArriba.set({});

    procesos.forEach((proceso) => {
      // Buscar la asignación por procesoId para evitar errores de mapeo por índice
      const asignacion = asignaciones.find(a => a.procesoId === proceso.id);
      procesosFormArray.push(this.crearProcesoFormulario(proceso, asignacion));
    });
  }

  private crearProcesoFormulario(proceso: ProcesoModel, asignacion?: ProcesoXTarjetaModel): ProcesoFormularioGroup {
    // Extraer ids de operarios asignados desde cualquier estructura que devuelva el backend
    let operariosAsignados: number[] = [];

    if (Array.isArray(asignacion?.operariosIds) && asignacion!.operariosIds!.length > 0) {
      // El backend devolvió los ids directamente
      operariosAsignados = asignacion!.operariosIds!;
    } else if (Array.isArray(asignacion?.operarioXProcesoXTarjetas) && asignacion!.operarioXProcesoXTarjetas!.length > 0) {
      // El backend devolvió la relación anidada
      operariosAsignados = asignacion!.operarioXProcesoXTarjetas!
        .map(o => o.operarioId)
        .filter((id): id is number => id !== undefined && id !== null);
    }

    return this.fb.group({
      procesoId: new FormControl<number | null>(proceso.id ?? null, { validators: [Validators.required] }),
      tiempo: new FormControl<number | null>(asignacion?.tiempo ?? null, { validators: [Validators.required, Validators.min(1)] }),
      operariosIds: new FormControl<number[]>(operariosAsignados, { validators: [Validators.required] }),
    });
  }
}
