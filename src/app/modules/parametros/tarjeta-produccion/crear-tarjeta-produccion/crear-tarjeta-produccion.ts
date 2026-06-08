import { CommonModule } from '@angular/common';
import { ChangeDetectionStrategy, Component, OnInit, computed, inject, signal } from '@angular/core';
import { FormBuilder, ReactiveFormsModule, Validators, AbstractControl, ValidationErrors } from '@angular/forms';
import { forkJoin } from 'rxjs';
import { ProductoModel } from '../../../../models/producto.model';
import { OperarioModel } from '../../../../models/operario.model';
import { ProcesoModel } from '../../../../models/proceso.model';
import { ProcesoXTarjetaModel } from '../../../../models/procesoXTarjeta.model';
import { TarjetaProduccionModel } from '../../../../models/tarjeta-produccion.model';
import { EditarProcesoProduccion } from '../editar-proceso-produccion/editar-proceso-produccion';
import { BuscarSeleccionarDirective } from '../../../../directives/buscar-seleccionar.directive';
import { ResumenAsignaciones } from '../resumen-asignaciones/resumen-asignaciones';
import { ProductoService } from '../../../../services/parametros/producto.service';
import { ProductoXProcesoService } from '../../../../services/parametros/producto-xproceso.service';
import { ProcesoService } from '../../../../services/parametros/proceso.service';
import { ProcesoXtarjetaService } from '../../../../services/parametros/proceso-xtarjeta.service';
import { OperarioService } from '../../../../services/parametros/operario.service';
import { TarjetaProduccionService } from '../../../../services/parametros/tarjeta-produccion.service';
import { ConfiguracionPaginacion } from '../../../../config/configuracion.paginacion';
import { Paginador } from '../../../../public/componentes/paginador/paginador';

@Component({
  selector: 'app-crear-tarjeta-produccion',
  standalone: true,
  imports: [CommonModule, ReactiveFormsModule, Paginador, EditarProcesoProduccion, ResumenAsignaciones, BuscarSeleccionarDirective],
  changeDetection: ChangeDetectionStrategy.OnPush,
  templateUrl: './crear-tarjeta-produccion.html',
  styleUrl: './crear-tarjeta-produccion.css',
})
export class CrearTarjetaProduccion implements OnInit {
  private readonly fb = inject(FormBuilder);
  private readonly productoService = inject(ProductoService);
  private readonly productoXProcesoService = inject(ProductoXProcesoService);
  private readonly procesoService = inject(ProcesoService);
  private readonly operarioService = inject(OperarioService);
  private readonly procesoXTarjetaService = inject(ProcesoXtarjetaService);
  private readonly tarjetaService = inject(TarjetaProduccionService);

  readonly productos = signal<ProductoModel[]>([]);
  readonly tarjetas = signal<TarjetaProduccionModel[]>([]);
  readonly tarjetaSeleccionada = signal<TarjetaProduccionModel | null>(null);
  readonly tarjetaModal = signal<TarjetaProduccionModel | null>(null);
  readonly procesosModal = signal<ProcesoModel[]>([]);
  readonly asignacionesModal = signal<ProcesoXTarjetaModel[]>([]);
  readonly operariosModal = signal<OperarioModel[]>([]);
  readonly modalProcesoAbierto = signal(false);
  readonly guardandoProcesos = signal(false);
  readonly cargando = signal(false);
  readonly guardando = signal(false);
  readonly filtroBusqueda = signal('');
  readonly esNuevaTarjeta = signal(false);

  paginaActual: number = 1;
  registrosPorPagina: number = ConfiguracionPaginacion.registrosPorPagina;

  readonly tarjetaForm = this.fb.group({
    codigo: ['', [Validators.required, Validators.maxLength(30)]],
    productoTexto: ['', Validators.required],
    productoId: [null as number | null, Validators.required],
    cantidad: [100, [Validators.required, Validators.min(1)]],
    fechaPlaneada: ['', Validators.required],
    fechaEntrega: ['', Validators.required],
  }, { validators: this.validarFechas });

  /** Opciones de texto para la directiva buscar-seleccionar */
  readonly opcionesProducto = computed(() =>
    this.productos().map((p) => `${p.codigo ?? ''} - ${p.nombre ?? ''}`.trim())
  );

  /** Mapea el texto seleccionado al productoId y actualiza el form */
  onProductoSeleccionado(texto: string): void {
    const producto = this.productos().find(
      (p) => `${p.codigo ?? ''} - ${p.nombre ?? ''}`.trim() === texto
    );
    this.tarjetaForm.get('productoId')?.setValue(producto?.id ?? null);
    this.tarjetaForm.get('productoId')?.markAsTouched();
  }

