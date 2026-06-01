import { Routes } from '@angular/router';
import { Inicio } from './public/inicio/inicio';
import { ValidarSesionInactivaGuard } from './guard/validar-sesion-inactiva.guard';
import { ValidarSesionActivaGuard } from './guard/validar-sesion-activa.guard';
import { guardarUltimaRutaGuard } from './guard/guardar-ultima-ruta.guard';
import { redireccionWildcardGuard } from './guard/redireccion-wildcard.guard';
import { CrearUsuario } from './modules/seguridad/usuario/crear-usuario/crear-usuario';
import { CrearProducto } from './modules/parametros/producto/crear-producto/crear-producto';
import { CrearProceso } from './modules/parametros/proceso/crear-proceso/crear-proceso';
import { CrearTarjetaProduccion } from './modules/parametros/tarjeta-produccion/crear-tarjeta-produccion/crear-tarjeta-produccion';
import { KanbanBoardComponent } from './modules/parametros/tarjeta-produccion/kanban-board/kanban-board';

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
        canActivate: [ValidarSesionActivaGuard, guardarUltimaRutaGuard]
    },
    {
        path: 'parametros/producto/crear-producto',
        component: CrearProducto,
        canActivate: [ValidarSesionActivaGuard, guardarUltimaRutaGuard]
    },
    {
        path: 'parametros/proceso/crear-proceso',
        component: CrearProceso,
        canActivate: [ValidarSesionActivaGuard, guardarUltimaRutaGuard]
    },
    {
        path: 'parametros/tarjeta-produccion/listar-tarjeta-produccion',
        component: KanbanBoardComponent,
        canActivate: [ValidarSesionActivaGuard, guardarUltimaRutaGuard]
    },
    {
        path: 'parametros/tarjeta-produccion/crear-tarjeta-produccion',
        component: CrearTarjetaProduccion,
        canActivate: [ValidarSesionActivaGuard, guardarUltimaRutaGuard]
    },
    {
        path: 'parametros/tarjeta-produccion/kanban',
        component: KanbanBoardComponent,
        canActivate: [ValidarSesionActivaGuard, guardarUltimaRutaGuard]
    },
    {
        path: '**',
        component: Inicio,
        canActivate: [redireccionWildcardGuard]
    }
];
