import { CommonModule } from '@angular/common';
import { ChangeDetectionStrategy, Component, OnInit, computed, inject, signal } from '@angular/core';
import { TarjetaProduccionModel } from '../../../../models/tarjeta-produccion.model';
import { TarjetaProduccionService } from '../../../../services/parametros/tarjeta-produccion.service';
import { SeguridadService } from '../../../../services/seguridad.service';
import { PermisoModel } from '../../../../models/permiso.model';

@Component({
  selector: 'app-listar-tarjeta-produccion',
  imports: [CommonModule],
  changeDetection: ChangeDetectionStrategy.OnPush,
  templateUrl: './listar-tarjeta-produccion.html',
  styleUrl: './listar-tarjeta-produccion.css',
})
export class ListarTarjetaProduccion implements OnInit {
  private readonly tarjetaProduccionService = inject(TarjetaProduccionService);
  private readonly servicioSeguridad = inject(SeguridadService);

  readonly tarjetas = signal<TarjetaProduccionModel[]>([]);

  readonly permisoCrear = signal(false);
  readonly permisoEditar = signal(false);
  readonly permisoEliminar = signal(false);

  ngOnInit(): void {
    this.cargarPermisos();
    this.cargarTarjetas();
  }

  private cargarPermisos(): void {
    let sesion = this.servicioSeguridad.validacionDeSesion();
    if (sesion?.menu) {
      let permiso = sesion.menu.find((p: PermisoModel) => p.menuId === '2');
      if (permiso) {
        this.permisoCrear.set(!!permiso.Guardar);
        this.permisoEditar.set(!!permiso.Editar);
        this.permisoEliminar.set(!!permiso.Eliminar);
      }
    }
  }

  cargarTarjetas(): void {
    this.tarjetaProduccionService.ListarTarjetas().subscribe({
      next: (data) => {
        this.tarjetas.set(data);
      },
      error: (err) => console.error('Error al cargar tarjetas de producción:', err),
    });
  }
}
