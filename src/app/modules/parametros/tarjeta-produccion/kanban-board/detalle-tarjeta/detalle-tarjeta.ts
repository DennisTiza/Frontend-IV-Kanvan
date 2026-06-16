import { CommonModule } from '@angular/common';
import { ChangeDetectionStrategy, Component, OnDestroy, OnInit, inject, input, output, signal } from '@angular/core';
import { ProcesoXTarjetaModel } from '../../../../../models/procesoXTarjeta.model';
import { TarjetaProduccionModel } from '../../../../../models/tarjeta-produccion.model';
import { ParadaModel } from '../../../../../models/parada.model';
import { CodigoDeParadaModel } from '../../../../../models/codigoDeParada.model';
import { CodigoDeParadaService } from '../../../../../services/parametros/codigo-de-parada.service';
import { ProcesoXtarjetaService } from '../../../../../services/parametros/proceso-xtarjeta.service';

@Component({
  selector: 'app-detalle-tarjeta',
  standalone: true,
  imports: [CommonModule],
  changeDetection: ChangeDetectionStrategy.OnPush,
  templateUrl: './detalle-tarjeta.html',
  styleUrl: './detalle-tarjeta.css',
})
export class DetalleTarjetaComponent implements OnInit, OnDestroy {
  private readonly codigoDeParadaService = inject(CodigoDeParadaService);
  readonly procesoXTarjetaService = inject(ProcesoXtarjetaService);

  readonly tarjeta = input.required<TarjetaProduccionModel>();

  readonly cerrar = output<void>();
  readonly procesoAccion = output<{
    tipo: 'iniciar' | 'finalizar' | 'registrar-parada';
    procesoId: number;
    cantidadReportada?: number;
    codigoDeParadaId?: number;
  }>();

  readonly codigosDeParada = signal<CodigoDeParadaModel[]>([]);
  readonly procesoExpandido = signal<number | null>(null);
  readonly paradasVisibles = signal<number | null>(null);
  readonly paradasMap = signal<Map<number, ParadaModel[]>>(new Map());
  readonly procesoInputs = signal<Map<number, number>>(new Map());
  readonly codigoSeleccionado = signal<number | null>(null);
  readonly guardando = signal(false);
  readonly mostrarModalLimite = signal(false);
  readonly tick = signal(0);
  private timerInterval: ReturnType<typeof setInterval> | null = null;

  ngOnInit(): void {
    this.codigoDeParadaService.ObtenerCodigosDeParada().subscribe({
      next: (codigos) => this.codigosDeParada.set(codigos),
      error: () => this.codigosDeParada.set([]),
    });
    this.initProcesoInputs();
    this.iniciarTimer();
  }

  ngOnDestroy(): void {
    this.limpiarTimer();
  }

  private initProcesoInputs(): void {
    const procesos = this.tarjeta().procesoXTarjetas ?? [];
    const map = new Map<number, number>();
    for (const p of procesos) {
      if (p.id != null) {
        map.set(p.id, p.cantidadRegistrada ?? 0);
      }
    }
    this.procesoInputs.set(map);
  }

  private iniciarTimer(): void {
    this.timerInterval = setInterval(() => {
      this.tick.update(t => t + 1);
    }, 1000);
  }

  private limpiarTimer(): void {
    if (this.timerInterval) {
      clearInterval(this.timerInterval);
      this.timerInterval = null;
    }
  }

  getTiempoRestanteDisplay(proceso: ProcesoXTarjetaModel): string {
    if (!proceso.fechaInicio || proceso.fechaFinal || !proceso.tiempo) {
      return '';
    }
    void this.tick();
    const inicio = new Date(proceso.fechaInicio).getTime();
    const ahora = Date.now();
    const sesion = (ahora - inicio) / 1000;
    const consumidoTotal = (proceso.tiempoConsumido ?? 0) + sesion;
    const restanteSeg = Math.max(0, (proceso.tiempo * 60) - consumidoTotal);
    const h = Math.floor(restanteSeg / 3600);
    const m = Math.floor((restanteSeg % 3600) / 60);
    const s = Math.floor(restanteSeg % 60);
    return `${String(h).padStart(2, '0')}:${String(m).padStart(2, '0')}:${String(s).padStart(2, '0')}`;
  }

