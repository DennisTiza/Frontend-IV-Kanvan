import { Component, EventEmitter, Input, Output } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ConfiguracionPaginacion } from '../../../config/configuracion.paginacion';

@Component({
  selector: 'app-paginador',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './paginador.html',
  styleUrls: ['./paginador.css']
})
export class Paginador {
  @Input() paginaActual: number = 1;
  @Input() totalRegistros: number = 0;
  @Input() registrosPorPagina: number = ConfiguracionPaginacion.registrosPorPagina;
  @Input() nombreEntidad: string = 'registros';

  @Output() cambioPagina = new EventEmitter<number>();

  get totalPaginas(): number {
    return Math.ceil(this.totalRegistros / this.registrosPorPagina);
  }

  get registrosMostrados(): number {
    return Math.min(this.paginaActual * this.registrosPorPagina, this.totalRegistros);
  }

  get inicioRegistro(): number {
    if (this.totalRegistros === 0) return 0;
    return (this.paginaActual - 1) * this.registrosPorPagina + 1;
  }

  irPagina(pagina: number): void {
    if (pagina >= 1 && pagina <= this.totalPaginas && pagina !== this.paginaActual) {
      this.cambioPagina.emit(pagina);
    }
  }
}
