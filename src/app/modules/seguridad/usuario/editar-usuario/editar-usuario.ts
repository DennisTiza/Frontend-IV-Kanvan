import { Component, Input, Output, EventEmitter, OnChanges, SimpleChanges } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormBuilder, FormGroup, ReactiveFormsModule, Validators } from '@angular/forms';
import { UsuarioModel } from '../../../../models/usuario.model';
import { RolModel } from '../../../../models/rol.model';
import { SeguridadService } from '../../../../services/seguridad.service';

@Component({
  selector: 'app-editar-usuario',
  standalone: true,
  imports: [CommonModule, ReactiveFormsModule],
  templateUrl: './editar-usuario.html',
  styleUrl: './editar-usuario.css',
})
export class EditarUsuario implements OnChanges {

  /** El usuario que se va a editar (lo pasa el padre) */
  @Input() usuario: UsuarioModel | null = null;

  /** Lista de roles disponibles (la pasa el padre para no hacer doble petición) */
  @Input() roles: RolModel[] = [];

  /** Se dispara cuando el modal debe cerrarse */
  @Output() modalCerrado = new EventEmitter<void>();

  /** Se dispara cuando el usuario fue guardado con éxito */
  @Output() usuarioActualizado = new EventEmitter<void>();

  visible: boolean = false;
  mostrarClave: boolean = false;

  editForm: FormGroup;

  constructor(
    private fb: FormBuilder,
    private seguridadService: SeguridadService
  ) {
    this.editForm = this.fb.group({
      nombre:  ['', Validators.required],
      apellido: ['', Validators.required],
      correo:  ['', [Validators.required, Validators.email]],
      rolId:   ['', Validators.required],
      clave:   ['']   // opcional en edición
    });
  }

  ngOnChanges(changes: SimpleChanges): void {
    if (changes['usuario'] && this.usuario) {
      // Cada vez que llega un nuevo usuario, abrir el modal y rellenar el form
      this.visible = true;
      this.mostrarClave = false;
      this.editForm.reset({
        nombre:   this.usuario.nombre   ?? '',
        apellido: this.usuario.apellido ?? '',
        correo:   this.usuario.correo   ?? '',
        rolId:    this.usuario.rolId    ?? '',
        clave:    ''
      });
    }
  }

  cerrar(): void {
    this.visible = false;
    this.modalCerrado.emit();
  }

  /** Cierra el modal si el usuario hace clic en el fondo oscuro */
  cerrarAlFondo(event: MouseEvent): void {
    if ((event.target as HTMLElement).classList.contains('modal-overlay')) {
      this.cerrar();
    }
  }

  toggleClave(): void {
    this.mostrarClave = !this.mostrarClave;
  }

  guardarCambios(): void {
    if (this.editForm.invalid) {
      this.editForm.markAllAsTouched();
      return;
    }

    const datos: UsuarioModel = {
      id:       this.usuario?.id,
      nombre:   this.editForm.get('nombre')?.value,
      apellido: this.editForm.get('apellido')?.value,
      correo:   this.editForm.get('correo')?.value,
      rolId:    Number(this.editForm.get('rolId')?.value),
    };

    // Solo incluir la clave si el usuario la escribió
    const clave = this.editForm.get('clave')?.value;
    if (clave && clave.trim() !== '') {
      datos.clave = clave;
    }

    this.seguridadService.EditarUsuario(datos.id!, datos).subscribe({
      next: () => {
        alert('Usuario actualizado exitosamente');
        this.cerrar();
        this.usuarioActualizado.emit();
      },
      error: (err) => {
        console.error('Error al actualizar usuario', err);
        alert('No se pudo actualizar el usuario');
      }
    });
  }
}