  private validarFechas(group: AbstractControl): ValidationErrors | null {
    const fechaInicio = group.get('fechaPlaneada')?.value;
    const fechaEntrega = group.get('fechaEntrega')?.value;

    if (fechaInicio && fechaEntrega) {
      const inicio = new Date(fechaInicio);
      const entrega = new Date(fechaEntrega);

      if (inicio >= entrega) {
        return { fechaInvalida: true };
      }
    }
    return null;
  }

  readonly tarjetasFiltradas = computed(() => {
    const termino = this.filtroBusqueda().trim().toLowerCase();
    const tarjetas = this.tarjetas();

    if (!termino) {
      return tarjetas;
    }

    return tarjetas.filter((tarjeta) => {
      const codigo = (tarjeta.codigo ?? '').toLowerCase();
      const producto = (tarjeta.productoNombre ?? this.obtenerNombreProducto(tarjeta)).toLowerCase();
      const estado = (tarjeta.estado ?? '').toLowerCase();

      return codigo.includes(termino) || producto.includes(termino) || estado.includes(termino);
    });
  });

  readonly tarjetasPaginadas = computed(() => {
    const inicio = (this.paginaActual - 1) * this.registrosPorPagina;
    const fin = inicio + this.registrosPorPagina;
    return this.tarjetasFiltradas().slice(inicio, fin);
  });

  get totalRegistrosMostrados(): number {
    return this.tarjetasFiltradas().length;
  }



  ngOnInit(): void {
    this.cargarProductos();
    this.cargarTarjetas();
  }

  cargarProductos(): void {
    this.productoService.ObtenerProductos().subscribe({
      next: (data) => this.productos.set(data),
      error: (error: unknown) => console.error('Error al cargar productos:', error),
    });
  }

  cargarTarjetas(): void {
    this.cargando.set(true);
    this.tarjetaService.ListarTarjetas().subscribe({
      next: (data) => {
        this.tarjetas.set(data);
        this.paginaActual = 1;
        this.cargando.set(false);
      },
      error: (error: unknown) => {
        console.error('Error al cargar tarjetas de producción:', error);
        this.cargando.set(false);
      },
    });
  }

  cambiarPagina(pagina: number): void {
    this.paginaActual = pagina;
  }

  actualizarFiltro(event: Event): void {
    this.filtroBusqueda.set((event.target as HTMLInputElement).value);
    this.paginaActual = 1;
  }

  seleccionarTarjeta(tarjeta: TarjetaProduccionModel): void {
    this.tarjetaSeleccionada.set(tarjeta);
    // Buscar el texto del producto para poblarlo en el campo de la directiva
    const producto = this.productos().find((p) => p.id === tarjeta.productoId);
    const productoTexto = producto
      ? `${producto.codigo ?? ''} - ${producto.nombre ?? ''}`.trim()
      : '';
    this.tarjetaForm.patchValue({
      codigo: tarjeta.codigo ?? '',
      productoTexto,
      productoId: tarjeta.productoId ?? null,
      cantidad: tarjeta.cantidad ?? 100,
      fechaPlaneada: this.normalizarFechaInput(tarjeta.fechaPlaneada ?? ''),
      fechaEntrega: this.normalizarFechaInput(tarjeta.fechaEntrega ?? '')
    });
  }

  cancelarEdicion(): void {
    this.tarjetaSeleccionada.set(null);
    this.tarjetaForm.reset({
      codigo: '',
      productoTexto: '',
      productoId: null,
      cantidad: 100,
      fechaPlaneada: '',
      fechaEntrega: ''
    });
  }

