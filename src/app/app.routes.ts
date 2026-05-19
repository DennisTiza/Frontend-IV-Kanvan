import { Routes } from '@angular/router';
import { Inicio } from './public/inicio/inicio';
import { ValidarSesionInactivaGuard } from './guard/validar-sesion-inactiva.guard';
import { ValidarSesionActivaGuard } from './guard/validar-sesion-activa.guard';
import { Usuario } from './modules/seguridad/usuario/usuario';

export const routes: Routes = [
    {
        path: '',
        pathMatch: 'full',
        redirectTo: 'inicio'
    },
    {
        path: 'inicio',
        component: Inicio,
        canActivate: [ValidarSesionInactivaGuard]
    },
    {
        path: 'seguridad/usuario',
        component: Usuario,
        canActivate: [ValidarSesionActivaGuard]
    },
    {
        path: '**',
        redirectTo: 'inicio'
    }
];
