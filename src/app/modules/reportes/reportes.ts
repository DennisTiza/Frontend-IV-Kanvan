import { CommonModule } from '@angular/common';
import { ChangeDetectionStrategy, Component, OnDestroy, OnInit, inject, signal } from '@angular/core';
import { Chart, registerables } from 'chart.js';
import {
  ReportesService,
  TotalPorDiaDto,
  PorOperarioDto,
  TiemposDto,
  ParadasDto,
} from '../../services/reportes.service';

Chart.register(...registerables);

type TabId = 'total-por-dia' | 'por-operario' | 'tiempos' | 'paradas';

interface TabConfig {
  id: TabId;
  label: string;
}

@Component({
  selector: 'app-reportes',
  imports: [CommonModule],
  changeDetection: ChangeDetectionStrategy.OnPush,
  templateUrl: './reportes.html',
  styleUrl: './reportes.css',
})
export class Reportes implements OnInit, OnDestroy {
  private readonly reportesService = inject(ReportesService);

  readonly tabs: TabConfig[] = [
    { id: 'total-por-dia', label: 'Total por Día' },
    { id: 'por-operario', label: 'Por Operario' },
    { id: 'tiempos', label: 'Tiempos' },
    { id: 'paradas', label: 'Paradas' },
  ];

  readonly tabActiva = signal<TabId>('total-por-dia');

  readonly totalPorDiaData = signal<TotalPorDiaDto[]>([]);
  readonly porOperarioData = signal<PorOperarioDto[]>([]);
  readonly tiemposData = signal<TiemposDto[]>([]);
  readonly paradasData = signal<ParadasDto[]>([]);

  private readonly datosCargados = signal<Record<TabId, boolean>>({
    'total-por-dia': false,
    'por-operario': false,
    'tiempos': false,
    'paradas': false,
  });

  readonly mostrarTabla = signal<Record<TabId, boolean>>({
    'total-por-dia': false,
    'por-operario': false,
    'tiempos': false,
    'paradas': false,
  });

  readonly errorAlCargar = signal<Record<TabId, string | null>>({
    'total-por-dia': null,
    'por-operario': null,
    'tiempos': null,
    'paradas': null,
  });

  private chartInstances: Record<string, Chart> = {};

  ngOnInit(): void {
    this.cargarDatos('total-por-dia');
  }

  ngOnDestroy(): void {
    this.destruirCharts();
  }

  seleccionarTab(tab: TabId): void {
    if (this.tabActiva() === tab) return;
    this.destruirChart(this.tabActiva());
    this.tabActiva.set(tab);
    if (!this.datosCargados()[tab]) {
      this.cargarDatos(tab);
    } else {
      this.programarInicializarChart(tab);
    }
  }

  alternarVista(tab: TabId): void {
    this.mostrarTabla.update((state) => ({
      ...state,
      [tab]: !state[tab],
    }));
    if (!this.mostrarTabla()[tab]) {
      this.programarInicializarChart(tab);
    }
  }

  private cargarDatos(tab: TabId): void {
    switch (tab) {
      case 'total-por-dia':
        this.reportesService.ObtenerTotalPorDia().subscribe({
          next: (data) => {
            this.totalPorDiaData.set(data);
            this.datosCargados.update((s) => ({ ...s, 'total-por-dia': true }));
            this.errorAlCargar.update((s) => ({ ...s, 'total-por-dia': null }));
            this.programarInicializarChart('total-por-dia');
          },
          error: (err) => {
            console.error('Error al cargar reporte total por día:', err);
            this.datosCargados.update((s) => ({ ...s, 'total-por-dia': true }));
            this.errorAlCargar.update((s) => ({ ...s, 'total-por-dia': 'No se pudieron cargar los datos de producción por día.' }));
          },
        });
        break;
      case 'por-operario':
        this.reportesService.ObtenerPorOperario().subscribe({
          next: (data) => {
            this.porOperarioData.set(data);
            this.datosCargados.update((s) => ({ ...s, 'por-operario': true }));
            this.errorAlCargar.update((s) => ({ ...s, 'por-operario': null }));
            this.programarInicializarChart('por-operario');
          },
          error: (err) => {
            console.error('Error al cargar reporte por operario:', err);
            this.datosCargados.update((s) => ({ ...s, 'por-operario': true }));
            this.errorAlCargar.update((s) => ({ ...s, 'por-operario': 'No se pudieron cargar los datos de producción por operario.' }));
          },
        });
        break;
      case 'tiempos':
        this.reportesService.ObtenerTiempos().subscribe({
          next: (data) => {
            this.tiemposData.set(data);
            this.datosCargados.update((s) => ({ ...s, tiempos: true }));
            this.errorAlCargar.update((s) => ({ ...s, tiempos: null }));
            this.programarInicializarChart('tiempos');
          },
          error: (err) => {
            console.error('Error al cargar reporte de tiempos:', err);
            this.datosCargados.update((s) => ({ ...s, tiempos: true }));
            this.errorAlCargar.update((s) => ({ ...s, tiempos: 'No se pudieron cargar los datos de comparación de tiempos.' }));
          },
        });
        break;
      case 'paradas':
        this.reportesService.ObtenerParadas().subscribe({
          next: (data) => {
            this.paradasData.set(data);
            this.datosCargados.update((s) => ({ ...s, paradas: true }));
            this.errorAlCargar.update((s) => ({ ...s, paradas: null }));
            this.programarInicializarChart('paradas');
          },
          error: (err) => {
            console.error('Error al cargar reporte de paradas:', err);
            this.datosCargados.update((s) => ({ ...s, paradas: true }));
            this.errorAlCargar.update((s) => ({ ...s, paradas: 'No se pudieron cargar los datos de paradas.' }));
          },
        });
        break;
    }
  }