  guardarTarjeta(): void {
    if (this.tarjetaForm.invalid) {
      this.tarjetaForm.markAllAsTouched();
      return;
    }

    const tarjetaActual = this.tarjetaSeleccionada();
    const esCreacion = !tarjetaActual?.id;
    const formValue = this.tarjetaForm.getRawValue();
    const datos: Partial<TarjetaProduccionModel> = {
      codigo: formValue.codigo?.trim(),
      productoId: formValue.productoId ?? undefined,
      cantidad: formValue.cantidad ?? undefined,
      fechaPlaneada: formValue.fechaPlaneada ? new Date(formValue.fechaPlaneada) : undefined,
      fechaEntrega: formValue.fechaEntrega ? new Date(formValue.fechaEntrega) : undefined
    };

    const estadoActualizado = this.tarjetaSeleccionada()?.estado?.trim();
    datos.estado = estadoActualizado;

    this.guardando.set(true);

    const peticion = tarjetaActual?.id
      ? this.tarjetaService.ActualizarTarjeta(tarjetaActual.id, datos)
      : this.tarjetaService.CrearTarjeta(datos);

    peticion.subscribe({
      next: (tarjetaGuardada) => {
        const tarjetaParaModal: TarjetaProduccionModel = {
          ...(tarjetaActual ?? {}),
          ...datos,
          ...(tarjetaGuardada ?? {}),
        };

        this.esNuevaTarjeta.set(esCreacion);
        this.guardando.set(false);
        this.cancelarEdicion();
        this.cargarTarjetas();
        this.abrirModalProcesos(tarjetaParaModal);
      },
      error: (error: unknown) => {
        console.error('Error al guardar la tarjeta de producción:', error);
        this.guardando.set(false);
      },
    });
  }

  eliminarTarjeta(tarjeta: TarjetaProduccionModel): void {
    if (!tarjeta.id) {
      return;
    }

    const confirmado = confirm(`¿Desea eliminar la tarjeta ${tarjeta.codigo ?? tarjeta.id}?`);
    if (!confirmado) {
      return;
    }

    this.tarjetaService.EliminarTarjeta(tarjeta.id).subscribe({
      next: () => {
        if (this.tarjetaSeleccionada()?.id === tarjeta.id) {
          this.cancelarEdicion();
        }
        this.cargarTarjetas();
      },
      error: (error: unknown) => console.error('Error al eliminar la tarjeta de producción:', error),
    });
  }

  obtenerNombreProducto(tarjeta: TarjetaProduccionModel): string {
    if (tarjeta.productoNombre) {
      return tarjeta.productoNombre;
    }

    const producto = this.productos().find((item) => item.id === tarjeta.productoId);
    return producto ? `${producto.codigo ?? ''} ${producto.nombre ?? ''}`.trim() : 'Sin producto';
  }

  obtenerEstadoEtiqueta(estado?: string): string {
    if (estado === 'por_hacer') return 'Por hacer';
    if (estado === 'en ejecución') return 'En ejecución';
    if (estado === 'finalizada') return 'Finalizada';
    return estado ?? 'Sin estado';
  }

  esEstadoPorHacer(estado?: string): boolean {
    return estado === 'por_hacer';
  }

  esEstadoEnEjecucion(estado?: string): boolean {
    return estado === 'en ejecución';
  }

  esEstadoFinalizada(estado?: string): boolean {
    return estado === 'finalizada';
  }

  trackPorId(_: number, tarjeta: TarjetaProduccionModel): number | undefined {
    return tarjeta.id;
  }

  cerrarModalProcesos(): void {
    const tarjeta = this.tarjetaModal();

    if (this.esNuevaTarjeta() && tarjeta?.id) {
      this.tarjetaService.EliminarTarjeta(tarjeta.id).subscribe({
        next: () => this.cargarTarjetas(),
        error: (error: unknown) => console.error('Error al revertir la tarjeta de producción:', error),
      });
    }

    this.esNuevaTarjeta.set(false);
    this.modalProcesoAbierto.set(false);
    this.tarjetaModal.set(null);
    this.procesosModal.set([]);
    this.asignacionesModal.set([]);
    this.operariosModal.set([]);
  }

  guardarProcesosTarjeta(asignaciones: ProcesoXTarjetaModel[]): void {
    if (!asignaciones.length) {
      this.cerrarModalProcesos();
      return;
    }

    this.guardandoProcesos.set(true);

    forkJoin(asignaciones.map((asignacion) => {
      if (asignacion.id) {
        const { id, ...datos } = asignacion;
        console.log('EDITAR ASIGNACION');
        console.log(datos);
        return this.procesoXTarjetaService.EditarProcesoTarjeta(String(id), datos);
      }

      console.log('ASIGNACION');
      console.log(asignacion);

      return this.procesoXTarjetaService.RegistrarProcesoTarjeta(asignacion);
    })).subscribe({
      next: () => {
        this.esNuevaTarjeta.set(false);
        this.guardandoProcesos.set(false);
        this.cerrarModalProcesos();
        this.cargarTarjetas();
      },
      error: (error: unknown) => {
        console.error('Error al guardar los procesos de la tarjeta:', error);
        console.log(asignaciones);
        this.guardandoProcesos.set(false);
      },
    });
  }

