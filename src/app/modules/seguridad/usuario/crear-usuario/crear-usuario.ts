import { CommonModule } from '@angular/common';
import { Component, OnInit, ChangeDetectorRef } from '@angular/core';
import { FormBuilder, FormGroup, ReactiveFormsModule, Validators } from '@angular/forms';
import { SeguridadService } from '../../../../services/seguridad.service';
import { UsuarioModel } from '../../../../models/usuario.model';
import { RolModel } from '../../../../models/rol.model';
import { Paginador } from '../../../../public/componentes/paginador/paginador';
import { ConfiguracionPaginacion } from '../../../../config/configuracion.paginacion';
import { EditarUsuario } from '../editar-usuario/editar-usuario';

@Component({
  selector: 'app-crear-usuario',
  standalone: true,
  imports: [CommonModule, ReactiveFormsModule, Paginador, EditarUsuario],
  templateUrl: './crear-usuario.html',
  styleUrl: './crear-usuario.css',
})
export class CrearUsuario implements OnInit {
  usuarioForm: FormGroup;
  usuarios: UsuarioModel[] = [];
  roles: RolModel[] = [];
  mostrarClave: boolean = false;
  filtroBusqueda: string = '';

  /** Usuario que se pasa al modal de edición (null = modal cerrado) */
  usuarioSeleccionado: UsuarioModel | null = null;

  paginaActual: number = 1;
  registrosPorPagina: number = ConfiguracionPaginacion.registrosPorPagina;

  get usuariosPaginados(): UsuarioModel[] {
    const inicio = (this.paginaActual - 1) * this.registrosPorPagina;
    const fin = inicio + this.registrosPorPagina;
    return this.usuariosFiltrados.slice(inicio, fin);
  }

  get usuariosFiltrados(): UsuarioModel[] {
    const termino = this.filtroBusqueda.trim().toLowerCase();

    if (!termino) {
      return this.usuarios;
    }

    return this.usuarios.filter((usuario) => {
      const nombre = `${usuario.nombre ?? ''} ${usuario.apellido ?? ''}`.toLowerCase();
      const correo = (usuario.correo ?? '').toLowerCase();
      const rol = this.obtenerNombreRol(usuario.rolId).toLowerCase();

      return nombre.includes(termino) || correo.includes(termino) || rol.includes(termino);
    });
  }

  cambiarPagina(pagina: number): void {
    this.paginaActual = pagina;
  }

  actualizarFiltroBusqueda(event: Event): void {
    this.filtroBusqueda = (event.target as HTMLInputElement).value;
    this.paginaActual = 1;
  }

  constructor(
    private fb: FormBuilder,
    private seguridadService: SeguridadService,
    private cdr: ChangeDetectorRef
  ) {
    this.usuarioForm = this.fb.group({
      nombre: ['', Validators.required],
      apellido: ['', Validators.required],
      correo: ['', [Validators.required, Validators.email]],
      clave: ['', Validators.required],
      rolId: ['', Validators.required]
    });
  }

  ngOnInit(): void {
    this.cargarUsuarios();
    this.cargarRoles();
  }

  cargarUsuarios(): void {
    this.seguridadService.obtenerUsuarios().subscribe({
      next: (data) => {
        this.usuarios = data;
        this.paginaActual = 1;
        this.cdr.detectChanges();
      },
      error: (err) => console.error('Error al cargar usuarios:', err)
    });
  }

  cargarRoles(): void {
    this.seguridadService.ObtenerRoles().subscribe({
      next: (data) => {
        this.roles = data;
        this.cdr.detectChanges();
      },
      error: (err) => console.error('Error al cargar roles:', err)
    });
  }

  obtenerNombreRol(rolId?: number): string {
    if (!rolId) return 'Desconocido';
    const rol = this.roles.find(r => r.id === rolId);
    return rol?.Nombre || 'Desconocido';
  }

  obtenerClaseRol(rolId?: number): string {
    const nombre = this.obtenerNombreRol(rolId).toLowerCase();
    if (nombre.includes('supervisor')) return 'supervisor';
    if (nombre.includes('usuario')) return 'usuario';
    if (nombre.includes('admin')) return 'admin';
    if (nombre.includes('mantenimiento')) return 'mantenimiento';
    return 'usuario';
  }

  obtenerIniciales(nombre?: string, apellido?: string): string {
    const n = nombre ? nombre.charAt(0).toUpperCase() : '';
    const a = apellido ? apellido.charAt(0).toUpperCase() : '';
    return `${n}${a}`;
  }

  crearUsuario(): void {
    if (this.usuarioForm.invalid) {
      this.usuarioForm.markAllAsTouched();
      return;
    }

    const datos = {
      nombre: this.usuarioForm.get('nombre')?.value,
      apellido: this.usuarioForm.get('apellido')?.value,
      correo: this.usuarioForm.get('correo')?.value,
      clave: this.usuarioForm.get('clave')?.value,
      rolId: Number(this.usuarioForm.get('rolId')?.value),
    };

    this.seguridadService.RegistrarUsuario(datos).subscribe({
      next: (res) => {
        alert('Usuario registrado exitosamente');
        this.usuarioForm.reset({ rolId: '' });
        this.cargarUsuarios(); // Recargar la lista
        this.cdr.detectChanges();
      },
      error: (err) => {
        console.error('Error al registrar usuario', err);
      }
    });
  }

  toggleMostrarClave(): void {
    this.mostrarClave = !this.mostrarClave;
  }

  editarUsuario(usuario: UsuarioModel): void {
    this.usuarioSeleccionado = { ...usuario };
  }

  onModalCerrado(): void {
    this.usuarioSeleccionado = null;
  }

  onUsuarioActualizado(): void {
    this.usuarioSeleccionado = null;
    this.cargarUsuarios();
  }

  eliminarUsuario(id: number): void {
    if (confirm('¿Estás seguro de que deseas eliminar este usuario?')) {
      this.seguridadService.EliminarUsuario(id).subscribe({
        next: () => {
          alert('Usuario eliminado exitosamente');
          this.cargarUsuarios(); // Recargar la lista
          this.cdr.detectChanges();
        },
        error: (err) => {
          console.error('Error al eliminar usuario', err);
          alert('No se pudo eliminar el usuario');
        }
      });
    }
  }
}