  private programarInicializarChart(tab: TabId): void {
    setTimeout(() => {
      this.inicializarChart(tab);
    });
  }

  private inicializarChart(tab: TabId): void {
    this.destruirChart(tab);
    const canvas = document.getElementById(`chart-${tab}`) as HTMLCanvasElement;
    if (!canvas) return;

    switch (tab) {
      case 'total-por-dia':
        this.crearChartTotalPorDia(canvas);
        break;
      case 'por-operario':
        this.crearChartPorOperario(canvas);
        break;
      case 'tiempos':
        this.crearChartTiempos(canvas);
        break;
      case 'paradas':
        this.crearChartParadas(canvas);
        break;
    }
  }

  private crearChartTotalPorDia(canvas: HTMLCanvasElement): void {
    const data = this.totalPorDiaData();
    const chart = new Chart(canvas, {
      type: 'bar',
      data: {
        labels: data.map((d) => d.fecha),
        datasets: [
          {
            label: 'Total Producido',
            data: data.map((d) => d.totalProducido),
            backgroundColor: 'rgba(59, 130, 246, 0.7)',
            borderColor: 'rgba(59, 130, 246, 1)',
            borderWidth: 1,
          },
        ],
      },
      options: {
        responsive: true,
        plugins: {
          legend: { display: false },
        },
        scales: {
          y: {
            beginAtZero: true,
          },
        },
      },
    });
    this.chartInstances['total-por-dia'] = chart;
  }

  private crearChartPorOperario(canvas: HTMLCanvasElement): void {
    const data = this.porOperarioData();
    const procesos = [...new Set(data.map((d) => d.proceso))];
    const operarios = [...new Set(data.map((d) => d.operario))];
    const colores = ['rgba(59, 130, 246, 0.7)', 'rgba(16, 185, 129, 0.7)', 'rgba(245, 158, 11, 0.7)', 'rgba(239, 68, 68, 0.7)'];

    const datasets = procesos.map((proceso, i) => ({
      label: proceso,
      data: operarios.map((op) => {
        const item = data.find((d) => d.operario === op && d.proceso === proceso);
        return item ? item.totalProducido : 0;
      }),
      backgroundColor: colores[i % colores.length],
      borderColor: colores[i % colores.length].replace('0.7', '1'),
      borderWidth: 1,
    }));

    const chart = new Chart(canvas, {
      type: 'bar',
      data: {
        labels: operarios,
        datasets,
      },
      options: {
        responsive: true,
        scales: {
          y: { beginAtZero: true },
          x: { stacked: false },
        },
      },
    });
    this.chartInstances['por-operario'] = chart;
  }

  private crearChartTiempos(canvas: HTMLCanvasElement): void {
    const data = this.tiemposData();
    const chart = new Chart(canvas, {
      type: 'bar',
      data: {
        labels: data.map((d) => d.proceso),
        datasets: [
          {
            label: 'Tiempo Estándar',
            data: data.map((d) => d.tiempoEstandar),
            backgroundColor: 'rgba(59, 130, 246, 0.7)',
            borderColor: 'rgba(59, 130, 246, 1)',
            borderWidth: 1,
          },
          {
            label: 'Tiempo Real',
            data: data.map((d) => d.tiempoReal),
            backgroundColor: 'rgba(16, 185, 129, 0.7)',
            borderColor: 'rgba(16, 185, 129, 1)',
            borderWidth: 1,
          },
        ],
      },
      options: {
        responsive: true,
        scales: {
          y: { beginAtZero: true },
        },
      },
    });
    this.chartInstances['tiempos'] = chart;
  }

  private crearChartParadas(canvas: HTMLCanvasElement): void {
    const data = this.paradasData();
    const chart = new Chart(canvas, {
      type: 'bar',
      data: {
        labels: data.map((d) => `${d.codigo} - ${d.descripcion}`),
        datasets: [
          {
            label: 'Veces',
            data: data.map((d) => d.veces),
            backgroundColor: 'rgba(245, 158, 11, 0.7)',
            borderColor: 'rgba(245, 158, 11, 1)',
            borderWidth: 1,
            order: 1,
          },
          {
            label: 'Cantidad Perdida',
            data: data.map((d) => d.cantidadPerdida),
            backgroundColor: 'rgba(239, 68, 68, 0.7)',
            borderColor: 'rgba(239, 68, 68, 1)',
            borderWidth: 1,
            order: 2,
          },
        ],
      },
      options: {
        responsive: true,
        scales: {
          y: { beginAtZero: true },
        },
      },
    });
    this.chartInstances['paradas'] = chart;
  }

  private destruirChart(tab: TabId): void {
    if (this.chartInstances[tab]) {
      this.chartInstances[tab].destroy();
      delete this.chartInstances[tab];
    }
  }

  private destruirCharts(): void {
    Object.values(this.chartInstances).forEach((chart) => chart.destroy());
    this.chartInstances = {};
  }

  segundosAHHMMSS(segundos: number): string {
    const h = Math.floor(segundos / 3600);
    const m = Math.floor((segundos % 3600) / 60);
    const s = segundos % 60;
    return `${h.toString().padStart(2, '0')}:${m.toString().padStart(2, '0')}:${s.toString().padStart(2, '0')}`;
  }
}
