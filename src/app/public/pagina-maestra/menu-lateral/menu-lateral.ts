import { ChangeDetectionStrategy, Component, computed, inject, input, OnInit, output, signal } from '@angular/core';
import { Router, RouterLink, RouterLinkActive } from '@angular/router';
import { DomSanitizer, SafeHtml } from '@angular/platform-browser';
import { SeguridadService } from '../../../services/seguridad.service';
import { ItemMenuModel } from '../../../models/itemMenu.model';
import { ConfiguracionMenu } from '../../../config/configuracion.menu';

/** SVG inline para el botón de cerrar sesión */
const ICONO_LOGOUT = `<svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.8" stroke-linecap="round" stroke-linejoin="round"><path d="M9 21H5a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2h4"/><polyline points="16 17 21 12 16 7"/><line x1="21" y1="12" x2="9" y2="12"/></svg>`;

@Component({
  selector: 'app-menu-lateral',
  imports: [RouterLink, RouterLinkActive],
  templateUrl: './menu-lateral.html',
  styleUrl: './menu-lateral.css',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class MenuLateral implements OnInit {
  private readonly servicioSeguridad = inject(SeguridadService);
  private readonly router = inject(Router);
  private readonly sanitizer = inject(DomSanitizer);

  readonly abierto = input(false);
  readonly cerrarMenu = output<void>();

  private readonly menuDinamico = signal<ItemMenuModel[]>([]);

  protected readonly listaMenus = computed(() => {
    const menus = this.menuDinamico();
    if (menus.length > 0) {
      return menus;
    }
    return null;
  });

  /** SVG del botón de cerrar sesión, sanitizado */
  protected readonly iconoLogout: SafeHtml = this.sanitizer.bypassSecurityTrustHtml(ICONO_LOGOUT);

  ngOnInit() {
    const items = this.servicioSeguridad.ObtenerItemsMenu();

    // Si el ícono no viene en el localStorage (sesión antigua), lo reconstruimos
    // desde la config para que no quede vacío.
    const itemsConIcono = items.map(item => {
      if (!item.icono && item.idMenu) {
        const entrada = ConfiguracionMenu.listaMenus.find(m => m.id === item.idMenu);
        return { ...item, icono: entrada?.icono ?? '' };
      }
      return item;
    });

    this.menuDinamico.set(itemsConIcono);
  }

  /** Sanitiza el SVG inline para que Angular lo renderice como HTML seguro */
  protected sanitizarIcono(svg?: string): SafeHtml {
    return this.sanitizer.bypassSecurityTrustHtml(svg ?? '');
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