import { OperarioModel } from "./operario.model";
import { ProcesoModel } from "./proceso.model";
import { OperarioXProcesoXTarjetaModel } from "./operarioXProcesoXTarjeta.model";

export class ProcesoXTarjetaModel {
    id?: number;
    procesoId?: number;
    tarjetaDeProduccionId?: number;
    tiempo?: number;
    tiempoConsumido?: number;
    fechaInicio?: string;
    fechaFinal?: string;
    cantidad?: number;
    cantidadRealizada?: number;
    cantidadRegistrada?: number;
    proceso?: ProcesoModel;
    orden?: number;
    productoXProceso?: { orden?: number };
    operariosIds?: number[];
    operarioXProcesoXTarjetas?: OperarioXProcesoXTarjetaModel[];
}
