import { Injectable } from '@angular/core';
import { ConfiguracionRutasBackend } from '../../config/configuracion.rutas.backend';
import { HttpClient } from '@angular/common/http';
import { catchError, Observable, throwError } from 'rxjs';
import { OperarioXProcesoXTarjetaModel } from '../../models/operarioXProcesoXTarjeta.model';

@Injectable({
  providedIn: 'root',
})
export class OperarioXProcesoXTarjetaService {
  urlBase: string = ConfiguracionRutasBackend.urlBackend;

  constructor(private http: HttpClient) { }

  RegistrarOperarioProcesoTarjeta(datos: OperarioXProcesoXTarjetaModel) {
    console.log(datos);
    return this.http.post(`${this.urlBase}operario-x-proceso-x-tarjeta`, datos).pipe(
      catchError(error => {
        console.error('Error al registrar el proceso:', error);
        return throwError(() => error);
      })
    );
  }

  ObtenerOperarioProcesoTarjeta(): Observable<OperarioXProcesoXTarjetaModel[]> {
    return this.http.get<OperarioXProcesoXTarjetaModel[]>(`${this.urlBase}operario-x-proceso-x-tarjeta`);
  }

  BuscarOperarioProcesoTarjeta(id: string): Observable<OperarioXProcesoXTarjetaModel> {
    return this.http.get<OperarioXProcesoXTarjetaModel>(`${this.urlBase}operario-x-proceso-x-tarjeta/${id}`);
  }

  EliminarOperarioProcesoTarjeta(id: string): Observable<any> {
    return this.http.delete<any>(`${this.urlBase}operario-x-proceso-x-tarjeta/${id}`);
  }

  EditarOperarioProcesoTarjeta(id: string, datos: OperarioXProcesoXTarjetaModel): Observable<any> {
    return this.http.patch<any>(`${this.urlBase}operario-x-proceso-x-tarjeta/${id}`, datos);
  }

  ObtenerOperarioProcesoTarjetaPorProcesoTarjeta(id: string): Observable<OperarioXProcesoXTarjetaModel[]> {
    return this.http.get<OperarioXProcesoXTarjetaModel[]>(`${this.urlBase}operario-x-proceso-x-tarjeta/proceso-x-tarjeta/${id}`);
  }
}
