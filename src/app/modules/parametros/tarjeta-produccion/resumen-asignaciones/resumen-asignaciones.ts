import { ChangeDetectionStrategy, Component, computed, input } from '@angular/core';
import { TarjetaProduccionModel } from '../../../../models/tarjeta-produccion.model';

interface DiaSemana {
  nombre: string;
  numero: number;
  cantidad: number;
  esHoy: boolean;
}

@Component({
  selector: 'app-resumen-asignaciones',
  imports: [],
  changeDetection: ChangeDetectionStrategy.OnPush,
  templateUrl: './resumen-asignaciones.html',
  styleUrl: './resumen-asignaciones.css',
})
export class ResumenAsignaciones {

  /** Lista de tarjetas recibida desde el componente padre */
  readonly tarjetas = input<TarjetaProduccionModel[]>([]);

  private readonly NOMBRES_DIAS = ['Dom', 'Lun', 'Mar', 'Mié', 'Jue', 'Vie', 'Sáb'];

  /** Días de la semana actual con conteo de tarjetas */
  readonly semana = computed<DiaSemana[]>(() => {
    const hoy = new Date();
    const inicio = new Date(hoy);
    inicio.setDate(hoy.getDate() - 1);

    return Array.from({ length: 7 }, (_, i) => {
      const fecha = new Date(inicio);
      fecha.setDate(inicio.getDate() + i);
      const esDomingo = fecha.getDay() === 0;
      const esSabado = fecha.getDay() === 6;
      return {
        nombre: this.NOMBRES_DIAS[fecha.getDay()],
        numero: fecha.getDate(),
        cantidad: this.contarTarjetasPorFecha(fecha),
        esHoy: fecha.toDateString() === hoy.toDateString(),
        esFinDeSemana: esSabado || esDomingo,
      };
    });
  });

  /** Etiqueta del mes y año actual, p.ej. "Junio 2026" */
  readonly mesAnio = computed(() => {
    const hoy = new Date();
    return hoy.toLocaleDateString('es-ES', { month: 'long', year: 'numeric' })
      .replace(/^\w/, (c) => c.toUpperCase());
  });

  /** Total de tarjetas del mes en curso */
  readonly totalTarjetas = computed(() => {
    const hoy = new Date();
    return this.tarjetas().filter((t) => {
      const fecha = this.obtenerFecha(t);
      return fecha && fecha.getMonth() === hoy.getMonth() && fecha.getFullYear() === hoy.getFullYear();
    }).length;
  });

  /** Tarjetas con estado "finalizada" del mes en curso */
  readonly tarjetasCompletadas = computed(() => {
    const hoy = new Date();
    return this.tarjetas().filter((t) => {
      const estado = t.estado?.toLowerCase().trim();
      const fecha = this.obtenerFecha(t);
      return estado === 'finalizada' &&
        fecha &&
        fecha.getMonth() === hoy.getMonth() &&
        fecha.getFullYear() === hoy.getFullYear();
    }).length;
  });

  // ── Helpers ─────────────────────────────────────────────────────────────────

  private contarTarjetasPorFecha(dia: Date): number {
    return this.tarjetas().filter((t) => {
      const fecha = this.obtenerFecha(t);
      return fecha && fecha.toDateString() === dia.toDateString();
    }).length;
  }

  private obtenerFecha(tarjeta: TarjetaProduccionModel): Date | null {
    const raw = tarjeta.fechaPlaneada ?? tarjeta.fechaInicio;
    if (!raw) return null;

    if (typeof raw === 'string') {
      const soloFecha = raw.split('T')[0].split(' ')[0];
      const partes = soloFecha.split('-').map(Number);
      if (partes.length === 3) {
        const d = new Date(partes[0], partes[1] - 1, partes[2]);
        return isNaN(d.getTime()) ? null : d;
      }
    }

    if (raw instanceof Date) {
      return isNaN(raw.getTime()) ? null : raw;
    }

    return null;
  }
}