export namespace ConfiguracionMenu {
    export const listaMenus = [
        {
            id: "1",
            titulo: "Usuarios",
            ruta: "/seguridad/crear-usuario",
            accion: "Guardar"
        },
        {
            id: "2",
            titulo: "Tarjetas de Producción",
            ruta: "/parametros/tarjeta-produccion/crear-tarjeta-produccion",
            accion: "Guardar"
        },
        {
            id: "3",
            titulo: "Productos",
            ruta: "/parametros/producto/crear-producto",
            accion: "Guardar"
        },
        {
            id: "4",
            titulo: "Procesos",
            ruta: "/parametros/proceso/crear-proceso",
            accion: "Guardar"
        },
        {
            id: "5",
            titulo: "Codigos de Parada",
            ruta: "/parametros/codigos-de-parada/crear-codigo",
            accion: "Guardar"
        },
        {
            id: "8",
            titulo: "Tablero Kanban",
            ruta: "/parametros/tarjeta-produccion/kanban",
            accion: "Listar"
        },
        {
            id: "9",
            titulo: "Operarios",
            ruta: "/parametros/operario/crear-operario",
            accion: "Guardar"
        },
        {
            id: "10",
            titulo: "Reportes",
            ruta: "/parametros/reportes",
            accion: "Listar"
        },
    ];
}