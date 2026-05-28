import { ChangeDetectionStrategy, Component, signal } from '@angular/core';
import { FormBuilder, FormGroup, ReactiveFormsModule, Validators } from '@angular/forms';
import { SeguridadService } from '../../services/seguridad.service';
import { Router } from '@angular/router';
import { UsuarioValidadoModel } from '../../models/usuario.validado.model';

@Component({
  selector: 'app-inicio',
  imports: [ReactiveFormsModule],
  templateUrl: './inicio.html',
  styleUrl: './inicio.css',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class Inicio {
  fGroup: FormGroup = new FormGroup({});
  mostrarClave = signal(false);
  
  // Estados para el modal de error elegante
  mostrarModalError = signal(false);
  mensajeError = signal('');

  constructor(
    private fb: FormBuilder,
    private servicioSeguridad: SeguridadService,
    private router: Router
  ) {

  }

  ngOnInit() {
    this.ConstruirFormulario();
  }

  ConstruirFormulario() {
    this.fGroup = this.fb.group({
      usuario: ['', [Validators.required, Validators.email]],
      clave: ['', [Validators.required,]]
    });
  }

  IdentificarUsuario() {
    if (this.fGroup.invalid) {
      this.fGroup.markAllAsTouched();
      this.mostrarErrorModal('Por favor, complete todos los campos requeridos correctamente.');
      return;
    }

    const usuario = this.obtenerFormGroup['usuario'].value;
    const clave = this.obtenerFormGroup['clave'].value;

    this.servicioSeguridad.IdentificarUsuario(usuario, clave).subscribe({
      next: (resp: UsuarioValidadoModel) => {
        if (resp?.user && resp?.token) {
          this.servicioSeguridad.AlmacenarDatosUsuarioIdentificado(resp.user);
          this.servicioSeguridad.AlmacenarDatosUsuarioValidado(resp);
          this.router.navigate([this.servicioSeguridad.ObtenerPrimerMenu()]);
        } else {
          this.mostrarErrorModal('El correo electrónico o la contraseña ingresados son incorrectos. Por favor, verifíquelos e intente nuevamente.');
        }
      },
      error: (err) => {
        console.log(err);
        // Si el estado es 0, suele indicar que el servidor está caído o hay un fallo de red
        if (err.status === 0) {
          this.mostrarErrorModal('No se pudo establecer conexión con el servidor. Por favor, verifique su conexión a internet y asegúrese de que el backend esté activo.');
        } else {
          // Para otros códigos de estado (400, 401, etc.), asumimos credenciales incorrectas como hacía el alert original
          this.mostrarErrorModal('El correo electrónico o la contraseña ingresados son incorrectos. Por favor, verifíquelos e intente nuevamente.');
        }
      }
    });
  }

  mostrarErrorModal(mensaje: string) {
    this.mensajeError.set(mensaje);
    this.mostrarModalError.set(true);
  }

  cerrarModalError() {
    this.mostrarModalError.set(false);
  }

  alternarClave() {
    this.mostrarClave.update((valorActual) => !valorActual);
  }

  get obtenerFormGroup() {
    return this.fGroup.controls;
  }

}
