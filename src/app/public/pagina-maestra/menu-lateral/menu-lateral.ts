import { ChangeDetectionStrategy, Component, computed, inject, input, output, signal } from '@angular/core';
import { Router, RouterLink, RouterLinkActive } from '@angular/router';
import { SeguridadService } from '../../../services/seguridad.service';
import { ItemMenuModel } from '../../../models/itemMenu.model';

@Component({
  selector: 'app-menu-lateral',
  imports: [RouterLink, RouterLinkActive],
  templateUrl: './menu-lateral.html',
  styleUrl: './menu-lateral.css',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class MenuLateral {
  private readonly servicioSeguridad = inject(SeguridadService);
  private readonly router = inject(Router);
  readonly abierto = input(false);
  readonly cerrarMenu = output<void>();

  private readonly menuDinamico = signal<ItemMenuModel[]>([]);

  protected readonly listaMenus = computed(() => {
    const menus = this.menuDinamico();
    const usuarioLogueado = this.servicioSeguridad.ObtenerDatosUsuarioIdentificado();

    if (menus.length > 0) {
      return menus.filter(menu => {
        // Restringir el menú de Reportes únicamente a Gerencia (Rol 3)
        if (menu.ruta === '/reportes') {
          return usuarioLogueado && usuarioLogueado.rolId === 3;
        }
        return true;
      });
    }
    return null;
  });

  ngOnInit() {
    this.menuDinamico.set(this.servicioSeguridad.ObtenerItemsMenu());
  }

  protected obtenerIcono(texto?: string): string {
    return '•';
  }

  protected cerrarSesion() {
    this.servicioSeguridad.RemoverDatosUsuarioValidado();
    this.router.navigate(['/inicio']);
    this.cerrarMenu.emit();
  }

  protected seleccionarMenu(): void {
    this.cerrarMenu.emit();
  }
}