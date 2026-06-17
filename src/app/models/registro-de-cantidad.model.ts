import { CodigoDeParadaModel } from "./codigoDeParada.model";
import { OperarioModel } from "./operario.model";

export class RegistroDeCantidadModel {
    id?: number;
    procesoXTarjetaId?: number;
    operarioId?: number;
    cantidad?: number;
    tipo?: 'produccion' | 'parada';
    codigoDeParadaId?: number | null;
    fecha?: string;
    operario?: OperarioModel;
    codigoDeParada?: CodigoDeParadaModel | null;
}
