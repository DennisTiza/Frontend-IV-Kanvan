import { Injectable } from '@angular/core';
import { ConfiguracionRutasBackend } from '../../config/configuracion.rutas.backend';
import { HttpClient } from '@angular/common/http';
import { ProcesoXTarjetaModel } from '../../models/procesoXTarjeta.model';
import { catchError, Observable, throwError } from 'rxjs';

@Injectable({
  providedIn: 'root',
})
export class ProcesoXtarjetaService {
  urlBase: string = ConfiguracionRutasBackend.urlBackend;

  constructor(private http: HttpClient) { }

  RegistrarProcesoTarjeta(datos: ProcesoXTarjetaModel) {
    console.log(datos);
    return this.http.post(`${this.urlBase}proceso-x-tarjeta`, datos).pipe(
      catchError(error => {
        console.error('Error al registrar el proceso:', error);
        return throwError(() => error);
      })
    );
  }

  ObtenerProcesosTarjetas(): Observable<ProcesoXTarjetaModel[]> {
    return this.http.get<ProcesoXTarjetaModel[]>(`${this.urlBase}proceso-x-tarjeta`);
  }

  BuscarProcesoTarjeta(id: string): Observable<ProcesoXTarjetaModel> {
    return this.http.get<ProcesoXTarjetaModel>(`${this.urlBase}proceso-x-tarjeta/${id}`);
  }

  EliminarProcesoTarjeta(id: string): Observable<any> {
    return this.http.delete<any>(`${this.urlBase}proceso-x-tarjeta/${id}`);
  }

  ObtenerProcesosTarjetaPorTarjeta(id: string): Observable<ProcesoXTarjetaModel[]> {
    return this.http.get<ProcesoXTarjetaModel[]>(`${this.urlBase}proceso-x-tarjeta/por-tarjeta/${id}`);
  }

  EditarProcesoTarjeta(id: string, datos: ProcesoXTarjetaModel): Observable<any> {
    return this.http.patch<any>(`${this.urlBase}proceso-x-tarjeta/${id}`, datos);
  }
}
