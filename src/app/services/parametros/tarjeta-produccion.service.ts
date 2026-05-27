import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { ConfiguracionRutasBackend } from '../../config/configuracion.rutas.backend';
import { Observable } from 'rxjs';
import { TarjetaProduccionModel } from '../../models/tarjeta-produccion.model';

@Injectable({
  providedIn: 'root',
})
export class TarjetaProduccionService {
  urlBase: string = ConfiguracionRutasBackend.urlBackend;

  constructor(private http: HttpClient) { }

  ListarTarjetas(): Observable<TarjetaProduccionModel[]> {
    return this.http.get<TarjetaProduccionModel[]>(`${this.urlBase}tarjeta-produccion`);
  }
}
