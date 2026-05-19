import { ChangeDetectionStrategy, Component, computed, inject, output } from '@angular/core';
import { toSignal } from '@angular/core/rxjs-interop';
import { NavigationEnd, Router } from '@angular/router';
import { filter, map, startWith } from 'rxjs/operators';
import { SeguridadService } from '../../../services/seguridad.service';
import { UsuarioValidadoModel } from '../../../models/usuario.validado.model';

@Component({
  selector: 'app-encabezado',
  imports: [],
  templateUrl: './encabezado.html',
  styleUrl: './encabezado.css',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class Encabezado {
  readonly alternarMenu = output<void>();
  private readonly servicioSeguridad = inject(SeguridadService);
  private readonly router = inject(Router);

  private readonly rutaActual = toSignal(
    this.router.events.pipe(
      filter((evento): evento is NavigationEnd => evento instanceof NavigationEnd),
      map(() => this.router.url),
      startWith(this.router.url)
    ),
    { initialValue: this.router.url }
  );

  private readonly sesion = toSignal(
    this.servicioSeguridad.ObtenerDatosSesion(),
    { initialValue: new UsuarioValidadoModel() }
  );

  protected readonly nombreUsuario = computed(() => {
    const usuario = this.sesion().user;
    if (!usuario) {
      return 'Usuario';
    }

    const nombreCompleto = `${usuario.nombre ?? ''} ${usuario.apellido ?? ''}`.trim();
    return nombreCompleto || usuario.correo || 'Usuario';
  });

  protected readonly rolUsuario = computed(() => {
    const rol = this.sesion().user?.rol;
    return rol || 'Operario';
  });

  protected readonly tituloModulo = computed(() => {
    const ruta = this.rutaActual();

    if (ruta.includes('/seguridad/usuario')) {
      return 'Gestión Usuarios';
    }

    if (ruta.includes('/inicio')) {
      return 'Inicio';
    }

    return 'Panel Principal';
  });

  protected abrirMenu(): void {
    this.alternarMenu.emit();
  }

}