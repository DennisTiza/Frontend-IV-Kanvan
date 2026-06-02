import { ProcesoModel } from './proceso.model';
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
    producto?: { id?: number; nombre?: string };
    procesoXTarjetas?: ProcesoXTarjetaModel[];
}
