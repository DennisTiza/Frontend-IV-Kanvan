import { CodigoDeParadaModel } from "./codigoDeParada.model";
import { OperarioModel } from "./operario.model";

export class ParadaModel {
    id?: number;
    procesoXTarjetaId?: number;
    codigoDeParadaId?: number;
    cantidadReportada?: number;
    operarioId?: number;
    fecha?: string;
    codigoDeParada?: CodigoDeParadaModel;
    operario?: OperarioModel;
}
