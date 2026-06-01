import { CommonModule } from '@angular/common';
import { ChangeDetectionStrategy, Component, OnInit, inject, signal } from '@angular/core';
import { TarjetaProduccionModel } from '../../../../models/tarjeta-produccion.model';
import { TarjetaProduccionService } from '../../../../services/parametros/tarjeta-produccion.service';
import { KanbanCardComponent } from './kanban-card/kanban-card';

@Component({
  selector: 'app-kanban-board',
  imports: [CommonModule, KanbanCardComponent],
  changeDetection: ChangeDetectionStrategy.OnPush,
  templateUrl: './kanban-board.html',
  styleUrl: './kanban-board.css',
})
export class KanbanBoardComponent implements OnInit {
  private readonly tarjetaService = inject(TarjetaProduccionService);

  readonly porHacer = signal<TarjetaProduccionModel[]>([]);
  readonly enEjecucion = signal<TarjetaProduccionModel[]>([]);
  readonly finalizadas = signal<TarjetaProduccionModel[]>([]);

  ngOnInit(): void {
    this.cargarTarjetas();
  }

  cargarTarjetas(): void {
    this.tarjetaService.ListarTarjetas().subscribe({
      next: (data) => {
        this.porHacer.set(data.filter((t) => t.estado === 'por_hacer'));
        this.enEjecucion.set(data.filter((t) => t.estado === 'en ejecución'));
        this.finalizadas.set(data.filter((t) => t.estado === 'finalizada'));
      },
      error: (err) => console.error('Error al cargar tarjetas Kanban:', err),
    });
  }
}