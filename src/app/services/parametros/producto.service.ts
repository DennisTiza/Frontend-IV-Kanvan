import { Injectable } from '@angular/core';
import { ConfiguracionRutasBackend } from '../../config/configuracion.rutas.backend';
import { HttpClient } from '@angular/common/http';
import { Observable, catchError, throwError } from 'rxjs';
import { ProductoModel } from '../../models/producto.model';

@Injectable({
  providedIn: 'root',
})
export class ProductoService {
  urlBase: string = ConfiguracionRutasBackend.urlBackend;

  constructor(private http: HttpClient) { }

  RegistrarProducto(datos: ProductoModel) {
    console.log(datos);
    return this.http.post(`${this.urlBase}producto`, datos).pipe(
      catchError(error => {
        console.error('Error al registrar el producto:', error);
        return throwError(() => error);
      })
    );
  }

  ObtenerProductos(): Observable<ProductoModel[]> {
    return this.http.get<ProductoModel[]>(`${this.urlBase}producto`);
  }

  BuscarProducto(id: string): Observable<ProductoModel> {
    return this.http.get<ProductoModel>(`${this.urlBase}producto/${id}`);
  }

  EliminarProducto(id: string): Observable<any> {
    return this.http.delete<any>(`${this.urlBase}producto/${id}`);
  }

  EditarProducto(id: string, datos: ProductoModel): Observable<any> {
    return this.http.put<any>(`${this.urlBase}producto/${id}`, datos);
  }
}