  obtenerEstado(proceso: ProcesoXTarjetaModel): { texto: string; clase: string } {
    if (proceso.fechaFinal) return { texto: 'Completado', clase: 'estado-completado' };
    if (proceso.fechaInicio) return { texto: 'En curso', clase: 'estado-en-curso' };
    if ((proceso.cantidadRegistrada ?? 0) > 0) return { texto: 'Pausado', clase: 'estado-pausado' };
    return { texto: 'Pendiente', clase: 'estado-pendiente' };
  }

  getInputValue(procesoId: number): number {
    return this.procesoInputs().get(procesoId) ?? 0;
  }

  onInputChange(procesoId: number, event: Event): void {
    const value = parseInt((event.target as HTMLInputElement).value, 10);
    const proceso = this.tarjeta().procesoXTarjetas?.find(p => p.id === procesoId);
    if (proceso) {
      const maxPermitido = this.getMaxPermitido(proceso);
      if (value > maxPermitido) {
        this.mostrarModalLimite.set(true);
        (event.target as HTMLInputElement).value = String(this.getInputValue(procesoId));
        return;
      }
    }
    const map = new Map(this.procesoInputs());
    map.set(procesoId, isNaN(value) ? 0 : value);
    this.procesoInputs.set(map);
  }

  puedeIniciarReanudar(proceso: ProcesoXTarjetaModel): boolean {
    if (proceso.fechaFinal) return false;
    if (proceso.fechaInicio && !proceso.fechaFinal) return false;
    const total = proceso.cantidad ?? 0;
    const registrada = proceso.cantidadRegistrada ?? 0;
    if (total > 0 && registrada >= total) return false;
    return true;
  }

  puedeRegistrarParada(proceso: ProcesoXTarjetaModel): boolean {
    if (!this.esActivo(proceso)) return false;
    const input = this.getInputValue(proceso.id ?? 0);
    const maxPermitido = this.getMaxPermitido(proceso);
    return input > (proceso.cantidadRegistrada ?? 0) && input <= maxPermitido && input < (proceso.cantidad ?? 0);
  }

  puedeFinalizar(proceso: ProcesoXTarjetaModel): boolean {
    if (proceso.fechaFinal) return false;
    if (!proceso.fechaInicio) return false;
    const input = this.getInputValue(proceso.id ?? 0);
    return input === (proceso.cantidad ?? 0);
  }

  puedeAcceder(_proceso: ProcesoXTarjetaModel): boolean {
    return true;
  }

  esActivo(proceso: ProcesoXTarjetaModel): boolean {
    return !!(proceso.fechaInicio && !proceso.fechaFinal);
  }

  mostrarTooltipBloqueado(_proceso: ProcesoXTarjetaModel): string {
    return '';
  }

  getTextoBotonIniciar(proceso: ProcesoXTarjetaModel): string {
    if (!proceso.fechaFinal && (proceso.cantidadRegistrada ?? 0) > 0) {
      return '▶ Reanudar';
    }
    return '▶ Iniciar';
  }

  getTextoBotonIniciarCorto(proceso: ProcesoXTarjetaModel): string {
    if (!proceso.fechaFinal && (proceso.cantidadRegistrada ?? 0) > 0) {
      return 'Reanudar';
    }
    return 'Iniciar';
  }

  iniciarProceso(procesoId: number | undefined): void {
    if (procesoId != null) {
      this.procesoAccion.emit({ tipo: 'iniciar', procesoId });
    }
  }

  finalizarProceso(proceso: ProcesoXTarjetaModel): void {
    const id = proceso.id;
    if (!id) return;
    const cantidadRegistrada = proceso.cantidadRegistrada ?? 0;
    const input = this.getInputValue(id);
    const cantidadReportada = input - cantidadRegistrada;
    this.procesoAccion.emit({ tipo: 'finalizar', procesoId: id, cantidadReportada });
  }

