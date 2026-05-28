import { CommonModule } from '@angular/common';
import { ChangeDetectionStrategy, Component, OnInit, inject, signal } from '@angular/core';
import { FormBuilder, ReactiveFormsModule, Validators } from '@angular/forms';
import { Router } from '@angular/router';
import { TarjetaProduccionModel } from '../../../../models/tarjeta-produccion.model';
import { ProductoModel } from '../../../../models/producto.model';
import { TarjetaProduccionService } from '../../../../services/parametros/tarjeta-produccion.service';
import { ProductoService } from '../../../../services/parametros/producto.service';

@Component({
  selector: 'app-crear-tarjeta',
  imports: [CommonModule, ReactiveFormsModule],
  changeDetection: ChangeDetectionStrategy.OnPush,
  templateUrl: './crear-tarjeta.html',
  styleUrl: './crear-tarjeta.css',
})
export class CrearTarjetaProduccion implements OnInit {
  private readonly fb = inject(FormBuilder);
  private readonly router = inject(Router);
  private readonly tarjetaProduccionService = inject(TarjetaProduccionService);
  private readonly productoService = inject(ProductoService);

  readonly productos = signal<ProductoModel[]>([]);
  readonly guardando = signal(false);

  readonly tarjetaForm = this.fb.group({
    codigo: ['', [Validators.required]],
    productoId: [0, [Validators.required, Validators.min(1)]],
    cantidad: [0, [Validators.required, Validators.min(1)]],
    fechaInicio: ['', [Validators.required]],
    fechaFinal: ['', [Validators.required]],
    estado: ['activa'],
  });

  ngOnInit(): void {
    this.cargarProductos();
  }

  private cargarProductos(): void {
    this.productoService.ObtenerProductos().subscribe({
      next: (data) => this.productos.set(data),
      error: (err) => console.error('Error al cargar productos:', err),
    });
  }

  guardarTarjeta(): void {
    if (this.tarjetaForm.invalid) {
      this.tarjetaForm.markAllAsTouched();
      return;
    }

    this.guardando.set(true);
    const datos: Partial<TarjetaProduccionModel> = {
      codigo: this.tarjetaForm.get('codigo')?.value?.trim(),
      productoId: Number(this.tarjetaForm.get('productoId')?.value),
      cantidad: Number(this.tarjetaForm.get('cantidad')?.value),
      fechaInicio: this.tarjetaForm.get('fechaInicio')?.value ?? '',
      fechaFinal: this.tarjetaForm.get('fechaFinal')?.value ?? '',
      estado: this.tarjetaForm.get('estado')?.value ?? 'activa',
    };

    this.tarjetaProduccionService.CrearTarjeta(datos).subscribe({
      next: (tarjeta) => {
        this.guardando.set(false);
        this.router.navigate([`/parametros/tarjeta-produccion/editar-procesos/${tarjeta.id}`]);
      },
      error: (err) => {
        this.guardando.set(false);
        console.error('Error al crear la tarjeta:', err);
        alert('Error al crear la tarjeta de producción.');
      },
    });
  }

  cancelar(): void {
    this.router.navigate(['/parametros/tarjeta-produccion/listar-tarjeta-produccion']);
  }
}