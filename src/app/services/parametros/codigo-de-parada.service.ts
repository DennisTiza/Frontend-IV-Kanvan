import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { ConfiguracionRutasBackend } from '../../config/configuracion.rutas.backend';
import { Observable, catchError, throwError } from 'rxjs';
import { CodigoDeParadaModel } from '../../models/codigoDeParada.model';

@Injectable({
  providedIn: 'root',
})
export class CodigoDeParadaService {
  urlBase: string = ConfiguracionRutasBackend.urlBackend;

  constructor(private http: HttpClient) { }

  RegistrarCodigoDeParada(datos: CodigoDeParadaModel) {
    return this.http.post(`${this.urlBase}codigo-de-parada`, datos).pipe(
      catchError(error => {
        console.error('Error al registrar el código de parada:', error);
        return throwError(() => error);
      })
    );
  }

  ObtenerCodigosDeParada(): Observable<CodigoDeParadaModel[]> {
    return this.http.get<CodigoDeParadaModel[]>(`${this.urlBase}codigo-de-parada`);
  }

  BuscarCodigoDeParada(id: string): Observable<CodigoDeParadaModel> {
    return this.http.get<CodigoDeParadaModel>(`${this.urlBase}codigo-de-parada/${id}`);
  }

  EliminarCodigoDeParada(id: string): Observable<any> {
    return this.http.delete<any>(`${this.urlBase}codigo-de-parada/${id}`);
  }

  EditarCodigoDeParada(id: string, datos: CodigoDeParadaModel): Observable<any> {
    return this.http.put<any>(`${this.urlBase}codigo-de-parada/${id}`, datos);
  }
}