  registrarParada(proceso: ProcesoXTarjetaModel): void {
    const id = proceso.id;
    if (!id) return;
    const codigoDeParadaId = this.codigoSeleccionado();
    if (!codigoDeParadaId) return;
    const cantidadRegistrada = proceso.cantidadRegistrada ?? 0;
    const input = this.getInputValue(id);
    const cantidadReportada = input - cantidadRegistrada;
    this.procesoAccion.emit({ tipo: 'registrar-parada', procesoId: id, cantidadReportada, codigoDeParadaId });
  }

  getDelta(proceso: ProcesoXTarjetaModel): number {
    const id = proceso.id ?? 0;
    const input = this.getInputValue(id);
    return input - (proceso.cantidadRegistrada ?? 0);
  }

  getMaxPermitido(proceso: ProcesoXTarjetaModel): number {
    const procesos = this.tarjeta().procesoXTarjetas ?? [];
    const idx = procesos.indexOf(proceso);
    if (idx <= 0) return proceso.cantidad ?? 0;
    const anterior = procesos[idx - 1];
    return Math.min(anterior.cantidadRegistrada ?? 0, proceso.cantidad ?? 0);
  }

  toggleExpandirParada(proceso: ProcesoXTarjetaModel): void {
    const id = proceso.id ?? 0;
    if (this.procesoExpandido() === id) {
      this.procesoExpandido.set(null);
      this.codigoSeleccionado.set(null);
    } else {
      this.procesoExpandido.set(id);
      this.codigoSeleccionado.set(null);
      this.paradasVisibles.set(null);
    }
  }

  toggleParadasVisibles(proceso: ProcesoXTarjetaModel): void {
    const id = proceso.id ?? 0;
    if (this.paradasVisibles() === id) {
      this.paradasVisibles.set(null);
    } else {
      this.paradasVisibles.set(id);
      this.procesoExpandido.set(null);
      if (!this.paradasMap().has(id)) {
        this.procesoXTarjetaService.ObtenerParadas(id).subscribe({
          next: (paradas) => {
            const map = new Map(this.paradasMap());
            map.set(id, paradas);
            this.paradasMap.set(map);
          },
          error: () => {
            const map = new Map(this.paradasMap());
            map.set(id, []);
            this.paradasMap.set(map);
          },
        });
      }
    }
  }

  getParadas(procesoId: number): ParadaModel[] {
    return this.paradasMap().get(procesoId) ?? [];
  }

  tieneParadas(proceso: ProcesoXTarjetaModel): boolean {
    if (proceso.fechaFinal) return false;
    return (proceso.cantidadRegistrada ?? 0) > 0;
  }

  obtenerNombresOperarios(proceso: ProcesoXTarjetaModel): string {
    if (proceso.operarioXProcesoXTarjetas && proceso.operarioXProcesoXTarjetas.length > 0) {
      return proceso.operarioXProcesoXTarjetas
        .map(rel => rel.operario ? `${rel.operario.nombre ?? ''} ${rel.operario.apellido ?? ''}`.trim() : '')
        .filter(name => name.length > 0)
        .join(', ') || 'Sin asignar';
    }
    return 'Sin asignar';
  }

  getTiempoConsumidoDisplay(proceso: ProcesoXTarjetaModel): string {
    const sesion = proceso.fechaInicio && !proceso.fechaFinal
      ? (Date.now() - new Date(proceso.fechaInicio).getTime()) / 1000
      : 0;
    const totalSeg = (proceso.tiempoConsumido ?? 0) + sesion;
    if (totalSeg <= 0) return '';
    const m = Math.floor(totalSeg / 60);
    const s = Math.floor(totalSeg % 60);
    return m > 0 ? `${m}m ${s}s` : `${s}s`;
  }

  getBarraPorcentaje(proceso: ProcesoXTarjetaModel): number {
    const total = proceso.cantidad ?? 1;
    const registrada = proceso.cantidadRegistrada ?? 0;
    if (total <= 0) return 0;
    return Math.min(100, Math.round((registrada / total) * 100));
  }

  onCodigoSeleccionado(event: Event): void {
    const value = (event.target as HTMLSelectElement).value;
    this.codigoSeleccionado.set(value ? parseInt(value, 10) : null);
  }

  cerrarModal(): void {
    this.cerrar.emit();
  }
}
