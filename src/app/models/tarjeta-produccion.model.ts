import { ProcesoXTarjetaModel } from './procesoXTarjeta.model';

export class TarjetaProduccionModel {
    id?: number;
    codigo?: string;
    fechaPlaneada?: Date;
    fechaInicio?: string;
    fechaFinal?: string;
    productoId?: number;
    productoNombre?: string;
    cantidad?: number;
    estado?: string;
    procesoXTarjetas?: ProcesoXTarjetaModel[];
}