  private normalizarFechaInput(fecha: string | Date | undefined): string {
    if (!fecha) return '';

    // Si ya es un objeto Date, usar métodos locales directamente
    if (fecha instanceof Date) {
      const year = fecha.getFullYear();
      const month = String(fecha.getMonth() + 1).padStart(2, '0');
      const day = String(fecha.getDate()).padStart(2, '0');
      return `${year}-${month}-${day}`;
    }

    // Si ya es solo fecha YYYY-MM-DD, devolverla tal cual
    if (/^\d{4}-\d{2}-\d{2}$/.test(fecha)) {
      return fecha;
    }

    // Si viene como ISO con parte de tiempo (ej: "2024-06-15T00:00:00.000Z"),
    // extraer solo la parte YYYY-MM-DD sin construir un Date (evita desfase UTC→local)
    if (fecha.includes('T')) {
      const soloFecha = fecha.split('T')[0];
      if (/^\d{4}-\d{2}-\d{2}$/.test(soloFecha)) {
        return soloFecha;
      }
    }

    // Si viene con espacio como separador (ej: "2024-06-15 00:00:00")
    if (fecha.includes(' ')) {
      const soloFecha = fecha.split(' ')[0];
      if (/^\d{4}-\d{2}-\d{2}$/.test(soloFecha)) {
        return soloFecha;
      }
    }

    // Fallback: construir Date solo si no hay otra forma
    // Forzar interpretación local añadiendo T00:00:00 sin zona
    const date = new Date(fecha.substring(0, 10) + 'T00:00:00');
    if (Number.isNaN(date.getTime())) return '';

    const year = date.getFullYear();
    const month = String(date.getMonth() + 1).padStart(2, '0');
    const day = String(date.getDate()).padStart(2, '0');
    return `${year}-${month}-${day}`;
  }

  formatearFecha(fecha: string | Date | undefined | null): string {
    if (!fecha) return '—';

    const raw = typeof fecha === 'string'
      ? fecha.split('T')[0].split(' ')[0]
      : null;

    if (raw) {
      const [year, month, day] = raw.split('-').map(Number);
      const d = new Date(year, month - 1, day);
      if (!isNaN(d.getTime())) {
        return d.toLocaleDateString('es-ES', { day: '2-digit', month: '2-digit', year: 'numeric' });
      }
    }

    if (fecha instanceof Date && !isNaN(fecha.getTime())) {
      return fecha.toLocaleDateString('es-ES', { day: '2-digit', month: '2-digit', year: 'numeric' });
    }

    return '—';
  }

  private abrirModalProcesos(tarjeta: TarjetaProduccionModel): void {
    const tarjetaId = tarjeta.id;
    const productoId = tarjeta.productoId;

    if (!tarjetaId || !productoId) {
      this.tarjetaModal.set(tarjeta);
      this.asignacionesModal.set([]);
      this.modalProcesoAbierto.set(true);
      return;
    }

    this.guardandoProcesos.set(true);

    forkJoin({
      relaciones: this.productoXProcesoService.ListarProductosXProcesoPorProducto(String(productoId)),
      procesos: this.procesoService.ObtenerProcesos(),
      operarios: this.operarioService.ObtenerOperarios(),
      asignaciones: this.procesoXTarjetaService.ObtenerProcesosTarjetaPorTarjeta(String(tarjetaId)),
    }).subscribe({
      next: ({ relaciones, procesos, operarios, asignaciones }) => {
        let procesosOrdenados = relaciones
          .sort((izquierda, derecha) => (izquierda.orden ?? 0) - (derecha.orden ?? 0))
          .map((relacion) => procesos.find((proceso) => proceso.id === relacion.procesoId))
          .filter((proceso): proceso is ProcesoModel => Boolean(proceso));

        if (!procesosOrdenados.length && asignaciones.length) {
          procesosOrdenados = asignaciones
            .map((asignacion) => procesos.find((proceso) => proceso.id === asignacion.procesoId))
            .filter((proceso): proceso is ProcesoModel => Boolean(proceso));
        }

        this.tarjetaModal.set(tarjeta);
        this.procesosModal.set(procesosOrdenados);
        this.asignacionesModal.set(asignaciones);
        this.operariosModal.set(operarios);
        this.modalProcesoAbierto.set(true);
        this.guardandoProcesos.set(false);
      },
      error: (error: unknown) => {
        console.error('Error al cargar los datos del modal de procesos:', error);
        this.tarjetaModal.set(tarjeta);
        this.procesosModal.set([]);
        this.asignacionesModal.set([]);
        this.operariosModal.set([]);
        this.modalProcesoAbierto.set(true);
        this.guardandoProcesos.set(false);
      },
    });
  }
}