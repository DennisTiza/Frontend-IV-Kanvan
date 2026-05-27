import { CommonModule } from '@angular/common';
import { Component, OnInit, ChangeDetectorRef } from '@angular/core';
import { FormBuilder, FormGroup, ReactiveFormsModule, Validators } from '@angular/forms';
import { ConfiguracionPaginacion } from '../../../../config/configuracion.paginacion';
import { Paginador } from '../../../../public/componentes/paginador/paginador';
import { ProductoService } from '../../../../services/parametros/producto.service';
import { ProductoXProcesoService } from '../../../../services/parametros/producto-xproceso.service';
import { ProductoModel } from '../../../../models/producto.model';
import { ProductoXProcesoModel } from '../../../../models/productoXProceso.model';
import { ListarProcesoPorProducto } from '../listar-proceso-por-producto/listar-proceso-por-producto';

@Component({
  selector: 'app-crear-producto',
  standalone: true,
  imports: [CommonModule, ReactiveFormsModule, Paginador, ListarProcesoPorProducto],
  templateUrl: './crear-producto.html',
  styleUrl: './crear-producto.css',
})
export class CrearProducto implements OnInit {
  productoForm: FormGroup;
  productos: ProductoModel[] = [];
  relacionesProductoProceso: ProductoXProcesoModel[] = [];
  paginaActual: number = 1;
  registrosPorPagina: number = ConfiguracionPaginacion.registrosPorPagina;
  filtroBusqueda: string = '';

  /** Producto recién creado / seleccionado para listar sus procesos */
  productoActual: ProductoModel | null = null;

  get productosPaginados(): ProductoModel[] {
    const inicio = (this.paginaActual - 1) * this.registrosPorPagina;
    const fin = inicio + this.registrosPorPagina;
    return this.productosFiltrados.slice(inicio, fin);
  }

  get totalRegistrosMostrados(): number {
    return this.productosFiltrados.length;
  }

  get productosFiltrados(): ProductoModel[] {
    const termino = this.filtroBusqueda.trim().toLowerCase();

    if (!termino) {
      return this.productos;
    }

    return this.productos.filter((producto) => {
      const codigo = (producto.codigo ?? '').toLowerCase();
      const nombre = (producto.nombre ?? '').toLowerCase();

      return codigo.includes(termino) || nombre.includes(termino);
    });
  }



  constructor(
    private fb: FormBuilder,
    private productoService: ProductoService,
    private productoXProcesoService: ProductoXProcesoService,
    private cdr: ChangeDetectorRef
  ) {
    this.productoForm = this.fb.group({
      codigo: ['', Validators.required],
      nombre: ['', Validators.required],
    });
  }

  ngOnInit(): void {
    this.cargarProductos();
    this.cargarRelacionesProductoProceso();
  }

  cargarProductos(): void {
    this.productoService.ObtenerProductos().subscribe({
      next: (data: ProductoModel[]) => {
        this.productos = data;
        this.paginaActual = 1;
        this.cdr.detectChanges();
      },
      error: (err: unknown) => console.error('Error al cargar productos:', err),
    });
  }

  cargarRelacionesProductoProceso(): void {
    this.productoXProcesoService.ListarProductosXProceso().subscribe({
      next: (data: ProductoXProcesoModel[]) => {
        this.relacionesProductoProceso = data;
        this.cdr.detectChanges();
      },
      error: (err: unknown) => console.error('Error al cargar procesos por producto:', err),
    });
  }

  cambiarPagina(pagina: number): void {
    this.paginaActual = pagina;
  }

  actualizarFiltroBusqueda(event: Event): void {
    this.filtroBusqueda = (event.target as HTMLInputElement).value;
    this.paginaActual = 1;
  }

  seleccionarProducto(producto: ProductoModel): void {
    this.productoActual = producto;
    this.productoForm.patchValue({
      codigo: producto.codigo,
      nombre: producto.nombre,
    });
  }

  obtenerCantidadProcesos(productoId?: number): number {
    if (!productoId) return 0;
    return this.relacionesProductoProceso.filter((relacion) => relacion.productoId === productoId).length;
  }

  textoProcesos(productoId?: number): string {
    const cantidad = this.obtenerCantidadProcesos(productoId);
    return `${cantidad} ${cantidad === 1 ? 'Paso' : 'Pasos'}`;
  }

  guardarProducto(): void {
    if (this.productoForm.invalid) {
      this.productoForm.markAllAsTouched();
      return;
    }

    const datos: ProductoModel = {
      codigo: this.productoForm.get('codigo')?.value,
      nombre: this.productoForm.get('nombre')?.value,
    };

    if (this.productoActual?.id) {
      // Editar
      this.productoService.EditarProducto(String(this.productoActual.id), datos).subscribe({
        next: () => {
          this.productoActual = { ...this.productoActual, ...datos };
          this.cargarProductos();
          this.cargarRelacionesProductoProceso();
          this.cdr.detectChanges();
        },
        error: (err) => console.error('Error al editar producto:', err),
      });
    } else {
      // Crear
      this.productoService.RegistrarProducto(datos).subscribe({
        next: (res: ProductoModel) => {
          this.productoActual = res;
          this.productoForm.patchValue({
            codigo: res.codigo,
            nombre: res.nombre,
          });
          this.cargarProductos();
          this.cargarRelacionesProductoProceso();
          this.cdr.detectChanges();
        },
        error: (err: unknown) => console.error('Error al registrar producto:', err),
      });
    }
  }

  cancelar(): void {
    this.productoForm.reset();
    this.productoActual = null;
  }

  eliminarProducto(producto: ProductoModel): void {
    if (!producto.id) return;

    if (confirm('¿Está seguro de eliminar este producto?')) {
      this.productoService.EliminarProducto(String(producto.id)).subscribe({
        next: () => {
          if (this.productoActual?.id === producto.id) {
            this.cancelar();
          }
          this.cargarProductos();
          this.cargarRelacionesProductoProceso();
        },
        error: (err: unknown) => {
          console.error('Error al eliminar producto:', err);
          alert('No se pudo eliminar el producto.');
        },
      });
    }
  }

}
