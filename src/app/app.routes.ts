import { Routes } from '@angular/router';
import { Inicio } from './public/inicio/inicio';
import { ValidarSesionInactivaGuard } from './guard/validar-sesion-inactiva.guard';
import { ValidarSesionActivaGuard } from './guard/validar-sesion-activa.guard';
import { CrearUsuario } from './modules/seguridad/usuario/crear-usuario/crear-usuario';

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
        path: 'seguridad/crear-usuario',
        component: CrearUsuario,
        canActivate: [ValidarSesionActivaGuard]
    },
    {
        path: '**',
        redirectTo: 'seguridad/crear-usuario'
    }
];
