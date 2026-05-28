import { CommonModule } from '@angular/common';
import { ChangeDetectionStrategy, Component, Input, OnDestroy, OnInit, inject, signal } from '@angular/core';
import { Router } from '@angular/router';
import { TarjetaProduccionModel } from '../../../../../models/tarjeta-produccion.model';

@Component({
  selector: 'app-kanban-card',
  imports: [CommonModule],
  changeDetection: ChangeDetectionStrategy.OnPush,
  templateUrl: './kanban-card.html',
  styleUrl: './kanban-card.css',
})
export class KanbanCardComponent implements OnInit, OnDestroy {
  @Input({ required: true }) tarjeta!: TarjetaProduccionModel;

  private readonly router = inject(Router);
  private timerInterval: ReturnType<typeof setInterval> | null = null;

  readonly tiempoRestante = signal('--:--:--');
  readonly progreso = signal(0);

  ngOnInit(): void {
    if (this.tarjeta.estado === 'en ejecución') {
      this.iniciarTemporizador();
    }
  }

  ngOnDestroy(): void {
    this.limpiarTemporizador();
  }

  private iniciarTemporizador(): void {
    this.actualizarTiempo();
    this.timerInterval = setInterval(() => this.actualizarTiempo(), 1000);
  }

  private limpiarTemporizador(): void {
    if (this.timerInterval) {
      clearInterval(this.timerInterval);
      this.timerInterval = null;
    }
  }

  private actualizarTiempo(): void {
    if (!this.tarjeta.fechaInicio || !this.tarjeta.cantidad) return;

    const inicio = new Date(this.tarjeta.fechaInicio).getTime();
    const ahora = Date.now();
    const estimadoMs = (this.tarjeta.cantidad || 0) * 60 * 1000;
    const transcurrido = ahora - inicio;
    const restante = Math.max(0, estimadoMs - transcurrido);
    const progreso = Math.min(100, Math.round((transcurrido / estimadoMs) * 100));

    const horas = Math.floor(restante / 3600000);
    const minutos = Math.floor((restante % 3600000) / 60000);
    const segundos = Math.floor((restante % 60000) / 1000);

    this.tiempoRestante.set(
      `${String(horas).padStart(2, '0')}:${String(minutos).padStart(2, '0')}:${String(segundos).padStart(2, '0')}`
    );
    this.progreso.set(progreso);
  }

  getTiempoEstimadoLabel(): string {
    if (!this.tarjeta.cantidad) return '--:--:--';
    const totalMin = this.tarjeta.cantidad;
    const h = Math.floor(totalMin / 60);
    const m = totalMin % 60;
    return `${String(h).padStart(2, '0')}:${String(m).padStart(2, '0')}:00`;
  }

  getEstadoBadgeClass(): string {
    const estado = this.tarjeta.estado;
    if (estado === 'por_hacer') return 'badge-pendiente';
    if (estado === 'en ejecución') return 'badge-en-proceso';
    if (estado === 'finalizada') return 'badge-finalizada';
    return '';
  }

  getEstadoLabel(): string {
    const estado = this.tarjeta.estado;
    if (estado === 'por_hacer') return 'Por hacer';
    if (estado === 'en ejecución') return 'En ejecución';
    if (estado === 'finalizada') return 'Finalizada';
    return estado ?? '';
  }

  obtenerNombreOperario(): string {
    if (this.tarjeta.procesoXTarjetas && this.tarjeta.procesoXTarjetas.length > 0) {
      const usuario = this.tarjeta.procesoXTarjetas[0].usuario;
      if (usuario) return `${usuario.nombre ?? ''} ${usuario.apellido ?? ''}`.trim();
    }
    return 'Sin asignar';
  }

  obtenerProcesoActual(): string {
    if (this.tarjeta.procesoXTarjetas && this.tarjeta.procesoXTarjetas.length > 0) {
      const proceso = this.tarjeta.procesoXTarjetas[0].proceso;
      return proceso?.nombre ?? 'Sin proceso';
    }
    return 'Sin proceso';
  }

  verDetalles(): void {
    if (this.tarjeta.id) {
      this.router.navigate([`/parametros/tarjeta-produccion/editar-procesos/${this.tarjeta.id}`]);
    }
  }

  verResumen(): void {
    if (this.tarjeta.id) {
      this.router.navigate([`/parametros/tarjeta-produccion/listar-tarjeta-produccion`]);
    }
  }

  getTimerColor(): string {
    const restante = this.tiempoRestante();
    if (restante === '00:00:00') return '';
    const partes = restante.split(':').map(Number);
    const totalMinutos = partes[0] * 60 + partes[1];
    if (totalMinutos < 10) return 'timer-urgente';
    return 'timer-normal';
  }

  getProgresoBarClass(): string {
    const p = this.progreso();
    if (p < 50) return 'progreso-baja';
    if (p < 80) return 'progreso-media';
    return 'progreso-alta';
  }

  formatCierre(): string {
    if (this.tarjeta.fechaFinal) {
      const d = new Date(this.tarjeta.fechaFinal);
      return `${String(d.getDate()).padStart(2, '0')}/${String(d.getMonth() + 1).padStart(2, '0')}/${d.getFullYear()} ${String(d.getHours()).padStart(2, '0')}:${String(d.getMinutes()).padStart(2, '0')}`;
    }
    return '--/--/---- --:--';
  }
}