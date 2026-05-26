import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { ConfiguracionRutasBackend } from '../../config/configuracion.rutas.backend';
import { ProductoXProcesoModel } from '../../models/productoXProceso.model';

@Injectable({
  providedIn: 'root',
})
export class ProductoXProcesoService {
  urlBase: string = ConfiguracionRutasBackend.urlBackend;

  constructor(private http: HttpClient) { }

  RegistrarProductoXProceso(datos: ProductoXProcesoModel): Observable<ProductoXProcesoModel> {
    return this.http.post<ProductoXProcesoModel>(`${this.urlBase}producto-x-proceso`, datos);
  }

  ListarProductosXProceso(): Observable<ProductoXProcesoModel[]> {
    return this.http.get<ProductoXProcesoModel[]>(`${this.urlBase}producto-x-proceso`);
  }

  EliminarProductoXProceso(id: string): Observable<any> {
    return this.http.delete<any>(`${this.urlBase}producto-x-proceso/${id}`);
  }

  ObtenerProductoXProceso(id: string): Observable<ProductoXProcesoModel> {
    return this.http.get<ProductoXProcesoModel>(`${this.urlBase}producto-x-proceso/${id}`);
  }

  EditarProductoXProceso(id: string, datos: ProductoXProcesoModel): Observable<ProductoXProcesoModel> {
    return this.http.put<ProductoXProcesoModel>(`${this.urlBase}producto-x-proceso/${id}`, datos);
  }

  ListarProductosXProcesoPorProducto(id: string): Observable<ProductoXProcesoModel[]> {
    return this.http.get<ProductoXProcesoModel[]>(`${this.urlBase}producto-x-proceso/producto/${id}`);
  }

  ListarProductosXProcesoPorProceso(id: string): Observable<ProductoXProcesoModel[]> {
    return this.http.get<ProductoXProcesoModel[]>(`${this.urlBase}producto-x-proceso/proceso/${id}`);
  }
}
