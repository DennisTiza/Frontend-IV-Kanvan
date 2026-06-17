import { CommonModule } from '@angular/common';
import { ChangeDetectionStrategy, Component, Input, OnDestroy, OnInit, output, inject, signal } from '@angular/core';
import { Router } from '@angular/router';
import { ProcesoXTarjetaModel } from '../../../../../models/procesoXTarjeta.model';
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

  readonly tarjetaClick = output<TarjetaProduccionModel>();

  private readonly router = inject(Router);
  private timerInterval: ReturnType<typeof setInterval> | null = null;

  readonly tiempoRestante = signal('--:--:--');
  readonly progreso = signal(0);
  readonly nombreTimerProceso = signal('');

  ngOnInit(): void {
    const proceso = this.obtenerProcesoTimer();
    if (proceso) {
      this.nombreTimerProceso.set(proceso.proceso?.nombre ?? '');
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
    const procesoActivo = this.obtenerProcesoTimer();
    if (!procesoActivo?.fechaInicio || !procesoActivo?.tiempo) {
      return;
    }

    const inicio = new Date(procesoActivo.fechaInicio).getTime();
    const ahora = Date.now();
    const sesion = (ahora - inicio) / 1000;
    const consumidoTotal = (procesoActivo.tiempoConsumido ?? 0) + sesion;
    const restanteSeg = Math.max(0, (procesoActivo.tiempo * 60) - consumidoTotal);
    const restanteMs = restanteSeg * 1000;
    const pct = Math.min(100, Math.round((consumidoTotal / (procesoActivo.tiempo * 60)) * 100));

    const horas = Math.floor(restanteMs / 3600000);
    const minutos = Math.floor((restanteMs % 3600000) / 60000);
    const segundos = Math.floor((restanteMs % 60000) / 1000);

    this.tiempoRestante.set(
      `${String(horas).padStart(2, '0')}:${String(minutos).padStart(2, '0')}:${String(segundos).padStart(2, '0')}`
    );
    this.progreso.set(pct);
  }

  obtenerProcesoTimer(): ProcesoXTarjetaModel | undefined {
    const activos = this.tarjeta.procesoXTarjetas?.filter((p) => p.fechaInicio && !p.fechaFinal) ?? [];
    if (activos.length === 0) return undefined;
    return activos.reduce((ultimo, p) =>
      !ultimo || (p.fechaInicio! > ultimo.fechaInicio!) ? p : ultimo
    );
  }

  obtenerProcesosConAvance(): ProcesoXTarjetaModel[] {
    return this.tarjeta.procesoXTarjetas ?? [];
  }

  getEstadoBadgeClass(): string {
    const estado = this.tarjeta.estado;
    if (estado === 'por_hacer') return 'badge-pendiente';
    if (estado === 'en ejecución' || estado === 'en_proceso') return 'badge-en-proceso';
    if (estado === 'finalizada') return 'badge-finalizada';
    return '';
  }

  getEstadoLabel(): string {
    const estado = this.tarjeta.estado;
    if (estado === 'por_hacer') return 'Por hacer';
    if (estado === 'en ejecución' || estado === 'en_proceso') return 'En ejecución';
    if (estado === 'finalizada') return 'Finalizada';
    return estado ?? '';
  }

  obtenerNombreOperario(proceso?: ProcesoXTarjetaModel): string {
    const target = proceso;
    if (target?.operarioXProcesoXTarjetas && target.operarioXProcesoXTarjetas.length > 0) {
      return target.operarioXProcesoXTarjetas
        .map(rel => rel.operario ? `${rel.operario.nombre ?? ''} ${rel.operario.apellido ?? ''}`.trim() : '')
        .filter(name => name.length > 0)
        .join(', ') || 'Sin asignar';
    }
    return 'Sin asignar';
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

  obtenerFechaCierreUltimoProceso(): string | undefined {
    const procesos = this.tarjeta.procesoXTarjetas;
    if (!procesos || procesos.length === 0) return undefined;
    const procesosConFecha = procesos.filter((p) => p.fechaFinal);
    if (procesosConFecha.length === 0) return undefined;
    const sorted = [...procesosConFecha].sort((a, b) => (a.orden ?? 0) - (b.orden ?? 0));
    return sorted[sorted.length - 1].fechaFinal;
  }

  formatCierre(): string {
    const fecha = this.obtenerFechaCierreUltimoProceso() ?? this.tarjeta.fechaFinal;
    if (fecha) {
      const d = new Date(fecha);
      return `${String(d.getDate()).padStart(2, '0')}/${String(d.getMonth() + 1).padStart(2, '0')}/${d.getFullYear()} ${String(d.getHours()).padStart(2, '0')}:${String(d.getMinutes()).padStart(2, '0')}`;
    }
    return '--/--/---- --:--';
  }

  getTiempoConsumidoDisplay(p: ProcesoXTarjetaModel): string {
    const sesion = p.fechaInicio && !p.fechaFinal
      ? (Date.now() - new Date(p.fechaInicio).getTime()) / 1000
      : 0;
    const totalSeg = (p.tiempoConsumido ?? 0) + sesion;
    if (totalSeg <= 0) return '';
    const m = Math.floor(totalSeg / 60);
    const s = Math.floor(totalSeg % 60);
    return m > 0 ? `${m}m ${s}s` : `${s}s`;
  }

  getBarraPorcentaje(p: ProcesoXTarjetaModel): number {
    const total = p.cantidad ?? 1;
    const registrada = p.cantidadRegistrada ?? 0;
    if (total <= 0) return 0;
    return Math.min(100, Math.round((registrada / total) * 100));
  }

  estaCompleta(): boolean {
    return this.tarjeta.procesoXTarjetas?.every((p) => (p.cantidadRegistrada ?? 0) >= (p.cantidad ?? 0)) ?? false;
  }

  onClick(): void {
    if (this.estaCompleta()) {
      this.verResumen();
      return;
    }
    this.tarjetaClick.emit(this.tarjeta);
  }
}