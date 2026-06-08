import { CommonModule } from '@angular/common';
import { ChangeDetectionStrategy, Component, input, output } from '@angular/core';
import { ProcesoXTarjetaModel } from '../../../../../models/procesoXTarjeta.model';
import { TarjetaProduccionModel } from '../../../../../models/tarjeta-produccion.model';

@Component({
  selector: 'app-detalle-tarjeta',
  standalone: true,
  imports: [CommonModule],
  changeDetection: ChangeDetectionStrategy.OnPush,
  templateUrl: './detalle-tarjeta.html',
  styleUrl: './detalle-tarjeta.css',
})
export class DetalleTarjetaComponent {
  readonly tarjeta = input.required<TarjetaProduccionModel>();

  readonly cerrar = output<void>();
  readonly procesoAccion = output<{ tipo: 'iniciar' | 'finalizar'; procesoId: number }>();

  obtenerEstado(proceso: ProcesoXTarjetaModel): { texto: string; clase: string } {
    if (proceso.fechaFinal) return { texto: 'Completado', clase: 'estado-completado' };
    if (proceso.fechaInicio) return { texto: 'En curso', clase: 'estado-en-curso' };
    return { texto: 'Pendiente', clase: 'estado-pendiente' };
  }

  esProximoPendiente(proceso: ProcesoXTarjetaModel): boolean {
    const activo = this.tarjeta().procesoXTarjetas?.some((p) => p.fechaInicio && !p.fechaFinal);
    if (activo) return false;
    return !proceso.fechaInicio && proceso === this.tarjeta().procesoXTarjetas?.find((p) => !p.fechaInicio);
  }

  esActivo(proceso: ProcesoXTarjetaModel): boolean {
    return !!(proceso.fechaInicio && !proceso.fechaFinal);
  }

  puedeIniciar(proceso: ProcesoXTarjetaModel): boolean {
    return !proceso.fechaInicio && this.esProximoPendiente(proceso);
  }

  puedeFinalizar(proceso: ProcesoXTarjetaModel): boolean {
    return this.esActivo(proceso);
  }

  get nombreOperario(): string {
    return this.tarjeta().procesoXTarjetas
      ?.some((p) => p.operarioXProcesoXTarjetas && p.operarioXProcesoXTarjetas.length > 0)
      ? 'Operarios asignados' : 'Sin operarios asignados';
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

  iniciarProceso(procesoId: number | undefined): void {
    if (procesoId) {
      this.procesoAccion.emit({ tipo: 'iniciar', procesoId });
    }
  }

  finalizarProceso(procesoId: number | undefined): void {
    if (procesoId) {
      this.procesoAccion.emit({ tipo: 'finalizar', procesoId });
    }
  }

  cerrarModal(): void {
    this.cerrar.emit();
  }
}
