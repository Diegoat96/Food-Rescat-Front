import { Component, EventEmitter, Input, Output, signal } from '@angular/core';
import { Paquete } from '../../../../core/models/paquete.model';
import { EstadoBadgeComponent } from '../estado-badge/estado-badge.component';

@Component({
  selector: 'app-paquete-card',
  standalone: true,
  imports: [EstadoBadgeComponent],
  templateUrl: './paquete-card.component.html',
  styleUrl: './paquete-card.component.css',
})
export class PaqueteCardComponent {
  @Input({ required: true }) paquete!: Paquete;
  @Output() reservar = new EventEmitter<Paquete>();

  readonly favorito = signal(false);

  toggleFavorito(): void {
    this.favorito.update((v) => !v);
  }

  onReservar(): void {
    this.reservar.emit(this.paquete);
  }

  emoji(): string {
    const nombre = this.paquete.categoria?.nombre?.toLowerCase() ?? '';
    if (nombre.includes('pan')) {
      return '🥖';
    }
    if (nombre.includes('bebida') || nombre.includes('caf')) {
      return '☕';
    }
    if (nombre.includes('fruta') || nombre.includes('verd')) {
      return '🥦';
    }
    if (nombre.includes('carne')) {
      return '🍗';
    }
    return '🍱';
  }

  horaLimite(): string {
    const fecha = new Date(this.paquete.horaLimiteRecogida);
    if (Number.isNaN(fecha.getTime())) {
      return 'pronto';
    }
    return fecha.toLocaleTimeString('es-GT', { hour: '2-digit', minute: '2-digit' });
  }
}
