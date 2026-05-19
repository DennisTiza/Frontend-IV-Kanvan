import { AsyncPipe } from '@angular/common';
import { Component, inject, signal } from '@angular/core';
import { RouterOutlet } from '@angular/router';
import { Encabezado } from "./public/pagina-maestra/encabezado/encabezado";
import { MenuLateral } from './public/pagina-maestra/menu-lateral/menu-lateral';
import { SeguridadService } from './services/seguridad.service';

@Component({
  selector: 'app-root',
  imports: [RouterOutlet, Encabezado, MenuLateral, AsyncPipe],
  templateUrl: './app.html',
  styleUrl: './app.css'
})
export class App {
  private readonly servicioSeguridad = inject(SeguridadService);
  protected readonly title = signal('frontend-IV-Kanvan');
  protected readonly sesion$ = this.servicioSeguridad.ObtenerDatosSesion();
  protected readonly menuAbierto = signal(false);

  protected alternarMenu(): void {
    this.menuAbierto.update((valorActual) => !valorActual);
  }

  protected cerrarMenu(): void {
    this.menuAbierto.set(false);
  }
}
