import { ProcesosXTarjetaModel } from './procesos-x-tarjeta.model';

export class TarjetaProduccionModel {
    id?: number;
    codigo?: string;
    fechaInicio?: string;
    fechaFinal?: string;
    productoId?: number;
    productoNombre?: string;
    cantidad?: number;
    estado?: string;
    procesoXTarjetas?: ProcesosXTarjetaModel[];
}
