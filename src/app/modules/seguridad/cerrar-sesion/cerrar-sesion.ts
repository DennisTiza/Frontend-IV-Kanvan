import { Component } from '@angular/core';
import { Router } from '@angular/router';
import { SeguridadService } from '../../../services/seguridad.service';

@Component({
  selector: 'app-cerrar-sesion',
  templateUrl: './cerrar-sesion.html',
  styleUrls: ['./cerrar-sesion.css']
})
export class CerrarSesion{

  constructor(
    private servicioSeguridad: SeguridadService,
    private router: Router
  ) {

  }

  ngOnInit() {
    this.cerrarSesion();
  }

  cerrarSesion() {
    this.servicioSeguridad.RemoverDatosUsuarioValidado();
    this.router.navigate([""]);
  }

}

