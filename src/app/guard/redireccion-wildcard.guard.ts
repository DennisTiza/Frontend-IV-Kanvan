import { inject } from '@angular/core';
import { CanActivateFn, Router } from '@angular/router';
import { SeguridadService } from '../services/seguridad.service';

/**
 * Guard para la ruta wildcard (**).
 * - Si hay sesión activa  → redirige a la última ruta visitada
 *   (guardada por guardarUltimaRutaGuard) o al primer ítem del menú.
 * - Si no hay sesión      → redirige a /inicio (login).
 */
export const redireccionWildcardGuard: CanActivateFn = () => {
  const router = inject(Router);
  const seguridad = inject(SeguridadService);

  const sesionActiva = seguridad.ObtenerDatosUsuarioIdentificado();

  if (sesionActiva) {
    // Intentar restaurar la última ruta visitada
    const ultimaRuta = localStorage.getItem('ultima-ruta');
    if (ultimaRuta) {
      return router.parseUrl(ultimaRuta);
    }

    // Fallback: primer ítem del menú
    const primerMenu = seguridad.ObtenerPrimerMenu();
    if (primerMenu) {
      return router.parseUrl(primerMenu);
    }
  }

  // Sin sesión → página de inicio / login
  return router.parseUrl('/inicio');
};
