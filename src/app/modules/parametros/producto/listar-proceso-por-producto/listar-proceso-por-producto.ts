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

  constructor(
    private productoXProcesoService: ProductoXProcesoService,
    private procesoService: ProcesoService,
    private cdr: ChangeDetectorRef
  ) {}

  ngOnChanges(changes: SimpleChanges): void {
    if (changes['productoId'] && this.productoId) {
      this.cargarProcesos();
      this.cargarListaProcesos();
    } else if (changes['productoId'] && !this.productoId) {
      this.procesos = [];
    }
  }

  cargarProcesos(): void {
    if (!this.productoId) return;
    this.productoXProcesoService
      .ListarProductosXProcesoPorProducto(String(this.productoId))
      .subscribe({
        next: (data) => {
          this.procesos = data;
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
