import { ProcesoModel } from './proceso.model';
import { UsuarioModel } from './usuario.model';

export class ProcesosXTarjetaModel {
    id?: number;
    procesoId?: number;
    tarjetaDeProduccionId?: number;
    operarioId?: number;
    cantidad?: number;
    tiempo?: number;
    proceso?: ProcesoModel;
    usuario?: UsuarioModel;
}