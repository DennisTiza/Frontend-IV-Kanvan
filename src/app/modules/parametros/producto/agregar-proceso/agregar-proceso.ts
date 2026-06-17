import { CommonModule } from '@angular/common';
import { Component, Input, Output, EventEmitter, OnInit, ChangeDetectorRef } from '@angular/core';
import { FormBuilder, FormGroup, ReactiveFormsModule, Validators } from '@angular/forms';
import { ProcesoService } from '../../../../services/parametros/proceso.service';
import { ProductoXProcesoService } from '../../../../services/parametros/producto-xproceso.service';
import { ProcesoModel } from '../../../../models/proceso.model';
import { ProductoXProcesoModel } from '../../../../models/productoXProceso.model';
import { BuscarSeleccionarDirective } from '../../../../directives/buscar-seleccionar.directive';

@Component({
  selector: 'app-agregar-proceso',
  standalone: true,
  imports: [CommonModule, ReactiveFormsModule, BuscarSeleccionarDirective],
  templateUrl: './agregar-proceso.html',
  styleUrl: './agregar-proceso.css',
})
export class AgregarProceso implements OnInit {
  @Input() productoId: number | undefined;
  @Input() nextOrden: number = 1;

  @Output() cerrado = new EventEmitter<void>();
  @Output() procesoAgregado = new EventEmitter<ProductoXProcesoModel>();

  procesoForm: FormGroup;
  listaProcesos: ProcesoModel[] = [];
  cargando: boolean = false;

  get opcionesProceso(): string[] {
    return this.listaProcesos.map((p) => `${p.codigo ?? ''} - ${p.nombre ?? ''}`.trim());
  }

  constructor(
    private fb: FormBuilder,
    private procesoService: ProcesoService,
    private productoXProcesoService: ProductoXProcesoService,
    private cdr: ChangeDetectorRef
  ) {
    this.procesoForm = this.fb.group({
      idProceso: [null as number | null, Validators.required],
      procesoTexto: ['', Validators.required]
    });
  }

  onProcesoSeleccionado(texto: string): void {
    const proceso = this.listaProcesos.find(
      (p) => `${p.codigo ?? ''} - ${p.nombre ?? ''}`.trim() === texto
    );
    this.procesoForm.get('idProceso')?.setValue(proceso?.id ?? null);
    this.procesoForm.get('idProceso')?.markAsTouched();
  }

  ngOnInit(): void {
    this.cargarProcesos();
  }

  cargarProcesos(): void {
    this.procesoService.ObtenerProcesos().subscribe({
      next: (data) => {
        this.listaProcesos = data;
        this.cdr.detectChanges();
      },
      error: (err) => console.error('Error al cargar procesos:', err),
    });
  }

  guardar(): void {
    if (this.procesoForm.invalid) {
      this.procesoForm.markAllAsTouched();
      return;
    }

    const datos: ProductoXProcesoModel = {
      productoId: this.productoId,
      procesoId: Number(this.procesoForm.get('idProceso')?.value),
      orden: this.nextOrden,
    };

    this.procesoAgregado.emit(datos);
  }

  cerrar(): void {
    this.cerrado.emit();
  }

  cerrarAlFondo(event: MouseEvent): void {
    if ((event.target as HTMLElement).classList.contains('modal-overlay')) {
      this.cerrar();
    }
  }
}
