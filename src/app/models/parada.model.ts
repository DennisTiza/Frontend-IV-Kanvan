import { CodigoDeParadaModel } from "./codigoDeParada.model";

export class ParadaModel {
    id?: number;
    procesoXTarjetaId?: number;
    codigoDeParadaId?: number;
    cantidadReportada?: number;
    fecha?: string;
    codigoDeParada?: CodigoDeParadaModel;
}
