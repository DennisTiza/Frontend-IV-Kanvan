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
            titulo: "Tarjeta De Producción",
            ruta: "/parametros/tarjeta-produccion/listar-tarjeta-produccion",
            accion: "Listar"
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
        }
    ];
}