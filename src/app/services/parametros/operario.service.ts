import { Injectable } from '@angular/core';
import { ConfiguracionRutasBackend } from '../../config/configuracion.rutas.backend';
import { HttpClient } from '@angular/common/http';
import { catchError, Observable, throwError } from 'rxjs';
import { OperarioModel } from '../../models/operario.model';

@Injectable({
  providedIn: 'root',
})
export class OperarioService {
    urlBase: string = ConfiguracionRutasBackend.urlBackend;

  constructor(private http: HttpClient) { }

  RegistrarOperario(datos: OperarioModel) {
    console.log(datos);
    return this.http.post(`${this.urlBase}operario`, datos).pipe(
      catchError(error => {
        console.error('Error al registrar el operario:', error);
        return throwError(() => error);
      })
    );
  }


  ObtenerOperarios(): Observable<OperarioModel[]> {
    return this.http.get<OperarioModel[]>(`${this.urlBase}operario`);
  }

  BuscarOperario(id: string): Observable<OperarioModel> {
    return this.http.get<OperarioModel>(`${this.urlBase}operario/${id}`);
  }

  EliminarOperario(id: string): Observable<any> {
    return this.http.delete<any>(`${this.urlBase}operario/${id}`);
  }

  EditarOperario(id: string, datos: OperarioModel): Observable<any> {
    return this.http.put<any>(`${this.urlBase}operario/${id}`, datos);
  }
}
