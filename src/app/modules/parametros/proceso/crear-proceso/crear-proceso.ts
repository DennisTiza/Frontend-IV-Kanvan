import { CommonModule } from '@angular/common';
import { ChangeDetectionStrategy, Component, OnInit, computed, inject, signal } from '@angular/core';
import { FormBuilder, ReactiveFormsModule, Validators } from '@angular/forms';
import { ConfiguracionPaginacion } from '../../../../config/configuracion.paginacion';
import { ProcesoModel } from '../../../../models/proceso.model';
import { ProcesoService } from '../../../../services/parametros/proceso.service';
import { ConfirmModalComponent } from '../../../../shared/components/confirm-modal/confirm-modal.component';

@Component({
  selector: 'app-crear-proceso',
  imports: [CommonModule, ReactiveFormsModule, ConfirmModalComponent],
  changeDetection: ChangeDetectionStrategy.OnPush,
  templateUrl: './crear-proceso.html',
  styleUrl: './crear-proceso.css',
})
export class CrearProceso implements OnInit {
  private readonly fb = inject(FormBuilder);
  private readonly procesoService = inject(ProcesoService);

  readonly registrosPorPagina = ConfiguracionPaginacion.registrosPorPagina;
  readonly procesos = signal<ProcesoModel[]>([]);
  readonly paginaActual = signal(1);
  readonly procesoSeleccionado = signal<ProcesoModel | null>(null);
  readonly filtroBusqueda = signal('');

  readonly mostrarConfirmacionEliminar = signal(false);
  readonly procesoAEliminar = signal<ProcesoModel | null>(null);

  readonly procesoForm = this.fb.group({
    codigo: ['', [Validators.required]],
    nombre: ['', [Validators.required]],
  });

  readonly procesosPaginados = computed(() => {
    const termino = this.filtroBusqueda().trim().toLowerCase();
    const procesosFiltrados = termino
      ? this.procesos().filter((proceso) => {
          const codigo = (proceso.codigo ?? '').toLowerCase();
          const nombre = (proceso.nombre ?? '').toLowerCase();

          return codigo.includes(termino) || nombre.includes(termino);
        })
      : this.procesos();

    const inicio = (this.paginaActual() - 1) * this.registrosPorPagina;
    const fin = inicio + this.registrosPorPagina;
    return procesosFiltrados.slice(inicio, fin);
  });

  readonly totalRegistrosMostrados = computed(() => {
    const termino = this.filtroBusqueda().trim().toLowerCase();

    if (!termino) {
      return this.procesos().length;
    }

    return this.procesos().filter((proceso) => {
      const codigo = (proceso.codigo ?? '').toLowerCase();
      const nombre = (proceso.nombre ?? '').toLowerCase();

      return codigo.includes(termino) || nombre.includes(termino);
    }).length;
  });
  readonly totalPaginas = computed(() => Math.max(1, Math.ceil(this.totalRegistrosMostrados() / this.registrosPorPagina)));
  readonly registroInicio = computed(() => {
    if (this.totalRegistrosMostrados() === 0) return 0;
    return (this.paginaActual() - 1) * this.registrosPorPagina + 1;
  });
  readonly registroFin = computed(() => Math.min(this.paginaActual() * this.registrosPorPagina, this.totalRegistrosMostrados()));

  ngOnInit(): void {
    this.cargarProcesos();
  }

  cargarProcesos(): void {
    this.procesoService.ObtenerProcesos().subscribe({
      next: (data) => {
        this.procesos.set(data);
        this.paginaActual.set(1);
      },
      error: (err) => console.error('Error al cargar procesos:', err),
    });
  }

  guardarProceso(): void {
    if (this.procesoForm.invalid) {
      this.procesoForm.markAllAsTouched();
      return;
    }

    const datos: ProcesoModel = {
      codigo: this.procesoForm.get('codigo')?.value?.trim(),
      nombre: this.procesoForm.get('nombre')?.value?.trim(),
    };

    const procesoActual = this.procesoSeleccionado();

    if (procesoActual?.id) {
      this.procesoService.EditarProceso(String(procesoActual.id), datos).subscribe({
        next: () => {
          this.cargarProcesos();
          this.cancelar();
        },
        error: (err) => console.error('Error al editar el proceso:', err),
      });
      return;
    }

    this.procesoService.RegistrarProceso(datos).subscribe({
      next: () => {
        this.cargarProcesos();
        this.cancelar();
      },
      error: (err) => console.error('Error al registrar el proceso:', err),
    });
  }

  seleccionarProceso(proceso: ProcesoModel): void {
    this.procesoSeleccionado.set(proceso);
    this.procesoForm.patchValue({
      codigo: proceso.codigo ?? '',
      nombre: proceso.nombre ?? '',
    });
  }

  cancelar(): void {
    this.procesoForm.reset();
    this.procesoSeleccionado.set(null);
  }

  eliminarProceso(proceso: ProcesoModel): void {
    if (!proceso.id) return;
    this.procesoAEliminar.set(proceso);
    this.mostrarConfirmacionEliminar.set(true);
  }

  cancelarEliminacion(): void {
    this.procesoAEliminar.set(null);
    this.mostrarConfirmacionEliminar.set(false);
  }

  confirmarEliminacion(): void {
    const proceso = this.procesoAEliminar();
    if (!proceso?.id) return;

    this.procesoService.EliminarProceso(String(proceso.id)).subscribe({
      next: () => {
        if (this.procesoSeleccionado()?.id === proceso.id) {
          this.cancelar();
        }
        this.cancelarEliminacion();
        this.cargarProcesos();
      },
      error: (err) => {
        console.error('Error al eliminar el proceso:', err);
        this.cancelarEliminacion();
      },
    });
  }

  cambiarPagina(pagina: number): void {
    if (pagina >= 1 && pagina <= this.totalPaginas() && pagina !== this.paginaActual()) {
      this.paginaActual.set(pagina);
    }
  }

  actualizarFiltroBusqueda(event: Event): void {
    this.filtroBusqueda.set((event.target as HTMLInputElement).value);
    this.paginaActual.set(1);
  }

  estadoFormulario(): string {
    return this.procesoSeleccionado()
      ? `Editando el proceso ${this.procesoSeleccionado()?.codigo ?? ''}. Los cambios se aplicarán al registro existente.`
      : 'Complete el formulario para registrar un nuevo proceso';
  }

}
