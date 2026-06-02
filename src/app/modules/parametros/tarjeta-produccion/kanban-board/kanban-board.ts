import { CommonModule } from '@angular/common';
import { ChangeDetectionStrategy, Component, OnInit, inject, signal } from '@angular/core';
import { TarjetaProduccionModel } from '../../../../models/tarjeta-produccion.model';
import { TarjetaProduccionService } from '../../../../services/parametros/tarjeta-produccion.service';
import { ProcesoXtarjetaService } from '../../../../services/parametros/proceso-xtarjeta.service';
import { KanbanCardComponent } from './kanban-card/kanban-card';
import { DetalleTarjetaComponent } from './detalle-tarjeta/detalle-tarjeta';

@Component({
  selector: 'app-kanban-board',
  imports: [CommonModule, KanbanCardComponent, DetalleTarjetaComponent],
  changeDetection: ChangeDetectionStrategy.OnPush,
  templateUrl: './kanban-board.html',
  styleUrl: './kanban-board.css',
})
export class KanbanBoardComponent implements OnInit {
  private readonly tarjetaService = inject(TarjetaProduccionService);
  private readonly procesoXTarjetaService = inject(ProcesoXtarjetaService);

  readonly porHacer = signal<TarjetaProduccionModel[]>([]);
  readonly enEjecucion = signal<TarjetaProduccionModel[]>([]);
  readonly finalizadas = signal<TarjetaProduccionModel[]>([]);
  readonly tarjetaSeleccionada = signal<TarjetaProduccionModel | null>(null);

  ngOnInit(): void {
    this.cargarTarjetas();
  }

  cargarTarjetas(): void {
    this.tarjetaService.ListarTarjetasConProcesos().subscribe({
      next: (data) => {
        const tieneActivo = (t: TarjetaProduccionModel) =>
          t.procesoXTarjetas?.some((p) => p.fechaInicio && !p.fechaFinal);
        this.enEjecucion.set(data.filter((t) => tieneActivo(t)));
        this.finalizadas.set(data.filter((t) => t.estado === 'finalizada' && !tieneActivo(t)));
        this.porHacer.set(data.filter((t) => !tieneActivo(t) && t.estado !== 'finalizada'));
      },
      error: (err) => console.error('Error al cargar tarjetas Kanban:', err),
    });
  }

  abrirDetalle(tarjeta: TarjetaProduccionModel): void {
    this.tarjetaSeleccionada.set(tarjeta);
  }

  cerrarDetalle(): void {
    this.tarjetaSeleccionada.set(null);
  }

  manejarAccionProceso(evento: { tipo: 'iniciar' | 'finalizar'; procesoId: number }): void {
    const accion = evento.tipo === 'iniciar'
      ? this.procesoXTarjetaService.IniciarProceso(evento.procesoId)
      : this.procesoXTarjetaService.FinalizarProceso(evento.procesoId);

    accion.subscribe({
      next: () => {
        this.cerrarDetalle();
        this.cargarTarjetas();
      },
      error: (err) => console.error(`Error al ${evento.tipo} proceso:`, err),
    });
  }
}