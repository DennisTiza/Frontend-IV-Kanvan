import { ChangeDetectionStrategy, Component, signal, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, ReactiveFormsModule, Validators } from '@angular/forms';
import { SeguridadService } from '../../services/seguridad.service';
import { Router } from '@angular/router';
import { UsuarioValidadoModel } from '../../models/usuario.validado.model';
import { UsuarioModel } from '../../models/usuario.model';

@Component({
  selector: 'app-inicio',
  imports: [ReactiveFormsModule],
  templateUrl: './inicio.html',
  styleUrl: './inicio.css',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class Inicio implements OnInit {
  fGroup: FormGroup = new FormGroup({});
  mostrarClave = signal(false);

  rolSeleccionado: number = 2; // Por defecto: Operario
  todosLosUsuarios: UsuarioModel[] = [];
  usuariosFiltrados: UsuarioModel[] = [];

  constructor(
    private fb: FormBuilder,
    private servicioSeguridad: SeguridadService,
    private router: Router
  ) {}

  ngOnInit() {
    this.ConstruirFormulario();
    this.cargarUsuarios();
    this.seleccionarPerfil(2); // Iniciar como Operario
  }

  ConstruirFormulario() {
    this.fGroup = this.fb.group({
      usuario: ['', [Validators.required]],
      clave:   ['', [Validators.required]]
    });
  }

  /**
   * Precarga todos los usuarios desde la API.
   * Solo se usa el array cuando el rol es Gerencia (3).
   */
  cargarUsuarios() {
    this.servicioSeguridad.obtenerUsuarios().subscribe({
      next: (data: UsuarioModel[]) => {
        this.todosLosUsuarios = data;
        // Si al cargar ya estamos en Gerencia, poblar el dropdown
        if (this.rolSeleccionado === 3) {
          this.filtrarUsuarios(3);
        }
      },
      error: (err) => console.error('Error al cargar la lista de usuarios', err)
    });
  }

  /**
   * Maneja la selección del perfil.
   * - Operario (2):      correo genérico silencioso → operario@vatovi.com
   * - Administrador (1): correo genérico silencioso → admin@vatovi.com
   * - Gerencia (3):      muestra dropdown con nombres individuales
   */
  seleccionarPerfil(rolId: number) {
    this.rolSeleccionado = rolId;
    this.usuariosFiltrados = [];
    this.fGroup.get('usuario')?.markAsUntouched();

    if (rolId === 2) {
      this.fGroup.get('usuario')?.setValue('operario@vatovi.com');
    } else if (rolId === 1) {
      this.fGroup.get('usuario')?.setValue('admin@vatovi.com');
    } else if (rolId === 3) {
      this.fGroup.get('usuario')?.setValue('');
      this.filtrarUsuarios(3);
    }
  }

  private filtrarUsuarios(rolId: number) {
    this.usuariosFiltrados = this.todosLosUsuarios.filter(u => u.rolId === rolId);
  }

  IdentificarUsuario() {
    if (this.fGroup.invalid) {
      this.fGroup.markAllAsTouched();
      alert('Por favor complete todos los datos.');
      return;
    }

    const correo = this.fGroup.get('usuario')?.value;
    const clave  = this.fGroup.get('clave')?.value;

    this.servicioSeguridad.IdentificarUsuarioConRol(correo, clave, this.rolSeleccionado).subscribe({
      next: (resp: UsuarioValidadoModel) => {
        if (resp?.user && resp?.token) {
          this.servicioSeguridad.AlmacenarDatosUsuarioIdentificado(resp.user);
          this.servicioSeguridad.AlmacenarDatosUsuarioValidado(resp);
          this.router.navigate(['/seguridad/usuario']);
        } else {
          alert('Acceso denegado: Credenciales incorrectas.');
        }
      },
      error: (err) => {
        console.error(err);
        alert(err.error?.error?.message || 'Error al iniciar sesión.');
      }
    });
  }

  alternarClave() {
    this.mostrarClave.update(v => !v);
  }

  get obtenerFormGroup() {
    return this.fGroup.controls;
  }
}
