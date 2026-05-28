import { CommonModule } from '@angular/common';
import { Component, Input, Output, EventEmitter, OnInit, ChangeDetectorRef } from '@angular/core';
import { FormBuilder, FormGroup, ReactiveFormsModule, Validators } from '@angular/forms';
import { ProcesoService } from '../../../../services/parametros/proceso.service';
import { ProductoXProcesoService } from '../../../../services/parametros/producto-xproceso.service';
import { ProcesoModel } from '../../../../models/proceso.model';
import { ProductoXProcesoModel } from '../../../../models/productoXProceso.model';

@Component({
  selector: 'app-agregar-proceso',
  standalone: true,
  imports: [CommonModule, ReactiveFormsModule],
  templateUrl: './agregar-proceso.html',
  styleUrl: './agregar-proceso.css',
})
export class AgregarProceso implements OnInit {
  @Input() productoId: number | undefined;

  @Output() cerrado = new EventEmitter<void>();
  @Output() procesoAgregado = new EventEmitter<void>();

  procesoForm: FormGroup;
  listaProcesos: ProcesoModel[] = [];
  cargando: boolean = false;

  constructor(
    private fb: FormBuilder,
    private procesoService: ProcesoService,
    private productoXProcesoService: ProductoXProcesoService,
    private cdr: ChangeDetectorRef
  ) {
    this.procesoForm = this.fb.group({
      idProceso: ['', Validators.required],
      orden: ['', [Validators.required, Validators.min(1)]],
    });
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
    if (this.procesoForm.invalid || !this.productoId) {
      this.procesoForm.markAllAsTouched();
      return;
    }

    this.cargando = true;
    const datos: ProductoXProcesoModel = {
      productoId: this.productoId,
      procesoId: Number(this.procesoForm.get('idProceso')?.value),
      orden: Number(this.procesoForm.get('orden')?.value),
    };

    this.productoXProcesoService.RegistrarProductoXProceso(datos).subscribe({
      next: () => {
        this.cargando = false;
        this.procesoAgregado.emit();
      },
      error: (err) => {
        this.cargando = false;
        console.error('Error al agregar proceso:', err);
        alert('No se pudo agregar el proceso. Intente nuevamente.');
        this.cdr.detectChanges();
      },
    });
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
