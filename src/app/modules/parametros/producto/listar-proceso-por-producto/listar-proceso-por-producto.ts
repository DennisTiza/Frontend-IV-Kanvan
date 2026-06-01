import { CommonModule } from '@angular/common';
import { Component, Input, Output, EventEmitter, OnInit, ChangeDetectorRef } from '@angular/core';
import { ProcesoService } from '../../../../services/parametros/proceso.service';
import { ProductoXProcesoModel } from '../../../../models/productoXProceso.model';
import { ProcesoModel } from '../../../../models/proceso.model';
import { AgregarProceso } from '../agregar-proceso/agregar-proceso';
import { forkJoin } from 'rxjs';

@Component({
  selector: 'app-listar-proceso-por-producto',
  standalone: true,
  imports: [CommonModule, AgregarProceso],
  templateUrl: './listar-proceso-por-producto.html',
  styleUrl: './listar-proceso-por-producto.css',
})
export class ListarProcesoPorProducto implements OnInit {
  @Input() productoNombre: string | undefined;
  @Input() procesos: ProductoXProcesoModel[] = [];
  @Input() deshabilitarAgregar: boolean = false;

  @Output() procesosActualizados = new EventEmitter<ProductoXProcesoModel[]>();
  @Output() procesoEliminado = new EventEmitter<number>();

  listaProcesos: ProcesoModel[] = [];
  mostrarModalAgregar: boolean = false;

  dragStartIndex: number | null = null;
  dragOverIndex: number | null = null;

  constructor(
    private procesoService: ProcesoService,
    private cdr: ChangeDetectorRef
  ) {}

  ngOnInit(): void {
    this.cargarListaProcesos();
  }

  get procesosFiltrados(): ProductoXProcesoModel[] {
    return this.procesos;
  }

  get nextOrden(): number {
    return this.procesos.length > 0 
      ? Math.max(...this.procesos.map(p => p.orden ?? 0)) + 1 
      : 1;
  }

  get mensajeEstadoVacio(): string {
    return 'No hay procesos registrados para este producto.';
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

  onProcesoAgregado(nuevoProceso: ProductoXProcesoModel): void {
    this.mostrarModalAgregar = false;
    const nuevosProcesos = [...this.procesos, nuevoProceso];
    this.procesosActualizados.emit(nuevosProcesos);
  }

  eliminarProcesoXProducto(index: number): void {
    if (confirm('¿Está seguro de eliminar este proceso del producto?')) {
      const proceso = this.procesos[index];
      if (proceso.id) {
        this.procesoEliminado.emit(proceso.id);
      }
      const nuevosProcesos = [...this.procesos];
      nuevosProcesos.splice(index, 1);
      
      nuevosProcesos.forEach((p, i) => {
        p.orden = i + 1;
      });
      
      this.procesosActualizados.emit(nuevosProcesos);
    }
  }

  onDragStart(event: DragEvent, index: number): void {
    this.dragStartIndex = index;
    if (event.dataTransfer) {
      event.dataTransfer.effectAllowed = 'move';
      event.dataTransfer.setData('text/plain', index.toString());
    }
  }

  onDragOver(event: DragEvent, index: number): void {
    event.preventDefault();
    if (this.dragStartIndex !== null && this.dragStartIndex !== index) {
      this.dragOverIndex = index;
      if (event.dataTransfer) {
        event.dataTransfer.dropEffect = 'move';
      }
    }
  }

  onDragLeave(event: DragEvent, index: number): void {
    if (this.dragOverIndex === index) {
      this.dragOverIndex = null;
    }
  }

  onDrop(event: DragEvent, index: number): void {
    event.preventDefault();
    this.dragOverIndex = null;
    
    if (this.dragStartIndex === null || this.dragStartIndex === index) {
      return;
    }

    const nuevosProcesos = [...this.procesos];
    const draggedItem = nuevosProcesos[this.dragStartIndex];
    nuevosProcesos.splice(this.dragStartIndex, 1);
    nuevosProcesos.splice(index, 0, draggedItem);
    
    nuevosProcesos.forEach((p, i) => {
      p.orden = i + 1;
    });
    
    this.dragStartIndex = null;
    this.procesosActualizados.emit(nuevosProcesos);
  }
  
  onDragEnd(event: DragEvent): void {
    this.dragStartIndex = null;
    this.dragOverIndex = null;
  }
}
