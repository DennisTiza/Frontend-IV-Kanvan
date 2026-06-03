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

  ngOnInit(): void {
    const proceso = this.obtenerProcesoActivo();
    if (proceso) {
      console.log(`[Timer] Iniciado | procesoId: ${proceso.id}, tarjetaId: ${this.tarjeta.id}, codigo: ${this.tarjeta.codigo}`);
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
    const procesoActivo = this.obtenerProcesoActivo();
    if (!procesoActivo?.fechaInicio || !procesoActivo?.tiempo) {
      console.log('[Timer] Retorno temprano', {
        existeProceso: !!procesoActivo,
        fechaInicio: procesoActivo?.fechaInicio,
        tiempo: procesoActivo?.tiempo,
        tarjetaId: this.tarjeta.id,
      });
      return;
    }

    const inicio = new Date(procesoActivo.fechaInicio).getTime();
    const ahora = Date.now();
    const estimadoMs = procesoActivo.tiempo * 60 * 1000;
    const transcurrido = ahora - inicio;
    const restante = Math.max(0, estimadoMs - transcurrido);
    const progreso = Math.min(100, Math.round((restante / estimadoMs) * 100));

    console.log('[Timer] actualizarTiempo', {
      tarjetaId: this.tarjeta.id,
      procesoId: procesoActivo.id,
      tiempo: procesoActivo.tiempo,
      fechaInicio: procesoActivo.fechaInicio,
      inicio,
      ahora,
      estimadoMs,
      transcurrido,
      restante,
      progreso,
    });

    const horas = Math.floor(restante / 3600000);
    const minutos = Math.floor((restante % 3600000) / 60000);
    const segundos = Math.floor((restante % 60000) / 1000);

    this.tiempoRestante.set(
      `${String(horas).padStart(2, '0')}:${String(minutos).padStart(2, '0')}:${String(segundos).padStart(2, '0')}`
    );
    this.progreso.set(progreso);
  }

  getTiempoEstimadoLabel(): string {
    const procesoActivo = this.obtenerProcesoActivo();
    if (!procesoActivo?.tiempo) return '--:--:--';
    const totalMin = procesoActivo.tiempo;
    const h = Math.floor(totalMin / 60);
    const m = totalMin % 60;
    return `${String(h).padStart(2, '0')}:${String(m).padStart(2, '0')}:00`;
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

  obtenerProximoProceso(): ProcesoXTarjetaModel | undefined {
    if (this.obtenerProcesoActivo()) return undefined;
    return this.tarjeta.procesoXTarjetas?.find((p) => !p.fechaInicio);
  }

  obtenerProcesoActivo(): ProcesoXTarjetaModel | undefined {
    return this.tarjeta.procesoXTarjetas?.find((p) => p.fechaInicio && !p.fechaFinal);
  }

  obtenerTiempoTotal(): number {
    return this.tarjeta.procesoXTarjetas?.reduce((sum, p) => sum + (p.tiempo ?? 0), 0) ?? 0;
  }

  obtenerNombreOperario(): string {
    const proximo = this.obtenerProximoProceso();
    const activo = this.obtenerProcesoActivo();
    const target = proximo ?? activo;
    if (target?.operario) {
      return `${target.operario.nombre ?? ''} ${target.operario.apellido ?? ''}`.trim();
    }
    return 'Sin asignar';
  }

  obtenerProcesoActual(): string {
    const activo = this.obtenerProcesoActivo();
    if (activo?.proceso) return activo.proceso.nombre ?? 'Sin proceso';
    const proximo = this.obtenerProximoProceso();
    if (proximo?.proceso) return proximo.proceso.nombre ?? 'Sin proceso';
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
    if (p > 80) return 'progreso-verde';
    if (p > 50) return 'progreso-naranja';
    return 'progreso-rojo';
  }

  obtenerProcesoActivoNumero(): number {
    const activo = this.obtenerProcesoActivo();
    if (!activo || !this.tarjeta.procesoXTarjetas) return 0;
    return this.tarjeta.procesoXTarjetas.indexOf(activo) + 1;
  }

  obtenerFechaCierreUltimoProceso(): string | undefined {
    const procesos = this.tarjeta.procesoXTarjetas;
    if (!procesos || procesos.length === 0) return undefined;

    const procesosConFecha = procesos.filter((p) => p.fechaFinal);
    if (procesosConFecha.length === 0) return undefined;

    // Ordenar por el campo 'orden' ascendente y tomar el último
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

  onClick(): void {
    if (!this.obtenerProcesoActivo() && !this.obtenerProximoProceso() && this.tarjeta.estado === 'finalizada') {
      this.verResumen();
      return;
    }
    this.tarjetaClick.emit(this.tarjeta);
  }
}