import { OperarioModel } from "./operario.model";

export class OperarioXProcesoXTarjetaModel {
    id?: number;
    operarioId?: number;
    procesoXTarjetaId?: number;
    operario?: OperarioModel;
}