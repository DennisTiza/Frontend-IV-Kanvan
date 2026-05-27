import { Injectable } from '@angular/core';
import { ActivatedRouteSnapshot, CanActivate, Router, RouterStateSnapshot, UrlTree } from '@angular/router';
import { Observable } from 'rxjs';
import { SeguridadService } from '../services/seguridad.service';

@Injectable({
  providedIn: 'root'
})
export class ValidarSesionInactivaGuard implements CanActivate {

  constructor(
    private servicioSeguridad: SeguridadService,
    private router: Router
  ) {

  }

  canActivate(
    route: ActivatedRouteSnapshot,
    state: RouterStateSnapshot): Observable<boolean | UrlTree> | Promise<boolean | UrlTree> | boolean | UrlTree {
    let existeSesion = this.servicioSeguridad.validacionDeSesion();
    console.log(existeSesion);
    if (existeSesion == null) {
      return true;
    }
    let menu = this.servicioSeguridad.ObtenerItemsMenu();
    if (menu.length === 0) {
      return true;
    }
    return this.router.createUrlTree([this.servicioSeguridad.ObtenerPrimerMenu()]);
  }

}