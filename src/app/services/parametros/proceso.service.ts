import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { ConfiguracionRutasBackend } from '../../config/configuracion.rutas.backend';
import { Observable, catchError, throwError } from 'rxjs';
import { ProcesoModel } from '../../models/proceso.model';

@Injectable({
  providedIn: 'root',
})
export class ProcesoService {
  urlBase: string = ConfiguracionRutasBackend.urlBackend;

  constructor(private http: HttpClient) { }

  RegistrarProceso(datos: ProcesoModel) {
    console.log(datos);
    return this.http.post(`${this.urlBase}proceso`, datos).pipe(
      catchError(error => {
        console.error('Error al registrar el proceso:', error);
        return throwError(() => error);
      })
    );
  }


  ObtenerProcesos(): Observable<ProcesoModel[]> {
    return this.http.get<ProcesoModel[]>(`${this.urlBase}proceso`);
  }

  BuscarProceso(id: string): Observable<ProcesoModel> {
    return this.http.get<ProcesoModel>(`${this.urlBase}proceso/${id}`);
  }

  EliminarProceso(id: string): Observable<any> {
    return this.http.delete<any>(`${this.urlBase}proceso/${id}`);
  }

  EditarProceso(id: string, datos: ProcesoModel): Observable<any> {
    return this.http.put<any>(`${this.urlBase}proceso/${id}`, datos);
  }
}

