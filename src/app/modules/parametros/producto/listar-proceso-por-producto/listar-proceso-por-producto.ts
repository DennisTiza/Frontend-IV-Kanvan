import { CommonModule } from '@angular/common';
import { Component, Input, OnChanges, SimpleChanges, ChangeDetectorRef } from '@angular/core';
import { ProductoXProcesoService } from '../../../../services/parametros/producto-xproceso.service';
import { ProcesoService } from '../../../../services/parametros/proceso.service';
import { ProductoXProcesoModel } from '../../../../models/productoXProceso.model';
import { ProcesoModel } from '../../../../models/proceso.model';
import { AgregarProceso } from '../agregar-proceso/agregar-proceso';

@Component({
  selector: 'app-listar-proceso-por-producto',
  standalone: true,
  imports: [CommonModule, AgregarProceso],
  templateUrl: './listar-proceso-por-producto.html',
  styleUrl: './listar-proceso-por-producto.css',
})
export class ListarProcesoPorProducto implements OnChanges {
  @Input() productoId: number | undefined;
  @Input() productoNombre: string | undefined;

  procesos: ProductoXProcesoModel[] = [];
  listaProcesos: ProcesoModel[] = [];
  mostrarModalAgregar: boolean = false;
  filtroBusqueda: string = '';

  constructor(
    private productoXProcesoService: ProductoXProcesoService,
    private procesoService: ProcesoService,
    private cdr: ChangeDetectorRef
  ) {}

  ngOnChanges(changes: SimpleChanges): void {
    if (changes['productoId'] && this.productoId) {
      this.filtroBusqueda = '';
      this.cargarProcesos();
      this.cargarListaProcesos();
    } else if (changes['productoId'] && !this.productoId) {
      this.procesos = [];
      this.filtroBusqueda = '';
    }
  }

  get procesosFiltrados(): ProductoXProcesoModel[] {
    const termino = this.filtroBusqueda.trim().toLowerCase();

    if (!termino) {
      return this.procesos;
    }

    return this.procesos.filter((item) => {
      const nombreProceso = this.obtenerNombreProceso(item.procesoId).toLowerCase();
      const codigoProceso = this.obtenerCodigoProceso(item.procesoId).toLowerCase();
      const orden = String(item.orden ?? '').toLowerCase();
      const cantidad = String(item.cantidad ?? '').toLowerCase();
      const tiempo = String(item.tiempo ?? '').toLowerCase();

      return (
        nombreProceso.includes(termino) ||
        codigoProceso.includes(termino) ||
        orden.includes(termino) ||
        cantidad.includes(termino) ||
        tiempo.includes(termino)
      );
    });
  }

  get mensajeEstadoVacio(): string {
    if (!this.productoId) {
      return 'Guarde el producto primero para gestionar sus procesos.';
    }

    if (this.filtroBusqueda.trim()) {
      return 'No se encontraron procesos que coincidan con la búsqueda.';
    }

    return 'No hay procesos registrados para este producto.';
  }

  actualizarFiltroBusqueda(event: Event): void {
    this.filtroBusqueda = (event.target as HTMLInputElement).value;
  }

  cargarProcesos(): void {
    if (!this.productoId) return;
    this.productoXProcesoService
      .ListarProductosXProcesoPorProducto(String(this.productoId))
      .subscribe({
        next: (data) => {
          this.procesos = [...data].sort((a, b) => (a.orden ?? Number.MAX_SAFE_INTEGER) - (b.orden ?? Number.MAX_SAFE_INTEGER));
          this.cdr.detectChanges();
        },
        error: (err) => console.error('Error al cargar procesos del producto:', err),
      });
  }

  cargarListaProcesos(): void {
    this.procesoService.ObtenerProcesos().subscribe({
      next: (data) => {
        this.listaProcesos = data;
        this.cdr.detectChanges();
      },
      error: (err) => console.error('Error al cargar lista de procesos:', err),
    });
  }

  obtenerNombreProceso(idProceso?: number): string {
    if (!idProceso) return '—';
    const proceso = this.listaProcesos.find((p) => p.id === idProceso);
    return proceso?.nombre ?? '—';
  }

  obtenerCodigoProceso(idProceso?: number): string {
    if (!idProceso) return '';
    const proceso = this.listaProcesos.find((p) => p.id === idProceso);
    return proceso?.codigo ?? '';
  }

  abrirModalAgregar(): void {
    this.mostrarModalAgregar = true;
  }

  onModalCerrado(): void {
    this.mostrarModalAgregar = false;
    this.cdr.detectChanges();
  }

  onProcesoAgregado(): void {
    this.mostrarModalAgregar = false;
    this.cargarProcesos();
  }

  eliminarProcesoXProducto(id?: number): void {
    if (!id) return;
    if (confirm('¿Está seguro de eliminar este proceso del producto?')) {
      this.productoXProcesoService.EliminarProductoXProceso(String(id)).subscribe({
        next: () => {
          this.cargarProcesos();
        },
        error: (err) => {
          console.error('Error al eliminar:', err);
          alert('No se pudo eliminar el proceso.');
        },
      });
    }
  }
}
