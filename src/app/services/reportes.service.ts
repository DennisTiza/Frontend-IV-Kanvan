import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { ConfiguracionRutasBackend } from '../config/configuracion.rutas.backend';
import { Observable } from 'rxjs';

export interface TotalPorDiaDto {
  fecha: string;
  totalProducido: number;
}

export interface PorOperarioDto {
  operario: string;
  proceso: string;
  totalProducido: number;
}

export interface TiemposDto {
  tarjetaCodigo: string;
  proceso: string;
  tiempoEstandar: number;
  tiempoReal: number;
  diferencia: number;
  porcentaje: number;
}

export interface ParadasDto {
  codigo: string;
  descripcion: string;
  veces: number;
  cantidadPerdida: number;
}

@Injectable({
  providedIn: 'root',
})
export class ReportesService {
  urlBase: string = ConfiguracionRutasBackend.urlBackend;

  constructor(private http: HttpClient) {}

  ObtenerTotalPorDia(): Observable<TotalPorDiaDto[]> {
    return this.http.get<TotalPorDiaDto[]>(`${this.urlBase}reportes/total-por-dia`);
  }

  ObtenerPorOperario(): Observable<PorOperarioDto[]> {
    return this.http.get<PorOperarioDto[]>(`${this.urlBase}reportes/por-operario`);
  }

  ObtenerTiempos(): Observable<TiemposDto[]> {
    return this.http.get<TiemposDto[]>(`${this.urlBase}reportes/tiempos`);
  }

  ObtenerParadas(): Observable<ParadasDto[]> {
    return this.http.get<ParadasDto[]>(`${this.urlBase}reportes/paradas`);
  }
}
