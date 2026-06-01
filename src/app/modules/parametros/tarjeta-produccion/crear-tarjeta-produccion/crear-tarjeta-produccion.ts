import { CommonModule } from '@angular/common';
import { ChangeDetectionStrategy, Component, OnInit, computed, inject, signal } from '@angular/core';
import { FormBuilder, ReactiveFormsModule, Validators } from '@angular/forms';
import { forkJoin } from 'rxjs';
import { ProductoModel } from '../../../../models/producto.model';
import { OperarioModel } from '../../../../models/operario.model';
import { ProcesoModel } from '../../../../models/proceso.model';
import { ProcesoXTarjetaModel } from '../../../../models/procesoXTarjeta.model';
import { TarjetaProduccionModel } from '../../../../models/tarjeta-produccion.model';
import { EditarProcesoProduccion } from '../editar-proceso-produccion/editar-proceso-produccion';
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
  imports: [CommonModule, ReactiveFormsModule, Paginador, EditarProcesoProduccion],
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

  paginaActual: number = 1;
  registrosPorPagina: number = ConfiguracionPaginacion.registrosPorPagina;

  readonly tarjetaForm = this.fb.group({
    codigo: ['', [Validators.required, Validators.maxLength(30)]],
    productoId: [null as number | null, Validators.required],
    cantidad: [100, [Validators.required, Validators.min(1)]],
    fechaPlaneada: ['', Validators.required],
  });

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

  readonly tarjetasHoy = computed(() => this.contarPorFecha(this.tarjetas(), 'hoy'));
  readonly tarjetasSemana = computed(() => this.contarPorFecha(this.tarjetas(), 'semana'));
  readonly tarjetasMes = computed(() => this.contarPorFecha(this.tarjetas(), 'mes'));

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
    this.tarjetaForm.patchValue({
      codigo: tarjeta.codigo ?? '',
      productoId: tarjeta.productoId ?? null,
      cantidad: tarjeta.cantidad ?? 100,
      fechaPlaneada: this.normalizarFechaInput(tarjeta.fechaPlaneada ?? tarjeta.fechaInicio ?? ''),
    });
  }

  cancelarEdicion(): void {
    this.tarjetaSeleccionada.set(null);
    this.tarjetaForm.reset({
      codigo: '',
      productoId: null,
      cantidad: 100,
      fechaPlaneada: ''
    });
  }

  guardarTarjeta(): void {
    if (this.tarjetaForm.invalid) {
      this.tarjetaForm.markAllAsTouched();
      return;
    }

    const tarjetaActual = this.tarjetaSeleccionada();
    const formValue = this.tarjetaForm.getRawValue();
    const datos: Partial<TarjetaProduccionModel> = {
      codigo: formValue.codigo?.trim(),
      productoId: formValue.productoId ?? undefined,
      cantidad: formValue.cantidad ?? undefined,
      fechaPlaneada: formValue.fechaPlaneada ? new Date(formValue.fechaPlaneada) : undefined,
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
        return this.procesoXTarjetaService.EditarProcesoTarjeta(String(id), datos);
      }

      return this.procesoXTarjetaService.RegistrarProcesoTarjeta(asignacion);
    })).subscribe({
      next: () => {
        this.guardandoProcesos.set(false);
        this.cerrarModalProcesos();
        this.cargarTarjetas();
      },
      error: (error: unknown) => {
        console.error('Error al guardar los procesos de la tarjeta:', error);
        this.guardandoProcesos.set(false);
      },
    });
  }

  private contarPorFecha(tarjetas: TarjetaProduccionModel[], rango: 'hoy' | 'semana' | 'mes'): number {
    const hoy = new Date();

    return tarjetas.filter((tarjeta) => {
      const fechaBase = this.obtenerFechaBase(tarjeta);
      if (!fechaBase) {
        return false;
      }

      const fecha = new Date(fechaBase);
      if (Number.isNaN(fecha.getTime())) {
        return false;
      }

      if (rango === 'hoy') {
        return fecha.toDateString() === hoy.toDateString();
      }

      if (rango === 'semana') {
        const diferenciaDias = Math.floor((hoy.getTime() - fecha.getTime()) / 86400000);
        return diferenciaDias >= 0 && diferenciaDias < 7;
      }

      return fecha.getMonth() === hoy.getMonth() && fecha.getFullYear() === hoy.getFullYear();
    }).length;
  }

  private obtenerFechaBase(tarjeta: TarjetaProduccionModel): string {
    if (tarjeta.fechaPlaneada instanceof Date) {
      return tarjeta.fechaPlaneada.toISOString();
    }
    if (typeof tarjeta.fechaPlaneada === 'string') {
      return tarjeta.fechaPlaneada;
    }
    return tarjeta.fechaInicio ?? '';
  }

  private normalizarFechaInput(fecha: string | Date | undefined): string {
    if (!fecha) return '';

    if (fecha instanceof Date) {
      const year = fecha.getFullYear();
      const month = String(fecha.getMonth() + 1).padStart(2, '0');
      const day = String(fecha.getDate()).padStart(2, '0');
      return `${year}-${month}-${day}`;
    }

    if (/^\d{4}-\d{2}-\d{2}$/.test(fecha)) {
      return fecha;
    }

    const date = new Date(fecha);
    if (Number.isNaN(date.getTime())) return '';

    const year = date.getFullYear();
    const month = String(date.getMonth() + 1).padStart(2, '0');
    const day = String(date.getDate()).padStart(2, '0');
    return `${year}-${month}-${day}`;
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

        // If product-process relations are missing, use existing assignments as source for the edit modal.
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
