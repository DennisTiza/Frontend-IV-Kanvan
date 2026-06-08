import { ProcesoModel } from './proceso.model';
import { ProcesoXTarjetaModel } from './procesoXTarjeta.model';

export class TarjetaProduccionModel {
    id?: number;
    codigo?: string;
    fechaPlaneada?: Date;
    fechaEntrega?: Date;
    fechaInicio?: string;
    fechaFinal?: string;
    productoId?: number;
    productoNombre?: string;
    orden?: number;
    cantidad?: number;
    estado?: string;
    producto?: { id?: number; nombre?: string };
    procesoXTarjetas?: ProcesoXTarjetaModel[];
}
