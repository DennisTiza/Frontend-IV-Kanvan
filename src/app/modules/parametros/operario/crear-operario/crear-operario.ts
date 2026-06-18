import { CommonModule } from '@angular/common';
import { ChangeDetectionStrategy, Component, OnInit, computed, inject, signal } from '@angular/core';
import { FormBuilder, ReactiveFormsModule, Validators } from '@angular/forms';
import { ConfiguracionPaginacion } from '../../../../config/configuracion.paginacion';
import { OperarioModel } from '../../../../models/operario.model';
import { OperarioService } from '../../../../services/parametros/operario.service';
import { ConfirmModalComponent } from '../../../../shared/components/confirm-modal/confirm-modal.component';

@Component({
  selector: 'app-crear-operario',
  imports: [CommonModule, ReactiveFormsModule, ConfirmModalComponent],
  changeDetection: ChangeDetectionStrategy.OnPush,
  templateUrl: './crear-operario.html',
  styleUrl: './crear-operario.css',
})
export class CrearOperario implements OnInit {
  private readonly fb = inject(FormBuilder);
  private readonly operarioService = inject(OperarioService);

  readonly registrosPorPagina = ConfiguracionPaginacion.registrosPorPagina;
  readonly operarios = signal<OperarioModel[]>([]);
  readonly paginaActual = signal(1);
  readonly operarioSeleccionado = signal<OperarioModel | null>(null);
  readonly filtroBusqueda = signal('');

  readonly mostrarConfirmacionEliminar = signal(false);
  readonly operarioAEliminar = signal<OperarioModel | null>(null);

  readonly operarioForm = this.fb.group({
    nombre: ['', [Validators.required]],
    apellido: ['', [Validators.required]],
  });

  readonly operariosPaginados = computed(() => {
    const termino = this.filtroBusqueda().trim().toLowerCase();
    const operariosFiltrados = termino
      ? this.operarios().filter((o) => {
          const nombre = (o.nombre ?? '').toLowerCase();
          const apellido = (o.apellido ?? '').toLowerCase();
          return nombre.includes(termino) || apellido.includes(termino);
        })
      : this.operarios();

    const inicio = (this.paginaActual() - 1) * this.registrosPorPagina;
    const fin = inicio + this.registrosPorPagina;
    return operariosFiltrados.slice(inicio, fin);
  });

  readonly totalRegistrosMostrados = computed(() => {
    const termino = this.filtroBusqueda().trim().toLowerCase();
    if (!termino) return this.operarios().length;

    return this.operarios().filter((o) => {
      const nombre = (o.nombre ?? '').toLowerCase();
      const apellido = (o.apellido ?? '').toLowerCase();
      return nombre.includes(termino) || apellido.includes(termino);
    }).length;
  });

  readonly totalPaginas = computed(() =>
    Math.max(1, Math.ceil(this.totalRegistrosMostrados() / this.registrosPorPagina))
  );

  readonly registroInicio = computed(() => {
    if (this.totalRegistrosMostrados() === 0) return 0;
    return (this.paginaActual() - 1) * this.registrosPorPagina + 1;
  });

  readonly registroFin = computed(() =>
    Math.min(this.paginaActual() * this.registrosPorPagina, this.totalRegistrosMostrados())
  );

  ngOnInit(): void {
    this.cargarOperarios();
  }

  cargarOperarios(): void {
    this.operarioService.ObtenerOperarios().subscribe({
      next: (data) => {
        this.operarios.set(data);
        this.paginaActual.set(1);
      },
      error: (err) => console.error('Error al cargar operarios:', err),
    });
  }

  guardarOperario(): void {
    if (this.operarioForm.invalid) {
      this.operarioForm.markAllAsTouched();
      return;
    }

    const datos: OperarioModel = {
      nombre: this.operarioForm.get('nombre')?.value?.trim(),
      apellido: this.operarioForm.get('apellido')?.value?.trim(),
    };

    const operarioActual = this.operarioSeleccionado();

    if (operarioActual?.id) {
      this.operarioService.EditarOperario(String(operarioActual.id), datos).subscribe({
        next: () => {
          this.cargarOperarios();
          this.cancelar();
        },
        error: (err) => console.error('Error al editar el operario:', err),
      });
      return;
    }

    this.operarioService.RegistrarOperario(datos).subscribe({
      next: () => {
        this.cargarOperarios();
        this.cancelar();
      },
      error: (err) => console.error('Error al registrar el operario:', err),
    });
  }

  seleccionarOperario(operario: OperarioModel): void {
    this.operarioSeleccionado.set(operario);
    this.operarioForm.patchValue({
      nombre: operario.nombre ?? '',
      apellido: operario.apellido ?? '',
    });
  }

  cancelar(): void {
    this.operarioForm.reset();
    this.operarioSeleccionado.set(null);
  }

  eliminarOperario(operario: OperarioModel): void {
    if (!operario.id) return;
    this.operarioAEliminar.set(operario);
    this.mostrarConfirmacionEliminar.set(true);
  }

  cancelarEliminacion(): void {
    this.operarioAEliminar.set(null);
    this.mostrarConfirmacionEliminar.set(false);
  }

  confirmarEliminacion(): void {
    const operario = this.operarioAEliminar();
    if (!operario?.id) return;

    this.operarioService.EliminarOperario(String(operario.id)).subscribe({
      next: () => {
        if (this.operarioSeleccionado()?.id === operario.id) {
          this.cancelar();
        }
        this.cancelarEliminacion();
        this.cargarOperarios();
      },
      error: (err) => {
        console.error('Error al eliminar el operario:', err);
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

  nombreCompleto(operario: OperarioModel): string {
    return `${operario.nombre ?? ''} ${operario.apellido ?? ''}`.trim();
  }

  estadoFormulario(): string {
    const op = this.operarioSeleccionado();
    return op
      ? `Editando a ${this.nombreCompleto(op)}. Los cambios se aplicarán al registro existente.`
      : 'Complete el formulario para registrar un nuevo operario';
  }
}
