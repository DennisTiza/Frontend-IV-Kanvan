import { CommonModule } from '@angular/common';
import { ChangeDetectionStrategy, Component, OnInit, inject, signal } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { ActivatedRoute, Router } from '@angular/router';
import { ProcesosXTarjetaModel } from '../../../../models/procesos-x-tarjeta.model';
import { UsuarioModel } from '../../../../models/usuario.model';
import { ProcesosXTarjetaService } from '../../../../services/parametros/procesos-x-tarjeta.service';
import { SeguridadService } from '../../../../services/seguridad.service';

@Component({
  selector: 'app-editar-procesos',
  imports: [CommonModule, FormsModule],
  changeDetection: ChangeDetectionStrategy.OnPush,
  templateUrl: './editar-procesos.html',
  styleUrl: './editar-procesos.css',
})
export class EditarProcesosTarjeta implements OnInit {
  private readonly route = inject(ActivatedRoute);
  private readonly router = inject(Router);
  private readonly procesosXTarjetaService = inject(ProcesosXTarjetaService);
  private readonly seguridadService = inject(SeguridadService);

  readonly tarjetaId = signal<number>(0);
  readonly procesos = signal<(ProcesosXTarjetaModel & { editando?: boolean })[]>([]);
  readonly usuarios = signal<UsuarioModel[]>([]);

  ngOnInit(): void {
    const id = Number(this.route.snapshot.paramMap.get('id'));
    if (!id) {
      this.router.navigate(['/parametros/tarjeta-produccion/listar-tarjeta-produccion']);
      return;
    }
    this.tarjetaId.set(id);
    this.cargarUsuarios();
    this.cargarProcesos();
  }

  private cargarUsuarios(): void {
    this.seguridadService.obtenerUsuarios().subscribe({
      next: (data) => this.usuarios.set(data),
      error: (err) => console.error('Error al cargar usuarios:', err),
    });
  }

  cargarProcesos(): void {
    this.procesosXTarjetaService.ListarPorTarjeta(this.tarjetaId()).subscribe({
      next: (data) => {
        this.procesos.set(data.map((p) => ({ ...p, editando: false })));
      },
      error: (err) => console.error('Error al cargar procesos:', err),
    });
  }

  activarEdicion(proceso: ProcesosXTarjetaModel & { editando?: boolean }): void {
    proceso.editando = true;
  }

  cancelarEdicion(proceso: ProcesosXTarjetaModel & { editando?: boolean }): void {
    proceso.editando = false;
    this.cargarProcesos();
  }

  actualizarProceso(proceso: ProcesosXTarjetaModel & { editando?: boolean }): void {
    if (!proceso.id) return;

    const datos: Partial<ProcesosXTarjetaModel> = {
      usuarioId: proceso.usuarioId,
      cantidad: proceso.cantidad,
      tiempo: proceso.tiempo,
    };

    this.procesosXTarjetaService.ActualizarProcesoXTarjeta(proceso.id, datos).subscribe({
      next: () => {
        proceso.editando = false;
        alert('Proceso actualizado correctamente.');
      },
      error: (err) => {
        console.error('Error al actualizar el proceso:', err);
        alert('Error al actualizar el proceso.');
      },
    });
  }

  volver(): void {
    this.router.navigate(['/parametros/tarjeta-produccion/listar-tarjeta-produccion']);
  }
}