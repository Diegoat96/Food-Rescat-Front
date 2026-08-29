import { Component, EventEmitter, Input, Output, inject, signal } from '@angular/core';
import { Paquete } from '../../../../core/models/paquete.model';
import { EstadoBadgeComponent } from '../estado-badge/estado-badge.component';
import { ReservasService } from '../../../../core/services/reservas.service';
import { Reserva } from '../../../../core/models/reserva.model';
import { FavoritoButtonComponent } from '../favorito-button/favorito-button.component';

@Component({
  selector: 'app-paquete-card',
  standalone: true,
  imports: [EstadoBadgeComponent, FavoritoButtonComponent],
  templateUrl: './paquete-card.component.html',
  styleUrl: './paquete-card.component.css',
})
export class PaqueteCardComponent {
  @Input({ required: true }) paquete!: Paquete;
  @Output() reservaExitosa = new EventEmitter<Reserva>();

  private reservasService = inject(ReservasService);

  readonly reservando = signal(false);
  readonly errorReserva = signal<string | null>(null);

  onReservar(): void {
    if (this.reservando()) {
      return;
    }
    this.reservando.set(true);
    this.errorReserva.set(null);
    this.reservasService.reservar(this.paquete.id).subscribe({
      next: (res) => {
        this.reservando.set(false);
        this.reservaExitosa.emit(res.reserva ?? (res as unknown as Reserva));
      },
      error: () => {
        this.reservando.set(false);
        this.errorReserva.set('Este paquete ya no tiene stock disponible. Intenta con otro.');
      },
    });
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