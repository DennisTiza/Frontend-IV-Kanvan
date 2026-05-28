import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { ConfiguracionRutasBackend } from '../../config/configuracion.rutas.backend';
import { Observable } from 'rxjs';
import { ProcesosXTarjetaModel } from '../../models/procesos-x-tarjeta.model';

@Injectable({
  providedIn: 'root',
})
export class ProcesosXTarjetaService {
  urlBase: string = ConfiguracionRutasBackend.urlBackend;

  constructor(private http: HttpClient) { }

  ListarPorTarjeta(id: number): Observable<ProcesosXTarjetaModel[]> {
    const filter = {
      include: [
        { relation: 'proceso' },
        { relation: 'usuario' },
      ],
    };
    return this.http.get<ProcesosXTarjetaModel[]>(
      `${this.urlBase}tarjeta-de-produccion/${id}/proceso-x-tarjetas?filter=${encodeURIComponent(JSON.stringify(filter))}`
    );
  }

  ActualizarProcesoXTarjeta(id: number, datos: Partial<ProcesosXTarjetaModel>): Observable<any> {
    return this.http.patch<any>(`${this.urlBase}proceso-x-tarjeta/${id}`, datos);
  }
}