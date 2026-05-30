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

  private baseUrl = `${this.urlBase}tarjeta-de-produccion`;

  ListarTarjetas(): Observable<TarjetaProduccionModel[]> {
    return this.http.get<TarjetaProduccionModel[]>(this.baseUrl);
  }
  CrearTarjeta(datos: Partial<TarjetaProduccionModel>): Observable<TarjetaProduccionModel> {
    return this.http.post<TarjetaProduccionModel>(this.baseUrl, datos);
  }

  BuscarTarjeta(id: number): Observable<TarjetaProduccionModel> {
    return this.http.get<TarjetaProduccionModel>(`${this.baseUrl}/${id}`);
  }

  EliminarTarjeta(id: number): Observable<any> {
    return this.http.delete<any>(`${this.baseUrl}/${id}`);
  }

  ListarTarjetasActivasConProcesos(): Observable<TarjetaProduccionModel[]> {
    const filter = {
      where: { estado: 'activa' },
      include: [
        {
          relation: 'procesoXTarjetas',
          scope: {
            include: [
              { relation: 'proceso' },
              { relation: 'usuario' },
            ],
          },
        },
      ],
    };
    return this.http.get<TarjetaProduccionModel[]>(
      `${this.baseUrl}?filter=${encodeURIComponent(JSON.stringify(filter))}`
    );
  }
}