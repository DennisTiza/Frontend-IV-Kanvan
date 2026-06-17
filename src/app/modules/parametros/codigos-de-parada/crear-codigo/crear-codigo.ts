import { CommonModule } from '@angular/common';
import { ChangeDetectionStrategy, Component, OnInit, computed, inject, signal } from '@angular/core';
import { FormBuilder, ReactiveFormsModule, Validators } from '@angular/forms';
import { ConfiguracionPaginacion } from '../../../../config/configuracion.paginacion';
import { CodigoDeParadaModel } from '../../../../models/codigoDeParada.model';
import { CodigoDeParadaService } from '../../../../services/parametros/codigo-de-parada.service';
import { ConfirmModalComponent } from '../../../../shared/components/confirm-modal/confirm-modal.component';

@Component({
  selector: 'app-crear-codigo',
  imports: [CommonModule, ReactiveFormsModule, ConfirmModalComponent],
  changeDetection: ChangeDetectionStrategy.OnPush,
  templateUrl: './crear-codigo.html',
  styleUrl: './crear-codigo.css',
})
export class CrearCodigo implements OnInit {
  private readonly fb = inject(FormBuilder);
  private readonly codigoDeParadaService = inject(CodigoDeParadaService);

  readonly registrosPorPagina = ConfiguracionPaginacion.registrosPorPagina;
  readonly codigos = signal<CodigoDeParadaModel[]>([]);
  readonly paginaActual = signal(1);
  readonly codigoSeleccionado = signal<CodigoDeParadaModel | null>(null);
  readonly filtroBusqueda = signal('');

  readonly mostrarConfirmacionEliminar = signal(false);
  readonly codigoAEliminar = signal<CodigoDeParadaModel | null>(null);

  readonly codigoForm = this.fb.group({
    codigo: ['', [Validators.required]],
    descripcion: ['', [Validators.required]],
  });

  readonly codigosPaginados = computed(() => {
    const termino = this.filtroBusqueda().trim().toLowerCase();
    const codigosFiltrados = termino
      ? this.codigos().filter((c) => {
        const codigo = (c.codigo ?? '').toLowerCase();
        const descripcion = (c.descripcion ?? '').toLowerCase();
        return codigo.includes(termino) || descripcion.includes(termino);
      })
      : this.codigos();

    const inicio = (this.paginaActual() - 1) * this.registrosPorPagina;
    const fin = inicio + this.registrosPorPagina;
    return codigosFiltrados.slice(inicio, fin);
  });

  readonly totalRegistrosMostrados = computed(() => {
    const termino = this.filtroBusqueda().trim().toLowerCase();
    if (!termino) return this.codigos().length;

    return this.codigos().filter((c) => {
      const codigo = (c.codigo ?? '').toLowerCase();
      const descripcion = (c.descripcion ?? '').toLowerCase();
      return codigo.includes(termino) || descripcion.includes(termino);
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
    this.cargarCodigos();
  }

  cargarCodigos(): void {
    this.codigoDeParadaService.ObtenerCodigosDeParada().subscribe({
      next: (data) => {
        this.codigos.set(data);
        this.paginaActual.set(1);
      },
      error: (err) => console.error('Error al cargar códigos de parada:', err),
    });
  }

  guardarCodigo(): void {
    if (this.codigoForm.invalid) {
      this.codigoForm.markAllAsTouched();
      return;
    }

    const datos: CodigoDeParadaModel = {
      codigo: this.codigoForm.get('codigo')?.value?.trim(),
      descripcion: this.codigoForm.get('descripcion')?.value?.trim(),
    };

    const codigoActual = this.codigoSeleccionado();

    if (codigoActual?.id) {
      this.codigoDeParadaService.EditarCodigoDeParada(String(codigoActual.id), datos).subscribe({
        next: () => {
          this.cargarCodigos();
          this.cancelar();
        },
        error: (err) => console.error('Error al editar el código de parada:', err),
      });
      return;
    }

    this.codigoDeParadaService.RegistrarCodigoDeParada(datos).subscribe({
      next: () => {
        this.cargarCodigos();
        this.cancelar();
      },
      error: (err) => console.error('Error al registrar el código de parada:', err),
    });
  }

  seleccionarCodigo(codigo: CodigoDeParadaModel): void {
    this.codigoSeleccionado.set(codigo);
    this.codigoForm.patchValue({
      codigo: codigo.codigo ?? '',
      descripcion: codigo.descripcion ?? '',
    });
  }

  cancelar(): void {
    this.codigoForm.reset();
    this.codigoSeleccionado.set(null);
  }

  eliminarCodigo(codigo: CodigoDeParadaModel): void {
    if (!codigo.id) return;
    this.codigoAEliminar.set(codigo);
    this.mostrarConfirmacionEliminar.set(true);
  }

  cancelarEliminacion(): void {
    this.codigoAEliminar.set(null);
    this.mostrarConfirmacionEliminar.set(false);
  }

  confirmarEliminacion(): void {
    const codigo = this.codigoAEliminar();
    if (!codigo?.id) return;

    this.codigoDeParadaService.EliminarCodigoDeParada(String(codigo.id)).subscribe({
      next: () => {
        if (this.codigoSeleccionado()?.id === codigo.id) {
          this.cancelar();
        }
        this.cancelarEliminacion();
        this.cargarCodigos();
      },
      error: (err) => {
        console.error('Error al eliminar el código de parada:', err);
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
    return this.codigoSeleccionado()
      ? `Editando el código ${this.codigoSeleccionado()?.codigo ?? ''}. Los cambios se aplicarán al registro existente.`
      : 'Complete el formulario para registrar un nuevo código de parada';
  }
}
