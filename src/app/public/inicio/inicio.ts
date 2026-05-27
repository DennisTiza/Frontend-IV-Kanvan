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
      alert('Datos incompletos');
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
          alert('Usuario o clave incorrectos');
        }
      },
      error: (err) => {
        console.log(err);
        alert('Usuario o clave incorrectos');
      }
    });
  }

  alternarClave() {
    this.mostrarClave.update((valorActual) => !valorActual);
  }

  get obtenerFormGroup() {
    return this.fGroup.controls;
  }

}
