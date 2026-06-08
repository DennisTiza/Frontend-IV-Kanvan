import { OperarioModel } from "./operario.model";
import { ProcesoModel } from "./proceso.model";
import { OperarioXProcesoXTarjetaModel } from "./operarioXProcesoXTarjeta.model";

export class ProcesoXTarjetaModel {
    id?: number;
    procesoId?: number;
    tarjetaDeProduccionId?: number;
    tiempo?: number;
    fechaInicio?: string;
    fechaFinal?: string;
    proceso?: ProcesoModel;
    orden?: number;
    productoXProceso?: { orden?: number };
    operariosIds?: number[];
    operarioXProcesoXTarjetas?: OperarioXProcesoXTarjetaModel[];
}
