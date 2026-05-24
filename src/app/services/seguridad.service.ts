import { Injectable } from '@angular/core';
import { BehaviorSubject, catchError, Observable, throwError } from 'rxjs';
import { HttpClient } from '@angular/common/http';
import { UsuarioModel } from '../models/usuario.model';
import { ConfiguracionRutasBackend } from '../config/configuracion.rutas.backend';
import { UsuarioValidadoModel } from '../models/usuario.validado.model';
import { cambiarClavemodel } from '../models/cambiarClave.model';
import { RolModel } from '../models/rol.model';
import { PermisoModel } from '../models/permiso.model';
import { ConfiguracionMenu } from '../config/configuracion.menu';
import { ItemMenuModel } from '../models/itemMenu.model';

@Injectable({
  providedIn: 'root'
})
export class SeguridadService {
  urlBase: string = ConfiguracionRutasBackend.urlBackend;
  constructor(private http: HttpClient) {
    this.validacionDeSesion();
  }

  IdentificarUsuario(usuario: string, clave: string): Observable<UsuarioValidadoModel> {
    return this.http.post<UsuarioValidadoModel>(`${this.urlBase}identificar-usuario`, {
      correo: usuario,
      clave: clave
    });
  }

  IdentificarUsuarioConRol(usuario: string, clave: string, rolIdSeleccionado: number): Observable<UsuarioValidadoModel> {
    return this.http.post<UsuarioValidadoModel>(`${this.urlBase}identificar-usuario`, {
      correo: usuario,
      clave: clave,
      rolIdSeleccionado: rolIdSeleccionado
    });
  }


  RecuperarClavePorUsuario(usuario: string): Observable<UsuarioModel> {
    return this.http.post<UsuarioModel>(`${this.urlBase}recuperar-clave`, {
      correo: usuario
    });
  }

  /**
 * Almacena los datos del usuario
 * @param datos datos del usuario
 */
  AlmacenarDatosUsuarioIdentificado(datos: UsuarioModel): boolean {
    let cadena = JSON.stringify(datos);
    let datosLS = localStorage.getItem("datos-usuario");
    if (datosLS) {
      return false;
    } else {
      localStorage.setItem("datos-usuario", cadena);
      return true;
    }
  }

  /**
   * Obtiene los datos del usuario
   */
  ObtenerDatosUsuarioIdentificado(): UsuarioModel | null {
    let datosLS = localStorage.getItem("datos-usuario");
    if (datosLS) {
      let datos = JSON.parse(datosLS);
      return datos;
    } else {
      return null;
    }
  }

  AlmacenarDatosUsuarioValidado(datos: UsuarioValidadoModel): boolean {
    let datosLS = localStorage.getItem("datos-sesion");
    if (datosLS != null) {
      return false;
    } else {
      let datosString = JSON.stringify(datos);
      localStorage.setItem("datos-sesion", datosString);
      // Si la respuesta incluye permisos, construir y almacenar el encabezado
      if (datos.menu && datos.menu.length > 0) {
        this.ConstruirMenu(datos.menu);
      }
      this.ActualizarComportamientoUsuario(datos);
      return true;
    }
  }

  /** Administración de la sesión de usuario */

  datosUsuarioValidado = new BehaviorSubject<UsuarioValidadoModel>(new UsuarioValidadoModel());

  ObtenerDatosSesion(): Observable<UsuarioValidadoModel> {
    return this.datosUsuarioValidado.asObservable();
  }

  validacionDeSesion(): UsuarioValidadoModel | null {
    let ls = localStorage.getItem("datos-sesion");
    if (ls) {
      let objUsuario = JSON.parse(ls);
      this.ActualizarComportamientoUsuario(objUsuario);
      return objUsuario;
    }
    return null;
  }

  ActualizarComportamientoUsuario(datos: UsuarioValidadoModel) {
    return this.datosUsuarioValidado.next(datos);
  }


  ConstruirMenu(permisos: PermisoModel[]) {
    let menu: ItemMenuModel[] = [];

    permisos.forEach((permiso) => {
      let datosRuta = ConfiguracionMenu.listaMenus
        .filter(x =>
          x.id == permiso.menuId && permiso[x.accion as keyof PermisoModel]
        );

      if (datosRuta.length > 0) {
        let item = new ItemMenuModel();
        item.idMenu = permiso.menuId;
        item.ruta = datosRuta[0].ruta;
        item.titulo = datosRuta[0].titulo;

        menu.push(item);
      }
    });

    this.AlmacenarItemsMenu(menu);
  }

  AlmacenarItemsMenu(items: ItemMenuModel[]) {
    let menuString = JSON.stringify(items);
    localStorage.setItem("menu-lateral", menuString);
  }

  ObtenerItemsMenu(): ItemMenuModel[] {
    let menu: ItemMenuModel[] = [];
    let menuString = localStorage.getItem("menu-lateral");
    if (menuString) {
      menu = JSON.parse(menuString);
    }
    return menu;
  }

  RemoverDatosUsuarioValidado() {
    let datosUsuario = localStorage.getItem("datos-usuario");
    let datosSesion = localStorage.getItem("datos-sesion");
    if (datosUsuario) {
      localStorage.removeItem("datos-usuario");
    }
    if (datosSesion) {
      localStorage.removeItem("datos-sesion");
    }
    localStorage.removeItem("menu-lateral");
    this.ActualizarComportamientoUsuario(new UsuarioValidadoModel());
  }

  RegistrarUsuario(datos: any): Observable<UsuarioModel> {
    console.log(datos);

    return this.http.post<UsuarioModel>(`${this.urlBase}usuario`, {
      nombre: datos.nombre,
      apellido: datos.apellido,
      clave: datos.clave,
      correo: datos.correo,
      rolId: datos.rolId
    })
      .pipe(
        catchError(error => {
          console.error('Error al registrar al usuario:', error);
          return throwError(() => error);
        })
      );
  }

  CambiarClave(datos: any): Observable<cambiarClavemodel> {
    return this.http.patch<cambiarClavemodel>(
      `${this.urlBase}cambiar-clave`,
      datos
    );
  }

  // Método para obtener todos los usuarios
  obtenerUsuarios(): Observable<UsuarioModel[]> {
    return this.http.get<UsuarioModel[]>(`${this.urlBase}usuario`);
  }

  BuscarUsuario(id: number): Observable<UsuarioModel> {
    return this.http.get<UsuarioModel>(`${this.urlBase}usuario/${id}`);
  }

  EditarUsuario(id: number, datos: any): Observable<any> {
    console.log(datos);
    try {
      return this.http.patch<any>(`${this.urlBase}usuario/${id}`, datos);
    } catch (error) {
      console.error('Error al editar el usuario:', error);
      return throwError(() => error);
    }
  }

  EliminarUsuario(id: number): Observable<any> {
    return this.http.delete<any>(`${this.urlBase}usuario/${id}`);
  }

  //  Metodo para obtener todos los roles
  ObtenerRoles(): Observable<RolModel[]> {
    return this.http.get<RolModel[]>(`${this.urlBase}rol`);
  }

  ObtenerTokenLocalStorage(): string {
    let ls = localStorage.getItem("datos-sesion");
    if (ls) {
      let usuario: UsuarioValidadoModel = JSON.parse(ls);
      return usuario.token!;
    } else {
      return "";
    }
  }

}
