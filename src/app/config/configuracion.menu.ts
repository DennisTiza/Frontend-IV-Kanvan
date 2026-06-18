export namespace ConfiguracionMenu {

    /** SVGs inline para cada ítem del menú (sin internet, sin emojis) */
    const iconos: Record<string, string> = {
        usuarios: `<svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.8" stroke-linecap="round" stroke-linejoin="round"><circle cx="12" cy="8" r="4"/><path d="M4 20c0-4 3.6-7 8-7s8 3 8 7"/></svg>`,
        tarjetas: `<svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.8" stroke-linecap="round" stroke-linejoin="round"><rect x="2" y="5" width="20" height="14" rx="3"/><line x1="2" y1="10" x2="22" y2="10"/></svg>`,
        productos: `<svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.8" stroke-linecap="round" stroke-linejoin="round"><path d="M21 16V8a2 2 0 0 0-1-1.73L13 2.27a2 2 0 0 0-2 0L4 6.27A2 2 0 0 0 3 8v8a2 2 0 0 0 1 1.73l7 4a2 2 0 0 0 2 0l7-4A2 2 0 0 0 21 16z"/><polyline points="3.27 6.96 12 12.01 20.73 6.96"/><line x1="12" y1="22.08" x2="12" y2="12"/></svg>`,
        procesos: `<svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.8" stroke-linecap="round" stroke-linejoin="round"><circle cx="12" cy="12" r="3"/><path d="M19.07 4.93a10 10 0 0 1 0 14.14M4.93 4.93a10 10 0 0 0 0 14.14"/><path d="M15.54 8.46a5 5 0 0 1 0 7.07M8.46 8.46a5 5 0 0 0 0 7.07"/></svg>`,
        codigos: `<svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.8" stroke-linecap="round" stroke-linejoin="round"><circle cx="12" cy="12" r="10"/><line x1="12" y1="8" x2="12" y2="12"/><line x1="12" y1="16" x2="12.01" y2="16"/></svg>`,
        kanban: `<svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.8" stroke-linecap="round" stroke-linejoin="round"><rect x="3" y="3" width="5" height="18" rx="1"/><rect x="10" y="3" width="5" height="12" rx="1"/><rect x="17" y="3" width="5" height="15" rx="1"/></svg>`,
        operarios: `<svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.8" stroke-linecap="round" stroke-linejoin="round"><path d="M17 21v-2a4 4 0 0 0-4-4H5a4 4 0 0 0-4 4v2"/><circle cx="9" cy="7" r="4"/><path d="M23 21v-2a4 4 0 0 0-3-3.87"/><path d="M16 3.13a4 4 0 0 1 0 7.75"/></svg>`,
        reportes: `<svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.8" stroke-linecap="round" stroke-linejoin="round"><line x1="18" y1="20" x2="18" y2="10"/><line x1="12" y1="20" x2="12" y2="4"/><line x1="6" y1="20" x2="6" y2="14"/></svg>`,
    };

    export const listaMenus = [
        {
            id: "1",
            titulo: "Usuarios",
            ruta: "/seguridad/crear-usuario",
            accion: "Guardar",
            icono: iconos['usuarios'],
        },
        {
            id: "2",
            titulo: "Tarjetas de Producción",
            ruta: "/parametros/tarjeta-produccion/crear-tarjeta-produccion",
            accion: "Guardar",
            icono: iconos['tarjetas'],
        },
        {
            id: "3",
            titulo: "Productos",
            ruta: "/parametros/producto/crear-producto",
            accion: "Guardar",
            icono: iconos['productos'],
        },
        {
            id: "4",
            titulo: "Procesos",
            ruta: "/parametros/proceso/crear-proceso",
            accion: "Guardar",
            icono: iconos['procesos'],
        },
        {
            id: "5",
            titulo: "Codigos de Parada",
            ruta: "/parametros/codigos-de-parada/crear-codigo",
            accion: "Guardar",
            icono: iconos['codigos'],
        },
        {
            id: "8",
            titulo: "Tablero Kanban",
            ruta: "/parametros/tarjeta-produccion/kanban",
            accion: "Listar",
            icono: iconos['kanban'],
        },
        {
            id: "9",
            titulo: "Operarios",
            ruta: "/parametros/operario/crear-operario",
            accion: "Guardar",
            icono: iconos['operarios'],
        },
        {
            id: "10",
            titulo: "Reportes",
            ruta: "/parametros/reportes",
            accion: "Listar",
            icono: iconos['reportes'],
        },
    ];
}