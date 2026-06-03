import { inject } from '@angular/core';
import { CanActivateFn } from '@angular/router';
import { SeguridadService } from '../services/seguridad.service';

/**
 * Guarda la URL actual como "última ruta visitada" en localStorage
 * cada vez que el usuario navega a una ruta protegida con sesión activa.
 */
export const guardarUltimaRutaGuard: CanActivateFn = (_route, state) => {
  const seguridad = inject(SeguridadService);

  // Solo guardar si hay sesión activa
  if (seguridad.ObtenerDatosUsuarioIdentificado()) {
    localStorage.setItem('ultima-ruta', state.url);
  }

  return true;
};
