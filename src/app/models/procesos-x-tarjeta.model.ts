import { OperarioModel } from './operario.model';
import { ProcesoModel } from './proceso.model';

export class ProcesosXTarjetaModel {
    id?: number;
    procesoId?: number;
    tarjetaDeProduccionId?: number;
    operarioId?: number;
    cantidad?: number;
    tiempo?: number;
    proceso?: ProcesoModel;
    operario?: OperarioModel;
}