import { OperarioModel } from "./operario.model";
import { ProcesoModel } from "./proceso.model";

export class ProcesoXTarjetaModel {
    id?: number;
    procesoId?: number;
    tarjetaDeProduccionId?: number;
    operarioId?: number;
    orden?: number;
    tiempo?: number;
    fechaInicio?: string;
    fechaFinal?: string;
    operario?: OperarioModel;
    proceso?: ProcesoModel;
}